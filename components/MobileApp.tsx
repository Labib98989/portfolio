"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import { PROJECTS } from "@/lib/projects";
import { buildDeckItems } from "@/lib/mobileDeck";
import {
  DECK_DUR_MS,
  DECK_EASE,
  DECK_SPRING,
  DECK_SPRING_DUR_MS,
} from "@/lib/motion";
import { useSwipeDeck } from "@/lib/useSwipeDeck";
import { useChapterState } from "./ChapterState";
import { MobileDial } from "./MobileDial";
import { MobilePoster } from "./MobilePoster";
import { useTransition } from "./TransitionShell";

// The mobile site, rebuilt as a swipe-driven card app. There is no scrolling
// anywhere — every screen is a fixed poster and all movement is gesture:
//
//   swipe up / down  → previous / next chapter (About above, Currently below)
//   swipe right      → that card's detail page  (slides in from the left)
//   swipe left       → the dial / chapter index (slides in from the right)
//
// Deck order: [ About, ...9 chapters, Currently ]. The active card's slug is
// mirrored to a shallow `#hash` so cards are deep-linkable and the back button
// restores position; detail pages are real routes via the shared transition.

// Column commit/snap-back: fast, crisp, no overshoot. Dial slide: springy pop.
const SNAP = `transform ${DECK_DUR_MS}ms ${DECK_EASE}`;
const SPRING = `transform ${DECK_SPRING_DUR_MS}ms ${DECK_SPRING}`;
const COACH_KEY = "mobileDeckCoachSeen";

export function MobileApp() {
  const { navigate } = useTransition();
  const { chapterIdx, setChapterIdx } = useChapterState();

  const items = useMemo(buildDeckItems, []);
  const count = items.length;

  // Active deck index. Initial value resolves from the URL hash (deep-link),
  // else resumes the remembered chapter (About = 0, so chapter N = N + 1).
  const [activeIndex, setActiveIndex] = useState(() => {
    if (typeof window !== "undefined") {
      const h = window.location.hash.replace("#", "");
      if (h) {
        const i = items.findIndex((it) => it.hash === h);
        if (i >= 0) return i;
      }
    }
    return chapterIdx + 1;
  });

  const [dialOpen, setDialOpen] = useState(false);
  const [coach, setCoach] = useState(false);

  // Transitions are disarmed for a beat after mount so the deck never *animates*
  // its arrival. When returning from a detail page the canvas reveals an
  // already-settled card; without this, any pre-paint correction (below) could
  // slide visibly. Re-armed on first touch (so gestures animate immediately) or
  // after the reveal window passes.
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setArmed(true), 380);
    return () => window.clearTimeout(t);
  }, []);

  // Viewport size drives both the paging math and each poster's fixed height.
  const [vp, setVp] = useState(() => ({
    w: typeof window !== "undefined" ? window.innerWidth : 0,
    h: typeof window !== "undefined" ? window.innerHeight : 0,
  }));
  useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Pre-paint safety net: re-assert the card from the URL hash on mount. If the
  // useState initializer ran before the hash was applied (the back-nav race that
  // made About/Currently flash a chapter), this corrects it before the browser
  // paints — so the reveal shows the right card, no jump.
  useLayoutEffect(() => {
    const h = window.location.hash.replace("#", "");
    if (!h) return;
    const i = items.findIndex((it) => it.hash === h);
    if (i >= 0) setActiveIndex(i);
  }, [items]);

  // Mirror active card → shallow URL + remembered chapter.
  useEffect(() => {
    const item = items[activeIndex];
    if (!item) return;
    window.history.replaceState(null, "", `#${item.hash}`);
    if (item.kind === "project") setChapterIdx(item.chapter - 1);
  }, [activeIndex, items, setChapterIdx]);

  // First-visit coachmark.
  useEffect(() => {
    try {
      if (!localStorage.getItem(COACH_KEY)) setCoach(true);
    } catch {
      /* storage blocked — just skip the coachmark */
    }
  }, []);
  const dismissCoach = useCallback(() => {
    setCoach(false);
    try {
      localStorage.setItem(COACH_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  const openDetail = useCallback(() => {
    navigate(items[activeIndex].href, "forward");
  }, [navigate, items, activeIndex]);

  const { state, bind } = useSwipeDeck({
    count,
    index: activeIndex,
    height: vp.h,
    width: vp.w,
    disabled: dialOpen || coach,
    onIndexChange: setActiveIndex,
    onSwipeRight: openDetail,
    onSwipeLeft: () => setDialOpen(true),
  });

  const activeItem = items[activeIndex];
  const activeProject =
    activeItem.kind === "project" ? activeItem.chapter - 1 : -1;
  const railAccent =
    activeItem.kind === "project" ? activeItem.project.theme.accent : activeItem.accent;

  // ---- transforms ----
  const dragV = state.axis === "v" ? state.offsetY : 0;
  const peekX = state.axis === "h" && state.offsetX > 0 ? state.offsetX : 0;
  const columnTransform = `translate(${peekX}px, ${-activeIndex * vp.h + dragV}px)`;
  const columnTransition =
    !armed || (state.dragging && state.axis) ? "none" : SNAP;

  const dialDragging = state.dragging && state.axis === "h" && state.offsetX < 0;
  const dialX = dialOpen ? 0 : dialDragging ? vp.w + state.offsetX : vp.w;
  // While dragging the dial follows the finger 1:1; on release it springs into
  // place with a little overshoot for a playful pop.
  const dialTransition = dialDragging ? "none" : SPRING;

  // Detail-edge ghost intensity (finger-right).
  const detailGhost = Math.min(1, Math.max(0, peekX) / 80);

  if (!vp.h) return <div style={{ position: "fixed", inset: 0, background: "#22201d" }} />;

  return (
    <div style={{ position: "fixed", inset: 0, background: "#22201d", overflow: "hidden" }}>
      {/* Gesture surface + sliding column of posters */}
      <div
        {...bind}
        onPointerDownCapture={() => {
          if (!armed) setArmed(true);
        }}
        style={{
          position: "absolute",
          inset: 0,
          touchAction: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transform: columnTransform,
            transition: columnTransition,
            willChange: "transform",
          }}
        >
          {items.map((item) => (
            <div key={item.kind === "project" ? item.hash : item.kind} style={{ height: vp.h }}>
              <MobilePoster item={item} onOpen={() => navigate(item.href, "forward")} />
            </div>
          ))}
        </div>
      </div>

      {/* Detail-edge ghost — appears on the left as the card gives to the right */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 56,
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingLeft: 14,
          pointerEvents: "none",
          // Only visible while the card gives to the right — it reads as the
          // detail page being revealed underneath, not a persistent control.
          opacity: detailGhost,
          background: `linear-gradient(to right, color-mix(in srgb, ${railAccent} ${20 + detailGhost * 30}%, transparent), transparent)`,
          color: "#efefec",
          fontSize: 22,
          transition: state.dragging ? "none" : "opacity .3s ease",
        }}
      >
        ›
      </div>

      {/* Position rail — where you are in the spine */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 7,
          pointerEvents: "none",
          opacity: dialOpen ? 0 : 1,
          transition: "opacity .3s ease",
        }}
      >
        {items.map((item, i) => {
          const on = i === activeIndex;
          return (
            <span
              key={i}
              style={{
                width: on ? 8 : 5,
                height: on ? 8 : 5,
                borderRadius: "50%",
                background: on ? railAccent : "color-mix(in srgb, #efefec 28%, transparent)",
                boxShadow: on ? `0 0 8px ${railAccent}` : "none",
                transition: "all .3s ease",
              }}
            />
          );
        })}
      </div>

      {/* Dial overlay — slides in from the right. A touch wider than the
          viewport so the spring's left overshoot never bares the right edge
          (the extra width sits off-screen, clipped by the root's overflow). */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: vp.w + 48,
          zIndex: 20,
          transform: `translateX(${dialX}px)`,
          transition: dialTransition,
          willChange: "transform",
          pointerEvents: dialOpen ? "auto" : "none",
          boxShadow: dialOpen ? "-24px 0 60px rgba(0,0,0,0.5)" : "none",
        }}
      >
        <MobileDial
          projects={PROJECTS}
          active={activeProject}
          onJump={(ci) => {
            setActiveIndex(ci + 1);
            setDialOpen(false);
          }}
          onClose={() => setDialOpen(false)}
        />
      </div>

      {coach && <Coachmark accent={railAccent} onDismiss={dismissCoach} />}
    </div>
  );
}

