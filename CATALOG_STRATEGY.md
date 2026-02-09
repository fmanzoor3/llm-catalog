# LLM Catalog Strategy
**Started:** February 9, 2026

This is a living document tracking our strategies and methodologies for building and maintaining the LLM catalog. We add to it as we discover what works.

---

## Approach

We build a **static, manually curated** catalog. Every piece of data is verified against official sources. Quality over automation.

---

## Strategies

### 1. Cross-Referencing Comparison Sites for Model Discovery

**What:** Use popular LLM comparison/aggregator websites to discover which models are relevant, then evaluate them against our inclusion criteria.

**Why it works:**
- These sites are incentivized to be complete — their value depends on covering every relevant model
- Catches models from providers we might not be actively monitoring
- If a model appears on multiple independent sites, it's likely worth evaluating

**Sites to cross-reference:**

| Site | URL | Strengths |
|------|-----|-----------|
| Artificial Analysis | artificialanalysis.ai | 100+ models, pricing, benchmarks, speed — refreshed every 72h |
| Arena.ai | arena.ai/leaderboard | Human preference rankings via blind voting |
| llm-stats.com | llm-stats.com | Model comparisons, multiple benchmark leaderboards |

**Process:**
1. Visit each site and note which models they track
2. Compare against our `data/models.json`
3. For any model we're missing: check if it meets our inclusion criteria
4. If yes, research it from official sources and add it
5. If no, note why in the "Excluded Models" section below

**First used:** Feb 9, 2026. Found gaps: Grok 4 (xAI), GPT-OSS (OpenAI), GLM-4.6 (Zhipu), Amazon Nova (AWS).

---

### 2. Using Comparison Sites to Bootstrap Model Metrics

**What:** When adding a new model, use comparison/aggregator sites to quickly gather its specs, pricing, and benchmarks in one place — then verify the key numbers against official sources.

**Why it works:**
- These sites already aggregate data from multiple sources into a consistent format
- Saves time vs hunting through provider docs, blog posts, and GitHub READMEs separately
- Provides data points we might not think to look for (e.g., latency, throughput, lesser-known benchmarks)
- Cross-checking the same metric across two aggregator sites catches errors in either one

**What each site gives us per model:**

| Data Point | Artificial Analysis | llm-stats.com | OpenRouter |
|------------|-------------------|---------------|------------|
| Pricing (input/output) | Yes | Yes | Yes |
| Context window | Yes | Yes | Yes |
| Max output tokens | Yes | Yes | — |
| Benchmarks (AIME, GPQA, SWE-bench, etc.) | Yes (10+ evals) | Yes (multiple) | — |
| Speed (tokens/sec, TTFT) | Yes (measured independently) | Yes | Yes |
| Release date | Yes | Yes | — |
| Multimodal capabilities | Yes | Yes | — |
| Provider/license info | Yes | Yes | Yes |

**Process for adding a new model:**

1. **Start with llm-stats.com** — search for the model, get a quick overview of all specs and benchmarks in one page
2. **Cross-check with Artificial Analysis** — compare pricing and benchmarks; note any discrepancies
3. **Verify critical numbers against official source** — pricing from provider pricing page, context window from API docs, benchmark scores from published papers/model cards
4. **Fill in gaps** — if a data point is missing from aggregator sites, search the provider's docs directly

**What to verify vs what to trust:**
- **Always verify:** Pricing, context window, max output tokens (these change frequently and errors are costly)
- **Usually trust:** Benchmark scores (aggregators pull from published results), release dates
- **Use as-is:** Speed/latency metrics from Artificial Analysis (they measure independently — more reliable than provider claims)

**First used:** Feb 9, 2026. Used llm-stats.com and Artificial Analysis to gather Grok 4 specs — both sites agreed on pricing ($3/$15), context (256K), and AIME score (91.7%).

---

### 3. Data Verification via Automated Audit

**What:** Run `node audit-data.js` to catch inconsistencies between what we claim in recommendation text and what the actual model data says.

