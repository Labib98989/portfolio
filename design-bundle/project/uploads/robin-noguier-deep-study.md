# Robin Noguier — Deep Study

**Audited:** 2026-05-19 (site itself has not been redeployed since 2020 — see "Build vintage" below)
**Reference site:** https://robin-noguier.com
**Purpose:** Honest reverse-engineering of the portfolio our project uses as a reference. Distinguishes *what Robin actually does* from *what we should adopt*.

---

## 1. Who Robin is

- French interactive designer, based in Portugal (formerly Paris, London, San Francisco)
- 6+ years experience. Ex-Ueno (the agency, San Francisco)
- Clients on the live About page: Google Express, Red Bull TV, Facebook (Newsfeed/Messenger prototypes), Lonely Planet, Oculus Go, Airbnb, Mercedes-Benz France, Waze, Uber, Chanel, Twitter
- Discipline: product + interaction design; high-fidelity wireframes → motion-prototyped → user-tested. Not primarily a developer.
- Awards: Awwwards SOTD + Developer Award for this portfolio (co-credit Lorenzo Cadamuro, Italy — Lorenzo is the engineer); recurring Awwwards + Webby international juror
- Stated design philosophy on About page: *"I ask a lot of questions to understand the problems my clients want to solve and the goals they want to achieve. I then create high-fidelity wireframes..."*

**Implication for our project:** Robin's portfolio is a *design-led collaboration* with a specialist engineer. The animation craft and the WebGL load-bearing code are Lorenzo's. When we channel "Robin's site," we are channeling design decisions Robin made + engineering decisions Lorenzo made. Keep that split in mind.

---

## 2. Build vintage (important caveat)

The live site is the **2020 build** — never redeployed since.

Evidence captured from live inspection (2026-05-19):
- `__NEXT_DATA__.buildId`: `MOexBMJpZmvJncbn8Pg25`
- Next.js version (from `window.next.version`): **9.1.6**
- Prismic repo: `robin-noguier-portfolio-2020`
- Homepage doc `last_publication_date`: 2020-10-12 (content has been edited as recently as 2023 for the Fun project, but the *deploy* is 2020)
- Analytics: still ships both legacy UA-49987550-1 and GA4 G-PHNTVLG0Z5

So when we look at how it's built, we're looking at *late-2020 React/WebGL practice*. Some choices (Next 9.1.6, dual analytics tags, React-Spring v8-ish patterns, manual wheel handling) would be done differently today. We should *steal the design language and interaction model*, not blindly clone the 2020 implementation.

---

## 3. The actual tech stack on the live site

### From Lorenzo Cadamuro's Medium post ("How to Build a Creative Portfolio with React JS and WebGL")

Lorenzo is the engineer who built it with Robin. Definitive list:

| Layer | Library / Approach |
|---|---|
| Framework | Next.js (App Router did not exist; this is Pages Router) |
| 3D | Three.js + `react-three-fiber` |
| Animation | **React-Spring** for interpolation. Bezier-Easing + Easings.co for custom curves. **No GSAP** in the portfolio itself. |
| Scroll | Custom `wheel` listener. Item snapping by accumulated deltaY. |
| Scroll intent | **Lethargy** library (distinguishes intentional wheel input from inertia tail) |
| Workers | **2 Web Workers**: (1) project-3D-position → screen-coords for clip-path masks, (2) wheel observer + snap decision |
| State | **Excluded a Redux store deliberately**: *"isn't made for continuous updates, just like an animation."* Uses React Context to dispatch React-Spring interpolation objects across components. |
| CMS | **Prismic** |

### What I confirmed live by probing the page

- One persistent full-viewport `<canvas>` (1920×893 at my viewport) — survives navigation between home → project → about.
- Multiple JSX style scopes (Next.js styled-jsx) — every component carries a `jsx-NNNNNN` class. No CSS-in-JS like Emotion, no Tailwind.
- Self-hosted custom fonts (NOT Google Fonts):
  - **Eksell Display** — display serif, "rm" custom subset, two sizes (`eksell_rm_large`, `eksell_rm_small`)
  - **Silka** (by Atipo) — body sans, 400/700 + italic, custom subset (`silka_rm`)
