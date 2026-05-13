export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface Product {
  id: string;
  brand: string;
  name: string;
  category: string;
  approxPriceUsd: number;
  asin?: string;
  shortDescription: string;
  whyConsider: string;
}

export interface PlanProduct {
  brand: string;
  name: string;
  approx_price_usd: number;
  why_this: string;
}

export interface PlanSection {
  name: string;
  purpose: string;
  products: PlanProduct[];
}

export interface PlanResult {
  title: string;
  summary: string;
  sections: PlanSection[];
  estimated_total_usd: number;
  next_steps: string[];
}

export interface PlanProductExpanded extends PlanProduct {
  affiliateUrl: string;
  image_url: string | null;
  asin: string | null;
}

export interface PlanSectionExpanded {
  name: string;
  purpose: string;
  products: PlanProductExpanded[];
}

export interface PlanResponse {
  title: string;
  summary: string;
  sections: PlanSectionExpanded[];
  estimated_total_usd: number;
  next_steps: string[];
}
