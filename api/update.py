from http.server import BaseHTTPRequestHandler
import json
import os
import urllib.request
import urllib.error
from datetime import datetime

PERPLEXITY_API_KEY = os.environ.get('PERPLEXITY_API_KEY')

PROMPT = """Search the web for the CURRENT flagship LLM models from these 5 providers.
I need you to find SPECIFIC information for EACH provider - do not skip any.

## REQUIRED: Search for each provider separately

### 1. ANTHROPIC (search: "Claude models Anthropic current")
Find the current versions of:
- Claude Opus (their most capable model)
- Claude Sonnet (their balanced model)
- Claude Haiku (their fast/cheap model)
For each: What version number? What's the context window? Any SWE-bench scores?

### 2. OPENAI (search: "OpenAI GPT models current API")
Find the current versions of:
- Their flagship model (GPT-4o? GPT-5?)
- Their reasoning models (o1? o3? o4?)
- Their budget option (mini variants)
For each: What's the latest version? Context window?

### 3. GOOGLE (search: "Google Gemini models current")
Find the current versions of:
- Gemini Pro (their flagship)
- Gemini Flash (their fast/cheap option)
For each: What version (2.0? 2.5? 3.0?)? Context window?

### 4. DEEPSEEK (search: "DeepSeek models V3 R1 current")
Find the current versions of:
- DeepSeek V3 (what's the latest? V3.1? V3.2?)
- DeepSeek R1 (reasoning model)
For each: Context window? Any benchmark scores?

### 5. OPEN SOURCE (search: "Llama 4 Qwen Mistral latest models")
Find current flagship models from:
- Meta Llama (Llama 3? Llama 4?)
- Alibaba Qwen (Qwen 2? Qwen 3?)
- Mistral AI

## OUTPUT FORMAT
Return ONLY this JSON structure (no markdown, no explanation):
{
  "lastUpdated": "YYYY-MM-DD",
  "models": [
    {
      "id": "claude-opus-4.5",
      "name": "Claude Opus 4.5",
      "provider": "anthropic",
      "costTier": "high",
      "contextWindow": 200000,
      "benchmarks": {"sweBenchVerified": 80.0},
      "bestFor": ["coding", "reasoning"],
      "description": "One line description"
    }
  ],
  "sources": [
    {"name": "Source name", "url": "https://..."}
  ],
  "summary": "Brief summary of what's new"
}

Provider values: "openai", "anthropic", "google", "deepseek", "opensource"
CostTier values: "low", "mid", "high", "self-hosted"

IMPORTANT:
- Include at least 2 models from EACH of the 5 providers (minimum 10 models total)
- Include the URLs of the sources you used to find this information in the "sources" array
- Use today's date. Only include models currently available via API."""


def fetch_from_perplexity():
    """Call Perplexity API to get latest LLM data"""
    if not PERPLEXITY_API_KEY:
        return None, "PERPLEXITY_API_KEY not configured"

    url = "https://api.perplexity.ai/chat/completions"

    payload = {
        "model": "sonar-pro",
        "messages": [
            {
                "role": "system",
                "content": "You are a research assistant. Search the web thoroughly for each provider mentioned. Return ONLY valid JSON with no markdown formatting, no code blocks, no explanation - just the raw JSON object."
            },
            {
                "role": "user",
                "content": PROMPT
            }
        ],
        "temperature": 0.1,
        "max_tokens": 8000
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

        with urllib.request.urlopen(req, timeout=60) as response:
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
            return data, None

    except urllib.error.HTTPError as e:
        return None, f"Perplexity API error: {e.code} - {e.reason}"
    except json.JSONDecodeError as e:
        return None, f"Failed to parse response as JSON: {str(e)}"
    except Exception as e:
        return None, f"Error: {str(e)}"


def build_full_catalog(perplexity_data):
    """Build full catalog structure from Perplexity response"""

    models = perplexity_data.get('models', [])

    # Build provider info based on models found
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
    coding_quality = [m['id'] for m in models if 'coding' in m.get('bestFor', []) and m['costTier'] == 'high'][:3]
    coding_budget = [m['id'] for m in models if 'coding' in m.get('bestFor', []) and m['costTier'] == 'low'][:3]

    general_quality = [m['id'] for m in models if m['costTier'] == 'high'][:3]
    general_budget = [m['id'] for m in models if m['costTier'] == 'low'][:3]

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
            "method": "Perplexity AI web search"
        },
        "providers": providers,
        "models": models,
        "useCases": use_cases,
        "quickDecisions": quick_decisions,
        "summary": perplexity_data.get('summary', 'Data fetched from web sources'),
        "sources": perplexity_data.get('sources', []),
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

        # Try to fetch from Perplexity
        perplexity_data, error = fetch_from_perplexity()

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
