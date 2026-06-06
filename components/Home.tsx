"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { PROJECTS, TAGLINES } from "@/lib/projects";
import {
  BOUNCE_DEG,
  BOUNCE_MS,
  DIAL,
  DUR,
  EASE,
  FIRST_DEG,
  FOCUS,
  SEG_DEG,
  STAGE_H,
  STAGE_W,
} from "@/lib/motion";
import { BackgroundFor } from "./Backgrounds";
import { useChapterState } from "./ChapterState";
import { DeskHint } from "./DeskHint";
import { FocusOverlay } from "./FocusOverlay";
import { Header } from "./Header";
import { HeroChapter } from "./HeroChapter";
import { RadialDial } from "./RadialDial";
import { SnapDots } from "./SnapDots";
import { StageFit } from "./StageFit";
import { Tagline } from "./Tagline";
import { useTransition } from "./TransitionShell";

type Zone = "hero" | "dial" | null;
type Dir = 1 | -1;

// Resolved at render-time from the active chapter's theme. CSS var is set on
// the stage element (see render below); transitions are handled by @property
// registration in globals.css.
const ACCENT = "var(--accent)";

// Debug flag — paints the notch hit pills so we can verify alignment.
// Flip to false once positions are dialed in.
const DEBUG_PILLS = false;

// A notch is considered on-screen in default state when its x-component (cos
// of the effective angle) is ≤ this threshold. Threshold of 0 = strict left
// hemisphere only, which keeps labels from clipping past the right stage
// edge when the wheel is right-anchored. Focus mode reveals all 9.
const ONSCREEN_COS_MAX = 0;

