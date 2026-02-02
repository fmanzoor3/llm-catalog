# Deploying LLM Catalog to Vercel

## Prerequisites
- A [Vercel account](https://vercel.com/signup) (free tier works)
- Git repository (GitHub, GitLab, or Bitbucket)

## Quick Deploy

### Option 1: Deploy from GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/llm-catalog.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your repository
   - Click "Deploy"

3. **Done!** Your site will be live at `https://llm-catalog-xxx.vercel.app`

### Option 2: Deploy with Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd "LLM Catalog"
   vercel
   ```

3. Follow the prompts to link to your Vercel account.

---

## Project Structure for Vercel

```
LLM Catalog/
├── index.html          # Main page (served at /)
├── vercel.json         # Vercel configuration
├── api/
│   ├── update.py       # Serverless function (served at /api/update)
│   └── requirements.txt
├── data/
│   └── models.json     # Model data (embedded in HTML)
└── auto_update.py      # Local update tool
```

---

## How It Works

### Static Page
- `index.html` is served as the main page
- All model data is embedded directly in the HTML (no external fetch needed)
- The page works offline and loads instantly

### Serverless API
- `/api/update` endpoint returns the latest model data
- When you click "Fetch Latest Data", it calls this API
- The API returns updated data if available

### Updating Data

**Option A: Update locally and redeploy**
```bash
# Update data locally
python auto_update.py

# Push changes
git add .
git commit -m "Update model data"
git push
```
Vercel will automatically redeploy.

**Option B: Update API data directly**
Edit `api/update.py` to return new data, then push.

---

## Sharing with Team

Once deployed, share the URL with your team:
```
https://your-project.vercel.app
```

Team members can:
- View the LLM guide
- Click "Check for Updates" to fetch latest data
- Open benchmark sources for research

---

## Environment Variables (Optional)

If you want to add authentication or API keys later:

1. Go to your project on Vercel dashboard
2. Settings → Environment Variables
3. Add variables like `API_KEY`

---

## Troubleshooting

### API not working?
- Check the function logs: Vercel Dashboard → Logs
- Ensure `api/update.py` uses the correct handler format

### Page not updating?
- Clear browser cache
- Check that `vercel.json` is correct
- Verify the build succeeded in Vercel dashboard

### Python version issues?
Add to `vercel.json`:
```json
{
  "functions": {
    "api/**/*.py": {
      "runtime": "python3.9"
    }
  }
}
```

---

## Cost

Vercel's free tier includes:
- Unlimited static deployments
- 100 GB bandwidth/month
- 100 serverless function invocations/day

This is more than enough for an internal team tool.

---

## Next Steps

1. Deploy to Vercel
2. Share the URL with your team
3. Update data monthly using `python auto_update.py`
4. Push changes to auto-deploy updates

---

*Last updated: 2026-02-02*
