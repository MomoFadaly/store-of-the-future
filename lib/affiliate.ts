// Only attach the tag when it's a real Associates ID — never ship the
// placeholder to users (it would show as `?tag=REPLACE-WITH-YOUR-TAG-20`
// in the browser, an obvious "demo not finished" tell).
const RAW_TAG = process.env.AMAZON_AFFILIATE_TAG;
const TAG =
  RAW_TAG && RAW_TAG !== "REPLACE-WITH-YOUR-TAG-20" && RAW_TAG.trim().length > 0
    ? RAW_TAG.trim()
    : null;

// ─── Brand-direct + specialty retailer routing ──────────────────────────
//
// Some brands are best bought direct (warranty, freshness, price) — others
// are best bought from a specialty retailer who actually stocks them.
// When the model picks one of these brands and we don't have a confirmed
// Amazon ASIN, we generate the brand-direct or specialty URL instead of
// falling through to a generic Amazon search.

// Brands that sell direct + are usually the best/cheapest path to buy.
// Maps brand-name (case-insensitive) → URL builder taking the product name.
const BRAND_DIRECT: Record<string, (name: string) => string> = {
  ikea: (n) => `https://www.ikea.com/us/en/search/?q=${encodeURIComponent(n)}`,
  muji: (n) => `https://www.muji.us/search?q=${encodeURIComponent(n)}`,
  patagonia: (n) => `https://www.patagonia.com/search/?q=${encodeURIComponent(n)}`,
  vitsoe: () => `https://www.vitsoe.com/us/606`,
  apple: (n) => `https://www.apple.com/us/search/${encodeURIComponent(n)}`,
  ridge: (n) => `https://ridge.com/search?q=${encodeURIComponent(n)}`,
  away: (n) => `https://www.awaytravel.com/search?q=${encodeURIComponent(n)}`,
  bose: (n) => `https://www.bose.com/c/search?q=${encodeURIComponent(n)}`,
  yeti: (n) => `https://www.yeti.com/search?q=${encodeURIComponent(n)}`,
  hydroflask: (n) => `https://www.hydroflask.com/search?q=${encodeURIComponent(n)}`,
  arcteryx: (n) => `https://arcteryx.com/us/en/search?q=${encodeURIComponent(n)}`,
  "arc'teryx": (n) => `https://arcteryx.com/us/en/search?q=${encodeURIComponent(n)}`,
  ridgewallet: (n) => `https://ridge.com/search?q=${encodeURIComponent(n)}`,
  vivobarefoot: (n) => `https://www.vivobarefoot.com/us/search?q=${encodeURIComponent(n)}`,
  allbirds: (n) => `https://www.allbirds.com/collections/all?q=${encodeURIComponent(n)}`,
  hokaoneone: (n) => `https://www.hoka.com/en/us/search?q=${encodeURIComponent(n)}`,
  hoka: (n) => `https://www.hoka.com/en/us/search?q=${encodeURIComponent(n)}`,
  brooks: (n) => `https://www.brooksrunning.com/en_us/search?q=${encodeURIComponent(n)}`,
  saucony: (n) => `https://www.saucony.com/en/search?q=${encodeURIComponent(n)}`,
  oakley: (n) => `https://www.oakley.com/en-us/search?q=${encodeURIComponent(n)}`,
  oneill: (n) => `https://www.oneill.com/search?q=${encodeURIComponent(n)}`,
};

