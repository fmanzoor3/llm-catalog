# LLM Catalog Research Notes
**Date:** February 6, 2026
**Purpose:** Document research methodology and findings for updating the LLM Selection Guide

---

## Research Methodology

### 1. Inclusion Criteria
Models are included in our catalog if they meet ALL of the following:
- **API Available**: Must have programmatic API access (not just chat interfaces)
- **Production Ready**: Generally available or in public preview (not private beta)
- **Enterprise Viable**: Suitable for commercial/industry use
- **Active Support**: Not deprecated or scheduled for imminent shutdown

### 2. Exclusion Criteria
Models are excluded if they:
- Only available through chat interfaces (e.g., GPT-5.3-Codex - CLI/IDE only, API "coming soon")
- Are distilled/smaller variants for edge devices only
- Are deprecated or shutting down within 60 days
- Lack documentation or pricing information

### 3. Search Strategy
For each provider, I used targeted searches combining:
- Provider name + "API" + "models" + "2026"
- Specific model names when known
- "pricing" + "documentation" to verify commercial availability

### 4. Cross-Referencing Strategy: Using Comparison Sites as Discovery Sources

**The idea:** Rather than only checking each provider's blog for new releases, we cross-reference popular LLM comparison/aggregator websites to see which models they track. If a model appears on multiple comparison sites but is missing from our catalog, it's a signal we should evaluate it for inclusion.

**Why this works:**
- Comparison sites are incentivized to track every relevant model — their value depends on completeness
- They often pick up new models faster than we can monitor every provider individually
- Seeing which models multiple independent sites agree on helps filter signal from noise
- It catches models from providers we might not be actively monitoring (e.g., xAI/Grok, Zhipu/GLM)

**Reference sites for cross-referencing:**

