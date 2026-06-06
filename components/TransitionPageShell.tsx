"use client";

import { useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { DECK_SPRING, DECK_SPRING_DUR_MS } from "@/lib/motion";
import { useIsMobile } from "@/lib/useMediaQuery";
import {
  TEXT_MS,
  TEXT_STAGGER_MS,
  useTransition,
} from "./TransitionShell";

// Mobile swipe-to-close uses the deck's springy curve so the page snaps back
// with the same playful pop as the cards.
const SHELL_SPRING = `transform ${DECK_SPRING_DUR_MS}ms ${DECK_SPRING}`;

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
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const { x, y } = AXIS_OFFSET[axis];

  // Where "back" returns to. On mobile we push "/" with the originating card's
  // hash so the deck restores to the exact card — including About / Currently,
  // which aren't tracked by ChapterState (without this they'd land on a chapter
  // instead). Desktop keeps the plain "/" + ChapterState resume, untouched.
  const backHref = !isMobile
    ? "/"
    : pathname === "/about"
      ? "/#about"
      : pathname === "/currently-working"
        ? "/#currently"
        : pathname.startsWith("/projects/")
          ? `/#${pathname.slice("/projects/".length)}`
          : "/";

  // Mobile: swipe the whole page LEFT to close back to the deck — the reverse
  // of the swipe-right that opened it (the page came in from the left, so it
  // leaves to the left). Coexists with the article's vertical scroll via
  // touch-action: pan-y plus a first-move axis lock — vertical drags scroll
  // natively, a horizontal drag peels the page away (live), and release either
  // commits the back-nav or springs the page back into place.
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const start = useRef<{ x: number; y: number; id: number } | null>(null);
  const axisRef = useRef<"h" | "v" | null>(null);
  const vx = useRef(0);
  const lastX = useRef(0);
  const lastT = useRef(0);

  const onPointerDown = (e: ReactPointerEvent) => {
    start.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
    axisRef.current = null;
    vx.current = 0;
    lastX.current = e.clientX;
    lastT.current = e.timeStamp;
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    const s = start.current;
    if (!s || s.id !== e.pointerId) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    const dt = Math.max(1, e.timeStamp - lastT.current);
    vx.current = (e.clientX - lastX.current) / dt;
    lastX.current = e.clientX;
    lastT.current = e.timeStamp;
    if (axisRef.current === null) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
      axisRef.current = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
      if (axisRef.current === "h") setDragging(true);
    }
    // Clamp to leftward only — there's nothing to reveal on the right.
    if (axisRef.current === "h") setDragX(Math.min(0, dx));
  };
  const finish = (e: ReactPointerEvent) => {
    const s = start.current;
    start.current = null;
    const wasH = axisRef.current === "h";
    axisRef.current = null;
    setDragging(false);
    setDragX(0);
    if (!s || s.id !== e.pointerId || !wasH) return;
    const dx = e.clientX - s.x;
    const w = typeof window !== "undefined" ? window.innerWidth : 9999;
    if (dx < -w * 0.25 || vx.current < -0.4) navigate(backHref, "back");
  };

  const swipeBind = isMobile
    ? {
        onPointerDown,
        onPointerMove,
        onPointerUp: finish,
        onPointerCancel: finish,
      }
    : {};

  return (
    <div
      className="cw-scroll-shell"
      {...swipeBind}
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
          // pan-y lets the article scroll vertically while we own horizontal.
          touchAction: isMobile ? "pan-y" : undefined,
          transform: isMobile ? `translateX(${dragX}px)` : undefined,
          transition: isMobile ? (dragging ? "none" : SHELL_SPRING) : undefined,
          boxShadow:
            isMobile && dragX < 0 ? "24px 0 50px rgba(0,0,0,0.45)" : undefined,
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
        onClick={() => navigate(backHref, "back")}
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
