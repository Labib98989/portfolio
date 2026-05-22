"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

// The transition is a two-layer, two-phase choreography. A black canvas
// (Riso shadow ink) slides in along one axis to mask the route change,
// then the new page's text animates in from the same direction on top of
// it. Reverse on the way back.
//
//   idle      → canvas hidden off-viewport along its axis
//   cover-in  → canvas animating to translate(0,0)
//   text-in   → on the target route, text staggering in
//   at-rest   → on the target route, everything settled
//   text-out  → text animating off in the entry direction (back only)
//   cover-out → canvas animating off-viewport (back only)
//
// Three axes:
//   "top"   — canvas drops down from above (Currently Working)
//   "right" — canvas slides in from the right (About)
//   "left"  — canvas slides in from the left (Case Study)
//
// Pages read `phase` from context to drive their text drop animations.
// The canvas axis is owned here and inferred from the target pathname.

export type TransitionPhase =
  | "idle"
  | "cover-in"
  | "text-in"
  | "at-rest"
  | "text-out"
  | "cover-out";

export type TransitionAxis = "top" | "right" | "left";

// Timings — user-tuned "faster" preset.
export const CANVAS_MS = 350;
export const TEXT_MS = 450;
// Per-element stagger ramp on transition pages. Section N enters at
// N * TEXT_STAGGER_MS. Pages author their delay tables against this constant.
export const TEXT_STAGGER_MS = 70;
// Total time from "text-in" entry until phase auto-flips to "at-rest". Must
// outlast the latest staggered element's animation end.
export const TEXT_TOTAL_MS = TEXT_MS + TEXT_STAGGER_MS * 8;

// Per-route canvas axis. Hard-coded by design — no auto rule, no trigger
// position math. Two routes get an explicit direction; everything else
// (including future routes) defaults to left.
//
//   /about              → right
//   /currently-working  → top
//   anything else       → left
//
// Used both on forward navigation (where to slide the canvas IN from) and
// on direct URL loads (so the page lands with the right axis stored, so a
// subsequent back animation leaves in the matching direction).
function axisForPath(pathname: string): TransitionAxis {
  if (pathname === "/about") return "right";
  if (pathname === "/currently-working") return "top";
  return "left";
}

function isTargetRoute(pathname: string): boolean {
  return (
    pathname === "/currently-working" ||
    pathname === "/about" ||
    pathname.startsWith("/projects/")
  );
}

type Ctx = {
  phase: TransitionPhase;
  axis: TransitionAxis;
  // Forward: axis is derived from the target href via axisForPath.
  // Back: the canvas leaves the same way it came in (stored axis is reused).
  navigate: (href: string, direction: "forward" | "back") => void;
};

const TransitionContext = createContext<Ctx | null>(null);

export function useTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) {
    throw new Error("useTransition must be used inside <TransitionShell>");
  }
  return ctx;
}

export function TransitionShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Initial phase derives from the entry pathname so a direct/refresh load
  // of any target route lands on "at-rest" and "/" lands on "idle".
  const [phase, setPhase] = useState<TransitionPhase>(() =>
    isTargetRoute(pathname) ? "at-rest" : "idle",
  );
  const [axis, setAxis] = useState<TransitionAxis>(() =>
    axisForPath(pathname),
  );

  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  }, []);
  useEffect(() => () => clearTimers(), [clearTimers]);

  // Browser back/forward (or any pathname change not driven by our navigate)
  // can leave phase out of sync with the URL. Snap to the right resting
  // state whenever the pathname says we're somewhere our phase doesn't
  // expect. Axis follows pathname here too.
  useEffect(() => {
    const onTarget = isTargetRoute(pathname);
    const phaseSaysTarget =
      phase === "text-in" || phase === "at-rest" || phase === "text-out";
    if (onTarget && !phaseSaysTarget) {
      clearTimers();
      setAxis(axisForPath(pathname));
      setPhase("at-rest");
    } else if (!onTarget && phaseSaysTarget) {
      clearTimers();
      setPhase("idle");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const navigate = useCallback(
    (href: string, direction: "forward" | "back") => {
      // Re-entry guard: only allow starting a new transition from a settled
      // state. Double-clicks won't queue.
      if (phase !== "idle" && phase !== "at-rest") return;

      clearTimers();

      if (direction === "forward") {
        // Lock the axis BEFORE flipping phase so the canvas slides in along
        // the right edge on its very first frame.
        setAxis(axisForPath(href));
        setPhase("cover-in");
        timers.current.push(
          setTimeout(() => {
            router.push(href);
            setPhase("text-in");
            timers.current.push(
              setTimeout(() => setPhase("at-rest"), TEXT_TOTAL_MS),
            );
          }, CANVAS_MS),
        );
      } else {
        // Back: axis stays — the canvas leaves the same way it entered.
        setPhase("text-out");
        timers.current.push(
          setTimeout(() => {
            router.push(href);
            setPhase("cover-out");
            timers.current.push(
              setTimeout(() => setPhase("idle"), CANVAS_MS),
            );
          }, TEXT_MS),
        );
      }
    },
    [phase, router, clearTimers],
  );

  // Canvas state model:
  //   • `canvasCovering` decides the *resting* transform (covered vs. hidden).
  //   • `canvasAnim` runs a keyframe animation on the two phases that need
  //     to *move* (cover-in / cover-out). Keyframes always start from their
  //     `from` state, which means changing axis at the same moment as
  //     entering cover-in is safe — the browser doesn't try to interpolate
  //     the transform matrix diagonally between two different translate
  //     axes (which is what produced the wrong-direction bug).
  const canvasCovering =
    phase === "cover-in" ||
    phase === "text-in" ||
    phase === "at-rest" ||
    phase === "text-out";

  const axisCap =
    axis === "top" ? "Top" : axis === "right" ? "Right" : "Left";

  let canvasAnim = "none";
  if (phase === "cover-in") {
    canvasAnim = `canvasIn${axisCap} ${CANVAS_MS}ms cubic-bezier(.4,.05,.15,1) forwards`;
  } else if (phase === "cover-out") {
    canvasAnim = `canvasOut${axisCap} ${CANVAS_MS}ms cubic-bezier(.4,.05,.15,1) forwards`;
  }

  // Resting transform — applied when no animation is in flight. Matches the
  // end state of whichever animation last ran, so removing the animation
  // (forwards effect gone) doesn't visibly snap the canvas.
  let restingTransform: string;
  if (canvasCovering) {
    restingTransform = "translate(0, 0)";
  } else if (axis === "top") {
    restingTransform = "translateY(-100%)";
  } else if (axis === "right") {
    restingTransform = "translateX(100%)";
  } else {
    restingTransform = "translateX(-100%)";
  }

  return (
    <TransitionContext.Provider value={{ phase, axis, navigate }}>
      {children}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          background: "#22201d", // Riso shadow ink — system-fixed
          transform: restingTransform,
          animation: canvasAnim,
          zIndex: 50,
          pointerEvents: canvasCovering ? "auto" : "none",
        }}
      />
    </TransitionContext.Provider>
  );
}
