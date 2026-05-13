"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

interface DoorTransitionProps {
  onComplete: () => void;
}

/**
 * The Door Opens — Act 2.
 *
 * Played once, when the user has just submitted their first prompt and
 * we're moving from the storefront approach into the concierge desk.
 * 1.2 seconds. A warm light bursts from the door's position, expands
 * across the screen, blooms to a brief cream wash, then dissolves to
 * reveal the interior scene. The whole sequence reads as "you've
 * stepped inside."
 */
export function DoorTransition({ onComplete }: DoorTransitionProps) {
  useEffect(() => {
    const id = window.setTimeout(onComplete, 1300);
    return () => window.clearTimeout(id);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="fixed inset-0 z-[200] pointer-events-none overflow-hidden"
      aria-hidden
    >
      {/* The bloom — warm interior light expanding from the door's center
          (≈ 50% horizontal, 65% vertical of the storefront hero). */}
      <motion.div
        initial={{ scale: 0.05, opacity: 0 }}
        animate={{
          scale: [0.05, 0.6, 4.5, 14],
          opacity: [0, 1, 1, 0.6],
        }}
        transition={{
          duration: 1.25,
          times: [0, 0.18, 0.62, 1],
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="absolute"
        style={{
          left: "50%",
          top: "65%",
          width: "320px",
          height: "420px",
          marginLeft: "-160px",
          marginTop: "-210px",
          background:
            "radial-gradient(ellipse at center, rgba(255, 244, 220, 1) 0%, rgba(255, 220, 170, 0.95) 30%, rgba(255, 200, 140, 0.65) 55%, rgba(252, 250, 245, 0.25) 80%, transparent 100%)",
          borderRadius: "50% / 35%",
          filter: "blur(8px)",
          willChange: "transform, opacity",
        }}
      />

      {/* The flare — soft horizontal lens-flare ray to sell the "door
          ajar, light spilling out" moment. Crosses the bloom for ~0.4s. */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.2 }}
        animate={{ opacity: [0, 0.9, 0], scaleX: [0.2, 1.4, 2] }}
        transition={{ duration: 0.9, times: [0, 0.5, 1], ease: "easeOut" }}
        className="absolute left-0 right-0"
        style={{
          top: "calc(65% - 2px)",
          height: "4px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255, 235, 195, 0.0) 20%, rgba(255, 235, 195, 0.95) 50%, rgba(255, 235, 195, 0.0) 80%, transparent 100%)",
          filter: "blur(2px)",
          transformOrigin: "50% 50%",
          willChange: "transform, opacity",
        }}
      />

      {/* The wash — the screen fills with warm cream just before the
          interior scene takes over. Briefer than the bloom so we don't
          linger in white. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.92, 0] }}
        transition={{
          duration: 1.25,
          times: [0, 0.55, 0.78, 1],
          ease: "easeInOut",
        }}
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(255, 248, 235, 1) 0%, rgba(252, 250, 245, 1) 60%, var(--bg) 100%)",
          willChange: "opacity",
        }}
      />
    </motion.div>
  );
}
