import {
  EXAMPLES,
  exampleHeroImage,
  loadExamplePlan,
} from "@/lib/examples";
import HomeClient from "./home-client";
import type { ExampleCard } from "./components/live-examples";

export const runtime = "nodejs";

export default function Home() {
  const cards: ExampleCard[] = EXAMPLES.map((ex) => {
    const plan = loadExamplePlan(ex.slug);
    return {
      slug: ex.slug,
      title: ex.title,
      blurb: ex.blurb,
      heroImage: plan ? exampleHeroImage(plan) : null,
      productCount: plan
        ? plan.sections.reduce((n, s) => n + s.products.length, 0)
        : 0,
      estimatedTotalUsd: plan?.estimated_total_usd ?? 0,
    };
  }).filter((c) => c.productCount > 0);

  return <HomeClient examples={cards} />;
}
