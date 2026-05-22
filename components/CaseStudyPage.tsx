"use client";

import type { ReactNode } from "react";
import type { Project } from "@/lib/projects";
import type { CaseStudy } from "@/lib/caseStudies";
import {
  TransitionPageShell,
  useDropStyle,
} from "./TransitionPageShell";

const FG = "#efefec";
const FG_SOFT = "color-mix(in srgb, #efefec 78%, transparent)";
const FG_MUTE = "color-mix(in srgb, #efefec 52%, transparent)";
const FG_DIM = "color-mix(in srgb, #efefec 36%, transparent)";

// Case studies use the chapter's own accent so navigating from a chapter
// into its case study feels like the same world — color identity carries
// across the canvas wipe.
const MID = "·";

type Props = {
  project: Project;
  study: CaseStudy;
};

export function CaseStudyPage({ project, study }: Props) {
  const dropStyle = useDropStyle();
  const accent = project.theme.accent;

  // Build the stagger plan. Each section advances the index so the cascade
  // is continuous regardless of whether optional sections render.
  let i = 0;
  const next = () => i++;

  return (
    <TransitionPageShell>
      <article
        style={{
          maxWidth: 760,
          margin: 0,
          padding: "120px clamp(20px, 5vw, 96px) 100px",
        }}
      >
        {/* Meta */}
        <div style={dropStyle(next())}>
          <MetaLine accent={accent} chapter={project} />
        </div>

        {/* Title — use the real project name when we know it, otherwise the
            chapter label (so the page still works for stubbed chapters). */}
        <div style={dropStyle(next())}>
          <h1
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontWeight: 300,
              fontSize: "clamp(56px, 13vw, 124px)",
              lineHeight: 0.92,
              letterSpacing: "-0.03em",
              margin: "18px 0 16px",
              wordBreak: "break-word",
            }}
          >
            {study.realName ?? project.name}
          </h1>
        </div>

        {/* When real name differs from chapter label, surface the chapter as
            a small caption so a reader who came from the wheel sees the
            connection. */}
        {study.realName && (
          <div style={dropStyle(next())}>
            <div
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 12,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: FG_MUTE,
                margin: "0 0 36px",
              }}
            >
              Chapter {MID} {project.name}
            </div>
          </div>
        )}

        {/* One-liner */}
        <div style={dropStyle(next())}>
          <p
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "clamp(18px, 4.5vw, 22px)",
              lineHeight: 1.4,
              color: FG_SOFT,
              margin: "0 0 64px",
              maxWidth: 640,
            }}
          >
            {study.oneLiner}
          </p>
        </div>

        {/* What */}
        <div style={dropStyle(next())}>
          <SectionHeading accent={accent}>What it is</SectionHeading>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "clamp(16px, 4vw, 18px)",
              lineHeight: 1.55,
              color: FG_SOFT,
              margin: "0 0 56px",
              maxWidth: 660,
              whiteSpace: "pre-wrap",
            }}
          >
            {study.what}
          </p>
        </div>

        {/* Stack — only when we have one */}
        {study.stack && study.stack.length > 0 && (
          <div style={dropStyle(next())}>
            <SectionHeading accent={accent}>Stack</SectionHeading>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                margin: "0 0 56px",
                maxWidth: 660,
              }}
            >
              {study.stack.map((s) => (
                <span
                  key={s}
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 12,
                    letterSpacing: "0.04em",
                    color: FG,
                    padding: "5px 10px",
                    borderRadius: 3,
                    border: `1px solid color-mix(in srgb, ${FG} 22%, transparent)`,
                    background: `color-mix(in srgb, ${accent} 10%, transparent)`,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notables — only when we have them */}
        {study.notables && study.notables.length > 0 && (
          <div style={dropStyle(next())}>
            <SectionHeading accent={accent}>Worth pulling out</SectionHeading>
            <div
              style={{
                display: "grid",
                gap: 28,
                margin: "0 0 56px",
                maxWidth: 660,
              }}
            >
              {study.notables.map((n) => (
                <div key={n.heading}>
                  <h3
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: 15,
                      fontWeight: 600,
                      margin: "0 0 6px",
                      color: FG,
                    }}
                  >
                    {n.heading}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: 16,
                      lineHeight: 1.55,
                      color: FG_SOFT,
                      margin: 0,
                    }}
                  >
                    {n.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Links — only when we have them */}
        {study.links && study.links.length > 0 && (
          <div style={dropStyle(next())}>
            <SectionHeading accent={accent}>Links</SectionHeading>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 56px",
                display: "grid",
                gap: 10,
                maxWidth: 660,
              }}
            >
              {study.links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: accent,
                      textDecoration: "none",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: 16,
                      borderBottom: `1px solid ${accent}`,
                      paddingBottom: 2,
                    }}
                  >
                    {l.label}
                    {" ↗"}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer attribution */}
        <div style={dropStyle(next())}>
          <p
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: FG_DIM,
              lineHeight: 1.7,
              margin: "60px 0 0",
              borderTop: `1px solid color-mix(in srgb, ${FG} 14%, transparent)`,
              paddingTop: 28,
            }}
          >
            Chapter {project.name} {MID} {project.year}
          </p>
        </div>
      </article>
    </TransitionPageShell>
  );
}

function MetaLine({
  accent,
  chapter,
}: {
  accent: string;
  chapter: Project;
}) {
  return (
    <div
      style={{
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize: 11,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: FG_MUTE,
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
          background: accent,
          boxShadow: `0 0 0 3px color-mix(in srgb, ${accent} 26%, transparent)`,
        }}
      />
      <span>Case study</span>
      <span style={{ color: FG_DIM }}>{MID}</span>
      <span>{chapter.year}</span>
    </div>
  );
}

function SectionHeading({
  accent,
  children,
}: {
  accent: string;
  children: ReactNode;
}) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: accent,
        margin: "0 0 18px",
      }}
    >
      {children}
    </h2>
  );
}
