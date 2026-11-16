# TopScore — Next Development Build

This build continues the approved navy/blue dashboard direction and retains the existing JAMB learning content and Firebase project configuration.

## Changes in this pass

- Rebuilt the registration/login screen to match the TopScore blue-and-white visual system.
- Added required student registration fields: phone number, JAMB examination year, and subject combination (Use of English plus exactly three other subjects).
- Added client-side validation and a Firebase password-reset flow.
- Extended the `createProfile` callable function to validate and save phone, examination year, and subjects on the server. Existing profiles can be updated without resetting subscription or reward balances.
- Displayed saved examination year, phone number and subject combination on the account page.
- Added clearly marked starter Terms of Use and Privacy Policy pages. These are drafts and must be reviewed and completed by the platform operator before public launch.
- Updated PWA theme metadata and service-worker caching so only the defined app shell is cached; user-specific pages and arbitrary same-origin GET requests are not cached. Added an offline notice page.
- Fixed one missing admin-avatar image reference.

## Validation performed

- `node --check` passed for the Cloud Functions source, core client script and service worker.
- Inline JavaScript syntax check passed for all 257 inline script blocks in the HTML files.
- Local HTML asset/link scan reported zero missing local references.

## Not yet verified

- No live Firebase deployment was performed.
- No live registration, password-reset email, payment or webhook transaction was performed.
- Firestore rules/indexes and callable functions still require deployment and emulator/integration tests.
- Payment credentials, webhook configuration, domain allowlists and production monitoring must be verified before accepting real payments.
- The legal drafts require review against actual data practices and applicable Nigerian requirements.

## Deploy notes

The static frontend can be deployed to the configured GitHub Pages site. Cloud Functions, Firestore rules and indexes must be deployed separately using the Firebase CLI from a trusted development environment after reviewing the project and confirming the target Firebase project. Do not publish secret keys in this repository.

## Focused study tracking added

- Added `study-session.html` for a premium-only focused study timer.
- Added the authenticated `getActiveStudySession` callable endpoint to restore recent sessions and expire abandoned sessions after the existing inactivity window.
- The page sends periodic server heartbeats and finishes sessions through callable functions. The server remains authoritative for accumulated study time and the 100-points-per-completed-hour reward; the client timer is display-only.
- Added an entry point from the student account page.

The study timer has passed static JavaScript syntax validation, but still needs Firebase Emulator integration tests and a live test account with an active subscription before it can be declared production-verified.
