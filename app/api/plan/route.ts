import { affiliateUrlFor } from "@/lib/affiliate";
import { structuredQuery } from "@/lib/llm";
import {
  PLAN_JSON_SCHEMA,
  planSynthesisSystemPrompt,
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

interface PlanRequestBody {
  messages: ChatMessage[];
}

export async function POST(request: Request) {
  let body: PlanRequestBody;
  try {
    body = (await request.json()) as PlanRequestBody;
  } catch {
    return Response.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  if (!body.messages || body.messages.length === 0) {
    return Response.json(
      { error: "messages must contain the full interview transcript." },
      { status: 400 }
    );
  }

  try {
    const raw = await structuredQuery<PlanResult>({
      systemPrompt: planSynthesisSystemPrompt(),
      schema: PLAN_JSON_SCHEMA as unknown as Record<string, unknown>,
      messages: body.messages,
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
    console.error("[/api/plan] failure:", error);
    return Response.json({ error: message }, { status: 500 });
  }
}
