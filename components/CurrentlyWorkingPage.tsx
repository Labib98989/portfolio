"use client";

import type { ReactNode } from "react";
import {
  TransitionPageShell,
  useDropStyle,
} from "./TransitionPageShell";

// Page color register. FG is paper off-white on the Riso-Black canvas
// painted by TransitionShell. Accent is a calm warm coral picked to read
// as humane against the ink (not clinical blue).
const FG = "#efefec";
const FG_SOFT = "color-mix(in srgb, #efefec 78%, transparent)";
const FG_MUTE = "color-mix(in srgb, #efefec 52%, transparent)";
const FG_DIM = "color-mix(in srgb, #efefec 36%, transparent)";
const ACCENT = "#D9A89C";

const EM = "—";
const MID = "·";
const RARR = "→";
const RSQUO = "’";

export function CurrentlyWorkingPage() {
  const dropStyle = useDropStyle();

  return (
    <TransitionPageShell>
      <article
        style={{
          maxWidth: 760,
          margin: 0,
          padding: "140px 96px 120px",
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
              fontSize: 132,
              lineHeight: 0.92,
              letterSpacing: "-0.03em",
              margin: "18px 0 26px",
            }}
          >
            OmniCare
          </h1>
        </div>

        <div style={dropStyle(2)}>
          <p
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: 24,
              lineHeight: 1.35,
              color: FG_SOFT,
              margin: "0 0 80px",
              maxWidth: 620,
            }}
          >
            The companion that follows the patient, not the file.
          </p>
        </div>

        <div style={dropStyle(3)}>
          <Section
            heading="Problem"
            body="A DMCH OPD patient waits hours for a three-minute consult, then leaves with a handwritten prescription and no continuity to the next visit. Low literacy compounds it. The doctor flies blind into every chair."
          />
        </div>

        <div style={dropStyle(4)}>
          <Section
            heading="Approach"
            body={`A 3D-avatar-driven PWA that follows the patient across their full hospital journey. Veena (the avatar) runs a Bangla voice intake in the waiting room; by the time the patient is called in, the doctor opens a pre-built clinical summary. The handwritten Rx is photographed, parsed by a vision LLM, and validated against the BD drug formulary. The app becomes the patient${RSQUO}s post-visit companion ${EM} reminders, adherence, follow-up ${EM} and a persistent memory graph carries them into the next visit.`}
          />
        </div>

        <div style={dropStyle(5)}>
          <SectionHeading>Architecture sketch</SectionHeading>
          <BulletList>
            <Bullet>
              <Strong>11-agent MCP backend</Strong>
              {` ${EM} three inherited from the existing Veena pipeline (Router ${MID} Responder ${MID} Animator), eight new clinical agents (Intake ${MID} History ${MID} Clinical RAG ${MID} Rx Extraction ${MID} Validator ${MID} Summary ${MID} Reminder ${MID} Escalation).`}
            </Bullet>
            <Bullet>
              <Strong>Patient memory graph (the moat)</Strong>
              {` ${EM} per-patient nodes for Visits ${RARR} Symptoms ${RARR} Dx ${RARR} Rx ${RARR} Adherence ${RARR} Outcomes. Doctors query the timeline.`}
            </Bullet>
            <Bullet>
              <Strong>Hybrid inference</Strong>
              {` ${EM} Claude for clinical reasoning, Gemini for vision, Ollama (Llama 3.1 8B Q4) on a Jetson Orin Nano edge box for offline resilience and privacy. WAN cable comes out on stage; the app stays alive over LAN.`}
            </Bullet>
            <Bullet>
              <Strong>Multi-layer Rx capture</Strong>
              {` ${EM} vision LLM ${RARR} BD-formulary canonicalization ${RARR} dose-range validation ${RARR} confidence-routed doctor confirm. Six fallback layers down to pharmacist-at-dispense.`}
            </Bullet>
            <Bullet>
              <Strong>Real-world data, not static dumps</Strong>
              {` ${EM} Playwright on DGDA, Firecrawl on DGHS/WHO, BeautifulSoup on health news, pharmacy aggregator scrapes for inventory.`}
            </Bullet>
          </BulletList>
        </div>

        <div style={dropStyle(6)}>
          <SectionHeading>{`What${RSQUO}s next`}</SectionHeading>
          <BulletList>
            <Bullet>
              DMCH meeting to lock the demo department and clinical-protocol
              questions.
            </Bullet>
            <Bullet>
              {`Scraper POC against the DGDA drug list ${EM} de-risks the data layer earliest.`}
            </Bullet>
            <Bullet>
              {`Prescription pipeline POC (vision LLM ${RARR} BD formulary match) ${EM} the most technically risky single piece.`}
            </Bullet>
            <Bullet>Procure the Jetson Orin Nano for the pilot path.</Bullet>
            <Bullet>
              Veena specialization: Whisper STT, Piper TTS, MCP formalization
              across all eleven agents.
            </Bullet>
          </BulletList>
        </div>

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
            {`Built on top of an existing avatar shell our team had previously created (Veena ${EM} chapter 5). BuildFest contribution is the clinical multi-agent system, memory graph, prescription pipeline, doctor dashboard, edge inference layer, and Bangla localization.`}
          </p>
        </div>
      </article>
    </TransitionPageShell>
  );
}

// ----- module-level subcomponents (stable component identities) -----

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
      <span>Currently Working</span>
      <span style={{ color: FG_DIM }}>{MID}</span>
      <span>Architecture phase</span>
      <span style={{ color: FG_DIM }}>{MID}</span>
      <span>Demo 12 Jun 2026</span>
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
      <p
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: 18,
          lineHeight: 1.55,
          color: FG_SOFT,
          margin: 0,
          maxWidth: 660,
        }}
      >
        {body}
      </p>
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

function Strong({ children }: { children: ReactNode }) {
  return <strong style={{ color: FG, fontWeight: 500 }}>{children}</strong>;
}
