"use client";

import {
  useCallback,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

// Hand-rolled gesture engine for the mobile card deck. No dependency — the
// whole site's motion layer is hand-rolled (see Home.tsx wheel handling), so
// this matches house style and stays clean under React 19 + React Compiler.
//
// Model: one pointer drag. The first few px of movement lock the gesture to a
// single axis and it commits to that axis for the rest of the drag.
//   • vertical   → page through the deck (clamped; rubber-band past the ends)
//   • horizontal → finger-right reveals detail, finger-left reveals the dial
//
// The hook owns no transforms — it only reports the live drag offset on the
// locked axis plus axis/dragging flags. The shell turns those into CSS
// transforms (1:1 while dragging, eased snap on release). Commit decisions use
// distance OR fling velocity so a quick flick counts even if it's short.

export type SwipeAxis = "v" | "h" | null;

export type SwipeDeckState = {
  /** Live horizontal delta (px). Only non-zero while axis === "h". */
  offsetX: number;
  /** Live vertical delta (px). Only non-zero while axis === "v". */
  offsetY: number;
  axis: SwipeAxis;
  dragging: boolean;
};

type Options = {
  /** Number of pages in the column. */
  count: number;
  /** Active page index. */
  index: number;
  /** Viewport height in px — vertical commit threshold is a fraction of it. */
  height: number;
  /** Viewport width in px — horizontal commit threshold is a fraction of it. */
  width: number;
  /** When true (e.g. dial open), the deck ignores gestures. */
  disabled?: boolean;
  onIndexChange: (next: number) => void;
  /** Finger moved right past threshold → open the detail page. */
  onSwipeRight: () => void;
  /** Finger moved left past threshold → open the dial. */
  onSwipeLeft: () => void;
};

// Movement (px) before the gesture locks to an axis.
const LOCK_PX = 8;
// Fraction of the viewport the drag must cross to commit (distance path).
const V_COMMIT_FRAC = 0.18;
const H_COMMIT_FRAC = 0.22;
// Fling speed (px/ms) that commits regardless of distance.
const FLING = 0.5;
// Resistance applied to vertical drag past the first/last page.
const RUBBER = 0.35;
// The detail peek (finger-right) is damped + capped so the card only "gives" a
// little before the route transition takes over. The dial (finger-left) tracks
// the finger 1:1 so it slides in from the right edge under the thumb.
const H_DAMP = 0.5;
const H_PEEK_MAX = 96;

export function useSwipeDeck(opts: Options) {
  const {
    count,
    index,
    height,
    width,
    disabled,
    onIndexChange,
    onSwipeRight,
    onSwipeLeft,
  } = opts;

  const [state, setState] = useState<SwipeDeckState>({
    offsetX: 0,
    offsetY: 0,
    axis: null,
    dragging: false,
  });

  // Drag bookkeeping kept in refs so pointermove doesn't churn React state for
  // anything except the rendered offset.
  const start = useRef({ x: 0, y: 0, id: -1 });
  const last = useRef({ x: 0, y: 0, t: 0, vx: 0, vy: 0 });
  const axisRef = useRef<SwipeAxis>(null);

  const onPointerDown = useCallback(
    (e: ReactPointerEvent) => {
      if (disabled) return;
      start.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
      last.current = {
        x: e.clientX,
        y: e.clientY,
        t: e.timeStamp,
        vx: 0,
        vy: 0,
      };
      axisRef.current = null;
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        /* pointer capture is best-effort */
      }
      setState({ offsetX: 0, offsetY: 0, axis: null, dragging: true });
    },
    [disabled],
  );

  const onPointerMove = useCallback(
    (e: ReactPointerEvent) => {
      if (start.current.id !== e.pointerId) return;
      const dx = e.clientX - start.current.x;
      const dy = e.clientY - start.current.y;

      // Track instantaneous velocity for the fling test on release.
      const dt = Math.max(1, e.timeStamp - last.current.t);
      last.current.vx = (e.clientX - last.current.x) / dt;
      last.current.vy = (e.clientY - last.current.y) / dt;
      last.current.x = e.clientX;
      last.current.y = e.clientY;
      last.current.t = e.timeStamp;

      if (axisRef.current === null) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < LOCK_PX) return;
        axisRef.current = Math.abs(dy) >= Math.abs(dx) ? "v" : "h";
      }

      if (axisRef.current === "v") {
        let oy = dy;
        const atTop = index === 0 && dy > 0;
        const atBottom = index === count - 1 && dy < 0;
        if (atTop || atBottom) oy = dy * RUBBER;
        setState({ offsetX: 0, offsetY: oy, axis: "v", dragging: true });
      } else {
        // Finger-right: damped, capped peek. Finger-left: 1:1 so the dial
        // tracks under the thumb.
        const ox = dx > 0 ? Math.min(dx * H_DAMP, H_PEEK_MAX) : dx;
        setState({ offsetX: ox, offsetY: 0, axis: "h", dragging: true });
      }
    },
    [count, index],
  );

  const finish = useCallback(
    (e: ReactPointerEvent) => {
      if (start.current.id !== e.pointerId) return;
      const dx = e.clientX - start.current.x;
      const dy = e.clientY - start.current.y;
      const ax = axisRef.current;
      axisRef.current = null;
      start.current.id = -1;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }

      if (ax === "v") {
        const passed =
          Math.abs(dy) > height * V_COMMIT_FRAC ||
          Math.abs(last.current.vy) > FLING;
        if (passed) {
          const next = dy < 0 ? index + 1 : index - 1;
          if (next >= 0 && next < count) onIndexChange(next);
        }
      } else if (ax === "h") {
        const passed =
          Math.abs(dx) > width * H_COMMIT_FRAC ||
          Math.abs(last.current.vx) > FLING;
        if (passed) {
          if (dx > 0) onSwipeRight();
          else onSwipeLeft();
        }
      }

      // Reset to resting; the shell re-enables its transition so the column /
      // dial eases to its settled position from wherever the finger left it.
      setState({ offsetX: 0, offsetY: 0, axis: null, dragging: false });
    },
    [count, index, height, width, onIndexChange, onSwipeRight, onSwipeLeft],
  );

  return {
    state,
    bind: {
      onPointerDown,
      onPointerMove,
      onPointerUp: finish,
      onPointerCancel: finish,
    },
  };
}