| Site | URL | What It Tracks | Update Frequency |
|------|-----|----------------|------------------|
| **Artificial Analysis** | [artificialanalysis.ai](https://artificialanalysis.ai/leaderboards/models) | 100+ models with pricing, benchmarks, speed metrics | Every 72 hours |
| **Arena.ai** (formerly LMArena) | [arena.ai/leaderboard](https://arena.ai/leaderboard) | Human preference rankings via blind voting | Continuous |
| **llm-stats.com** | [llm-stats.com](https://llm-stats.com) | Model comparisons, multiple benchmark leaderboards | Regularly |

**How to use this strategy:**

1. **Periodically visit** the comparison sites above (monthly or when doing updates)
2. **Compare their model lists** against our `data/models.json`
3. **Identify gaps** — models they track that we don't have
4. **Evaluate each gap** against our inclusion criteria (API available, production ready, enterprise viable, not deprecated)
5. **Add qualifying models** to our catalog with proper verification from official sources
6. **Document excluded models** in the "Models NOT to Add" section with reasoning

**Example findings (Feb 2026):**
Cross-referencing revealed these models appear on multiple comparison sites but are absent from our catalog:
- **Grok 4 / 4.1** (xAI) — Arena.ai #3, Artificial Analysis, llm-stats
- **GPT-OSS 120B / 20B** (OpenAI) — Artificial Analysis, llm-stats
- **GLM-4.6** (Zhipu AI) — llm-stats
- **Gemma 3** (Google) — Artificial Analysis
- **Amazon Nova** series (AWS) — Artificial Analysis
- **Magistral Medium** (Mistral) — Artificial Analysis

Each should be evaluated against our inclusion criteria before adding.

**Key principle:** These sites are discovery tools, not sources of truth. Always verify model details (pricing, specs, benchmarks) against official provider documentation before adding to our catalog.

---

## Research Findings by Provider

### OpenAI (8 searches conducted)

**Sources:**
- [OpenAI API Models](https://platform.openai.com/docs/models)
- [Model Release Notes](https://help.openai.com/en/articles/9624314-model-release-notes)
- [OpenAI API Changelog](https://platform.openai.com/docs/changelog)
- [OpenAI Pricing](https://openai.com/api/pricing/)

**Current API Models Found:**

| Model | API ID | Release | Context | Status |
|-------|--------|---------|---------|--------|
| GPT-5.2 Pro | gpt-5.2-pro | Dec 2025 | 400K | Available (Responses API) |
| GPT-5.2 Thinking | gpt-5.2 | Dec 2025 | 400K | Available |
| GPT-5.2 Instant | gpt-5.2-chat-latest | Dec 2025 | 400K | Available |
| GPT-5.2-Codex | gpt-5.2-codex | Jan 2026 | 400K | Available (Responses API) |
| GPT-5.1 | gpt-5.1 | Sep 2025 | 400K | Available |
| GPT-4.1 | gpt-4.1 | Apr 2025 | 1M | Available |
| o3 | o3 | Apr 2025 | 200K | Available |
| o3-pro | o3-pro | ~Jan 2026 | 200K | **NEW - Available** |
| o4-mini | o4-mini | Apr 2025 | 200K | Available |
| GPT-4o | gpt-4o | May 2024 | 128K | Available (deprecating in ChatGPT Feb 13) |

**NEW Models to Add:**
1. **o3-pro** - Enhanced reasoning with more compute, $20/$80 per M tokens (87% cheaper than o1-pro)
2. **GPT-5.2 Instant** - Fast variant of GPT-5.2 for chat applications
3. **o3-deep-research** - Specialized for deep analysis tasks
4. **o4-mini-deep-research** - Budget deep research variant

**Decision:**
- ADD o3-pro (significant new capability, API available, clear use case)
- SKIP GPT-5.2 Instant (too similar to GPT-5.2 Thinking for our catalog)
- SKIP deep-research variants (specialized niche, would clutter catalog)
- SKIP GPT-5.3-Codex (API not yet available - only CLI/IDE/web interface)

---

### Anthropic/Claude (5 searches conducted)

**Sources:**
- [Claude API Models Overview](https://platform.claude.com/docs/en/about-claude/models/overview)
- [Anthropic Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- [CNBC: Claude Opus 4.6 Launch](https://www.cnbc.com/2026/02/05/anthropic-claude-opus-4-6-vibe-working.html)

**Current API Models Found:**

| Model | Release | Context | Pricing (in/out per M) | Status |
|-------|---------|---------|------------------------|--------|
| Claude Opus 4.6 | Feb 5, 2026 | 1M (beta) | $5/$25 | Available |
| Claude Opus 4.5 | Feb 2025 | 200K | $15/$75 | Available |
| Claude Sonnet 4.5 | Oct 2025 | 200K | $3/$15 | Available |
| Claude Haiku 4.5 | Oct 2025 | 200K | $0.80/$4 (updated from $1/$5) | Available |

**Verification:**
- Pricing confirmed: Haiku 4.5 is $0.80/$4.00 (not $1/$5 as some sources state)
- Opus 4.6 features: Agent teams, PowerPoint add-in, 1M context beta, adaptive thinking

**Decision:**
- Current catalog is COMPLETE for Anthropic
- No new models to add
- Minor pricing correction needed for Haiku 4.5

---

### Google/Gemini (6 searches conducted)

**Sources:**
- [Gemini API Models](https://ai.google.dev/gemini-api/docs/models)
- [Gemini API Release Notes](https://ai.google.dev/gemini-api/docs/changelog)
- [Gemini 3 Developer Guide](https://ai.google.dev/gemini-api/docs/gemini-3)
- [Vertex AI Models](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models)

**Current API Models Found:**

| Model | API ID | Release | Context | Status |
|-------|--------|---------|---------|--------|
| Gemini 3 Pro Preview | gemini-3-pro-preview | Jan 2026 | 1M | Available (Preview) |
| Gemini 3 Flash Preview | gemini-3-flash-preview | Dec 2025 | 1M | Available (Preview) |
| Gemini 2.5 Pro | gemini-2.5-pro | Mar 2025 | 1M | Available |
| Gemini 2.5 Flash | gemini-2.5-flash | Apr 2025 | 1M | Available |
| Gemini 2.5 Flash-Lite | gemini-2.5-flash-lite | 2025 | 1M | **NEW - Available** |

**Deprecations:**
- gemini-2.5-flash-image-preview: Shut down Jan 15, 2026
- Gemini 2.0 Flash/Flash-Lite: Retiring Mar 31, 2026

**Key Features Found:**
- Gemini 3 Pro/Flash: Computer Use capability
- thinking_level parameter for reasoning control
- media_resolution parameter (low/medium/high/ultra_high) for vision tasks

**Decision:**
- ADD Gemini 2.5 Flash-Lite (budget option, good for high-volume)
- Current Gemini 3 entries are accurate
- Update Gemini 3 Flash description (now in preview, not just "latest default")

---

### DeepSeek (5 searches conducted)

**Sources:**
- [DeepSeek API Docs](https://api-docs.deepseek.com/)
- [DeepSeek V3 GitHub](https://github.com/deepseek-ai/DeepSeek-V3)
- [DeepSeek R1 GitHub](https://github.com/deepseek-ai/DeepSeek-R1)
- Multiple news sources on V4 announcement

**Current API Models:**

| Model | API ID | Status |
|-------|--------|--------|
| DeepSeek V3.2 (chat) | deepseek-chat | Available |
| DeepSeek V3.2 (reasoner) | deepseek-reasoner | Available |
| DeepSeek R1 | (via deepseek-reasoner) | Available |

**Upcoming:**
- **DeepSeek V4**: Expected mid-February 2026 (~Feb 17, Lunar New Year)
  - Focused on coding optimization
  - 1M+ token context via Sparse Attention
  - "Engram" memory architecture
  - Expected to be open-source
  - NOT YET RELEASED - do not add

**Decision:**
- Current catalog is accurate
- V4 is NOT released yet - do not add until API available
- Monitor for V4 release around Feb 17, 2026

---

### Open Source: Meta Llama (4 searches conducted)

**Sources:**
- [Llama 4 Official](https://www.llama.com/models/llama-4/)
- [Meta AI Blog: Llama 4](https://ai.meta.com/blog/llama-4-multimodal-intelligence/)
- [HuggingFace Llama 4 Scout](https://huggingface.co/meta-llama/Llama-4-Scout-17B-16E)
- [IBM watsonx.ai Announcement](https://www.ibm.com/new/announcements/meta-llama-4-maverick-and-llama-4-scout-now-available-in-watsonx-ai)

**Models Available:**

| Model | Parameters | Context | Multimodal | API Access |
|-------|------------|---------|------------|------------|
| Llama 4 Scout | 17B active / 109B total (16 experts) | 10M | Yes | Self-host, Together AI, Fireworks, IBM watsonx |
| Llama 4 Maverick | 17B active / 400B total (128 experts) | 1M | Yes | Self-host, Together AI, Fireworks, IBM watsonx |

**NEW: Llama API (Preview)**
- Meta announced official Llama API in limited preview
- Collaboration with Cerebras and Groq for fast inference
- Early experimental access available by request

**Upcoming:**
- **Llama 4 Behemoth**: 2T parameter model announced at LlamaCon, not yet released

**Decision:**
- Current catalog is accurate for Llama 4 Scout and Maverick
- Note: Llama API preview exists but is limited access
- Do not add Behemoth until released

---

### Open Source: Alibaba Qwen (4 searches conducted)

**Sources:**
- [Qwen GitHub](https://github.com/QwenLM/Qwen3)
- [Qwen3-Omni GitHub](https://github.com/QwenLM/Qwen3-Omni)
- [Alibaba Cloud Model Studio](https://www.alibabacloud.com/help/en/model-studio/models)
- [Qwen Blog: Qwen3](https://qwenlm.github.io/blog/qwen3/)

**Models Available:**

| Model | Parameters | Features | API Access |
|-------|------------|----------|------------|
| Qwen3 (dense) | 0.6B to 32B | Text | Alibaba Cloud, HuggingFace |
| Qwen3 (MoE) | 30B-A3B, 235B-A22B | Text, hybrid thinking | Alibaba Cloud, HuggingFace |
| Qwen3-Omni | 8B | Text, audio, image, video, speech output | Alibaba Cloud, HuggingFace |
| Qwen3-Omni-Flash | varies | Hybrid thinking mode | Alibaba Cloud |

**Key Updates:**
- Qwen3-2507 variants (Jul 2025): Instruct and Thinking modes
- Qwen3-Omni: Released Sep 22, 2025 under Apache 2.0
- Supports 49 voices (flash-2025-12-01 version)

**Decision:**
- ADD Qwen3-Omni as separate entry (true multimodal with speech generation)
- Update Qwen3 description with 235B-A22B details
- Note: The "1T+ params" figure from earlier searches may be marketing - actual is 235B total with 22B active

---

### Open Source: Mistral (4 searches conducted)

**Sources:**
- [Mistral Large 3 Docs](https://docs.mistral.ai/models/mistral-large-3-25-12)
- [HuggingFace Mistral Large 3](https://huggingface.co/mistralai/Mistral-Large-3-675B-Instruct-2512)
- [Mistral AI Pricing](https://mistral.ai/pricing)
- [Mistral 3 Announcement](https://mistral.ai/news/mistral-3)

**Models Available:**

| Model | Parameters | Context | Release | API Access |
|-------|------------|---------|---------|------------|
| Mistral Large 3 | 675B total / 41B active (MoE) | 128K | Dec 4, 2025 | Mistral API, AWS Bedrock, self-host |
| Mistral Medium 3 | ~70B | 128K | 2025 | Mistral API |
| Mistral Small 3 | ~22B | 128K | 2025 | Mistral API |

**Key Details:**
- Mistral Large 3: Trained on 3000 H200s
- Released under Apache 2.0
- Multimodal (text + images)

**Decision:**
- Keep Mistral Large 3 as updated
- Consider adding Mistral Medium 3 for mid-tier option (currently only have Large 3)

---

## Summary: Changes to Make

### Models to ADD:
1. **o3-pro** (OpenAI) - Enhanced reasoning, $20/$80 per M tokens
2. **Gemini 2.5 Flash-Lite** (Google) - Budget option for high-volume
3. **Qwen3-Omni** (Alibaba) - True multimodal with speech generation

### Models to UPDATE:
1. **Claude Haiku 4.5** - Correct pricing to $0.80/$4.00
2. **Qwen 3** - Clarify 235B-A22B parameters (not 1T)
3. **Gemini 3 Flash** - Update status to "Preview"

### Models NOT to Add (with reasoning):
| Model | Reason for Exclusion |
|-------|---------------------|
| GPT-5.3-Codex | API not available (CLI/IDE only) |
| GPT-5.2 Instant | Too similar to GPT-5.2 Thinking |
| o3/o4-mini deep-research | Specialized niche, would clutter catalog |
| DeepSeek V4 | Not released yet (expected Feb 17) |
| Llama 4 Behemoth | Not released yet |
| Mistral Medium/Small 3 | Would add complexity; Large 3 covers the flagship |

---

## Model Comparison Methodology

### How We Determine "Best" Models for Each Use Case

The catalog recommends models across 4 priority dimensions for each use case. Here's how we evaluate and compare:

---

## DETAILED DECISION RATIONALE

This section explains the reasoning behind every major decision in the catalog. Each claim should be traceable to a specific source or methodology.

---

## How We Select Which Benchmarks Matter

### The Problem with Benchmarks
Not all benchmarks are equal. Some are:
- **Contaminated**: Training data may include benchmark questions
- **Saturated**: Top models all score 95%+, making differentiation impossible
- **Misaligned**: High scores don't correlate with real-world performance

### Our Benchmark Selection Criteria

We prioritize benchmarks that meet these criteria:

| Criterion | Why It Matters | Example |
|-----------|----------------|---------|
| **Task Alignment** | Benchmark should test what users actually do | SWE-bench tests real GitHub issues, not toy problems |
| **Difficulty Spread** | Should differentiate between models | GPQA Diamond ranges from 60-95%, not 95-99% |
| **Recency** | Recent benchmarks less likely contaminated | AIME 2024/2025 over older competition problems |
| **Methodology Transparency** | Published evaluation methodology | Prefer benchmarks with open evaluation code |
| **Industry Adoption** | Used by multiple providers/researchers | SWE-bench cited by Anthropic, OpenAI, Google |

### Benchmark-to-Use-Case Mapping

| Use Case | Primary Benchmark | Why This Benchmark | Secondary Signals |
|----------|-------------------|---------------------|-------------------|
| **Coding** | SWE-bench Verified | Tests actual bug fixes in real repos | HumanEval, MBPP (easier, less realistic) |
| **Reasoning** | GPQA Diamond | PhD-level science requires deep reasoning | ARC-AGI (general intelligence) |
| **Math** | AIME 2024/2025 | Competition problems resist memorization | MATH benchmark (easier, more contaminated) |
| **Legal** | BigLaw Bench | Domain-specific, recent | Bar exam scores (easier threshold) |
| **General** | MMLU-Pro | Harder than original MMLU | Chatbot Arena ELO (subjective but useful) |

### Why We DON'T Rely On:

| Benchmark | Problem |
|-----------|---------|
| **Original MMLU** | Saturated - top models all score 85-90% |
| **HellaSwag** | Too easy - most models score 95%+ |
| **TruthfulQA** | Can be gamed with conservative responses |
| **Provider Self-Reports** | Conflict of interest; cherry-picked results |
| **Single Arena Rankings** | Subjective, influenced by prompt style |

### How We Interpret Benchmark Numbers

**SWE-bench Verified vs Pro:**
```
SWE-bench Verified: 2,294 easier issues → scores typically 50-80%
SWE-bench Pro: 500 harder issues → scores typically 30-65%

Example interpretation:
- Opus 4.6: 80.8% Verified = excellent real-world coding
- GPT-5.2 Pro: 62.3% Pro = also excellent (harder benchmark)
- Cannot directly compare 80.8% Verified to 62.3% Pro
```

**GPQA Diamond Score Ranges:**
```
<60%: Below average reasoning
60-70%: Good reasoning capability
70-85%: Excellent reasoning (current frontier)
85-95%: Exceptional (o3-pro territory)
>95%: Suspiciously high (possible contamination)
```

---

## How We Determine "Natural Conversation" Quality

### Why This Matters
"Natural conversation" is subjective but critical for chatbots. Users abandon bots that feel robotic.

### Evaluation Methodology

We assess conversation quality through multiple signals:

#### 1. Chatbot Arena ELO Rankings
**Source:** [lmarena.ai](https://lmarena.ai/)
- Blind human preference voting
- Millions of comparisons
- Specifically tests conversation quality

**How we use it:**
```
Arena ELO for conversation (Jan 2026):
1. Claude Sonnet 4.5: 1287 (excellent)
2. GPT-5.1: 1275 (excellent)
3. Gemini 2.5 Pro: 1261 (very good)
4. DeepSeek V3.2: 1245 (good)
5. Claude Haiku 4.5: 1232 (good for speed tier)
```

#### 2. Qualitative Markers We Look For

| Marker | Good Example | Bad Example |
|--------|--------------|-------------|
| **Acknowledges context** | "Given your earlier point about X..." | Ignores previous messages |
| **Appropriate tone matching** | Matches user's formality level | Always formal regardless |
| **Handles ambiguity gracefully** | "I want to make sure I understand - do you mean A or B?" | Assumes one interpretation |
| **Admits uncertainty** | "I'm not certain, but..." | Overconfident on uncertain topics |
| **Avoids repetition** | Varies phrasing naturally | Same phrases every response |
| **Appropriate length** | Matches question complexity | Always verbose or always terse |

#### 3. Provider Design Philosophy

**Why Claude models excel at conversation:**
- Anthropic explicitly trains for "helpful, harmless, honest"
- Constitutional AI methodology prioritizes natural interaction
- Documented focus on avoiding robotic responses
- Source: [Anthropic Research](https://www.anthropic.com/research)

**Why some models feel less natural:**
- Reasoning models (o3, o4-mini) optimized for accuracy over style
- Some models over-indexed on benchmark performance
- Instruction-following can make responses feel template-like

#### 4. Our Testing Methodology

For conversation quality, we conduct informal tests:
```
Test prompts:
1. Ambiguous request: "Can you help me with my project?"
   Good: Asks clarifying questions
   Bad: Assumes what project means

2. Emotional context: "I'm frustrated with this error"
   Good: Acknowledges frustration, then helps
   Bad: Jumps straight to technical solution

3. Multi-turn coherence: 5+ message conversation
   Good: References earlier context naturally
   Bad: Each response feels isolated

4. Correction handling: User corrects the model
   Good: Acknowledges mistake gracefully
   Bad: Defensive or ignores correction
```

### Final Ranking for Conversation Quality

Based on combined signals:
```
EXCELLENT:    Claude Sonnet 4.5, Claude Opus 4.6, GPT-5.1
VERY GOOD:    Gemini 2.5 Pro, Claude Haiku 4.5
GOOD:         DeepSeek V3.2, Mistral Large 3, GPT-4o
ADEQUATE:     Gemini Flash models, Qwen 3
SPECIALIZED:  o3, o4-mini (optimized for reasoning, not conversation)
```

---

## How We Determine Coding Ability

### Primary Signal: SWE-bench

**Why SWE-bench is our primary coding benchmark:**
1. **Real-world tasks**: Actual GitHub issues from popular repos
2. **End-to-end**: Requires reading code, understanding bugs, writing fixes
3. **Verifiable**: Automated test suites confirm correctness
4. **Difficult**: Top models score 50-80%, not 95%+

**How SWE-bench works:**
```
1. Model receives: Repository code + issue description
2. Model must: Generate a patch that fixes the issue
3. Verification: Run existing test suite
4. Score: % of issues correctly resolved
```

### Secondary Signals for Coding

| Signal | What It Measures | Source |
|--------|------------------|--------|
| **HumanEval** | Basic code generation | OpenAI benchmark |
| **MBPP** | Simple Python problems | Google benchmark |
| **Code contests** | Algorithm optimization | Codeforces-style problems |
| **Aider polyglot** | Multi-language editing | Aider leaderboard |

### Why Context Window Matters for Coding

```
Real codebase sizes:
- Small utility: 1-10K tokens
- Medium project: 50-200K tokens
- Large application: 500K-2M tokens
- Monorepo: 5M+ tokens

Model context windows:
- 128K: Can hold medium project
- 200K: Can hold large application partially
- 1M: Can hold most applications fully
- 10M (Llama Scout): Can hold monorepos
```

**Our reasoning for coding recommendations:**
```
Quality priority:
1. Opus 4.6: 80.8% SWE-bench + 1M context = best combination
2. GPT-5.2-Codex: Purpose-built for coding agents
3. GPT-5.2 Pro: 62.3% SWE-bench Pro (harder benchmark)

Privacy priority:
1. Llama 4 Scout: 10M context = entire codebase
2. Qwen 3: Strong coding + self-hosted
3. Mistral Large 3: 92% of GPT-5.2 quality, open source
```

---

## How We Determine Reasoning Ability

### What "Reasoning" Means

Reasoning ≠ knowledge retrieval. We measure:
- **Multi-step logic**: Chains of deduction
- **Abstraction**: Applying patterns to new situations
- **Self-correction**: Recognizing and fixing errors
- **Explanation**: Showing work, not just answers

### Primary Benchmarks for Reasoning

| Benchmark | Tests | Score Interpretation |
|-----------|-------|---------------------|
| **GPQA Diamond** | PhD-level science questions | 85%+ = frontier reasoning |
| **AIME** | Math competition problems | 90%+ = exceptional math reasoning |
| **ARC-AGI** | Novel pattern recognition | 80%+ = strong general intelligence |

### Why o3/o3-pro Lead Reasoning Rankings

**Architecture difference:**
```
Standard model: Input → Output
Reasoning model: Input → [Internal reasoning tokens] → Output

o3's approach:
1. Allocates "thinking" tokens (not shown to user)
2. Explores multiple solution paths
3. Self-checks for errors
4. Produces more consistent answers

Trade-off: Much slower, much more expensive
```

**Evidence from benchmarks:**
```
AIME 2024 scores:
- o3: 96.7%
- DeepSeek R1: 96.3%
- o4-mini: 93.4%
- GPT-5.2 Thinking: 88.0%
- Claude Opus 4.6: ~80% (estimated)

GPQA Diamond:
- GPT-5.2 Pro: 95.1%
- o3: 87.7%
- Claude Opus 4.6: 70.2%
```

### When Reasoning Models Are Overkill

```
USE reasoning models (o3, o3-pro, DeepSeek R1):
- Math proofs and derivations
- Scientific research analysis
- Complex legal/financial logic
- Multi-step planning problems

DON'T USE reasoning models:
- Simple Q&A (use GPT-5.1, Claude Sonnet)
- Creative writing (use Claude models)
- Code completion (use coding-specific models)
- Real-time chat (too slow)
```

---

## How We Determine Cost Effectiveness

### Pricing Data Sources

All pricing from official sources (verified Feb 2026):
- OpenAI: [platform.openai.com/docs/pricing](https://platform.openai.com/docs/pricing)
- Anthropic: [anthropic.com/pricing](https://anthropic.com/pricing)
- Google: [ai.google.dev/pricing](https://ai.google.dev/pricing)
- DeepSeek: [api-docs.deepseek.com](https://api-docs.deepseek.com)
- Mistral: [mistral.ai/pricing](https://mistral.ai/pricing)

### Cost Calculation Methodology

**Typical request profile:**
```
Input tokens: 2,000 - 20,000 (varies by use case)
Output tokens: 500 - 5,000 (varies by task)

We use 10K input / 2K output as "standard" comparison
```

**Full cost comparison (per 1M tokens, blended 5:1 input:output):**
```
Model                    | Input  | Output | Blended/1M
-------------------------|--------|--------|----------
Gemini 2.5 Flash-Lite    | $0.075 | $0.30  | $0.11
DeepSeek V3.2            | $0.27  | $1.10  | $0.41
DeepSeek R1              | $0.55  | $2.19  | $0.82
Gemini 2.5 Flash         | $0.15  | $0.60  | $0.23
Claude Haiku 4.5         | $0.80  | $4.00  | $1.33
Gemini 2.5 Pro           | $1.25  | $10.0  | $2.71
GPT-5.1                  | $1.25  | $10.0  | $2.71
GPT-5.2 Thinking         | $1.75  | $14.0  | $3.79
Mistral Large 3          | $2.00  | $6.00  | $2.67
Claude Sonnet 4.5        | $3.00  | $15.0  | $5.00
Claude Opus 4.6          | $5.00  | $25.0  | $8.33
o3                       | $10.0  | $40.0  | $15.0
Claude Opus 4.5          | $15.0  | $75.0  | $25.0
o3-pro                   | $20.0  | $80.0  | $30.0
GPT-5.2 Pro              | $21.0  | $168   | $45.5
```

### Hidden Costs to Consider

| Factor | Impact | Affected Models |
|--------|--------|-----------------|
| **Reasoning tokens** | 2-5x visible cost | o3, o3-pro, o4-mini |
| **Extended thinking** | +50-200% for complex tasks | Claude Opus, GPT-5.2 Thinking |
| **Cache misses** | Full input cost each time | All API models |
| **Retries** | Failed requests still billed | All models |
| **Long prompts** | >200K tokens = higher rates | Claude Opus 4.6 ($10/$37.50) |

### Value Calculation

We calculate value index as: `Quality Score / Blended Cost`

```
For coding (using SWE-bench as quality proxy):

Model              | SWE-bench | Cost   | Value Index
-------------------|-----------|--------|------------
DeepSeek V3.2      | ~65%      | $0.41  | 158.5
Claude Haiku 4.5   | 73.3%     | $1.33  | 55.1
Mistral Large 3    | ~70%      | $2.67  | 26.2
Claude Sonnet 4.5  | 77.2%     | $5.00  | 15.4
Claude Opus 4.6    | 80.8%     | $8.33  | 9.7

Interpretation:
- DeepSeek offers 16x better value than Opus per quality point
- BUT: 15% quality difference may matter for critical code
```

---

## How We Determine Speed/Latency

### Latency Components

```
Total latency = TTFT + (Output tokens × TPS)

Where:
- TTFT: Time to First Token (user sees first response)
- TPS: Tokens per Second (generation speed)
```

### Latency Measurements

**Sources:**
- [Artificial Analysis](https://artificialanalysis.ai) - independent benchmarks
- Provider documentation
- Community benchmarks

**Approximate TTFT (median, Feb 2026):**
```
FAST (<500ms):
- Claude Haiku 4.5: ~300ms
- Gemini Flash models: ~350ms
- GPT-4o: ~400ms

MEDIUM (500ms - 1.5s):
- Claude Sonnet 4.5: ~600ms
- GPT-5.1: ~700ms
- Gemini Pro models: ~800ms
- DeepSeek V3.2: ~900ms

SLOW (1.5s - 5s):
- Claude Opus 4.5: ~2s
- Claude Opus 4.6: ~2.5s
- GPT-5.2 Thinking: ~3s

VERY SLOW (5s+):
- o3: ~8-15s (reasoning overhead)
- o3-pro: ~15-45s (extended reasoning)
```

### When Speed Matters

| Use Case | Acceptable TTFT | Recommended Models |
|----------|-----------------|-------------------|
| Real-time chat | <500ms | Haiku, Flash |
| Code completion | <1s | Haiku, Sonnet, GPT-5.1 |
| Document analysis | <3s | Any non-reasoning |
| Background processing | Any | Best quality for task |

---

## How We Determine Privacy/Self-Hosting Suitability

### Privacy Tiers Explained

**Tier 1: Full Self-Hosting (Maximum Privacy)**
```
Requirements:
- Model weights downloadable
- Open source or permissive license
- Can run on own hardware
- No data leaves your infrastructure

Models: Llama 4, Qwen 3, Mistral Large 3
```

**Tier 2: Private Cloud (Good Privacy)**
```
Requirements:
- Data stays in your cloud tenant
- Provider doesn't train on your data
- Compliance certifications (SOC 2, etc.)

Options: Azure OpenAI, AWS Bedrock, Google Vertex AI
```

**Tier 3: API Only (Standard Privacy)**
```
Considerations:
- Data sent to provider's servers
- Usually not used for training (check ToS)
- Provider has access to prompts/responses

Models: Direct Claude API, OpenAI API, DeepSeek API
```

### Hardware Requirements for Self-Hosting

```
Llama 4 Scout (109B params, 17B active):
- Minimum: 1x NVIDIA H100 (80GB)
- Recommended: 2x H100 for faster inference

Llama 4 Maverick (400B params, 17B active):
- Minimum: 4x NVIDIA H100
- Recommended: 8x H100

Qwen 3 (235B params, 22B active):
- Minimum: 4x NVIDIA H100
- Recommended: 8x H100

Mistral Large 3 (675B params, 41B active):
- Minimum: 8x NVIDIA H100
- Recommended: 16x H100 or H200
```

### Compliance Considerations

| Requirement | Self-Hosted | Private Cloud | API |
|-------------|-------------|---------------|-----|
| GDPR | ✅ Full control | ✅ With DPA | ⚠️ Check ToS |
| HIPAA | ✅ With BAA controls | ✅ With BAA | ❌ Usually not |
| SOC 2 | N/A (you control) | ✅ Provider certified | ✅ Check provider |
| Data residency | ✅ You choose | ✅ Select region | ⚠️ Limited control |

---

## How We Handle Conflicting Information

### When Sources Disagree

**Example: Qwen 3 parameter count**
```
Source 1 (marketing): "1 trillion+ parameters"
Source 2 (GitHub): "235B total, 22B active"

Resolution process:
1. Check official technical documentation
2. Prioritize primary sources (papers, GitHub)
3. Marketing materials often exaggerate
4. Use most specific, verifiable number

Decision: Use "235B total / 22B active"
```

### Verification Hierarchy

```
1. Official documentation (highest trust)
2. Published research papers
3. GitHub repositories
4. Independent benchmarks (Artificial Analysis, etc.)
5. News articles
6. Marketing materials (lowest trust)
```

### When We Estimate

Some values require estimation. We mark these clearly:

```
Marked with ~: Estimated from related data
Example: "DeepSeek V3.2: ~65% SWE-bench"
Basis: Comparative testing vs known models, not official score

Marked with *: Inferred from reports
Example: "Mistral Large 3: 92% of GPT-5.2 performance*"
Basis: Mistral's announcement claims, not independent verification
```

---

## How We Determine Multimodal Capabilities

### What "Multimodal" Means

| Capability | Description | Models |
|------------|-------------|--------|
| **Image Input** | Understand photos, diagrams, screenshots | Most modern models |
| **Video Input** | Process video files frame-by-frame | Gemini, Qwen3-Omni |
| **Audio Input** | Transcribe and understand speech | Gemini, GPT-5.x, Qwen3-Omni |
| **Image Output** | Generate images (not covered in catalog) | DALL-E, Midjourney |
| **Speech Output** | Generate spoken audio | Qwen3-Omni |

### How We Assess Image Understanding

**Test scenarios:**
```
1. Document/Screenshot reading:
   - Extract text from images
   - Understand layouts and formatting
   - Read charts and tables

2. Visual reasoning:
   - Answer questions about image content
   - Compare multiple images
   - Follow visual instructions

3. Fine detail detection:
   - Read small text in images
   - Identify subtle visual elements
   - OCR accuracy
```

**Quality ranking for image understanding:**
```
EXCELLENT: Gemini 2.5 Pro, GPT-5.1, Claude Sonnet 4.5
- High accuracy on complex documents
- Good with charts, diagrams, handwriting

GOOD: Gemini Flash models, Claude Haiku, GPT-4o
- Handles most common image tasks
- May struggle with fine details

BASIC: Llama 4 Maverick, Mistral models
- Can process images but less refined
- Better for simple visual tasks

NONE: DeepSeek (text only), Qwen 3 (text only)
- No image capability
```

### Video Understanding (Unique to Gemini)

**Why Gemini leads for video:**
```
Native video support: Gemini 2.5 Pro/Flash
- Direct video file input (not just frames)
- Temporal understanding (what happens over time)
- Audio track processing simultaneously

Other models: Frame extraction workarounds
- Extract frames → process as images
- Loses temporal context
- More complex pipeline
```

**Use cases where video matters:**
- Content moderation
- Video summarization
- Tutorial/lecture analysis
- Surveillance/monitoring

### Audio Understanding

**Models with native audio:**
```
Gemini 2.5 Pro/Flash: Audio in, text out
GPT-5.x: Audio in, text out (via API)
Qwen3-Omni: Audio in, speech out (end-to-end)
```

**Qwen3-Omni unique capability:**
```
Traditional pipeline:
Audio → ASR → Text → LLM → Text → TTS → Audio

Qwen3-Omni:
Audio → Model → Audio (end-to-end)

Benefits:
- Lower latency
- Preserves tone/emotion
- 49 voice options
- Real-time capability
```

---

## How We Determine Multilingual Capabilities

### Language Count Claims vs Reality

**Claimed vs Effective support:**
```
Llama 4 Maverick: "200 languages"
- Reality: Strong in ~50, adequate in ~100, basic in rest

Qwen 3: "119 languages"
- Reality: Excellent in CJK, strong in European, varies for others

GPT-5.x: "100+ languages"
- Reality: Excellent in top 30, good in top 100
```

### How We Assess Multilingual Quality

**Testing methodology:**
```
1. Translation accuracy:
   - Source → Target round-trip fidelity
   - Idiomatic expression handling
   - Technical terminology

2. Native generation:
   - Writing in target language (not translation)
   - Cultural appropriateness
   - Grammar and style

3. Code-switching:
   - Handling mixed-language input
   - Appropriate language detection
```

**Language tier rankings:**
```
Tier 1 (Excellent across all models):
English, Chinese, Spanish, French, German, Japanese, Korean

Tier 2 (Good for top models):
Portuguese, Italian, Russian, Arabic, Hindi, Dutch, Polish

Tier 3 (Varies significantly):
Vietnamese, Thai, Turkish, Indonesian, Hebrew, Czech

Tier 4 (Limited support):
Swahili, Yoruba, Amharic, Tagalog, minority languages
```

### Specific Multilingual Recommendations

| Language Need | Best Model | Reasoning |
|---------------|------------|-----------|
| **Chinese (Mandarin)** | Qwen 3 | Native development, cultural training |
| **Japanese** | Claude Sonnet, Qwen 3 | Both have strong JP training data |
| **European languages** | Claude Sonnet, GPT-5.1 | Extensive EU training data |
| **Arabic** | GPT-5.1, Gemini | Strong RTL support |
| **Low-resource** | Llama 4 Maverick | Widest language coverage |
| **Self-hosted multilingual** | Qwen 3 | Best multilingual open-source |

---

## How We Determine Document Processing Suitability

### Context Window Requirements

**Document size estimation:**
```
1 page ≈ 500 tokens (text)
1 page ≈ 1,500 tokens (with images, as described)

Document types:
- Email: 200-1,000 tokens
- Article: 2,000-10,000 tokens
- Research paper: 10,000-30,000 tokens
- Legal contract: 20,000-100,000 tokens
- Technical manual: 50,000-500,000 tokens
- Full codebase: 500,000-10,000,000 tokens
```

**Model context recommendations:**
```
< 50K tokens (short docs):
Any model works; optimize for quality or cost

50K - 200K tokens (medium docs):
GPT-4o, Claude Sonnet, most models work

200K - 1M tokens (long docs):
Claude Opus 4.6, Gemini 2.5 Pro, GPT-4.1

1M - 10M tokens (massive docs):
Llama 4 Scout (10M) is only realistic option
```

### Document Quality vs Context Length Trade-off

**The "lost in the middle" problem:**
```
Models process long contexts less accurately in the middle.

Evidence:
- Information at start: High recall
- Information at end: High recall
- Information in middle: Lower recall (10-30% drop)

Mitigation strategies:
1. Put critical info at start/end
2. Use retrieval-augmented generation (RAG)
3. Summarize sections before full analysis
```

**How this affects our recommendations:**
```
For 500K+ token documents:
- Don't expect perfect recall of all details
- Use for summarization, not needle-in-haystack
- Consider RAG for specific queries

For critical document analysis:
- Break into chunks with overlap
- Process multiple times from different angles
- Verify important findings manually
```

---

## How We Determine Agent/Automation Suitability

### What Makes a Model Good for Agents

**Required capabilities:**
```
1. Function calling: Execute tools/APIs reliably
2. Multi-step planning: Break complex tasks into steps
3. Error recovery: Handle failures gracefully
4. State management: Track progress across turns
5. Instruction following: Follow complex workflows
```

### Function Calling Assessment

**How we evaluate:**
```
1. Parameter extraction accuracy:
   - Correctly identifies required parameters
   - Handles optional parameters appropriately
   - Validates input types

2. Tool selection:
   - Chooses correct tool for task
   - Avoids hallucinating non-existent tools
   - Chains tools appropriately

3. Error handling:
   - Recognizes failed tool calls
   - Attempts recovery strategies
   - Reports meaningful errors
```

**Model rankings for agent use:**
```
EXCELLENT: Claude Opus 4.6, GPT-5.2-Codex, Claude Sonnet 4.5
- Reliable function calling
- Good at multi-step planning
- Handles complex workflows

GOOD: GPT-5.1, Gemini 2.5 Pro, DeepSeek V3.2
- Solid function calling
- May need more guidance for complex workflows

ADEQUATE: Claude Haiku, Gemini Flash, o4-mini
- Works for simple agents
- May struggle with long multi-step tasks

NOT RECOMMENDED: Reasoning models (o3, o3-pro)
- Optimized for single-turn reasoning
- Slow for iterative agent loops
```

### Agentic Coding Specific

**Why GPT-5.2-Codex is specialized:**
```
Training focus:
- Multi-file code understanding
- Autonomous debugging workflows
- Test generation and validation
- Refactoring large codebases

Differences from general GPT-5.2:
- Only available via Responses API
- Optimized for code-specific tool use
- Better at maintaining code context
```

---

## How We Make Final Recommendations

### Decision Framework

For each use case and priority, we follow this process:

```
Step 1: Filter by requirements
- Must meet minimum capability threshold
- Must have required features (multimodal, context, etc.)
- Must be available via required channels (API, self-hosted)

Step 2: Rank by primary metric
- Quality: Benchmark scores + qualitative signals
- Cost: Price per million tokens (blended)
- Speed: TTFT + tokens per second
- Privacy: Hosting options + compliance

Step 3: Apply tie-breakers
- Recency (newer often better for same capability)
- Ecosystem (better docs, tools, community)
- Provider reliability (uptime, consistency)

Step 4: Sanity check
- Does this make sense for real users?
- Are we missing obvious alternatives?
- Is there a "hidden gem" that's overlooked?
```

### Example: Coding Quality Recommendation

```
Step 1: Filter
- Must have SWE-bench score or strong coding reputation
- Must have API access
- Candidates: Opus 4.6, Opus 4.5, GPT-5.2 Pro, GPT-5.2-Codex,
              Sonnet 4.5, GPT-4.1, DeepSeek V3.2, etc.

Step 2: Rank by SWE-bench
1. Claude Opus 4.5: 80.9%
2. Claude Opus 4.6: 80.8%
3. Claude Sonnet 4.5: 77.2%
4. GPT-5.2 Pro: 62.3% (SWE-bench Pro - harder)
5. GPT-4.1: 54.6%

Step 3: Apply tie-breakers
- Opus 4.6 vs 4.5: 4.6 has 1M context (crucial for codebases)
- GPT-5.2 Pro: Pro benchmark is harder, so 62.3% is excellent
- GPT-5.2-Codex: Purpose-built for coding agents

Step 4: Final ranking
1. Claude Opus 4.6 (best combination of score + context)
2. Claude Opus 4.5 (highest raw score)
3. GPT-5.2 Pro (enterprise-grade, harder benchmark)
```

### Documenting Uncertainty

When we're not confident, we say so:

```
HIGH CONFIDENCE:
"Claude Opus 4.6 leads on SWE-bench Verified (80.8%)"
- Direct benchmark citation
- Verifiable claim

MEDIUM CONFIDENCE:
"GPT-5.2-Codex excels at agentic coding"
- Based on provider claims + architecture
- Limited independent benchmarks

LOW CONFIDENCE:
"DeepSeek V3.2 achieves ~65% on SWE-bench"
- Estimated from comparative testing
- Not officially published
```

### 1. Quality Priority
**Question:** Which model produces the best outputs for this task?

**Evaluation Criteria:**
- **Benchmark Scores**: We prioritize task-specific benchmarks over general ones
  - Coding: SWE-bench Verified/Pro (real-world GitHub issues)
  - Reasoning: GPQA Diamond (PhD-level science), AIME (math competition)
  - General: ARC-AGI (general intelligence), BigLaw Bench (legal)
- **Qualitative Assessment**: Does the model handle edge cases? Is output nuanced?
- **Context Utilization**: Can it effectively use its full context window?

**Example Decision - Coding Quality:**
```
Claude Opus 4.6: 80.8% SWE-bench Verified + 1M context → TOP PICK
GPT-5.2 Pro: 62.3% SWE-bench Pro (harder benchmark) → #2
Claude Opus 4.5: 80.9% SWE-bench Verified → #3
```
We chose Opus 4.6 over 4.5 despite similar SWE-bench because 1M context enables whole-codebase analysis.

### 2. Cost Priority
**Question:** Which model delivers acceptable quality at lowest cost?

**Evaluation Criteria:**
- **Price per Million Tokens**: Input + Output weighted (typically 1:3 ratio for most apps)
- **Quality Floor**: Must still be "good enough" for the use case
- **Hidden Costs**: Reasoning tokens, cache misses, retries due to failures

**Cost Calculation Example:**
```
Typical coding task: 10K input, 2K output tokens

DeepSeek V3.2:  (10K × $0.27) + (2K × $1.10) = $0.0049/request
Claude Haiku:   (10K × $0.80) + (2K × $4.00) = $0.016/request
Claude Sonnet:  (10K × $3.00) + (2K × $15.0) = $0.060/request

DeepSeek is 3.3x cheaper than Haiku, 12x cheaper than Sonnet
```

**Quality Floor Check:**
- DeepSeek V3.2 handles routine coding well → Recommended for cost
- Gemini 2.5 Flash-Lite is cheaper but quality drops significantly → Only for simple tasks

### 3. Speed Priority
**Question:** Which model responds fastest for interactive use?

**Evaluation Criteria:**
- **Time to First Token (TTFT)**: Critical for chat applications
- **Tokens per Second**: Important for long generations
- **Reasoning Overhead**: Models with "thinking" are slower

**Speed Tiers:**
```
FAST (< 500ms TTFT):     Claude Haiku, Gemini Flash, GPT-4o
MEDIUM (500ms - 2s):     Claude Sonnet, GPT-5.1, Gemini Pro
SLOW (2s - 10s):         Claude Opus, GPT-5.2 Thinking
VERY SLOW (10s+):        o3, o3-pro (reasoning models)
```

**Trade-off Example:**
For real-time chat, we recommend Haiku over Sonnet even though Sonnet is higher quality, because users expect instant responses.

### 4. Privacy Priority
**Question:** Which model can run on private infrastructure?

**Evaluation Criteria:**
- **Open Source License**: Apache 2.0, Llama license, etc.
- **Self-Hosting Feasibility**: GPU requirements, documentation quality
- **No Data Sent to Third Parties**: Complete on-premise option

**Privacy Tiers:**
```
FULL PRIVACY:     Llama 4, Qwen 3, Mistral Large 3 (self-hosted)
PARTIAL:          Models via private cloud (Azure OpenAI, Bedrock)
API ONLY:         Claude API, OpenAI API (data sent to provider)
```

---

## Use Case Analysis Framework

For each use case, we analyze models against specific requirements:

### Customer Support & Chatbots
| Requirement | Why It Matters | Best Models |
|-------------|----------------|-------------|
| Natural conversation | Users expect human-like responses | Claude Sonnet, GPT-5.1 |
| Fast responses | Real-time chat needs low latency | Haiku, Gemini Flash |
| Context retention | Multi-turn conversations | Any 128K+ model |
| Factual accuracy | Wrong answers damage trust | Avoid hallucination-prone models |

### Code Generation & Review
| Requirement | Why It Matters | Best Models |
|-------------|----------------|-------------|
| SWE-bench score | Measures real-world coding ability | Opus 4.6, GPT-5.2 Pro |
| Large context | Understand full codebases | GPT-4.1 (1M), Llama Scout (10M) |
| Instruction following | Complex refactoring instructions | Claude models excel here |
| Multi-file reasoning | Real projects span many files | GPT-5.2-Codex, Opus 4.6 |

### Complex Reasoning & Analysis
| Requirement | Why It Matters | Best Models |
|-------------|----------------|-------------|
| GPQA Diamond score | PhD-level science reasoning | o3-pro (best), GPT-5.2 Pro |
| AIME score | Mathematical problem solving | o3 (96.7%), DeepSeek R1 (96.3%) |
| Chain-of-thought | Shows reasoning process | o-series, DeepSeek R1 |
| Consistency | Same question → same answer | o3-pro (more compute = more consistent) |

### Document Analysis & Summarization
| Requirement | Why It Matters | Best Models |
|-------------|----------------|-------------|
| Context window | Fit entire documents | Llama Scout (10M), Gemini (1M) |
| Extraction accuracy | Pull correct information | Gemini 2.5 Pro, Claude Sonnet |
| Multimodal | PDFs with images/charts | Gemini, GPT-5.1, Llama Maverick |
| Cost efficiency | Process many documents | Gemini Flash-Lite, DeepSeek |

### Translation & Multilingual
| Requirement | Why It Matters | Best Models |
|-------------|----------------|-------------|
| Language coverage | Support needed languages | Llama Maverick (200), Qwen (119) |
| Nuance preservation | Idioms, cultural context | Claude Sonnet, GPT-5.1 |
| Low-resource languages | Less common languages | Qwen 3 (strong Asian languages) |
| Self-hosted option | Data sovereignty requirements | Qwen 3, Llama Maverick |

### Image & Vision Tasks
| Requirement | Why It Matters | Best Models |
|-------------|----------------|-------------|
| Native multimodal | Built-in vision, not bolted-on | Gemini, GPT-5.1, Claude |
| Video support | Analyze video content | Gemini 2.5 Pro (native video) |
| Fine detail detection | Small text, subtle features | Gemini 3 Pro (media_resolution parameter) |
| Open source option | Self-host for privacy | Llama Maverick, Qwen3-Omni |

---

## Benchmark Interpretation Guide

### What Each Benchmark Actually Measures

| Benchmark | What It Tests | Good Score | Caveat |
|-----------|---------------|------------|--------|
| **SWE-bench Verified** | Fix real GitHub issues | >70% excellent | Verified subset is easier than full |
| **SWE-bench Pro** | Harder subset of above | >50% excellent | More realistic but harder to compare |
| **GPQA Diamond** | PhD-level science questions | >85% excellent | Requires specialized knowledge |
| **AIME 2024/2025** | Math competition problems | >90% excellent | Pure math, not applied |
| **ARC-AGI-1** | General reasoning | >80% excellent | Measures abstraction ability |
| **BigLaw Bench** | Legal document analysis | >85% excellent | Domain-specific |

### Why We Don't Rely on Single Benchmarks

1. **Benchmark Gaming**: Models can be optimized for specific benchmarks
2. **Task Mismatch**: High AIME ≠ good at business writing
3. **Version Sensitivity**: Benchmarks get "contaminated" over time
4. **Real-World Gap**: Benchmarks are artificial; production is messier

**Our Approach:**
- Use benchmarks as initial filters
- Cross-reference multiple benchmarks
- Weight task-specific benchmarks higher
- Verify with qualitative testing when possible

---

## Price-Performance Analysis

### Cost Efficiency Calculation

We calculate "value" as: `(Quality Score) / (Cost per 1M tokens)`

**Example for Coding:**
```
Model               | SWE-bench | Cost (avg) | Value Index
--------------------|-----------|------------|------------
DeepSeek V3.2       | ~65%*     | $0.69      | 94.2
Mistral Large 3     | ~70%*     | $4.00      | 17.5
Claude Haiku 4.5    | 73.3%     | $2.40      | 30.5
Claude Sonnet 4.5   | 77.2%     | $9.00      | 8.6
Claude Opus 4.6     | 80.8%     | $15.00     | 5.4

*Estimated based on comparative testing
```

**Interpretation:**
- DeepSeek offers best value IF quality is acceptable
- Haiku is the "sweet spot" for many applications
- Opus is only worth it when quality difference matters (critical code, legal)

### When to Pay Premium

Pay for expensive models when:
- Errors are costly (medical, legal, financial)
- Human review is more expensive than the model
- Task requires frontier capabilities (novel research)
- Brand/reputation depends on output quality

Use budget models when:
- High volume, low stakes (content moderation, classification)
- Human review is standard practice anyway
- Task is well-defined with clear success criteria
- Iterating/experimenting before production

---

## Quick Decision Recommendations Logic

The "Quick Decisions" table provides instant answers for common priorities. Here's how each recommendation was determined:

### "Lowest Cost" → DeepSeek V3.2, Gemini 2.5 Flash-Lite, DeepSeek R1
**Reasoning:**
1. **DeepSeek V3.2** ($0.27/$1.10) - 10-30x cheaper than competitors with good general quality
2. **Gemini 2.5 Flash-Lite** ($0.075/$0.30) - Absolute cheapest for high-volume simple tasks
3. **DeepSeek R1** ($0.55/$2.19) - Cheapest reasoning model, rivals o1 at fraction of cost

### "Highest Quality" → Claude Opus 4.6, o3-pro, GPT-5.2 Pro
**Reasoning:**
1. **Claude Opus 4.6** - 80.8% SWE-bench, 1M context, adaptive thinking, leads most benchmarks
2. **o3-pro** - Maximum reasoning capability, best for hardest analytical problems
3. **GPT-5.2 Pro** - 90.5% ARC-AGI, 95.1% GPQA Diamond, enterprise-grade

### "Best for Coding" → Claude Opus 4.6, GPT-5.2-Codex, GPT-5.2 Pro
**Reasoning:**
1. **Claude Opus 4.6** - Industry-leading SWE-bench (80.8%), 1M context for entire codebases
2. **GPT-5.2-Codex** - Purpose-built for agentic coding, autonomous debugging
3. **GPT-5.2 Pro** - 62.3% SWE-bench Pro (harder benchmark)

### "Best for Reasoning" → o3-pro, o3, GPT-5.2 Pro
**Reasoning:**
1. **o3-pro** - Maximum compute for hardest problems, best consistency
2. **o3** - 96.7% AIME 2024, 87.7% GPQA Diamond
3. **GPT-5.2 Pro** - 95.1% GPQA Diamond, strong general reasoning

### "Fastest Responses" → Claude Haiku 4.5, Gemini 3 Flash, Gemini 2.5 Flash
**Reasoning:**
1. **Claude Haiku 4.5** - Fastest Claude model, excellent for real-time chat
2. **Gemini 3 Flash** - Latest fast model, improved reasoning over 2.5
3. **Gemini 2.5 Flash** - Proven fast model with 1M context

### "Best for Documents" → Claude Opus 4.6, Gemini 2.5 Pro, Llama 4 Scout
**Reasoning:**
1. **Claude Opus 4.6** - 1M context with best comprehension and extraction
2. **Gemini 2.5 Pro** - 1M context, native video/audio for mixed documents
3. **Llama 4 Scout** - 10M context (!) for massive document collections, self-hosted

### "Best for Privacy" → Llama 4 Maverick, Llama 4 Scout, Qwen 3
**Reasoning:**
1. **Llama 4 Maverick** - 400B params, multimodal, fully self-hostable
2. **Llama 4 Scout** - 10M context, runs on single GPU
3. **Qwen 3** - 235B MoE, 119 languages, Apache 2.0 license

### "Best Multilingual" → Llama 4 Maverick, Qwen 3, Qwen3-Omni
**Reasoning:**
1. **Llama 4 Maverick** - 200 languages, strongest breadth
2. **Qwen 3** - 119 languages with strong Asian language support
3. **Qwen3-Omni** - Speech output in multiple languages, real-time translation

---

## Verification Checklist

Before finalizing updates, verify:
- [ ] All API endpoints exist and are documented
- [ ] Pricing is from official sources
- [ ] Context windows match documentation
- [ ] Release dates are accurate
- [ ] No models are scheduled for imminent deprecation

---

## Sources Summary

### Official Documentation:
- [OpenAI API Models](https://platform.openai.com/docs/models)
- [OpenAI Pricing](https://openai.com/api/pricing/)
- [Claude API Models](https://platform.claude.com/docs/en/about-claude/models/overview)
- [Anthropic Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- [Gemini API Models](https://ai.google.dev/gemini-api/docs/models)
- [DeepSeek API Docs](https://api-docs.deepseek.com/)
- [Llama 4 Official](https://www.llama.com/models/llama-4/)
- [Qwen GitHub](https://github.com/QwenLM/Qwen3)
- [Mistral Docs](https://docs.mistral.ai/)

### News and Announcements:
- [CNBC: Claude Opus 4.6](https://www.cnbc.com/2026/02/05/anthropic-claude-opus-4-6-vibe-working.html)
- [Meta AI Blog: Llama 4](https://ai.meta.com/blog/llama-4-multimodal-intelligence/)
- [Mistral 3 Announcement](https://mistral.ai/news/mistral-3)
- [OpenAI: GPT-5.2 Introduction](https://openai.com/index/introducing-gpt-5-2/)
- [Google: Gemini 3](https://blog.google/products/gemini/gemini-3/)

---

---

## Future Feature: Multi-Select Use Cases

**Status:** Implemented and tested, then reverted to single-select for simplicity (Feb 2026).

**What it did:** Allowed users to select multiple use case cards (e.g. Chatbot + Knowledge) in the Find Your LLM section. Scores were averaged across selected use cases, breakdowns merged with weighted contributions, and the header showed combined names (e.g. "Recommended for Chatbot + Knowledge Base").

**How it worked:**
- `selectedUsecases` array replaced `currentUsecase` string
- Click toggled cards on/off (at least one must remain selected)
- `computeCapabilityScore()` called per use case, scores averaged
- Breakdown metrics merged: duplicate metrics had contributions averaged
- `computeValueScore()` used the averaged capability score
- Sorting applied to averaged overall/capability/value scores

**Why reverted:** Found to be less user-friendly than single selection for the current audience. Could be re-enabled in the future if users request combined use case analysis.

**To re-enable:** See git commit `be63904` for the full multi-select implementation.

*Last updated: February 16, 2026*

---

## Future Feature: Boost Filters (Tool Calling & Long Context)

**Status:** Designed, backend scoring functions implemented in `app.js`, UI deferred for simplicity (Feb 2026).

**What it would do:** Add two toggle-chip "Boost" filters to the Find Your LLM filter bar. Users could activate one or both to re-rank models that excel in those areas:

- **Tool Calling Boost:** +8 point bonus to `capabilityScore` for models where `specs.supportsFunctionCalling === true`. Surfaces tool-calling-capable models higher in rankings.
- **Long Context Boost:** Increases the `contextWindow` weight to `max(0.35, current)` in the scoring formula, redistributing weight from other metrics proportionally. Rewards models with large context windows (Llama 4 Scout 10M, Gemini 1M, etc.).

**Backend support already exists:**
- `buildAdjustedWeights(useCaseKey, rankBy, boosts)` in `app.js` accepts a `boosts` Set and applies Long Context weight redistribution
- `rankModelsAdvanced()` applies the Tool Calling +8 bonus when `boosts.has('tool-calling')`
- Currently called with an empty `boosts` Set — re-enabling the UI is straightforward

**UI design (deferred):**
```
BOOST  [Tool Calling] [Long Context]
```
- Pill-shaped toggle chips (multi-select, stackable)
- `.chip-group-toggle` layout with `.filter-chip-toggle` styling
- Both boosts compose naturally when both active

**To re-enable:**
1. Add the Boost row back to the filter bar HTML in `index.html`
2. Add click handlers that toggle `currentBoosts.has('tool-calling')` / `currentBoosts.has('long-context')`
3. Re-add `.chip-group-toggle` and `.filter-chip-toggle` CSS to `styles.css`
4. The backend scoring in `app.js` requires no changes

*Last updated: February 16, 2026*
