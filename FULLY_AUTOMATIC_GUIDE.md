# Fully Automatic Mode

The system now runs automatically every day:

- 01:00 UTC — Africa
- 02:00 UTC — LATAM
- 03:00 UTC — Asia
- 04:00 UTC — MENA
- 05:00 UTC — Europe
- 06:00 UTC — Brazil

Rules:
- ICE Competition: motorcycles only, up to 400cc
- ICE scooters excluded
- EV: electric scooters and electric motorcycles
- Cars, buses, trucks, bicycles and motorcycles above 400cc excluded
- Confidence ≥85: automatically published
- Confidence 60–84: review queue
- Confidence <60: discarded

Check:
- `/api/automation-status`
- `/coverage.html`
- `/review.html`

The dashboard automatically reads approved news from `/api/news`.
