// Per-chapter case-study content. Five of the nine chapters have real
// repos with READMEs in docs/ (Dev Tooling, Blockchain Security, Frontend,
// Embodied AI, AI Systems / Legal Doc). The other four are placeholders
// with intentionally minimal copy — enough that the page doesn't feel
// broken, light enough that the missing real material is obvious.
//
// Keep this data-only. The CaseStudyPage component owns all rendering.

export type CaseStudy = {
  realName?: string; // The actual project's release name (vs. the chapter label).
  oneLiner: string; // Short bold framing that drops in under the title.
  what: string; // 1-2 paragraphs on what it is.
  stack?: string[]; // The actual tech (short tags).
  notables?: Array<{ heading: string; body: string }>; // Pull-out beats.
  links?: Array<{ label: string; href: string }>; // External anchors (repo, demo).
};

// Slug → content. Slugs match lib/projects.ts.
export const CASE_STUDIES: Record<string, CaseStudy> = {
  // ----- Chapters with real READMEs -----

  "dev-tooling": {
    realName: "Copypasta Hunter",
    oneLiner:
      "You wrote it. You own it. Prove it. — Hackathon entry that interrogates developers about their own diffs before letting them push.",
    what:
      "Copypasta Hunter intercepts git pushes and PR openings, forcing developers to prove they understand their own code changes before anything reaches the repository. A VS Code extension installs a pre-push hook that opens a 60-second AI-generated interrogation against the exact diff. A GitHub bot catches anyone who bypasses VS Code, dropping a magic-link comment on the PR that opens a standalone web quiz. Pass the quiz, status flips to green; fail, the PR stays blocked.",
    stack: [
      "FastAPI",
      "Google Gemini",
      "GitHub App (Probot)",
      "Next.js + Tailwind",
      "TypeScript VS Code extension",
    ],
    notables: [
      {
        heading: "Three components, one brain",
        body: "Brain (FastAPI on :8000) handles trust scoring, question generation, and answer grading. Bot (Probot on :3000) is the GitHub backstop. Web (Next.js on :3001) hosts the standalone interrogation room when VS Code is bypassed.",
      },
      {
        heading: "Trust scoring tames the friction",
        body: "Developers who consistently pass get quizzed less often. The interrogation isn't a tax — it's calibrated to the developer's track record.",
      },
    ],
    links: [
      {
        label: "GitHub — SynovianForge/Hackathon",
        href: "https://github.com/SynovianForge/Hackathon",
      },
    ],
  },

  "blockchain-security": {
    realName: "Scammer Trapper 9000",
    oneLiner:
      "A token risk radar for Ethereum and BSC — inspects ERC-20/BEP-20 contracts and scores rug-pull likelihood 0–100.",
    what:
      "Full-stack on-chain analysis tool: live data from Ethereum and BSC nodes, weighted heuristic scoring, responsive frontend. Designed for users to paste a token contract and immediately see whether the deployer pattern, liquidity profile, ownership state, and code surface match historical honeypots.",
    stack: [
      "Python + FastAPI",
      "Web3.py",
      "Etherscan + BscScan APIs",
      "Vanilla JS / HTML",
    ],
    notables: [
      {
        heading: "Weighted risk vectors",
        body: "Suspicious functions (+30) · ownership not renounced (+25) · ABI not verified (+20) · low liquidity (+20) · mint function present (+15). Tiers: 0–24 low, 25–59 medium, 60–100 high.",
      },
      {
        heading: "Honeypot probing as opt-in",
        body: "Simulated buy/sell transactions check for trapped contracts. Opt-in because they cost gas — the heuristic layer covers most cases without it.",
      },
    ],
    links: [
      {
        label: "Live demo — scammer-trapper-9000.onrender.com",
        href: "https://scammer-trapper-9000.onrender.com/",
      },
    ],
  },

  frontend: {
    realName: "Treasure Hunt — DU CSE",
    oneLiner:
      "Companion app for the University of Dhaka CSE Treasure Hunt event — landing page plus a fully-wired team dashboard with timer, clue, score, and leaderboard.",
    what:
      "Mobile-first single-page app: roll-number lookup, live countdown timer, clue card, score tiles, status state machine (Active Hunt / Mini-game / Arrived), bottom-sheet leaderboard, and fullscreen overlays for celebration (confetti) and expiry. The frontend is fully mocked and ready — a single API contract (`GET /api/roll/:roll`) is all the backend needs to deliver.",
    stack: [
      "Vite 6",
      "React 19",
      "TypeScript",
      "Tailwind v4",
      "Motion (Framer)",
      "canvas-confetti",
    ],
    notables: [
      {
        heading: "Two themes ship together",
        body: "Light mode: Duolingo-inspired soft paper, Nunito, big green CTAs. Dark mode: deep neon, drifting violet/magenta/cyan orbs, 3D rotating compass behind the hero. Toggle persists to localStorage; first visit respects OS preference.",
      },
      {
        heading: "One endpoint, the UI diffs the rest",
        body: "Backend pushes the full DashboardData shape. Frontend handles timer math (250ms tick), color thresholds (green > 10min, orange ≤ 10, red pulse ≤ 5, red overtime with − prefix), and status transitions automatically.",
      },
    ],
    links: [
      {
        label: "GitHub — RF-Fahad-Islam/Treasure-Hunt",
        href: "https://github.com/RF-Fahad-Islam/Treasure-Hunt",
      },
    ],
  },

  "embodied-ai": {
    realName: "Veena",
    oneLiner:
      "A real-time interactive 3D avatar you talk to in the browser — Unity WebGL render, Gemini brain, procedural lip sync.",
    what:
      "Veena listens to your voice, processes intent with Gemini 2.5 Flash, and responds with synchronized lip-sync and procedural animations. Modular by design: separate Speech, TTS, and API modules; a Router agent classifies intent and sentiment; a Responder generates context-aware replies; an Animator maps reasoning output to avatar emotion and animation triggers. The character is the same one OmniCare now extends into its 11-agent clinical pipeline.",
    stack: [
      "Unity 2022 (WebGL build)",
      "Vanilla JavaScript (ES6 modules)",
      "Python FastAPI",
      "Google Gemini 2.5 Flash",
      "Web Speech API (STT + TTS)",
    ],
    notables: [
      {
        heading: "Procedural lip sync",
        body: "Mouth movement synchronizes to audio volume rather than phoneme analysis — cheap, low-latency, and good enough for conversational presence.",
      },
      {
        heading: "Smart animation routing",
        body: "Gemini's response carries an emotion tag (Happy, Wave, Thinking). The Animator agent maps it to the right Unity animation trigger so the avatar reacts in character.",
      },
    ],
  },

  "ai-systems": {
    realName: "Legal Document AI Workflow",
    oneLiner:
      "Two days. Solo hackathon. A legal-doc RAG that A/B-measures its own rules and retires the ones that don't help.",
    what:
      "Ingests messy legal documents, extracts structured data with a three-tier vision cascade (Gemini Vision → preprocessed retry → PaddleOCR + text-only Gemini), retrieves grounded evidence via ChromaDB embeddings, and generates drafts with mandatory inline `[chunk_id]` citations. The learning loop is the real subject: operator edits become candidate patterns, candidates cluster into rules, rules are A/B-evaluated for grounded-support delta, and rules whose rolling delta is ≤ 0 self-retire to a separate file.",
    stack: [
      "Python 3.10+",
      "Google Gemini 2.5 / 3 Flash",
      "ChromaDB + Gemini embeddings",
      "PaddleOCR (Tier C fallback)",
      "Pydantic",
    ],
    notables: [
      {
        heading: "Persistence with audit",
        body: "Every edit, every candidate, every A/B run is written to JSONL — reviewable, replayable, greppable. The improvement loop is built as something you can argue with, not a black box.",
      },
      {
        heading: "Causal measurement, not just versioning",
        body: "The brief warned against side-by-side version diffs. Each promoted rule is run with and held out; the judge scores both drafts; the delta is logged per rule. That's the rubric-required 'future drafts improve meaningfully' evidence.",
      },
      {
        heading: "Three failure surfaces stacked",
        body: "Tier A (Gemini Vision self-rates confidence) → Tier B (PIL autocontrast + median filter, retry) → Tier C (PaddleOCR's CNN/transformer + text-only Gemini). If all three fail, the drafter refuses to fabricate.",
      },
    ],
  },

  // ----- Chapters without committed READMEs (intentional minimal stubs) -----

  "cost-engineering": {
    oneLiner:
      "A Discord bot that delivers daily class routines to ~2.5k Dhaka University students at $0/month. The $0 line is the project.",
    what:
      "Class reps register on a dashboard, paste in their section's routine, pick a daily-alert time, and point it at a Discord channel. Every day at that time the bot posts the routine; quick-action buttons cover the recurring exceptions — class cancelled, class rescheduled — without anyone editing the underlying schedule. Auth is one-account-one-routine via Supabase. The whole stack runs on Oracle Cloud's Always Free tier, which is how the cost line stays at zero even as ~50 classes and ~2.5k students sit on top of it.\n\nIt started as a fix for one annoyance: my class rep retyping the day's schedule into a group thread every morning. The first version replaced that for my section; the second version replaced it for the department. The bar was non-technical operators — CRs in any subject, no engineering background — setting it up and running it without help. Tested with real CRs; it cleared the bar.",
    stack: [
      "Discord bot",
      "Supabase (auth + Postgres)",
      "Oracle Cloud Always Free (compute)",
      "Dashboard frontend",
    ],
    notables: [
      {
        heading: "Free tier as a hard design constraint",
        body: "Oracle Cloud's Always Free covers compute and egress at this scale. The bot stays inside that envelope deliberately — no paid services, no premium APIs, no surprise charges. The cost story isn't a marketing line; it's a constraint that shaped every component choice.",
      },
      {
        heading: "Ownership model: one routine per account",
        body: "Class reps own the routine; everyone else consumes it. Auth via Supabase keeps that boundary clean, so there's no edit-war state to resolve. Quick-action buttons let a CR override a single day (cancellation, reschedule) without disturbing the canonical schedule.",
      },
      {
        heading: "Real users, no charge",
        body: "Currently running for ~50 classes across Dhaka University — roughly 2.5k students depend on it daily. Not monetised, and the architecture means there's nothing to monetise: hosting is free, support burden is near-zero, the CRs run it themselves.",
      },
    ],
  },

  "assistive-tech": {
    oneLiner:
      "A mobile app I built for myself. I have mild face blindness; this gives me back the names.",
    what:
      "Each person gets a profile — name, context, anything I need to remember next time. Manual entry works, but the interesting paths are the automatic ones. Take a selfie inside the app and the face is auto-cropped onto the profile. While a conversation is happening, the phone transcribes audio in the background and edits the profile in place — still experimental, the noisy-room failure mode is real.\n\nRecall has to be instant or it's useless. The app rides on top of everything else as a floating bubble in the Messenger-chat-heads style: tap the bubble, get a screen overlay with the right person's info without leaving whatever app I was in. The product target is the social moment — introductions, professional meetings, the five-second handshake where forgetting a name actually costs. Casual settings I'm fine in. Formal ones are what this is for.",
    stack: [
      "Android",
      "On-device face detection",
      "Background audio transcription",
      "System overlay (chat-head pattern)",
    ],
    notables: [
      {
        heading: "Built for one user, on purpose",
        body: "The product is me. Face blindness is mild — I get by in casual settings, fail in formal ones. The app is calibrated for the cases that hurt: introductions, meetings, professional handshakes. That tight scope is why the feature set stays opinionated instead of sprawling.",
      },
      {
        heading: "Two automation paths, different maturity",
        body: "Selfie cropping is the boring win — it works, it removes a tap, ship it. Live audio profile-update is the experimental one: when it works, the profile gains context I would have lost; when it misfires, it adds junk. The gate between transcription and profile-write is what I'm still tuning.",
      },
      {
        heading: "Doubles as a demo",
        body: "Showing someone the app — and then immediately using it on them — is the most efficient pitch I have. The product is the demo; the demo is the product. That's been useful socially and as an excuse to learn mobile dev end-to-end.",
      },
    ],
  },

  "game-engineering": {
    oneLiner:
      "University assignment: build a game without an engine. The interesting part is that classmates kept playing it after the grade was in.",
    what:
      "Coursework brief was simple — no engine, write the game loop yourself, render the frames yourself, handle input yourself. I did. What I didn't expect: the finished thing was actually fun, and a chunk of my class kept playing it long past the deadline. That's the only metric that matters for a game.\n\nWriting one from scratch teaches you everything an engine hides — frame pacing, input buffering, collision shapes, why drawing things in the right order is half the work. None of it was novel. All of it was the assignment. The discipline of doing it without the engine's safety net is what made the result feel like mine.",
    stack: [
      "C++",
      "SDL2",
      "raylib",
      "Hand-rolled game loop",
    ],
    notables: [
      {
        heading: "The grade wasn't the signal",
        body: "Plenty of student projects compile, run, get a passing mark, and never get touched again. This one had classmates picking it up between lectures. That's the bit I think about now when designing anything — the work outlives the deliverable only when it's fun on its own terms.",
      },
      {
        heading: "No engine, no shortcuts",
        body: "Every system — render, input, audio, collision — was something I had to build, debug, and tune myself. Engines hide the cost of those decisions; this surfaces them. The chapter sits in the 'craft' arc of the wheel because that's exactly what writing without an engine teaches.",
      },
    ],
  },

  "embedded-audio": {
    oneLiner:
      "A standalone groovebox built from a $10 membrane keyboard, a salvaged boombox audio stage, and a Raspberry Pi. It made actual songs. Then it broke.",
    what:
      "The bring-up was the wrong way around — hardware first, software grew to fit. Cheap membrane keyboard, audio parts scavenged from a dead boombox, a Pi I had lying around. Piano was the original goal. Once that worked, guitar / bass / drums voicings were a copy-and-detune away. Then loops turned single notes into beats; beat manipulation turned beats into arrangements; sound shaping turned arrangements into actual songs. I went from 'this plays middle C' to 'this writes a song end-to-end' over a few weekends.\n\nThe Pi's RAM ceiling was the silent design partner. Every new instrument and every new effect cost a fixed slice of headroom, so the feature list was always negotiating with the hardware. It worked long enough to surprise me — and then, in keeping with everything built from scavenged parts, it broke.",
    stack: [
      "Raspberry Pi",
      "Salvaged analog audio path",
      "Membrane-keyboard matrix",
      "Real-time audio synthesis",
    ],
    notables: [
      {
        heading: "Hardware-first feature pipeline",
        body: "Each new instrument started as a 'can the Pi keep up' question and ended as a sound-design one. The RAM ceiling and the audio buffer were the real constraints; the synth voice was easy by comparison.",
      },
      {
        heading: "Loops were the unlock",
        body: "Once loops were recordable and editable in place, the device crossed from 'piano' into instrument-of-instruments territory — one performer can stack a full arrangement on it. That's where it stopped being a class project and started being a thing I'd actually use.",
      },
      {
        heading: "Then it broke",
        body: "Membrane keyboards aren't built for what I was doing to them, and the salvaged audio stage was always running on borrowed time. The chapter ends honestly: the rig is dead, the songs it made are not.",
      },
    ],
  },
};
