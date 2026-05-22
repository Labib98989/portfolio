# Project Lock — OmniCare

**Product:** OmniCare — the companion that follows the patient, not the file
**Avatar Character:** Veena (3D Bangla-speaking guide)
**Status:** Concept locked · Name locked · Scope frozen · Awaiting DMCH meeting for protocol details
**Track:** HealthTech (Track 3) — Custom HealthTech (Showcase) Challenge #6
**Differentiation Anchor:** Multi-stage patient journey companion with persistent memory graph + 3D avatar interface, MCP-orchestrated multi-agent backend, and local-first inference for offline resilience. **Explicitly distinct from MaaCare AI** (maternal-only, single-phase).

---

## 1. Locked Concept

A **3D-avatar-driven web app** that accompanies a patient through their full hospital journey at DMCH (and replicable to any hospital):

1. Patient registers at hospital reception (existing flow, paper form).
2. Receives a QR code → opens our PWA in waiting room.
3. **Avatar conducts Bangla voice intake** — structured medical history.
4. By the time patient is called in, **doctor sees a pre-built clinical summary**.
5. Doctor's handwritten prescription → **photographed → AI-extracted → structured**.
6. App becomes the patient's **post-visit companion**: med reminders, inventory tracking, follow-up alerts, persistent record for next visit.
7. **Patient memory graph** carries continuity across every visit, every doctor, every prescription.
8. **Local edge inference** keeps the app working when internet drops.

**Tagline (working):** *"The companion that follows the patient, not the file."*

---

## 2. Scope — Locked Build/Stub/Skip Triage

### Build Deep (the demo's spine)
- Avatar pre-consultation intake → structured doctor summary
- MCP-orchestrated multi-agent backend (11 agents, see Section 5)
- Prescription capture pipeline (photo → vision LLM → BD formulary match → confirm)
- Daily medication reminders generated from prescription
- Persistent patient memory graph across visits
- Doctor dashboard: pre-visit brief + patient timeline + Rx confirm
- Local LLM (Ollama) offline fallback path
- Scraper layer for real-world data (BD drug formulary, DGHS protocols, WHO guidelines)

### Stub (visible in UI, partial logic, narrated in pitch)
- Medication inventory + low-stock nudges
- Follow-up visit reminders
- Hospital wayfinding map (static DMCH map)
- Recovery check-ins (only if DMCH says it matters for post-procedure patients)

### Skip (not in scope)
- Pre-arrival "should I go to hospital" triage
- Auto-booking appointments to other facilities (huge integration cost)
- Insurance / billing
- Telehealth video consult
- Replacing existing paper registration flow
- Patient-phone-side local LLM (production v3 aspiration only — not for demo)

---

## 3. Patient Journey Map

```
Reception ──▶ Paper Form ──▶ QR Scan ──▶ PWA Opens
                                            │
                                            ▼
                            ┌─── AVATAR INTAKE (Bangla voice) ───┐
                            │  • Chief complaint                  │
                            │  • Symptom timeline                 │
                            │  • Prior history (memory graph)     │
                            │  • Department-specific questions    │
                            └─────────────────┬───────────────────┘
                                              │
                                              ▼
                              Structured summary → Doctor Dashboard
                                              │
                                              ▼
                                   Doctor consultation
                                              │
                                              ▼
                              Handwritten Rx → photo capture
                                              │
                                              ▼
                       ┌────── PRESCRIPTION PIPELINE ──────┐
                       │  Vision LLM + BD drug formulary    │
                       │  Fuzzy match + confidence routing  │
                       │  Doctor one-tap confirm            │
                       └─────────────────┬─────────────────┘
                                         │
                                         ▼
                          Structured Rx → Patient Memory Graph
                                         │
            ┌────────────────────────────┼─────────────────────────────┐
            ▼                            ▼                             ▼
   Daily med reminders     Inventory low-stock alert         Follow-up scheduler
            │                            │                             │
            └─────────────── Avatar nudges via PWA ────────────────────┘
                                         │
                                         ▼
                          Next visit: doctor opens dashboard
                          → sees full timeline + adherence + symptoms
```

---

## 4. Architectural Backbone

