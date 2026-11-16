# TopScore launch handoff — 10 November 2026

This package contains source-side launch hardening. It is **not a live deployment**.

## Completed in this source update

- Firebase Hosting configuration added for the `JAMB-main` root. Backend source, private content archives, private question-bank seed JSON and the local-only question manager are excluded from Hosting uploads.
- Paystack callback URL is selected by the backend from `TOPSCORE_PAYMENT_CALLBACK_URL`; the browser cannot choose it. Default: `https://jamb-b6a95.web.app/payment.html`.
- Referral links use `TOPSCORE_PUBLIC_BASE_URL`. Default: `https://jamb-b6a95.web.app`.
- Premium access requires an explicit valid, unexpired `premiumUntil` value in the browser and Cloud Functions. A profile with `premium: true` but no valid expiry is no longer granted indefinite access.
- CBT subject banks are disabled by default. Each bank must be structurally ready and explicitly academically reviewed/activated by an administrator before it can be used for official online exams.
- JavaScript syntax, JSON configuration and secure course-content inventory checks passed locally.

## Owner actions required before deployment

1. Confirm the Firebase project `jamb-b6a95` is the intended production project and that you control its Firebase/Google Cloud account.
2. Set Firebase Functions secrets: `PAYSTACK_SECRET_KEY` and `TOPSCORE_QUESTION_BANK_JSON`. Use Paystack test credentials first; do not put secrets in HTML, GitHub or this ZIP.
3. Confirm the callback and public base URLs. If using the default Firebase Hosting address, keep the defaults. If using another domain later, set `TOPSCORE_PAYMENT_CALLBACK_URL` to its exact HTTPS `/payment.html` URL and `TOPSCORE_PUBLIC_BASE_URL` to its HTTPS origin.
4. Upload the separate private course-content archive to the private Firebase Storage bucket using the commands in `README-SECURE-COURSE-DELIVERY.md`. Confirm the Functions runtime service account has object-view permission. Never upload private course content or the private question-bank JSON to Hosting/GitHub.
5. Deploy to a staging Firebase project first, run emulator and Paystack test-mode cases, and verify all Firestore/Storage rules. Do not start live payments until successful/failed/duplicate payment and webhook cases pass.
6. Check existing user profiles. For any legacy paid account with no valid `premiumUntil`, verify the original payment record and assign the correct expiry deliberately. Do not grant indefinite premium access to all such records.
7. Have a qualified JAMB subject teacher review the private question bank. It has 221 questions; 58 image references point to placeholders. Correct or remove each placeholder as appropriate, validate answers/explanations and syllabus coverage, then activate only reviewed subject banks from the Admin Panel. Until then official CBT entry is intentionally unavailable.
8. Replace legal draft notices with operator-approved Privacy Policy, Terms and Refund/Cancellation Policy. Supply the real legal operator name, support email/phone, data retention and deletion process, and refund rules. These cannot be invented by the developer.
9. Test on actual Android phones and desktop/mobile browsers: registration/login, password reset, free/premium lessons, payment callback, annual expiry, study points, quiz analytics, CBT, leaderboards, referral reward, bank verification, withdrawal approval and account deletion.
10. Set up monitoring, budget alerts, backups and a rollback plan before public launch.

## Suggested deployment sequence

From the `JAMB-main` directory, after secrets, private Storage upload and staging tests are complete:

```bash
firebase deploy --only functions,firestore,storage,hosting
```

Firebase Hosting supports the `PROJECT_ID.web.app` and `PROJECT_ID.firebaseapp.com` domains. Test a preview channel before deploying to the live channel. See the official Firebase Hosting guide: https://firebase.google.com/docs/hosting/quickstart

## What was not done

No Firebase account was accessed; no secrets were set; no private Storage upload or IAM change was made; no Firebase deploy, emulator integration test, Paystack test/live transaction, live user-account test, legal approval or real-device test was performed. The package must not be described as production-certified until these steps are complete.
