#!/usr/bin/env python3
"""
LLM Catalog Update Tool

A CLI tool to help maintain the LLM catalog with both automated and manual update capabilities.

Usage:
    python auto_update.py                    # Interactive menu
    python auto_update.py sync-html          # Sync JSON data to HTML
    python auto_update.py add-model          # Add a new model interactively
    python auto_update.py update-benchmark   # Update a benchmark score
    python auto_update.py set-date           # Update lastUpdated date
    python auto_update.py validate           # Validate JSON structure
    python auto_update.py open-sources       # Open benchmark sources in browser

Requirements:
    pip install requests (optional, for URL validation)
"""

import json
import re
import sys
import webbrowser
from datetime import datetime
from pathlib import Path
from typing import Any


# Configuration
DATA_FILE = Path(__file__).parent / "data" / "models.json"
HTML_FILE = Path(__file__).parent / "index.html"
BACKUP_DIR = Path(__file__).parent / "data" / "backups"

# Benchmark sources to check
BENCHMARK_SOURCES = [
    ("Artificial Analysis Leaderboard", "https://artificialanalysis.ai/leaderboards/models"),
    ("Vellum LLM Leaderboard", "https://www.vellum.ai/llm-leaderboard"),
    ("LMArena Human Rankings", "https://lmarena.ai/"),
]

# Provider pricing pages
PRICING_SOURCES = [
    ("Anthropic Pricing", "https://www.anthropic.com/pricing"),
    ("OpenAI Pricing", "https://openai.com/api/pricing/"),
    ("Google AI Pricing", "https://ai.google.dev/pricing"),
    ("DeepSeek Pricing", "https://api-docs.deepseek.com/quick_start/pricing"),
]

# Provider news/blog pages for new model announcements
NEWS_SOURCES = [
    ("OpenAI Blog", "https://openai.com/blog/"),
    ("Anthropic News", "https://www.anthropic.com/news"),
    ("Google AI Blog", "https://blog.google/technology/ai/"),
    ("DeepSeek GitHub", "https://github.com/deepseek-ai"),
]


