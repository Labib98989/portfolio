"use client";

import type { ReactNode } from "react";
import {
  TransitionPageShell,
  useDropStyle,
} from "./TransitionPageShell";

// Same color register as CurrentlyWorkingPage — paper off-white on the
// Riso-Black canvas. About uses a slightly cooler accent than OmniCare's
// coral to differentiate the surface without breaking the riso palette.
const FG = "#efefec";
const FG_SOFT = "color-mix(in srgb, #efefec 78%, transparent)";
const FG_MUTE = "color-mix(in srgb, #efefec 52%, transparent)";
const FG_DIM = "color-mix(in srgb, #efefec 36%, transparent)";
const ACCENT = "#8FB3C0"; // soft Riso teal

const RSQUO = "’";

// Scaffold sourced from docs/portfolio-plan/about.md.
export function AboutPage() {
  const dropStyle = useDropStyle();

  return (
    <TransitionPageShell>
      <article
        style={{
          maxWidth: 760,
          margin: 0,
          padding: "120px clamp(20px, 5vw, 96px) 100px",
        }}
      >
        <div style={dropStyle(0)}>
          <MetaLine />
        </div>

        <div style={dropStyle(1)}>
          <h1
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontWeight: 300,
              fontSize: "clamp(56px, 14vw, 132px)",
              lineHeight: 0.92,
              letterSpacing: "-0.03em",
              margin: "18px 0 26px",
            }}
          >
            Labib Karim
          </h1>
        </div>

        <div style={dropStyle(2)}>
          <p
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "clamp(18px, 5vw, 24px)",
              lineHeight: 1.35,
              color: FG_SOFT,
              margin: "0 0 80px",
              maxWidth: 620,
            }}
          >
            Currently obsessed with applied AI. Also writes game engines,
            breaks sandboxes, and squeezes 10k users out of free tiers.
          </p>
        </div>

        {/* Bio */}
        <div style={dropStyle(3)}>
          <Section
            heading="Who"
            body={
              <>
                <p style={{ margin: "0 0 18px" }}>
                  CSE undergrad at the University of Dhaka. Started coding
                  in 2025. Everything in the wheel is from the two years
                  since.
                </p>
                <p style={{ margin: "0 0 18px" }}>
                  There was no roadmap. I looked at the standard path —
                  the tutorials, the bootcamps, the “build a todo app
                  first” — and walked the other way. I built whatever was
                  in front of me. Sometimes it was need: my class rep
                  retyping the routine into a group chat every morning,
                  my own face blindness, a legal-doc workload that kept
                  eating weekends. Sometimes it was curiosity: Android
                  Studio looked cool enough that a month disappeared into
                  the face-blindness app. The crypto rug-pull radar was
                  my first SaaS — RIP — but the radar still works.
                </p>
                <p style={{ margin: 0 }}>
                  Looking back at the spread, the thing I noticed is that
                  not a single domain stopped me. Crypto, mobile, embedded
                  audio, a game without an engine, RAG, security — none of
                  them held. So I don{RSQUO}t think anything will. If
                  you{RSQUO}re non-technical and can describe the product
                  — e-commerce platform, HFT bot, anything in between —
                  you only need to call one person.
                </p>
              </>
            }
          />
        </div>

        {/* Security / hobby framing — from about.md */}
        <div style={dropStyle(4)}>
          <Section
            heading="Off-stage"
            body={
              <>
                Spends weekends breaking sandbox isolation for fun
                {" — VirtualBox would prefer I find a different hobby."}
              </>
            }
          />
        </div>

        {/* CTF placements */}
        <div style={dropStyle(5)}>
          <SectionHeading>Captures</SectionHeading>
          <BulletList>
            <Bullet>
              NSU Robofest CTF — 4th place, team leader — 2026
            </Bullet>
          </BulletList>
        </div>

        {/* Contact */}
        <div style={dropStyle(6)}>
          <SectionHeading>Reach</SectionHeading>
          <BulletList>
            <Bullet>
              Email —{" "}
              <ReachLink href="mailto:labibkarim3@gmail.com">
                labibkarim3@gmail.com
              </ReachLink>
            </Bullet>
            <Bullet>
              GitHub —{" "}
              <ReachLink href="https://github.com/Labib98989">
                github.com/Labib98989
              </ReachLink>
            </Bullet>
          </BulletList>
        </div>

        {/* Footer — what NOT to surface, drawn from about.md's discipline rule */}
        <div style={dropStyle(7)}>
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
            No specific vulnerabilities. No bug-bounty attribution. No claims
            that map back to identifiable targets. The CTF wins and the
            sandbox-breaking line are the most we put on stage. The rest
            stays off-stage by design.
          </p>
        </div>
      </article>
    </TransitionPageShell>
  );
}

// ----- module-level subcomponents -----

function MetaLine() {
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
          background: ACCENT,
          boxShadow: `0 0 0 3px color-mix(in srgb, ${ACCENT} 26%, transparent)`,
        }}
      />
      <span>About</span>
      <span style={{ color: FG_DIM }}>·</span>
      <span>{`The person behind the work`}</span>
    </div>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: ACCENT,
        margin: "0 0 18px",
      }}
    >
      {children}
    </h2>
  );
}

function Section({
  heading,
  body,
}: {
  heading: string;
  body: ReactNode;
}) {
  return (
    <div style={{ marginBottom: 56 }}>
      <SectionHeading>{heading}</SectionHeading>
      <div
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "clamp(16px, 4vw, 18px)",
          lineHeight: 1.55,
          color: FG_SOFT,
          margin: 0,
          maxWidth: 660,
        }}
      >
        {body}
      </div>
    </div>
  );
}

function BulletList({ children }: { children: ReactNode }) {
  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: "0 0 56px",
        display: "grid",
        gap: 18,
        maxWidth: 660,
      }}
    >
      {children}
    </ul>
  );
}

function Bullet({ children }: { children: ReactNode }) {
  return (
    <li
      style={{
        fontFamily: "var(--font-inter), sans-serif",
        fontSize: 16,
        lineHeight: 1.55,
        color: FG_SOFT,
        paddingLeft: 22,
        position: "relative",
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: "0.5em",
          width: 8,
          height: 1,
          background: ACCENT,
        }}
      />
      {children}
    </li>
  );
}

function ReachLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      style={{
        color: ACCENT,
        textDecoration: "none",
        borderBottom: `1px solid color-mix(in srgb, ${ACCENT} 50%, transparent)`,
        paddingBottom: 1,
      }}
    >
      {children}
    </a>
  );
}

