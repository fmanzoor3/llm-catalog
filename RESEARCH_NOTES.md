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

*Last updated: February 6, 2026*
