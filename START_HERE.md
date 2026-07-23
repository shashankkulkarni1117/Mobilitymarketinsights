# Upload and deploy

1. Create a new empty GitHub repository.
2. Extract this ZIP.
3. Upload all extracted contents while preserving folders.
4. Confirm `index.html`, `package.json`, `netlify.toml`, `data/`, and `netlify/` are at repository root.
5. Import the repository into Netlify.
6. Base directory: blank.
7. Build command: blank.
8. Publish directory: `.`
9. Functions directory: `netlify/functions`.
10. Add `REFRESH_TOKEN` under Netlify environment variables.
11. Deploy.

Test:
- `/api/news`
- `/api/review-queue`

Trigger:
```powershell
curl.exe -X POST "https://YOUR-SITE.netlify.app/api/refresh-news" `
  -H "x-refresh-token: YOUR_TOKEN"
```
