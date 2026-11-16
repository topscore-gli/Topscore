# TopScore launch-readiness update — 7 November 2026

## Source change in this build
- Updated `functions/index.js` payment fulfillment so a successful payment reference is processed at most once inside a Firestore transaction.
- Payment ownership is tied to a TopScore-created payment record and checked against Paystack metadata and the authenticated caller.
- Annual subscription extension, payment success recording, and eligible referral reward creation now happen atomically. The referral wallet transaction uses a deterministic document ID to prevent duplicate credits.

## Validation performed
- `node --check` passed for all JavaScript files found in the project (including Cloud Functions).
- No Firebase Emulator integration test, Paystack test transaction, live payment, production deployment, or real-device test was performed.

## Remaining launch blockers
1. Premium lesson and question files remain static repository assets protected by a client-side gate. Move premium content behind authenticated server-side access before paid launch.
2. Online exam result recording accepts client-submitted score/correct/total values. Implement server-controlled exam sessions, question delivery, expiry, and server-side marking before using results for rankings or rewards.
3. Validate payment fulfillment in Firebase Emulator and Paystack test mode, including concurrent webhook/callback delivery and repeat verification.
4. Withdrawal transfer initiation needs idempotent transfer handling and verified transfer webhooks/reconciliation.
5. Course catalogue currently lists 235 pages across five subjects (48 marked free); complete subject coverage and reconcile advertised totals.
6. Complete production security, legal, accessibility, PWA, monitoring, backup/restore, and device testing.

No production services were changed or deployed.

## 2026-11-07 continuation: secure CBT source implementation

The online CBT flow has now been reworked at source level. Question keys were moved out of the public repository into the private Firebase Secret Manager secret `TOPSCORE_QUESTION_BANK_JSON`; the separate private JSON seed file must never be committed to GitHub Pages. The callable functions `startOnlineExam` and `submitOnlineExam` now provide a server-generated question paper, server deadline, server-side scoring, and one-time result submission. `recordOnlineExamResult` rejects client-supplied scores. Firestore rules deny client access to `examSessions`. The public CBT page no longer embeds the question bank; old duplicate CBT pages redirect to the secure page. Details and release caveats are in `README-SECURE-EXAM.md`.

**Not production-verified:** Firebase deployment/emulator tests and real-device testing have not been run. In-progress answers sync to the private server session every 30 seconds, with the browser session as an additional recovery layer. Historical result documents may contain scores accepted by the old client-trusted endpoint; official exam leaderboard queries now exclude them unless they carry `verifiedByServer: true`. The CBT question bank currently covers only five subjects and uses a fixed English/Mathematics/Chemistry/Physics combination.


## 2026-11-07 continuation: subject-combination handling

- The secure CBT now uses the four JAMB subjects saved in each student's profile: compulsory Use of English plus the three selected electives.
- The paper is 180 questions: 60 English and 40 for each elective.
- Currently supported elective banks are Mathematics, Biology, Chemistry and Physics. Other subjects in the signup list are not yet banked; the backend rejects an unsupported combination before taking the 500-point entry fee.
- The exam list displays the student's saved subject combination.
- The private question bank was checked: all 221 source questions have a non-empty prompt, at least two options, and an answer index within the option list. This is a structural check only, not an academic accuracy review.

This remains source-only work. No Firebase deployment or emulator, Paystack, or production test has been performed.

## 2026-11-07 continuation: subject editor

- Added an Account-page subject editor. Students can update their JAMB subject combination after signup, with Use of English compulsory and exactly three electives.
- Changes are saved through the authenticated Cloud Function rather than direct client writes to Firestore.
- The editor explains that only Mathematics, Biology, Physics and Chemistry currently have elective CBT question banks; the other profile subject choices are not yet exam-enabled.
- Inline JavaScript syntax checks passed for the updated Account, online exam listing and CBT pages.

No live Firebase deployment, account testing or browser/device integration test has been performed.

## Additional work completed on 2026-11-07

