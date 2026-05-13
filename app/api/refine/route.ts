import { affiliateUrlFor } from "@/lib/affiliate";
import { structuredQuery } from "@/lib/llm";
import {
  PLAN_JSON_SCHEMA,
  planRefinementSystemPrompt,
} from "@/lib/prompts";
import { fetchProductInfo } from "@/lib/products";
import type {
  ChatMessage,
  PlanResponse,
  PlanResult,
  PlanSectionExpanded,
} from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 300;

interface RefineRequestBody {
  messages: ChatMessage[];
  current_plan: PlanResponse;
  refinement: string;
}

export async function POST(request: Request) {
  let body: RefineRequestBody;
  try {
    body = (await request.json()) as RefineRequestBody;
  } catch {
    return Response.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  if (!body.current_plan) {
    return Response.json(
      { error: "current_plan is required." },
      { status: 400 }
    );
  }

  if (!body.refinement?.trim()) {
    return Response.json(
      { error: "refinement message is required." },
      { status: 400 }
    );
  }

  try {
    const planForModel = {
      title: body.current_plan.title,
      summary: body.current_plan.summary,
      sections: body.current_plan.sections.map((s) => ({
        name: s.name,
        purpose: s.purpose,
        products: s.products.map((p) => ({
          brand: p.brand,
          name: p.name,
          approx_price_usd: p.approx_price_usd,
          why_this: p.why_this,
        })),
      })),
      estimated_total_usd: body.current_plan.estimated_total_usd,
      next_steps: body.current_plan.next_steps,
    };

    const refineMessages: ChatMessage[] = [
      ...(body.messages ?? []),
      { role: "user", content: body.refinement },
    ];

    const raw = await structuredQuery<PlanResult>({
      systemPrompt: planRefinementSystemPrompt(
        JSON.stringify(planForModel, null, 2)
      ),
      schema: PLAN_JSON_SCHEMA as unknown as Record<string, unknown>,
      messages: refineMessages,
    });

    const sections: PlanSectionExpanded[] = await Promise.all(
      raw.sections.map(async (section) => ({
        name: section.name,
        purpose: section.purpose,
        products: await Promise.all(
          section.products.map(async (p) => {
            const info = await fetchProductInfo(p.brand, p.name);
            return {
              ...p,
              asin: info.asin,
              image_url: info.image_url,
              affiliateUrl: affiliateUrlFor(p.brand, p.name, info.asin),
            };
          })
        ),
      }))
    );

    const enriched: PlanResponse = {
      title: raw.title,
      summary: raw.summary,
      sections,
      estimated_total_usd: raw.estimated_total_usd,
      next_steps: raw.next_steps,
    };

    return Response.json(enriched);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error.";
    console.error("[/api/refine] failure:", error);
    return Response.json({ error: message }, { status: 500 });
  }
}
