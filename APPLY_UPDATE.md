# Apply the NewsAPI Update

1. Extract this ZIP.
2. Copy the `netlify` folder into your local GitHub Desktop repository.
3. When Windows asks whether to merge/replace files, choose **Yes**.
4. Confirm these files now exist:
   - `netlify/functions/news-crawler-background.mts`
   - `netlify/functions/scheduled-refresh.mts`
   - `netlify/functions/refresh-news.mts`
   - `netlify/functions/_shared/newsapi.mts`
   - `netlify/functions/_shared/types.mts`
5. In GitHub Desktop:
   - Summary: `Add NewsAPI crawler`
   - Commit to main
   - Push origin
6. Wait for Netlify to deploy.
7. Run:

```powershell
curl.exe -X POST "https://marketmobilityinsights.netlify.app/api/refresh-news" `
  -H "x-refresh-token: MarketMobility2026!"
```

8. Wait 5–10 minutes.
9. Open:
   - `https://marketmobilityinsights.netlify.app/api/review-queue`

Newly discovered articles remain `approved: false` until you approve them.