- Added an offline Question Bank Manager (`question-bank-manager.html`) and operating instructions (`README-QUESTION-BANK-MANAGER.md`). It supports all 18 profile subject keys, import/export, question editing, structural checks, duplicate detection, and CBT minimum-count reporting.
- The manager is local-only: no Firebase calls, network uploads, or embedded private answer bank. It is not a cloud publishing console; the private JSON still must be uploaded to Firebase Secret Manager through an authorized deployment workflow.
- Validation performed: manager JavaScript syntax check, static local-only check, private bank JSON parse, and structural audit of the existing private question records. No academic verification, emulator test, Firebase deployment, or production test was performed.


## 2026-11-07 continuation: admin question-bank publishing workflow

- Added an Admin Panel **Question Banks** tab with status for all 18 JAMB subject banks.
- New callable admin endpoints `adminGetQuestionBankStatus` and `adminUpdateQuestionBankStatus` read the private question-bank secret and record activation/review metadata in the server-only `subjectBankStatus` collection.
- Activation requires at least 60 English questions or 40 elective questions, valid question text/options/answer indexes, no duplicate question text, a reviewer name, an explicit academic-review attestation, and review notes.
- The review metadata records the admin UID, reviewer name, notes and timestamp. This is an auditable declaration, not independent verification of reviewer credentials or academic correctness.
- The five legacy banks remain active on first deployment if no status record exists, to avoid unexpectedly blocking current users; they are clearly shown as legacy active with academic review pending. Once a status record is written, the bank must satisfy the approved/enabled status to be used for new entries.
- New subjects are included in the backend subject map and remain unavailable until activated. Both `joinExam` and `startOnlineExam` validate the status and the live secret bank; the 500-point entry fee is not deducted when validation fails.
- `subjectBankStatus` is denied to direct client reads/writes by Firestore rules.
- Static syntax and configuration checks passed locally. No Firebase deployment, emulator run, live admin login, or live question-bank publication was performed.

## 2026-11-07 — Student performance analytics update

- Added `performance.html`, a responsive student progress page with daily, weekly and monthly score trends, subject summaries, recent topic tracking, first-attempt information, and accumulated study time.
- Expanded `getPerformance` to return 90-day practice history, topic-level summaries, score averages/bests, and study time from the authenticated student profile.
- Updated practice-result handling to validate `correct` and `total`, derive the percentage on the server from those submitted counts, determine first-attempt status inside a Firestore transaction, and label browser-originated topic quiz scores as `practice_client_reported`.
- Practice percentile is explicitly described as a practice-cohort estimate, not an official or independently verified ranking. Online CBT scoring remains the separately server-verified path.
- Changed date keys to Africa/Lagos for daily reporting and daily leaderboard grouping.
- Added the required `quizResults(topicKey, firstTry)` Firestore composite index and linked the dashboard progress navigation to `performance.html`.
- Validation: Cloud Functions syntax, touched inline page scripts, new analytics page script, Firestore index JSON, and ZIP integrity checked locally.
- Not performed: Firebase deployment, emulator integration, real account/role testing, concurrent transaction testing, or Android/iOS device testing. Existing browser-based topic quiz question keys remain client-visible; those quiz scores must not be represented as secure exam results.
- Added `README-PERFORMANCE-ANALYTICS.md` with deployment instructions and explicit practice-score limitations. The Daily Quiz leaderboard now clarifies that its entries are practice submissions, while the Online Examination leaderboard uses server-verified CBT results.


## 2026-11-10 release hardening

- Premium checks now require a valid, unexpired `premiumUntil` timestamp. Accounts with legacy `premium: true` and no expiry require payment-history verification and a deliberate migration.
- Paystack callback URL is server-configured through `TOPSCORE_PAYMENT_CALLBACK_URL`, defaulting to the Firebase Hosting URL `https://jamb-b6a95.web.app/payment.html`; the client cannot choose it.
- All CBT subject banks now default to disabled until an administrator explicitly records academic review and activation. This avoids launching exams/prizes with unreviewed legacy question banks.
- Firebase Hosting configuration added for the app root, excluding private course/question-bank seed assets and backend source.

These changes are source-only. They have not been deployed. Firebase secrets/parameters, private Storage upload and IAM, payment tests, emulator tests, legal approval and device tests remain outstanding.
