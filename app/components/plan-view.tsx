"use client";

import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import type { PlanResponse } from "@/lib/types";
import { retailerNameFromUrl } from "@/lib/affiliate";
import { TopBar } from "./top-bar";

interface PlanViewProps {
  plan: PlanResponse;
  onReset: () => void;
  onRefine?: (refinement: string) => void | Promise<void>;
  isRefining?: boolean;
  lastRefinement?: string;
}

const ROMAN = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
];

/**
 * Act 4 — The Reveal.
 *
 * The plan presents as a small private exhibition. Each product sits
 * on its own plinth, lit from above, with a brass plaque underneath.
 * Sections are "galleries" labelled in Roman numerals. The page reads
 * like a catalogue you'd be handed at the door of a curated boutique
 * show — not a search-result grid.
 */
export function PlanView({
  plan,
  onReset,
  onRefine,
  isRefining = false,
  lastRefinement = "",
}: PlanViewProps) {
  const [refineDraft, setRefineDraft] = useState("");
  const refineRef = useRef<HTMLTextAreaElement | null>(null);
  const isEmptyPlan = plan.sections.length === 0;
  const totalItems = plan.sections.reduce(
    (n, s) => n + s.products.length,
    0
  );

  useEffect(() => {
    if (!isRefining) refineRef.current?.focus();
  }, [isRefining, plan]);

  function handleRefineSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = refineDraft.trim();
    if (!trimmed || !onRefine || isRefining) return;
    setRefineDraft("");
    onRefine(trimmed);
  }

  return (
    <div className="min-h-[100dvh] flex flex-col relative">
      {/* Gallery backdrop — same interior scene at very low opacity, so
          the room reads continuous with the interview. A vertical cream
          gradient lifts the content into focus toward the top. */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 opacity-25"
        style={{
          backgroundImage: "url('/interior-scene.png')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
        }}
      />
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, var(--bg) 0%, rgba(252,250,245,0.7) 30%, rgba(252,250,245,0.85) 70%, var(--bg) 100%)",
        }}
      />

      <TopBar
        subLabel={isEmptyPlan ? "not a shop question" : "the exhibit"}
        onReset={onReset}
        confirmReset={!isEmptyPlan}
      />

      <div className="flex-1 px-6 sm:px-10 py-16 sm:py-24 pb-40">
        <article className="max-w-6xl mx-auto">
          {/* Exhibition title card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-4 flex items-center gap-4"
          >
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent-deep">
              ◇ Exhibit · {new Date().getFullYear()}
            </span>
            <span className="h-px flex-1 bg-border" />
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-text-deep-muted">
              {isEmptyPlan
                ? "no items on display"
                : `${totalItems} ${totalItems === 1 ? "item" : "items"} · ${plan.sections.length} ${plan.sections.length === 1 ? "gallery" : "galleries"}`}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.2, 0.7, 0.2, 1] }}
            className="font-serif italic text-4xl sm:text-5xl md:text-6xl leading-[1.02] tracking-tight text-text max-w-4xl"
          >
            {plan.title}
          </motion.h1>

          {/* Curator's note + edition pricing */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className={`mt-10 grid gap-10 items-start ${
              isEmptyPlan ? "" : "md:grid-cols-[1.6fr_1fr]"
            }`}
          >
            <div>
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-text-deep-muted mb-3">
                Curator&apos;s note
              </p>
              <p className="text-text text-lg sm:text-xl leading-relaxed font-serif">
                {plan.summary}
              </p>
            </div>
            {!isEmptyPlan && <EditionPlaque plan={plan} />}
          </motion.div>

          {/* Galleries */}
          <div className="mt-24 space-y-24">
            {plan.sections.map((section, i) => (
              <motion.section
                key={`${plan.title}-${section.name}-${i}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 + i * 0.1 }}
              >
                <header className="mb-10 flex items-end gap-6 border-b border-border pb-6">
                  <span
                    className="font-serif italic text-5xl sm:text-6xl text-accent-deep leading-none"
                    style={{ fontFeatureSettings: '"smcp", "c2sc"' }}
                  >
                    {ROMAN[i] ?? String(i + 1)}
                  </span>
                  <div className="flex-1">
                    <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-text-deep-muted">
                      Gallery {ROMAN[i] ?? String(i + 1)}
                    </p>
                    <h2 className="font-serif text-2xl sm:text-3xl leading-tight text-text mt-1">
                      {section.name}
                    </h2>
                    <p className="text-text-muted text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                      {section.purpose}
                    </p>
                  </div>
                  <span className="hidden sm:inline font-mono text-[10px] tracking-[0.22em] uppercase text-text-deep-muted shrink-0">
                    {section.products.length}
                    {" "}
                    {section.products.length === 1 ? "piece" : "pieces"}
                  </span>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                  {section.products.map((p, j) => (
                    <Plinth
                      key={`${plan.title}-${section.name}-${p.brand}-${p.name}-${j}`}
                      product={p}
                      delay={0.7 + i * 0.1 + j * 0.06}
                    />
                  ))}
                </div>
              </motion.section>
            ))}
          </div>

          {/* After-the-exhibit / next steps */}
          {plan.next_steps.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.8 + plan.sections.length * 0.1,
              }}
              className={`pt-12 border-t border-border ${
                isEmptyPlan ? "mt-10" : "mt-28"
              }`}
            >
              <div className="flex items-baseline gap-4 mb-8">
                <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-accent-deep">
                  ◇ After the exhibit
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <ol className="space-y-6 max-w-3xl">
                {plan.next_steps.map((step, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-[auto_1fr] gap-6 items-baseline"
                  >
                    <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-text-deep-muted tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-text text-base sm:text-lg leading-relaxed">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </motion.section>
          )}

          {isEmptyPlan && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="mt-16"
            >
              <button
                onClick={onReset}
                className="font-mono text-[10px] tracking-[0.22em] uppercase bg-text text-bg px-5 py-3 rounded-full hover:bg-accent-deep transition-colors"
              >
                Try a different prompt →
              </button>
            </motion.div>
          )}

          <footer
            className={`pt-8 border-t border-border text-[10px] font-mono tracking-[0.22em] uppercase text-text-deep-muted flex flex-wrap gap-x-6 gap-y-2 justify-between ${
              isEmptyPlan ? "mt-16" : "mt-32"
            }`}
          >
            <span>
              {isEmptyPlan
                ? "A general chat assistant will serve non-shopping questions better"
                : "Real, buyable products. No payment, no commission, no paid placement."}
            </span>
            <span>Prices approximate · Est. 2026 · Vancouver</span>
          </footer>
        </article>
      </div>

      {!isEmptyPlan && onRefine && (
        <motion.form
          onSubmit={handleRefineSubmit}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4, ease: "easeOut" }}
          className="fixed bottom-0 inset-x-0 border-t border-border bg-bg/75 backdrop-blur-xl shadow-[0_-4px_30px_rgba(0,0,0,0.15)]"
        >
          <div className="max-w-4xl mx-auto px-6 sm:px-10 py-4">
            <AnimatePresence>
              {lastRefinement && (
                <motion.div
                  key={lastRefinement}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mb-3 text-[10px] font-mono tracking-[0.22em] uppercase text-accent"
                >
                  ◇ Last note · &ldquo;
                  {lastRefinement.length > 80
                    ? lastRefinement.slice(0, 80) + "…"
                    : lastRefinement}
                  &rdquo;
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex items-end gap-3 glass rounded-2xl px-4 py-2 focus-within:border-accent transition-colors">
              <textarea
                ref={refineRef}
                value={refineDraft}
                onChange={(e) => setRefineDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleRefineSubmit(e as unknown as React.FormEvent);
                  }
                }}
                placeholder={
                  isRefining
                    ? "Revising your exhibit…"
                    : 'A note to the curator — "cheaper", "I already have luggage", "more romantic"…'
                }
                rows={1}
                disabled={isRefining}
                className="flex-1 bg-transparent border-0 outline-none resize-none py-2.5 text-sm text-text placeholder:text-text-deep-muted disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!refineDraft.trim() || isRefining}
                className="font-mono text-[10px] tracking-[0.22em] uppercase bg-text text-bg disabled:bg-border-strong disabled:text-text-deep-muted px-4 py-2.5 rounded-xl hover:bg-accent-deep transition-colors flex items-center gap-2"
              >
                {isRefining ? (
                  <>
                    <RefiningDot />
                    Revising
                  </>
                ) : (
                  <>Send note →</>
                )}
              </button>
            </div>
          </div>
        </motion.form>
      )}
    </div>
  );
}

function EditionPlaque({ plan }: { plan: PlanResponse }) {
  return (
    <aside
      className="relative rounded-2xl p-6 overflow-hidden"
      style={{
        background:
          "linear-gradient(155deg, rgba(255,244,220,0.95) 0%, rgba(252,250,245,0.95) 60%, rgba(255,225,200,0.6) 100%)",
        border: "1px solid rgba(231, 105, 67, 0.18)",
        boxShadow:
          "0 8px 28px rgba(231, 105, 67, 0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 20% 0%, rgba(255,200,140,0.18) 0%, transparent 50%)",
        }}
      />
      <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-accent-deep mb-3 relative">
        Edition price
      </p>
      <p className="relative">
        <span className="font-serif italic text-5xl text-text leading-none align-baseline">
          ${plan.estimated_total_usd.toLocaleString()}
        </span>
        <span className="font-mono text-xs ml-2 text-text-muted tracking-[0.18em] uppercase align-middle">
          USD
        </span>
      </p>
      <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-text-deep-muted mt-4 relative">
        Approximate · doesn&apos;t include taxes or shipping
      </p>
    </aside>
  );
}

function Plinth({
  product,
  delay,
}: {
  product: import("@/lib/types").PlanProductExpanded;
  delay: number;
}) {
  return (
    <motion.a
      href={product.affiliateUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] }}
      className="group block focus:outline-none"
    >
      {/* The plinth — pedestal with product floating above */}
      <div className="relative">
        {/* Spotlight halo from above */}
        <div
          aria-hidden
          className="absolute -inset-x-4 -top-6 h-24 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(ellipse at center top, rgba(255, 244, 220, 0.9) 0%, rgba(255, 220, 170, 0.3) 40%, transparent 75%)",
            filter: "blur(8px)",
          }}
        />

        {/* Pedestal: cream-white surface with subtle inner shadow + cast
            shadow underneath the product. */}
        <div
          className="relative aspect-square rounded-t-[2px] overflow-hidden transition-transform duration-500 group-hover:-translate-y-1"
          style={{
            background:
              "linear-gradient(180deg, #ffffff 0%, #fdfaf2 70%, #f5efe2 100%)",
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(19,20,24,0.04) inset, 0 24px 36px -22px rgba(19,20,24,0.25)",
          }}
        >
          {/* Product floats with its own soft shadow */}
          {product.image_url ? (
            <div className="absolute inset-0 flex items-center justify-center p-7">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image_url}
                alt={`${product.brand} ${product.name}`}
                className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-[1.05] group-hover:-translate-y-1.5"
                style={{
                  filter:
                    "drop-shadow(0 14px 18px rgba(19,20,24,0.22)) drop-shadow(0 4px 6px rgba(19,20,24,0.08))",
                }}
                loading="lazy"
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <span className="font-serif italic text-text-deep-muted text-base text-center">
                {product.brand}
                <br />
                {product.name}
              </span>
            </div>
          )}

          {/* Marble vein hint — extremely faint, lower third only */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none opacity-[0.06]"
            style={{
              background:
                "radial-gradient(ellipse at 30% 100%, rgba(19,20,24,0.6) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(19,20,24,0.5) 0%, transparent 55%)",
            }}
          />

          {/* Catalog number — discreet upper-left */}
          <span className="absolute top-3 left-3 font-mono text-[9px] tracking-[0.22em] uppercase text-text-deep-muted">
            ◇ Cat. {(product.asin ?? product.name)
              .replace(/[^a-zA-Z0-9]/g, "")
              .slice(0, 5)
              .toUpperCase()}
          </span>
        </div>

        {/* Brass plaque underneath — the placard */}
        <div
          className="relative px-4 pt-5 pb-4 rounded-b-2xl"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,244,220,0.95) 0%, rgba(252,238,210,0.85) 100%)",
            borderTop: "1px solid rgba(231, 105, 67, 0.22)",
            boxShadow: "0 8px 24px -10px rgba(231, 105, 67, 0.18)",
          }}
        >
          {/* Twin brass screws — purely decorative */}
          <span
            aria-hidden
            className="absolute top-2 left-3 w-1 h-1 rounded-full"
            style={{ background: "rgba(180, 130, 70, 0.55)" }}
          />
          <span
            aria-hidden
            className="absolute top-2 right-3 w-1 h-1 rounded-full"
            style={{ background: "rgba(180, 130, 70, 0.55)" }}
          />

          <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-accent-deep">
            {product.brand}
          </p>
          <h3 className="mt-1 font-serif italic text-lg sm:text-xl text-text leading-snug line-clamp-2">
            {product.name}
          </h3>
          <p className="mt-3 text-[13px] text-text-muted leading-relaxed line-clamp-4">
            {product.why_this}
          </p>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-accent-deep/15">
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-text tabular-nums">
              ${product.approx_price_usd.toLocaleString()}
              <span className="text-text-deep-muted ml-1">USD</span>
            </span>
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-accent-deep group-hover:underline flex items-center gap-1">
              {retailerNameFromUrl(product.affiliateUrl)}
              <span className="inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </span>
          </div>
        </div>
      </div>
    </motion.a>
  );
}

function RefiningDot() {
  return (
    <motion.span
      animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      className="inline-block w-1.5 h-1.5 rounded-full bg-accent"
    />
  );
}
