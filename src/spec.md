# Specification

## Summary
**Goal:** Publish the game by building and deploying the latest version so the live URL serves the newest frontend and upgraded backend canister(s).

**Planned changes:**
- Build and deploy the latest frontend assets and backend canister(s) from the current repository source.
- Verify the live deployment is serving the newest build (no stale cached bundle).
- Perform a basic live smoke-check: load Dashboard (`/`), navigate to Race Lobby (`/race`), and confirm Internet Identity authentication works.

**User-visible outcome:** The live game URL loads the most recently deployed version without errors, and core navigation/auth flows work as expected.
