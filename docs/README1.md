# Legal Document AI Workflow

An internal workflow that ingests messy legal-style documents, extracts structured
data, retrieves grounded evidence (RAG), generates draft outputs with mandatory
inline citations, and **learns from operator edits** to improve future drafts via
clustering, A/B counterfactual measurement, and automatic rule retirement.

## Quick Start

### 1. Prerequisites
- Python 3.10+
- A Google Gemini API key

### 2. Setup
```bash
pip install -r requirements.txt
cp .env.example .env
# Edit .env and set GEMINI_API_KEY
```

### 3. Model selection — important for reviewers

By default, all Gemini calls use **`gemini-2.5-flash`**. The architecture is
identical regardless of which Gemini variant you wire up; we default to
`gemini-2.5-flash` because it works on the standard free-tier developer key.

The original design intent was **`gemini-3-flash-preview`** (the most recent flash
model at the time of writing). If you have a paid tier or a key with higher daily
quota, switch by uncommenting the override block in `.env`:

```dotenv
VISION_MODEL_NAME=gemini-3-flash-preview
DRAFT_MODEL_NAME=gemini-3-flash-preview
EVAL_MODEL_NAME=gemini-3-flash-preview
```

The free tier on `gemini-3-flash-preview` is currently 20 requests per day, which
is not enough to run the demo end-to-end. The demo emits roughly 12–18 Gemini calls
on a cold cache; `gemini-2.5-flash` is the safer default for first-time runs.

### 4. Run the basic pipeline
```bash
python main.py
```
Processes a synthetic messy lease image, indexes it, generates a draft with
citations, and runs a single operator-edit cycle.

### 5. Run the full improvement-loop demo
```bash
python -m scripts.demo_full_loop > sample_outputs.md
```
Same pipeline run twice — once before any operator edits and once after two
edits drive a cluster + rule promotion + A/B counterfactual. Writes the
v1-vs-v2 judge-score comparison and the per-rule A/B delta to `sample_outputs.md`.
A committed copy of a real run is included in the repo so reviewers can read it
without needing to spend their own quota.

The demo includes a 429-aware retry wrapper around the Gemini client and uses
on-disk caches keyed by stable hashes of inputs, so partial reruns reuse work.

### 5.5. Robustness — extraction cascade

The document processor is a three-tier cascade designed to handle inputs of
varying quality:

1. **Tier A — Gemini Vision** (primary). Self-rates `confidence` and
   `is_legible`. The prompt explicitly forbids fabricating chunks for
   unreadable input.
2. **Tier B — Preprocessed Vision.** If Tier A reports low confidence,
   the image is run through `PIL.ImageOps.autocontrast` → grayscale →
   `MedianFilter(3)` and re-submitted.
3. **Tier C — PaddleOCR + text-only Gemini.** If preprocessing doesn't
   recover the input, PaddleOCR (a non-LM CNN/transformer trained on
   document images) extracts text, then a text-only Gemini call structures
   it into `DocumentStructuredData`. Two genuinely different failure
   surfaces stacked.
4. **Graceful degrade.** If all three tiers fail, the processor returns
   `extraction_status="failed"`. The drafter sees this flag and refuses
   to draft a fabricated response, returning instead: *"Cannot generate
   draft — source document could not be reliably extracted..."*

See Section 8 of `sample_outputs.md` for the cascade running against
clean / degraded / smudged variants of the same lease.

**PaddleOCR note:** `paddleocr` is ~700MB plus model weights downloaded on
first run. On Linux/macOS it pulls `paddlepaddle` as a transitive dep; on
Windows it uses an ONNX backend instead. If you'd rather skip Tier C
entirely, set `DISABLE_OCR_FALLBACK=1` in `.env` — the cascade will go
A → B → degrade, skipping Tier C.

### 6. Run tests
```bash
pytest tests/ -v
```
41 tests covering each learning module in isolation, the orchestrator
integration test, and the three-tier extraction cascade. All Gemini and
PaddleOCR calls in tests are mocked.

## Architecture (one-liner per module)

