// Per-chapter background treatments. Each renders absolute-filled and reads
// theme colors from CSS variables (--bg, --accent), so they re-tint
// automatically when the stage swaps the active theme on chapter change.
//
// v1 backgrounds are CSS/SVG-only and intentionally subtle — they suggest the
// chapter's vibe without competing with the hero text. Richer per-chapter
// components (live avatar render for Embodied AI, real schematic for AI
// Systems, etc.) can replace any of these one at a time.

import type { CSSProperties } from "react";

const fillStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  zIndex: 0,
};

// Shared utility: glow under the wheel area so each background has at least
// one accent-tinted focal element. Position matches the dial center.
function AccentGlow({
  cx = "85%",
  cy = "50%",
  size = "60vmin",
  intensity = 0.22,
}: {
  cx?: string;
  cy?: string;
  size?: string;
  intensity?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: cx,
        top: cy,
        width: size,
        height: size,
        transform: "translate(-50%, -50%)",
        background: `radial-gradient(circle, color-mix(in srgb, var(--accent) ${intensity * 100}%, transparent) 0%, transparent 60%)`,
        pointerEvents: "none",
      }}
    />
  );
}

// 1. Dev Tooling — code-editor horizontal lines, faint.
function DevToolingBg() {
  return (
    <div style={fillStyle}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0, transparent 27px, color-mix(in srgb, var(--fg) 4%, transparent) 27px, color-mix(in srgb, var(--fg) 4%, transparent) 28px)",
        }}
      />
      <AccentGlow cx="92%" cy="50%" intensity={0.18} />
    </div>
  );
}

// 2. Blockchain Security — terminal scanlines, denser.
function BlockchainSecurityBg() {
  return (
    <div style={fillStyle}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0, transparent 3px, color-mix(in srgb, var(--accent) 4%, transparent) 3px, color-mix(in srgb, var(--accent) 4%, transparent) 4px)",
        }}
      />
      <AccentGlow cx="92%" cy="50%" intensity={0.16} />
    </div>
  );
}

// 3. Cost Engineering — architecture grid.
function CostEngineeringBg() {
  return (
    <div style={fillStyle}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--fg) 5%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--fg) 5%, transparent) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <AccentGlow cx="92%" cy="50%" intensity={0.16} />
    </div>
  );
}

// 4. Frontend — quiet noise. Intentionally low-energy (placeholder slot).
function FrontendBg() {
  return (
    <div style={fillStyle}>
      <AccentGlow cx="92%" cy="50%" intensity={0.1} />
    </div>
  );
}

// 5. Embodied AI — soft radial glow centered on dial, larger and richer.
function EmbodiedAIBg() {
  return (
    <div style={fillStyle}>
      <AccentGlow cx="92%" cy="50%" size="80vmin" intensity={0.32} />
      <AccentGlow cx="20%" cy="80%" size="50vmin" intensity={0.12} />
    </div>
  );
}

// 6. Assistive Tech — warm radial wash.
function AssistiveTechBg() {
  return (
    <div style={fillStyle}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 80% 60%, color-mix(in srgb, var(--accent) 14%, transparent) 0%, transparent 70%)",
        }}
      />
      <AccentGlow cx="20%" cy="20%" size="40vmin" intensity={0.06} />
    </div>
  );
}

// 7. Game Engineering — pixel grid, arcade flavor.
function GameEngineeringBg() {
  return (
    <div style={fillStyle}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--accent) 7%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--accent) 7%, transparent) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
          opacity: 0.6,
        }}
      />
      <AccentGlow cx="92%" cy="50%" intensity={0.18} />
    </div>
  );
}

// 8. Embedded Audio — waveform-like horizontal lines, irregular spacing.
function EmbeddedAudioBg() {
  return (
    <div style={fillStyle}>
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.5,
        }}
      >
        {Array.from({ length: 28 }).map((_, i) => {
          const y = 80 + i * 28;
          const amp = 4 + (i % 5) * 3;
          return (
            <path
              key={i}
              d={`M 0 ${y} Q 400 ${y - amp} 800 ${y} T 1600 ${y}`}
              stroke="color-mix(in srgb, var(--fg) 4%, transparent)"
              strokeWidth="1"
              fill="none"
            />
          );
        })}
      </svg>
      <AccentGlow cx="92%" cy="50%" intensity={0.16} />
    </div>
  );
}

// 9. AI Systems — schematic dot grid.
function AISystemsBg() {
  return (
    <div style={fillStyle}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 18%, transparent) 1px, transparent 1.5px)",
          backgroundSize: "32px 32px",
        }}
      />
      <AccentGlow cx="92%" cy="50%" size="70vmin" intensity={0.18} />
    </div>
  );
}

// Registry: slug → background component. Returns null for unknown slugs so
// the page degrades to plain bg color if a project's background isn't wired
// up.
export function BackgroundFor({ slug }: { slug: string }) {
  switch (slug) {
    case "dev-tooling":
      return <DevToolingBg />;
    case "blockchain-security":
      return <BlockchainSecurityBg />;
    case "cost-engineering":
      return <CostEngineeringBg />;
    case "frontend":
      return <FrontendBg />;
    case "embodied-ai":
      return <EmbodiedAIBg />;
    case "assistive-tech":
      return <AssistiveTechBg />;
    case "game-engineering":
      return <GameEngineeringBg />;
    case "embedded-audio":
      return <EmbeddedAudioBg />;
    case "ai-systems":
      return <AISystemsBg />;
    default:
      return null;
  }
}