```
┌──────────────────────────────────────────────────────────┐
│   3D AVATAR — "Veena" (consistent character, Bangla)     │
│   (Reused asset — patient-facing across all stages)      │
└────────────────────────────┬─────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────┐
│   MCP MULTI-AGENT ORCHESTRATION (11 agents — Section 5)   │
│   Router · Responder · Animator (inherited from Veena)    │
│   + Intake · History · Clinical RAG · Rx Extraction ·     │
│     Validator · Summary · Reminder · Escalation (new)     │
└────────────────────────────┬─────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────┐
│   PATIENT MEMORY GRAPH  ←─ THE MOAT                      │
│   Per-patient nodes: Visits → Symptoms → Dx → Rx →       │
│   Adherence → Outcomes. Doctors query timeline.          │
└────────────────────────────┬─────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
  Clinical RAG         Vision LLM Rx        Doctor Dashboard
  (DMCH protocols,     pipeline             (briefs, timeline,
   WHO guidelines,     (photo→structured)    Rx confirm)
   BD formulary)
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                             ▼
            ┌─────────────────────────────────────┐
            │   INFERENCE ROUTER                  │
            │   ─ Cloud: Claude / Gemini          │
            │   ─ Edge: Ollama (Section 6)        │
            │   Falls back automatically offline  │
            └─────────────────┬───────────────────┘
                              │
                              ▼
                   Supabase + PGVector + GraphDB
                   (auth, data, embeddings, graph)
                              ▲
                              │
                Scrapers (Playwright / Firecrawl / BS4)
                ─ DGDA drug formulary
                ─ DGHS protocols · WHO guidelines
                ─ Pharmacy aggregators (Arogga, MedEasy)
```

---

## 5. MCP Multi-Agent Orchestration

The Blueprint mandates MCP-orchestrated multi-agent reasoning. Our app naturally decomposes into 11 specialized agents:

### Inherited from Veena (already MCP-shaped, ~1 day to formalize)

| Agent | Job | Source |
|---|---|---|
| **Router** | Classifies user intent + sentiment | Veena (Gemini Flash-Lite) |
| **Responder** | Generates context-aware reply | Veena (Gemini Flash) |
| **Animator** | Maps reasoning output → avatar emotion/animation trigger | Veena |

### New (built during BuildFest)

| Agent | Job |
|---|---|
| **Intake Agent** | Conducts structured medical history conversation; extracts symptoms |
| **History Agent** | Queries patient memory graph for prior visits, conditions, meds |
| **Clinical RAG Agent** | Retrieves DMCH protocols / WHO guidelines for current complaint |
| **Rx Extraction Agent** | Vision LLM parses prescription photo → drug/dose/frequency/duration |
| **Validator Agent** | Cross-checks Rx against BD formulary, dose ranges, drug interactions |
| **Summary Agent** | Composes the doctor's pre-visit brief from intake + history + RAG |
| **Reminder Agent** | Schedules and triggers medication notifications via avatar |
| **Escalation Agent** | Detects red flags (worsening symptoms, missed critical doses) → routes to doctor or emergency |

**Pitch line:** *"We extended a 3-agent avatar conversation pipeline into an 11-agent clinical multi-agent system orchestrated by MCP — no single LLM is a single point of failure."*

---

## 6. Local LLM Strategy (Ollama)

Ollama is **first-class**, not optional. The HealthTech track explicitly requires offline resilience.

### Why Local Inference Is Mandatory

1. **Offline resilience** — track requirement; "low-bandwidth deployment"
2. **Patient privacy** — raw symptoms processed locally, only structured/anonymized output reaches cloud
3. **Cost optimization** — high-volume routine prompts cost ₹0
4. **Demo flex** — pull WAN cable, app keeps working

### Concrete Use Cases (Where the Cloud-vs-Edge Decision Lands)

| Use Case | Runs On | Why |
|---|---|---|
| Avatar small-talk + Bangla intake routing | **Local Ollama** | Low-latency, free, private |
| Daily medication reminder phrasing | **Local Ollama** | Cheap, runs even on bad WiFi |
| Initial symptom intake (raw patient text) | **Local Ollama** | Privacy — leaves device only after anonymization |
| Complex clinical reasoning + doctor summary | **Cloud Claude** | Quality matters; Ollama falls back if offline |
| Rx vision extraction | **Cloud Gemini Vision** | Vision LLMs needed; Ollama vision fallback for resilience |

