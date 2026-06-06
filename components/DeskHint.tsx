"use client";

import { useEffect, useRef } from "react";

// Desktop first-load guidance. On arrival it states the two non-obvious moves
// (scroll to navigate, click the wheel to open the index) at near-full opacity.
// On the first real interaction it's dismissed — but not for good: once dormant
// it drifts back to a faint, semi-transparent state as the cursor approaches,
// so it's always rediscoverable without ever nagging.
//
// Opacity is driven imperatively (ref + a window mousemove listener) so cursor
// tracking never re-renders the parent stage. A short CSS transition smooths it.
export function DeskHint({
  dismissed,
  hidden,
}: {
  dismissed: boolean;
  hidden: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Hidden behind another hint (hero hover / focus), or still in the intro.
    if (hidden) {
      el.style.opacity = "0";
      return;
    }
    if (!dismissed) {
      el.style.opacity = "0.85";
      return;
    }
    // Dormant: invisible at rest, fading up to half as the cursor nears.
    el.style.opacity = "0";
    const R = 280; // proximity radius (screen px)
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const near = Math.max(0, 1 - Math.hypot(dx, dy) / R);
      el.style.opacity = String(near * 0.5);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [dismissed, hidden]);

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: "absolute",
        left: "50%",
        bottom: 34,
        transform: "translateX(-50%)",
        zIndex: 8,
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize: 11,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "var(--fg)",
        whiteSpace: "nowrap",
        opacity: 0,
        transition: "opacity .25s ease",
        pointerEvents: "none",
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <span
          aria-hidden
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: "1px solid color-mix(in srgb, var(--fg) 40%, transparent)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
          }}
        >
          ↕
        </span>
        scroll to explore
      </span>
      <span style={{ color: "color-mix(in srgb, var(--fg) 35%, transparent)" }}>·</span>
      <span>click the wheel for the index</span>
    </div>
  );
}
