from http.server import BaseHTTPRequestHandler
import json
import os
import urllib.request
import urllib.error
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

PERPLEXITY_API_KEY = os.environ.get('PERPLEXITY_API_KEY')

# Provider-specific prompts for focused, deep research
PROVIDER_PROMPTS = {
    "anthropic": """Search the web for the CURRENT Claude models from Anthropic (as of today).

Search queries to use:
- "Anthropic Claude models 2026"
- "Claude Opus Sonnet Haiku latest version"
- "Claude API models documentation"

Find these specific models:
1. Claude Opus - their most capable/intelligent model
2. Claude Sonnet - their balanced model for complex tasks
3. Claude Haiku - their fast, cheap model

For EACH model, find:
- Exact version number (e.g., 4.5, 5.0)
- Context window size
- SWE-bench score if available
- What it's best for

Return ONLY this JSON (no markdown, no explanation):
{
  "models": [
    {
      "id": "claude-opus-4.5",
      "name": "Claude Opus 4.5",
      "provider": "anthropic",
      "costTier": "high",
      "contextWindow": 200000,
      "benchmarks": {"sweBenchVerified": 80.0},
      "bestFor": ["coding", "reasoning"],
      "description": "Brief description"
    }
  ],
  "sources": [{"name": "Source name", "url": "https://..."}]
}

costTier: "high" for Opus, "mid" for Sonnet, "low" for Haiku""",

    "openai": """Search the web for the CURRENT OpenAI GPT models (as of today).

Search queries to use:
- "OpenAI GPT models 2026"
- "GPT-5 GPT-4.1 o3 o4 latest"
- "OpenAI API models documentation"

Find these specific models:
1. GPT-5 series - their latest flagship
2. GPT-4.1 - coding optimized model
3. o3 - their reasoning model
4. o4-mini - fast reasoning model
5. GPT-4o - multimodal model (if still current)

For EACH model, find:
- Exact version number
- Context window size
- Any benchmark scores
- What it's best for

Return ONLY this JSON (no markdown, no explanation):
{
  "models": [
    {
      "id": "gpt-5",
      "name": "GPT-5",
      "provider": "openai",
      "costTier": "high",
      "contextWindow": 128000,
      "benchmarks": {},
      "bestFor": ["general", "reasoning"],
      "description": "Brief description"
    }
  ],
  "sources": [{"name": "Source name", "url": "https://..."}]
}

costTier: "high" for flagship/reasoning, "mid" for standard, "low" for mini variants""",

    "google": """Search the web for the CURRENT Google Gemini models (as of today).

Search queries to use:
- "Google Gemini models 2026"
- "Gemini 2.5 3.0 Pro Flash latest"
- "Google AI Gemini API models"

Find these specific models:
1. Gemini Pro - their most capable model (what version? 2.5? 3.0?)
2. Gemini Flash - their fast, cheap model
3. Any new Gemini models released recently

For EACH model, find:
- Exact version number (2.0, 2.5, 3.0?)
- Context window size (Google has long contexts)
- Any benchmark scores
- What it's best for

Return ONLY this JSON (no markdown, no explanation):
{
  "models": [
    {
      "id": "gemini-2.5-pro",
      "name": "Gemini 2.5 Pro",
      "provider": "google",
      "costTier": "mid",
      "contextWindow": 1000000,
      "benchmarks": {},
      "bestFor": ["long-context", "multimodal"],
      "description": "Brief description"
    }
  ],
  "sources": [{"name": "Source name", "url": "https://..."}]
}

costTier: "mid" for Pro, "low" for Flash""",

    "deepseek": """Search the web for the CURRENT DeepSeek models (as of today).

Search queries to use:
- "DeepSeek V3 R1 models 2026"
- "DeepSeek latest version API"
- "DeepSeek V3.2 R1 benchmarks"

Find these specific models:
1. DeepSeek V3 - their general model (what's the latest? V3.1? V3.2?)
2. DeepSeek R1 - their reasoning model
3. DeepSeek Coder - if it's a separate model

For EACH model, find:
- Exact version number
- Context window size
- AIME or other benchmark scores
- What it's best for
- Pricing tier (they're known for being cheap)

Return ONLY this JSON (no markdown, no explanation):
{
  "models": [
    {
      "id": "deepseek-v3.2",
      "name": "DeepSeek V3.2",
      "provider": "deepseek",
      "costTier": "low",
      "contextWindow": 128000,
      "benchmarks": {},
      "bestFor": ["general", "coding", "budget"],
      "description": "Brief description"
    }
  ],
  "sources": [{"name": "Source name", "url": "https://..."}]
}

costTier: Usually "low" for DeepSeek (they're budget-friendly)""",

    "opensource": """Search the web for the CURRENT open source LLM models (as of today).

Search queries to use:
- "Llama 4 Meta latest 2026"
- "Qwen 3 Alibaba latest model"
- "Mistral AI latest models 2026"

Find the flagship models from:
1. Meta Llama - Llama 4 series (Scout, Maverick, etc.)
2. Alibaba Qwen - Qwen 3 or latest
3. Mistral AI - their latest models

For EACH model, find:
- Exact version/name
- Context window size (Llama 4 Scout has huge context)
- Parameter count
- What it's best for
- Can it be self-hosted?

Return ONLY this JSON (no markdown, no explanation):
{
  "models": [
    {
      "id": "llama-4-maverick",
      "name": "Llama 4 Maverick",
      "provider": "opensource",
      "costTier": "self-hosted",
      "contextWindow": 1000000,
      "benchmarks": {},
      "bestFor": ["privacy", "self-hosting"],
      "description": "Brief description"
    }
  ],
  "sources": [{"name": "Source name", "url": "https://..."}]
}

costTier: "self-hosted" for models you run yourself, "low" if available via cheap API"""
}


