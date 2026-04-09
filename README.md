# LLM Catalog

An internal reference tool for exploring, comparing, and selecting Large Language Models (LLMs) for Enerjisa projects. The catalog ranks 48 models across 15 providers using a weighted blend of community ratings and benchmark data, tailored per use case.

## Quick Start

This is a fully static site with no build step.

```bash
# Clone the repo
git clone <repo-url>
cd "LLM Catalog"

# Open directly in a browser
start index.html      # Windows
open index.html       # macOS
```

That's it. No `npm install`, no server, no build. The site loads `data.js` via a `<script>` tag and runs entirely in the browser.

> For local development with live reload, any static file server works (e.g. `npx serve`, VS Code Live Server extension, or Python's `http.server`).

## Tech Stack

**Frontend**
- HTML5, CSS3, vanilla JavaScript (ES6+)
- No framework, no bundler, no build step
- Google Fonts (Inter)
- CSS custom properties for theming

**Backend**
- None. The site is fully static.
- All model and provider data is embedded in `data.js` and loaded at page load.

**Data Layer**
- `data.js` — single JavaScript file exporting a `modelData` object. Acts as the source of truth. Not a database, not an API.
- Edited via Node.js patch scripts.

## Project Structure

```
LLM Catalog/
├── index.html                   # Main entry — Find Your LLM
├── models.html                  # All models browser
├── providers.html               # Provider directory
├── compare.html                 # Side-by-side model comparison
├── resources.html               # Scoring methodology & references
├── research-scoring.html        # Deep-dive: how scoring works
├── research-platforms.html      # Deep-dive: deployment platforms
│
├── data.js                      # SOURCE OF TRUTH — all model/provider data
├── app.js                       # Shared logic (modals, formatting, i18n)
├── engine.js                    # Scoring engine (weighted benchmarks)
├── translations.js              # English/Turkish translation strings
├── styles.css                   # All styles
│
├── logos/                       # Provider logo images
│
├── README.md                    # This file
└── package.json                 # Dev dependencies only
```

## Pages

| Page | Purpose |
|------|---------|
| **Find Your LLM** (`index.html`) | Pick a use case (coding, reasoning, chatbot, etc.) and see models ranked by a weighted score. Filters for cost, hosting, and context window. |
| **All Models** (`models.html`) | Browse every model in the catalog with key specs visible at a glance. |
| **Providers** (`providers.html`) | Directory of all providers (OpenAI, Anthropic, Google, etc.) with their model lineups. |
| **Compare** (`compare.html`) | Side-by-side comparison of up to 4 models. Accepts URL params: `?models=gpt-5.4,claude-opus-4.6`. |
| **Resources** (`resources.html`) | Scoring methodology reference and community links. |
| **Research: Scoring** (`research-scoring.html`) | Detailed explanation of the scoring algorithm, weights, and normalization ranges. |
| **Research: Platforms** (`research-platforms.html`) | Overview of deployment platforms (Azure OpenAI, Bedrock, Vertex AI, etc.). |

## Key Features

### Scoring Engine

The core of the catalog. For each use case, `engine.js` computes two scores per model:

- **Capability score (0-100)** — quality-focused, based on weighted benchmarks and community ratings
- **Value score** — capability per dollar, calculated as `Capability / log2(blendedCost + 1)`

**How it works:**
1. Each use case has a `scoringConfig` in `data.js` defining which benchmarks matter and their weights (e.g. coding weighs SWE-bench, Arena Coding, Aider, context window)
2. Each benchmark is normalized to 0-100 using fixed min/max ranges
3. Weights are applied and summed
4. If a model is missing a metric, its weight is redistributed across the remaining metrics
5. A completeness penalty is applied if less than 50% of metrics are available

Use cases: `coding`, `reasoning`, `chatbot`, `documents`, `content`, `extraction`, `translation`, `vision`.

See [research-scoring.html](research-scoring.html) for a full breakdown.

### Auto-Update (planned)

A future enhancement to automate the monthly update process. The goal is to cross-reference external sources (Artificial Analysis, LMArena, llm-stats.com, provider blogs) and flag new models, updated benchmarks, and pricing changes for review.

Currently, updates are done manually using Node.js patch scripts.

## Adding or Updating Models

Model and provider data lives in `data.js`. A dedicated admin page is planned to make adding, editing, and removing models accessible without touching code — including form-based entry, validation, and preview.