// Brand-aware specialty routing — when the model picks a brand that's
// definitively in a specialty category (Therm-a-Rest = outdoor, Breville =
// espresso, Fender = music), route to the specialty retailer regardless
// of the product name. This catches the case where model returns a model
// number ("NeoAir XLite NXT") that contains no category keywords.
const SPECIALTY_BY_BRAND: Record<string, { url: (q: string) => string; name: string }> = {
  // Outdoor / camping / hiking → REI
  ...Object.fromEntries(
    [
      "thermarest", "therm-a-rest", "jetboil", "msr", "bigagnes", "kelty",
      "sawyer", "nemo", "osprey", "gregory", "marmot", "blackdiamond",
      "reicoop", "rei", "mountainhardwear", "outdoorresearch", "smartwool",
      "darntough", "salomon", "lasportiva", "scarpa", "merrell",
    ].map((b) => [b, { url: (q: string) => `https://www.rei.com/search?q=${encodeURIComponent(q)}`, name: "REI" }])
  ),
  // Espresso / coffee → Seattle Coffee Gear
  ...Object.fromEntries(
    [
      "breville", "baratza", "rancilio", "lamarzocco", "lelit", "profitec",
      "niche", "nichezero", "fellow", "acaia", "normcore", "rhinowares",
      "ecm", "rocket", "gaggia", "ascaso", "decent", "comandante",
      "1zpresso", "wilfa", "ode", "varia",
    ].map((b) => [b, { url: (q: string) => `https://www.seattlecoffeegear.com/search?q=${encodeURIComponent(q)}`, name: "Seattle Coffee Gear" }])
  ),
  // Music / instruments → Sweetwater
  ...Object.fromEntries(
    [
      "fender", "gibson", "epiphone", "martin", "taylor", "prs", "ibanez",
      "gretsch", "yamaha", "casio", "roland", "korg", "moog", "arturia",
      "novation", "akai", "elektron", "shure", "sennheiser", "audiotechnica",
      "neumann", "rode", "behringer", "focusrite", "universalaudio", "ssl",
      "presonus", "midi", "boss", "linesix", "marshall", "vox", "blackstar",
    ].map((b) => [b, { url: (q: string) => `https://www.sweetwater.com/store/search.php?s=${encodeURIComponent(q)}`, name: "Sweetwater" }])
  ),
  // Cookware / kitchen → Williams-Sonoma
  ...Object.fromEntries(
    [
      "lecreuset", "staub", "lodge", "allclad", "mauviel", "demeyere",
      "scanpan", "shun", "wusthof", "global", "miyabi", "zwilling",
      "vitamix", "breville", "kitchenaid", "smeg", "delonghi",
      "johnboos", "epicurean",
    ].map((b) => [b, { url: (q: string) => `https://www.williams-sonoma.com/search/results.html?words=${encodeURIComponent(q)}`, name: "Williams Sonoma" }])
  ),
  // Beauty / skincare → Sephora
  ...Object.fromEntries(
    [
      "drunkelephant", "theordinary", "laroche-posay", "larocheposay",
      "skinceuticals", "paulaschoice", "tatcha", "fenty", "rare",
      "fentybeauty", "rarebeauty", "ilia", "kosas", "glossier",
      "sundayriley", "augustinusbader", "biossance",
    ].map((b) => [b, { url: (q: string) => `https://www.sephora.com/search?keyword=${encodeURIComponent(q)}`, name: "Sephora" }])
  ),
  // Furniture / home → West Elm
  ...Object.fromEntries(
    [
      "westelm", "potterybarn", "crateandbarrel", "crateandbarrelkids",
      "cb2", "rejuvenation",
    ].map((b) => [b, { url: (q: string) => `https://www.westelm.com/search/results.html?words=${encodeURIComponent(q)}`, name: "West Elm" }])
  ),
};

// Category-aware specialty retailers — fall back here when brand-direct
// AND brand-specialty don't apply. The product type (inferred from name
// keywords) picks the best specialty retailer for that category.
const SPECIALTY_BY_KEYWORD: Array<{ keywords: RegExp; url: (q: string) => string; name: string }> = [
  // Outdoor / camping / hiking gear → REI
  { keywords: /\b(tent|backpack|sleeping bag|sleeping pad|stove|water filter|trekking|hiking|climbing|crampons|harness|carabiner|bear canister|kayak|ski|snowboard)\b/i,
    url: (q) => `https://www.rei.com/search?q=${encodeURIComponent(q)}`, name: 'REI' },
  // Fly fishing / fishing → Bass Pro / Cabela's
  { keywords: /\b(rod|reel|fly|tackle|lure|bait)\b/i,
    url: (q) => `https://www.basspro.com/shop/en/search?q=${encodeURIComponent(q)}`, name: 'Bass Pro' },
  // Coffee / espresso gear → Seattle Coffee Gear
  { keywords: /\b(espresso|grinder|moka|chemex|aeropress|pour.?over|burr|portafilter)\b/i,
    url: (q) => `https://www.seattlecoffeegear.com/search?q=${encodeURIComponent(q)}`, name: 'Seattle Coffee Gear' },
  // Kitchen / cookware → Williams-Sonoma
  { keywords: /\b(dutch oven|cast iron|skillet|saucepan|stockpot|knife set|cutting board|stand mixer|food processor)\b/i,
    url: (q) => `https://www.williams-sonoma.com/search/results.html?words=${encodeURIComponent(q)}`, name: 'Williams Sonoma' },
  // Music / instruments → Sweetwater
  { keywords: /\b(guitar|bass|amp|amplifier|synth|midi|microphone|monitor|interface|keyboard)\b/i,
    url: (q) => `https://www.sweetwater.com/store/search.php?s=${encodeURIComponent(q)}`, name: 'Sweetwater' },
  // Beauty / skincare → Sephora
  { keywords: /\b(serum|moisturizer|cleanser|sunscreen|spf|retinol|toner|exfoliant|cushion)\b/i,
    url: (q) => `https://www.sephora.com/search?keyword=${encodeURIComponent(q)}`, name: 'Sephora' },
  // Furniture / home → West Elm
  { keywords: /\b(sofa|couch|armchair|dining table|bookshelf|bed frame|mattress|nightstand|dresser|rug)\b/i,
    url: (q) => `https://www.westelm.com/search/results.html?words=${encodeURIComponent(q)}`, name: 'West Elm' },
];

