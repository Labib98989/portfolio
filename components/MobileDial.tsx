"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { Project } from "@/lib/projects";
import { FIRST_DEG, SEG_DEG } from "@/lib/motion";
import { MorphingGlyph } from "./MorphingGlyph";

// The mobile dial — the desktop wheel reborn as a touch index. Swipe-left from
// any card reveals it; it slides in from the right (the shell owns that
// transform). Nine chapter dots ride a 270° arc (gap at the bottom, same
// geometry as the desktop dial), each painted in its chapter accent so the
// index reads at a glance without colliding labels. Tap a dot to jump.

type Props = {
  projects: Project[];
  /** Project index currently focused in the deck, or -1 when on About/Currently. */
  active: number;
  onJump: (chapterIdx: number) => void;
  onClose: () => void;
};

// Ring geometry in the SVG's own coordinate space (scales responsively).
const S = 300;
const C = S / 2;
const R_DOT = 116; // dot orbit radius
const HIT_R = 26; // transparent tap target

export function MobileDial({ projects, active, onJump, onClose }: Props) {
  // Dot being pressed — drives the caption so you see a name before committing.
  const [preview, setPreview] = useState<number | null>(null);
  const shown = preview ?? (active >= 0 ? active : 0);
  const accent = projects[shown]?.theme.accent ?? "#D9A89C";

  // Swipe-right-to-close, tracked on the backdrop. A tap (small dx) still lets
  // dot onClick through because we don't capture the pointer.
  const downX = useRef<number | null>(null);
  const onPointerDown = (e: ReactPointerEvent) => {
    downX.current = e.clientX;
  };
  const onPointerUp = (e: ReactPointerEvent) => {
    if (downX.current !== null && e.clientX - downX.current > 60) onClose();
    downX.current = null;
  };

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(circle at 50% 42%, color-mix(in srgb, " +
          accent +
          " 16%, #22201d) 0%, #22201d 70%)",
        color: "#efefec",
        display: "flex",
        flexDirection: "column",
        padding:
          "calc(env(safe-area-inset-top, 0px) + 24px) 24px calc(env(safe-area-inset-bottom, 0px) + 40px)",
        fontFamily: "var(--font-inter), sans-serif",
        touchAction: "none",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "color-mix(in srgb, #efefec 55%, transparent)",
          }}
        >
          Index · {projects.length} chapters
        </span>
        <button
          onClick={onClose}
          aria-label="Close index"
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            border: "1px solid color-mix(in srgb, #efefec 22%, transparent)",
            background: "transparent",
            color: "#efefec",
            fontSize: 18,
            lineHeight: 1,
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>

      {/* Ring */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ position: "relative", width: "min(82vw, 340px)", aspectRatio: "1 / 1" }}>
          <svg
            viewBox={`0 0 ${S} ${S}`}
            width="100%"
            height="100%"
            style={{ position: "absolute", inset: 0, overflow: "visible" }}
          >
            {/* Track */}
            <circle cx={C} cy={C} r={R_DOT} fill="none" stroke="color-mix(in srgb, #efefec 12%, transparent)" strokeWidth="1" />
            <circle
              cx={C}
              cy={C}
              r={R_DOT - 26}
              fill="none"
              stroke="color-mix(in srgb, #efefec 6%, transparent)"
              strokeWidth="1"
              strokeDasharray="2 7"
            />

            {projects.map((p, i) => {
              const a = ((FIRST_DEG - i * SEG_DEG) * Math.PI) / 180;
              const x = C + Math.cos(a) * R_DOT;
              const y = C + Math.sin(a) * R_DOT;
              const isActive = i === active;
              const isShown = i === shown;
              return (
                <g key={p.slug}>
                  {isActive && (
                    <circle cx={x} cy={y} r={11} fill="none" stroke="#efefec" strokeWidth="1.5" />
                  )}
                  <circle cx={x} cy={y} r={isShown ? 7 : 5} fill={p.theme.accent} />
                  {/* Transparent tap target */}
                  <circle
                    cx={x}
                    cy={y}
                    r={HIT_R}
                    fill="transparent"
                    style={{ cursor: "pointer" }}
                    onPointerEnter={() => setPreview(i)}
                    onPointerDown={() => setPreview(i)}
                    onClick={() => onJump(i)}
                  />
                </g>
              );
            })}
          </svg>

          {/* Center glyph — the focused chapter */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: "42%",
              height: "42%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          >
            <MorphingGlyph
              chapter={shown + 1}
              accent={projects[shown].theme.glyph.inkAccent}
              shadow={projects[shown].theme.glyph.inkShadow}
              size="100%"
              durationMs={420}
            />
          </div>
        </div>
      </div>

      {/* Caption — focused chapter name + year */}
      <div style={{ textAlign: "center", minHeight: 64 }}>
        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "color-mix(in srgb, #efefec 50%, transparent)",
            marginBottom: 8,
          }}
        >
          {String(shown + 1).padStart(2, "0")} · {projects[shown].year}
        </div>
        <div
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontWeight: 300,
            fontSize: "clamp(26px, 8vw, 38px)",
            letterSpacing: "-0.02em",
            color: "#efefec",
          }}
        >
          {projects[shown].name}
        </div>
        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 9.5,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "color-mix(in srgb, #efefec 36%, transparent)",
            marginTop: 14,
          }}
        >
          tap to jump · swipe right to close
        </div>
      </div>
    </div>
  );
}