### Model Selection (Demo Day)

| Model | VRAM | Use |
|---|---|---|
| **Llama 3.1 8B (Q4)** | ~5 GB | Primary local model — good Bangla, strong reasoning |
| **Gemma 2 2B** | ~1.5 GB | Fallback for lighter hardware |
| **Phi-3 Mini 3.8B** | ~2.5 GB | Backup option for English-heavy reasoning |

---

## 7. Deployment Topology

The Blueprint mandates "deployment feasibility." Here's the honest picture across phases:

### Demo Day (June 12, 2026 — BRAC University)

- **Inference Node:** Team laptop with discrete GPU (RTX 3060+ / Apple M-series with 16GB+)
- **Cloud:** Vercel + Supabase + Claude/Gemini APIs (live unless we cut the cable)
- **Demo move:** *"Unplug WAN cable from router; app stays alive on Local Inference Node + LAN"*

### Pilot (DMCH, 1 department)

- **Edge device:** NVIDIA Jetson Orin Nano (~$500) — fanless, low power, dedicated to inference
- **Topology:** Cloud-primary with Vercel/Supabase; edge device serves as offline failover and privacy zone
- **Physical placement:** OPD nurse station or DMCH server room (TBD with DMCH)

### Production v1 (DMCH-wide)

- 3–5 edge devices (one per OPD floor)
- Total hardware cost: ~$2–3k one-time
- Cloud dashboard for hospital administrators

### Production v2 (Urban replication)

- Same model per partner hospital
- Onboarding includes the edge box pre-configured

### Production v3 (Rural Community Health Centers)

- Edge-primary topology (intermittent connectivity)
- $500/CHC, life-critical for low-connectivity areas
- Cloud-sync when available

### Honest Pitch Framing

*"Hospitals don't have GPU infrastructure today — we deliver one. $500 per site is less than a single ultrasound exam, and the device handles a whole OPD floor. We're not asking hospitals to invest; we're delivering AI infrastructure as part of the product."*

---

## 8. Scraper Layer — Real-World Data Sources

Per the Golden Blueprint: scraping is non-negotiable. No static datasets.

| Source | What We Scrape | Tooling | Powers |
|---|---|---|---|
| **DGDA** (Directorate General of Drug Administration BD) | Drug formulary — names, doses, manufacturers, status | Playwright | Rx pipeline matching, Validator Agent |
| **DGHS** (Directorate General of Health Services BD) | Clinical protocols, treatment guidelines | Firecrawl (PDFs) | Clinical RAG Agent |
| **WHO** | Global guidelines for cross-border validity | Firecrawl | Clinical RAG; global readiness score |
| **Health news (Prothom Alo Health, Daily Star Health)** | Seasonal disease alerts, outbreaks | BeautifulSoup | Optional triage context |
| **Pharmacy aggregators (Arogga, MedEasy)** | Drug prices, availability | Playwright | Inventory low-stock features, cost-aware Rx |

**Refresh cadence:** DGDA monthly · DGHS/WHO on guideline release · pharmacy aggregators weekly · health news daily.

---

## 9. Prescription Capture — Multi-Layer Pipeline

Doctor handwriting is unreadable by classical OCR. Solution is layered, owned by Rx Extraction + Validator agents:

| Layer | Mechanism | Failure Recovery |
|---|---|---|
| **1. Vision LLM** | Claude/Gemini vision parses photo with prescription context | Falls through to L4 if confidence low |
| **2. BD Drug Formulary constraint** | LLM matches outputs to ~5000-drug BD formulary (canonicalize "Napq"→"Napa") | — |
| **3. Dose/frequency validation** | Cross-check extracted dose against typical ranges per drug | Flags impossible doses (5000mg etc.) |
| **4. Confidence-based routing** | >0.9 auto-accept · 0.7–0.9 one-tap confirm · <0.7 doctor edits | Always falls back to human |
| **5. Voice dictation alt** | Doctor dictates Rx → STT → LLM structures | Bypasses handwriting entirely |
| **6. Pharmacist capture (Plan B)** | If photo + voice both fail, pharmacist confirms at dispense | Pharmacists already decipher handwriting |

