"use client";

import { motion } from "framer-motion";

// Light-mode ambient — three large drifting pastel auroras + a few small
// floating accents. Used on every page so the world feels alive.
export function AmbientBg() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden -z-10"
    >
      {/* Base */}
      <div className="absolute inset-0 bg-bg" />

      {/* Three large auroras drifting at different periods */}
      <motion.div
        className="absolute -top-[20%] -left-[10%] w-[90vmin] h-[90vmin] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,140,94,0.32) 0%, rgba(255,140,94,0) 60%)",
          filter: "blur(60px)",
        }}
        animate={{
          x: [0, 80, -30, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[5%] -right-[15%] w-[100vmin] h-[100vmin] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(197,184,255,0.34) 0%, rgba(197,184,255,0) 60%)",
          filter: "blur(60px)",
        }}
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 40, -30, 0],
          scale: [1, 1.1, 0.92, 1],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-[30%] left-[20%] w-[80vmin] h-[80vmin] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(168,230,207,0.30) 0%, rgba(168,230,207,0) 60%)",
          filter: "blur(60px)",
        }}
        animate={{
          x: [0, 40, -50, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.12, 0.95, 1],
        }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Smaller floating accent — warm yellow */}
      <motion.div
        className="absolute top-[60%] right-[20%] w-[40vmin] h-[40vmin] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,209,102,0.20) 0%, rgba(255,209,102,0) 60%)",
          filter: "blur(40px)",
        }}
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 25, -15, 0],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating particles — tiny lights drifting upward like the boutique
          interior catches dust in a sunbeam */}
      <Particles />
    </div>
  );
}

function Particles() {
  // 14 tiny particles at randomized but stable positions
  const particles = [
    { x: 10, delay: 0, duration: 18 },
    { x: 22, delay: 3, duration: 22 },
    { x: 35, delay: 6, duration: 16 },
    { x: 48, delay: 1, duration: 20 },
    { x: 58, delay: 8, duration: 24 },
    { x: 70, delay: 4, duration: 18 },
    { x: 82, delay: 9, duration: 22 },
    { x: 92, delay: 2, duration: 20 },
    { x: 15, delay: 11, duration: 26 },
    { x: 40, delay: 14, duration: 18 },
    { x: 65, delay: 7, duration: 22 },
    { x: 88, delay: 13, duration: 20 },
    { x: 28, delay: 16, duration: 24 },
    { x: 75, delay: 19, duration: 18 },
  ];
  return (
    <>
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white/40"
          style={{ left: `${p.x}%`, bottom: "-2%" }}
          animate={{
            y: ["0vh", "-120vh"],
            opacity: [0, 0.6, 0.6, 0],
            x: [0, 20, -15, 10],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.1, 0.9, 1],
          }}
        />
      ))}
    </>
  );
}
