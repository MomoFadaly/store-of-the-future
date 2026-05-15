import "server-only";
import { readFileSync } from "fs";
import { join } from "path";
import type { PlanResponse } from "./types";

export interface Example {
  slug: string;
  title: string;
  blurb: string;
  prompt: string;
}

export const EXAMPLES: Example[] = [
  {
    slug: "bedroom-reset",
    title: "Reset a messy bedroom",
    blurb:
      "Clothes, electronics, cables all over the floor — build a real system, not just a one-time tidy.",
    prompt:
      "My bedroom is a constant mess. Clothes everywhere, electronics piling up, cables tangled. Want a real fix, $500-800 budget.",
  },
  {
    slug: "newborn-essentials",
    title: "Newborn in 2 weeks",
    blurb:
      "First baby on the way, apartment, no nursery. Outfit everything from zero in time.",
    prompt:
      "Having my first baby in 2 weeks. Apartment, no nursery, starting from zero. Mid-tier budget around $1500.",
  },
  {
    slug: "first-marathon",
    title: "Train for your first marathon",
    blurb:
      "6 months out, runs 3x a week, never more than 5 miles. Plan + gear from scratch.",
    prompt:
      "Training for my first marathon in 6 months. I run 3x a week now but never more than 5 miles. Need a real plan and gear. $500-800 budget.",
  },
  {
    slug: "coffee-upgrade",
    title: "Upgrade home coffee",
    blurb:
      "Pour-over leaning, splurge on the grinder, $400-600 budget — beat the cafe at home.",
    prompt:
      "I want to upgrade my coffee setup at home. Pour-over leaning, splurge on the grinder, $400-600 budget.",
  },
];

import { sanitizeAffiliateUrl } from "./affiliate";

const examplePlanCache = new Map<string, PlanResponse>();

export function loadExamplePlan(slug: string): PlanResponse | null {
  const cached = examplePlanCache.get(slug);
  if (cached) return cached;
  try {
    const path = join(process.cwd(), "data", "examples", `${slug}.plan.json`);
    const json = readFileSync(path, "utf-8");
    const plan = JSON.parse(json) as PlanResponse;
    // Cached example fixtures contain the placeholder affiliate tag from
    // pre-launch data generation. Sanitize at load time so users never see
    // ?tag=REPLACE-WITH-YOUR-TAG-20 in the browser.
    if (plan.sections) {
      for (const section of plan.sections) {
        for (const product of section.products) {
          if (product.affiliateUrl) {
            product.affiliateUrl = sanitizeAffiliateUrl(product.affiliateUrl);
          }
        }
      }
    }
    examplePlanCache.set(slug, plan);
    return plan;
  } catch {
    return null;
  }
}

export function exampleBySlug(slug: string): Example | undefined {
  return EXAMPLES.find((e) => e.slug === slug);
}

// Return the first product's image URL for use as a thumbnail/hero.
export function exampleHeroImage(plan: PlanResponse): string | null {
  for (const section of plan.sections) {
    for (const product of section.products) {
      if (product.image_url) return product.image_url;
    }
  }
  return null;
}
