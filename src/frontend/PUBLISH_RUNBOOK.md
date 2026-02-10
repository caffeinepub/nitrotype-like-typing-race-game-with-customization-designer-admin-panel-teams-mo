# TRP Racing - Publish & Deployment Verification Runbook

## Overview
This document outlines the exact workflow for publishing the TRP Racing application and performing post-deployment smoke checks to ensure the latest build is live and functional.

## Deployment Process

### 1. Build & Deploy
The deployment is handled automatically by the Caffeine platform. When you request "publish game", the system:
- Builds the latest frontend assets with Vite
- Deploys the frontend to the Internet Computer
- Upgrades the backend canister with the latest Motoko code

### 2. Post-Deploy Verification

After deployment completes, perform these smoke checks on the live URL:

#### A. Clear Browser Cache (Critical)
To avoid testing stale cached bundles:
- **Hard Refresh**: Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- **Alternative**: Open the live URL in an incognito/private window
- **DevTools Method**: Open DevTools (F12) → Network tab → Check "Disable cache" → Refresh

#### B. Dashboard Route (`/`)
1. Navigate to the root URL
2. Verify the dashboard loads without errors
3. Check that:
   - Header navigation is visible
   - TRP Coins balance displays correctly (if logged in)
   - Quick action cards render properly
   - Footer shows current year and caffeine.ai attribution

#### C. Race Lobby Route (`/race`)
1. Navigate to `/race` from the dashboard or directly
2. Verify the race lobby loads without errors
3. Check that:
   - Mode selection cards display (Solo, Ghost, Practice, Custom Text)
   - Word zone preview shows current zone and target word count
   - Racing instructions are visible
   - Navigation back to dashboard works

#### D. Authentication Flow
1. Click the "Login" button in the header
2. Verify Internet Identity authentication flow:
   - Internet Identity modal opens
   - Can authenticate successfully
   - After login, user menu appears in header
   - Profile setup dialog appears for new users
3. Test logout:
   - Click user menu → Logout
   - Verify user is logged out
   - Cached data is cleared

#### E. Basic Interaction Test
1. While logged in, navigate to Shop (`/shop`)
2. Verify car catalog loads with 3D previews
3. Navigate to Customize (`/customize`)
4. Verify owned cars display correctly
5. Navigate to Profile (`/profile`)
6. Verify user stats and balance display

## Common Issues & Solutions

### Issue: Stale Bundle Served
**Symptoms**: Old UI appears, missing features, console errors about missing routes
**Solution**: 
- Perform hard refresh (Ctrl+Shift+R)
- Clear browser cache completely
- Try incognito/private window

### Issue: Authentication Fails
**Symptoms**: Login button doesn't work, "User is already authenticated" error
**Solution**:
- Clear browser cache and cookies
- Try logout → wait 2 seconds → login again
- Check browser console for specific error messages

### Issue: 3D Car Viewer Not Loading
**Symptoms**: Blank space where car should appear, WebGL errors
**Solution**:
- Verify browser supports WebGL (visit https://get.webgl.org/)
- Check browser console for Three.js errors
- Try different browser (Chrome/Firefox recommended)

### Issue: Backend Canister Errors
**Symptoms**: "Actor not available", "Canister not found" errors
**Solution**:
- Wait 30 seconds for canister upgrade to complete
- Refresh the page
- Check that backend canister ID is correct in deployment config

## Success Criteria

Deployment is successful when:
- ✅ Dashboard (`/`) loads without errors
- ✅ Race Lobby (`/race`) loads without errors
- ✅ Internet Identity login/logout works
- ✅ User profile persists after login
- ✅ TRP Coins balance displays correctly
- ✅ 3D car previews render in Shop
- ✅ Navigation between all routes works smoothly
- ✅ No console errors related to missing assets or routes

## Rollback Procedure

If critical issues are found post-deployment:
1. Document the specific issue and reproduction steps
2. Contact Caffeine support or request a rollback to previous version
3. Do not attempt manual fixes on live deployment

## Notes

- The `index.html` includes cache-busting meta directives to reduce stale bundle issues
- Vite automatically generates hashed filenames for assets (e.g., `main-abc123.js`)
- The Internet Computer's asset canister serves files with appropriate cache headers
- Always test in multiple browsers (Chrome, Firefox, Safari) for production releases
