# LLM Selection Guide

A practical guide to help you choose the right LLM for your project. No benchmarks, just real-world recommendations.

---

## Quick Decision Guide

**What matters most to you?**

| Priority | Best Options |
|----------|-------------|
| **Lowest cost** | DeepSeek V3.2, Gemini Flash, Claude Haiku |
| **Highest quality** | GPT-5.2, Claude Opus 4.5, Gemini 3 Pro |
| **Fastest responses** | Claude Haiku, Gemini Flash, GPT-4o-mini |
| **Data privacy (self-hosted)** | Llama 4, DeepSeek, Qwen 3 |
| **Best for coding** | Claude Opus 4.5, GPT-5.2 Codex, DeepSeek Coder |
| **Complex reasoning** | GPT-5.2, OpenAI o3, DeepSeek R1 |
| **Math & abstract reasoning** | GPT-5.2 (100% AIME), Claude Opus 4.5, DeepSeek R1 |

---

## Use Case Recommendations

### 1. Customer Support / Chatbots

| If you need... | Use this | Why |
|----------------|----------|-----|
| Cheapest option that works | DeepSeek V3.2 or Gemini Flash | 10-30x cheaper than premium options, handles routine queries well |
| Best customer experience | Claude Sonnet 4.5 | Natural conversation style, excellent at understanding context and nuance |
| Fastest responses | Claude Haiku 4.5 | 2-4x faster than other options, great for real-time chat |
| Google Workspace integration | Gemini | Native integration with Google tools |
| High volume (100k+ conversations/month) | Haiku or Gemini Flash | Keep costs manageable at scale |

---

### 2. Code Generation & Review

| If you need... | Use this | Why |
|----------------|----------|-----|
| Best code quality | Claude Opus 4.5 or GPT-5.2 Codex | Both at ~80% SWE-bench - Claude slightly ahead (80.9% vs 80.0%) |
| Fastest code generation | GPT-5.2 Codex | 23% faster in timed challenges |
| Good quality, lower cost | DeepSeek Coder or Gemini Flash | Strong coding ability at fraction of the cost |
| Large codebase analysis | GPT-4.1 or Gemini 2.5 Pro | 1-2 million token context windows fit entire projects |
| Multi-language support | DeepSeek Coder | Supports 338+ programming languages |

---

### 3. Document Analysis & Summarization

| If you need... | Use this | Why |
|----------------|----------|-----|
| Very long documents | GPT-4.1 (1M tokens) or Gemini 2.5 Pro (2M tokens) | Largest context windows available |
| Best comprehension | Claude Opus 4.5 or Sonnet 4.5 | Excellent at understanding nuance and extracting key points |
| High volume processing | Gemini Flash or Haiku | Cost-effective for batch processing |
| PDF/image documents | Claude Opus 4.5 or Gemini | Strong vision capabilities for scanned documents |

---

### 4. Content Writing & Marketing

| If you need... | Use this | Why |
|----------------|----------|-----|
| Most natural writing | Claude Sonnet 4.5 or Opus 4.5 | Known for human-like, engaging prose |
| General content | GPT-4o or Gemini Pro | Reliable all-rounders |
| High volume/low cost | DeepSeek V3.2 | Great value for bulk content generation |
| Brand voice consistency | Claude models | Better at following detailed style guides |

---

### 5. Data Extraction (PDFs, Forms, Tables)

| If you need... | Use this | Why |
|----------------|----------|-----|
| Best accuracy | Claude Opus 4.5 | Excellent at structured data extraction |
| Scanned documents (OCR) | Gemini or Claude | Strong vision models for image-based text |
| JSON/structured output | GPT-4o or Claude | Reliable structured output modes |
| Cost-effective extraction | DeepSeek VL2 or Gemini Flash | Good vision at lower cost |

---

### 6. Research & Complex Analysis

| If you need... | Use this | Why |
|----------------|----------|-----|
| Abstract reasoning | GPT-5.2 | Best ARC-AGI-2 score (52.9%), major leap in abstract reasoning |
| Math problems | GPT-5.2 | Perfect 100% on AIME 2025 |
| Deep multi-step reasoning | OpenAI o3 or GPT-5.2 | Purpose-built for complex reasoning chains |
| Reasoning on a budget | DeepSeek R1 | Similar capability at ~1/20th the cost |
| Extended thinking | Claude Opus 4.5 | Can "think longer" on complex problems |
| Professional knowledge work | GPT-5.2 | Beats or ties professionals 70.9% of time on GDPval |

---

### 7. Internal Knowledge Base / Q&A

