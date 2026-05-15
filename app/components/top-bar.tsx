"use client";

/**
 * Shared top bar for every in-app phase (interview, plan, safety).
 *
 * Two design fixes vs. the previous per-view headers:
 *
 *  1. Solid background — the older `bg-bg/80 backdrop-blur-xl` washed out
 *     against the textured interior-scene.png backdrop, leaving the brand
 *     and reset link nearly invisible. We keep a small bottom border for
 *     edge definition and skip the blur.
 *
 *  2. Reset is now a real pill button labeled "Start over" with a refresh
 *     icon — discoverable, recognizable, and (for non-intro phases) gated
 *     behind a confirmation so a stray click doesn't wipe a plan the user
 *     might still want.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  /** Small italic-mono sub-label after the brand. Empty string hides it. */
  subLabel?: string;
  /** When true, clicking Start over asks for confirmation first. */
  confirmReset?: boolean;
  onReset: () => void;
}

export function TopBar({ subLabel = "", confirmReset = true, onReset }: Props) {
  const [confirming, setConfirming] = useState(false);

  function handleResetClick() {
    if (!confirmReset) {
      onReset();
      return;
    }
    if (confirming) {
      onReset();
      setConfirming(false);
    } else {
      setConfirming(true);
      // Auto-cancel the confirmation if not used within 4s
      window.setTimeout(() => setConfirming(false), 4000);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg px-6 sm:px-10 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="relative inline-flex items-center justify-center w-7 h-7 rounded-lg bg-text shrink-0">
          <span
            className="absolute inset-[3px] rounded-md"
            style={{
              background:
                "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 50%, var(--accent-3) 100%)",
            }}
          />
        </span>
        <span
          className="font-[family-name:var(--font-display)] text-base text-text tracking-tight truncate"
          style={{ fontWeight: 600 }}
        >
          Store of the Future
        </span>
        {subLabel && (
          <span className="hidden sm:inline font-mono text-[10px] tracking-[0.22em] uppercase text-text-muted ml-2 truncate">
            / {subLabel}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <AnimatePresence mode="wait" initial={false}>
          {confirming ? (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-2"
            >
              <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted">
                Lose this plan?
              </span>
              <button
                onClick={() => setConfirming(false)}
                className="font-mono text-[11px] uppercase tracking-[0.14em] px-3 py-1.5 rounded-full text-text-muted hover:text-text hover:bg-bg-elevated transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetClick}
                className="font-mono text-[11px] uppercase tracking-[0.14em] px-3.5 py-1.5 rounded-full bg-text text-bg hover:opacity-90 transition-opacity"
              >
                Yes, start over
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="reset"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={handleResetClick}
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] px-3.5 py-1.5 rounded-full border border-border text-text hover:bg-bg-elevated transition-colors"
              aria-label="Start over with a new conversation"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 12a9 9 0 1 0 3-6.7" />
                <polyline points="3 4 3 10 9 10" />
              </svg>
              Start over
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
