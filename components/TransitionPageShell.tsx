"use client";

import type { CSSProperties, ReactNode } from "react";
import {
  TEXT_MS,
  TEXT_STAGGER_MS,
  useTransition,
} from "./TransitionShell";

// Shared shell for every page that lives behind a TransitionShell canvas
// (Currently Working, About, Case Study). Owns the scroll container, the
// dark-theme scrollbar styling, the sticky Back button, and sets the
// axis-driven CSS vars consumed by cwTextIn / cwTextOut keyframes.

const FG = "#efefec";
const FG_DIM = "color-mix(in srgb, #efefec 36%, transparent)";
const EASE = "cubic-bezier(.4,.05,.15,1)";
const DROP_PX = 44;

// Pixel offsets read by the global cwTextIn/cwTextOut keyframes via the
// --cw-x / --cw-y custom properties. Direction follows the canvas axis:
// text appears to come from the same side the canvas slid in from.
const AXIS_OFFSET: Record<"top" | "right" | "left", { x: number; y: number }> =
  {
    top: { x: 0, y: -DROP_PX },
    right: { x: DROP_PX, y: 0 },
    left: { x: -DROP_PX, y: 0 },
  };

// Pages call this to get the per-section animation style. Stagger index 0
// is the first element on the page; each subsequent index entries
// TEXT_STAGGER_MS later. During text-out everyone leaves together.
export function useDropStyle(): (index: number) => CSSProperties {
  const { phase } = useTransition();
  return (index: number) => {
    if (phase === "text-out") {
      return { animation: `cwTextOut ${TEXT_MS}ms ${EASE} forwards` };
    }
    return {
      animation: `cwTextIn ${TEXT_MS}ms ${EASE} ${index * TEXT_STAGGER_MS}ms both`,
    };
  };
}

export function TransitionPageShell({ children }: { children: ReactNode }) {
  const { phase, axis, navigate } = useTransition();
  const { x, y } = AXIS_OFFSET[axis];

  return (
    <div
      className="cw-scroll-shell"
      style={
        {
          "--cw-x": `${x}px`,
          "--cw-y": `${y}px`,
          position: "fixed",
          inset: 0,
          zIndex: 60,
          overflowY: "auto",
          overflowX: "hidden",
          color: FG,
          fontFamily: "var(--font-inter), sans-serif",
          background: "transparent",
        } as CSSProperties
      }
    >
      {/* Scrollbar restyle scoped to this shell — keeps the dark canvas
          continuous across the right edge instead of showing the default
          light browser scrollbar track. */}
      <style>{`
        .cw-scroll-shell {
          scrollbar-color: ${FG_DIM} transparent;
          scrollbar-width: thin;
        }
        .cw-scroll-shell::-webkit-scrollbar {
          width: 10px;
        }
        .cw-scroll-shell::-webkit-scrollbar-track {
          background: transparent;
        }
        .cw-scroll-shell::-webkit-scrollbar-thumb {
          background: ${FG_DIM};
          border-radius: 5px;
        }
      `}</style>

      <button
        onClick={() => navigate("/", "back")}
        aria-label="Back to home"
        style={{
          position: "fixed",
          top: 32,
          // Match the article's outer padding so the back button lines up
          // with the page's left edge across breakpoints.
          left: "clamp(20px, 5vw, 96px)",
          zIndex: 62,
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
          color: FG,
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          // Hides during text-out so it doesn't sit alone after the rest of
          // the page has lifted off.
          opacity: phase === "text-out" ? 0 : 1,
          transition: `opacity ${TEXT_MS}ms ${EASE}`,
        }}
      >
        <span aria-hidden style={{ fontSize: 16, lineHeight: 1 }}>
          {"←"}
        </span>
        Back
      </button>

      {children}
    </div>
  );
}
