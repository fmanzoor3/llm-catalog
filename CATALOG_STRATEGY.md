# LLM Catalog — Strategy & Procedures

## Approach

We build a **static, manually curated** catalog. Every piece of data is verified against official sources. Quality over automation.

---

## Inclusion Criteria

Models are included if they meet ALL of:
- **API available** — must have programmatic access (not just chat UI)
- **Production ready** — generally available or public preview
- **Enterprise viable** — suitable for commercial use
- **Actively supported** — not deprecated or sunsetting within 60 days
- **Documented** — has published pricing and technical specs

## Excluded Models

| Model | Provider | Reason | Date |
|-------|----------|--------|------|
| GPT-5.3-Codex | OpenAI | API not available (CLI/IDE only) | Feb 9, 2026 |
| GPT-5.2 Instant | OpenAI | Too similar to GPT-5.2 Thinking | Feb 6, 2026 |
| o3/o4-mini deep-research | OpenAI | Specialized niche, would clutter catalog | Feb 6, 2026 |
| GLM-4.7 | Zhipu AI | US blacklisted entity, not viable for enterprise | Feb 9, 2026 |
| ERNIE 5.0 | Baidu | China-focused, no international API | Feb 9, 2026 |
| Gemma 3 | Google | Edge/mobile model, not enterprise API tier | Feb 9, 2026 |
| Amazon Nova | AWS | AWS-only, not general API model | Feb 9, 2026 |
| Phi-4 | Microsoft | Small model (14B), edge-focused | Feb 9, 2026 |
| Magistral Medium | Mistral | Incremental over Large 3, would clutter catalog | Feb 9, 2026 |

---

## Data Sourcing Strategies

### 1. Cross-Referencing for Model Discovery

Use comparison sites to find models we might be missing:

| Site | URL | Refresh rate |
|------|-----|-------------|
| Artificial Analysis | artificialanalysis.ai | ~72h |
| Arena.ai | arena.ai/leaderboard | Weekly |
| llm-stats.com | llm-stats.com | Weekly |

**Process:**
1. Check each site for models not in our catalog
2. Evaluate against inclusion criteria
3. If included, research from official sources and add via patch script
4. If excluded, add to the table above with reasoning

### 2. Bootstrapping New Model Data

When adding a new model, gather data efficiently:

1. **Start with Artificial Analysis** — get pricing, speed, TTFT, benchmarks in one place
2. **Cross-check with llm-stats.com** — compare benchmark scores
3. **Verify critical numbers** against official source (pricing page, API docs)
4. **Fill gaps** from provider documentation

**What to verify vs trust:**
- **Always verify:** Pricing, context window, max output tokens
- **Usually trust:** Benchmark scores from aggregators (they pull from published results)
- **Use as-is:** Speed/TTFT from Artificial Analysis (independently measured)

### 3. Source Verification Hierarchy

When data conflicts, trust in this order:
1. Official documentation (API docs, pricing pages)
2. Published research papers (arXiv, official blogs)
3. GitHub repositories (model cards, READMEs)
4. Independent benchmarks (Artificial Analysis, Arena.ai)
5. News articles
6. Marketing materials (lowest trust)

### 4. Provider Official Sources

| Provider | API Docs | Pricing |
|----------|----------|---------|
| OpenAI | platform.openai.com/docs/models | openai.com/api/pricing |
| Anthropic | platform.claude.com/docs | claude.com/pricing |
| Google | ai.google.dev/gemini-api/docs/models | ai.google.dev/pricing |
| DeepSeek | api-docs.deepseek.com | api-docs.deepseek.com/quick_start/pricing |
| Meta (Llama) | llama.com/models | N/A (self-hosted) |
| Alibaba (Qwen) | github.com/QwenLM | N/A (self-hosted) |
| Mistral | docs.mistral.ai | mistral.ai/pricing |
| xAI | docs.x.ai | x.ai/api |

---

## Content Guidelines

### Model Descriptions

The `description` field is a one-line summary shown on model cards.

**Rules:**
- Focus on what the model IS, not where it RANKS
- Avoid superlatives that age ("best", "most capable", "top-scoring")
- Avoid comparisons ("beats GPT-4o", "outperforms Claude")
- Include the model's distinctive capability or niche

**Good:**
- "Fast, cost-efficient model optimized for high-throughput tasks"
- "Extended thinking model for complex reasoning and math"
- "Open-source model with strong multilingual and code support"

**Bad:**
- "The most powerful model available today"
- "Beats all competitors on AIME 2025"

### Bullet Points (strengths)

The `strengths[]` array appears on the All Models page. See MAINTENANCE.md for formatting guidelines.

Key rules:
- **Intuitive** — real-world capabilities, not benchmark numbers
- **Format**: "Headline — supporting detail"
- **No benchmarks** — don't cite scores
- **3-5 per model**, each highlighting something distinct

---

## Scoring System

### How It Works

Each use case has a `scoringConfig` with weighted metrics. Models get a Capability score (0-100) based on:
1. Normalize each benchmark to 0-100 using min/max ranges
2. Apply per-use-case weights
3. Redistribute weight if a model is missing a metric
4. Apply completeness penalty if < 50% of data available

Value score = Capability / log2(blendedCost + 1), normalized.

### Current Use Case Weights

| Use Case | Key Metrics |
|----------|-------------|
| Coding | SWE-bench, Arena Coding, Aider, Context, Speed |
| Reasoning | AIME, GPQA, Arena Math, Arena Overall, Context |
| Chatbot | Arena Overall, Arena IF, Arena CW, Speed, Context |
| Data Analysis | GPQA, Arena Overall, Context, Speed, MMMLU |

Full config is in `data.js` under `scoringConfig`.

---

## Latency Metric

We show **Total Response Time** as the primary speed metric:

```
Total Response Time = TTFT + (100 / outputTokensPerSec)
```

This is the estimated time to receive a 100-token response, matching the methodology used by Artificial Analysis. It honestly reflects the user experience — especially for reasoning models where TTFT can be 20-90 seconds.

**Tiers:** Fast ≤ 2s, Medium ≤ 5s, Slower > 5s

The Compare page breaks this into three rows: Response Time, Output Speed, and Latency (TTFT).

---

## Log

- **Feb 26, 2026:** Project cleanup — deleted ~170 temp files, updated docs, rewrote MAINTENANCE.md
- **Feb 26, 2026:** Replaced Speed column with Total Response Time (Latency), added TTFT to modal
- **Feb 25, 2026:** Rewrote all model strengths as intuitive bullet points (no benchmarks)
- **Feb 19, 2026:** Added 9 new models, provider logos, hosting/availability column
- **Feb 9, 2026:** Implemented scoring engine, cross-referenced comparison sites, added 4 models
- **Feb 6, 2026:** Initial research — added o3-pro, Gemini 2.5 Flash-Lite, Qwen3-Omni
- **Feb 2, 2026:** Project created with initial model set

*Last updated: 2026-02-26*
