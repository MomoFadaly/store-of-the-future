// Verifies that the multi-retailer routing actually fires in production:
// outdoor → REI, kitchen cookware → Williams-Sonoma, espresso → Seattle Coffee Gear,
// and brand-direct picks land on IKEA / Patagonia / etc. Reports the retailer
// distribution per query and flags any plan where everything still funnels
// to Amazon.

const BASE = process.env.BASE_URL || "https://store-of-the-future.fadaly.net";

const QUERIES = [
  {
    label: "outdoor camping (expect REI / brand-direct, NOT all Amazon)",
    expectAny: ["rei.com", "patagonia.com", "arcteryx.com"],
    message:
      "I want to start backpacking — weekend trips, mostly Pacific Northwest. " +
      "Need a tent, sleeping bag, sleeping pad, water filter, and a stove. Mid-tier budget.",
  },
  {
    label: "kitchen cookware (expect Williams-Sonoma)",
    expectAny: ["williams-sonoma.com"],
    message:
      "Outfitting a brand new kitchen — I cook daily, mostly home dinners. " +
      "I need a Dutch oven, a cast iron skillet, a good knife set, and a cutting board.",
  },
  {
    label: "espresso setup (expect Seattle Coffee Gear)",
    expectAny: ["seattlecoffeegear.com"],
    message:
      "Help me build a real home espresso setup — espresso machine, burr grinder, " +
      "tamper, and a pour-over kettle. Budget around $1500 total.",
  },
  {
    label: "minimalist apartment (expect IKEA / MUJI brand-direct)",
    expectAny: ["ikea.com", "muji.us"],
    message:
      "Furnishing a small studio apartment cheaply but tastefully. Bed frame, " +
      "small dining table, bookshelf, sofa, and basic kitchen storage.",
  },
];

function retailerOf(url) {
  const u = (url || "").toLowerCase();
  if (u.includes("amazon.com")) return "Amazon";
  if (u.includes("rei.com")) return "REI";
  if (u.includes("ikea.com")) return "IKEA";
  if (u.includes("muji.us")) return "MUJI";
  if (u.includes("patagonia.com")) return "Patagonia";
  if (u.includes("vitsoe.com")) return "Vitsoe";
  if (u.includes("apple.com")) return "Apple";
  if (u.includes("ridge.com")) return "Ridge";
  if (u.includes("awaytravel.com")) return "Away";
  if (u.includes("bose.com")) return "Bose";
  if (u.includes("yeti.com")) return "YETI";
  if (u.includes("hydroflask.com")) return "Hydro Flask";
  if (u.includes("arcteryx.com")) return "Arc'teryx";
  if (u.includes("vivobarefoot.com")) return "Vivobarefoot";
  if (u.includes("allbirds.com")) return "Allbirds";
  if (u.includes("hoka.com")) return "Hoka";
  if (u.includes("brooksrunning.com")) return "Brooks";
  if (u.includes("saucony.com")) return "Saucony";
  if (u.includes("oakley.com")) return "Oakley";
  if (u.includes("oneill.com")) return "O'Neill";
  if (u.includes("basspro.com")) return "Bass Pro";
  if (u.includes("seattlecoffeegear.com")) return "Seattle Coffee Gear";
  if (u.includes("williams-sonoma.com")) return "Williams Sonoma";
  if (u.includes("sweetwater.com")) return "Sweetwater";
  if (u.includes("sephora.com")) return "Sephora";
  if (u.includes("westelm.com")) return "West Elm";
  return "Other";
}

let failures = 0;

for (const q of QUERIES) {
  console.log("\n══════════════════════════════════════════════════════");
  console.log(`▶ ${q.label}`);
  console.log("══════════════════════════════════════════════════════");

  const res = await fetch(`${BASE}/api/plan`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: q.message }] }),
  });

  if (!res.ok) {
    console.log(`  ✗ HTTP ${res.status}: ${await res.text()}`);
    failures++;
    continue;
  }

  const plan = await res.json();
  const allProducts = plan.sections.flatMap((s) => s.products);
  const retailerCount = {};
  for (const p of allProducts) {
    const r = retailerOf(p.affiliateUrl);
    retailerCount[r] = (retailerCount[r] || 0) + 1;
    console.log(`  • [${r.padEnd(20)}] ${p.brand} ${p.name}`);
    console.log(`      ${p.affiliateUrl}`);
  }

  const distribution = Object.entries(retailerCount)
    .map(([r, n]) => `${r}=${n}`)
    .join(", ");
  console.log(`  → distribution: ${distribution}`);

  const matched = q.expectAny.some((host) =>
    allProducts.some((p) => (p.affiliateUrl || "").toLowerCase().includes(host))
  );
  if (!matched) {
    console.log(`  ✗ FAIL — expected at least one of: ${q.expectAny.join(", ")}`);
    failures++;
  } else {
    console.log(`  ✓ PASS — at least one expected retailer matched`);
  }
}

console.log("\n══════════════════════════════════════════════════════");
console.log(failures === 0 ? "✅ All queries routed correctly." : `❌ ${failures} query(ies) failed.`);
process.exit(failures === 0 ? 0 : 1);
