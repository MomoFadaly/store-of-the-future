// Only attach the tag when it's a real Associates ID — never ship the
// placeholder to users (it would show as `?tag=REPLACE-WITH-YOUR-TAG-20`
// in the browser, an obvious "demo not finished" tell).
const RAW_TAG = process.env.AMAZON_AFFILIATE_TAG;
const TAG =
  RAW_TAG && RAW_TAG !== "REPLACE-WITH-YOUR-TAG-20" && RAW_TAG.trim().length > 0
    ? RAW_TAG.trim()
    : null;

// Build an Amazon affiliate URL. Prefers direct-product (/dp/ASIN) links —
// those earn the full category commission rate (typically 3-4%). Falls back
// to keyword search when we couldn't resolve an ASIN (Amazon's anti-bot
// blocked us, or no matching result) — that earns the lower 1-1.5% rate.
export function affiliateUrlFor(
  brand: string,
  name: string,
  asin: string | null | undefined
): string {
  const tagSuffix = TAG ? `?tag=${TAG}` : "";
  if (asin) {
    return `https://www.amazon.com/dp/${asin}${tagSuffix}`;
  }
  const query = encodeURIComponent(`${brand} ${name}`.trim());
  const sep = tagSuffix ? "&" : "";
  return `https://www.amazon.com/s?k=${query}${sep}${TAG ? `tag=${TAG}` : ""}`;
}

/**
 * Sanitize a URL that may already have the placeholder tag baked in
 * (e.g. cached example JSON). Keeps the real tag if set, strips placeholder
 * if not. Used by the example loader to clean fixtures at runtime.
 */
export function sanitizeAffiliateUrl(url: string): string {
  if (!url) return url;
  // Strip the placeholder tag query param entirely
  const cleaned = url
    .replace(/[?&]tag=REPLACE-WITH-YOUR-TAG-20/g, "")
    // Cleanup: if removing the tag left a dangling ? or && fix it
    .replace(/\?$/, "")
    .replace(/&&/g, "&")
    .replace(/\?&/, "?");
  if (TAG && !cleaned.includes(`tag=`)) {
    const sep = cleaned.includes("?") ? "&" : "?";
    return `${cleaned}${sep}tag=${TAG}`;
  }
  return cleaned;
}

// Legacy export kept for any caller that hasn't been updated. New code
// should call `affiliateUrlFor(brand, name, asin)`.
export function affiliateSearchUrl(brand: string, name: string): string {
  return affiliateUrlFor(brand, name, null);
}