- Body background `rgb(0, 0, 0)` — pure black on all routes (homepage, case study, about). Per-project content backgrounds become white inside case studies.
- `dat.GUI` is present in chunk 10 — likely a hidden debug panel.
- Webpack-confirmed: `react-spring` easing API patterns in `pages/index.js`. (Three.js / r3f / Lethargy live in chunks I did not exhaustively probe; Lorenzo's article is authoritative.)
- **Interesting tension:** the `commons` chunk *does* contain Redux + React-Redux. Lorenzo's article says they avoided a store. Either the article reflects an earlier iteration or Redux was added for non-animation state (route, modal, etc.). Worth flagging.

### Stack our project diverges on (intentionally or not)

| Our plan | Robin's live site |
|---|---|
| GSAP / ScrollTrigger | **React-Spring** (no GSAP) |
| Next.js 16 App Router | Next.js 9.1.6 Pages Router |
| Velite / MDX | Prismic (headless CMS, not file-based) |
| Vanilla CSS Modules | Next styled-jsx |
| Tailwind banned | Same (no Tailwind here) |

Our GSAP choice is fine for 2026, but it's not "matching Robin." If we want to channel Robin authentically, we accept that our animation runtime is different but the *easing feel, timing, and choreography* are what we copy — not the library.

---

## 4. The interaction model — homepage

This is the signature pattern of the site. Reverse-engineered from live DOM probe:

```
┌──────────────────────────────────────────────────┐
│  ROBIN NOGUIER                          About    │
│                                                  │
│                                                  │
│   Fun                              ┌──────────┐  │
│                                    │ • Fun    │  │
│   Designing a new video-only       │  Esperanto│  │  ← right rail
│   dating app 💖 with...            │  Blurr   │  │     (project nav)
│                                    │  Ueno    │  │
│   ─→ Open case study               │  Airbnb  │  │
│                                    │  Google  │  │
│                                    │  SnickSnack│ │
│                                    │  Iv-Skaya│  │
│                                    │  Eagle Films│ │
│                                    └──────────┘  │
│                                                  │
│  (full-bleed WebGL canvas behind everything)     │
└──────────────────────────────────────────────────┘
```

**Measured details (1920×893 viewport):**
- Full-bleed canvas: 1920×893, z behind all DOM
- H1 project title: 180px tall, ~12% from top, left-aligned at x=120, claims full row width up to 1800px
- Description paragraph + "Open case study" link in the same column directly under the title
- Right rail project list: 9 entries, each 34px row height, right-aligned at x=1770 (so 120px right gutter, 18px text + 16px row gap)
- Header: logo at x=120, "About" at x=1742 — symmetric 120px gutters
- `document.body.scrollHeight === 893` (= viewport) — **the page does not natively scroll.** Wheel events are intercepted and converted into project transitions.

**Scroll behavior:** wheel deltaY accumulates; when intent (per Lethargy) is detected, the next/previous project becomes the centerpiece. Canvas content interpolates via React-Spring. No "scroll position" — only "current project index."

**Why this is hard to copy 1:1:** in 2026, intercepting `wheel` to hijack page scroll is browser-fragile and accessibility-hostile (trackpad, keyboard, screen reader, touch). Our project plan correctly uses normal scroll + GSAP ScrollTrigger to choreograph an evolving WebGL background, which is the modern Robin-equivalent.

---

## 5. The interaction model — case study page

Probed `/project/fun/`. Findings:

- **Same persistent canvas at the back** (1920×893) — does not unmount on route change
- Page document height (inner virtual scroller): **40,862px** — these are *long* scrollable case studies, ~45 viewport-heights
- Custom thin scrollbar element: 11×100 at x=1909 (right edge, 11px wide, 100px tall thumb). Native scrollbar suppressed.
- Centered circular "back to home" SVG button (~136×136 wrapper, 56×56 visible circle at center-bottom of viewport)
- **Per-project color tokens from Prismic:**
  - `primary_color` (e.g. Fun = `#3d6681`)
  - `secondary_color` (e.g. Fun = `#d5dedd`)
  - `home_description_color`, `case_hero_color`, `content_color`: `light` | `dark`
  - `content_background` (case study body bg, e.g. Fun = `#ffffff`)
  - `back_to_home_message` (e.g. Fun = "Life is fun! 💖")
  - `link_to_the_project` (external URL, e.g. ProtoPie prototype for Fun)
- **Content is Prismic slices.** Every case study is composed from a closed vocabulary:
  - `about` — intro block
  - `title` — section title
  - `title_paragraph` — title + paragraph pair (most common, ~30 uses in the Fun case)
  - `single_video` — full-width autoplaying video clip
  - `grid4` — 4-column grid (for sets of 4 device frames)
  - `grid6` — 6-column grid (for denser sets)
  - `margin` — vertical spacer (used liberally as the layout-rhythm primitive)
  - `quote` — pull quote
  - `background_trigger` — scroll-triggered background color change

  → A case study is essentially a sequence of `title_paragraph` + `single_video` pairs separated by `margin` spacers, punctuated by `quote` + `background_trigger` for chapter breaks.

- **Two-column typographic system inside cases:**
  - Wide column: 1105px wide, starts at x=264 → used for H1/H2 and "About the project" body
  - Narrow column: 530px wide, starts at x=264 → used for H3 + section body
  - Right gutter is wider than left → asymmetric design grid (intentional editorial feel)

**Editorial voice in Fun case:** H2/H3 headings are conversational, emoji-heavy, written like product release notes: "Liking is hoping 🤞", "Teach the game!", "Nope, you can't go back! ❌", "Introducing the funwheel 🎰". This is part of the brand — not corporate copy.

---

## 6. About page — structure

Same persistent canvas. No special interactions; standard scroll-down editorial page. Sections:
1. Opener H2: *"I design digital products and websites for startups, brands, and entrepreneurs with cool projects."*
2. **At work** — work bio
3. **In life** — personal bio
4. **Happy clients for a happy life** — client logos / testimonials
5. **6+ years around the world to turn a passion into a job** — timeline
6. **Writings, interviews & talks** — appearances list ("950 people at Awwwards Amsterdam in 2020", "Design Fund book 2017", "Antwerp 2020 side-projects talk")
7. **Awards & recognitions**
8. Closer H2: *"Whenever, wherever. We're meant to work together."*
9. Contact CTA

Note the *paired-opener-and-closer-H2* structure — first big statement and last big statement bookend the page. Worth stealing for our about page.

---

## 7. Loader / first paint

The Prismic `loaderProps` data exposes the personality of the first load:

- Background: `#0d0d0d` (near-black, slightly warmer than `#000`)
- Headline: "Robin Noguier" + subline "Interactive Designer"
- **Random rotating tagline pool** (10 entries — one shown each visit):
  1. "Whenever, wherever. We're meant to work together"
  2. "The kind of designer you'd like to introduce to your parents"
  3. "The designer you didn't know you needed.. until today"
  4. "Cheaper elsewhere, further with me. You get to choose."
  5. "I'm only one call away.. to save the day"
  6. "This website is not better with headphones but you can still put them on, I'll wait."
  7. "Every brief you take, every business you make, I'll be helping you"
  8. "Other people are watching this portfolio, reach out now! #darkpatterns"
  9. "Only one more designer left!!! Reach out before it's too late !!! #darkpatterns"
  10. "I know you want me. You know I want ya!"

That rotating tagline pool is one of the most distinctive personality moves on the site. Funny + self-aware (the "#darkpatterns" ones lampoon dark-pattern marketing).

---

## 8. Project list (9 cases, in current display order)

| # | Slug | Title | Description (Prismic) | Hero accent |
|---|---|---|---|---|
| 1 | fun | Fun | Designing a new video-only dating app 💖 with Brian Norgard (ex-CPO-Tinder) and Farb Nivi | `#3d6681` / `#d5dedd` |
| 2 | esperanto | Esperanto | (not fully sampled) | — |
| 3 | blurr | Blurr | — | — |
| 4 | ueno | Ueno | — | — |
| 5 | airbnb | Airbnb | — | — |
| 6 | google | Google | — | — |
| 7 | snicksnack | SnickSnack | — | — |
| 8 | iv-skaya | Iv-Skaya | — | — |
| 9 | eagle-films | Eagle Films | — | — |

Mix of: name-brand collaborations (Airbnb, Google, Ueno), tiny startups (Fun, SnickSnack), and personal work (Iv-Skaya, Esperanto). **The order is not chronological and not by prestige** — it's curated for narrative.

---

## 9. Design tokens worth lifting

| Token | Value | Where used |
|---|---|---|
| Page background (canvas behind) | `#000000` | All routes |
| Loader background | `#0d0d0d` | First paint only |
| Case content background | per-project (`#ffffff` for Fun) | Inside case study |
| Display type | Eksell (custom serif) | H1 hero project titles, oversized |
| Body type | Silka (custom sans, 400/700 + italic) | Everything else |
| Gutter | 120px left + right on header | Header layout |
| Case-study text column (wide) | 1105px wide, 264px from left edge | H1, H2, About body |
| Case-study text column (narrow) | 530px wide, 264px from left edge | H3 + section paragraphs |
| Hero project title height | 180px line height | Homepage |
| Right-rail nav row | 34px row height | Homepage project list |
| Custom scrollbar | 11px wide, dark thumb | Case study + about |

**Our project's plan** already specifies:
- Black bg (`#000`) + cream fg (`#EFEFEC`) ✅ aligned
- Display: Fraunces (instead of Eksell — Fraunces is variable, free, Eksell-adjacent) ✅ deliberate divergence
- Body: not yet locked

**Suggested:** for body sans, pick a workhorse with 400/700 + italic + good metrics — **Silka is paid** ($), so substitute with a Silka-adjacent free option (Inter is too generic; **Söhne** is paid; **General Sans** by Indian Type Foundry or **Geist Sans** by Vercel are credible free Silka-adjacent picks).

---

## 10. What to steal vs. what to leave behind

### Steal
- **Persistent full-viewport canvas behind DOM** — the signature move. Our project already plans this.
- **Per-project color theming** in CMS (primary + secondary + content_bg + light/dark mode flags). Build into our content schema (Velite frontmatter).
- **Closed slice vocabulary for case studies** (title, title_paragraph, single_video, grid4, grid6, margin, quote, background_trigger). Use this as our MDX component allow-list.
- **`background_trigger` slice as a scroll-choreography primitive.** Insert color-change anchors mid-case-study to drive the canvas.
- **Asymmetric two-column type grid** inside case studies (1105px wide + 530px narrow). Editorial, not corporate-symmetric.
- **Long-form case studies (~40k px tall)** — generous space, lots of margin slices, lots of video. Don't be afraid of length.
- **Custom thin scrollbar** (we already match this in the wheel/notch UI direction).
- **Bookended hero H2s** on about page (opener statement, closer statement).
- **Rotating loader tagline pool** — high-personality micro-moment.
- **Conversational emoji-heavy H3s** in case studies (matches Robin's brand; would need to be earned, not imitated, in our voice).
- **Back-to-home message per project** ("Life is fun! 💖") — small payoff at scroll end.

### Don't blindly copy
- **Wheel-hijack snap navigation.** Robin's homepage doesn't normal-scroll. In 2026 this is fragile (trackpad/touch/keyboard/a11y). Our plan correctly uses normal vertical scroll with ScrollTrigger choreographing the canvas — same *feeling*, better mechanics.
- **React-Spring.** GSAP is our locked choice; the easing *feel* is what matters, not the lib. Steal Robin's timing (slow, confident, 600–1000ms macro transitions; tight 100–200ms micro), not his animation runtime.
- **Prismic.** We're using Velite (file-based MDX). Adapt the slice vocabulary into our MDX components.
- **dat.GUI in production bundle.** Skip — use Leva or a dev-only panel.
- **Self-hosted Eksell + Silka.** Both paid. Substitute Fraunces (already chosen) + free Silka-adjacent sans.
- **Dual analytics tags + Next 9.1.6.** Modern stack handles this.
- **No accessibility statement on the site** and wheel-hijacked nav is hard for screen readers. Our plan should do better here.

### Open questions worth answering before Phase 1 polish
1. What does the canvas *do* per project on Robin's site? (Need a screenshot/video study mid-transition — every project has different shader treatment of images.) → next research pass.
2. What are the transition durations between projects on home? Lorenzo's article doesn't quote them. → time them visually.
3. How does the canvas state animate when entering a case study from home? Curtain-up? Crossfade? Push? → next pass.
4. Mobile behavior — does the site even have one, or does it fall back to a static thumbs list? → next pass on a mobile viewport.

---

## 11. Sources

- [Robin Noguier — Portfolio (live)](https://robin-noguier.com/)
- [Robin Noguier — About (live)](https://robin-noguier.com/about/)
- [Robin Noguier — Fun case study (live)](https://robin-noguier.com/project/fun/)
- [Lorenzo Cadamuro — "How to Build a Creative Portfolio with React JS and WebGL" (Medium)](https://lorenzocadamuro.medium.com/how-to-build-a-creative-portfolio-with-react-js-and-webgl-a697869f78c5)
- [Awwwards SOTD entry](https://www.awwwards.com/sites/robin-noguier-portfolio)
- [The FWA case page](https://thefwa.com/cases/robin-noguier-portfolio)
- [Awwwards talk: Building Side Projects with Robin Noguier](https://www.awwwards.com/talk-building-side-projects-with-robin-noguier-former-ueno-interactive-designer.html)
- [Lovers Magazine interview (Ueno period)](https://www.loversmagazine.com/interviews/robin-noguier)
- [CSSDA judge interview](https://www.cssdesignawards.com/judge-interview/robin-noguier/259)
- Parallel reference (different person, similar genre, more recent — 2025): [Roman Jean-Elie WebGL portfolio on Codrops](https://tympanus.net/codrops/2025/11/27/letting-the-creative-process-shape-a-webgl-portfolio/) — uses GSAP + MorphSVG + custom shaders for fold/velocity-stretch effects; good companion read.

---

## 12. Next research pass (when we want to go deeper)

- Record video of homepage → case study → back transition; measure timings frame-by-frame
- Trace canvas state across all 9 projects (each appears to have unique shader/material treatment)
- Probe second-level chunks for Three.js / Lethargy / r3f signatures (didn't exhaust this pass)
- Mobile viewport audit
- Inspect the loader animation pacing
