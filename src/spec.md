# Specification

## Summary
**Goal:** Add TRP Coins rewards and admin grants, implement backend-backed Teams with TRP cost/member limits, and introduce a new System page with admin-managed Secret Holidays.

**Planned changes:**
- Update race completion flow to award and display “TRP Coins” on the Race Results scoreboard: 900–1000 for completed non-practice races, and 0 for practice races.
- Add backend support to atomically persist race completion and credit TRP Coins to the caller’s profile balance, returning the awarded amount and resulting balance to the frontend.
- Add admin-only backend + UI flow to grant arbitrary TRP Coins amounts to a specified user, with clear success/error feedback.
- Implement backend Teams: create team (requires name) with a 50,000 TRP Coins creation cost deducted atomically, list teams, fetch team details, and join/leave; enforce a hard 100-member limit.
- Replace placeholder Teams UI with real pages backed by Teams APIs: team list, create-team flow showing “50,000 TRP Coins”, team details/member list, and join/leave actions with proper loading/empty/error states.
- Add a new “System” page in main navigation with Winter, Spring, Summer sections and a “Secret Holidays” section; Secret Holidays are readable by all users but add/remove is admin-only via backend-backed controls.

**User-visible outcome:** Players see TRP Coins earned after non-practice races and their balance updates; admins can grant TRP Coins; users can create and manage Teams (with a 50,000 TRP Coins creation cost and 100-member cap); and everyone can view the new System page while admins can manage Secret Holidays.