export default function Home() {
  const { navigate } = useTransition();
  // Chapter index persists across route changes via a provider mounted in
  // the root layout — leaving Home for /about or a case study and returning
  // resumes on the same chapter instead of snapping back to 0.
  const { chapterIdx: projectIdx, setChapterIdx: setProjectIdx } =
    useChapterState();
  const [zone, setZone] = useState<Zone>(null);
  const [dir, setDir] = useState<Dir>(1);
  const [focused, setFocused] = useState(false);
  // -1 = backward attempt past first, +1 = forward attempt past last, 0 = idle
  const [bounce, setBounce] = useState<Dir | 0>(0);
  const [tagline, setTagline] = useState(TAGLINES[0]);
  // First-load guidance: dismissed on the first scroll / arrow key / wheel click.
  const [hintDismissed, setHintDismissed] = useState(false);

  // Random tagline on mount (kept in effect to avoid SSR/CSR mismatch).
  useEffect(() => {
    setTagline(TAGLINES[Math.floor(Math.random() * TAGLINES.length)]);
  }, []);

  const isHero = zone === "hero";
  const isDial = zone === "dial";
  const current = PROJECTS[projectIdx];
  const len = PROJECTS.length;

  const { cx, cy, rOuter } = DIAL;

  // Default state: wheel rotates so the current notch aligns with the fixed
  // indicator at 9 o'clock (math 180°). Solving for R given notch i's natural
  // math angle θ_i = FIRST_DEG - i·SEG: R = 180° − θ_i = 135° + i·SEG.
  // Focus state: wheel locks to natural orientation (R = 0) so notches stay
  // at their original positions (gap at bottom).
  const defaultRotation = 135 + projectIdx * SEG_DEG + bounce * BOUNCE_DEG;
  const rotationDeg = focused ? 0 : defaultRotation;
  const rotRad = (rotationDeg * Math.PI) / 180;

  const ticks = useMemo(
    () =>
      PROJECTS.map((p, i) => {
        const angleDeg = FIRST_DEG - i * SEG_DEG;
        const angle = (angleDeg * Math.PI) / 180;
        return { p, i, angle, x: Math.cos(angle), y: Math.sin(angle) };
      }),
    [],
  );

  // Bounce timer — cleared on rapid retriggers so consecutive bounces don't
  // stomp on each other's reset.
  const bounceTimerRef = useRef<number | null>(null);
  const triggerBounce = (d: Dir) => {
    if (bounceTimerRef.current !== null) {
      window.clearTimeout(bounceTimerRef.current);
    }
    setBounce(d);
    bounceTimerRef.current = window.setTimeout(() => {
      setBounce(0);
      bounceTimerRef.current = null;
    }, BOUNCE_MS);
  };
  useEffect(
    () => () => {
      if (bounceTimerRef.current !== null) {
        window.clearTimeout(bounceTimerRef.current);
      }
    },
    [],
  );

  // Wheel-to-rotate listens on the window so chapter scrolling works from any
  // zone (hero, dial, or focus mode). Accum 50px = one notch (cooldown 360ms).
  // No wrap-around: scrolling past the first/last notch triggers an elastic
  // bounce. Page has overflow:hidden, so preventDefault is harmless.
  useEffect(() => {
    let accum = 0;
    let lastSwap = 0;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      accum += e.deltaY;
      const now = Date.now();
      if (Math.abs(accum) >= 50 && now - lastSwap > 360) {
        setHintDismissed(true);
        const d: Dir = accum > 0 ? 1 : -1;
        const next = projectIdx + d;
        if (next < 0 || next >= len) {
          triggerBounce(d);
        } else {
          setDir(d);
          setProjectIdx(next);
        }
        accum = 0;
        lastSwap = now;
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [len, projectIdx]);

  // Click a notch → jump, exit focus. Direction is straightforward since the
  // list no longer wraps.
  const jumpToIndex = (newIdx: number) => {
    setHintDismissed(true);
    setFocused(false);
    if (newIdx === projectIdx) return;
    setDir(newIdx > projectIdx ? 1 : -1);
    setProjectIdx(newIdx);
  };

  // ESC exits focus mode.
  useEffect(() => {
    if (!focused) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFocused(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focused]);

  // Arrow keys change chapter, paced to match the wheel: a single tap steps once
  // immediately, and holding a key steps at the wheel's cadence rather than the
  // OS key-repeat rate (which otherwise flies through chapters). Up/Left =
  // previous, Down/Right = next. The cooldown ref persists across re-subscribes.
  const arrowLastRef = useRef(0);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      let d: Dir | 0 = 0;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") d = 1;
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") d = -1;
      if (d === 0) return;
      e.preventDefault();
      const now = Date.now();
      if (now - arrowLastRef.current < 340) return;
      arrowLastRef.current = now;
      setHintDismissed(true);
      const next = projectIdx + d;
      if (next < 0 || next >= len) {
        triggerBounce(d);
        return;
      }
      setDir(d);
      setProjectIdx(next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [projectIdx, len]);

  const dialOffsetX = focused ? FOCUS.cx - cx : 0;
  const dialOffsetY = focused ? FOCUS.cy - cy : 0;
  const dialScale = focused ? FOCUS.scale : 1;

  // Hover-zone-reactive gradient center. Hero (left) hover pulls the
  // accent-leaning secondary stop toward the left; dial (right) hover pulls
  // it right; no zone = centered. Smooth interpolation comes from --bg-x
  // registered as @property <percentage> in globals.css.
  const bgX = isHero ? "22%" : isDial ? "78%" : "50%";

  return (
    // Top-level wrapper holds the per-chapter CSS vars so BOTH the
    // full-viewport bg layer (sibling) AND the stage (descendant) can read
    // them. Without this wrapper, the vars would live only on the stage and
    // the area outside the stage would fall back to body bg (black bars).
    <div
      style={
        {
          "--bg": current.theme.bgPrimary,
          "--bg-secondary": current.theme.bgSecondary,
          "--accent": current.theme.accent,
          "--shadow": current.theme.shadow,
          "--fg": current.theme.fg,
          // Subtones bound at the same scope as --fg so the var() chain
          // resolves correctly per chapter (see fix in this file's history).
          "--fg-soft": `color-mix(in srgb, ${current.theme.fg} 82%, transparent)`,
          "--fg-mute": `color-mix(in srgb, ${current.theme.fg} 55%, transparent)`,
          "--fg-dim": `color-mix(in srgb, ${current.theme.fg} 42%, transparent)`,
          "--line": `color-mix(in srgb, ${current.theme.fg} 18%, transparent)`,
          "--bg-x": bgX,
          color: "var(--fg)",
          transition: `--bg ${DUR} ${EASE}, --bg-secondary ${DUR} ${EASE}, --accent ${DUR} ${EASE}, --shadow ${DUR} ${EASE}, --fg ${DUR} ${EASE}, --bg-x ${DUR} ${EASE}`,
        } as CSSProperties
      }
    >
      {/* Full-viewport bg gradient. Lives behind StageFit (z-index 0) so
          the gradient extends past the stage's letterbox to the viewport
          edges — no black bars on wide screens. Percentages so the bloom
          tracks the viewport, not the fixed-pixel stage. */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(circle at var(--bg-x) 50%, var(--bg-secondary) 0%, var(--bg) 70%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      {/* Focus veil — full viewport so the dim extends past the stage
          letterbox when the wheel zooms up. Same pattern as the bg layer:
          lives outside StageFit because position:fixed inside the stage
          would be trapped by the stage's CSS transform. Click exits focus. */}
      <div
        onClick={() => focused && setFocused(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(8,8,8,0.62)",
          opacity: focused ? 1 : 0,
          pointerEvents: focused ? "auto" : "none",
          cursor: focused ? "zoom-out" : "default",
          zIndex: 1,
          transition: `opacity ${DUR} ${EASE}`,
        }}
      />
      <StageFit>
        <div
          style={
            {
              width: STAGE_W,
              height: STAGE_H,
              position: "relative",
              overflow: "hidden",
              // Stage is transparent now — the full-viewport bg layer above
              // shows through, giving one continuous gradient across both
              // the stage and the letterbox area.
              background: "transparent",
              // Fade mask at the right edge. The dial center sits at cx=1516
              // and its ring (rOuter=210) extends past the stage's right edge
              // at x=1600, so the rings + the per-chapter background overlays
              // get clipped there. The mask turns that hard `overflow:hidden`
              // cut-off into a soft fade over the last 4% (~64px) so the
              // clipped content blends into the viewport bg behind the stage.
              maskImage:
                "linear-gradient(to right, black 0%, black 96%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, black 0%, black 96%, transparent 100%)",
            } as CSSProperties
          }
        >
        <BackgroundFor slug={current.slug} />
        <Header onBeforeNavigate={() => setZone(null)} />

        {/* Hero hover zone — left; morphs layout to B-state on enter.
            Default width extends to ~60% of the stage, stopping just shy
            of where the dial visually begins. */}
        <div
          onMouseEnter={() => setZone("hero")}
          onMouseLeave={() => setZone(null)}
          style={{
            position: "absolute",
            left: 0,
            top: 88,
            bottom: 56,
            width: isHero ? 1100 : 960,
            zIndex: isHero ? 7 : 6,
            background: "transparent",
            transition: `width ${DUR} ${EASE}`,
            cursor: "pointer",
            pointerEvents: isDial ? "none" : "auto",
          }}
        />

        {/* Dial hover zone — right; click toggles focus. Left edge tracks
            the hero zone's default width so the two zones butt up cleanly
            without overlap. Wheel-to-rotate is handled globally via a
            window listener (see useEffect above) so scrolling works from
            any zone. */}
        <div
          onMouseEnter={() => !focused && setZone("dial")}
          onMouseLeave={() => !focused && setZone(null)}
          onClick={() => {
            setHintDismissed(true);
            setFocused((f) => !f);
          }}
          style={{
            position: "absolute",
            left: focused ? 0 : 960,
            top: focused ? 0 : 88,
            right: 0,
            bottom: focused ? 0 : 56,
            zIndex: focused ? 9 : isDial ? 7 : 6,
            // The dark veil now lives on a viewport-filling element outside
            // StageFit (see "Focus veil" sibling above) so it extends past
            // the stage letterbox. This div stays transparent — it's just
            // the hover/click catcher.
            background: "transparent",
            cursor: focused ? "zoom-out" : isDial ? "zoom-in" : "pointer",
            pointerEvents: isHero && !focused ? "none" : "auto",
            transition: `left ${DUR} ${EASE}, top ${DUR} ${EASE}, bottom ${DUR} ${EASE}`,
          }}
        />

        <HeroChapter
          project={current}
          projectIdx={projectIdx}
          total={len}
          dir={dir}
          isHero={isHero}
          focused={focused}
          accent={ACCENT}
          onCtaEnter={() => setZone("hero")}
          onCtaLeave={() => setZone(null)}
          onOpenCaseStudy={() => {
            setZone(null);
            navigate(`/projects/${current.slug}`, "forward");
          }}
        />

        <RadialDial
          projectIdx={projectIdx}
          ticks={ticks}
          rotationDeg={rotationDeg}
          rotRad={rotRad}
          isHero={isHero}
          isDial={isDial}
          focused={focused}
          accent={ACCENT}
          shadow="var(--shadow)"
        />

        <SnapDots
          projects={PROJECTS}
          projectIdx={projectIdx}
          visible={isHero}
          accent={ACCENT}
        />

        <Tagline text={tagline} />

        <DeskHint dismissed={hintDismissed} hidden={focused || isHero} />

        {/* Notch hit pills — pill extends in the direction of its label so
            it always covers notch + label together. Pill direction follows
            the notch's effective hemisphere (cos > 0 → extends right, else
            extends left). All 9 render in focus mode; in default mode only
            the on-screen ones (cos ≤ 1/3) are active. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: focused ? 11 : 8,
            pointerEvents: "none",
          }}
        >
          {ticks.map(({ p, i, angle }) => {
            // In focus, dial doesn't rotate, so use natural angle.
            const effectiveAngle = focused ? angle : angle + rotRad;
            const xx = Math.cos(effectiveAngle);
            const yy = Math.sin(effectiveAngle);
            const onScreen = focused || xx <= ONSCREEN_COS_MAX;
            const px = cx + dialOffsetX + xx * rOuter * dialScale;
            const py = cy + dialOffsetY + yy * rOuter * dialScale;
            const hitW = 220 * dialScale;
            const hitH = 70 * dialScale;
            const overR = 24 * dialScale;
            // Anchor the pill on the side of the notch that faces its label,
            // interpolating linearly from the unit-circle position. Same
            // approach as RadialDial labels — so top notches anchor at their
            // bottom edge (pill sits above), bottom notches anchor at their
            // top edge (pill sits below), and side notches are vertically
            // centered. `overR` then nudges the pill toward the wheel
            // center so it overlaps the notch line.
            const left = px - ((1 - xx) / 2) * hitW - xx * overR;
            const top = py - ((1 - yy) / 2) * hitH - yy * overR;
            const active = onScreen && !isHero;
            return (
              <div
                key={`hit-${p.slug}`}
                onClick={(e) => {
                  e.stopPropagation();
                  jumpToIndex(i);
                }}
                style={{
                  position: "absolute",
                  left,
                  top,
                  width: hitW,
                  height: hitH,
                  borderRadius: hitH / 2,
                  cursor: "pointer",
                  pointerEvents: active ? "auto" : "none",
                  opacity: active ? 1 : 0,
                  transition: `left .55s ${EASE}, top .55s ${EASE}, width .55s ${EASE}, height .55s ${EASE}, opacity ${DUR} ${EASE}, background-color ${DUR} ${EASE}`,
                  background: DEBUG_PILLS ? `${ACCENT}24` : "transparent",
                  border: DEBUG_PILLS ? `1px dashed ${ACCENT}aa` : "none",
                }}
                title={`Jump to ${p.name}`}
              />
            );
          })}
        </div>

        <FocusOverlay
          focused={focused}
          onClose={() => setFocused(false)}
        />
        </div>
      </StageFit>
    </div>
  );
}
