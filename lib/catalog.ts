import type { Product } from "./types";

// v1 hand-curated SUVlife catalog.
// ASINs are intentionally empty — the affiliate helper falls back to a
// keyword search URL so links work today. Replace each empty asin with
// a verified Amazon ASIN as you adopt products (this captures the
// per-category commission rate instead of the lower search-page rate).
export const CATALOG: Product[] = [
  {
    id: "ecoflow-delta-2",
    brand: "EcoFlow",
    name: "DELTA 2 Portable Power Station",
    category: "power",
    approxPriceUsd: 699,
    asin: "",
    shortDescription:
      "1024Wh LFP battery, 1800W AC out, 80% recharge in 50 min. Expandable.",
    whyConsider:
      "Best mid-tier power station for short to mid trips. LFP chemistry = long cycle life. Recommend over Jackery for users who care about longevity, over Yeti for users who care about charge speed and price.",
  },
  {
    id: "goal-zero-yeti-1500x",
    brand: "Goal Zero",
    name: "Yeti 1500X Portable Power Station",
    category: "power",
    approxPriceUsd: 1999,
    asin: "",
    shortDescription:
      "1516Wh battery, 2000W AC out, app-controlled, premium build.",
    whyConsider:
      "Recommend for users running larger AC loads (induction cooktop, CPAP, mini fridge for days at a time) or wanting the premium ecosystem. Heavier and pricier than Delta 2 — only if power budget calls for it.",
  },
  {
    id: "renogy-200w-solar-suitcase",
    brand: "Renogy",
    name: "200W Monocrystalline Solar Suitcase",
    category: "power",
    approxPriceUsd: 339,
    asin: "",
    shortDescription:
      "Foldable 200W panel with built-in 20A controller and stand. Plug-and-play.",
    whyConsider:
      "Turn-key portable solar for users who don't want to mount panels on the roof. Pairs with any power station. Recommend when the user plans long stays at base camps rather than constant driving.",
  },
  {
    id: "thule-foothill",
    brand: "Thule",
    name: "Foothill Rooftop Tent",
    category: "sleep",
    approxPriceUsd: 1699,
    asin: "",
    shortDescription:
      "Low-profile soft-shell rooftop tent that leaves half the roof free for other cargo.",
    whyConsider:
      "Best when the user has limited roof real estate and still wants to carry kayaks, bikes, or solar on top. Trade-off: smaller than full-width tents, fits 2 people max.",
  },
  {
    id: "ikamper-skycamp-mini",
    brand: "iKamper",
    name: "Skycamp Mini 3.0 Hardshell Rooftop Tent",
    category: "sleep",
    approxPriceUsd: 3499,
    asin: "",
    shortDescription:
      "Hardshell rooftop tent that opens in 60 seconds. Sleeps 2.",
    whyConsider:
      "Premium pick when speed of setup matters most (frequent stops, bad weather). Hardshell sheds rain and noise. Recommend when budget allows and the rig will live with this tent attached.",
  },
  {
    id: "exped-megamat-lxw",
    brand: "Exped",
    name: "MegaMat 10 LXW Sleeping Pad",
    category: "sleep",
    approxPriceUsd: 299,
    asin: "",
    shortDescription: "10cm thick insulated self-inflating mat, R-value 8.1.",
    whyConsider:
      "The mat that turns any tent or fold-flat seat setup into a real bed. R-value 8.1 means cold-weather capable. Recommend whenever sleep quality is part of the brief.",
  },
  {
    id: "dometic-cfx3-35",
    brand: "Dometic",
    name: "CFX3 35 Powered Cooler / Freezer",
    category: "kitchen",
    approxPriceUsd: 999,
    asin: "",
    shortDescription:
      "32qt 12V/120V compressor fridge-freezer. App-controlled, quiet, efficient.",
    whyConsider:
      "Quietest and most efficient compressor cooler in this size class. Critical for any trip longer than 3-4 days or in summer heat. Skip in favor of a regular cooler only if the trip is short, cool-weather, and power-constrained.",
  },
  {
    id: "jetboil-genesis-basecamp",
    brand: "Jetboil",
    name: "Genesis Basecamp 2-Burner Stove System",
    category: "kitchen",
    approxPriceUsd: 299,
    asin: "",
    shortDescription:
      "Folding 2-burner propane stove that includes a 5L pot and 10in skillet.",
    whyConsider:
      "Designed for car camping, not backpacking — proper burner power for real cooking. Folds flat for storage. Recommend over Coleman dual-burners for users who care about pack-down size.",
  },
  {
    id: "gsi-pinnacle-camper-cookset",
    brand: "GSI Outdoors",
    name: "Pinnacle Camper Cookset",
    category: "kitchen",
    approxPriceUsd: 119,
    asin: "",
    shortDescription:
      "4-person hard-anodized cookset: 2 pots, frypan, 4 plates/bowls/mugs, all nesting.",
    whyConsider:
      "Single-purchase covers the entire cooking-and-eating surface for a small group. Nests into itself for compact storage. Default cookset recommendation for users who haven't already accumulated camp kitchen gear.",
  },
  {
    id: "waterbrick-3-5gal",
    brand: "WaterBrick",
    name: "3.5 Gallon Stackable Water Container",
    category: "water",
    approxPriceUsd: 29,
    asin: "",
    shortDescription:
      "Stackable, modular 3.5gal water container with built-in handle. Food-grade.",
    whyConsider:
      "Modular water storage — buy as many as you need, they stack. Better than one big jug because you can spread the weight and refill incrementally. Recommend a quantity in the plan reasoning.",
  },
  {
    id: "rinsekit-pro",
    brand: "RinseKit",
    name: "RinseKit Pro Portable Shower",
    category: "water",
    approxPriceUsd: 199,
    asin: "",
    shortDescription:
      "Pressurized 3.5gal portable shower. No batteries, no pumping, 4-min spray time.",
    whyConsider:
      "Only pressurized portable shower that requires no battery or pumping. Recommend when the user mentions showers, beach trips, dog washes, or off-grid hygiene.",
  },
  {
    id: "front-runner-wolf-pack",
    brand: "Front Runner",
    name: "Wolf Pack Pro Storage Box",
    category: "storage",
    approxPriceUsd: 79,
    asin: "",
    shortDescription:
      "Stackable, lockable storage box. Modular system used by overlanders worldwide.",
    whyConsider:
      "The default modular storage box for organized vehicle setups. Stack 4-6 of them and assign each a category (tools, kitchen, electrical, recovery). Skip Pelican-style cases for SUV camping — too rigid and heavy.",
  },
  {
    id: "decked-drawer-suv",
    brand: "Decked",
    name: "Drawer System for SUVs",
    category: "storage",
    approxPriceUsd: 1499,
    asin: "",
    shortDescription:
      "Vehicle-specific lockable drawer system. Load floor over, drawers below.",
    whyConsider:
      "Recommend for users who are committing to long-term vehicle camping with the same rig. Premium build, vehicle-specific fit. Skip for occasional trips or rentals — the Wolf Pack route is much cheaper.",
  },
  {
    id: "maxtrax-mk2",
    brand: "MaxTrax",
    name: "MKII Recovery Boards (Pair)",
    category: "recovery",
    approxPriceUsd: 299,
    asin: "",
    shortDescription:
      "The original orange traction boards. Get unstuck in sand, snow, or mud.",
    whyConsider:
      "Genuine MaxTrax (not the knockoffs) for any user going off-pavement. Save lives in remote terrain. Always recommend in pairs. Skip only for pure on-road / paved-campground trips.",
  },
  {
    id: "arb-twin-compressor",
    brand: "ARB",
    name: "Twin On-Board Air Compressor",
    category: "recovery",
    approxPriceUsd: 699,
    asin: "",
    shortDescription:
      "High-output twin compressor for airing tires up after off-road driving.",
    whyConsider:
      "Pair with traction boards — airing down tires dramatically improves grip off-pavement, and you need a real compressor to air back up at trail's end. Skip for users staying on paved roads.",
  },
  {
    id: "goal-zero-lighthouse-600",
    brand: "Goal Zero",
    name: "Lighthouse 600 Lantern",
    category: "lighting",
    approxPriceUsd: 79,
    asin: "",
    shortDescription:
      "600 lumen lantern with USB-A out (charges phones), hand crank, hanging hook.",
    whyConsider:
      "Default camp lantern. The phone-charge USB and hand crank make it a small emergency kit on its own. Recommend in plans involving meaningful time in or near the vehicle at night.",
  },
];

export function getProductById(id: string): Product | undefined {
  return CATALOG.find((p) => p.id === id);
}

export function catalogForPrompt(): string {
  return JSON.stringify(
    CATALOG.map((p) => ({
      id: p.id,
      brand: p.brand,
      name: p.name,
      category: p.category,
      price_usd: p.approxPriceUsd,
      description: p.shortDescription,
      notes_for_recommender: p.whyConsider,
    })),
    null,
    2
  );
}
