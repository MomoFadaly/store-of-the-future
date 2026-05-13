"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import type React from "react";
import { HomeStory } from "./home-story";
import type { ExampleCard } from "./live-examples";

interface IntroHeroProps {
  draft: string;
  setDraft: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  examples?: ExampleCard[];
}

/**
 * Act 1 — The Approach.
 *
 * The storefront image is the world. It's contained inside a fixed
 * 16:9 "stage" that scales to cover the viewport — this is what makes
 * the iconic overlays (interior light flicker, NOW OPEN signal, door
 * hover zone) line up with the building at every viewport from 1280
 * up through ultrawide. Mouse position drives a subtle depth-parallax
 * so the scene feels alive before any input.
 *
 * Typography is the boldest move on the page — the hero line breaks
 * across the building intentionally, and "trying to do" trails off in
 * aurora italic at near-display scale.
 */
export function IntroHero({
  draft,
  setDraft,
  onSubmit,
  examples,
}: IntroHeroProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [doorHover, setDoorHover] = useState(false);
  // Normalized mouse position from -0.5 to +0.5 on each axis, relative
  // to viewport center. Drives the parallax layers below.
  const [mx, setMx] = useState(0);
  const [my, setMy] = useState(0);
  // Scroll progress over the first viewport — 0 at top, 1 by the time
  // user has scrolled one full viewport down. Drives the camera push.
  const [scrollT, setScrollT] = useState(0);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    function onMove(e: MouseEvent) {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      setMx(nx);
      setMy(ny);
    }
    function onScroll() {
      const t = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
      setScrollT(t);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  function handleDoorClick() {
    if (!draft.trim()) {
      textareaRef.current?.focus();
      return;
    }
    const form = textareaRef.current?.form;
    form?.requestSubmit();
  }

  return (
    <div className="relative bg-bg">
      <section className="relative h-[100dvh] min-h-[720px] overflow-hidden">
      {/* The stage — always 16:9, scaled to cover viewport. All visual
          elements that need to stay aligned with the building live
          inside this. */}
      <div
        ref={stageRef}
        className="absolute left-1/2 top-1/2 pointer-events-none"
        style={{
          width: "max(100vw, calc(100dvh * 16 / 9))",
          aspectRatio: "16 / 9",
          // Translate to center + scroll-driven camera push (1.0 → 1.08
          // as user scrolls through the first viewport). The translate
          // keeps the stage centered as it scales.
          transform: `translate(-50%, -50%) scale(${1 + scrollT * 0.08})`,
          transformOrigin: "50% 55%",
          transition:
            "transform 0.18s cubic-bezier(0.2, 0.7, 0.2, 1)",
        }}
      >
        {/* Sky parallax layer — drifts faintly with mouse, the slowest. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            transform: `translate3d(${mx * -12}px, ${my * -6}px, 0) scale(1.04)`,
            transition: "transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1)",
          }}
        >
          <img
            src="/storefront-hero.png"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover"
            style={{ animation: "scene-breath 60s ease-in-out infinite" }}
          />
        </div>

        {/* Interior warm-light pulse — sits where the glass facade is.
            Adds a "someone's home" feeling. */}
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            left: "20%",
            right: "20%",
            top: "32%",
            height: "32%",
            background:
              "radial-gradient(ellipse at center, rgba(255,200,140,0.22) 0%, rgba(255,180,120,0.08) 50%, transparent 80%)",
            mixBlendMode: "screen",
            animation: "interior-flicker 8s ease-in-out infinite",
            transform: `translate3d(${mx * 6}px, ${my * 4}px, 0)`,
            transition: "transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1)",
          }}
        />

        {/* Door glow — brightens dramatically when hovered. The building
            already has warm light spilling from the door; this amps it
            up cinematically. */}
        <div
          aria-hidden
          className="absolute pointer-events-none transition-all duration-700"
          style={{
            left: "44%",
            right: "44%",
            top: "44%",
            height: "32%",
            background: doorHover
              ? "radial-gradient(ellipse at center, rgba(255,210,150,0.55) 0%, rgba(255,180,120,0.28) 40%, transparent 75%)"
              : "radial-gradient(ellipse at center, rgba(255,210,150,0.18) 0%, transparent 70%)",
            mixBlendMode: "screen",
            filter: "blur(8px)",
          }}
        />

        {/* Cast light onto pavement when door is hovered — extends the
            spill all the way down to the foreground floor. */}
        <div
          aria-hidden
          className="absolute pointer-events-none transition-opacity duration-700"
          style={{
            left: "40%",
            right: "40%",
            top: "65%",
            height: "30%",
            opacity: doorHover ? 0.7 : 0.25,
            background:
              "radial-gradient(ellipse at center top, rgba(255,210,150,0.5) 0%, transparent 70%)",
            mixBlendMode: "screen",
            filter: "blur(12px)",
            transform: "scaleY(1.2)",
          }}
        />
      </div>

      {/* Reader scrim — strong cream wash that turns the lower 65% of
          the viewport into a near-solid reading surface for the
          editorial typography. This is non-negotiable for readability
          against an iridescent building, so the gradient ramps up
          faster and lands more opaque than the previous version. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          top: "30%",
          background:
            "linear-gradient(180deg, rgba(252,250,245,0) 0%, rgba(252,250,245,0.5) 18%, rgba(252,250,245,0.82) 38%, rgba(252,250,245,0.94) 60%, var(--bg) 100%)",
        }}
      />

      {/* Door interactive zone — outside the stage, positioned to match
          where the door visually appears on screen. Math: stage is
          centered, so the door's screen position is exactly its stage
          position when the stage = viewport. When stage > viewport, the
          door is still centered because the stage centers itself. */}
      <button
        type="button"
        aria-label="Enter the store"
        onMouseEnter={() => setDoorHover(true)}
        onMouseLeave={() => setDoorHover(false)}
        onClick={handleDoorClick}
        className="absolute focus:outline-none z-20"
        style={{
          left: "calc(50% - 6vw)",
          width: "12vw",
          top: "44%",
          height: "32%",
        }}
        data-cursor="hover"
      />

      {/* Floating NOW OPEN signal — drifts above the building in the
          dusk sky. Hovers, doesn't hang. Feels future-forward. */}
      <NowOpenSignal mx={mx} my={my} />

      {/* Header */}
      <Header />

      {/* Hero copy — sits in the pavement foreground, asymmetric, big.
          The typography is the brand here. */}
      <main className="relative z-10 h-full flex flex-col pointer-events-none">
        <div className="flex-1" />
        <div className="px-6 sm:px-10 lg:px-16 pb-8 sm:pb-10">
          <div className="max-w-7xl mx-auto">
            {/* Brand identity — single typographic system, no italic
                serif. Modern grotesque only, with weight + color +
                tracking doing the work. This is what real ecommerce
                does (Apple, Nike, Stripe, Aimé Leon Dore). */}
            <div
              className="text-center mb-9 sm:mb-11"
              style={{ animation: "fade-up 1.1s ease-out 0.25s both" }}
            >
              <div className="mb-4 inline-flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent pulse-glow" />
                <span
                  className="font-mono text-[10px] sm:text-[11px] tracking-[0.36em] uppercase text-text"
                >
                  Est. 2026 · Vancouver · Now open
                </span>
              </div>

              <h1
                className="font-[family-name:var(--font-display)] text-text leading-[0.92]"
                style={{
                  fontWeight: 700,
                  fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)",
                  letterSpacing: "-0.025em",
                }}
              >
                Store of the Future
              </h1>

              <p
                className="font-[family-name:var(--font-display)] text-text mt-4"
                style={{
                  fontWeight: 500,
                  fontSize: "clamp(0.95rem, 1.3vw, 1.2rem)",
                  letterSpacing: "-0.005em",
                }}
              >
                Built around the user.{" "}
                <span className="text-accent-deep">Not the inventory.</span>
              </p>
            </div>

            {/* The invitation — same typographic system, weight and
                color do the contrast work. No italic serif, no
                gradient — just confident grotesque type. */}
            <h2
              className="text-center text-text font-[family-name:var(--font-display)]"
              style={{
                animation: "fade-up 1.1s ease-out 0.5s both",
                fontWeight: 700,
                fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
                lineHeight: 0.94,
                letterSpacing: "-0.035em",
              }}
            >
              <span className="block">Tell us what you&apos;re</span>
              <span className="block text-accent-deep">trying to do.</span>
            </h2>

            {/* Subhead — quieter, lifts off the photo with a soft scrim
                via text-shadow only (no card behind it). */}
            <p
              className="text-text text-base sm:text-lg leading-relaxed max-w-xl mx-auto text-center mt-5 sm:mt-6 mb-7 sm:mb-8"
              style={{
                textShadow:
                  "0 1px 14px rgba(252, 250, 245, 0.9), 0 0 28px rgba(252, 250, 245, 0.6)",
                animation: "fade-up 1.1s ease-out 0.6s both",
              }}
            >
              We&apos;ll find the exact right things — from any brand,
              anywhere — and commit to a plan for you.
            </p>

            <form
              onSubmit={onSubmit}
              className="max-w-2xl mx-auto pointer-events-auto"
              style={{ animation: "fade-up 1.1s ease-out 0.8s both" }}
            >
              <BrassPlacard
                ref={textareaRef}
                value={draft}
                onChange={setDraft}
                disabled={false}
              />
            </form>
          </div>
        </div>
      </main>

      {/* Visitor ticker (lower-left) — pinned to the hero scene */}

      {/* Hero-scene mini-footer — just a quiet hairline at the bottom
          of the scene. The real footer lives at the end of the page,
          after HomeStory. A tiny chevron hints there's more below. */}
      <div className="absolute bottom-0 inset-x-0 z-20 px-6 sm:px-10 py-3 font-mono text-[10px] tracking-[0.22em] uppercase text-text-deep-muted flex justify-between items-center pointer-events-none">
        <span>The user, not the inventory</span>
        <span className="hidden sm:inline-flex items-center gap-2 opacity-80">
          <span>Scroll to read the thesis</span>
          <span aria-hidden className="inline-block animate-bounce text-base leading-none">
            ↓
          </span>
        </span>
      </div>
      </section>

      {/* Below-the-fold scroll narrative */}
      <HomeStory
        examples={examples}
        draft={draft}
        setDraft={setDraft}
        onSubmit={onSubmit}
      />
    </div>
  );
}

