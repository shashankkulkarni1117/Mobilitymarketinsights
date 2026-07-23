# Apply FX and Fuel Update

1. Extract this ZIP.
2. Open GitHub Desktop.
3. Select your Market Mobility Insights repository.
4. Choose **Repository → Show in Explorer**.
5. Copy these extracted items into the repository root:
   - `index.html`
   - `data/`
   - `netlify/`
6. Approve Windows prompts to merge folders and replace `index.html`.
7. Confirm these files exist:
   - `netlify/functions/fx.mts`
   - `netlify/functions/fuel.mts`
   - `data/fuel-prices.json`
8. In GitHub Desktop:
   - Summary: `Add live FX and verified fuel data`
   - Commit to main
   - Push origin
9. Wait for Netlify deployment.

## Test endpoints

FX:

```text
https://marketmobilityinsights.netlify.app/api/fx?currency=EUR&month=2026-07
```

Fuel:

```text
https://marketmobilityinsights.netlify.app/api/fuel?country=Nigeria&month=2026-07
```

## Data behaviour

- FX uses the live Frankfurter service where the selected currency is supported.
- For unsupported currencies, the dashboard uses its existing fallback series when present.
- Fuel prices come from `data/fuel-prices.json`.
- Missing verified fuel values display `NA`.

## Monthly fuel update

Add one object per country and month to `data/fuel-prices.json`, then commit and push.
