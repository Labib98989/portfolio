// Working titles pending real branding. The `name` field currently holds the
// headline domain label; real project names will replace these as each chapter
// gets specced out. See docs/portfolio-plan/projects.md for full context per
// chapter (one-liner direction, visual direction, case-study meat) and
// docs/portfolio-plan/theme-system.md for the cross-cutting riso theme spec.
//
// Order is intentional — the wheel doesn't loop, so chapter order is a story.
// Arc: hook (1-2) → range (3-6) → craft (7-8) → ambition (9).
// Slot 4 is a known-thin placeholder; slot 9 is in design.

// System constants — see docs/portfolio-plan/theme-system.md.
// Shadow ink is system-fixed (Riso Black, slightly warm). FG flips between
// dark (Riso Black) on light bgs and light (paper-off-white) on dark bgs.
const RISO_BLACK = "#22201d";
const FG_LIGHT = "#efefec";
const FG_DARK = RISO_BLACK;

export type Theme = {
  // Two-stop gradient bg. Hover-zone direction is set on the stage via
  // --bg-x in Home.tsx. bgSecondary = bgPrimary shifted ~15% toward accent
  // hue at slightly lower luminance (paper-stock with an accent breath).
  bgPrimary: string;
  bgSecondary: string;
  // Chapter accent — drives --accent. Used by the dial active indicator,
  // CTA underline, tagline dot, hero meta, focus border, and the glyph's
  // accent ink (riso-stylised per chapter).
  accent: string;
  // System-constant shadow ink — the riso "underprint" that the accent
  // prints offset over. Same value across all chapters by design.
  shadow: string;
  // Foreground text. Riso Black on light bgs, paper-off-white on dark bgs.
  // Subtone variants (--fg-soft / --fg-mute / --fg-dim / --line) derive
  // from this via color-mix in globals.css.
  fg: string;
  // Per-chapter glyph metadata. The actual glyph art lives in
  // `lib/glyphParts.tsx` keyed by chapter index — this object exists for
  // documentation (`subject`) and for the rare case where a chapter wants
  // ink colors distinct from its UI `accent`/`shadow`.
  glyph: {
    subject: string;
    inkAccent: string;
    inkShadow: string;
  };
};

