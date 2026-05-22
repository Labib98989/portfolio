# Finish-Line TODO

Working doc — edit answers in place under each item, then hand it back.
Items are grouped by what they block (ship-blockers first).

Legend:
- `> A:` — fill in your answer here.
- Multiple sub-bullets under an item = pick one or write your own.

---

## A. Visible placeholders (ship-blockers)

### A1. Real name ✅ APPLIED
Replaces `"Your Name"` in [components/Header.tsx:31](../../components/Header.tsx#L31),
[components/AboutPage.tsx:50](../../components/AboutPage.tsx#L50), and
[app/layout.tsx:35](../../app/layout.tsx#L35) (browser tab title).

- Full display name (as it appears on the site):
  > A: **Labib Karim** — user prefers no first name on stage, so the legal "Farhan Labib Karim" is held off-site. Applied to Header + AboutPage h1.
- Browser tab title format (default: `"<Name> — Selected Works"`):
  > A: **`Labib Karim — Selected Works`**.
- Meta description (default: `"A portfolio."` — short one-liner, ≤160 chars):
  > A: **`Portfolio of Labib Karim — applied AI, security, hardware, and the systems-level work behind them.`** (138 chars.)

### A2. Real taglines ✅ APPLIED
Replaces the 4 `"Tagline 04/10 — …"` rotation strings in
[lib/projects.ts](../../lib/projects.ts) (`TAGLINES`).
Direction from [about.md](about.md): lead with AI obsession, undercut with breadth.

- How many taglines to rotate? (1 = static, 3–4 = rotation feels lively)
  > A: **5 — one per shipped year**, randomly selected on mount. Each lands on a single chapter from that year so the line reads as a postcard from the work.
- Tagline 1 (2026):
  > A: `2026 — A legal-doc RAG that retires its own rules when they stop helping.`
- Tagline 2 (2025):
  > A: `2025 — A VS Code extension that quizzes you about your own diff before you push.`
- Tagline 3 (2024):
  > A: `2024 — A rug-pull radar scoring ERC-20 contracts 0–100.`
- Tagline 4 (2023):
  > A: `2023 — A 3D avatar you can talk to in the browser.`
- Tagline 5 (2021):
  > A: `2021 — A standalone groovebox built from a $10 keyboard and a Raspberry Pi.`

(The italic line on the About page — *"Currently obsessed with applied AI. Also writes game engines, breaks sandboxes, and squeezes 10k users out of free tiers."* — stays as the bio subtitle. The new TAGLINES are postcards-per-year, not slogans, so the two don't repeat.)

### A3. About page body ✅ APPLIED
All three sections of `/about` now render real content. No `[TBD]` chips
remain. Dead `Tbd` component removed.
Files: [components/AboutPage.tsx](../../components/AboutPage.tsx).

- **Who** — bio paragraph(s). ✅ APPLIED.
  > A: **Applied in [components/AboutPage.tsx:73](../../components/AboutPage.tsx#L73) (Section heading="Who").** Three paragraphs: 2025 origin + two-year span, roadmap-rejection thesis with need-and-curiosity examples (class-rep routine bot, face blindness, legal-doc RAG, Android Studio month, crypto SaaS RIP), and the "nothing stopped me → call one person" ending. Italic subtitle still does the tagline duty above it.

- **Captures** — CTF placements. ✅ APPLIED.
  > A: **`NSU Robofest CTF — 4th place, team leader — 2026`** — single CTF, written into [components/AboutPage.tsx:108](../../components/AboutPage.tsx#L108). User confirmed this is the only one to surface.

- **Reach** — contact channels. ✅ APPLIED.
  > A: **Email — `labibkarim3@gmail.com` (mailto:)** and **GitHub — `github.com/Labib98989`** both confirmed and live in [components/AboutPage.tsx:117](../../components/AboutPage.tsx#L117). Added a `ReachLink` subcomponent that styles links with the chapter's accent underline and opens external URLs in a new tab.

---

## B. Chapter polish

### B1. Real project names ✅ DECIDED — domain labels stay, real names appear inside case studies
User direction: "keep the domain names at the front, then real names a bit later."

The existing scheme already does this — chapter labels in the wheel + hero are
domain names; the case study page renders `realName` as the big title with the
domain label as a small caption underneath (see
[CaseStudyPage.tsx:62-83](../../components/CaseStudyPage.tsx#L62-L83)).

No edits needed to `lib/projects.ts` names. The 4 stub chapters will get a
`realName` once their case studies are written (see B2).

| # | Slug | Wheel label (stays) | Case study title (`realName`) |
|---|---|---|---|
| 1 | `dev-tooling` | Dev Tooling | Copypasta Hunter |
| 2 | `blockchain-security` | Blockchain Security | Scammer Trapper 9000 |
| 3 | `cost-engineering` | Cost Engineering | _none — falls back to wheel label_ |
| 4 | `frontend` | Frontend | Treasure Hunt — DU CSE |
| 5 | `embodied-ai` | Embodied AI | Veena |
| 6 | `assistive-tech` | Assistive Tech | _none — falls back to wheel label_ |
| 7 | `game-engineering` | Game Engineering | _none — falls back to wheel label_ |
| 8 | `embedded-audio` | Embedded Audio | _none — falls back to wheel label_ |
| 9 | `ai-systems` | AI Systems | Legal Document AI Workflow |

Four stub chapters now have full case-study prose but no `realName` — user
hasn't named these yet, so the page renders the wheel label as the title.
Drop a `realName` into [lib/caseStudies.ts](../../lib/caseStudies.ts) when
ready and it'll take over the title slot.

### B2. Stub case studies ✅ APPLIED — prose written from user notes
4 stub chapters in [lib/caseStudies.ts](../../lib/caseStudies.ts) are now
filled out using the notes the user appended to the bottom of this file
(see [extra notes](#extra-notes-from-user-pasted-after-the-ship-hygiene-batch)).
Each chapter has a tuned `oneLiner`, a 2-paragraph `what`, an inferred
`stack`, and 2–3 `notables`.

| Chapter | What landed |
|---|---|
| `cost-engineering` | Routine-bot framing. ~50 classes / ~2.5k DU students at $0/mo on Oracle Always Free. Supabase auth, one-routine-per-CR, quick-action override buttons. Notables: free tier as constraint, ownership model, real-users-no-charge. |
| `assistive-tech` | Face-blindness app, built for self. Manual profile + selfie auto-crop (shipped) + live audio transcription (experimental). Chat-head bubble + screen overlay for instant recall. Notables: one-user product, two automation paths, app-as-demo. |
| `game-engineering` | No-engine university project that classmates kept playing. Stack inferred from existing project blurb (C++/SDL2/raylib) — confirm or correct. Notables: "grade wasn't the signal", no-engine teaches everything an engine hides. |
| `embedded-audio` | Pi groovebox: salvaged boombox audio + $10 membrane keyboard. Piano → multi-instrument → loops → full songs. Ended honestly: "then it broke." Notables: hardware-first feature pipeline, loops as unlock, end-of-life. |

**Still missing per chapter (optional — case studies render fine without them):**

- Real project name (`realName`) for any of cost-eng / assistive-tech /
  game-eng / embedded-audio.
- Repo URL or live link (none provided in notes; `links` arrays are empty).
- Stack confirmation for `game-engineering` — kept C++/SDL2/raylib from the
  original project spec since the user note didn't mention tech; correct
  in [lib/caseStudies.ts](../../lib/caseStudies.ts) if wrong.
- The existing blurb in [lib/projects.ts](../../lib/projects.ts) for
  `game-engineering` calls it "a rhythm fighting game" — the user note
  doesn't confirm genre. The case study is written genre-agnostic; the
  blurb still says "rhythm fighting game." Reconcile if needed.

### B3. CTA copy ✅ APPLIED
Per-chapter overrides. Added optional `cta?: string` field on `Project` and
threaded it through [HeroChapter.tsx](../../components/HeroChapter.tsx) (falls
back to `"Open case study"` when omitted).

> A: **(b) per-chapter overrides** — drafted below; edit any line in
> [lib/projects.ts](../../lib/projects.ts) to retune.

| # | Chapter | Custom CTA |
|---|---|---|
| 1 | dev-tooling | > A: `See how it catches you` |
| 2 | blockchain-security | > A: `Open the radar` |
| 3 | cost-engineering | > A: `Read the cost math` |
| 4 | frontend | > A: `Open the dashboard` |
| 5 | embodied-ai | > A: `Meet Veena` |
| 6 | assistive-tech | > A: `Read the case` |
| 7 | game-engineering | > A: `Step into the loop` |
| 8 | embedded-audio | > A: `See the rig` |
| 9 | ai-systems | > A: `Read the architecture` |

### B4. HealthTech (#9) "In Design" badge ✅ DECIDED — leave as 2026
User swapped chapter 9 to the shipped Legal-Doc RAG project (built in two days
at a solo hackathon). The case study in
[lib/caseStudies.ts](../../lib/caseStudies.ts) reflects that. Since the work is
shipped, the year `2026` is honest and the "In Design" badge is no longer
needed.

> A: **(c) Leave as 2026.**

If a future replacement is unbuilt again, swap the year string to
`"In Design"` directly in [lib/projects.ts](../../lib/projects.ts) — the year
slot already renders any short string.

---

## C. Ship hygiene

### C1. First real commit ⏸️ DEFERRED
User: hold the commit until A3 + B2 are done. No remote push yet either.

- Commit strategy:
  > A: **Deferred.** Will commit once A3 (About body) and B2 (4 stub case studies) land — keeps the first real commit a substantive snapshot rather than half-applied placeholders.
- Push to a remote?
  > A: **Not yet.** Stay local for now.

### C2. Favicon + OG metadata ⏸️ DEFERRED
User picked **skip for now**. Default Next favicon stays; no OG image, no
Twitter card. Revisit after the first commit.

- Favicon: > A: **Skip for now.**
- OG image: > A: **Skip for now.**
- Social handles: > A: **Skip for now.**

### C3. /glyphs preview route ✅ DECIDED — easter egg
[app/glyphs/page.tsx](../../app/glyphs/page.tsx) stays. No link from main site;
only discoverable by typing the URL.

> A: **(b) Easter egg.** No nav surfaces it.

### C4. Mobile / responsive ✅ DECIDED — ship as-is
No breakpoint, no "come back from a laptop" message. Letterboxing on phones is
acceptable for now.

> A: **(c) Ship as-is.**

### C5. docs/README\*.md cleanup ⏸️ DEFERRED
Five unsorted README drafts in [docs/](../) still in tree. User did not pick
this item in the ship-hygiene batch.

> A: **Deferred.** Revisit once content lands; pick canonical at that point.

---

## D. Optional / parked

### D1. Chapter index across refresh ⏸️ DEFERRED
> A: **No** — user did not pick this in the ship-hygiene batch. Chapter index continues to survive in-app nav only; hard refresh resets to chapter 1.

### D2. Event app (#3) replacement ⏸️ DEFERRED
> A: **Defer.** Event-app slot stays as the Treasure Hunt / DU CSE case study for now. The "this portfolio itself" swap is parked as a future candidate.

---

## Status snapshot

**Applied this pass:**
- A3 (full): all three About sections now live in
  [components/AboutPage.tsx](../../components/AboutPage.tsx).
  - Who → 3-paragraph bio (2025 origin → roadmap rejection → "call one person").
  - Captures → `NSU Robofest CTF — 4th place, team leader — 2026`.
  - Reach → email (mailto:) + GitHub link, wired through a new `ReachLink`
    subcomponent. Dead `Tbd` component deleted.
- B2: 4 stub case studies in [lib/caseStudies.ts](../../lib/caseStudies.ts)
  filled out from user notes — `cost-engineering`, `assistive-tech`,
  `game-engineering`, `embedded-audio`. Each has `oneLiner` / `what` /
  `stack` / `notables`. `realName` and `links` left empty pending user.

**Applied previously:**
- A1: real name → `Labib Karim` everywhere on-stage + in metadata.
- A2: 5 year-anchored taglines in [lib/projects.ts](../../lib/projects.ts).
- B1: no-op — chapter labels stay as domain names; case study titles use `realName`.
- B3: `cta?: string` field added to `Project`, threaded through
  [HeroChapter.tsx](../../components/HeroChapter.tsx), 9 chapter-tuned CTAs filled in.
- B4: chapter 9 year stays `2026` (Legal-Doc project is shipped).
- C3: `/glyphs` stays as easter egg.
- C4: mobile = ship as-is.

**Still blocked on user content:**
- None for the live page. A3 + B2 are both content-complete.

**Optional fills for the just-applied B2 chapters:**
- `realName` for any of: cost-engineering / assistive-tech / game-engineering
  / embedded-audio.
- Repo URLs or demo links for the same four chapters.
- Stack confirmation for `game-engineering` (currently inherited from the
  original spec — C++/SDL2/raylib).
- Genre reconciliation for `game-engineering`: blurb in
  [lib/projects.ts](../../lib/projects.ts) still says "rhythm fighting
  game" — the user note didn't confirm; the case study is written
  genre-agnostic. Either correct the blurb or confirm the genre.

**Now unblocked (A3 + B2 are content-complete):**
- C1 — first real commit. Ready when you say go.
- C2 — favicon + OG metadata.
- C5 — `docs/README*.md` cleanup.
- D1 — chapter index across hard refresh.
- D2 — event-app slot replacement.

Stop me at any step if you want to land changes incrementally.

---

<a id="extra-notes-from-user-pasted-after-the-ship-hygiene-batch"></a>
## Extra notes from user (pasted after the ship-hygiene batch)

These were the input for the B2 case-study pass above. Kept verbatim for
provenance — the prose in [lib/caseStudies.ts](../../lib/caseStudies.ts) is
the polished form.

1. Developer Tooling
This project was made for a hackathon, and even won runners up. The only reason we didn’t get first, was that the demo video was holding us back.
So, Basically, There’s 3 webservices running and talking to each other.
The one for the github bot, the one for the vs code extension, and one for the actual server.
Companies can install this system to better optimise their workflows.
What happens is this.
Whenever someone tries to push anything, this service fires up. If they are working on VS code, then the extension gets triggered, otherwise a github bot handles this. 
Then the user is asked a question about the code they are pushing. If they can’t answer, then they aren’t allowed to push.
This is basically done so that, people at least understand what code they are pushing. Not blindly copy pasting from AI without understanding the code. If they do so, then they can’t pass the test. Simple as that.
For more technical details, check the readme at the repo: https://github.com/Labib98989/Hackathon


2. Blockchain Security
So, This is my first project. I made this because I got bored watching a python tutorial.
Why crypto space? You may ask.
It’s because my naive mind thought it was easy money.
Nothing special here. This is my first ever coding project.
You can enter a token address, or a bunch of them, and it will analyze the registered code of that contract and flag any patterns that matches with other crypto scams. 
For more technical details, check the readme at the repo: https://github.com/Labib98989/Scammer-Trapper-9000



3. Cost Engineering
So, I made this one, because I was annoyed that I have to find out the routine every single day. Plus, routines change all the time. I have to keep track of it.
So, I made this. A discord bot.
It tells the routine everyday at a dedicated channel in a discord server.
So, here’s how one might use this.
Only CRs. Every account is allowed to have only one routine. Auth is handled by Supabase.
There’s a dashboard where they can set up the routine, some quick buttons for temporary changes in routine, like class cancelled or rescheduled. The user experience is tested with my CRs and so far, it’s good even for non technical persons. Also, there’s an option to choose when the routine alert appears. After everything is set, at the determined time, a message appears at the channel of their discord server.
While making this, I discovered Oracle cloud, and it’s free tier is absolutely amazing. Though, the initial setup was weird. But I made it working, and there won’t be any cost anywhere.
Right now, throughout Dhaka University, about 50 classes, and about 2.5k students are using this. And yeah, I am not charging anything, since it costs me nothing.



5. Embodied AI
This one was my 2nd project and the main one that got me interested in AI. So, this one was also the hardest one. I didn’t know what I was doing and for 1-2 months this went through multiple iterations using different technologies and methods each time.
I really couldn’t figure out three.js then, and it still leaves me with ptsd.
But at one time, something clicked and I got the realization. After that, making the whole project was like 2 days of work. I used this in some of my other projects too.



6. Computer Vision / Assistive Tech
So, I have face blindness. Not extreme level, but it still hurts my social life. I can get by perfectly in informal settings, but in formal settings, forgetting names or faces is really bad. So, I made this. Plus, this also acts like an immediate demonstration of my skills as I show people how to use it. Also, this was my excuse of trying out mobile dev and all the other things.
So, this is how this works.
It basically creates a profile of each person, fill it out with necessary info, and recalls them as needed. That’s it.
As for how it does this…..
Well, there’s manual  logging of each profile. And I made some automated stuffs. Like, if I take selfie within the app, the app cuts out their face from the photo. Even during talking, the phone transcribes the audio and automatically updates their profile. This second feature is still in experimental stage.
Now, like messenger’s chat heads. This app also uses that technique to stay as a bubble on my screen, and I can open a screen overlay any time and get info on any person. 


7. Game Engineering
So, our university project was making a game without an engine. I did just that. And this turned out to be a really fun game that a lot of my classmates played.



8. Embedded Audio
So, it started out as, me getting my hands on a raspberry pi. I grabbed a useless membrane keyboard, salvaged the audio parts from some broken boombox. And strapped together this.
Then I coded it so that this becomes a piano. And That was the main goal. Until I started adding other instruments like guitar, bass, drums. Then I thought of adding loops and loop manipulation, and altering sounds and beats. And guess what, I can now make actual entire songs out of this thing.
Then it broke. 