| Module | Purpose |
|---|---|
| `src/doc_processor.py` | Gemini Vision + Pydantic schema → structured chunks |
| `src/retriever.py` | ChromaDB + Gemini embeddings (`RETRIEVAL_DOCUMENT` for indexing, `RETRIEVAL_QUERY` for queries) |
| `src/drafter.py` | Gemini Flash drafting with mandatory `[chunk_id]` inline citations; loads per-doc-type guidelines |
| `src/evaluator.py` | LLM-as-judge: retrieval relevance + per-claim hallucination check; `score_draft` returns a `[0,1]` grounded-support ratio |
| `src/improvement_loop.py` | Thin orchestrator over `src/learning/*` |
| `src/learning/edit_store.py` | Append-only JSONL persistence (Pydantic models) |
| `src/learning/pattern_extractor.py` | Gemini call #1: extracts a candidate pattern from a single edit + embeds it |
| `src/learning/clusterer.py` | Hybrid cluster (doc_type bucket → cosine ≥ 0.75) + Gemini call #2 to synthesize a generalized rule |
| `src/learning/ab_evaluator.py` | A/B counterfactual: judge score *with rule* vs *with rule held out*; per-rule delta logged |
| `src/learning/retirement.py` | Retires rules whose rolling mean A/B delta over K=5 runs is ≤ 0 |

See [architecture.md](architecture.md) for design rationale and tradeoffs.

## Improvement loop — what makes it "real"

The brief explicitly warns against a "side-by-side version diff" loop. Concrete
differences:

1. **Persistence with audit.** Every edit is logged to `data/learning/edits.jsonl`,
   every candidate to `rule_candidates.jsonl`, every A/B run to `rule_scores.jsonl`.
   Reviewable, replayable, greppable.
2. **Clustering before promotion.** A single edit does not promote a rule. Two
   edits within the same doc_type and cosine ≥ 0.75 trigger a second Gemini call
   that *synthesizes* one generalized rule from both candidates.
3. **Causal measurement.** Each promoted rule is A/B-evaluated — the drafter is run
   with and without that single rule, the judge scores both drafts, and the delta
   is logged. This is the rubric-required "future drafts improve meaningfully"
   evidence. The metric measures grounded-support, not formatting (see "Honest
   limitations" below).
4. **Self-cleaning.** Rules whose rolling mean delta over the last 5 A/B runs is
   ≤ 0 are moved from `guidelines/<doc_type>.txt` to `retired_rules.jsonl`.

## Testing

- Unit tests under `tests/test_learning/` cover each learning module in isolation
  with the Gemini client mocked.
- Integration test under `tests/test_pipeline.py` covers the orchestrator wiring
  with all Gemini calls mocked.
- Live-API verification is the `scripts/demo_full_loop.py` script. The committed
  `sample_outputs.md` is the artifact.

## Honest limitations

- **Document processor takes a single PIL-readable image.** Multi-page PDFs
  still need to be split first (a per-page chunking pre-step; out of scope).
  However, robustness on degraded inputs has been addressed — see the
  "Extraction cascade" section above.
- **Synthetic mock data.** `src/generate_mock_data.py` renders a clean lease via
  PIL and adds light pixel noise. Adequate for demo wiring; not a stress test of
  real-world OCR robustness. We attempted Kaggle datasets
  (`scratch/test_pipeline_kaggle.py`, `data/kaggle_docs/`) but **hit Gemini
  free-tier daily rate limits before the run completed**. The multimodal approach
  is expected to handle them but has not been verified on this account.
- **The judge metric measures grounding, not formatting.** `score_draft` returns
  `(# claims supported by their cited chunks) / (# total claims)`. A formatting
  rule that doesn't change which chunks are cited will produce a per-rule A/B
  delta of 0 — visible in the committed `sample_outputs.md`. A second
  formatting-aware metric is documented as future work in
  [architecture.md](architecture.md).
- **Cluster threshold (0.75) and retirement window (K=5) are uncalibrated.** The
  threshold was tuned during the demo run to ensure paraphrased patterns cluster
  reliably with only two sample edits. Production would tune both empirically with
  real edit volume.
- **No web UI.** The improvement loop is exercised via Python entry points.
- **No live-API tests in CI.** All tests mock Gemini.
