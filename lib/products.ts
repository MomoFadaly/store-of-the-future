import "server-only";

export interface AmazonProductInfo {
  image_url: string | null;
  asin: string | null;
}

const EMPTY: AmazonProductInfo = { image_url: null, asin: null };

// In-memory cache keyed by `brand name`. Only cache successful results so
// transient Amazon throttling on one request doesn't permanently poison the
// cache.
const cache = new Map<string, AmazonProductInfo>();

const USER_AGENTS = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
];

function buildHeaders(): Record<string, string> {
  return {
    "User-Agent": USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "no-cache",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
  };
}

// Match a result block: data-asin attribute, then s-search-result marker,
// then the first product image within ~8KB of HTML. Both captures come from
// the same product card.
const COMBINED_REGEX =
  /data-asin="([A-Z0-9]{10})"[^>]+data-component-type="s-search-result"[\s\S]{0,8000}?<img[^>]+class="[^"]*\bs-image\b[^"]*"[^>]+src="(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+\.(?:jpg|png|webp))"/i;

// Image-only fallback when ASIN extraction fails but image exists.
const IMG_ONLY_REGEX =
  /<img[^>]+class="[^"]*\bs-image\b[^"]*"[^>]+src="(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+\.(?:jpg|png|webp))"/i;

// ASIN-only fallback.
const ASIN_ONLY_REGEX =
  /data-asin="([A-Z0-9]{10})"[^>]+data-component-type="s-search-result"/i;

// Walmart product CDN image. Their search result HTML has product images under
// the /asr/ path with descriptive slugs in the URL. Skip the static UI asset
// at /dfw/4ff9c6c9-ad46/ which repeats across all search pages.
const WALMART_IMG_REGEX =
  /https:\/\/i5\.walmartimages\.com\/asr\/[^"\s]+\.(?:jpeg|jpg|png|webp)/gi;

async function fetchWalmartImage(query: string): Promise<string | null> {
  const url = `https://www.walmart.com/search?q=${encodeURIComponent(query)}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, {
      headers: buildHeaders(),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const html = await res.text();
    // Match all /asr/ images, pick the first one. Walmart's first result
    // image is typically the most relevant for the query.
    const matches = html.match(WALMART_IMG_REGEX);
    if (!matches?.length) return null;
    // Filter: prefer images whose slug contains at least one query word
    // (4+ letters) so we don't show a wildly off-target product.
    const queryWords = query
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length >= 4);
    if (queryWords.length > 0) {
      const targeted = matches.find((m) => {
        const lower = m.toLowerCase();
        return queryWords.some((w) => lower.includes(w));
      });
      if (targeted) return targeted;
    }
    return matches[0];
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function searchOnce(query: string): Promise<AmazonProductInfo> {
  const url = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      headers: buildHeaders(),
      signal: controller.signal,
    });
    if (!res.ok) return EMPTY;

    const html = await res.text();

    // Detect Amazon's anti-bot meta-refresh stub. When throttled, Amazon
    // serves a tiny HTML page (~2KB) with `<meta http-equiv="refresh">`
    // instead of the actual search results. Treat as failure so retries fire.
    if (html.length < 6000 && /http-equiv\s*=\s*["']refresh["']/i.test(html)) {
      return EMPTY;
    }

    const combined = html.match(COMBINED_REGEX);
    if (combined?.[1] && combined?.[2]) {
      return { asin: combined[1], image_url: combined[2] };
    }

    const imgOnly = html.match(IMG_ONLY_REGEX);
    const asinOnly = html.match(ASIN_ONLY_REGEX);
    return {
      asin: asinOnly?.[1] ?? null,
      image_url: imgOnly?.[1] ?? null,
    };
  } catch {
    return EMPTY;
  } finally {
    clearTimeout(timeout);
  }
}

// Boost image resolution: Amazon's URL pattern uses _AC_UL320_ for 320px.
// Swapping to _AC_UL640_ gives 2x resolution with no extra fetch cost.
function upscaleImageUrl(url: string | null): string | null {
  if (!url) return null;
  return url.replace(/\._AC_UL\d+_/, "._AC_UL640_");
}

export async function fetchProductInfo(
  brand: string,
  name: string
): Promise<AmazonProductInfo> {
  const baseQuery = `${brand} ${name}`.trim().slice(0, 120);
  if (!baseQuery) return EMPTY;

  const cached = cache.get(baseQuery);
  if (cached && (cached.image_url || cached.asin)) return cached;

  const queriesToTry: string[] = [baseQuery];

  // Fallback 1: strip parenthetical content (sizes/colors that confuse search).
  const withoutParens = baseQuery.replace(/\s*\([^)]*\)/g, "").trim();
  if (withoutParens && withoutParens !== baseQuery) queriesToTry.push(withoutParens);

  // Fallback 2: brand + first 2 words of product name.
  const firstWords = name.trim().split(/\s+/).slice(0, 2).join(" ");
  const shortQuery = `${brand} ${firstWords}`.trim();
  if (shortQuery && shortQuery !== baseQuery && shortQuery !== withoutParens) {
    queriesToTry.push(shortQuery);
  }

  // Fallback 3: just the brand name (last resort — image will be on-brand
  // even if not the specific product).
  if (brand.trim()) queriesToTry.push(brand.trim());

  let result: AmazonProductInfo = EMPTY;

  for (let i = 0; i < queriesToTry.length; i++) {
    const q = queriesToTry[i];
    if (i > 0) {
      // Backoff between retries so Amazon doesn't see them as a burst.
      await new Promise((r) =>
        setTimeout(r, 500 + i * 300 + Math.random() * 400)
      );
    } else {
      // Initial jitter so parallel calls don't all hit Amazon at the same ms.
      await new Promise((r) => setTimeout(r, Math.random() * 400));
    }

    const partial = await searchOnce(q);
    // Merge — keep whatever we already have, fill in missing.
    result = {
      asin: result.asin ?? partial.asin,
      image_url: result.image_url ?? partial.image_url,
    };

    if (result.asin && result.image_url) break;
  }

  // If Amazon couldn't give us an image (likely throttled), fall back to
  // Walmart for the image. ASIN stays null — the affiliate URL will be a
  // search link in that case.
  if (!result.image_url) {
    await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));
    const walmartImg = await fetchWalmartImage(baseQuery);
    if (walmartImg) result = { ...result, image_url: walmartImg };
  }

  // Upscale the Amazon image URL for sharper cards (no-op for Walmart URLs).
  result = { ...result, image_url: upscaleImageUrl(result.image_url) };

  if (result.image_url || result.asin) cache.set(baseQuery, result);
  return result;
}
