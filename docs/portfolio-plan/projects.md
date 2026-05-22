# The 9 Chapters

Each chapter has its own theme. Backgrounds, colors, type, and tone all flow
from the project; the wheel and chrome stay constant.

Names are mostly placeholders pending real branding. One-liner *directions*
are captured here, not final lines.

## Order

The wheel doesn't loop, so order is a sentence. Arc:

- **1-2 — Hook.** Open with the sharpest, most culturally current chapters.
  Earn the second scroll.
- **3-6 — Range.** Pivot through infra, frontend, the visual showpiece, and
  the human-empathy chapter. The placeholder slot (#4) is buried mid-stride
  where momentum carries past it.
- **7-8 — Craft.** Two "went lower" chapters paired together (game, then
  hardware). Reads as deliberate descent into systems work.
- **9 — Ambition.** End on the in-design HealthTech. Last impression points
  forward.

Mirrors the thesis: open with the most-shareable AI-adjacent chapter, close
with the most ambitious AI chapter — the bookends carry the "applied AI
center of gravity" message without flattening the breadth in between.

---

## 1. Developer Tooling
**Project:** VS Code extension + GitHub bot that catches blind AI copy-paste.
**Name:** TBD.
**Headline label alt:** Code Forensics · AI Honesty Tooling.
**One-liner direction:** anti-slop in the AI era. Culturally current.
**What's distinctive:** the **most "talkable"** project of the 9. This is the
one people share. Headline-worthy framing matters. **Slot 1 (the handshake).**
**Status:** shipped.
**Visual direction:** code-as-image — diffs, annotations, the bot in action.
**Case study meat:** detection signal(s), false-positive handling, what kinds
of AI copy-paste it catches vs misses, the philosophical/cultural argument.
**Exemplar:** this chapter is being specced out fully as the template for
the other 8.

## 2. Blockchain Security
**Project:** Crypto rug-pull detector.
**Name:** TBD.
**One-liner direction:** forensic, defensive, slightly adversarial. The bad
guys are real and named.
**What's distinctive:** real security work; ties to the CTF/sandbox-breaking
note on the About page so it doesn't read as a one-off. Paired with #1 as
the "watchdog" half of the opening.
**Status:** shipped.
**Visual direction:** terminal / forensics energy. Data-dense, dark,
monospace.
**Case study meat:** how the heuristics work, false-positive tradeoffs,
examples of tokens it correctly flagged.

## 3. Cost Engineering
**Project:** Discord bot for class routines. Free to host even at 10k users.
**Name:** TBD.
**Headline label alt:** Serverless · Scale on Zero.
**One-liner direction:** lead with **the $0 angle**, not "Discord bot." The
framing is the project.
**What's distinctive:** "Discord bot" is boring; "10k users for $0/mo" is
sharp. Same project, totally different reads.
**Status:** shipped.
**Visual direction:** infrastructure diagram, cost graph, the architecture
that makes it possible. Numbers as design elements.
**Case study meat:** the actual architecture decisions, free-tier limits
exploited, what tradeoffs were made, what would break at 100k.

## 4. Frontend — event companion app (placeholder slot)
**Project:** Companion web app for an event.
**Name:** TBD.
**Headline label:** Frontend (intentionally generic — see status note).
**One-liner direction:** lean into the constraints. Built in a day; device-ID
+ cookie auth to skip the login hassle. The honesty IS the framing.
**What's distinctive:** not much, by user's own assessment. The one-day build
and the auth shortcut are the only texture worth surfacing. **Position in
slot 4 is deliberate — buried mid-momentum so the thinness doesn't draw
attention.**
**Status:** **placeholder slot.** Kept in the wheel until a stronger
candidate exists. Marked-for-replacement; intentionally not over-invested in.
**Visual direction:** keep it modest. Don't try to dress up a thin chapter
with heavy visuals — that draws attention to the weakness. Quiet treatment.
**Case study meat:** modest. The one-day-build story is the writeup; if the
case study would have to oversell or apologize, it's too long.

### Parked: replace this slot with "the portfolio itself"
When this chapter eventually gets swapped, one strong candidate is promoting
**this very portfolio** into the Frontend slot — the dial, hover-zone
choreography, per-chapter theming, focus-mode zoom, bounce mechanic. The
visitor would be standing inside the project as they read about it
(self-evident proof, can't be faked; lineage of Bruno Simon / Cassie Evans
sites).

If/when that swap happens:
- **One-liner direction:** *"The thing you're using right now."*
- **Visual direction:** show the seams — wireframes, design canvas,
  dial-math schematic. A minimal/blank treatment is the lazy answer.
- **Case study meat:** dial math (`R = 135° + i·SEG` rotation, on-screen
  `cos ≤ 1/3` threshold), hover-zone morph, per-chapter theming
  architecture, bounce mechanic.
- **CTA copy must change** for this chapter: "Open case study" is awkward
  when the visitor is already inside the case. Use "Read the build notes"
  or "See how this site works."
- **Recursion to design around:** in focus mode, the chapter is the page
  it's on. Acknowledge it in copy rather than pretending it's a normal
  chapter.

(Other replacement candidates welcome — this is just the strongest one
currently on the shelf.)

## 5. Embodied AI
**Project:** 3D avatar interface for AI chatbots.
**Name:** TBD.
**Headline label alt:** Real-time Graphics.
**One-liner direction:** humanizing the chat box — the face, not just the
text.
**What's distinctive:** the **showpiece for craft**. Biggest visual
opportunity of any chapter. **Slot 5 is the visual centerpiece of the wheel.**
**Status:** shipped.
**Visual direction:** the avatar itself, rendering live in the background
if possible. This chapter sells craft, so the background has to be flawless.
**Case study meat:** rendering pipeline, lip sync, latency budget, what
makes it feel "alive" vs uncanny.

## 6. Computer Vision / Assistive Tech
**Project:** Mobile app that helps with face blindness (prosopagnosia).
**Name:** TBD.
**One-liner direction:** empathy-led but technical — what the app actually
does for someone who can't recognize faces.
**What's distinctive:** strongest **human story** of the 9. Different
register from the harder-edged chapters. **Tone shift after the showpiece.**
**Status:** shipped.
**Visual direction:** warmer color palette than the other chapters.
Photography or illustration of faces / recognition, treated thoughtfully.
**Case study meat:** the model choice, on-device vs cloud, accessibility
design decisions, user research notes if any.

## 7. Game Engineering
**Project:** Rhythm fighting game in SDL2 + raylib, no engine, pixel art.
**Name:** TBD.
**Headline label alt:** Systems Graphics.
**One-liner direction:** "I went lower than I had to." Hand-rolled, not
glued.
**What's distinctive:** **counter-weight to the AI tilt.** Proves
systems-level chops in a portfolio that's otherwise AI-heavy. Pairs with
#8 (groovebox) as the two "went lower" chapters.
**Status:** shipped.
**Visual direction:** pixel art, game loop screenshots, ideally a short
loop of gameplay.
**Case study meat:** game loop architecture, input timing, why SDL2 vs an
engine, the rhythm-fighting hybrid mechanic, performance.

## 8. Embedded Audio
**Project:** Standalone groovebox — $10 membrane keyboard + Raspberry Pi.
Notes per key, instrument switching, loop recording, beat manipulation.
**Name candidates:** Membrane Groovebox · Keybox · (something that owns the
cheapness of the input).
**One-liner direction:** *"A standalone groovebox built from a $10 keyboard
and a Pi. The RAM ceiling is real. I kept going anyway."*
**What's distinctive:** the **only chapter that escapes the screen.**
Hardware photographs well. Pairs with #7 as the "went lower" pair.
**Status:** shipped — admittedly shaky, but because of hardware
constraints, not abandonment. **Frame the constraint AS the engineering.**
**Visual direction:** photo of the actual rig — wires showing, keyboard
visible, hand on it. Hardware chapters where you can see the thing always
win.
**Case study meat:** memory budget breakdown, what got cut, why a membrane
keyboard at all, how the loop engine works, **honest list of the bugs that
won't fix.** The honesty is the point.

## 9. AI Systems (In Design)
**Project:** HealthTech app planned around RAG + Vision LM + TTS + local
trained models. Highly ambitious; just started.
**Name:** TBD.
**Headline label alt:** Multimodal AI.
**One-liner direction:** ambition + honesty. Don't pretend it's shipped.
**What's distinctive:** **architecture writeup as case study**, not a
product demo. Done right, this can be one of the strongest chapters
precisely because nobody writes good architecture posts. **Closing slot;
last impression of the site.**
**Status:** **In Design** — chapter meta shows this badge instead of a
year. Visitor knows it's unbuilt before they click.
**Visual direction:** system diagram, schematic energy. Don't fake a UI.
**Case study meat:** the architecture itself — how the pieces fit, the
hard problems (latency, on-device vs cloud, privacy, model selection),
where I am right now, what's next.
