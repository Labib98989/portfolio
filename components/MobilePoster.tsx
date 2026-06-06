"use client";

import { type CSSProperties } from "react";
import type { DeckItem } from "@/lib/mobileDeck";
import { BackgroundFor } from "./Backgrounds";
import { MorphingGlyph } from "./MorphingGlyph";

// One full-screen card in the deck. The card is a fixed "poster" — it never
// scrolls; all depth lives behind the swipe-right (detail) gesture. Each card
// carries its OWN theme as local CSS variables, because during a vertical drag
// two cards are visible at once and each must paint in its own colors (unlike
// desktop, where a single themed stage cross-fades).
//
// Three faces share one composition (meta → centerpiece → title → subtitle →
// detail hint): a chapter shows its MorphingGlyph; About and Currently show a
// generated riso motif instead.

export function MobilePoster({
  item,
  onOpen,
}: {
  item: DeckItem;
  onOpen?: () => void;
}) {
  const themeVars =
    item.kind === "project"
      ? {
          "--bg": item.project.theme.bgPrimary,
          "--bg-secondary": item.project.theme.bgSecondary,
          "--accent": item.project.theme.accent,
          "--fg": item.project.theme.fg,
          "--shadow": item.project.theme.shadow,
        }
      : {
          "--bg": item.bg,
          "--bg-secondary": item.bgSecondary,
          "--accent": item.accent,
          "--fg": item.fg,
          "--shadow": item.shadow,
        };

  return (
    <section
      style={
        {
          ...themeVars,
          "--fg-soft": "color-mix(in srgb, var(--fg) 80%, transparent)",
          "--fg-mute": "color-mix(in srgb, var(--fg) 54%, transparent)",
          "--fg-dim": "color-mix(in srgb, var(--fg) 38%, transparent)",
          "--line": "color-mix(in srgb, var(--fg) 16%, transparent)",
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          color: "var(--fg)",
          background:
            "radial-gradient(circle at 50% 36%, var(--bg-secondary) 0%, var(--bg) 72%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding:
            "calc(env(safe-area-inset-top, 0px) + 66px) 28px calc(env(safe-area-inset-bottom, 0px) + 38px)",
          fontFamily: "var(--font-inter), sans-serif",
        } as CSSProperties
      }
    >
      {item.kind === "project" && <BackgroundFor slug={item.project.slug} />}

      {/* Top — meta line */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Meta item={item} />
      </div>

      {/* Middle — centerpiece + title + subtitle */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 4,
          marginTop: -8,
        }}
      >
        <div
          style={{
            width: "clamp(150px, 40vw, 220px)",
            height: "clamp(150px, 40vw, 220px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 26,
          }}
        >
          {item.kind === "project" ? (
            <MorphingGlyph
              chapter={item.chapter}
              accent={item.project.theme.glyph.inkAccent}
              shadow={item.project.theme.glyph.inkShadow}
              size="100%"
              durationMs={0}
            />
          ) : item.kind === "about" ? (
            <ApertureMotif />
          ) : (
            <LiveMotif />
          )}
        </div>

        {item.kind === "currently" && (
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 8,
            }}
          >
            {item.overline}
          </div>
        )}

        <h1
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontWeight: 300,
            fontSize: "clamp(40px, 12vw, 66px)",
            lineHeight: 0.96,
            letterSpacing: "-0.03em",
            margin: 0,
            maxWidth: "12ch",
          }}
        >
          {title(item)}
        </h1>

        <p
          style={{
            fontFamily:
              item.kind === "project"
                ? "var(--font-inter), sans-serif"
                : "var(--font-fraunces), serif",
            fontStyle: item.kind === "project" ? "normal" : "italic",
            fontWeight: 300,
            fontSize: "clamp(15px, 4.2vw, 18px)",
            lineHeight: 1.5,
            color: "var(--fg-soft)",
            margin: "16px 0 0",
            maxWidth: 460,
          }}
        >
          {subtitle(item)}
        </p>
      </div>

      {/* Bottom — the detail CTA. It's a real button now (tapping it opens the
          page, same as swiping right). stopPropagation on pointerdown so a tap
          never starts a deck drag — that keeps the click reliable under the
          gesture surface that wraps the whole deck. */}
      <button
        onClick={onOpen}
        onPointerDown={(e) => e.stopPropagation()}
        aria-label={cta(item)}
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 9,
          background: "transparent",
          border: "none",
          padding: "10px 8px 0",
          cursor: "pointer",
          color: "var(--fg)",
          font: "inherit",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 9.5,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--fg-dim)",
          }}
        >
          tap · or swipe right
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 9,
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "var(--fg)",
            paddingBottom: 6,
            borderBottom: "1px solid var(--accent)",
          }}
        >
          {cta(item)}
          <span style={{ color: "var(--accent)", fontSize: 15 }}>→</span>
        </span>
      </button>
    </section>
  );
}

// ----- content accessors -----

function title(item: DeckItem): string {
  return item.kind === "project" ? item.project.name : item.title;
}

function subtitle(item: DeckItem): string {
  return item.kind === "project" ? item.project.blurb : item.subtitle;
}

function cta(item: DeckItem): string {
  if (item.kind === "project") return item.project.cta ?? "Open case study";
  return item.cta;
}

// ----- subcomponents -----

function Meta({ item }: { item: DeckItem }) {
  const text =
    item.kind === "project"
      ? `${String(item.chapter).padStart(2, "0")} / ${String(item.total).padStart(2, "0")} · ${item.project.year}`
      : item.meta;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 9,
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize: 11,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "var(--fg-mute)",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "var(--accent)",
          boxShadow: "0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent)",
          flexShrink: 0,
        }}
      />
      <span>{text}</span>
    </div>
  );
}

// About: an aperture — a thin ring with a dashed orbit and one offset accent
// dot. "An eye on the work" without leaning on a literal portrait, and it keeps
// the card consistent with the chapter glyphs. The actual photo lives on the
// /about detail page instead.
function ApertureMotif() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden style={{ display: "block" }}>
      <circle cx="50" cy="50" r="38" fill="none" stroke="var(--line)" strokeWidth="1.2" />
      <circle
        cx="50"
        cy="50"
        r="27"
        fill="none"
        stroke="color-mix(in srgb, var(--accent) 55%, transparent)"
        strokeWidth="1.2"
        strokeDasharray="2 7"
      />
      <circle cx="50" cy="50" r="9" fill="none" stroke="var(--accent)" strokeWidth="2" />
      <circle cx="62" cy="38" r="3.4" fill="var(--accent)" />
    </svg>
  );
}

// Currently: a live signal — concentric rings pulsing out from an accent core.
function LiveMotif() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden style={{ display: "block" }}>
      <circle cx="50" cy="50" r="34" fill="none" stroke="var(--line)" strokeWidth="1.2" />
      <circle
        className="deck-pulse"
        cx="50"
        cy="50"
        r="20"
        fill="none"
        stroke="color-mix(in srgb, var(--accent) 60%, transparent)"
        strokeWidth="1.5"
        style={{ transformOrigin: "50% 50%" }}
      />
      <circle cx="50" cy="50" r="7" fill="var(--accent)" />
    </svg>
  );
}