**Why it works:**
- We have data in multiple places (model specs, recommendation reasons, categoryDetails, provider descriptions) that can get out of sync
- Text like "92% AIME" in a recommendation reason won't auto-update when we correct the benchmark to 85.7%
- The audit script cross-checks all numerical claims against actual model fields

**What the audit catches:**
- AIME/SWE-bench percentages in reason text that don't match model benchmarks
- Context window claims (e.g., "400K context") that don't match model contextWindow
- Pricing references that don't match model pricing
- Model IDs in recommendations that don't exist
- Stale descriptions (e.g., "near-perfect AIME" when score is 79.8%)

**When to run:** After any data change to models.json or categoryDetails in index.html.

**First used:** Feb 9, 2026. Caught 10 errors including stale AIME scores, wrong context window claims, and outdated pricing in categoryDetails.

---

### 3. Official Source Verification Hierarchy

**What:** When verifying model data, trust sources in this order:

1. **Official documentation** (API docs, pricing pages) — highest trust
2. **Published research papers** (arXiv, official blogs)
3. **GitHub repositories** (model cards, READMEs)
4. **Independent benchmarks** (Artificial Analysis, Arena.ai)
5. **News articles** (tech press)
6. **Marketing materials** — lowest trust

**Why:** Marketing often exaggerates (e.g., "1T+ parameters" when actual is 235B). Official docs are the source of truth for pricing and specs.

**Provider official sources:**

| Provider | Docs | Pricing |
|----------|------|---------|
| OpenAI | platform.openai.com/docs/models | openai.com/api/pricing |
| Anthropic | platform.claude.com/docs | claude.com/pricing |
| Google | ai.google.dev/gemini-api/docs/models | ai.google.dev/pricing |
| DeepSeek | api-docs.deepseek.com | api-docs.deepseek.com/quick_start/pricing |
| Meta (Llama) | llama.com/models | N/A (self-hosted) |
| Alibaba (Qwen) | github.com/QwenLM | N/A (self-hosted) |
| Mistral | docs.mistral.ai | mistral.ai/pricing |

---

### 4. Dual Data Sync Awareness

**What:** Our page has TWO separate data systems that must stay in sync:
1. **`data/models.json`** → synced to embedded `modelData` in index.html (line ~862)
2. **`categoryDetails`** → hardcoded JavaScript object in index.html (lines ~1050-1330)

**Why this matters:** When we correct a model's benchmark score in models.json, the categoryDetails (Quick Comparison expanded rows) won't auto-update. Both must be manually corrected.

**Sync process:**
```bash
# After editing models.json, regenerate embedded data:
node -e "const fs=require('fs'); const d=JSON.parse(fs.readFileSync('data/models.json','utf8')); const m=JSON.stringify(d); const h=fs.readFileSync('index.html','utf8'); const lines=h.split('\n'); const idx=lines.findIndex(l=>l.trim().startsWith('const modelData =')); lines[idx]='    const modelData = '+m+';'; fs.writeFileSync('index.html',lines.join('\n'));"

# Then manually check categoryDetails for stale references
# Then run audit: node audit-data.js
```

**Discovered:** Feb 9, 2026. Gemini pricing and DeepSeek AIME scores were corrected in models.json weeks earlier but categoryDetails still showed old values.

---

### 5. Data-Driven Scoring for "Find Your LLM"

**What:** Replace hand-picked recommendations with computed scores. Each model gets a Capability score (0-100) and Value score (0-100) per use case, driven by weighted benchmark data.

**Why it works:**
- Rankings are quantifiable and transparent — users see exactly why a model ranks higher
- Scores auto-update when benchmark data changes (no stale hand-picked lists)
- Value score accounts for cost-effectiveness, not just raw performance
- Driver chips show which metrics drove the ranking

**Data sources used:**
- Arena.ai Elo rankings (Overall, Coding, Math, Creative Writing, Instruction Following, Longer Query)
- Vellum LLM Leaderboard (GPQA Diamond, AIME, SWE-bench, Aider Polyglot, MMMLU, MATH 500)
- Model specs (context window, multimodal, pricing)

