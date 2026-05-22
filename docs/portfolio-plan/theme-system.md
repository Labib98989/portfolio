# Theme System

Cross-cutting visual spec — applies to all 9 chapters. Sits underneath
`projects.md` (which covers *what* each chapter is); this doc covers *how
every chapter renders*.

## The theme bundle

Each chapter ships:

```
{ bgPrimary, bgSecondary, accent, shadow, glyph, frame }
```

- **5 of these are chapter-set** (vary per chapter): `bgPrimary`,
  `bgSecondary`, `accent`, `glyph subject`, `glyph asset`.
- **1 is system-constant**: `shadow` ink.
- **The frame** is system-constant — same rigid skeleton for every glyph.

Family resemblance lives in the frame and the shadow ink. Chapter identity
lives in `bgPrimary` + `accent` + `glyph`.

## Reference: Robin Noguier

The reference site (robin-noguier.com) was used to ground the direction.
Captured from a live browse — six projects sampled.

Key takeaways:

- **Palette range is genuinely wide.** Slate, white, magenta, cobalt,
  petrol green, white-again. No tonal rule.
- **Family resemblance is in the *frame*, not the *medium*.** Hero art is
  photo, illustration, 3D, painterly — completely different media. What
  unifies them: tilt, soft shadow, soft rectangle crop, adjacent-project
  peek-in at corners, consistent chrome (wordmark TL, About TR, CTA BL).
- **Type stays constant; color does the work.** Same serif display face
  across all projects, same body sans, same CTA — only *color* of the
  type changes.

Implication for us: lock the **frame**, let chapter content vary within it.

## The frame (rigid — same for all 9 glyphs)

1. **Format.** SVG for shapes, one shared raster grain texture overlayed
   via `mask-image` / `feImage`. Rejected: pure raster (9× weight, no
   scale), pure SVG turbulence (digital, not printed).
2. **Ink count.** Exactly 2 per glyph. One alone reads as flat; three
   starts looking like full-color print. Two is the riso sweet spot.
3. **Registration offset.** **2px down, 2px right, always.** Shadow ink
   prints first; accent ink prints offset. Consistent direction means the
   whole site reads as printed by the same machine on the same day. No
   randomization.
4. **Grain.** One shared tileable texture (~512×512), multiplied over both
   ink layers at fixed opacity. Same density everywhere. **Biggest
   family-resemblance lever** — everything else can drift, the grain
   cannot.
5. **Halftone.** Only used for tonal fills, never solid color. Mid-tone =
   screened version of the accent ink (e.g., 50% dot pattern of Sunflower
   = lighter tint). No third ink.
6. **Containment.** No frame, no border. Glyph sits free inside the dial
   center, breathing into negative space. Dial's center circle is enough
   containment.
7. **Size.** Glyph occupies ~60% of the dial center diameter. Current
   Fraunces "Y" is type-sized; glyphs need more area at this scale.
8. **Behavior.**
   - Default: static.
   - On dial-zone hover: registration offset widens 2→3px (~200ms ease),
     as if the print is "vibrating."
   - On chapter change: crossfade between glyphs (~400ms), matching
     existing chapter transition timing.
   - Does **not** rotate with the wheel. Glyph is chapter-bound, not
     dial-bound.

## Shadow ink (system constant)

**Riso Black `#22201d`** — slightly warm, avoids the digital `#000`
flatness. Used as the underprint for every glyph in the system.

## Per-chapter palette

Accents drawn from authentic riso ink names so the system feels printed,
not picked-from-a-color-wheel. Bgs are paper-stock colors that harmonize
with the accent.

| # | Chapter | Bg (primary) | Accent | Glyph subject |
|---|---------|--------------|--------|---------------|
| 1 | Dev Tooling | Manuscript cream `#F0E9D8` | Sunflower `#FFD200` | Em-dash with text-line fragments above/below |
| 2 | Blockchain Security | Midnight navy `#1A2238` | Fluorescent Red `#FF4844` | Broken chain link (two links, one snapping) |
| 3 | Cost Engineering | Kraft / manila `#D9C9A8` | Forest Green `#3D7B5C` | $0 as a postmark/stamp |
| 4 | Frontend | Warm gray `#E8E5DC` | Cornflower `#62A8E5` | Event wristband with tear-strip |
| 5 | Embodied AI | Deep aubergine `#3A1F4D` | Fluorescent Pink `#FF48B0` | Speech bubble containing an eye |
| 6 | Assistive Tech | Sea-foam `#A8C5BC` | Melon `#FFAE63` | Featureless face with one distinctive marker |
| 7 | Game Engineering | Ink charcoal `#1F1F2B` | Marine Red `#D2515E` | Hit-spark / impact burst |
| 8 | Embedded Audio | Manual cream `#E5DCC8` | Mustard `#D6A33B` | Single membrane key with waveform emanating |
| 9 | AI Systems | Pale blueprint `#E0E7EF` | Federal Blue `#3955A3` | Schematic node (box with in/out arrows) |