**Result:** Robust to any single-layer failure. Demo-able as a sequence judges can see.

---

## 10. Locked Architectural Decisions

| Decision | Locked Value |
|---|---|
| **Patient identity** | QR code on paper form → scan → phone OTP |
| **App format** | Progressive Web App (works as web for competition, installs/notifies like native) |
| **Avatar** | **Veena** — pre-existing 3D Unity WebGL avatar with Router/Responder/Animator pipeline |
| **Avatar render** | In-browser Unity WebGL · Bangla TTS in (Piper) / STT out (Whisper) + English fallback |
| **Language** | Bangla primary, English fallback |
| **Backend** | Supabase (auth, Postgres, edge functions) |
| **Vector store** | PGVector |
| **Graph DB** | Neo4j (preferred) or graph patterns in Postgres (fallback) |
| **LLM (cloud reasoning)** | Claude (primary) + Gemini (vision/multimodal) |
| **LLM (local inference)** | **Ollama running Llama 3.1 8B (Q4)** — first-class, not optional |
| **Agent orchestration** | **MCP (Model Context Protocol)** across 11 agents |
| **Inference router** | Decides cloud vs. local per request based on connectivity + privacy class |
| **Frontend hosting** | Vercel |
| **Scraper stack** | Playwright (forms) + Firecrawl (PDFs) + BeautifulSoup (news) |
| **Edge device (pilot)** | NVIDIA Jetson Orin Nano (~$500) |
| **Department for demo** | TBD — to be decided with DMCH (preference: cardiology or endocrinology) |

---

## 11. Open Decisions (Pending DMCH Meeting)

These get resolved after the consultation:

1. Which department to anchor the demo to.
2. Exact intake question set (department-specific protocol the avatar follows).
3. Whether doctors will tolerate the dashboard + Rx confirm step.
4. Patient consent + data-storage compliance under DMCH/BD law.
5. Whether DMCH will allow live pilot with real patients on demo day.
6. Whether recovery check-ins matter enough to add to scope.
7. What existing digital systems we'd integrate with vs. work around.
8. **NEW:** Where the edge device physically lives at DMCH (server room? OPD nurse station?).
9. **NEW:** Procurement path for a one-time $500–1500 hardware purchase.

---

## 12. DMCH Meeting — Question List

Bring this list. Don't ask "what do you think of our idea." Ask:

### Workflow
1. Walk me through the actual OPD intake today — what's on the paper form, who fills it, what happens next?
2. Which department has the cleanest history-taking protocol we could automate first?
3. What 8–12 questions do you wish every patient had answered before walking in?
4. What does the prescription physically look like? Printed template? Handwritten? Any existing ePrescription?
5. What's your single biggest pain in follow-up visits?
6. Are there post-procedure patients who need recovery monitoring?

### Adoption & Compliance
7. Privacy/consent — what can we legally store, and what's the patient consent flow at DMCH?
8. Adoption gut check — would you personally use the doctor dashboard? What would make it a hard no?
9. Pilot possibility — could we shadow an OPD shift? Run 5 real patients through the app on demo day?

### Infrastructure (NEW)
10. Are there any existing digital systems at DMCH we'd plug into vs. work around?
11. What server / IT infrastructure does DMCH have today? (Server room? Local HMS? Wi-Fi reach into OPD?)
12. If we provided a small edge device pre-configured, where would it physically live?
13. What's the procurement path for a one-time $500–1500 hardware purchase?

---

## 13. Demo Narrative (180 Seconds)