**How scoring works:**

1. **Per use case, define weighted metrics** in `scoringConfig`:
   - Coding: SWE-bench (30%), Arena Coding (25%), Aider (15%), Context (15%), Speed (15%)
   - Reasoning: AIME (25%), GPQA (25%), Arena Math (20%), Arena Overall (15%), Context (15%)
   - Chatbot: Arena Overall (30%), Arena IF (25%), Arena CW (20%), Speed (15%), Context (10%)
   - etc.

2. **Normalize** each metric to 0-100 scale using known min/max ranges

3. **Weight redistribution**: If a model is missing a metric, redistribute its weight proportionally to available metrics

4. **Completeness penalty**: Models with <50% of weighted data available get score × (0.5 + completeness), preventing models with just context window + speed from ranking #1

5. **Value score** = Capability / log2(blendedCost + 1), normalized to 0-100. Self-hosted models get 90% of capability score as value.

6. **TOP PICK** is always the #1 ranked model by current sort mode

**Configuration:** `scoringConfig` in `data/models.json` — weights and normalization ranges per use case.

**First used:** Feb 9, 2026. Replaced hand-picked recommendations with scored rankings across all 8 use cases.

---

## Inclusion Criteria

Models are included if they meet ALL of:
- **API available** — must have programmatic access (not just chat UI)
- **Production ready** — generally available or public preview
- **Enterprise viable** — suitable for commercial use
- **Actively supported** — not deprecated or sunsetting within 60 days
- **Documented** — has published pricing and technical specs

## Excluded Models (with reasoning)

| Model | Provider | Reason for Exclusion | Date |
|-------|----------|---------------------|------|
| GPT-5.3-Codex | OpenAI | API not available (CLI/IDE only) | Feb 9, 2026 |
| GPT-5.2 Instant | OpenAI | Too similar to GPT-5.2 Thinking | Feb 6, 2026 |
| o3/o4-mini deep-research | OpenAI | Specialized niche, would clutter catalog | Feb 6, 2026 |
| GLM-4.7 | Zhipu AI | US blacklisted entity, not viable for enterprise | Feb 9, 2026 |
| ERNIE 5.0 | Baidu | China-focused, no international API | Feb 9, 2026 |
| Gemma 3 | Google | Edge/mobile model, not enterprise API tier | Feb 9, 2026 |
| Amazon Nova | AWS | AWS-only, not general API model | Feb 9, 2026 |
| Phi-4 | Microsoft | Small model (14B), edge-focused | Feb 9, 2026 |
| Magistral Medium | Mistral | Incremental over Large 3, would clutter catalog | Feb 9, 2026 |
| DeepSeek V4 | DeepSeek | Not yet released | Feb 6, 2026 |
| Llama 4 Behemoth | Meta | Not yet released | Feb 6, 2026 |
| Mistral Medium/Small 3 | Mistral | Large 3 covers the flagship; adds complexity | Feb 6, 2026 |

---

## Log

- **Feb 9, 2026:** Implemented data-driven scoring engine for "Find Your LLM" — added Arena.ai Elo scores (6 categories) and Vellum benchmarks to all 29 models, built weighted scoring per use case with completeness penalty, replaced hand-picked recommendations with computed Capability + Value scores with score bars and driver chips
- **Feb 9, 2026:** Applied cross-referencing strategy — added Grok 4, Grok 4.1 Fast, GPT-OSS 120B, Kimi K2.5 (4 new models, 2 new providers: xAI, Moonshot). Updated recommendations and categoryDetails. Excluded 6 models with reasoning.
- **Feb 9, 2026:** Documented cross-referencing strategy, metrics bootstrapping strategy, audit process, source hierarchy, dual data sync issue
- **Feb 6, 2026:** Initial research completed. Added o3-pro, Gemini 2.5 Flash-Lite, Qwen3-Omni to catalog
