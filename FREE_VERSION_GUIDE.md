# Free Version

News uses direct approved/official website crawling plus GDELT. Manual refresh launches 18 background jobs: 6 regions × 3 months.

FX uses the free Frankfurter historical API.

Fuel uses `data/fuel-prices.json`. May, June and July templates are included; missing values display NA.

Trigger:
```powershell
curl.exe -X POST "https://marketmobilityinsights.netlify.app/api/refresh-news" `
  -H "x-refresh-token: MarketMobility2026!"
```