function Header() {
  return (
    <header className="absolute top-0 inset-x-0 z-50 px-6 sm:px-10 py-5 flex items-center justify-between pointer-events-auto">
      <div className="flex items-center gap-2.5">
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
      <span className="hidden sm:flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] uppercase text-text">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-3 pulse-glow" />
        Live · v0.1 / 2026
      </span>
    </header>
  );
}

/**
 * Floating "Now Open" indicator — drifts above the building in the
 * sky. Subtly tracks the mouse for depth.
 */
function NowOpenSignal({ mx, my }: { mx: number; my: number }) {
  return (
    <div
      className="absolute z-30 pointer-events-none"
      style={{
        left: "50%",
        top: "9%",
        transform: `translate(calc(-50% + ${mx * -14}px), ${my * -8}px)`,
        transition: "transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1)",
        animation: "sign-sway 6s ease-in-out infinite",
      }}
    >
      <div
        className="flex items-center gap-2 px-4 py-1.5 rounded-full shadow-lg"
        style={{
          background:
            "linear-gradient(135deg, var(--accent) 0%, var(--accent-deep) 100%)",
          boxShadow:
            "0 4px 16px rgba(231, 105, 67, 0.4), 0 0 40px rgba(255, 140, 94, 0.35)",
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-white pulse-glow" />
        <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-white font-semibold">
          Now open
        </span>
      </div>
    </div>
  );
}

const BrassPlacard = forwardRef<
  HTMLTextAreaElement,
  {
    value: string;
    onChange: (v: string) => void;
    disabled: boolean;
  }
>(function BrassPlacardInner({ value, onChange, disabled }, ref) {
  return (
    <div className="relative">
      {/* Soft glow halo behind the placard */}
      <div
        aria-hidden
        className="absolute -inset-3 rounded-3xl blur-2xl opacity-70"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,140,94,0.22) 0%, rgba(197,184,255,0.22) 50%, rgba(168,230,207,0.22) 100%)",
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
          placeholder="Fix my messy bedroom. Start running. Plan a trip…"
          rows={1}
          disabled={disabled}
          className="flex-1 bg-transparent border-0 outline-none resize-none py-2 text-base sm:text-lg text-text placeholder:text-text-deep-muted leading-tight"
          style={{ minHeight: "2.5rem" }}
        />
        <button
          type="submit"
          disabled={!value.trim() || disabled}
          className="group relative font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.16em] disabled:opacity-30 disabled:cursor-not-allowed transition-opacity shrink-0"
          style={{ fontWeight: 600 }}
        >
          <span
            className="relative inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl overflow-hidden text-white shadow-lg transition-shadow"
            style={{
              background:
                "linear-gradient(135deg, var(--accent) 0%, var(--accent-deep) 100%)",
              boxShadow:
                "0 4px 16px rgba(231, 105, 67, 0.35), 0 0 24px rgba(255, 140, 94, 0.2)",
            }}
          >
            <span className="relative">Begin</span>
            <span className="relative transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </button>
      </div>
      <p className="mt-3 text-center font-mono text-[10px] tracking-[0.2em] uppercase text-text-deep-muted">
        Press return · or click the door
      </p>
    </div>
  );
});
