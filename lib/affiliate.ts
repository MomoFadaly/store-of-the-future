const TAG = process.env.AMAZON_AFFILIATE_TAG ?? "REPLACE-WITH-YOUR-TAG-20";

// Build an Amazon affiliate URL. Prefers direct-product (/dp/ASIN) links —
// those earn the full category commission rate (typically 3-4%). Falls back
// to keyword search when we couldn't resolve an ASIN (Amazon's anti-bot
// blocked us, or no matching result) — that earns the lower 1-1.5% rate.
export function affiliateUrlFor(
  brand: string,
  name: string,
  asin: string | null | undefined
): string {
  if (asin) {
    return `https://www.amazon.com/dp/${asin}?tag=${TAG}`;
  }
  const query = encodeURIComponent(`${brand} ${name}`.trim());
  return `https://www.amazon.com/s?k=${query}&tag=${TAG}`;
}

// Legacy export kept for any caller that hasn't been updated. New code
// should call `affiliateUrlFor(brand, name, asin)`.
export function affiliateSearchUrl(brand: string, name: string): string {
  return affiliateUrlFor(brand, name, null);
}