| If you need... | Use this | Why |
|----------------|----------|-----|
| Best retrieval accuracy | Claude Sonnet 4.5 | Excellent at RAG (retrieval-augmented generation) |
| Long context (whole docs) | GPT-4.1 or Gemini 2.5 Pro | Can fit entire knowledge bases in context |
| Cost-effective | Gemini Flash or Haiku | Good enough for most Q&A at low cost |
| Data must stay internal | Self-hosted Llama or Qwen | No data leaves your infrastructure |

---

### 8. Translation & Multilingual

| If you need... | Use this | Why |
|----------------|----------|-----|
| Most languages | Qwen 3 (119 languages) or Gemini | Broadest language coverage |
| European languages | Mistral | Strong on French, German, Spanish, Italian |
| Quality translation | Claude or GPT-5 | Best at capturing nuance and idioms |
| Asian languages | Qwen 3 or DeepSeek | Native Chinese optimization, good at Japanese/Korean |

---

### 9. Image & Vision Tasks

| If you need... | Use this | Why |
|----------------|----------|-----|
| Best image understanding | Claude Opus 4.5 | Leading vision benchmark scores |
| Document/chart analysis | Gemini 3 Pro or Claude | Strong at tables, graphs, diagrams |
| Image generation | GPT-image-1 or Gemini | Integrated image generation |
| Cost-effective vision | DeepSeek VL2 or Gemini Flash | Good vision at lower price |

---

## Common Situations

| Your Situation | Recommendation |
|----------------|----------------|
| "We have a tight budget" | Start with DeepSeek V3.2 → if not good enough, try Gemini Flash → then Haiku |
| "Quality is critical, cost doesn't matter" | Claude Opus 4.5 for most tasks, GPT-5 or o3 for reasoning |
| "We need to process 100k+ documents" | Use cheap models (Flash/Haiku) in parallel, reserve premium for complex cases |
| "Response time matters (real-time app)" | Claude Haiku (fastest) or Gemini Flash |
| "Legal/compliance requires data privacy" | Self-host Llama 4, DeepSeek, or Qwen - no data leaves your servers |
| "We're already in Google ecosystem" | Gemini - native integrations with Workspace, Cloud |
| "We need consistent, reliable outputs" | Claude models - known for following instructions precisely |
| "We're experimenting/prototyping" | Start with free tiers, then DeepSeek for cheap iteration |

---

## Provider Overview

### Claude (Anthropic)

**What they're known for:**
- Excellent at following complex, detailed instructions
- Natural, human-like conversation style
- Industry-leading coding capabilities
- Strong at tasks requiring careful reasoning

**Trade-offs:**
- More expensive than DeepSeek and Gemini
- No image generation (text and analysis only)

**Model lineup:**
| Model | Best for | Cost |
|-------|----------|------|
| **Opus 4.5** | Maximum quality, complex tasks, coding | $$$ |
| **Sonnet 4.5** | Balanced quality and cost, production use | $$ |
| **Haiku 4.5** | Speed, high volume, cost-sensitive | $ |

---

### OpenAI (GPT)

**What they're known for:**
- GPT-5.2 leads in math (100% AIME) and abstract reasoning (52.9% ARC-AGI-2)
- Most widely used, extensive ecosystem
- Best reasoning models (o-series and GPT-5.2)
- Good integrations with Microsoft tools

**Trade-offs:**
- Premium pricing, especially for GPT-5.2 and o3
- Some features restricted to higher tiers

**Model lineup:**
| Model | Best for | Cost |
|-------|----------|------|
| **GPT-5.2** | Math, reasoning, professional tasks - top overall intelligence | $$$ |
| **GPT-5.2 Codex** | Coding (80% SWE-bench), fast code generation | $$$ |
| **o3** | Complex multi-step reasoning | $$$ |
| **GPT-4.1** | Long documents (1M context) | $$ |
| **GPT-4o** | General tasks, multimodal | $$ |
| **GPT-4o-mini** | Budget option, high volume | $ |

---

### Google (Gemini)

**What they're known for:**
- Longest context windows (up to 2M tokens)
- Native Google Workspace integration
- Good price-performance ratio
- Strong multimodal (text, image, video, audio)

**Trade-offs:**
- Can be less consistent on complex reasoning
- Hallucination rate slightly higher than Claude/GPT

**Model lineup:**
| Model | Best for | Cost |
|-------|----------|------|
| **Gemini 3 Pro** | Maximum quality, complex analysis | $$$ |
| **Gemini 3 Flash** | Speed + quality balance, production | $ |
| **Gemini 2.5 Pro** | Very long documents (2M tokens) | $$ |

---

### DeepSeek

**What they're known for:**
- Incredible value - 10-30x cheaper than competitors
- Quality comparable to GPT-4 and Claude Sonnet
- Open source (can self-host)
- Strong reasoning model (R1)

