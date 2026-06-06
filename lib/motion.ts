export const EASE = "cubic-bezier(.4,.05,.15,1)";
export const DUR = ".6s";

// --- Mobile deck motion ---
// Snappier and more playful than the desktop wheel. The vertical column uses a
// fast ease-out with NO overshoot — a full-screen card can't overshoot without
// flashing a sliver of the wrong neighbour. Things that slide OVER the deck
// (the dial) and gesture snap-backs use a springy curve with a little overshoot
// for that fun, dynamic pop.
export const DECK_EASE = "cubic-bezier(.16, 1, .3, 1)"; // expo-out: rockets then settles
export const DECK_DUR_MS = 300;
export const DECK_SPRING = "cubic-bezier(.34, 1.56, .5, 1)"; // back-out: overshoots + bounces
export const DECK_SPRING_DUR_MS = 460;

export const STAGE_W = 1600;
export const STAGE_H = 900;

// Radial-dial geometry. ~30% of the wheel intentionally sits off the right
// edge of the stage. Right-hemisphere labels are hidden in default state via
// ONSCREEN_COS_MAX (see Home.tsx) so labels never clip even though the ring
// extends off-stage.
export const DIAL = {
  cx: 1516,
  cy: 480,
  rOuter: 210,
  rTickIn: 188,
  rLabel: 246,
} as const;

export const FOCUS = {
  cx: 800,
  cy: 480,
  scale: 1.55,
} as const;

// Wheel layout: 9 notches spread across a 270° arc (3/4 of the circle), with
// a 90° gap at the bottom signalling the endpoints. Notch 0 sits at the
// bottom-right edge of the gap; notch 8 at the bottom-left edge. Travelling
// 0 → 8 goes CCW visually (up through the top).
//
// Math-angle convention used throughout the file: angle in radians, x = cos,
// y = sin. Because SVG y is inverted, increasing the math angle moves CW on
// screen. Math angle 180° = 9 o'clock; 270° = 12 o'clock; 90° = 6 o'clock.
export const NOTCH_COUNT = 9;
export const ARC_DEG = 270; // total arc the notches occupy
export const GAP_DEG = 90; // empty arc at the bottom
export const SEG_DEG = ARC_DEG / (NOTCH_COUNT - 1); // 33.75° per interval
export const FIRST_DEG = 45; // notch 0 at math 45° (bottom-right SVG)

// Elastic bounce when the user scrolls past the first or last notch.
export const BOUNCE_DEG = 14;
export const BOUNCE_MS = 380;