export type Project = {
  slug: string;
  name: string;
  // Optional abbreviated form used where the full name doesn't fit (e.g.,
  // SnapDots column). Falls back to `name` when omitted.
  shortName?: string;
  blurb: string;
  year: string;
  // Per-chapter theme. Drives CSS variables on the stage; transitions are
  // handled by @property registration in globals.css.
  theme: Theme;
  // Optional per-chapter CTA copy. Falls back to "Open case study" when
  // omitted. Tuned per chapter so the hero pull feels native to the work.
  cta?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "dev-tooling",
    name: "Dev Tooling",
    blurb:
      "VS Code extension and GitHub bot that catches blind copy-paste from AI.",
    year: "2025",
    cta: "See how it catches you",
    theme: {
      bgPrimary: "#F4EAC2",
      bgSecondary: "#F6DA6E",
      accent: "#FFD200",
      shadow: RISO_BLACK,
      fg: FG_DARK,
      glyph: {
        subject: "Em-dash with text-line fragments above and below",
        inkAccent: "#FFD200",
        inkShadow: RISO_BLACK,
      },
    },
  },
  {
    slug: "blockchain-security",
    name: "Blockchain Security",
    shortName: "Crypto Sec",
    blurb:
      "Forensic tool that flags rug-pull patterns in crypto tokens before they cost you.",
    year: "2024",
    cta: "Open the radar",
    theme: {
      bgPrimary: "#15203F",
      bgSecondary: "#5C1E37",
      accent: "#FF3B33",
      shadow: RISO_BLACK,
      fg: FG_LIGHT,
      glyph: {
        subject: "Broken chain link (two links, one snapping)",
        inkAccent: "#FF3B33",
        inkShadow: RISO_BLACK,
      },
    },
  },
  {
    slug: "cost-engineering",
    name: "Cost Engineering",
    blurb:
      "A Discord bot that scales to 10k users at $0 a month. The framing is the project.",
    year: "2024",
    cta: "Read the cost math",
    theme: {
      bgPrimary: "#DED0A0",
      bgSecondary: "#A9C77F",
      accent: "#2BA15E",
      shadow: RISO_BLACK,
      fg: FG_DARK,
      glyph: {
        subject: "Zero-dollar postmark / stamp",
        inkAccent: "#2BA15E",
        inkShadow: RISO_BLACK,
      },
    },
  },
  {
    slug: "frontend",
    name: "Frontend",
    blurb:
      "A companion web app for an event, built in a day. Device-ID auth to skip the login hassle.",
    year: "2023",
    cta: "Open the dashboard",
    theme: {
      bgPrimary: "#E2EAF3",
      bgSecondary: "#A6D0F4",
      accent: "#2F97F0",
      shadow: RISO_BLACK,
      fg: FG_DARK,
      glyph: {
        subject: "Event wristband with tear-strip",
        inkAccent: "#2F97F0",
        inkShadow: RISO_BLACK,
      },
    },
  },
  {
    slug: "embodied-ai",
    name: "Embodied AI",
    blurb:
      "A 3D avatar interface for AI chatbots. The face, not just the text box.",
    year: "2023",
    cta: "Meet Veena",
    theme: {
      bgPrimary: "#3A1856",
      bgSecondary: "#71176A",
      accent: "#FF36AE",
      shadow: RISO_BLACK,
      fg: FG_LIGHT,
      glyph: {
        subject: "Speech bubble containing an eye",
        inkAccent: "#FF36AE",
        inkShadow: RISO_BLACK,
      },
    },
  },
  {
    slug: "assistive-tech",
    name: "Assistive Tech",
    blurb:
      "Mobile app that helps people with face blindness recognise the people they care about.",
    year: "2022",
    cta: "Read the case",
    theme: {
      bgPrimary: "#9CD0BE",
      bgSecondary: "#EAC188",
      accent: "#FF9B41",
      shadow: RISO_BLACK,
      fg: FG_DARK,
      glyph: {
        subject: "Featureless face with one distinctive marker",
        inkAccent: "#FF9B41",
        inkShadow: RISO_BLACK,
      },
    },
  },
  {
    slug: "game-engineering",
    name: "Game Engineering",
    blurb:
      "A rhythm fighting game written from scratch in SDL2 and raylib. No engine.",
    year: "2022",
    cta: "Step into the loop",
    theme: {
      bgPrimary: "#1B1A29",
      bgSecondary: "#561F30",
      accent: "#F23B52",
      shadow: RISO_BLACK,
      fg: FG_LIGHT,
      glyph: {
        subject: "Hit-spark / impact burst",
        inkAccent: "#F23B52",
        inkShadow: RISO_BLACK,
      },
    },
  },
  {
    slug: "embedded-audio",
    name: "Embedded Audio",
    blurb:
      "A standalone groovebox built from a $10 keyboard and a Raspberry Pi. The RAM ceiling is real.",
    year: "2021",
    cta: "See the rig",
    theme: {
      bgPrimary: "#EADFBA",
      bgSecondary: "#EDC65F",
      accent: "#F0A718",
      shadow: RISO_BLACK,
      fg: FG_DARK,
      glyph: {
        subject: "Single membrane key with waveform emanating",
        inkAccent: "#F0A718",
        inkShadow: RISO_BLACK,
      },
    },
  },
  {
    slug: "ai-systems",
    name: "AI Systems",
    blurb:
      "Two days. Solo hackathon. A legal-doc RAG that A/B-measures its own rules and retires the ones that don't help.",
    year: "2026",
    cta: "Read the architecture",
    theme: {
      bgPrimary: "#DBE5F4",
      bgSecondary: "#A6BFF0",
      accent: "#2E59DE",
      shadow: RISO_BLACK,
      fg: FG_DARK,
      glyph: {
        subject: "Document with bracketed citation marks and a small feedback loop arrow",
        inkAccent: "#2E59DE",
        inkShadow: RISO_BLACK,
      },
    },
  },
];

// Taglines — one per shipped year, rotates randomly on mount. Each leads
// with the year and lands on a single chapter from that year so the line
// reads as a postcard from the work, not a slogan. See about.md for the
// AI-obsession-with-breadth direction.
export const TAGLINES = [
  "2026 — A legal-doc RAG that retires its own rules when they stop helping.",
  "2025 — A VS Code extension that quizzes you about your own diff before you push.",
  "2024 — A rug-pull radar scoring ERC-20 contracts 0–100.",
  "2023 — A 3D avatar you can talk to in the browser.",
  "2021 — A standalone groovebox built from a $10 keyboard and a Raspberry Pi.",
];
