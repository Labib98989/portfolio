"use client";

import { useEffect, useRef } from "react";
import { STAGE_H, STAGE_W } from "@/lib/motion";

// Scales the 1440x900 stage to fit the viewport while preserving aspect.
export function StageFit({ children }: { children: React.ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const apply = () => {
      const k = Math.min(
        window.innerWidth / STAGE_W,
        window.innerHeight / STAGE_H,
      );
      stage.style.transform = `scale(${k})`;
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // Sit above the focus veil (z-index 1 in Home.tsx) so notch hit
        // pills inside the stage's stacking context actually receive
        // clicks. The stage is transparent, so the veil's dim still
        // shows through visually. Outer wrapper is pointer-events: none
        // so letterbox-area clicks still fall through to the veil
        // (preserves click-backdrop-to-exit-focus); the inner stage and
        // its descendants override back to pointer-events: auto.
        zIndex: 2,
        pointerEvents: "none",
      }}
    >
      <div
        ref={stageRef}
        style={{
          position: "relative",
          width: STAGE_W,
          height: STAGE_H,
          transformOrigin: "50% 50%",
          overflow: "hidden",
          pointerEvents: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}
