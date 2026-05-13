"use client";

import { useRouter } from "next/navigation";
import { PlanView } from "../../components/plan-view";
import type { PlanResponse } from "@/lib/types";

export function ExamplePlanWrapper({ plan }: { plan: PlanResponse }) {
  const router = useRouter();
  return <PlanView plan={plan} onReset={() => router.push("/")} />;
}
