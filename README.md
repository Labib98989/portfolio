# Labib Karim — Portfolio

A risograph-styled showcase of selected works — applied AI, security, hardware, and the systems-level engineering behind them.

**Two hand-built experiences, one visual language:**

- **Desktop** — a radial dial you spin through nine chapters. Hovering morphs the hero, scrolling rotates the wheel, clicking zooms it into focus. Every chapter re-tints the entire stage.
- **Mobile** — a swipe-driven card deck that feels like a native app. Swipe up/down through chapters, right into a case study, left to reveal the dial. No scrollbars anywhere — it's all gesture.

No UI kit. No animation library. The dial, the morphing glyphs, the route transitions, and the mobile gesture engine are all written from scratch.

---

## Stack

| | |
|---|---|
| **Framework** | Next.js 16 — App Router, Turbopack |
| **UI** | React 19.2 + the React Compiler |
| **Language** | TypeScript (strict) |
| **Styling** | Plain CSS + inline styles, animated via registered CSS `@property` custom properties |
| **Type** | Fraunces · Inter · JetBrains Mono · Caveat |
| **Images** | `sharp` (build-time optimization) |
| **Runtime deps** | `next`, `react`, `react-dom` — and nothing else |

Zero runtime dependencies beyond the framework. Every interaction is hand-rolled to keep the bundle honest and the motion exactly the way it should feel.

## The design system

Everything sits on a **risograph** metaphor — two-ink prints with a fixed, slightly warm "Riso Black" shadow that each accent ink prints offset over. Each of the nine chapters owns a palette (background, accent, and a foreground that flips dark/light to stay legible) and a hand-drawn glyph that morphs into the next as you travel the wheel. Theme values are registered as `@property` CSS variables, so a chapter change animates every color at once instead of snapping.

## Highlights

- **Hand-rolled radial dial** — nine notches across a 270° arc, scroll-to-rotate with elastic end-bounce, click-to-focus, no wrap-around (chapter order is a story).
- **Morphing glyphs** — per-chapter SVG marks that tween part-by-part from one shape to the next on navigation.
- **Mobile swipe deck** — pointer-driven, velocity-aware, axis-locked paging with rubber-band ends, a tappable chapter dial, deep-linkable cards (shallow `#hash`), and an iOS-style swipe-back on detail pages. Built without a gesture library.
- **Choreographed route transitions** — a two-phase ink-canvas wipe that masks each navigation, with the destination's text staggering in behind it.
- **Portrait lock** — a CSS landscape guard, since the web can't truly lock device orientation.

## Structure

```
app/                        routes: home · /about · /currently-working · /projects/[slug] · /glyphs
components/
  Home, RadialDial, HeroChapter, MorphingGlyph, Backgrounds   <- desktop dial experience
  MobileApp, MobilePoster, MobileDial                         <- mobile swipe deck
  TransitionShell, TransitionPageShell                        <- route-change choreography
  RotateNotice                                                <- landscape guard
lib/
  projects.ts        chapter data + per-chapter riso themes
  motion.ts          dial geometry + timing constants
  glyphParts.tsx     the glyph artwork
  caseStudies.ts     case-study copy
  useSwipeDeck.ts    hand-rolled mobile gesture engine
  mobileDeck.ts      mobile deck model
```

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
```

## Status

The machine is done — desktop and mobile are both complete and verified on-device. Case-study copy for a few chapters is still being written.

---

Designed and built by hand by **Labib Karim**.
