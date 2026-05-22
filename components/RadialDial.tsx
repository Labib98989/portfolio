import type { Project } from "@/lib/projects";
import { DIAL, DUR, EASE, FOCUS, STAGE_H, STAGE_W } from "@/lib/motion";
import { MorphingGlyph } from "./MorphingGlyph";

type Tick = {
  p: Project;
  i: number;
  angle: number;
  x: number;
  y: number;
};

type Props = {
  projectIdx: number;
  ticks: Tick[];
  rotationDeg: number;
  rotRad: number;
  isHero: boolean;
  isDial: boolean;
  focused: boolean;
  accent: string;
  shadow: string;
};

// Visibility threshold — notches with effective cos above this are hidden in
// default state. 0 = left hemisphere only; right-hemisphere labels reveal in
// focus mode. Keep in sync with the constant in Home.tsx.
const ONSCREEN_COS_MAX = 0;

// Glyph slot — fills the inside of the wheel ring with comfortable
// breathing room from the inner ticks (rTickIn = 188). The glyph itself
// handles the riso two-ink offset and animates between chapters.
const GLYPH_SIZE = 200;
// Target visual size in focus mode. The dial wrapper applies scale(1.55)
// in focus, so the glyph wrapper applies an extra boost on top to hit this
// exact pixel size. 350 / (200 * 1.55) ≈ 1.129.
const GLYPH_SIZE_FOCUSED = 350;

function GlyphSlot({
  projectIdx,
  accent,
  shadow,
}: {
  projectIdx: number;
  accent: string;
  shadow: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: GLYPH_SIZE,
        height: GLYPH_SIZE,
      }}
    >
      <MorphingGlyph
        chapter={projectIdx + 1}
        accent={accent}
        shadow={shadow}
        durationMs={700}
      />
    </div>
  );
}

