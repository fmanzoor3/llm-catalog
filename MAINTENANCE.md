# LLM Catalog Maintenance Guide

## Overview
This catalog uses a data-driven architecture. All model information lives in a single JSON file (`data/models.json`), which feeds the HTML page and can be used to update other formats.

## File Structure
```
LLM Catalog/
├── data/
│   ├── models.json        ← Single source of truth (edit this!)
│   └── backups/           ← Auto-created backups
├── index.html             ← Reads from models.json (data embedded)
├── llm-selection-guide.md ← Manual markdown version
├── create_presentation.py ← Generates PowerPoint
├── auto_update.py         ← Update tool (see below)
└── MAINTENANCE.md         ← This file
```

---

## Quick Start: Check for Updates

The easiest way to check for updates:

1. Open `index.html` in your browser
2. Click the **"Check for Updates"** button (bottom-right corner)
3. Click **"Open All Sources"** to view the latest benchmark leaderboards
4. Review the latest rankings on each site
5. Run `python auto_update.py` in your terminal to update the data

---

## Alternative: Using the CLI Tool

You can also use `auto_update.py` from the command line:

```bash
# Interactive menu (recommended)
python auto_update.py

# Or use specific commands:
python auto_update.py list              # List all models
python auto_update.py validate          # Check for errors
python auto_update.py sync-html         # Sync JSON to HTML
python auto_update.py set-date          # Update to today's date
python auto_update.py open-sources      # Open benchmark sites in browser
python auto_update.py add-model         # Add a new model interactively
python auto_update.py update-benchmark  # Update a benchmark score
```

### Updating a Benchmark Score
```bash
# Interactive
python auto_update.py update-benchmark

# Direct command
python auto_update.py update-benchmark claude-opus-4.5 sweBenchVerified 81.5
```

### Monthly Update Workflow
1. Run `python auto_update.py open-sources benchmarks` to open leaderboards
2. Check for any score changes
3. Run `python auto_update.py` and use option 3 to update scores
4. Use option 4 to update the date
5. Run `python auto_update.py validate` to check for errors

---

## Monthly Update Checklist

### Option A: Using the Update Tool (Recommended)

```bash
# 1. Open all sources in browser
python auto_update.py open-sources

# 2. Run interactive menu
python auto_update.py

# 3. Use menu options to:
#    - Add new models (option 2)
#    - Update benchmark scores (option 3)
#    - Update date (option 4)
#    - Validate changes (option 6)
```

### Option B: Manual Checklist

#### 1. Check Benchmark Sources
- [ ] [Artificial Analysis Leaderboard](https://artificialanalysis.ai/leaderboards/models) - Check top rankings
- [ ] [Vellum LLM Leaderboard](https://www.vellum.ai/llm-leaderboard) - Check benchmark scores
- [ ] [LMArena](https://lmarena.ai/) - Check human preference rankings

#### 2. Cross-Reference Comparison Sites for New Models
- [ ] [Artificial Analysis](https://artificialanalysis.ai/leaderboards/models) - Compare their model list against ours
- [ ] [Arena.ai Leaderboard](https://arena.ai/leaderboard) - Check for new models in rankings
- [ ] [llm-stats.com](https://llm-stats.com) - Check for models we're missing
- Evaluate any gaps against our inclusion criteria (see RESEARCH_NOTES.md §4)

#### 3. Check Provider Blogs for New Releases
- [ ] [OpenAI Blog](https://openai.com/blog/) - New GPT models?
- [ ] [Anthropic News](https://www.anthropic.com/news) - New Claude models?
- [ ] [Google AI Blog](https://blog.google/technology/ai/) - New Gemini models?
- [ ] [DeepSeek GitHub](https://github.com/deepseek-ai) - New releases?

#### 3. Verify Pricing
- [ ] [Anthropic Pricing](https://www.anthropic.com/pricing)
- [ ] [OpenAI Pricing](https://openai.com/api/pricing/)
- [ ] [Google AI Pricing](https://ai.google.dev/pricing)
- [ ] [DeepSeek Pricing](https://api-docs.deepseek.com/quick_start/pricing)

#### 4. Update data/models.json
- Update `lastUpdated` field
- Update `dataSources.lastVerified` field
- Add new models if released
- Update benchmark scores if changed
- Update recommendations if rankings changed

#### 5. Sync HTML
```bash
python auto_update.py sync-html
```

#### 6. Test Changes
- Open `index.html` in browser
- Verify data loads correctly
- Test filtering works
- Check all references links work

#### 7. Commit Changes
```bash
git add data/models.json index.html
git commit -m "Monthly update: [describe changes]"
```

---

## How to Update

### Adding a New Model

**Using the tool (recommended):**
```bash
python auto_update.py add-model
```

**Manually:**
1. Open `data/models.json`
2. Add entry to the `models` array:
```json
{
  "id": "model-id",
  "name": "Display Name",
  "provider": "provider-id",
  "costTier": "low|mid|high|self-hosted",
  "contextWindow": 128000,
  "benchmarks": {
    "sweBenchVerified": 80.0
  },
  "bestFor": ["coding", "reasoning"],
  "description": "Short description"
}
```
3. Run `python auto_update.py sync-html` to update the HTML
4. Update relevant `useCases` recommendations if the model should be recommended

### Updating Benchmark Scores

**Using the tool (recommended):**
```bash
python auto_update.py update-benchmark gpt-5.2 aime2025 100
```

**Manually:**
1. Find the model in `data/models.json`
2. Update the `benchmarks` object
3. Update `lastUpdated` and `dataSources.lastVerified`
4. Run `python auto_update.py sync-html`

### Updating Recommendations
1. Find the use case in `useCases` section
2. Update the `models` array with model IDs in order of preference
3. Update `topPick` to the best model ID
4. Update `reason` text if needed
5. Run `python auto_update.py sync-html`

### Updating Provider Info
1. Find the provider in `providers` section
2. Update `strengths`, `tradeoffs`, `tagline` as needed
3. Run `python auto_update.py sync-html`

---

## Regenerating PowerPoint
After updating the JSON, regenerate the PowerPoint:
```bash
python create_presentation.py
```
Note: The PowerPoint currently uses hardcoded data. For a fully automated workflow, the script would need to be updated to read from models.json.

---

## Validation

Always validate after making changes:
```bash
python auto_update.py validate
```

This checks:
- Required fields are present
- All model IDs are unique
- Use case recommendations reference valid models
- Providers are properly defined

---

## Backups

The update tool automatically creates backups in `data/backups/` before saving changes. To restore from a backup:
```bash
cp data/backups/models_YYYYMMDD_HHMMSS.json data/models.json
python auto_update.py sync-html
```

---

## Future Improvements

### API Integration
If Artificial Analysis or similar services offer APIs, integrate them for real-time data fetching.

### CI/CD
- GitHub Action to remind maintainers monthly
- Automated link checking
- JSON schema validation

---

## Contact
For questions about this catalog, contact the team that maintains it.

*Last updated: 2026-02-02*
