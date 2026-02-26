# LLM Catalog — Maintenance Guide

## Architecture

A static, manually curated website. No build step — open `index.html` in a browser.

```
LLM Catalog/
├── index.html          ← Find Your LLM page (main entry)
├── models.html         ← All Models page
├── providers.html      ← All Providers page
├── compare.html        ← Side-by-side comparison (URL params: ?models=id1,id2)
├── resources.html      ← Learning resources & community links
├── research-scoring.html    ← How scoring works (internal reference)
├── research-platforms.html  ← Deployment platforms guide
├── data.js             ← SOURCE OF TRUTH — all model/provider data
├── app.js              ← Shared application logic (scoring, formatting, modals)
├── engine.js           ← Scoring engine (weighted benchmarks per use case)
├── styles.css          ← All styles
├── logos/              ← Provider logo images
├── screenshots/        ← Portfolio screenshots (numbered, for sharing)
├── MAINTENANCE.md      ← This file
├── CATALOG_STRATEGY.md ← Data sources, procedures, inclusion criteria
└── RESEARCH_NOTES.md   ← Detailed research notes per model
```

### How data flows

`data.js` exports a single `const modelData = {...}` object containing:
- `models[]` — array of 38 model objects with specs, benchmarks, pricing, descriptions
- `providers{}` — provider metadata (display names, logos, descriptions)
- `scoringConfig{}` — per-use-case benchmark weights and normalization ranges
- `lastUpdated`, `dataSources` — metadata

Every HTML page loads `data.js` via `<script src="data.js">`. The `app.js` and `engine.js` scripts read from `modelData` at runtime — no JSON parsing, no fetch calls.

### Editing data.js

`data.js` is a single minified line. Do NOT edit it by hand. Use Node.js patch scripts:

```js
// Example: add a field to a model
const fs = require('fs');
let src = fs.readFileSync('data.js', 'utf8');
// Find the model by ID, manipulate the string, write back
fs.writeFileSync('data.js', src);
```

After editing, verify with:
```js
eval(src.replace('const ', 'var '));
console.log(modelData.models.length); // should be 38
```

---

## Key Metrics

### Latency (Total Response Time)
The "Latency" column on the Find Your LLM page shows **Total Response Time** — the estimated time to receive a 100-token response:

```
Total Response Time = TTFT + (100 / outputTokensPerSec)
```

