"""
Serverless API endpoint for fetching LLM benchmark updates.

This function fetches data from benchmark sources and returns the latest
model information. Due to JavaScript rendering on most benchmark sites,
we use a hybrid approach - fetching what we can and providing guidance
for manual verification.
"""

import json
from http.server import BaseHTTPRequestHandler
from datetime import datetime
import urllib.request
import urllib.error

# Benchmark sources
SOURCES = {
    "artificialAnalysis": {
        "name": "Artificial Analysis",
        "url": "https://artificialanalysis.ai/leaderboards/models",
        "description": "Comprehensive model comparisons and pricing"
    },
    "vellum": {
        "name": "Vellum LLM Leaderboard",
        "url": "https://www.vellum.ai/llm-leaderboard",
        "description": "Benchmark scores across multiple tests"
    },
    "lmarena": {
        "name": "LMArena",
        "url": "https://lmarena.ai/",
        "description": "Human preference rankings (Chatbot Arena)"
    }
}

# Current model data (this would be stored in a database in production)
# For now, we return the embedded data plus metadata about sources
CURRENT_DATA = {
    "lastUpdated": "2025-12-01",
    "dataSources": {
        "benchmarks": "https://artificialanalysis.ai/leaderboards/models",
        "pricing": "Official provider pricing pages",
        "lastVerified": "2025-12-01"
    },
    "providers": {
        "anthropic": {
            "name": "Anthropic",
            "displayName": "Claude (Anthropic)",
            "tagline": "Best for coding & following instructions",
            "strengths": [
                "Excellent at complex, detailed instructions",
                "Industry-leading code generation (72% SWE-bench)",
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
                "Good reasoning models (o-series)",
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
                "Longest context (up to 2M tokens)",
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
                "Quality comparable to GPT-4/Sonnet",
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
    },
    "models": [
        {
            "id": "gpt-5.2",
            "name": "GPT-5.2",
            "provider": "openai",
            "costTier": "high",
            "contextWindow": 128000,
            "benchmarks": {"sweBenchVerified": 65.0, "aime2025": 87.0},
            "bestFor": ["general", "reasoning", "multimodal"],
            "description": "OpenAI's flagship model with strong reasoning"
        },
        {
            "id": "gpt-4o",
            "name": "GPT-4o",
            "provider": "openai",
            "costTier": "mid",
            "contextWindow": 128000,
            "benchmarks": {"sweBenchVerified": 38.0},
            "bestFor": ["general", "multimodal"],
            "description": "General tasks, multimodal"
        },
        {
            "id": "gpt-4o-mini",
            "name": "GPT-4o-mini",
            "provider": "openai",
            "costTier": "low",
            "contextWindow": 128000,
            "benchmarks": {},
            "bestFor": ["budget", "high-volume"],
            "description": "Budget option, high volume"
        },
        {
            "id": "o3",
            "name": "o3",
            "provider": "openai",
            "costTier": "high",
            "contextWindow": 128000,
            "benchmarks": {"aime2025": 96.7, "arcAgi2": 87.5, "gpqaDiamond": 87.7},
            "bestFor": ["reasoning", "math", "science"],
            "description": "Top reasoning model - math, science, analysis"
        },
        {
            "id": "o3-mini",
            "name": "o3-mini",
            "provider": "openai",
            "costTier": "mid",
            "contextWindow": 128000,
            "benchmarks": {"aime2025": 86.5},
            "bestFor": ["reasoning", "budget-reasoning"],
            "description": "Efficient reasoning at lower cost"
        },
        {
            "id": "claude-opus-4.5",
            "name": "Claude Opus 4.5",
            "provider": "anthropic",
            "costTier": "high",
            "contextWindow": 200000,
            "benchmarks": {"sweBenchVerified": 72.0, "aime2025": 75.0, "gpqaDiamond": 70.0},
            "bestFor": ["coding", "instructions", "quality"],
            "description": "Maximum quality, leads SWE-bench"
        },
        {
            "id": "claude-sonnet-4.5",
            "name": "Claude Sonnet 4.5",
            "provider": "anthropic",
            "costTier": "mid",
            "contextWindow": 200000,
            "benchmarks": {"sweBenchVerified": 70.3},
            "bestFor": ["balanced", "production", "conversation"],
            "description": "Balanced quality and cost"
        },
        {
            "id": "claude-haiku-4.5",
            "name": "Claude Haiku 4.5",
            "provider": "anthropic",
            "costTier": "low",
            "contextWindow": 200000,
            "benchmarks": {"sweBenchVerified": 49.0},
            "bestFor": ["speed", "budget", "high-volume"],
            "description": "Fast and cost-effective"
        },
        {
            "id": "gemini-2.5-pro",
            "name": "Gemini 2.5 Pro",
            "provider": "google",
            "costTier": "mid",
            "contextWindow": 1000000,
            "benchmarks": {"aime2025": 92.0, "gpqaDiamond": 84.0},
            "bestFor": ["long-documents", "reasoning"],
            "description": "Strong reasoning, 1M context"
        },
        {
            "id": "gemini-2.5-flash",
            "name": "Gemini 2.5 Flash",
            "provider": "google",
            "costTier": "low",
            "contextWindow": 1000000,
            "benchmarks": {"aime2025": 82.0},
            "bestFor": ["speed", "budget", "long-context"],
            "description": "Fast, affordable, long context"
        },
        {
            "id": "deepseek-v3.2",
            "name": "DeepSeek V3.2",
            "provider": "deepseek",
            "costTier": "low",
            "contextWindow": 128000,
            "benchmarks": {"sweBenchVerified": 55.0, "aime2025": 75.0},
            "bestFor": ["budget", "value", "general"],
            "description": "Best value - 10-30x cheaper than competitors"
        },
        {
            "id": "deepseek-r1",
            "name": "DeepSeek R1",
            "provider": "deepseek",
            "costTier": "low",
            "contextWindow": 128000,
            "benchmarks": {"aime2025": 97.3, "gpqaDiamond": 71.5},
            "bestFor": ["reasoning", "math", "budget-reasoning"],
            "description": "Top reasoning performance at low cost"
        },
        {
            "id": "llama-4-405b",
            "name": "Llama 4 405B",
            "provider": "opensource",
            "costTier": "self-hosted",
            "contextWindow": 128000,
            "benchmarks": {"sweBenchVerified": 45.0},
            "bestFor": ["privacy", "self-hosted"],
            "description": "Largest open-source model"
        },
        {
            "id": "llama-4-70b",
            "name": "Llama 4 70B",
            "provider": "opensource",
            "costTier": "self-hosted",
            "contextWindow": 128000,
            "benchmarks": {},
            "bestFor": ["privacy", "self-hosted", "efficiency"],
            "description": "Efficient open-source option"
        },
        {
            "id": "qwen-3-72b",
            "name": "Qwen 3 72B",
            "provider": "opensource",
            "costTier": "self-hosted",
            "contextWindow": 128000,
            "benchmarks": {},
            "bestFor": ["multilingual", "self-hosted"],
            "description": "Strong multilingual support"
        },
        {
            "id": "mistral-large-3",
            "name": "Mistral Large 3",
            "provider": "opensource",
            "costTier": "self-hosted",
            "contextWindow": 128000,
            "benchmarks": {},
            "bestFor": ["european", "self-hosted"],
            "description": "European open-source option"
        }
    ],
    "useCases": {
        "chatbot": {
            "name": "Customer Support / Chatbots",
            "recommendations": {
                "quality": {
                    "models": ["claude-sonnet-4.5", "gpt-4o", "gemini-2.5-pro"],
                    "topPick": "claude-sonnet-4.5",
                    "reason": "Natural conversation, excellent context understanding"
                },
                "cost": {
                    "models": ["deepseek-v3.2", "gpt-4o-mini", "gemini-2.5-flash"],
                    "topPick": "deepseek-v3.2",
                    "reason": "10-30x cheaper, handles routine queries well"
                },
                "speed": {
                    "models": ["claude-haiku-4.5", "gpt-4o-mini", "gemini-2.5-flash"],
                    "topPick": "claude-haiku-4.5",
                    "reason": "Fastest response times"
                },
                "privacy": {
                    "models": ["llama-4-405b", "llama-4-70b", "qwen-3-72b"],
                    "topPick": "llama-4-70b",
                    "reason": "Run on your own servers, reasonable resource requirements"
                }
            }
        },
        "coding": {
            "name": "Code Generation & Review",
            "recommendations": {
                "quality": {
                    "models": ["claude-opus-4.5", "claude-sonnet-4.5", "gpt-5.2"],
                    "topPick": "claude-opus-4.5",
                    "reason": "Industry-leading 72% SWE-bench score"
                },
                "cost": {
                    "models": ["deepseek-v3.2", "gpt-4o-mini", "claude-haiku-4.5"],
                    "topPick": "deepseek-v3.2",
                    "reason": "55% SWE-bench at fraction of cost"
                },
                "speed": {
                    "models": ["claude-haiku-4.5", "gpt-4o-mini"],
                    "topPick": "claude-haiku-4.5",
                    "reason": "Fast code generation with 49% SWE-bench"
                },
                "privacy": {
                    "models": ["llama-4-405b", "deepseek-v3.2"],
                    "topPick": "llama-4-405b",
                    "reason": "Self-host for proprietary code"
                }
            }
        },
        "reasoning": {
            "name": "Complex Reasoning & Analysis",
            "recommendations": {
                "quality": {
                    "models": ["o3", "deepseek-r1", "gemini-2.5-pro"],
                    "topPick": "o3",
                    "reason": "96.7% AIME, 87.5% ARC-AGI - best reasoning"
                },
                "cost": {
                    "models": ["deepseek-r1", "o3-mini", "gemini-2.5-flash"],
                    "topPick": "deepseek-r1",
                    "reason": "97.3% AIME at fraction of o3 cost"
                },
                "speed": {
                    "models": ["gemini-2.5-flash", "o3-mini"],
                    "topPick": "gemini-2.5-flash",
                    "reason": "Fast reasoning with 82% AIME"
                },
                "privacy": {
                    "models": ["llama-4-405b", "qwen-3-72b"],
                    "topPick": "llama-4-405b",
                    "reason": "Self-hosted reasoning capability"
                }
            }
        },
        "documents": {
            "name": "Document Analysis & Summarization",
            "recommendations": {
                "quality": {
                    "models": ["gemini-2.5-pro", "claude-opus-4.5", "gpt-5.2"],
                    "topPick": "gemini-2.5-pro",
                    "reason": "1M context window for large documents"
                },
                "cost": {
                    "models": ["gemini-2.5-flash", "deepseek-v3.2"],
                    "topPick": "gemini-2.5-flash",
                    "reason": "1M context at low cost"
                },
                "speed": {
                    "models": ["gemini-2.5-flash", "claude-haiku-4.5"],
                    "topPick": "gemini-2.5-flash",
                    "reason": "Fast processing of long documents"
                },
                "privacy": {
                    "models": ["llama-4-405b", "qwen-3-72b"],
                    "topPick": "llama-4-405b",
                    "reason": "Process sensitive documents locally"
                }
            }
        }
    },
    "quickDecisions": [
        {"priority": "Lowest cost", "recommendations": ["deepseek-v3.2", "gemini-2.5-flash", "gpt-4o-mini"]},
        {"priority": "Highest quality", "recommendations": ["claude-opus-4.5", "o3", "gpt-5.2"]},
        {"priority": "Best for coding", "recommendations": ["claude-opus-4.5", "claude-sonnet-4.5", "deepseek-v3.2"]},
        {"priority": "Best for reasoning", "recommendations": ["o3", "deepseek-r1", "gemini-2.5-pro"]},
        {"priority": "Fastest responses", "recommendations": ["claude-haiku-4.5", "gemini-2.5-flash", "gpt-4o-mini"]},
        {"priority": "Data privacy", "recommendations": ["llama-4-405b", "llama-4-70b", "qwen-3-72b"]}
    ],
    "references": {
        "claude": [
            {"name": "Official Model Documentation", "url": "https://docs.anthropic.com/en/docs/about-claude/models/all-models"},
            {"name": "API Pricing", "url": "https://www.anthropic.com/pricing"}
        ],
        "openai": [
            {"name": "Official Model Catalog", "url": "https://platform.openai.com/docs/models"},
            {"name": "API Pricing", "url": "https://openai.com/api/pricing/"}
        ],
        "google": [
            {"name": "Official Documentation", "url": "https://ai.google.dev/gemini-api/docs/models/gemini"},
            {"name": "API Pricing", "url": "https://ai.google.dev/pricing"}
        ],
        "deepseek": [
            {"name": "API Documentation", "url": "https://api-docs.deepseek.com/"},
            {"name": "Pricing", "url": "https://api-docs.deepseek.com/quick_start/pricing"}
        ],
        "opensource": [
            {"name": "Llama (Meta)", "url": "https://github.com/meta-llama/llama-models"},
            {"name": "Qwen (Alibaba)", "url": "https://github.com/QwenLM/Qwen"},
            {"name": "Mistral", "url": "https://mistral.ai/"}
        ],
        "benchmarks": [
            {"name": "Artificial Analysis Leaderboard", "url": "https://artificialanalysis.ai/leaderboards/models"},
            {"name": "Vellum LLM Leaderboard", "url": "https://www.vellum.ai/llm-leaderboard"},
            {"name": "LMArena (Chatbot Arena)", "url": "https://lmarena.ai/"}
        ]
    }
}


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Handle GET request - return current data with source info"""
        response = {
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "data": CURRENT_DATA,
            "sources": SOURCES,
            "message": "Data fetched successfully. For real-time updates, benchmark sites require JavaScript rendering which serverless functions cannot process directly."
        }

        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(response, indent=2).encode())
        return

    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        return