class CatalogUpdater:
    """Tool for updating the LLM catalog"""

    def __init__(self):
        self.data = self._load_data()

    def _load_data(self) -> dict[str, Any]:
        """Load current models.json"""
        if DATA_FILE.exists():
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        return {}

    def _save_data(self, create_backup: bool = True) -> None:
        """Save models.json with optional backup"""
        if create_backup:
            BACKUP_DIR.mkdir(exist_ok=True)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_file = BACKUP_DIR / f"models_{timestamp}.json"
            with open(backup_file, "w", encoding="utf-8") as f:
                json.dump(self._load_data(), f, indent=2)
            print(f"  Backup: {backup_file}")

        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(self.data, f, indent=2)
        print(f"  Saved: {DATA_FILE}")

    def sync_html(self) -> bool:
        """Sync JSON data to HTML file (embedded approach)"""
        print("\nSyncing JSON data to HTML...")

        if not HTML_FILE.exists():
            print("  ERROR: index.html not found")
            return False

        with open(HTML_FILE, "r", encoding="utf-8") as f:
            html_content = f.read()

        # Find and replace the embedded JSON data
        pattern = r'const modelData = \{.*?\};'
        json_str = json.dumps(self.data, separators=(',', ':'))
        replacement = f'const modelData = {json_str};'

        new_html, count = re.subn(pattern, replacement, html_content, flags=re.DOTALL)

        if count > 0:
            with open(HTML_FILE, "w", encoding="utf-8") as f:
                f.write(new_html)
            print(f"  Updated embedded data in index.html")
            return True
        else:
            print("  WARNING: Could not find modelData pattern in HTML")
            return False

    def set_date(self, date_str: str | None = None) -> None:
        """Update the lastUpdated date"""
        if date_str is None:
            date_str = datetime.now().strftime("%Y-%m-%d")

        old_date = self.data.get("lastUpdated", "not set")
        self.data["lastUpdated"] = date_str

        if "dataSources" not in self.data:
            self.data["dataSources"] = {}
        self.data["dataSources"]["lastVerified"] = date_str

        print(f"\nUpdated date: {old_date} -> {date_str}")
        self._save_data()
        self.sync_html()

    def list_models(self) -> None:
        """List all models in the catalog"""
        print("\n" + "=" * 60)
        print("Models in Catalog")
        print("=" * 60)

        models = self.data.get("models", [])
        by_provider: dict[str, list] = {}

        for model in models:
            provider = model.get("provider", "unknown")
            if provider not in by_provider:
                by_provider[provider] = []
            by_provider[provider].append(model)

        for provider, provider_models in sorted(by_provider.items()):
            provider_name = self.data.get("providers", {}).get(provider, {}).get("name", provider)
            print(f"\n{provider_name}:")
            for m in provider_models:
                benchmarks = m.get("benchmarks", {})
                bench_str = ", ".join(f"{k}:{v}" for k, v in benchmarks.items()) if benchmarks else "no benchmarks"
                print(f"  - {m['id']}: {m['name']} ({m['costTier']}) [{bench_str}]")

        print(f"\nTotal: {len(models)} models")

    def update_benchmark(self, model_id: str, benchmark: str, value: float) -> bool:
        """Update a specific benchmark for a model"""
        models = self.data.get("models", [])

        for model in models:
            if model["id"] == model_id:
                if "benchmarks" not in model:
                    model["benchmarks"] = {}

                old_value = model["benchmarks"].get(benchmark, "not set")
                model["benchmarks"][benchmark] = value

                print(f"\nUpdated {model_id} {benchmark}: {old_value} -> {value}")
                self._save_data()
                self.sync_html()
                return True

        print(f"\nERROR: Model '{model_id}' not found")
        return False

    def add_model(self, model_data: dict) -> bool:
        """Add a new model to the catalog"""
        required = ["id", "name", "provider", "costTier"]
        for field in required:
            if field not in model_data:
                print(f"ERROR: Missing required field '{field}'")
                return False

        # Check if model already exists
        existing_ids = [m["id"] for m in self.data.get("models", [])]
        if model_data["id"] in existing_ids:
            print(f"ERROR: Model '{model_data['id']}' already exists")
            return False

        # Set defaults
        model_data.setdefault("contextWindow", 128000)
        model_data.setdefault("benchmarks", {})
        model_data.setdefault("bestFor", [])
        model_data.setdefault("description", "")

        self.data["models"].append(model_data)

        print(f"\nAdded model: {model_data['id']}")
        self._save_data()
        self.sync_html()
        return True

    def validate(self) -> bool:
        """Validate the JSON structure"""
        print("\nValidating models.json...")
        errors = []
        warnings = []

        # Check required top-level keys
        required_keys = ["lastUpdated", "providers", "models", "useCases"]
        for key in required_keys:
            if key not in self.data:
                errors.append(f"Missing required key: {key}")

        # Check providers
        providers = self.data.get("providers", {})
        for pid, pdata in providers.items():
            if "name" not in pdata:
                errors.append(f"Provider '{pid}' missing 'name'")

        # Check models
        models = self.data.get("models", [])
        model_ids = set()
        valid_providers = set(providers.keys())

        for model in models:
            mid = model.get("id", "UNKNOWN")

            if mid in model_ids:
                errors.append(f"Duplicate model ID: {mid}")
            model_ids.add(mid)

            if "name" not in model:
                errors.append(f"Model '{mid}' missing 'name'")
            if "provider" not in model:
                errors.append(f"Model '{mid}' missing 'provider'")
            elif model["provider"] not in valid_providers:
                warnings.append(f"Model '{mid}' has unknown provider: {model['provider']}")
            if "costTier" not in model:
                errors.append(f"Model '{mid}' missing 'costTier'")

            if not model.get("benchmarks"):
                warnings.append(f"Model '{mid}' has no benchmark data")

        # Check use cases reference valid models
        use_cases = self.data.get("useCases", {})
        for uc_id, uc_data in use_cases.items():
            recs = uc_data.get("recommendations", {})
            for priority, rec in recs.items():
                for rec_model in rec.get("models", []):
                    if rec_model not in model_ids:
                        errors.append(f"Use case '{uc_id}/{priority}' references unknown model: {rec_model}")

        # Report results
        print()
        if errors:
            print(f"ERRORS ({len(errors)}):")
            for e in errors:
                print(f"  - {e}")

        if warnings:
            print(f"\nWARNINGS ({len(warnings)}):")
            for w in warnings:
                print(f"  - {w}")

        if not errors and not warnings:
            print("All checks passed!")

        return len(errors) == 0

    def open_sources(self, source_type: str = "all") -> None:
        """Open benchmark/pricing sources in browser"""
        sources = []

        if source_type in ("all", "benchmarks"):
            sources.extend(BENCHMARK_SOURCES)
        if source_type in ("all", "pricing"):
            sources.extend(PRICING_SOURCES)
        if source_type in ("all", "news"):
            sources.extend(NEWS_SOURCES)

        print(f"\nOpening {len(sources)} source(s) in browser...")
        for name, url in sources:
            print(f"  - {name}")
            webbrowser.open(url)

    def interactive_add_model(self) -> None:
        """Interactive prompt to add a new model"""
        print("\n" + "=" * 60)
        print("Add New Model")
        print("=" * 60)

        # List providers
        providers = self.data.get("providers", {})
        print("\nAvailable providers:")
        for pid, pdata in providers.items():
            print(f"  - {pid}: {pdata.get('name', pid)}")

        print()
        model_id = input("Model ID (e.g., 'gpt-5.3'): ").strip()
        if not model_id:
            print("Cancelled.")
            return

        name = input("Display name (e.g., 'GPT-5.3'): ").strip()
        provider = input("Provider ID: ").strip()
        cost_tier = input("Cost tier (low/mid/high/self-hosted): ").strip()
        context = input("Context window (default 128000): ").strip()
        description = input("Short description: ").strip()
        best_for = input("Best for (comma-separated, e.g., 'coding,reasoning'): ").strip()

        model_data = {
            "id": model_id,
            "name": name,
            "provider": provider,
            "costTier": cost_tier,
            "contextWindow": int(context) if context else 128000,
            "benchmarks": {},
            "bestFor": [x.strip() for x in best_for.split(",")] if best_for else [],
            "description": description,
        }

        print(f"\nModel data:")
        print(json.dumps(model_data, indent=2))

        confirm = input("\nAdd this model? (y/n): ").strip().lower()
        if confirm == "y":
            self.add_model(model_data)
        else:
            print("Cancelled.")

    def interactive_update_benchmark(self) -> None:
        """Interactive prompt to update a benchmark"""
        print("\n" + "=" * 60)
        print("Update Benchmark")
        print("=" * 60)

        self.list_models()

        print("\nCommon benchmarks: sweBenchVerified, aime2025, arcAgi2, gpqaDiamond, mmlu")
        print()

        model_id = input("Model ID: ").strip()
        benchmark = input("Benchmark name: ").strip()
        value = input("New value: ").strip()

        if model_id and benchmark and value:
            try:
                self.update_benchmark(model_id, benchmark, float(value))
            except ValueError:
                print("ERROR: Value must be a number")
        else:
            print("Cancelled.")


