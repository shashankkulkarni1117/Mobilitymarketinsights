# May–June FX and Fuel Fix

## FX

The `/api/fx` endpoint now uses the Frankfurter v2 historical rates endpoint and
correctly parses its array response.

Test:

```text
/api/fx?currency=EUR&month=2026-05
/api/fx?currency=INR&month=2026-06
/api/fx?currency=NGN&month=2026-07
```

Supported currencies return historical points. Unsupported currencies return `NA`.

## Fuel

`data/fuel-prices.json` now contains a May, June and July record for every
dashboard country.

A record displays only when:

```json
"pricePerLitre": 123.45,
"verified": true
```

Missing values return `NA` rather than an empty chart.

Use `data/fuel-prices-template.csv` to collect public verified values, then copy
them into `fuel-prices.json`.

No fuel value in this package has been invented or estimated.