### Glyph-subject rationale (why this, not the stock answer)

- **#1 Em-dash.** Magnifying-glass-over-code is generic. The em-dash IS
  the AI tell — chapter's literal thesis.
- **#2 Broken chain.** The ₿ logo is stock clip-art and overrides the
  forensic energy. Broken link IS the rug-pull.
- **#3 $0 postmark.** A dollar-sign-with-slash reads as discount. Postmark
  reads as proof — the framing is the project.
- **#4 Wristband.** A phone icon claims app cred this chapter doesn't have.
  Wristband references the *event*, not the build. Quiet by design.
- **#5 Eye-in-bubble.** A head silhouette is generic. Chatbot bubble →
  bubble with face inside is the pitch in one mark.
- **#6 Face with marker.** A face icon for a face-blindness app is
  tone-deaf. This *models* how the app helps — recognition by the marker,
  not the face.
- **#7 Hit-spark.** A controller is generic. Hit-spark is fighting-game
  native and a perfect riso shape — pure geometric burst.
- **#8 Membrane key + waveform.** A music note is generic. The membrane
  key IS the cheapness, the waveform IS the engineering.
- **#9 Schematic node.** A brain icon is generic and reads as "AI." A
  schematic node says "architecture writeup, in design."

### Uncertainty flags

- **#1 (em-dash) is the boldest pick.** Only lands if visitor knows the
  em-dash is the AI tell. Safer fallback: paste-clipboard with one panel
  watermarked.
- **#6 (face-with-marker) has the highest execution risk.** Sensitive vs
  reductive lives in the drawing. Fallback: pair of identical silhouettes
  with one marker distinguishing them.

### Palette spread sanity

- **Light bgs (6):** 1, 3, 4, 6, 8, 9 — paper-like, riso-authentic.
- **Dark bgs (3):** 2 (alarm), 5 (showpiece), 7 (arcade). Each earns it.
- **Adjacency check:** two creams (1, 8) sit far apart in the wheel; two
  dark-cools (2, 7) sit far apart; two yellows (1, 8) sit far apart; two
  reds (2 fluo, 7 marine) sit far apart.

## Gradient behavior

Each chapter's bg is a **two-stop gradient**, not a flat color.

**Rule for the secondary stop (applied uniformly):**

> Secondary stop = primary shifted ~15% toward the accent hue, at slightly
> lower luminance.

The hover zones interpolate the gradient direction — left-zone hover pulls
the accent-leaning stop to the left of the canvas; right-zone hover pulls
it right. Same mechanic everywhere; only the two anchor colors change per
chapter.

Exact secondary hex values to be enumerated at prototype time.

## Implications for existing code

- **`lib/projects.ts` `Theme` type needs to grow.** Currently
  `{ bg, accent }`; needs to become `{ bgPrimary, bgSecondary, accent,
  shadow, glyph: { src, inkAccent, inkShadow } }`.
- **Current bgs in `lib/projects.ts` are pre-riso placeholders** — all
  near-black. They need to lift into paper-stock range when the bg refresh
  ships. Not now; on the radar.
- **`components/RadialDial.tsx:260`** hardcodes the "Y" in Fraunces serif.
  That's the swap point for the per-chapter glyph.

## Next

- Prototype Chapter 1 — em-dash glyph, Sunflower + Riso Black on
  manuscript cream — in the dial center, at real size. First reality check
  on whether the frame survives at 60% of dial-center diameter.
- Glyph asset production — 9 SVGs to be designed.
- Bg refresh in `lib/projects.ts` — re-pick `bg` values, add
  `bgSecondary`, extend `Theme` type.
