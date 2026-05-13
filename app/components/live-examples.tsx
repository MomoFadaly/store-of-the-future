"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export interface ExampleCard {
  slug: string;
  title: string;
  blurb: string;
  heroImage: string | null;
  productCount: number;
  estimatedTotalUsd: number;
}

export function LiveExamples({ examples }: { examples: ExampleCard[] }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 1.9 }}
      className="mt-16"
    >
      <div className="flex items-baseline justify-between mb-5">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-text-deep-muted">
          ◇ Or see it in action
        </p>
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-text-deep-muted">
          Live examples
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {examples.map((ex, i) => (
          <motion.div
            key={ex.slug}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2.1 + i * 0.06 }}
          >
            <Link
              href={`/example/${ex.slug}`}
              className="group glass block rounded-2xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow"
            >
              <div className="aspect-[5/4] relative overflow-hidden bg-gradient-to-br from-white/[0.08] to-transparent">
                {ex.heroImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ex.heroImage}
                    alt={ex.title}
                    className="w-full h-full object-contain p-5 group-hover:scale-[1.05] transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-deep-muted text-xs">
                    {ex.title}
                  </div>
                )}
                <div className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.18em] uppercase text-accent bg-bg/80 backdrop-blur rounded-full px-2.5 py-1 shadow-sm border border-border">
                  Live example
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-serif text-lg sm:text-xl leading-snug text-text">
                  {ex.title}
                </h3>
                <p className="mt-2 text-xs text-text-muted leading-relaxed line-clamp-2">
                  {ex.blurb}
                </p>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-deep-muted">
                    {ex.productCount} items · ${ex.estimatedTotalUsd.toLocaleString()}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-accent group-hover:underline">
                    View →
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