**Trade-offs:**
- Chinese company (may matter for compliance/data residency)
- Smaller ecosystem, fewer integrations
- API occasionally less reliable than major providers

**Model lineup:**
| Model | Best for | Cost |
|-------|----------|------|
| **V3.2** | General use, best value | $ |
| **R1** | Complex reasoning (like o3) | $ |
| **Coder** | Programming tasks | $ |

---

### Open Source (Llama, Qwen, Mistral)

**What they're known for:**
- Full data privacy - runs on your infrastructure
- No per-token API costs
- Customizable and fine-tunable
- No vendor lock-in

**Trade-offs:**
- Need infrastructure to run (GPUs)
- Slightly lower quality than top commercial models
- Requires more technical expertise

**Top choices:**
| Model | Best for | Notes |
|-------|----------|-------|
| **Llama 4** (Meta) | General use, most popular | Free up to 700M users |
| **Qwen 3** (Alibaba) | Multilingual, full Apache 2.0 license | Most permissive license |
| **Mistral** | European compliance, coding | Strong on European languages |
| **DeepSeek** (self-hosted) | Best open-source quality | MIT license |

---

## Cost Tiers

| Tier | Examples | When to use |
|------|----------|-------------|
| **$ (Budget)** | DeepSeek, Gemini Flash, Haiku | High volume, prototyping, cost-sensitive projects |
| **$$ (Mid-range)** | Sonnet, GPT-4o, Gemini Pro | Production applications, balanced needs |
| **$$$ (Premium)** | Opus, GPT-5, o3 | Quality-critical applications, complex reasoning |
| **Self-hosted** | Llama, Qwen, DeepSeek | Data privacy requirements, very high volume |

---

## External Resources

For detailed pricing and technical comparisons:
- [Artificial Analysis](https://artificialanalysis.ai/) - Real-time pricing and speed comparisons
- [LMArena](https://lmarena.ai/) - Try models side-by-side yourself
- [WhatLLM](https://whatllm.org/) - Weekly updated model comparisons

---

## References & Sources

### Claude (Anthropic)
- [Anthropic Model Documentation](https://docs.anthropic.com/en/docs/about-claude/models/all-models) - Official model specs
- [Anthropic Pricing](https://www.anthropic.com/pricing) - Current API pricing
- [Claude 4.5 Opus Announcement](https://www.anthropic.com/news/claude-4-5-opus) - Release details

### OpenAI (GPT)
- [OpenAI Models Documentation](https://platform.openai.com/docs/models) - Official model catalog
- [OpenAI API Pricing](https://openai.com/api/pricing/) - Current pricing
- [GPT-5 Announcement](https://openai.com/index/introducing-gpt-5/) - August 2025 release
- [o3 and o4-mini Introduction](https://openai.com/index/introducing-o3-and-o4-mini/) - Reasoning models
- [GPT-4.1 API Launch](https://openai.com/index/gpt-4-1/) - 1M context model

### Google (Gemini)
- [Google AI Models](https://ai.google.dev/gemini-api/docs/models/gemini) - Official documentation
- [Gemini API Pricing](https://ai.google.dev/pricing) - Current pricing
- [Gemini 2.5 Pro Release](https://blog.google/technology/google-deepmind/gemini-model-thinking-updates-march-2025/) - 2M context

### DeepSeek
- [DeepSeek API Documentation](https://api-docs.deepseek.com/) - Official docs
- [DeepSeek Pricing](https://api-docs.deepseek.com/quick_start/pricing) - API costs
- [DeepSeek-V3 GitHub](https://github.com/deepseek-ai/DeepSeek-V3) - Technical details
- [DeepSeek-R1 GitHub](https://github.com/deepseek-ai/DeepSeek-R1) - Reasoning model
- [DeepSeek V3 Technical Report](https://arxiv.org/abs/2412.19437) - Architecture paper

### Open Source Models
- [Llama 4 Model Card](https://github.com/meta-llama/llama-models/blob/main/models/llama4/MODEL_CARD.md) - Meta's official docs
- [Qwen 3 Collection](https://huggingface.co/collections/Qwen/qwen3-67dd247413f0e2e4f653967f) - Hugging Face
- [Mistral AI Models](https://docs.mistral.ai/getting-started/models/models_overview/) - Official documentation

### Benchmark & Comparison Sources
- [Artificial Analysis Leaderboard](https://artificialanalysis.ai/leaderboards/models) - Independent benchmarks
- [LMArena Leaderboard](https://lmarena.ai/) - Human preference rankings
- [Vellum LLM Leaderboard](https://www.vellum.ai/llm-leaderboard) - Benchmark comparisons

---

*Last updated: February 2026*