// First-visit gesture legend. Dismisses on tap and never returns.
function Coachmark({ accent, onDismiss }: { accent: string; onDismiss: () => void }) {
  const label: CSSProperties = {
    fontFamily: "var(--font-jetbrains-mono), monospace",
    fontSize: 11,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "#efefec",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
  };
  const arrow: CSSProperties = { fontSize: 26, color: accent, lineHeight: 1 };
  return (
    <div
      onClick={onDismiss}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 40,
        background: "rgba(12,11,10,0.86)",
        backdropFilter: "blur(2px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
        padding: 32,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-fraunces), serif",
          fontWeight: 300,
          fontStyle: "italic",
          fontSize: 24,
          color: "#efefec",
        }}
      >
        Swipe to explore
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          alignItems: "center",
          justifyItems: "center",
          gap: "18px 24px",
        }}
      >
        <span />
        <span style={label}>
          <span style={arrow}>↑</span>
        </span>
        <span />

        <span style={label}>
          <span style={arrow}>←</span>
          Index
        </span>
        <span style={{ ...label, color: "color-mix(in srgb, #efefec 55%, transparent)" }}>
          Chapters
        </span>
        <span style={label}>
          <span style={arrow}>→</span>
          Case study
        </span>

        <span />
        <span style={label}>
          <span style={arrow}>↓</span>
        </span>
        <span />
      </div>

      <div
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "color-mix(in srgb, #efefec 45%, transparent)",
          marginTop: 8,
        }}
      >
        tap anywhere to start
      </div>
    </div>
  );
}
