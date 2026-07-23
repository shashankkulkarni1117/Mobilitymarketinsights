# Deploy v3 Phase 1

1. Extract the ZIP.
2. Replace the contents of your local GitHub Desktop repository with the contents of this folder.
3. Preserve the folders `data`, `netlify/functions`, and `scripts`.
4. Commit and push.
5. In Netlify keep:
   - Publish directory: `.`
   - Functions directory: `netlify/functions`
6. Keep these environment variables:
   - `REFRESH_TOKEN`
   - `NEWS_API_KEY`
7. Deploy.

Test:
- `/api/news`
- `/api/review-queue`
- `/api/coverage-live`
- `/api/fx?currency=EUR&month=2026-07`
- `/api/fuel?country=Nigeria&month=2026-07`

Trigger:
```powershell
curl.exe -X POST "https://marketmobilityinsights.netlify.app/api/refresh-news" `
  -H "x-refresh-token: MarketMobility2026!"
```

Then use:
- `/review.html` to approve or reject candidates
- `/coverage.html` to identify zero-news countries
