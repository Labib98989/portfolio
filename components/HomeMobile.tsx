"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { PROJECTS, TAGLINES, type Project } from "@/lib/projects";
import { MorphingGlyph } from "./MorphingGlyph";
import { useChapterState } from "./ChapterState";
import { useTransition } from "./TransitionShell";
import { MobileChapterSheet } from "./MobileChapterSheet";

// Mobile home: one chapter per viewport, CSS scroll-snap. The desktop's
// wheel + hover-zone interaction model doesn't translate to phones, so
// this is a parallel layout that shares only the underlying chapter
// data (PROJECTS) and the chapter index provider (ChapterState).
//
// Chrome: a small fixed wordmark top-left, a chapter pill at the bottom
// that opens MobileChapterSheet for picking + cross-route nav.

export function HomeMobile() {
  const { navigate } = useTransition();
  const { chapterIdx, setChapterIdx } = useChapterState();
  const scrollerRef = useRef<HTMLDivElement>(null);
  // Storing refs in a plain array keeps scroll-into-view jumps cheap and
  // lets the IntersectionObserver effect attach to the live elements
  // without rebinding on every render.
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [tagline, setTagline] = useState(TAGLINES[0]);

  useEffect(() => {
    setTagline(TAGLINES[Math.floor(Math.random() * TAGLINES.length)]);
  }, []);

  // First paint: jump to the last-active chapter so navigating back from
  // a case study lands on the right section instead of resetting to 0.
  // Uses `auto` (instant) so we don't see a programmatic smooth-scroll on
  // initial mount. Wrapped in rAF so the snap container has laid out.
  useEffect(() => {
    const target = sectionRefs.current[chapterIdx];
    if (!target) return;
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "auto", block: "start" });
    });
    // Mount-only; subsequent chapterIdx changes come from scroll itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync active chapter to scroll position via IntersectionObserver. The
  // section whose visible area passes the threshold is "the current one."
  // Threshold of 0.55 means the section needs to occupy >55% of the
  // scroller before it becomes active — avoids the index flickering
  // between two adjacent chapters mid-snap.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            const idx = Number(entry.target.getAttribute("data-chapter"));
            if (!Number.isNaN(idx)) setChapterIdx(idx);
          }
        }
      },
      { root: scroller, threshold: [0.55] },
    );
    for (const el of sectionRefs.current) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [setChapterIdx]);

  const jumpToChapter = useCallback((i: number) => {
    setSheetOpen(false);
    const target = sectionRefs.current[i];
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const currentAccent = PROJECTS[chapterIdx]?.theme.accent ?? "#efefec";

  return (
    <>
      <MobileWordmark />

      <div
        ref={scrollerRef}
        style={{
          position: "fixed",
          inset: 0,
          overflowY: "auto",
          overflowX: "hidden",
          scrollSnapType: "y mandatory",
          WebkitOverflowScrolling: "touch",
          zIndex: 1,
        }}
      >
        {PROJECTS.map((p, i) => (
          <ChapterSection
            key={p.slug}
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
            project={p}
            index={i}
            total={PROJECTS.length}
            tagline={i === 0 ? tagline : null}
            onOpenCaseStudy={() => navigate(`/projects/${p.slug}`, "forward")}
          />
        ))}
      </div>

      <MobileChapterPill
        active={chapterIdx}
        total={PROJECTS.length}
        currentName={PROJECTS[chapterIdx]?.name ?? ""}
        accent={currentAccent}
        onClick={() => setSheetOpen(true)}
      />

      <MobileChapterSheet
        open={sheetOpen}
        active={chapterIdx}
        onClose={() => setSheetOpen(false)}
        onSelect={jumpToChapter}
      />
    </>
  );
}

// ----- chapter section -----

type ChapterSectionProps = {
  project: Project;
  index: number;
  total: number;
  tagline: string | null;
  onOpenCaseStudy: () => void;
  ref?: React.Ref<HTMLElement>;
};

function ChapterSection({
  project,
  index,
  total,
  tagline,
  onOpenCaseStudy,
  ref,
}: ChapterSectionProps) {
  const { theme } = project;
  const idxLabel = String(index + 1).padStart(2, "0");
  const totalLabel = String(total).padStart(2, "0");

  // CSS vars scoped to the section so child styles can use --accent / --fg
  // exactly like desktop. The section paints its own per-chapter gradient
  // — adjacent sections paint over each other as the user snap-scrolls.
  const style: CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100dvh",
    minHeight: 560,
    scrollSnapAlign: "start",
    scrollSnapStop: "always",
    background: `radial-gradient(circle at 50% 38%, ${theme.bgSecondary} 0%, ${theme.bgPrimary} 78%)`,
    color: theme.fg,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "80px 24px 110px",
    boxSizing: "border-box",
    overflow: "hidden",
    // CSS custom props for descendant style cohesion across chapters.
    ["--accent" as string]: theme.accent,
    ["--shadow" as string]: theme.shadow,
    ["--fg" as string]: theme.fg,
    ["--fg-soft" as string]: `color-mix(in srgb, ${theme.fg} 82%, transparent)`,
    ["--fg-mute" as string]: `color-mix(in srgb, ${theme.fg} 55%, transparent)`,
    ["--fg-dim" as string]: `color-mix(in srgb, ${theme.fg} 42%, transparent)`,
  };

  return (
    <section ref={ref} data-chapter={index} style={style}>
      {/* Meta */}
      <div
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--fg-mute)",
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          aria-hidden
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: theme.accent,
            boxShadow: `0 0 0 3px color-mix(in srgb, ${theme.accent} 26%, transparent)`,
          }}
        />
        <span>
          {idxLabel} / {totalLabel}
        </span>
        <span style={{ color: "var(--fg-dim)" }}>·</span>
        <span>{project.year}</span>
      </div>

      {/* Glyph + title block, vertically centered within the available space */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: 24,
          flex: 1,
          justifyContent: "center",
          paddingTop: 8,
          paddingBottom: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <div style={{ width: "min(56vw, 200px)", aspectRatio: "1 / 1" }}>
            <MorphingGlyph
              chapter={index + 1}
              accent={theme.accent}
              shadow={theme.shadow}
              durationMs={1}
            />
          </div>
        </div>

        <h2
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontWeight: 300,
            fontSize: "clamp(46px, 13vw, 84px)",
            lineHeight: 0.95,
            letterSpacing: "-0.025em",
            margin: 0,
          }}
        >
          {project.name}
        </h2>

        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "clamp(15px, 4vw, 17px)",
            lineHeight: 1.5,
            color: "var(--fg-soft)",
            margin: 0,
            maxWidth: 420,
          }}
        >
          {project.blurb}
        </p>

        <button
          onClick={onOpenCaseStudy}
          aria-label={`${project.cta ?? "Open case study"}: ${project.name}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            alignSelf: "flex-start",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "0 0 6px",
            background: "transparent",
            border: "none",
            borderBottom: `1px solid ${theme.accent}`,
            color: theme.fg,
            cursor: "pointer",
          }}
        >
          <span aria-hidden style={{ fontSize: 16 }}>
            →
          </span>{" "}
          {project.cta ?? "Open case study"}
        </button>
      </div>

      {/* First-chapter only: tagline lives here instead of as floating
          chrome so we don't fight the chapter pill for the bottom edge. */}
      {tagline && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--fg-mute)",
            maxWidth: 520,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: theme.accent,
              flexShrink: 0,
            }}
          />
          <span>{tagline}</span>
        </div>
      )}

      {/* Scroll-hint chevron, only on chapter 1 — tells visitors there's more. */}
      {index === 0 && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 64,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--fg-dim)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            pointerEvents: "none",
          }}
        >
          <span>Swipe</span>
          <span style={{ fontSize: 14 }}>↓</span>
        </div>
      )}
    </section>
  );
}

// ----- floating chrome -----

function MobileWordmark() {
  return (
    <div
      style={{
        position: "fixed",
        top: 18,
        left: 20,
        fontFamily: "var(--font-inter), sans-serif",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "#efefec",
        // Difference blend keeps the wordmark legible across light + dark
        // chapter backgrounds without per-chapter color logic. Falls back
        // to plain white on browsers that don't support mix-blend-mode.
        mixBlendMode: "difference",
        zIndex: 30,
        pointerEvents: "none",
      }}
    >
      Labib Karim
    </div>
  );
}

function MobileChapterPill({
  active,
  total,
  currentName,
  accent,
  onClick,
}: {
  active: number;
  total: number;
  currentName: string;
  accent: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label="Open chapter index"
      style={{
        position: "fixed",
        left: "50%",
        bottom: 24,
        transform: "translateX(-50%)",
        zIndex: 30,
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 16px",
        background: "rgba(34, 32, 29, 0.78)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid color-mix(in srgb, #efefec 22%, transparent)",
        borderRadius: 999,
        color: "#efefec",
        fontFamily: "var(--font-inter), sans-serif",
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.04em",
        cursor: "pointer",
        maxWidth: "calc(100vw - 40px)",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: accent,
          boxShadow: `0 0 8px ${accent}`,
          flexShrink: 0,
          transition: "background-color 280ms",
        }}
      />
      <span
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 11,
          letterSpacing: "0.1em",
          color: "color-mix(in srgb, #efefec 70%, transparent)",
        }}
      >
        {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      <span
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {currentName}
      </span>
      <span
        aria-hidden
        style={{
          fontSize: 14,
          color: "color-mix(in srgb, #efefec 50%, transparent)",
        }}
      >
        ↕
      </span>
    </button>
  );
}