- **TTFT** (Time to First Token): seconds before the model starts responding
- **outputTokensPerSec**: tokens generated per second once streaming starts
- Source: [Artificial Analysis](https://artificialanalysis.ai)

**Speed tiers:**
- Fast: ≤ 2s
- Medium: ≤ 5s
- Slower: > 5s

### Scoring Engine
Each model gets a Capability score (0-100) and Value score per use case, computed from weighted benchmarks. Configuration lives in `modelData.scoringConfig`. See `engine.js` for the algorithm and `research-scoring.html` for documentation.

---

## Monthly Update Checklist

### 1. Check for new models

**Cross-reference these sites against our catalog:**

| Site | What to check |
|------|---------------|
| [Artificial Analysis](https://artificialanalysis.ai/leaderboards/models) | New models in their leaderboard |
| [Arena.ai](https://arena.ai/leaderboard) | New entries in human preference rankings |
| [llm-stats.com](https://llm-stats.com) | Model comparisons we might be missing |

**Check provider blogs:**
- [OpenAI Blog](https://openai.com/blog/)
- [Anthropic News](https://www.anthropic.com/news)
- [Google AI Blog](https://blog.google/technology/ai/)
- [DeepSeek GitHub](https://github.com/deepseek-ai)
- [Meta AI Blog](https://ai.meta.com/blog/)
- [Mistral Blog](https://mistral.ai/news/)

Evaluate new models against inclusion criteria (see CATALOG_STRATEGY.md).

### 2. Update benchmark scores

**Where to find each data point:**

| Data | Primary source | Secondary source |
|------|---------------|-----------------|
| AIME, GPQA, SWE-bench, MATH 500, MMMLU | [Vellum LLM Leaderboard](https://www.vellum.ai/llm-leaderboard) | [Artificial Analysis](https://artificialanalysis.ai) |
| Arena Elo (Overall, Coding, Math, etc.) | [LMArena](https://lmarena.ai/) | [Arena.ai](https://arena.ai/leaderboard) |
| Output speed (tok/s), TTFT | [Artificial Analysis](https://artificialanalysis.ai) | — |
| Pricing (input/output per 1M tokens) | Official provider pricing pages | [Artificial Analysis](https://artificialanalysis.ai) |
| Context window, max output | Official API docs | [Artificial Analysis](https://artificialanalysis.ai) |
| Aider Polyglot (coding) | [aider.chat/leaderboard](https://aider.chat/docs/leaderboards/) | — |

### 3. Verify pricing

Check official pricing pages — these change frequently:
- [OpenAI](https://openai.com/api/pricing/)
- [Anthropic](https://www.anthropic.com/pricing)
- [Google](https://ai.google.dev/pricing)
- [DeepSeek](https://api-docs.deepseek.com/quick_start/pricing)
- [Mistral](https://mistral.ai/pricing)
- [xAI](https://x.ai/api)

### 4. Review aging descriptions

Some model descriptions contain claims that will become stale (e.g., "most capable", "top-scoring"). When updating data, scan the `description` and `strengths` fields for superlatives and update if they're no longer accurate.

**Guidelines for descriptions:**
- Focus on what the model IS, not where it RANKS
- Good: "Optimized for speed and cost efficiency with strong multilingual support"
- Bad: "The fastest model available, beating all competitors on AIME"

### 5. Update metadata

After making changes, update `lastUpdated` and `dataSources.lastVerified` in `data.js`.

### 6. Test

Open each page in a browser and verify:
- [ ] Index page loads, models display correctly
- [ ] Sorting and filtering work
- [ ] Model modal opens with correct data
- [ ] Compare page works (try `?models=claude-sonnet-4.6,gpt-4o`)
- [ ] All Models and All Providers pages render

---

## Adding a New Model

1. **Research the model** using the data sources above
2. **Write a patch script** to add the model object to `data.js`:
   - Required fields: `id`, `name`, `provider`, `costTier`, `contextWindow`, `maxOutputTokens`, `pricingInput`, `pricingOutput`, `outputTokensPerSec`, `ttft`, `description`, `strengths[]`, `benchmarks{}`, `availability{}`
3. **Run the patch script**: `node patch-new-model.js`
4. **Update scoring config** if the model introduces a new benchmark range
5. **Add provider logo** to `logos/` if it's a new provider
6. **Test** all pages

### Bullet points (strengths) guidelines

The `strengths` array appears on the All Models page as bullet points. Keep them:
- **Intuitive** — describe real-world capabilities, not benchmark numbers
- **Format**: "Headline — supporting detail" (use em dash)
- **No benchmarks** — don't say "92% on SWE-bench", say "Top-tier code generation"
- **3-5 bullets** per model
- **Unique** — each bullet should highlight something distinct about the model

Good example:
```
"strengths": [
  "Advanced reasoning — handles multi-step logic and research tasks",
  "Strong code generation — excels at complex software engineering",
  "Extended thinking — can show step-by-step reasoning process"
]
```

Bad example:
```
"strengths": [
  "92% on SWE-bench Verified",
  "Best model for coding",
  "1M token context window"
]
```

---

## Compare Page

URL format: `compare.html?models=id1,id2,id3` (up to 4 models)

The compare page shows three speed-related rows:
- **Response Time** — Total Response Time (best = lowest)
- **Output Speed** — Raw tok/s (best = highest)
- **Latency (TTFT)** — Time to first token (best = lowest)

---

*Last updated: 2026-02-26*
