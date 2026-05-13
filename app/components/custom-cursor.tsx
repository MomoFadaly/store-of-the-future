"use client";

import { useEffect, useState } from "react";

/**
 * A coral-tinted custom cursor that's actually visible on a cream
 * background. Outer ring expands and shifts color when over an
 * interactive element; the inner dot disappears in that state so the
 * ring expansion reads cleanly. Press shrinks the ring.
 *
 * Hidden on touch devices and when the user prefers reduced motion.
 */
export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setEnabled(true);
    document.documentElement.classList.add("cursor-custom");

    function onMove(e: MouseEvent) {
      setPos({ x: e.clientX, y: e.clientY });
      const t = e.target as Element | null;
      // Guard against synthetic events whose target isn't a real
      // Element (e.g. test events dispatched on window/document).
      const interactive =
        t && typeof t.closest === "function"
          ? !!t.closest(
              'a, button, [role="button"], [data-cursor="hover"], textarea, input, label'
            )
          : false;
      setHovering(interactive);
    }
    function onDown() {
      setPressed(true);
    }
    function onUp() {
      setPressed(false);
    }
    function onLeave() {
      setEnabled(false);
    }
    function onEnter() {
      setEnabled(true);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("cursor-custom");
    };
  }, []);

  if (!enabled) return null;

  const ringSize = pressed ? 22 : hovering ? 44 : 28;
  const dotSize = hovering ? 0 : 5;

  return (
    <>
      {/* Outer ring — coral hairline, expands on hover, shrinks on
          press. Slight follow lag for a hand-drawn feel. */}
      <div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          transition: "transform 90ms cubic-bezier(0.2, 0.7, 0.2, 1)",
        }}
      >
        <div
          className="rounded-full transition-all duration-200 ease-out"
          style={{
            width: `${ringSize}px`,
            height: `${ringSize}px`,
            transform: "translate(-50%, -50%)",
            border: `1.5px solid ${hovering ? "rgba(231, 105, 67, 0.95)" : "rgba(231, 105, 67, 0.6)"}`,
            background: hovering
              ? "rgba(255, 140, 94, 0.08)"
              : "transparent",
            boxShadow: hovering
              ? "0 0 18px rgba(255, 140, 94, 0.35), inset 0 0 8px rgba(255, 140, 94, 0.15)"
              : "0 0 8px rgba(231, 105, 67, 0.22)",
          }}
        />
      </div>

      {/* Inner dot — coral fill, instant follow. Hides when over
          interactive elements. */}
      <div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px)`,
        }}
      >
        <div
          className="rounded-full transition-all duration-150"
          style={{
            width: `${dotSize}px`,
            height: `${dotSize}px`,
            transform: "translate(-50%, -50%)",
            background: "var(--accent-deep)",
            boxShadow: "0 0 6px rgba(231, 105, 67, 0.6)",
            opacity: dotSize === 0 ? 0 : 1,
          }}
        />
      </div>
    </>
  );
}
