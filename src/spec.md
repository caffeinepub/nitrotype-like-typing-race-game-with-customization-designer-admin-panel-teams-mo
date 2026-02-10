# Specification

## Summary
**Goal:** Treat every joined (profile-saved) player as an admin and enable unlimited TRP coin grant tools in the Admin section.

**Planned changes:**
- Update backend authorization so any authenticated user with a saved profile is considered admin for permission checks and `isCallerAdmin()` / `getCallerUserRole()`.
- Add/enable a backend method for admins to grant an arbitrary amount of TRP coins to a specified user principal, updating `UserProfile.balance` and returning success or an explicit user-not-found error.
- Adjust frontend admin route gating so any joined player can access `/admin/*` routes, while logged-out users still see an access-denied/login prompt.
- Enable and wire the Admin “Grant TRP Coins” UI to the backend grant method, showing success/error toasts and refetching relevant profile data after success.

**User-visible outcome:** Any logged-in player who has joined the game can open the Admin section (including Grant TRP Coins) and grant any amount of TRP coins to a specified user; logged-out users still cannot access admin pages.
