# Store of the Future

> An agentic-commerce concierge. Tell it what you're trying to do; it interviews you and walks you out with a curated plan — sections, products, budget, rationale. Not a search box. Not a recommendation feed. A conversation.

Built on the [Claude Agent SDK](https://github.com/anthropics/claude-agent-sdk) with streaming responses, persisted state, and a four-act UX (door opens → interview → exhibit → take the list).

**Thesis:** the next era of ecommerce isn't a better catalog. It's a storefront that solves the human problem on the other side of the cart.

---

## What it does

1. **You arrive with a goal.** *"Reset a messy bedroom." "Train for my first marathon." "Prep for a newborn in two weeks." "Upgrade home coffee."*
2. **It interviews you.** A handful of conversational turns to understand constraints — budget, timeline, taste, what you already own.
3. **It synthesizes a plan.** Sections, products, rationale, budget breakdown. Each item has a why.
4. **You walk out with the list.** Click any item to buy from wherever you like (Amazon affiliate links by default). No checkout, no inventory, no cart abandonment.

## How it works

```
                                   ┌─────────────────────┐
   browser  ──→  /api/interview ──→│ Claude Agent SDK    │
                                   │  (Sonnet 4.6)       │
   chat UI  ←──  SSE stream    ←───│  + tool calls       │
                                   └─────────┬───────────┘
                                             │
                                  ┌──────────▼───────────┐
                  /api/plan       │ plan synthesis        │
                  /api/refine     │ • sections            │
                                  │ • items + rationale   │
                                  │ • budget + totals     │
                                  └──────────┬───────────┘
                                             │
                                  ┌──────────▼───────────┐
                                  │ product enrichment    │
                                  │ • amazon.com search   │
                                  │ • walmart.com fallback│
                                  │ • affiliate link wrap │
                                  └───────────────────────┘
```

Three API routes:
- `app/api/interview/route.ts` — streaming conversational turns (Claude Agent SDK)
- `app/api/plan/route.ts` — plan synthesis from accumulated interview state
- `app/api/refine/route.ts` — iterative plan refinement (swap items, adjust budget)

Two libs that do the interesting work:
- `lib/llm.ts` — Claude wrapper, prompt templates, structured outputs
- `lib/products.ts` — light Amazon/Walmart search-page parser with a user-agent rotation pool (no API key required)

The prompts that drive the four-act loop live in `lib/prompts.ts`. They're the most interesting part of the codebase if you want to see how the conversational arc is engineered.

## Quick start

```bash
git clone https://github.com/MomoFadaly/store-of-the-future
cd store-of-the-future
bun install
cp .env.local.example .env.local
# edit .env.local — set ANTHROPIC_API_KEY (required) and AMAZON_AFFILIATE_TAG (optional)
bun dev
```

Open http://localhost:3000.

### Required env vars

| Var | Where to get | Required? |
|---|---|---|
| `ANTHROPIC_API_KEY` | https://console.anthropic.com | Yes |
| `AMAZON_AFFILIATE_TAG` | Your Amazon Associates dashboard | No (links still work without it, you just don't earn the affiliate revenue) |

## Project layout

```
app/
  api/
    interview/route.ts        streaming conversation
    plan/route.ts             plan synthesis
    refine/route.ts           iterative refinement
  components/
    intro-hero.tsx            landing scene (open door, ambient blobs)
    home-story.tsx            below-the-fold scroll narrative
    plan-view.tsx             the synthesized plan render
    safety-view.tsx           crisis-resource routing (mental health, suicide, abuse)
  example/[slug]/page.tsx     pre-rendered example plans for direct linking
  page.tsx                    entry
data/
  examples/*.plan.json        pre-rendered example plans
lib/
  llm.ts                      Claude wrapper + structured outputs
  prompts.ts                  the four-act prompt arc
  products.ts                 Amazon/Walmart search-page parser
  affiliate.ts                affiliate-link wrapper
  catalog.ts                  in-memory product catalog helpers
  examples.ts                 example plan loader
  types.ts                    shared types
```

## Safety routing

The interview detects crisis-relevant inputs (suicide, abuse, severe mental health) and routes to `components/safety-view.tsx` instead of into the product flow. The view renders region-specific resources (worldwide, US/CA, UK/IE, EU) with hotline numbers and text-line shortcodes. A "concierge" that talks past those signals does measurable harm — this is a foundational integrity check, not a feature.

## Built with

- [Next.js 16](https://nextjs.org) (App Router)
- [Claude Agent SDK](https://github.com/anthropics/claude-agent-sdk) (Sonnet 4.6 default)
- [Framer Motion](https://www.framer.com/motion/) (the door / scene transitions)
- [Bun](https://bun.sh) (package manager + dev server)
- Vercel (deployment)

## License

MIT — see [LICENSE](./LICENSE).
