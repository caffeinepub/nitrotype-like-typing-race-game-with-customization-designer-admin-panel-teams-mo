# Specification

## Summary
**Goal:** Ensure the in-game username “@Admin” is granted backend admin privileges when saving a profile, while preventing unintended admin auto-grants for other new users.

**Planned changes:**
- Update backend profile-save logic so that when the saved username (trimmed) equals exactly "@Admin", the caller is assigned the admin role during both initial profile creation and subsequent profile updates.
- Fix backend admin auto-grant behavior so new profiles do not automatically receive admin privileges except for the intended bootstrap policy (first 5 profiles) and the special "@Admin" username.

**User-visible outcome:** A player who saves their profile as “@Admin” is recognized as an admin by backend admin-check APIs, and other new users are not incorrectly granted admin privileges beyond the initial bootstrap policy.
