---
name: verify
description: Build, run and drive the flash-cards app locally to verify UI changes end-to-end (mobile + desktop viewports).
---

# Verify flash-cards changes

## Build / launch

- `npm run lint` and `npm run build` from the repo root (warnings in Conjugator.js are pre-existing).
- Dev server: `npx next dev -p 3111` (avoid 3000 in case the user runs their own dev server). Ready in ~3s.

## Auth handle (local only)

The app is behind custom JWT auth (`auth_token` httpOnly cookie, signed with
`JWT_SECRET` from `.env.local`). To drive it without a password, mint a token
with the project's own `jsonwebtoken`:

1. Fetch one user row (read-only) from Supabase REST:
   `GET {NEXT_PUBLIC_SUPABASE_URL}/rest/v1/userdata?select=id,username&limit=1`
   with `apikey`/`Authorization: Bearer {SUPABASE_SERVICE_ROLE_KEY}` **and
   `Accept-Profile: flash_cards`** (tables live in the `flash_cards` schema,
   not `public`).
2. `jwt.sign({ id, username }, JWT_SECRET, { expiresIn: '1h' })` → set as the
   `auth_token` cookie for `http://localhost:3111`.

Never print the env secrets; print only the token.

## Drive

- Playwright library (no bundled browsers needed): `chromium.launch({ channel: 'chrome', headless: true })` uses the installed system Chrome. Install `playwright` in a scratch dir, **never** in the repo (protected lockfile).
- Mobile = viewport ≤768px wide (e.g. 390×844, `hasTouch: true, isMobile: true`); desktop e.g. 1280×800.
- **Gotcha (cold profile):** the home sets list won't render on the first visit of a fresh browser profile — `SetsControl` calls `getFilteredSets()` without subscribing to `sets`, so it only shows data after the zustand `persist` localStorage exists. Visit `/`, wait ~1.5s, then `page.reload()`.
- Desktop selects a set by clicking `.set-item .set-content`; mobile auto-selects the centered carousel card.
- Swipes: dispatch synthetic `TouchEvent`s (touchstart/move/end with `Touch` objects) on the element — React's root listeners pick them up.

## Data safety

`.env.local` points at the user's real Supabase project. Keep runs read-only:
navigation, taps, swipes, scrolling. Do NOT submit add-word forms, click
Learned/archive/delete, or create sets (these PATCH/POST the real DB).
