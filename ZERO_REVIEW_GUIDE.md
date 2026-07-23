# Fully Automatic — No Review

This version publishes all portfolio-relevant articles automatically.

Rules:
- ICE motorcycles only, up to 400cc
- ICE scooters excluded
- EV scooters and electric motorcycles included
- Cars, buses, trucks, bicycles and motorcycles above 400cc excluded
- Confidence threshold: 60
- Review queue disabled
- Daily regional schedules remain active

Check:
- `/api/automation-status`
- `/coverage.html`

The dashboard reads approved items directly from `/api/news`.
