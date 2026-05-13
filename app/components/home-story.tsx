"use client";

import { motion } from "framer-motion";
import { forwardRef, useRef } from "react";
import type React from "react";
import type { ExampleCard } from "./live-examples";

interface HomeStoryProps {
  draft: string;
  setDraft: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  examples?: ExampleCard[];
}

/**
 * Below-the-fold scroll narrative.
 *
 * Five editorial sections, each with its own typographic personality:
 *   01  The Thesis
 *   02  From the World
 *   03  The Four Acts
 *   04  Carta (principles)
 *   05  Whenever you're ready (looping CTA)
 *
 * Plus a proper closing footer.
 */
export function HomeStory({
  draft,
  setDraft,
  onSubmit,
  examples,
}: HomeStoryProps) {
  return (
    <>
      <ThesisSection />
      <FourActsSection />
      <CartaSection />
      <FinalCtaSection draft={draft} setDraft={setDraft} onSubmit={onSubmit} />
      <ClosingFooter />
    </>
  );
}

/* ───────────────────────── 01 · The Thesis ──────────────────────── */

function ThesisSection() {
  return (
    <section className="relative py-32 sm:py-44 lg:py-56 overflow-hidden grain">
      {/* Soft pastel wash — peach top fading to cream */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, var(--bg) 0%, rgba(255,228,205,0.45) 18%, rgba(252,250,245,0.95) 55%, var(--bg) 100%)",
        }}
      />

      {/* Organic peach blob — drifts top-right, off-canvas */}
      <span
        aria-hidden
        className="blob -z-10"
        style={{
          top: "-12%",
          right: "-10%",
          width: "55vw",
          height: "55vw",
          maxWidth: "780px",
          maxHeight: "780px",
          background:
            "radial-gradient(circle at 35% 35%, rgba(255, 165, 110, 0.55) 0%, rgba(255, 140, 94, 0.25) 40%, transparent 75%)",
          animation: "blob-drift-a 22s ease-in-out infinite",
        }}
      />

      {/* Coral blob — bottom-left, smaller */}
      <span
        aria-hidden
        className="blob blob-shape-b -z-10"
        style={{
          bottom: "-8%",
          left: "-12%",
          width: "44vw",
          height: "44vw",
          maxWidth: "620px",
          maxHeight: "620px",
          background:
            "radial-gradient(circle at 60% 50%, rgba(231, 105, 67, 0.32) 0%, rgba(255, 200, 170, 0.18) 50%, transparent 80%)",
          animation: "blob-drift-b 28s ease-in-out infinite",
        }}
      />

      {/* Scattered ornaments */}
      <span
        aria-hidden
        className="absolute font-serif text-accent-deep/15 pointer-events-none select-none"
        style={{
          top: "8%",
          left: "6%",
          fontSize: "clamp(4rem, 8vw, 8rem)",
          lineHeight: 1,
        }}
      >
        ◇
      </span>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <SectionHeader number="01" eyebrow="The thesis" />

        <motion.h2
          initial={{ opacity: 0, y: 26, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
          className="font-[family-name:var(--font-display)] text-text mt-10 tracking-[-0.025em]"
          style={{
            fontWeight: 600,
            fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
            lineHeight: 0.96,
          }}
        >
          We are not
          <br />
          a catalog.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="font-serif italic text-text-muted mt-6 max-w-2xl"
          style={{ fontSize: "clamp(1.5rem, 2.4vw, 2.25rem)", lineHeight: 1.2 }}
        >
          We&apos;re a small atelier inside a very large internet.
        </motion.p>

        {/* Two-column editorial — OLD WAY / NEW WAY */}
        <div className="mt-24 grid md:grid-cols-2 gap-12 md:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <p className="font-mono text-[10px] tracking-[0.32em] uppercase text-text-deep-muted mb-4">
              ✕ The old way
            </p>
            {/* Warehouse image — cold infinite catalog vs. our warm
                boutique. Desaturated and tinted slightly cool so it
                visually reads as "the wrong way." */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl mb-6 border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/generated/hero-manifesto-warehouse-1.png"
                alt=""
                aria-hidden
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: "saturate(0.85) contrast(1.05)" }}
              />
              {/* Cool blue overlay — reinforces the cold/clinical feel */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-30"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(70,90,120,0.4) 0%, rgba(40,60,90,0.2) 100%)",
                }}
              />
            </div>
            <p className="font-serif text-text text-xl sm:text-2xl leading-snug">
              Endless search. Infinite shelves. Fifty-thousand results, ranked
              by who paid the most. The best product for you sits somewhere on
              page forty-seven.
            </p>
            <p className="text-text-muted mt-5 leading-relaxed">
              You leave with a dozen open tabs and nothing decided. You go to
              sleep on it. Two weeks later the cart expires and the problem
              you were trying to solve is still there.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.25 }}
          >
            <p className="font-mono text-[10px] tracking-[0.32em] uppercase text-accent-deep mb-4">
              ◇ The new way
            </p>
            {/* The interior — warm, single, considered. Direct contrast
                to the warehouse above. */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl mb-6 border border-border shadow-[var(--shadow-card)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/interior-scene.png"
                alt=""
                aria-hidden
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Subtle warm-amber tint to reinforce the warmth */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 0%, rgba(255,200,140,0.08) 100%)",
                }}
              />
            </div>
            <p className="font-serif italic text-text text-xl sm:text-2xl leading-snug">
              You tell us what you&apos;re trying to do. We listen. We choose.
              We commit to a plan.
            </p>
            <p className="text-text-muted mt-5 leading-relaxed">
              Five products instead of five-hundred. The why behind each one,
              in plain language. From any brand, anywhere — we don&apos;t care
              who pays for shelf space, because we don&apos;t have a shelf.
            </p>
          </motion.div>
        </div>

        {/* Pull quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 1, delay: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
          className="mt-32 sm:mt-40 relative"
        >
          <span
            aria-hidden
            className="absolute -top-12 left-0 font-serif italic text-accent-deep/30 select-none"
            style={{ fontSize: "clamp(6rem, 12vw, 10rem)", lineHeight: 0.6 }}
          >
            &ldquo;
          </span>
          <blockquote
            className="font-serif italic text-text max-w-4xl"
            style={{
              fontSize: "clamp(2rem, 5.5vw, 4.25rem)",
              lineHeight: 1.04,
              letterSpacing: "-0.015em",
            }}
          >
            Choice is not a feature. It&apos;s a tax.{" "}
            <span className="aurora-text">We pay it for you.</span>
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}


/* ───────────────────────── 03 · The Four Acts ──────────────────────── */

const ACTS = [
  {
    roman: "I",
    title: "The approach",
    line: "You arrive. You tell us what you're trying to do.",
    body: "One line, one paragraph, whatever you've got. We don't need a brief — we'll ask.",
    image: "/generated/vignette-act-i-approach-1.png",
  },
  {
    roman: "II",
    title: "The desk",
    line: "The concierge asks a few questions. The fewer, the better.",
    body: "If we have what we need from your first message, we skip ahead. We're not here to make you fill out a form.",
    image: "/generated/vignette-act-ii-desk-1.png",
  },
  {
    roman: "III",
    title: "The exhibit",
    line: "We commit to a plan. Real products, real prices, the why behind each one.",
    body: "Five to twenty items, grouped by what they're for. Each piece on its own plinth.",
    image: "/generated/vignette-act-iii-exhibit-1.png",
  },
  {
    roman: "IV",
    title: "The takeaway",
    line: "You leave with a list. You buy from wherever you like.",
    body: "We don't take payment. We earn a small affiliate cut from Amazon when you click through, and that's it.",
    image: "/generated/vignette-act-iv-takeaway-1.png",
  },
];

function FourActsSection() {
  return (
    <section className="relative py-32 sm:py-44 lg:py-56 overflow-hidden grain">
      {/* Mint wash */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, var(--bg) 0%, rgba(190,230,210,0.4) 20%, rgba(252,250,245,0.95) 60%, var(--bg) 100%)",
        }}
      />

      {/* Mint + yellow blob duo */}
      <span
        aria-hidden
        className="blob -z-10"
        style={{
          top: "5%",
          right: "-15%",
          width: "55vw",
          height: "55vw",
          maxWidth: "780px",
          maxHeight: "780px",
          background:
            "radial-gradient(circle at 50% 50%, rgba(110, 200, 170, 0.4) 0%, rgba(168, 230, 207, 0.18) 50%, transparent 80%)",
          animation: "blob-drift-b 32s ease-in-out infinite",
        }}
      />
      <span
        aria-hidden
        className="blob blob-shape-b -z-10"
        style={{
          bottom: "10%",
          left: "-18%",
          width: "60vw",
          height: "60vw",
          maxWidth: "820px",
          maxHeight: "820px",
          background:
            "radial-gradient(circle at 50% 50%, rgba(255, 209, 102, 0.3) 0%, rgba(255, 235, 175, 0.15) 50%, transparent 80%)",
          animation: "blob-drift-c 36s ease-in-out infinite",
        }}
      />

      {/* Flowing SVG curve — connects the four acts visually */}
      <svg
        aria-hidden
        className="absolute pointer-events-none -z-10"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          top: "18%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "1px",
          height: "70%",
          overflow: "visible",
        }}
      >
        <path
          d="M 0 0 Q 8 25, 0 50 T 0 100"
          stroke="rgba(231, 105, 67, 0.18)"
          strokeWidth="1.5"
          strokeDasharray="6 8"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <SectionHeader number="03" eyebrow="The visit · 4 acts" />

        <motion.h2
          initial={{ opacity: 0, y: 26, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
          className="font-[family-name:var(--font-display)] text-text mt-10 tracking-[-0.025em]"
          style={{
            fontWeight: 600,
            fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
            lineHeight: 0.96,
          }}
        >
          Four acts.
          <br />
          <span className="font-serif italic font-normal text-text-muted">
            About six minutes.
          </span>
        </motion.h2>

        <div className="mt-24 space-y-12 lg:space-y-16">
          {ACTS.map((act, i) => (
            <ActRow key={act.roman} act={act} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ActRow({
  act,
  index,
}: {
  act: (typeof ACTS)[number];
  index: number;
}) {
  // Alternate image left/right per act for an editorial rhythm.
  const imageOnRight = index % 2 === 1;
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.9,
        delay: 0.05 + index * 0.06,
        ease: [0.2, 0.7, 0.2, 1],
      }}
      className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-center border-b border-border pb-16 lg:pb-24 last:border-b-0"
    >
      {/* Vignette image */}
      <div
        className={`relative aspect-[4/3] overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-card)] ${
          imageOnRight ? "lg:order-2" : ""
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={act.image}
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-[1.03]"
        />
        {/* Soft warm vignette to keep the photography editorial */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 55%, rgba(60,30,20,0.12) 100%)",
          }}
        />
        {/* Roman numeral overlay — large, set into the bottom-left
            corner of the image like a film frame number */}
        <span
          className="absolute bottom-4 left-5 font-serif italic text-white/95 leading-none select-none"
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3.75rem)",
            textShadow:
              "0 2px 24px rgba(0,0,0,0.4), 0 0 40px rgba(0,0,0,0.25)",
          }}
        >
          {act.roman}
        </span>
      </div>

      {/* Copy column */}
      <div className={imageOnRight ? "lg:order-1" : ""}>
        <p className="font-mono text-[10px] tracking-[0.32em] uppercase text-accent-deep mb-3 flex items-center gap-3">
          <span className="tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="h-px w-8 bg-accent-deep/40" />
          {act.title}
        </p>
        <p
          className="font-serif italic text-text leading-snug"
          style={{ fontSize: "clamp(1.5rem, 3.2vw, 2.5rem)" }}
        >
          {act.line}
        </p>
        <p className="text-text-muted mt-6 leading-relaxed max-w-md">
          {act.body}
        </p>
      </div>
    </motion.div>
  );
}

/* ───────────────────────── 04 · Carta ──────────────────────── */

const PRINCIPLES = [
  {
    n: "01",
    title: "The user, not the inventory",
    body: "We don't optimize for SKU count. We optimize for the next thing you'll actually do with what you buy.",
  },
  {
    n: "02",
    title: "From any brand, anywhere",
    body: "If the right thing for you is from a small Tokyo studio, an Italian workshop, or a single-product startup, that's what we'll recommend. No allegiance to a marketplace.",
  },
  {
    n: "03",
    title: "A plan, not a search result",
    body: "Ten items chosen and defended — not ten thousand sorted by price. Choice has a cost and we'd rather you spend that energy on the doing, not the picking.",
  },
  {
    n: "04",
    title: "Real products. Real prices.",
    body: "Every item we name is a real, buyable product. We don't take payment. We earn a small affiliate share when you buy through Amazon, and we tell you that here so it's never a surprise.",
  },
];

function CartaSection() {
  return (
    <section
      className="relative py-32 sm:py-44 lg:py-56 overflow-hidden grain"
      style={{ background: "#0c0d11", color: "#fcfaf5" }}
    >
      {/* Deep midnight wash with subtle aurora glow from below */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 80% 100%, rgba(231, 105, 67, 0.18) 0%, transparent 55%), radial-gradient(ellipse at 10% 0%, rgba(120, 100, 200, 0.18) 0%, transparent 50%)",
        }}
      />

      {/* Coral blob — bottom right, soft glow */}
      <span
        aria-hidden
        className="blob -z-0"
        style={{
          bottom: "-20%",
          right: "-15%",
          width: "60vw",
          height: "60vw",
          maxWidth: "820px",
          maxHeight: "820px",
          background:
            "radial-gradient(circle at 50% 50%, rgba(231, 105, 67, 0.35) 0%, rgba(255, 140, 94, 0.15) 50%, transparent 80%)",
          animation: "blob-drift-a 34s ease-in-out infinite",
        }}
      />

      {/* Lavender blob — top left */}
      <span
        aria-hidden
        className="blob blob-shape-c -z-0"
        style={{
          top: "-10%",
          left: "-15%",
          width: "50vw",
          height: "50vw",
          maxWidth: "700px",
          maxHeight: "700px",
          background:
            "radial-gradient(circle at 50% 50%, rgba(160, 140, 240, 0.32) 0%, rgba(197, 184, 255, 0.14) 50%, transparent 80%)",
          animation: "blob-drift-b 38s ease-in-out infinite",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 z-10">
        {/* Custom dark-mode section header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex items-baseline gap-4 sm:gap-6"
        >
          <span
            className="font-mono text-[11px] tracking-[0.32em] uppercase text-accent tabular-nums"
            style={{ fontWeight: 500 }}
          >
            04
          </span>
          <span className="h-px flex-1 bg-white/15" />
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.32em] uppercase text-white/55">
            ◇ Carta · what we believe
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 26, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
          className="font-[family-name:var(--font-display)] mt-10 tracking-[-0.035em]"
          style={{
            fontWeight: 700,
            fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
            lineHeight: 0.94,
            color: "#fcfaf5",
          }}
        >
          Four principles.
          <br />
          <span style={{ color: "rgba(252, 250, 245, 0.45)" }}>
            Posted on the wall.
          </span>
        </motion.h2>

        <div className="mt-20 lg:mt-28 space-y-10 lg:space-y-14">
          {PRINCIPLES.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.85,
                delay: 0.05 + i * 0.07,
                ease: [0.2, 0.7, 0.2, 1],
              }}
              className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-6 lg:gap-16 items-baseline pb-10 lg:pb-14 last:border-b-0"
              style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}
            >
              <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-accent tabular-nums lg:pt-3">
                {p.n}
              </span>
              <h3
                className="font-[family-name:var(--font-display)] leading-snug"
                style={{
                  fontSize: "clamp(1.75rem, 4.2vw, 3.25rem)",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: "#fcfaf5",
                }}
              >
                {p.title}
              </h3>
              <p
                className="text-base leading-relaxed max-w-md lg:text-right"
                style={{ color: "rgba(252, 250, 245, 0.6)" }}
              >
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── 05 · Final CTA ──────────────────────── */

function FinalCtaSection({
  draft,
  setDraft,
  onSubmit,
}: {
  draft: string;
  setDraft: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  return (
    <section className="relative py-32 sm:py-44 lg:py-56 overflow-hidden grain">
      {/* Departure scene — faint cinematic backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{
          backgroundImage: "url('/generated/hero-departure-1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
          opacity: 0.32,
        }}
      />

      {/* Closing aurora wash — all four accents */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, var(--bg) 0%, rgba(255,200,170,0.7) 18%, rgba(220,200,255,0.6) 42%, rgba(200,235,215,0.6) 66%, rgba(252,250,245,1) 100%)",
        }}
      />

      {/* Aurora trio — three soft blobs in the brand colors */}
      <span
        aria-hidden
        className="blob -z-10"
        style={{
          top: "10%",
          left: "-12%",
          width: "45vw",
          height: "45vw",
          maxWidth: "640px",
          maxHeight: "640px",
          background:
            "radial-gradient(circle at 50% 50%, rgba(255, 140, 94, 0.4) 0%, transparent 70%)",
          animation: "blob-drift-a 30s ease-in-out infinite",
        }}
      />
      <span
        aria-hidden
        className="blob blob-shape-b -z-10"
        style={{
          top: "20%",
          right: "-10%",
          width: "42vw",
          height: "42vw",
          maxWidth: "600px",
          maxHeight: "600px",
          background:
            "radial-gradient(circle at 50% 50%, rgba(197, 184, 255, 0.4) 0%, transparent 70%)",
          animation: "blob-drift-b 34s ease-in-out infinite",
        }}
      />
      <span
        aria-hidden
        className="blob blob-shape-c -z-10"
        style={{
          bottom: "5%",
          left: "30%",
          width: "40vw",
          height: "40vw",
          maxWidth: "560px",
          maxHeight: "560px",
          background:
            "radial-gradient(circle at 50% 50%, rgba(168, 230, 207, 0.4) 0%, transparent 70%)",
          animation: "blob-drift-c 38s ease-in-out infinite",
        }}
      />

      <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 text-center relative">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="font-mono text-[10px] sm:text-[11px] tracking-[0.32em] uppercase text-accent-deep mb-6 inline-flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent pulse-glow" />
          Whenever you&apos;re ready
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
          className="font-[family-name:var(--font-display)] text-text tracking-[-0.025em]"
          style={{
            fontWeight: 600,
            fontSize: "clamp(2.5rem, 8vw, 6rem)",
            lineHeight: 0.96,
          }}
        >
          So — what are
          <br />
          <span className="aurora-text font-serif italic font-normal">
            you trying to do?
          </span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-12 max-w-2xl mx-auto"
        >
          <form onSubmit={onSubmit}>
            <BrassPlacardSlim
              ref={textareaRef}
              value={draft}
              onChange={setDraft}
            />
          </form>
          <p className="mt-5 font-mono text-[10px] tracking-[0.22em] uppercase text-text-deep-muted">
            Or scroll back to the door ↑
          </p>
        </motion.div>
      </div>
    </section>
  );
}

const BrassPlacardSlim = forwardRef<
  HTMLTextAreaElement,
  { value: string; onChange: (v: string) => void }
>(function BrassPlacardSlimInner({ value, onChange }, ref) {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-3 rounded-3xl blur-2xl opacity-70"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,140,94,0.25) 0%, rgba(197,184,255,0.25) 50%, rgba(168,230,207,0.25) 100%)",
        }}
      />
      <div className="relative bg-bg-elevated border border-border rounded-2xl pl-5 pr-2 py-2 shadow-[var(--shadow-card)] focus-within:border-accent focus-within:shadow-[var(--shadow-glow)] transition-all flex items-center gap-3">
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              (e.currentTarget.form as HTMLFormElement)?.requestSubmit();
            }
          }}
          placeholder="One sentence. Anything."
          rows={1}
          className="flex-1 bg-transparent border-0 outline-none resize-none py-2 text-base sm:text-lg text-text placeholder:text-text-deep-muted leading-tight"
          style={{ minHeight: "2.5rem" }}
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.16em] disabled:opacity-30 disabled:cursor-not-allowed transition-opacity shrink-0"
          style={{ fontWeight: 600 }}
        >
          <span
            className="relative inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, var(--accent) 0%, var(--accent-deep) 100%)",
              boxShadow:
                "0 4px 16px rgba(231, 105, 67, 0.35), 0 0 24px rgba(255, 140, 94, 0.2)",
            }}
          >
            Begin
            <span aria-hidden>→</span>
          </span>
        </button>
      </div>
    </div>
  );
});

/* ───────────────────────── Footer ──────────────────────── */

function ClosingFooter() {
  return (
    <footer className="relative border-t border-border pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12 md:gap-16">
          {/* Logo + tagline */}
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <span className="relative inline-flex items-center justify-center w-7 h-7 rounded-lg bg-text">
                <span
                  className="absolute inset-[3px] rounded-md"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 50%, var(--accent-3) 100%)",
                  }}
                />
              </span>
              <span
                className="font-[family-name:var(--font-display)] text-base text-text tracking-tight"
                style={{ fontWeight: 600 }}
              >
                Store of the Future
              </span>
            </div>
            <p className="font-serif italic text-text text-xl leading-snug max-w-xs">
              The user, not the inventory.
            </p>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-text-deep-muted mt-5">
              An AI atelier · Est. 2026
              <br />
              Vancouver, BC
            </p>
          </div>

          <FooterColumn
            label="The store"
            items={[
              "The thesis",
              "Four acts",
              "Carta",
              "Recent plans",
            ]}
          />
          <FooterColumn
            label="Ways in"
            items={["Reset a room", "Outfit a baby", "Train for a race", "Upgrade coffee"]}
          />
          <FooterColumn
            label="Quiet hours"
            items={["About", "Affiliate disclosure", "Privacy", "Contact"]}
          />
        </div>

        {/* Bottom strip */}
        <div className="mt-20 pt-8 border-t border-border flex flex-col sm:flex-row justify-between gap-4 font-mono text-[10px] tracking-[0.22em] uppercase text-text-deep-muted">
          <span>© 2026 Store of the Future · Made with care in Vancouver</span>
          <span className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-3 pulse-glow" />
            Live · v0.1 / 2026
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  label,
  items,
}: {
  label: string;
  items: string[];
}) {
  return (
    <div>
      <p className="font-mono text-[10px] tracking-[0.32em] uppercase text-text-deep-muted mb-5">
        {label}
      </p>
      <ul className="space-y-3">
        {items.map((it) => (
          <li
            key={it}
            className="text-text-muted hover:text-text transition-colors text-sm cursor-pointer"
          >
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────────────────────── Shared section header ──────────────────────── */

function SectionHeader({
  number,
  eyebrow,
}: {
  number: string;
  eyebrow: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="flex items-baseline gap-4 sm:gap-6"
    >
      <span
        className="font-mono text-[11px] tracking-[0.32em] uppercase text-accent-deep tabular-nums"
        style={{ fontWeight: 500 }}
      >
        {number}
      </span>
      <span className="h-px flex-1 bg-border" />
      <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.32em] uppercase text-text-deep-muted">
        ◇ {eyebrow}
      </span>
    </motion.div>
  );
}

