import type { CSSProperties } from "react";
import type { Project } from "@/lib/projects";
import { DUR, EASE } from "@/lib/motion";

type Props = {
  project: Project;
  projectIdx: number;
  total: number;
  dir: 1 | -1;
  isHero: boolean;
  focused: boolean;
  accent: string;
  onOpenCaseStudy: () => void;
  // Hover handlers for the CTA's wrapper. Needed because the CTA sits above
  // the hero hover zone (higher z-index for click receipt), which means
  // moving the pointer from the hero zone onto the CTA fires the zone's
  // mouseLeave. Without these, the hero would zoom back out as soon as the
  // user reached for the CTA. The host wires these to maintain hero state.
  onCtaEnter?: () => void;
  onCtaLeave?: () => void;
};

// Each element is its own absolutely-positioned block that morphs between a
// left-anchored default position (left edge at x=96) and a viewport-centered
// hero position (centered around x=800). The horizontal anchor swaps via
// `left` + `transform: translateX`, both of which interpolate smoothly — so
// every element travels to center in lockstep instead of teleporting.
//
// Y positions are hardcoded for both states. Default-state meta/title are
// pulled upward so the title's descenders clear the active dial label sitting
// at 9 o'clock. Blurb/CTA positions also account for the title's font-size
// jump (120 → 144), which would otherwise leave a loose gap below the title.
const POS = {
  meta: { defaultY: 202, heroY: 196 },
  title: { defaultY: 239, heroY: 233 },
  blurb: { defaultY: 377, heroY: 394 },
  cta: { defaultY: 505, heroY: 514 },
} as const;

export function HeroChapter({
  project,
  projectIdx,
  total,
  dir,
  isHero,
  focused,
  accent,
  onOpenCaseStudy,
  onCtaEnter,
  onCtaLeave,
}: Props) {
  const idxLabel = String(projectIdx + 1).padStart(2, "0");
  const totalLabel = String(total).padStart(2, "0");
  const chapterAnim = `${dir > 0 ? "heroFromBelow" : "heroFromAbove"} .6s ${EASE}`;

  const morph = (defaultY: number, heroY: number): CSSProperties => ({
    position: "absolute",
    left: isHero ? "50%" : 96,
    top: isHero ? heroY : defaultY,
    transform: isHero ? "translateX(-50%)" : "translateX(0)",
    transition: `left ${DUR} ${EASE}, top ${DUR} ${EASE}, transform ${DUR} ${EASE}, opacity ${DUR} ${EASE}`,
    opacity: focused ? 0 : 1,
    pointerEvents: "none",
    zIndex: 3,
  });

  // Chapter-swap animator: re-mounts per projectIdx so heroFromBelow/Above
  // plays. Wheel events fire from any zone now (including hero), so swaps
  // can happen in either state — pivot adapts so the slight rotation looks
  // balanced: right edge while left-anchored, center while centered.
  const animStyle: CSSProperties = {
    animation: chapterAnim,
    transformOrigin: isHero ? "50% 50%" : "100% 50%",
  };

  return (
    <>
      {/* chapterMeta */}
      <div style={morph(POS.meta.defaultY, POS.meta.heroY)}>
        <div key={`meta-${projectIdx}`} style={animStyle}>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              letterSpacing: isHero ? "0.2em" : "0.1em",
              textTransform: "uppercase",
              color: "var(--fg-mute)",
              whiteSpace: "nowrap",
              transition: `letter-spacing ${DUR} ${EASE}`,
            }}
          >
            ◦ {idxLabel} / {totalLabel} &nbsp;·&nbsp; {project.year}
          </div>
        </div>
      </div>

      {/* title */}
      <div style={morph(POS.title.defaultY, POS.title.heroY)}>
        <div key={`title-${projectIdx}`} style={animStyle}>
          <div
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontWeight: 300,
              fontSize: isHero ? 144 : 120,
              lineHeight: 0.92,
              letterSpacing: "-0.03em",
              whiteSpace: "nowrap",
              transition: `font-size ${DUR} ${EASE}`,
            }}
          >
            {project.name}
          </div>
        </div>
      </div>

      {/* blurb */}
      <div style={morph(POS.blurb.defaultY, POS.blurb.heroY)}>
        <div key={`blurb-${projectIdx}`} style={animStyle}>
          <div
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 17,
              lineHeight: 1.45,
              width: isHero ? 520 : 460,
              color: "var(--fg-soft)",
              transition: `width ${DUR} ${EASE}`,
            }}
          >
            {project.blurb}
          </div>
        </div>
      </div>

      {/* cta — the only hero element that needs clicks. Sits above the
          hero hover zone (z-index 6/7 in Home.tsx); the wrapper's morph
          z-index 3 would otherwise let the hover zone swallow the event.
          Hover handlers maintain the parent's hero-zone state so the hero
          text doesn't zoom back out when the pointer moves onto the CTA. */}
      <div
        onMouseEnter={onCtaEnter}
        onMouseLeave={onCtaLeave}
        style={{
          ...morph(POS.cta.defaultY, POS.cta.heroY),
          zIndex: 10,
          pointerEvents: "auto",
        }}
      >
        <div key={`cta-${projectIdx}`} style={animStyle}>
          <button
            onClick={onOpenCaseStudy}
            aria-label={`${project.cta ?? "Open case study"}: ${project.name}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              paddingBottom: 6,
              borderBottom: `1px solid ${accent}`,
              whiteSpace: "nowrap",
              background: "transparent",
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
              color: "inherit",
              padding: "0 0 6px",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 16 }}>→</span> {project.cta ?? "Open case study"}
          </button>
        </div>
      </div>
    </>
  );
}
