# LLM Catalog Maintenance Guide

## Overview
This catalog uses a data-driven architecture. All model information lives in a single JSON file (`data/models.json`), which feeds the HTML page and can be used to update other formats.

## File Structure
```
LLM Catalog/
├── data/
│   └── models.json        ← Single source of truth (edit this!)
├── index.html             ← Reads from models.json
├── llm-selection-guide.md ← Manual markdown version
├── create_presentation.py ← Generates PowerPoint
└── MAINTENANCE.md         ← This file
```

---

## Monthly Update Checklist

### 1. Check Benchmark Sources (5-10 min)
- [ ] [Artificial Analysis Leaderboard](https://artificialanalysis.ai/leaderboards/models) - Check top rankings
- [ ] [Vellum LLM Leaderboard](https://www.vellum.ai/llm-leaderboard) - Check benchmark scores
- [ ] [LMArena](https://lmarena.ai/) - Check human preference rankings

### 2. Check for New Model Releases (5-10 min)
- [ ] [OpenAI Blog](https://openai.com/blog/) - New GPT models?
- [ ] [Anthropic News](https://www.anthropic.com/news) - New Claude models?
- [ ] [Google AI Blog](https://blog.google/technology/ai/) - New Gemini models?
- [ ] [DeepSeek GitHub](https://github.com/deepseek-ai) - New releases?

### 3. Verify Pricing (5 min)
- [ ] [Anthropic Pricing](https://www.anthropic.com/pricing)
- [ ] [OpenAI Pricing](https://openai.com/api/pricing/)
- [ ] [Google AI Pricing](https://ai.google.dev/pricing)
- [ ] [DeepSeek Pricing](https://api-docs.deepseek.com/quick_start/pricing)

### 4. Update data/models.json
- Update `lastUpdated` field
- Update `dataSources.lastVerified` field
- Add new models if released
- Update benchmark scores if changed
- Update recommendations if rankings changed

### 5. Test Changes
- Open `index.html` in browser
- Verify data loads correctly
- Test filtering works
- Check all references links work

### 6. Commit Changes
```bash
git add data/models.json
git commit -m "Monthly update: [describe changes]"
```

---

## How to Update

### Adding a New Model
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
3. Update relevant `useCases` recommendations if the model should be recommended

### Updating Benchmark Scores
1. Find the model in `data/models.json`
2. Update the `benchmarks` object
3. Update `lastUpdated` and `dataSources.lastVerified`

### Updating Recommendations
1. Find the use case in `useCases` section
2. Update the `models` array with model IDs in order of preference
3. Update `topPick` to the best model ID
4. Update `reason` text if needed

### Updating Provider Info
1. Find the provider in `providers` section
2. Update `strengths`, `tradeoffs`, `tagline` as needed

---

## Regenerating PowerPoint
After updating the JSON, regenerate the PowerPoint:
```bash
python create_presentation.py
```
Note: The PowerPoint currently uses hardcoded data. For a fully automated workflow, the script would need to be updated to read from models.json.

---

## Future Improvements

### Automated Data Fetching
Could add a script that:
1. Scrapes Artificial Analysis leaderboard
2. Updates models.json automatically
3. Creates a PR for review

### API Integration
If Artificial Analysis or similar services offer APIs, integrate them for real-time data.

### CI/CD
- GitHub Action to remind maintainers monthly
- Automated link checking
- JSON schema validation

---

## Contact
For questions about this catalog, contact the team that maintains it.

*Last updated: 2026-02-02*
