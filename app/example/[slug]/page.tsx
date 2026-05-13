import Link from "next/link";
import { notFound } from "next/navigation";
import { AmbientBg } from "../../components/ambient-bg";
import { ExamplePlanWrapper } from "./example-plan-wrapper";
import { exampleBySlug, loadExamplePlan } from "@/lib/examples";

export const runtime = "nodejs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const ex = exampleBySlug(slug);
  if (!ex) return { title: "Example not found" };
  return {
    title: `${ex.title} · Store of the Future`,
    description: ex.blurb,
  };
}

export default async function ExamplePage({ params }: PageProps) {
  const { slug } = await params;
  const example = exampleBySlug(slug);
  const plan = example ? loadExamplePlan(slug) : null;

  if (!example || !plan) {
    notFound();
  }

  return (
    <>
      <AmbientBg />
      <ExampleBanner prompt={example.prompt} />
      <ExamplePlanWrapper plan={plan} />
    </>
  );
}

function ExampleBanner({ prompt }: { prompt: string }) {
  return (
    <div className="border-b border-border bg-accent-soft">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 justify-between">
        <div className="flex items-baseline gap-3 min-w-0">
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-accent-deep whitespace-nowrap">
            Live example
          </span>
          <span className="text-sm text-text-muted truncate font-serif italic">
            &ldquo;{prompt}&rdquo;
          </span>
        </div>
        <Link
          href="/"
          className="font-mono text-[10px] tracking-[0.22em] uppercase bg-text text-bg px-4 py-2 rounded-full hover:bg-accent-deep transition-colors whitespace-nowrap text-center"
        >
          Try your own situation →
        </Link>
      </div>
    </div>
  );
}
