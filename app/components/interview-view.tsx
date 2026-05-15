"use client";

import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/types";
import { TopBar } from "./top-bar";

interface InterviewViewProps {
  messages: ChatMessage[];
  draft: string;
  setDraft: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  isWaiting: boolean;
  isSynthesizing: boolean;
  streamingText: string;
}

const SYNTHESIS_PHRASES = [
  "Reading what you told me",
  "Walking the shelves in my head",
  "Choosing the right pieces",
  "Stitching the plan together",
  "Putting the kettle on, almost done",
];

/**
 * Act 3 — At the Concierge Desk.
 *
 * Quiet room. Interior scene faded behind the conversation. The
 * concierge speaks in italic serif at large size — questions feel
 * spoken, not posted. The user's replies sit smaller, in body text,
 * like the user's own voice in their own head. A "Concierge listening"
 * marker pulses at the top so the user knows someone is on the other
 * end of the room. When the concierge steps away to build the plan,
 * the page transitions into the Building Your Plan ceremony.
 */
export function InterviewView({
  messages,
  draft,
  setDraft,
  onSubmit,
  onReset,
  isWaiting,
  isSynthesizing,
  streamingText,
}: InterviewViewProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [synthPhraseIdx, setSynthPhraseIdx] = useState(0);

  useEffect(() => {
    if (!isWaiting && !isSynthesizing) {
      textareaRef.current?.focus();
    }
  }, [messages.length, isWaiting, isSynthesizing]);

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTo({
        top: scrollerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isWaiting, isSynthesizing, streamingText]);

  useEffect(() => {
    if (!isSynthesizing) return;
    const id = setInterval(() => {
      setSynthPhraseIdx((i) => (i + 1) % SYNTHESIS_PHRASES.length);
    }, 4200);
    return () => clearInterval(id);
  }, [isSynthesizing]);

  let userTurnCount = 0;
  let conciergeTurnCount = 0;
  const nextConciergeNumber = String(
    messages.filter((m) => m.role === "assistant").length + 1
  ).padStart(2, "0");

  const showThinking = isWaiting && streamingText.length === 0;
  const showStreaming = streamingText.length > 0 && !isSynthesizing;

  return (
    <div className="min-h-[100dvh] flex flex-col relative">
      {/* Interior scene — present but quiet. The user is INSIDE the
          boutique now. Slightly stronger than v1 so the room reads. */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 opacity-50"
        style={{
          backgroundImage: "url('/interior-scene.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(252,250,245,0.55) 0%, rgba(252,250,245,0.82) 55%, var(--bg) 100%)",
        }}
      />

      <TopBar
        subLabel="inside · at the desk"
        onReset={onReset}
        confirmReset={messages.length > 0}
      />

      <div ref={scrollerRef} className="flex-1 overflow-y-auto pb-48">
        <div className="max-w-3xl mx-auto px-6 sm:px-10 py-10 sm:py-14">
          {/* Concierge presence — small "someone is here with you" cue
              that lives above the dialogue. Slight float to feel alive. */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 flex items-center gap-3"
          >
            <span className="relative inline-flex items-center justify-center">
              <span
                className="absolute inline-flex w-7 h-7 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,140,94,0.25) 0%, transparent 65%)",
                  filter: "blur(2px)",
                }}
              />
              <span className="relative w-2 h-2 rounded-full bg-accent pulse-glow" />
            </span>
            <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-accent-deep">
              Concierge · listening
            </span>
            <span className="h-px flex-1 bg-border" />
            <span className="hidden sm:inline font-mono text-[10px] tracking-[0.22em] uppercase text-text-deep-muted">
              {messages.filter((m) => m.role === "user").length === 0
                ? "first turn"
                : `${messages.filter((m) => m.role === "user").length} ${messages.filter((m) => m.role === "user").length === 1 ? "reply" : "replies"}`}
            </span>
          </motion.div>

          <AnimatePresence initial={false}>
            {messages.map((m, i) => {
              if (m.role === "user") {
                userTurnCount += 1;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
                    className="mb-12 pl-6 sm:pl-10 border-l-2 border-accent/30"
                  >
                    <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-deep-muted mb-2">
                      You · {String(userTurnCount).padStart(2, "0")}
                    </p>
                    <p className="text-text text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
                      {m.content}
                    </p>
                  </motion.div>
                );
              }
              conciergeTurnCount += 1;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
                  className="mb-12"
                >
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-accent-deep mb-3">
                    Concierge · {String(conciergeTurnCount).padStart(2, "0")}
                  </p>
                  <p className="font-serif italic text-2xl sm:text-[28px] leading-snug text-text whitespace-pre-wrap">
                    {m.content}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {showThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-12"
            >
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-accent-deep mb-3 flex items-center gap-2">
                Concierge · {nextConciergeNumber}
                <PulsingDot />
              </p>
              <p className="font-serif italic text-2xl text-text-deep-muted">
                Reading what you said…
              </p>
            </motion.div>
          )}

          {showStreaming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="mb-12"
            >
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-accent-deep mb-3">
                Concierge · {nextConciergeNumber}
              </p>
              <p className="font-serif italic text-2xl sm:text-[28px] leading-snug text-text whitespace-pre-wrap">
                {streamingText}
                <CursorBlink />
              </p>
            </motion.div>
          )}

          {isSynthesizing && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-16 py-12 border-y border-accent/30 relative"
            >
              {/* Soft warm halo to suggest "the concierge has stepped
                  into the back room with a lamp" */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none -z-10"
                style={{
                  background:
                    "radial-gradient(ellipse at 30% 50%, rgba(255, 209, 150, 0.18) 0%, transparent 60%)",
                  filter: "blur(20px)",
                }}
              />
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent-deep mb-6 flex items-center gap-3">
                Concierge has stepped away
                <PulsingDot large />
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={synthPhraseIdx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.5 }}
                  className="font-serif italic text-3xl sm:text-4xl text-text leading-snug max-w-2xl"
                >
                  {SYNTHESIS_PHRASES[synthPhraseIdx]}…
                </motion.p>
              </AnimatePresence>
              <p className="mt-6 font-mono text-[10px] tracking-[0.22em] uppercase text-text-deep-muted">
                Usually under a minute · please stay on this page
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {!isSynthesizing && (
        <motion.form
          onSubmit={onSubmit}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-0 inset-x-0 border-t border-border bg-bg/75 backdrop-blur-xl shadow-[0_-4px_30px_rgba(0,0,0,0.08)]"
        >
          <div className="max-w-3xl mx-auto px-6 sm:px-10 py-4">
            <div className="flex items-end gap-3 glass rounded-2xl px-4 py-2 focus-within:border-accent transition-colors">
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSubmit(e as unknown as React.FormEvent);
                  }
                }}
                placeholder={
                  isWaiting
                    ? "…"
                    : messages.length === 0
                      ? "Tell the concierge what you're trying to do…"
                      : "Your reply…"
                }
                rows={1}
                disabled={isWaiting}
                className="flex-1 bg-transparent border-0 outline-none resize-none py-2.5 text-base text-text placeholder:text-text-deep-muted disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!draft.trim() || isWaiting}
                className="font-mono text-[10px] tracking-[0.22em] uppercase bg-text text-bg disabled:bg-border-strong disabled:text-text-deep-muted px-4 py-2.5 rounded-xl hover:bg-accent-deep transition-colors"
              >
                Send →
              </button>
            </div>
            <p className="mt-2 font-mono text-[10px] tracking-[0.22em] uppercase text-text-deep-muted text-center">
              Shift + Return for a new line · Return to send
            </p>
          </div>
        </motion.form>
      )}
    </div>
  );
}

function PulsingDot({ large = false }: { large?: boolean }) {
  return (
    <motion.span
      animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      className={`inline-block rounded-full bg-accent ${
        large ? "w-2.5 h-2.5" : "w-1.5 h-1.5"
      }`}
    />
  );
}

function CursorBlink() {
  return (
    <motion.span
      animate={{ opacity: [1, 1, 0, 0, 1] }}
      transition={{
        duration: 1,
        repeat: Infinity,
        times: [0, 0.4, 0.5, 0.9, 1],
      }}
      aria-hidden
      className="inline-block w-[0.4ch] -mb-[0.04em] ml-[0.06em] bg-accent align-baseline"
      style={{ height: "0.85em" }}
    />
  );
}