| Time | Beat | What's On Screen |
|---|---|---|
| **0:00–0:30** | **Problem** | DMCH OPD: patients wait hours for 3-min consults. No continuity between visits. Low literacy. Doctors fly blind. |
| **0:30–1:00** | **Solution** | Meet Rahima, 45, hypertension follow-up. Avatar companion (Veena) across her full journey. |
| **1:00–2:00** | **Demo flow** | Rahima scans QR → Veena Bangla intake → doctor opens dashboard, full brief in 20s → consult cut from 12 min to 4 min → Rx photographed → 11-agent MCP pipeline structures it → days later Veena reminds her of meds, flags low stock, schedules follow-up → next visit, doctor sees timeline + adherence at a glance. |
| **2:00–2:20** | **AI approach** | 11-agent MCP backend · Vision LLM Rx pipeline · BD drug formulary RAG · patient memory graph · DMCH-validated clinical RAG · scraped real-world data. |
| **2:20–2:35** | **Resilience flex** | **Pull the WAN cable live on stage.** Avatar keeps talking via local Ollama. Reminders still fire. Doctor dashboard still updates over LAN. |
| **2:35–3:00** | **Impact + scale** | Consult time ↓50% · adherence ↑30% · readmission ↓ · $500 edge box per hospital · scales rural-first · DMCH-validated · culturally grounded. |

---

## 14. KPIs (For Pitch)

- Avg consultation time: ↓50% (from ~12 min to ~4–5 min)
- Medication adherence rate: ↑30%
- Readmission within 30 days: ↓ (target TBD post-DMCH meeting)
- Patient comprehension of treatment plan: ↑ (measurable via avatar quiz)
- Doctor time saved per OPD shift: quantified hours
- Offline availability: 100% of core features (intake, reminders, dashboard) over LAN

---

## 15. Honest Attribution & Innovation Framing

The avatar (Veena) is pre-existing. This is an Innovation-score risk if not framed correctly. Per Reusable_Assets.md:

> *"Judges might dock the Innovation score (20% of rubric) if they perceive the avatar as pre-existing/incremental. Mitigate by framing: the BuildFest contribution is the vertical specialization."*

### What Was Built BEFORE BuildFest
- Veena's 3-agent avatar shell (Router · Responder · Animator)
- Voice I/O wiring (Web Speech STT, browser TTS — both English-biased)
- JSON conversation memory module
- Unity WebGL render + emotion triggers

**Integration cost saved by reusing:** 7–10 days.

### What We Build DURING BuildFest
- 8 new clinical agents (Intake, History, Clinical RAG, Rx Extraction, Validator, Summary, Reminder, Escalation)
- MCP formalization across all 11 agents
- Patient memory graph (schema, queries, doctor timeline view)
- Multi-layer prescription capture pipeline
- Doctor dashboard with brief + timeline + Rx confirm
- Bangla STT swap (Web Speech → Whisper)
- Bangla TTS swap (browser → Piper)
- Ollama local inference + cloud/edge inference router
- Scraper layer (DGDA, DGHS, WHO, pharmacy aggregators)
- Clinical RAG with DMCH-validated protocols
- BD drug formulary canonicalization
- PWA shell with QR onboarding + offline mode
- Vercel migration of frontend

### The Honesty Rule

In the pitch:
- *"Built on top of an existing avatar shell our team had previously created."*
- *"BuildFest contribution: the clinical multi-agent system, memory graph, prescription pipeline, doctor dashboard, edge inference layer, and Bangla localization."*

Never claim Veena was built in May–June. Judges respect honesty; punish overclaim.

---

## 16. Differentiation vs. MaaCare AI

| Axis | MaaCare AI | Our Companion |
|---|---|---|
| **User** | Mother only | Any patient, any condition |
| **Phase** | Pregnancy only | Full lifetime journey |
| **Memory model** | Knowledge graph (WHO/DGHS guidelines) | Knowledge graph **+ per-patient memory graph** |
| **Interaction** | SMS/IVR fallback | 3D avatar + voice + visual + offline-resilient |
| **Agent architecture** | Not specified | 11-agent MCP-orchestrated |
| **Inference topology** | Cloud-only implied | Hybrid cloud + Jetson edge device |
| **Clinical validation** | WHO standards | DMCH consultant + WHO + BD formulary |
| **KPIs** | Maternal-specific | Multi-condition: consult time, adherence, readmission |
| **Differentiation moat** | Knowledge depth | Continuity + interaction quality + journey breadth + offline |

---

## 17. Mandatory Compliance Checklist

