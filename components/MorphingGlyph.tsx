"use client";

import React, { useEffect, useRef, useState } from "react";
import { GLYPH_SPECS, type Part, ROLE_ORDER } from "@/lib/glyphParts";

type Props = {
  chapter: number;
  accent: string;
  shadow: string;
  size?: number | string;
  offset?: number;
  durationMs?: number;
};

// Cubic ease-out — fast start, gentle settle.
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function MorphingGlyph({
  chapter,
  accent,
  shadow,
  size = "100%",
  offset = 2,
  durationMs = 700,
}: Props) {
  // Maintain a (from, to) pair plus an animated progress 0→1. On chapter
  // change, snapshot the current "to" as the new "from" and ramp progress
  // back to 1.
  const [from, setFrom] = useState(chapter);
  const [to, setTo] = useState(chapter);
  const [progress, setProgress] = useState(1);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (chapter === to) return;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    setFrom(to);
    setTo(chapter);
    setProgress(0);
    startRef.current = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - startRef.current) / durationMs);
      setProgress(easeOut(t));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else rafRef.current = null;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // chapter is the trigger; `to` is read at change-time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter, durationMs]);

  const fromSpec = GLYPH_SPECS[from];
  const toSpec = GLYPH_SPECS[to];
  if (!fromSpec || !toSpec) return null;

  const fromByRole: Record<string, Part> = Object.fromEntries(
    fromSpec.parts.map((p) => [p.role, p]),
  );
  const toByRole: Record<string, Part> = Object.fromEntries(
    toSpec.parts.map((p) => [p.role, p]),
  );

  const roles = ROLE_ORDER.filter(
    (r) => fromByRole[r] || toByRole[r],
  );

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{ overflow: "visible", display: "block" }}
      aria-hidden
    >
      {/* Shadow ink — prints first, offset. */}
      <g style={{ color: shadow }} transform={`translate(${offset} ${offset})`}>
        {roles.map((role) =>
          renderRole(role, fromByRole[role], toByRole[role], progress),
        )}
      </g>
      {/* Accent ink — prints on top, base position. */}
      <g style={{ color: accent }}>
        {roles.map((role) =>
          renderRole(role, fromByRole[role], toByRole[role], progress),
        )}
      </g>
    </svg>
  );
}

// For each role:
//   - role only in FROM: fade out in place.
//   - role only in TO:   fade in in place.
//   - role in both:      OLD drifts toward NEW's center (fading out) while
//                        NEW slides in from OLD's center (fading in). Both
//                        layers move together so the silhouette reads as
//                        one shape transforming.
function renderRole(
  role: string,
  from: Part | undefined,
  to: Part | undefined,
  progress: number,
) {
  if (from && !to) {
    return (
      <g key={role} opacity={1 - progress}>
        {from.render}
      </g>
    );
  }
  if (!from && to) {
    return (
      <g key={role} opacity={progress}>
        {to.render}
      </g>
    );
  }
  if (!from || !to) return null;

  const dx = to.cx - from.cx;
  const dy = to.cy - from.cy;
  // OLD: drifts toward NEW's center as it fades out.
  const oldT = `translate(${dx * progress} ${dy * progress})`;
  // NEW: starts at OLD's center (offset -delta) and resolves to identity.
  const newT = `translate(${dx * (progress - 1)} ${dy * (progress - 1)})`;

  return (
    <g key={role}>
      <g transform={oldT} opacity={1 - progress}>
        {from.render}
      </g>
      <g transform={newT} opacity={progress}>
        {to.render}
      </g>
    </g>
  );
}
