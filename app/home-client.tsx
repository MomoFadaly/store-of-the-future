"use client";

import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { AmbientBg } from "./components/ambient-bg";
import { CustomCursor } from "./components/custom-cursor";
import { DoorTransition } from "./components/door-transition";
import { IntroHero } from "./components/intro-hero";
import { InterviewView } from "./components/interview-view";
import { type ExampleCard } from "./components/live-examples";
import { PlanView } from "./components/plan-view";
import { SafetyView } from "./components/safety-view";
import type { ChatMessage, PlanResponse } from "@/lib/types";

type Phase =
  | "intro"
  | "interviewing"
  | "synthesizing"
  | "plan"
  | "safety"
  | "error";

const STORAGE_KEY = "store-of-the-future-v1";
const SYNTHESIZE_SENTINEL = "<<SYNTHESIZE>>";
const SAFETY_SENTINEL = "<<SAFETY>>";
const STREAM_ERROR_SENTINEL = "[STREAM-ERROR]:";

interface PersistedState {
  phase: Phase;
  messages: ChatMessage[];
  plan: PlanResponse | null;
}

export default function HomeClient({
  examples,
}: {
  examples: ExampleCard[];
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [errorText, setErrorText] = useState("");
  const [streamingText, setStreamingText] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [safetyMessage, setSafetyMessage] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [lastRefinement, setLastRefinement] = useState("");
  const [showDoorTransition, setShowDoorTransition] = useState(false);
  const prevPhaseRef = useRef<Phase>("intro");

  // The Door Opens — Act 2. Fires exactly when we move from the
  // storefront (intro) into the concierge desk (interviewing) for the
  // first time. The DoorTransition mounts, plays for 1.2s on top of
  // everything else, then unmounts itself via its onComplete callback.
  useEffect(() => {
    if (prevPhaseRef.current === "intro" && phase === "interviewing") {
      setShowDoorTransition(true);
    }
    prevPhaseRef.current = phase;
  }, [phase]);

  // Restore from localStorage on first mount. Strict-mode-safe: the read is
  // idempotent — if it runs twice, the same setState calls produce the same
  // state. `hydrated` flips after this fires once so the persist effect
  // doesn't write back the initial pre-restore state.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as PersistedState;
        if (data.phase === "plan" && data.plan) {
          setPhase("plan");
          setMessages(data.messages ?? []);
          setPlan(data.plan);
        } else if (
          data.phase === "interviewing" &&
          data.messages?.length
        ) {
          setPhase("interviewing");
          setMessages(data.messages);
        }
      }
    } catch {
      // Ignore parse failures.
    }
    setHydrated(true);
  }, []);

  // Persist on state change — only after hydration so we don't blow away
  // saved state with the initial defaults.
  useEffect(() => {
    if (!hydrated) return;
    if (phase === "intro" && messages.length === 0 && !plan) return;
    // Do not persist transient/safety phase — fresh reload should land cleanly.
    if (phase === "safety" || phase === "error" || phase === "synthesizing") {
      return;
    }
    try {
      const data: PersistedState = { phase, messages, plan };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Quota exceeded or no localStorage — ignore.
    }
  }, [hydrated, phase, messages, plan]);

  async function runInterviewTurn(nextMessages: ChatMessage[]) {
    setIsWaiting(true);
    setStreamingText("");
    let fullText = "";
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(errBody || `HTTP ${res.status}`);
      }
      if (!res.body) throw new Error("No response body.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        // Hide streaming display when we recognize a control marker prefix —
        // SAFETY / SYNTHESIZE / STREAM_ERROR sentinels are internal signals,
        // not user-facing text. The end-of-stream handler routes them.
        const lookingLikeSentinel = /^\s*<</.test(fullText);
        setStreamingText(lookingLikeSentinel ? "" : fullText);
      }

      // Stream complete. Check for error sentinel.
      if (fullText.includes(STREAM_ERROR_SENTINEL)) {
        const [, err] = fullText.split(STREAM_ERROR_SENTINEL);
        throw new Error(err.trim());
      }

      const trimmed = fullText.trim();
      setStreamingText("");
      setIsWaiting(false);

      if (trimmed.startsWith(SAFETY_SENTINEL)) {
        const safetyText = trimmed.slice(SAFETY_SENTINEL.length).trim();
        setSafetyMessage(
          safetyText ||
            "What you're carrying matters. Before anything else, please reach out to someone who can help right now."
        );
        setPhase("safety");
        return;
      }

      if (trimmed.startsWith(SYNTHESIZE_SENTINEL)) {
        setPhase("synthesizing");
        await runPlanSynthesis(nextMessages);
        return;
      }

      setMessages([...nextMessages, { role: "assistant", content: trimmed }]);
    } catch (error) {
      setStreamingText("");
      setIsWaiting(false);
      setErrorText(
        error instanceof Error ? error.message : "Something went wrong."
      );
      setPhase("error");
    }
  }

  async function runPlanSynthesis(transcript: ChatMessage[]) {
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: transcript }),
      });
      if (!res.ok) {
        const err = await res
          .json()
          .catch(() => ({ error: "Request failed." }));
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }
      const result = (await res.json()) as PlanResponse;
      setPlan(result);
      setPhase("plan");
    } catch (error) {
      setErrorText(
        error instanceof Error ? error.message : "Something went wrong."
      );
      setPhase("error");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (isWaiting) return;
    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(nextMessages);
    setDraft("");
    if (phase === "intro") setPhase("interviewing");
    await runInterviewTurn(nextMessages);
  }

  function reset() {
    setMessages([]);
    setDraft("");
    setPlan(null);
    setErrorText("");
    setStreamingText("");
    setIsWaiting(false);
    setSafetyMessage("");
    setIsRefining(false);
    setLastRefinement("");
    setPhase("intro");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  async function runRefinement(refinement: string) {
    if (!plan || isRefining) return;
    const trimmed = refinement.trim();
    if (!trimmed) return;
    setIsRefining(true);
    setLastRefinement(trimmed);
    try {
      const res = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages,
          current_plan: plan,
          refinement: trimmed,
        }),
      });
      if (!res.ok) {
        const err = await res
          .json()
          .catch(() => ({ error: "Request failed." }));
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }
      const result = (await res.json()) as PlanResponse;
      setPlan(result);
      setMessages([...messages, { role: "user", content: trimmed }]);
    } catch (error) {
      setErrorText(
        error instanceof Error ? error.message : "Something went wrong."
      );
      setPhase("error");
    } finally {
      setIsRefining(false);
    }
  }

  function continueAnyway() {
    // Drop the last user message (the one that triggered safety routing) so
    // the system isn't stuck on it, but keep prior context. If there's nothing
    // before it, just reset.
    setSafetyMessage("");
    if (messages.length <= 1) {
      reset();
      return;
    }
    setMessages(messages.slice(0, -1));
    setPhase("interviewing");
  }

  // Until hydration completes we render nothing — this prevents
  // AnimatePresence from mounting the intro view first, then trying to
  // swap it for plan/interview when localStorage restores. The swap
  // gets stuck on the exit animation in some cases. By gating on
  // hydration, the first render after hydration already shows the
  // correct view — no transition needed, no stuck state.
  if (!hydrated) {
    return (
      <div className="min-h-[100dvh] bg-bg" aria-hidden />
    );
  }

  return (
    <>
      <CustomCursor />
      <AmbientBg />
      <AnimatePresence>
        {showDoorTransition && (
          <DoorTransition
            key="door-transition"
            onComplete={() => setShowDoorTransition(false)}
          />
        )}
      </AnimatePresence>
      {/* No outer AnimatePresence on phase changes — it was reliably
          hanging on the exit animation under React 19 / Next.js 16 dev,
          leaving the previous phase mounted at opacity:0 and the next
          phase mounted at opacity:0 too. Instead we render each phase
          directly. The cinematic transition between intro → interview
          is owned by DoorTransition (the warm-light bloom + cream wash
          covers the swap visually). Other transitions are quieter — the
          inner motion components on each view handle their own
          entrance. */}
      {phase === "intro" && (
        <motion.div
          key="intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <IntroHero
            draft={draft}
            setDraft={setDraft}
            onSubmit={handleSubmit}
            examples={examples}
          />
        </motion.div>
      )}

      {(phase === "interviewing" || phase === "synthesizing") && (
        <motion.div
          key="interview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <InterviewView
            messages={messages}
            draft={draft}
            setDraft={setDraft}
            onSubmit={handleSubmit}
            onReset={reset}
            isWaiting={isWaiting}
            isSynthesizing={phase === "synthesizing"}
            streamingText={streamingText}
          />
        </motion.div>
      )}

      {phase === "plan" && plan && (
        <motion.div
          key="plan"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <PlanView
            plan={plan}
            onReset={reset}
            onRefine={runRefinement}
            isRefining={isRefining}
            lastRefinement={lastRefinement}
          />
        </motion.div>
      )}

      {phase === "safety" && (
        <motion.div
          key="safety"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <SafetyView
            message={safetyMessage}
            onReset={reset}
            onContinue={continueAnyway}
          />
        </motion.div>
      )}

      {phase === "error" && (
        <motion.div
          key="error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-[100dvh] flex items-center justify-center px-6"
        >
          {errorText.includes("LIVE_PLANNER_OFFLINE") ? (
            // Special case: API key missing / live planner offline.
            // Don't expose dev errors; route to the pre-generated live examples instead.
            <div className="max-w-lg text-center">
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-accent mb-4">
                Live planner is resting
              </p>
              <p className="font-serif italic text-2xl text-text mb-3 leading-snug">
                The on-demand version is offline right now.
              </p>
              <p className="text-text-muted text-sm leading-relaxed mb-8">
                You can still see exactly how it works on the live examples below — real plans,
                same engine, generated end-to-end.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <a
                  href="/example/bedroom-reset"
                  className="font-mono text-[10px] tracking-[0.22em] uppercase border border-text text-text px-4 py-3 hover:bg-text hover:text-bg transition-colors"
                >
                  See bedroom reset →
                </a>
                <a
                  href="/example/newborn-essentials"
                  className="font-mono text-[10px] tracking-[0.22em] uppercase border border-border text-text-muted px-4 py-3 hover:border-text hover:text-text transition-colors"
                >
                  Newborn essentials →
                </a>
                <button
                  onClick={reset}
                  className="font-mono text-[10px] tracking-[0.22em] uppercase text-text-muted px-4 py-3 hover:text-text transition-colors"
                >
                  Start over
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-md">
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-accent mb-4">
                Something went wrong
              </p>
              <p className="font-serif italic text-2xl text-text mb-6 leading-snug">
                {errorText}
              </p>
              <button
                onClick={reset}
                className="font-mono text-[10px] tracking-[0.22em] uppercase border border-text text-text px-4 py-3 hover:bg-text hover:text-bg transition-colors"
              >
                Start over →
              </button>
            </div>
          )}
        </motion.div>
      )}
    </>
  );
}