- [ ] Lawful data sourcing — only what consent allows
- [ ] Anonymization for any aggregated/training data
- [ ] Bias mitigation in clinical RAG
- [ ] Transparent AI reasoning (every Rx extraction shows source photo)
- [ ] No misleading demos — every clinical claim grounded in DMCH-validated source
- [ ] Privacy by design — patient owns their record; raw symptoms processed locally before leaving device
- [ ] Explainability — doctor can always see why the avatar surfaced something
- [ ] Honest attribution — Veena is acknowledged as pre-existing, BuildFest contribution is the vertical specialization

---

## 18. Mandatory BuildFest Tech Stack Coverage

- ✅ **Vercel** (frontend hosting + edge functions)
- ✅ **Cursor / Claude Code** (development workflow, MD-driven architecture)
- ✅ **Supabase** (auth, Postgres, edge functions)
- ✅ **Cloud LLMs** (Claude reasoning + Gemini vision)
- ✅ **Local LLM** (Ollama with Llama 3.1 8B — first-class, not optional)
- ✅ **MCP** (Model Context Protocol across 11 agents)
- ✅ **RAG** (clinical guidelines + BD formulary + per-patient retrieval)
- ✅ **GraphDB** (Neo4j patient memory graph)
- ✅ **Vector DB** (PGVector embeddings)
- ✅ **Scrapers** (Playwright + Firecrawl + BeautifulSoup — DGDA, DGHS, WHO, pharmacy aggregators)
- ✅ **Personalization engine** (per-patient memory graph drives prompt context)
- ✅ **Bangla + localization** (Whisper STT + Piper TTS + Bangla UI)
- ✅ **Cloud-ready** (Supabase + Vercel scale globally)
- ✅ **Multimodal** (text + voice + vision + 3D avatar)
- ✅ **Edge deployment** (Jetson Orin Nano for hospital-side inference)

---

## 19. Team Asset Inventory

| Asset | Status | Reuse Target | Integration Cost |
|---|---|---|---|
| **Veena — 3D Unity WebGL Avatar** (Router/Responder/Animator pipeline, voice I/O, emotion triggers) | Built (pre-existing, owned by Labib) | Patient-facing intake + reminders + post-visit nudges across all stages | ~7–10 days (STT/TTS swap, Ollama wrap, MCP formalization, Vercel migration, vertical specialization) |
| **DMCH professional consultation** | Available | Clinical validation, protocol design, demo credibility, pilot access | Schedule meeting; bring Section 12 questions |

---

## 20. Naming — Locked

- **Product name:** **OmniCare**
- **Avatar character:** **Veena**
- **Working tagline:** *"The companion that follows the patient, not the file."*

**Why OmniCare:**
- *Omni* = every (every patient, every condition, every step of the journey)
- *Care* = clinical mission, not just an "app"
- Reads cleanly in Bangla and English; international scalability built into the name
- Reuses team brand continuity from earlier ideation

**Note:** This is a re-anchoring of an earlier concept by the same team. The previous OmniCare iteration (see `OmniCare.md`) coincidentally converged on MaaCare-shaped territory and was retired. This Project_Lock is the canonical OmniCare specification going forward — earlier docs are superseded.

---

## 21. Next Actions (Ordered)

### Pre-DMCH Meeting
1. **Schedule DMCH meeting** — bring Section 12 questions.
2. **Audit Veena's current state** — confirm Unity WebGL renders, voice I/O wiring, agent loop, performance on low-end browsers.
3. **Hardware inventory** — identify which team member's laptop has GPU sufficient for demo (RTX 3060+ or Apple M-series 16GB+).
4. **Scraper POC** — write a Playwright script that fetches the DGDA drug list. De-risks the data layer earliest.

### Post-DMCH Meeting
5. **Decide demo department** based on protocol cleanliness.
6. **Sketch patient memory graph schema** (nodes/edges/queries).
7. **Build prescription pipeline POC** (Vision LLM → BD formulary match) — most technically risky single piece.
8. **Lock demo persona script** (Rahima end-to-end story).
9. **Storyboard Veena intake flow** (department-specific question tree).
10. **Wireframe doctor dashboard.**
11. **Procure Jetson Orin Nano** if pilot is on the table.
12. **Begin full build.**

### Submission Milestones
13. **Preliminary submission deadline:** May 15, 2026 (3-min video pitch).
14. **BuildFest day:** June 12, 2026 — BRAC University.