// Build a real product URL.
// Priority:
//   1. Brand-direct (these brands sell direct + are usually best path to buy)
//   2. Brand-specialty (the brand IS the category signal — Therm-a-Rest → REI,
//      Breville → Seattle Coffee Gear, Fender → Sweetwater, etc.)
//   3. Specialty retailer matched by product-type keywords (REI for outdoor,
//      Williams-Sonoma for cookware, Seattle Coffee Gear for espresso, etc.)
//   4. Confirmed Amazon ASIN (direct product page on Amazon)
//   5. Amazon keyword search (last resort)
//
// Specialty/brand routing wins over Amazon ASIN even when both exist —
// the model is told to pick the BEST product, the routing layer puts it
// in the BEST store (REI ships outdoor gear faster than Amazon does, IKEA
// is the only place to actually buy IKEA, etc.). All targets are real
// e-commerce pages.
export function affiliateUrlFor(
  brand: string,
  name: string,
  asin: string | null | undefined
): string {
  // 1. Brand-direct (IKEA / Patagonia / MUJI / Apple / etc.)
  const brandKey = brand.toLowerCase().replace(/[^a-z]/g, "");
  const brandUrlBuilder = BRAND_DIRECT[brandKey];
  if (brandUrlBuilder) return brandUrlBuilder(name);

  const fullQuery = `${brand} ${name}`.trim();

  // 2. Brand-specialty (Therm-a-Rest → REI, Breville → Seattle Coffee Gear,
  //    Fender → Sweetwater, Le Creuset → Williams-Sonoma, etc.) — most
  //    reliable because the brand IS the category signal.
  const brandSpecialty = SPECIALTY_BY_BRAND[brandKey];
  if (brandSpecialty) return brandSpecialty.url(fullQuery);

  // 3. Specialty retailer based on product-type keywords
  for (const route of SPECIALTY_BY_KEYWORD) {
    if (route.keywords.test(name) || route.keywords.test(brand)) {
      return route.url(fullQuery);
    }
  }

  // 4. Confirmed Amazon ASIN — direct product page
  if (asin) {
    const tagSuffix = TAG ? `?tag=${TAG}` : "";
    return `https://www.amazon.com/dp/${asin}${tagSuffix}`;
  }

  // 4. Amazon keyword search (last resort — still a real product page)
  const query = encodeURIComponent(fullQuery);
  return TAG
    ? `https://www.amazon.com/s?k=${query}&tag=${TAG}`
    : `https://www.amazon.com/s?k=${query}`;
}

// Returns the human-readable name of the retailer for a given product URL.
// Used for the "View on Amazon" / "View on REI" / etc. label in plan-view.
export function retailerNameFromUrl(url: string): string {
  if (!url) return 'Buy';
  const u = url.toLowerCase();
  if (u.includes('amazon.com')) return 'Amazon';
  if (u.includes('rei.com')) return 'REI';
  if (u.includes('ikea.com')) return 'IKEA';
  if (u.includes('muji.us')) return 'MUJI';
  if (u.includes('patagonia.com')) return 'Patagonia';
  if (u.includes('vitsoe.com')) return 'Vitsoe';
  if (u.includes('apple.com')) return 'Apple';
  if (u.includes('ridge.com')) return 'Ridge';
  if (u.includes('awaytravel.com')) return 'Away';
  if (u.includes('bose.com')) return 'Bose';
  if (u.includes('yeti.com')) return 'YETI';
  if (u.includes('arcteryx.com')) return "Arc'teryx";
  if (u.includes('basspro.com')) return 'Bass Pro';
  if (u.includes('seattlecoffeegear.com')) return 'Seattle Coffee Gear';
  if (u.includes('williams-sonoma.com')) return 'Williams Sonoma';
  if (u.includes('sweetwater.com')) return 'Sweetwater';
  if (u.includes('sephora.com')) return 'Sephora';
  if (u.includes('westelm.com')) return 'West Elm';
  if (u.includes('walmart.com')) return 'Walmart';
  if (u.includes('target.com')) return 'Target';
  if (u.includes('bestbuy.com')) return 'Best Buy';
  return 'Buy';
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
