# Specification

## Summary
**Goal:** Give new users a much larger starting balance, and ensure car design selection and visualization use full car models (design + color) in both the Shop and the race track view.

**Planned changes:**
- Backend: Set the default balance for newly created user profiles to `1000000000000000` (Nat) when a profile is first saved/created, without changing existing users’ balances.
- Frontend (Shop): Update the Shop UI to browse/select full car designs (model/body style) with a visual preview, while still allowing purchase of a specific variant (design + color) and preserving owned-variant behavior.
- Frontend (Race): Update the on-track player car marker to reflect the currently active car’s design and color, with a fallback to the existing default car (“Default Racer”, blue) when no active car is selected.

**User-visible outcome:** New users start with `1000000000000000` balance, players can view and choose full car designs (not only colors) in the Shop with a clear preview, and the race track visualization shows the player’s active car design and color during gameplay.
