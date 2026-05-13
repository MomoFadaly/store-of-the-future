"use client";

import { motion } from "framer-motion";

interface SafetyViewProps {
  message: string;
  onReset: () => void;
  onContinue: () => void;
}

interface Resource {
  label: string;
  contact: string;
  description: string;
  href?: string;
}

interface ResourceGroup {
  scope: string;
  resources: Resource[];
}

const RESOURCE_GROUPS: ResourceGroup[] = [
  {
    scope: "Worldwide",
    resources: [
      {
        label: "Find a Helpline",
        contact: "findahelpline.com",
        description:
          "1,500+ free, confidential crisis lines in 130+ countries — chat, text, or phone",
        href: "https://findahelpline.com",
      },
    ],
  },
  {
    scope: "US & Canada",
    resources: [
      {
        label: "988",
        contact: "Call or text 988",
        description:
          "Suicide & Crisis Lifeline · 24/7 · free · confidential",
        href: "tel:988",
      },
      {
        label: "Crisis Text Line",
        contact: "Text HOME to 741741",
        description: "Free, 24/7 crisis counseling via text",
        href: "sms:741741?body=HOME",
      },
      {
        label: "911",
        contact: "Call 911",
        description:
          "Medical emergencies · immediate danger · severe symptoms",
        href: "tel:911",
      },
      {
        label: "Domestic Violence Hotline",
        contact: "1-800-799-7233",
        description:
          "Confidential help for abuse or unsafe situations · 24/7",
        href: "tel:18007997233",
      },
      {
        label: "SAMHSA",
        contact: "1-800-662-4357",
        description:
          "Substance use and mental health treatment referral · free · 24/7",
        href: "tel:18006624357",
      },
    ],
  },
  {
    scope: "UK & Ireland",
    resources: [
      {
        label: "Samaritans",
        contact: "Call 116 123",
        description: "Free, 24/7 emotional support · confidential",
        href: "tel:116123",
      },
      {
        label: "Shout",
        contact: "Text SHOUT to 85258",
        description: "Free, 24/7 crisis counseling via text (UK)",
        href: "sms:85258?body=SHOUT",
      },
    ],
  },
  {
    scope: "Europe",
    resources: [
      {
        label: "EU Emergency Line",
        contact: "Call 112",
        description: "Medical, fire, police emergencies across the EU",
        href: "tel:112",
      },
    ],
  },
  {
    scope: "Australia",
    resources: [
      {
        label: "Lifeline Australia",
        contact: "Call 13 11 14",
        description: "Free, 24/7 crisis support",
        href: "tel:131114",
      },
    ],
  },
];

export function SafetyView({ message, onReset, onContinue }: SafetyViewProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col relative">
      {/* A quieter room — no scene behind, just the cream paper of the
          space itself. This is not a moment to dress up. */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, var(--bg) 0%, rgba(252,250,245,0.95) 60%, var(--bg) 100%)",
        }}
      />

      <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl px-6 sm:px-10 py-4 flex items-center justify-between">
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
          <span className="hidden sm:inline font-mono text-[10px] tracking-[0.22em] uppercase text-text-deep-muted ml-2">
            / a pause
          </span>
        </div>
        <button
          onClick={onReset}
          className="font-mono text-[11px] tracking-[0.18em] uppercase text-text-deep-muted hover:text-text transition-colors"
        >
          ← Step back outside
        </button>
      </header>

      <main className="flex-1 px-6 sm:px-10 py-16">
        <article className="max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="font-mono text-[11px] tracking-[0.22em] uppercase text-accent mb-6"
          >
            A pause — not a plan
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <p className="font-serif italic text-2xl sm:text-3xl text-text leading-snug max-w-2xl">
              {message}
            </p>
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
            className="h-px bg-border mt-12 origin-left"
          />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-12"
          >
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-text-deep-muted mb-8">
              If you want to talk to someone right now
            </p>
            {RESOURCE_GROUPS.map((group, gi) => (
              <div key={group.scope} className={gi > 0 ? "mt-10" : ""}>
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-accent mb-4">
                  · {group.scope}
                </p>
                <ul className="space-y-6">
                  {group.resources.map((r, i) => (
                    <motion.li
                      key={r.label}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.8 + gi * 0.15 + i * 0.05,
                      }}
                      className="grid sm:grid-cols-[1fr_auto] gap-3 sm:gap-8 items-baseline pb-5 border-b border-border last:border-b-0"
                    >
                      <div>
                        <p className="font-serif text-xl text-text">
                          {r.label}
                        </p>
                        <p className="text-sm text-text-muted mt-1">
                          {r.description}
                        </p>
                      </div>
                      {r.href ? (
                        <a
                          href={r.href}
                          target={
                            r.href.startsWith("http") ? "_blank" : undefined
                          }
                          rel={
                            r.href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="font-mono text-[11px] tracking-[0.18em] uppercase text-accent hover:underline"
                        >
                          {r.contact}
                        </a>
                      ) : (
                        <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-accent">
                          {r.contact}
                        </span>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="mt-16 flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={onReset}
              className="font-mono text-[10px] tracking-[0.22em] uppercase bg-text text-bg px-5 py-3 rounded-full hover:bg-accent-deep transition-colors"
            >
              Start a different conversation →
            </button>
            <button
              onClick={onContinue}
              className="font-mono text-[10px] tracking-[0.22em] uppercase text-text-deep-muted hover:text-text px-5 py-3 transition-colors"
            >
              Continue anyway
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.8 }}
            className="mt-16 text-[10px] font-mono tracking-[0.18em] uppercase text-text-deep-muted"
          >
            This site is a shopping tool, not a substitute for professional
            care.
          </motion.p>
        </article>
      </main>
    </div>
  );
}