def interactive_menu(updater: CatalogUpdater) -> None:
    """Show interactive menu"""
    while True:
        print("\n" + "=" * 60)
        print("LLM Catalog Update Tool")
        print("=" * 60)
        print(f"Last updated: {updater.data.get('lastUpdated', 'unknown')}")
        print(f"Models: {len(updater.data.get('models', []))}")
        print()
        print("Commands:")
        print("  1. List all models")
        print("  2. Add new model")
        print("  3. Update benchmark score")
        print("  4. Update date to today")
        print("  5. Sync JSON to HTML")
        print("  6. Validate JSON structure")
        print("  7. Open benchmark sources (browser)")
        print("  8. Open pricing pages (browser)")
        print("  9. Open news/blog pages (browser)")
        print("  q. Quit")
        print()

        choice = input("Choice: ").strip().lower()

        if choice == "1":
            updater.list_models()
        elif choice == "2":
            updater.interactive_add_model()
        elif choice == "3":
            updater.interactive_update_benchmark()
        elif choice == "4":
            updater.set_date()
        elif choice == "5":
            updater.sync_html()
        elif choice == "6":
            updater.validate()
        elif choice == "7":
            updater.open_sources("benchmarks")
        elif choice == "8":
            updater.open_sources("pricing")
        elif choice == "9":
            updater.open_sources("news")
        elif choice == "q":
            print("\nGoodbye!")
            break
        else:
            print("Invalid choice")


def main():
    """Main entry point"""
    updater = CatalogUpdater()

    if len(sys.argv) < 2:
        interactive_menu(updater)
        return

    command = sys.argv[1]

    if command == "sync-html":
        updater.sync_html()

    elif command == "add-model":
        updater.interactive_add_model()

    elif command == "update-benchmark":
        if len(sys.argv) >= 5:
            model_id = sys.argv[2]
            benchmark = sys.argv[3]
            value = float(sys.argv[4])
            updater.update_benchmark(model_id, benchmark, value)
        else:
            updater.interactive_update_benchmark()

    elif command == "set-date":
        date_str = sys.argv[2] if len(sys.argv) > 2 else None
        updater.set_date(date_str)

    elif command == "validate":
        valid = updater.validate()
        sys.exit(0 if valid else 1)

    elif command == "list":
        updater.list_models()

    elif command == "open-sources":
        source_type = sys.argv[2] if len(sys.argv) > 2 else "all"
        updater.open_sources(source_type)

    elif command in ("--help", "-h", "help"):
        print(__doc__)

    else:
        print(f"Unknown command: {command}")
        print("Run with --help for usage")
        sys.exit(1)


if __name__ == "__main__":
    main()
