# Open Questions

Things to decide before content can be finalized. Grouped by what they block.

## Content (blocks chapter writing)
- **Real project names** — most are TBD. Only the groovebox has a draft name
  ("Membrane Groovebox / Keybox").
- **Event app (#3)** — kept as a placeholder slot for now. Future swap-out
  when a stronger candidate exists; one parked option (replacing it with the
  portfolio itself) is documented in `projects.md`.
- **Real one-liners** — we have *directions* per project, not final lines.
- **Real tagline** — the site currently rotates placeholder strings ("Tagline
  04/10 — wherever, whenever"). Need one real considered line.
- **The user's actual name** — header placeholder is "Your Name"; wordmark
  letter in the dial center is "Y".

## Design (blocks chapter visuals)
- ~~**Per-chapter background treatments**~~ — **Resolved.** Locked in
  `theme-system.md`: per-chapter theme bundle of `{ bgPrimary, bgSecondary,
  accent, shadow, glyph }`, riso aesthetic, paper-stock bgs harmonized with
  authentic riso ink accents. Yellow "Y" in dial center is being replaced
  with per-chapter glyphs.
- **Order of the 9 chapters in the wheel** — chronological? By domain spread?
  Hook chapters first? Currently ordered by year in `lib/projects.ts`.
- **Case study page format** — long-scroll page? Modal? Scroll-driven? Image
  gallery? Different per chapter? The CTA goes nowhere yet.
- **CTA copy** — current placeholder is "Open case study" on every chapter.
  Confirmed it should adapt for at least the Frontend chapter ("Read the build
  notes" / "See how this site works"). Open whether the *other* eight should
  also get per-chapter copy or share a default.
- **HealthTech (#9) "In Design" badge** — visual treatment for the unbuilt
  state. Different from a year stamp. Needs to be legible from outside the
  chapter so visitors don't click in expecting a finished product.
- **Glyph asset production** — 9 SVGs to be designed per `theme-system.md`.
  Two flagged uncertainty points: #1 em-dash legibility (does the visitor
  recognize the em-dash as the AI tell?) and #6 face-with-marker execution
  (sensitive vs reductive lives in the drawing).
- **Exact `bgSecondary` hex per chapter** — rule is defined (primary shifted
  ~15% toward accent at lower luminance); exact values pending prototype.

## Structure (blocks routing)
- **About surface** — separate route or modal? The header link exists; the
  destination doesn't.
- **Case study route shape** — `/work/[slug]`? Single page that swaps content?
  Modal overlay? Affects how chapters cross-link.

## Risk-management (blocks shipping with confidence)
- **Depth of case studies.** The breadth thesis depends on every chapter
  actually having real engineering meat behind it. Need to be honest with
  myself, per chapter, about whether the case study can deliver.
- **HealthTech and event app specifically** — both are weakness vectors.
  HealthTech is unbuilt (rescued by architecture writeup); event app is thin
  (rescued, for now, by keeping visual treatment quiet and waiting to swap it
  out). If either becomes too visible, the breadth thesis takes damage.