def fetch_provider_data(provider_name, prompt):
    """Fetch data for a single provider from Perplexity API"""
    if not PERPLEXITY_API_KEY:
        return provider_name, None, "PERPLEXITY_API_KEY not configured"

    url = "https://api.perplexity.ai/chat/completions"

    payload = {
        "model": "sonar-pro",
        "messages": [
            {
                "role": "system",
                "content": f"You are a research assistant specializing in {provider_name} AI models. Search the web thoroughly and return ONLY valid JSON with no markdown formatting, no code blocks, no explanation - just the raw JSON object."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.1,
        "max_tokens": 4000
    }

    headers = {
        "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
        "Content-Type": "application/json"
    }

    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers=headers,
            method='POST'
        )

        with urllib.request.urlopen(req, timeout=90) as response:
            result = json.loads(response.read().decode('utf-8'))
            content = result['choices'][0]['message']['content']

            # Clean up response - remove markdown code blocks if present
            content = content.strip()
            if content.startswith('```json'):
                content = content[7:]
            if content.startswith('```'):
                content = content[3:]
            if content.endswith('```'):
                content = content[:-3]
            content = content.strip()

            # Parse the JSON
            data = json.loads(content)
            return provider_name, data, None

    except urllib.error.HTTPError as e:
        return provider_name, None, f"API error: {e.code} - {e.reason}"
    except json.JSONDecodeError as e:
        return provider_name, None, f"JSON parse error: {str(e)}"
    except Exception as e:
        return provider_name, None, f"Error: {str(e)}"


def fetch_all_providers():
    """Fetch data from all providers in parallel"""
    all_models = []
    all_sources = []
    errors = []
    summaries = []

    # Use ThreadPoolExecutor for parallel requests
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = {
            executor.submit(fetch_provider_data, provider, prompt): provider
            for provider, prompt in PROVIDER_PROMPTS.items()
        }

        for future in as_completed(futures):
            provider_name = futures[future]
            try:
                provider, data, error = future.result()
                if error:
                    errors.append(f"{provider}: {error}")
                elif data:
                    models = data.get('models', [])
                    sources = data.get('sources', [])

                    all_models.extend(models)
                    all_sources.extend(sources)
                    summaries.append(f"{provider}: {len(models)} models found")
            except Exception as e:
                errors.append(f"{provider_name}: {str(e)}")

    # Build aggregated result
    result = {
        "lastUpdated": datetime.now().strftime('%Y-%m-%d'),
        "models": all_models,
        "sources": all_sources,
        "summary": f"Fetched {len(all_models)} models from {len(PROVIDER_PROMPTS)} providers. " +
                   "; ".join(summaries) if summaries else "No data fetched",
        "errors": errors if errors else None
    }

    return result, None if all_models else "No models found from any provider"


def build_full_catalog(perplexity_data):
    """Build full catalog structure from aggregated Perplexity responses"""

    models = perplexity_data.get('models', [])

    # Build provider info
    providers = {
        "anthropic": {
            "name": "Anthropic",
            "displayName": "Claude (Anthropic)",
            "tagline": "Best for coding & following instructions",
            "strengths": [
                "Excellent at complex, detailed instructions",
                "Industry-leading code generation",
                "Natural, human-like conversation",
                "Extended thinking for deep analysis"
            ],
            "tradeoffs": "More expensive than DeepSeek/Gemini",
            "docsUrl": "https://docs.anthropic.com/en/docs/about-claude/models/all-models",
            "pricingUrl": "https://www.anthropic.com/pricing"
        },
        "openai": {
            "name": "OpenAI",
            "displayName": "OpenAI (GPT)",
            "tagline": "Most widely used, strong ecosystem",
            "strengths": [
                "Most widely used, extensive ecosystem",
                "Strong reasoning models (o-series)",
                "Good integrations with Microsoft tools"
            ],
            "tradeoffs": "Premium pricing",
            "docsUrl": "https://platform.openai.com/docs/models",
            "pricingUrl": "https://openai.com/api/pricing/"
        },
        "google": {
            "name": "Google",
            "displayName": "Google (Gemini)",
            "tagline": "Long context & Google integration",
            "strengths": [
                "Longest context windows",
                "Native Google Workspace integration",
                "Good price-performance ratio"
            ],
            "tradeoffs": "Less consistent on complex reasoning",
            "docsUrl": "https://ai.google.dev/gemini-api/docs/models/gemini",
            "pricingUrl": "https://ai.google.dev/pricing"
        },
        "deepseek": {
            "name": "DeepSeek",
            "displayName": "DeepSeek",
            "tagline": "Incredible value - 10-30x cheaper",
            "strengths": [
                "Quality comparable to top models",
                "Fraction of competitors' cost",
                "Open source (can self-host)"
            ],
            "tradeoffs": "Chinese company (compliance considerations)",
            "docsUrl": "https://api-docs.deepseek.com/",
            "pricingUrl": "https://api-docs.deepseek.com/quick_start/pricing"
        },
        "opensource": {
            "name": "Open Source",
            "displayName": "Open Source (Llama, Qwen, Mistral)",
            "tagline": "Self-host for privacy & control",
            "strengths": [
                "Full data privacy - your infrastructure",
                "No per-token API costs",
                "Customizable & fine-tunable"
            ],
            "tradeoffs": "Requires GPUs & technical expertise",
            "docsUrl": "https://github.com/meta-llama/llama-models",
            "pricingUrl": None
        }
    }

    # Build use case recommendations based on models
    coding_quality = [m['id'] for m in models if 'coding' in m.get('bestFor', []) and m.get('costTier') == 'high'][:3]
    coding_budget = [m['id'] for m in models if 'coding' in m.get('bestFor', []) and m.get('costTier') == 'low'][:3]

    general_quality = [m['id'] for m in models if m.get('costTier') == 'high'][:3]
    general_budget = [m['id'] for m in models if m.get('costTier') == 'low'][:3]

    use_cases = {
        "coding": {
            "name": "Code Generation & Review",
            "recommendations": {
                "quality": {
                    "models": coding_quality or general_quality,
                    "topPick": (coding_quality or general_quality or [''])[0],
                    "reason": "Best coding benchmark scores"
                },
                "cost": {
                    "models": coding_budget or general_budget,
                    "topPick": (coding_budget or general_budget or [''])[0],
                    "reason": "Good coding at low cost"
                }
            }
        },
        "general": {
            "name": "General Tasks",
            "recommendations": {
                "quality": {
                    "models": general_quality,
                    "topPick": (general_quality or [''])[0],
                    "reason": "Best overall quality"
                },
                "cost": {
                    "models": general_budget,
                    "topPick": (general_budget or [''])[0],
                    "reason": "Best value"
                }
            }
        }
    }

    # Quick decisions
    quick_decisions = [
        {"priority": "Lowest cost", "recommendations": general_budget[:3]},
        {"priority": "Highest quality", "recommendations": general_quality[:3]},
        {"priority": "Best for coding", "recommendations": coding_quality[:3] or general_quality[:3]}
    ]

    return {
        "lastUpdated": perplexity_data.get('lastUpdated', datetime.now().strftime('%Y-%m-%d')),
        "dataSources": {
            "benchmarks": "https://artificialanalysis.ai/leaderboards/models",
            "pricing": "Official provider pricing pages",
            "lastVerified": datetime.now().strftime('%Y-%m-%d'),
            "method": "Perplexity AI web search (5 parallel provider queries)"
        },
        "providers": providers,
        "models": models,
        "useCases": use_cases,
        "quickDecisions": quick_decisions,
        "summary": perplexity_data.get('summary', 'Data fetched from web sources'),
        "sources": perplexity_data.get('sources', []),
        "errors": perplexity_data.get('errors'),
        "references": {
            "benchmarks": [
                {"name": "Artificial Analysis", "url": "https://artificialanalysis.ai/leaderboards/models"},
                {"name": "LMArena", "url": "https://lmarena.ai/"},
                {"name": "Vellum Leaderboard", "url": "https://www.vellum.ai/llm-leaderboard"}
            ]
        }
    }


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        # Fetch from all providers in parallel
        perplexity_data, error = fetch_all_providers()

        if error:
            response = {
                "status": "error",
                "message": error,
                "timestamp": datetime.now().isoformat()
            }
        else:
            full_catalog = build_full_catalog(perplexity_data)
            response = {
                "status": "success",
                "timestamp": datetime.now().isoformat(),
                "data": full_catalog
            }

        self.wfile.write(json.dumps(response, indent=2).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
