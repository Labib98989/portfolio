"use client";

import { useEffect, useState } from "react";
import { MorphingGlyph } from "@/components/MorphingGlyph";
import { PROJECTS } from "@/lib/projects";

export default function GlyphsPreview() {
  // Active chapter for the big morph-stage demo. Auto-loops through all 9.
  const [chapter, setChapter] = useState(1);
  const [autoLoop, setAutoLoop] = useState(true);

  useEffect(() => {
    if (!autoLoop) return;
    const id = setInterval(() => {
      setChapter((c) => (c % 9) + 1);
    }, 1800);
    return () => clearInterval(id);
  }, [autoLoop]);

  const theme = PROJECTS[chapter - 1].theme;

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "48px 32px 96px",
        background: "#1a1a1a",
        color: "#efefec",
        fontFamily: "var(--font-inter), system-ui, sans-serif",
      }}
    >
      <header style={{ maxWidth: 1200, margin: "0 auto 32px" }}>
        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(239,239,236,0.5)",
          }}
        >
          Preview · chapter glyphs · all 9
        </div>
        <h1
          style={{
            margin: "8px 0 0",
            fontFamily: "var(--font-fraunces), serif",
            fontWeight: 400,
            fontSize: 36,
            letterSpacing: "-0.01em",
          }}
        >
          Compositional morph across the wheel
        </h1>
        <p
          style={{
            margin: "12px 0 0",
            maxWidth: 720,
            color: "rgba(239,239,236,0.65)",
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          Each glyph is composed of the same 14 named roles —{" "}
          <code style={{ opacity: 0.9 }}>primary</code>,{" "}
          <code style={{ opacity: 0.9 }}>ring</code>,{" "}
          <code style={{ opacity: 0.9 }}>handle</code>,{" "}
          <code style={{ opacity: 0.9 }}>echo</code>,{" "}
          <code style={{ opacity: 0.9 }}>line_top_*</code>,{" "}
          <code style={{ opacity: 0.9 }}>line_bot_*</code>,{" "}
          <code style={{ opacity: 0.9 }}>dot_*</code>,{" "}
          <code style={{ opacity: 0.9 }}>corner_*</code> — assigned to
          chapter-specific shapes. On chapter change every role translates from
          its old centerpoint to its new one while the shape crossfades.
        </p>
      </header>

      {/* === BIG MORPH STAGE === */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto 56px",
          padding: 24,
          background: "#111",
          border: "1px solid rgba(239,239,236,0.08)",
          borderRadius: 12,
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: 24,
        }}
      >
        <div
          style={{
            background: theme.bgPrimary,
            color: theme.fg,
            borderRadius: 8,
            minHeight: 440,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 700ms cubic-bezier(.4,.0,.2,1)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 20,
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              opacity: 0.55,
            }}
          >
            Ch · {String(chapter).padStart(2, "0")} ·{" "}
            {PROJECTS[chapter - 1].name}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 18,
              left: 20,
              right: 20,
              fontSize: 12,
              opacity: 0.6,
              lineHeight: 1.5,
            }}
          >
            {PROJECTS[chapter - 1].theme.glyph.subject}
          </div>
          <div style={{ width: 360, height: 360 }}>
            <MorphingGlyph
              chapter={chapter}
              accent={theme.accent}
              shadow={theme.shadow}
              durationMs={900}
            />
          </div>
        </div>

        <aside
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(239,239,236,0.5)",
              marginBottom: 4,
            }}
          >
            Jump to chapter
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 6,
            }}
          >
            {PROJECTS.map((p, i) => {
              const n = i + 1;
              const active = chapter === n;
              return (
                <button
                  key={p.slug}
                  onClick={() => {
                    setAutoLoop(false);
                    setChapter(n);
                  }}
                  style={{
                    padding: "10px 8px",
                    background: active ? p.theme.accent : "transparent",
                    color: active ? "#1a1a1a" : "#efefec",
                    border: `1px solid ${active ? p.theme.accent : "rgba(239,239,236,0.18)"}`,
                    borderRadius: 6,
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 10,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    textAlign: "left",
                    transition:
                      "background-color 250ms, color 250ms, border-color 250ms",
                  }}
                  title={p.name}
                >
                  {String(n).padStart(2, "0")}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setAutoLoop((v) => !v)}
            style={{
              marginTop: 8,
              padding: "10px 12px",
              background: autoLoop ? "rgba(239,239,236,0.12)" : "transparent",
              border: "1px solid rgba(239,239,236,0.18)",
              borderRadius: 6,
              color: "#efefec",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            {autoLoop ? "▍ Pause auto-loop" : "▶ Resume auto-loop"}
          </button>
          <div
            style={{
              marginTop: 12,
              fontSize: 12,
              lineHeight: 1.55,
              color: "rgba(239,239,236,0.55)",
            }}
          >
            Corner brackets stay anchored. Watch the primary, ring, handle, and
            echo roles travel across the canvas while the line and dot
            scaffolding redistributes around them.
          </div>
        </aside>
      </section>

      {/* === GRID OF ALL 9 AT REST === */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {PROJECTS.map((p, i) => {
          const n = i + 1;
          return (
            <article
              key={p.slug}
              onClick={() => {
                setAutoLoop(false);
                setChapter(n);
              }}
              style={{
                background: p.theme.bgPrimary,
                color: p.theme.fg,
                borderRadius: 8,
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                aspectRatio: "1 / 1.1",
                cursor: "pointer",
                outline:
                  chapter === n
                    ? `2px solid ${p.theme.accent}`
                    : "2px solid transparent",
                outlineOffset: 2,
                transition: "outline-color 200ms",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 9,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  opacity: 0.55,
                }}
              >
                <span>Ch · {String(n).padStart(2, "0")}</span>
                <span>{p.year}</span>
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: 130, height: 130 }}>
                  {/* Each card is its own MorphingGlyph at fixed chapter — no
                      morph here, just renders the at-rest state of the spec. */}
                  <MorphingGlyph
                    chapter={n}
                    accent={p.theme.accent}
                    shadow={p.theme.shadow}
                    durationMs={1}
                  />
                </div>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  fontSize: 14,
                  fontWeight: 400,
                }}
              >
                {p.name}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