export function RadialDial({
  projectIdx,
  ticks,
  rotationDeg,
  rotRad,
  isHero,
  isDial,
  focused,
  accent,
  shadow,
}: Props) {
  const { cx, cy, rOuter, rTickIn, rLabel } = DIAL;

  const dialOffsetX = focused ? FOCUS.cx - cx : 0;
  const dialOffsetY = focused ? FOCUS.cy - cy : 0;
  const dialScale = focused ? FOCUS.scale : 1;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: focused ? 10 : 3,
        opacity: isHero ? 0 : 1,
        transform: focused
          ? `translate(${dialOffsetX}px, ${dialOffsetY}px) scale(${dialScale})`
          : isHero
            ? "translateX(180px)"
            : "translateX(0)",
        transformOrigin: `${cx}px ${cy}px`,
        transition: `opacity ${DUR} ${EASE}, transform ${DUR} ${EASE}`,
        pointerEvents: "none",
      }}
    >
      <svg
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: STAGE_W,
          height: STAGE_H,
          pointerEvents: "none",
          overflow: "visible",
        }}
        viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
      >
        {/* Ring + notches — rotates in default state, locks at 0° in focus. */}
        <g
          style={{
            transform: `rotate(${rotationDeg}deg)`,
            transformOrigin: `${cx}px ${cy}px`,
            transition: `transform .55s ${EASE}`,
          }}
        >
          <circle
            cx={cx}
            cy={cy}
            r={rOuter}
            fill="none"
            stroke="var(--line)"
            strokeWidth="1"
          />
          <circle
            cx={cx}
            cy={cy}
            r={rOuter - 32}
            fill="none"
            stroke="color-mix(in srgb, var(--fg) 7%, transparent)"
            strokeWidth="1"
            strokeDasharray="2 6"
          />
          <circle
            cx={cx}
            cy={cy}
            r={rOuter}
            fill="none"
            stroke="var(--line)"
            strokeWidth="1"
          />
          <circle
            cx={cx}
            cy={cy}
            r={rOuter - 32}
            fill="none"
            stroke="color-mix(in srgb, var(--fg) 7%, transparent)"
            strokeWidth="1"
            strokeDasharray="2 6"
          />
          {ticks.map(({ p, i, x, y }) => {
            const isCurrent = i === projectIdx;
            return (
              <line
                key={p.slug}
                x1={cx + x * rTickIn}
                y1={cy + y * rTickIn}
                x2={cx + x * rOuter}
                y2={cy + y * rOuter}
                // In focus the active notch is highlighted (no fixed
                // indicator points at it). In default the active notch
                // sits at 9 o'clock and the indicator marks it.
                stroke={
                  focused && isCurrent
                    ? accent
                    : "color-mix(in srgb, var(--fg) 42%, transparent)"
                }
                strokeWidth={focused && isCurrent ? 2.4 : 1}
                strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* Fixed 9-o'clock active indicator — only shown in default state.
            Fades out in focus where the active tick itself is highlighted. */}
        <g
          style={{
            opacity: focused ? 0 : 1,
            transition: `opacity ${DUR} ${EASE}`,
          }}
        >
          <line
            x1={cx - rTickIn}
            y1={cy}
            x2={cx - (rOuter + 18)}
            y2={cy}
            stroke={accent}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {(() => {
            const span = ((33.75 / 2) * Math.PI) / 180 * 0.6;
            const a1 = Math.PI - span;
            const a2 = Math.PI + span;
            const arcR = rOuter + 8;
            const p1 = `${cx + Math.cos(a1) * arcR} ${cy + Math.sin(a1) * arcR}`;
            const p2 = `${cx + Math.cos(a2) * arcR} ${cy + Math.sin(a2) * arcR}`;
            return (
              <path
                d={`M ${p1} A ${arcR} ${arcR} 0 0 1 ${p2}`}
                stroke={accent}
                strokeWidth="2.4"
                fill="none"
                strokeLinecap="round"
              />
            );
          })()}
        </g>
      </svg>

      {/* Labels — orbit with the rotation. Each label's anchor offset is
          interpolated linearly from its effective position on the unit
          circle, so a label at (x=1, y=0) anchors at its left edge and one
          at (x=-1, y=0) anchors at its right edge, with smooth in-between
          values for top/bottom notches. Right-hemisphere labels are hidden
          in default state (off-screen) and revealed in focus. */}
      {ticks.map(({ p, i, angle }) => {
        const effectiveAngle = focused ? angle : angle + rotRad;
        const x = Math.cos(effectiveAngle);
        const y = Math.sin(effectiveAngle);
        const onScreen = focused || x <= ONSCREEN_COS_MAX;
        const isCurrent = i === projectIdx;
        // Distance from current along the index axis (list is linear now,
        // no wrap), used to fade neighbouring labels.
        const distance = Math.abs(i - projectIdx);
        const opacityBase = isCurrent ? 1 : Math.max(0.22, 0.7 - distance * 0.16);
        const opacity = onScreen ? opacityBase : 0;
        // Linear anchor interpolation: label sits OUTSIDE the notch in its
        // radial direction. anchorX/Y are in CSS-translate %.
        const anchorX = (x - 1) * 50;
        const anchorY = (y - 1) * 50;
        const extendsRight = x > 0;
        return (
          <div
            key={p.slug}
            style={{
              position: "absolute",
              left: cx,
              top: cy,
              transform: `translate(${x * rLabel}px, ${y * rLabel}px) translate(${anchorX}%, ${anchorY}%)`,
              transition: `transform .55s ${EASE}, opacity .55s ${EASE}`,
              paddingLeft: extendsRight ? 12 : 0,
              paddingRight: extendsRight ? 0 : 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: isCurrent ? 14 : 12,
              fontWeight: isCurrent ? 600 : 500,
              letterSpacing: "0.03em",
              color: "var(--fg)",
              opacity,
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 10,
                color: "color-mix(in srgb, var(--fg) 45%, transparent)",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            {p.name}
            {isCurrent && (
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: accent,
                  boxShadow: `0 0 8px ${accent}`,
                }}
              />
            )}
          </div>
        );
      })}

      {/* Center glyph slot. Fills the inside of the wheel ring with the
          per-chapter MorphingGlyph; the riso two-ink offset and chapter-
          to-chapter morph are handled inside the glyph itself. In default
          state the glyph nudges 20px right of the geometric ring center —
          the wheel's right hemisphere is clipped off-stage, so optically
          the visible-ring midpoint sits a bit right of cx. Focus mode
          re-centers because the ring is then fully visible at FOCUS.cx. */}
      <div
        style={{
          position: "absolute",
          left: focused ? cx : cx - 50,
          top: cy,
          zIndex: 4,
          transform: `translate(-50%, -50%) scale(${
            focused ? GLYPH_SIZE_FOCUSED / (GLYPH_SIZE * FOCUS.scale) : 1
          })`,
          transition: `left ${DUR} ${EASE}, transform ${DUR} ${EASE}`,
        }}
      >
        <GlyphSlot
          projectIdx={projectIdx}
          accent={accent}
          shadow={shadow}
        />
      </div>

      {/* Rotation hint */}
      <div
        style={{
          position: "absolute",
          left: cx - rOuter + 24,
          top: cy + rOuter + 36,
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 10,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: isDial
            ? accent
            : "color-mix(in srgb, var(--fg) 40%, transparent)",
          whiteSpace: "nowrap",
          transition: `color ${DUR} ${EASE}`,
          opacity: focused ? 0 : 1,
        }}
      >
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            border: `1px solid ${isDial ? accent : "color-mix(in srgb, var(--fg) 30%, transparent)"}`,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            transition: `border-color ${DUR} ${EASE}`,
          }}
        >
          ↕
        </span>
        {isDial ? "Scrolling spins the wheel" : "Hover · scroll to rotate"}
      </div>
    </div>
  );
}
