# TopScore JAMB — Annual Subscription + Points + Referrals Build

This version changes TopScore into an account-based JAMB preparation platform with:

- Firebase email/password registration and login.
- About 20% of the course pages available free of charge.
- ₦2,500 annual Premium subscription (12 months).
- Paystack server-side payment initialization, verification and webhook handling.
- Premium expiry after one year; renewals extend access by another year.
- 100 study points for each completed active study hour.
- 500 points required to join an online examination.
- Atomic server-side exam point deduction.
- Topic quiz result recording and peer-performance percentile feedback.
- Daily, weekly and monthly performance by course.
- Daily Quiz leaderboard.
- Online Examination leaderboard.
- Referral links with ₦500 reward after a referred student successfully subscribes.
- Referral earnings wallet.
- Nigerian bank account verification through Paystack.
- Withdrawal requests with admin approval and Paystack bank transfer initiation.
- Admin panel for top 50 online-examination performers, Daily Quiz leaderboard and student gifts.
- Existing access-code endpoint retained for migration compatibility.

## Firebase setup

The build targets:
`jamb-b6a95`

Enable:
- Authentication → Sign-in method → Email/Password
- Firestore Database

Deploy:

```bash
firebase login
firebase use jamb-b6a95
cd functions
npm install
cd ..
firebase deploy --only functions,firestore
```

## Paystack secret

Never put your Paystack secret key in HTML or GitHub.

```bash
firebase functions:secrets:set PAYSTACK_SECRET_KEY
firebase deploy --only functions
```

The application price is configured as **₦2,500 per year** in `functions/index.js` and `topscore-core.js`.

Referral reward is **₦500 per successful subscribed friend**.

Minimum withdrawal is **₦1,000**. This can be changed in `functions/index.js`.

## Paystack webhook

After deploying functions, set the Paystack webhook URL to:

`https://us-central1-jamb-b6a95.cloudfunctions.net/paystackWebhook`

The webhook is signature-checked and the transaction is verified against the expected ₦2,500 amount and NGN currency before Premium access is granted.

## Admin activation

The admin panel is:

`https://jamb-b6a95.web.app/admin.html`

For security, admin access is **not enabled for everyone**. After creating your own TopScore account, open that user's Firestore document in Firebase Console and add:

```text
role: "admin"
```

Alternatively, set the Firebase Auth custom claim:

```json
{"admin": true}
```

Admin features include:
- Top 50 online examination performers.
- Daily Quiz leaderboard.
- Gift study points to a student.
- Review pending referral-wallet withdrawals.
- Approve transfers through Paystack.
- Reject/refund withdrawal requests.

## Referral flow

A student gets a personal link such as:

`https://jamb-b6a95.web.app/auth.html?ref=TSXXXXXXXXXX`

The referred student must:
1. Open the referral link.
2. Create an account.
3. Subscribe successfully for ₦2,500.

Then the referrer receives ₦500 in the referral wallet. The same referred account cannot generate repeated rewards on later renewals.

## Bank withdrawals

Students:
1. Select their bank.
2. Enter their 10-digit account number.
3. Verify the account through Paystack.
4. Save the verified account.
5. Request a withdrawal when the wallet balance is at least ₦1,000.

The withdrawal is placed on hold. An admin reviews it and approves the Paystack transfer. Rejected withdrawals are refunded to the student's wallet.

Your Paystack account must have the appropriate transfer capability and sufficient Paystack balance for transfers.

## Free course access

The static course library contains 240 HTML pages. This build marks 48 pages (20%) as free. The remaining course pages require an active annual subscription.

The free-page list is maintained in `topscore-gate.js`.

## Performance system

Topic quizzes send their results to `recordQuizResult` after submission. TopScore records:
- Course/subject
- Topic
- Score percentage
- Correct answers
- Total questions
- First attempt status
- Timestamp

The server compares the student's score with other recorded attempts for the same topic and returns a percentile-style statement such as:

> You did better than 53% of students on this topic.

This percentage is calculated from actual recorded TopScore results rather than a hard-coded message.

## Online exam results

The JAMB online exam calls `recordOnlineExamResult` when submitted. The admin panel ranks the best 50 recorded exam results and lets the admin gift points to selected students.

## Security limitation

The current course/question bank is still static HTML because the original application was built for GitHub Pages. A frontend gate can stop ordinary users from navigating to premium pages, but it cannot make static HTML secret from someone who downloads the repository.

For a production paid question bank, the next security step is to move the actual questions into Firestore/Cloud Storage and serve them through authenticated backend endpoints. This is strongly recommended before a large commercial launch.

## Launch testing checklist

- Create account with no referral.
- Create account through a referral link.
- Test failed and successful Paystack payment.
- Confirm Premium expires/renews correctly.
- Confirm free course pages remain accessible without payment.
- Confirm Premium course pages redirect to subscription.
- Confirm 100 points are awarded only after a full active study hour.
- Confirm duplicate study sessions are rejected.
- Confirm 500 points are deducted exactly once when joining an exam.
- Confirm exam results appear in the admin top 50.
- Complete a topic quiz and verify the peer-performance statement.
- Complete the Daily Quiz and verify the Daily Quiz leaderboard.
- Confirm referral reward is exactly ₦500 and awarded only after successful subscription.
- Verify a Nigerian bank account.
- Request a withdrawal.
- Approve it from admin and confirm Paystack transfer initiation.


## Secure course-page delivery (required before paid launch)

The current source build now keeps the 235 catalogued course HTML pages inside `functions/course-content/`. Public `courses/**.html` files are lightweight loading shells and contain no lesson body. The callable `getCoursePage` checks the server-side free-page allowlist; all other pages require an authenticated user with an active Premium subscription in Firestore. Course paths are checked against `course-catalog.json` before any file is read.

Deploy both the Functions and the updated static site together:

```bash
firebase deploy --only functions
```

Then publish the updated `JAMB-main` static files to the configured hosting destination. Do not leave an older public copy of the course pages accessible from GitHub Pages, Vercel, a CDN, or another repository/branch. Purge CDN caches after publishing.

Important: this protects the lesson HTML from direct static-file downloads, but once a subscriber receives a lesson in a browser, they can still save or capture the displayed content. This is access control, not DRM. Test unauthenticated free-page access, unauthenticated premium-page denial, expired-subscription denial, and active-subscriber access in the Firebase Emulator and on the deployed project before taking payments.


## Secure premium course delivery

See `README-SECURE-COURSE-DELIVERY.md`. Paid course HTML is now served by the authenticated `getCoursePage` callable from a private Firebase Storage bucket; it is not bundled into the public static site or Functions source. The 48 free pages remain available without sign-in. Upload the sibling `PRIVATE-DO-NOT-PUBLISH/course-content` folder to the private Storage bucket, grant the Functions runtime service account object-view permission, deploy Functions/Firestore/Storage rules, and publish only the `JAMB-main` directory. Do not publish the private data folder.


## Launch hardening update (2026-11-10)

- The payment callback and referral base URL are now configured server-side with `TOPSCORE_PAYMENT_CALLBACK_URL` and `TOPSCORE_PUBLIC_BASE_URL`; defaults are `https://jamb-b6a95.web.app/payment.html` and `https://jamb-b6a95.web.app`. The browser no longer chooses or supplies the callback URL. If the public hosting domain changes, update both Firebase parameters before deploying Functions.
- Premium status now requires an explicit, valid `premiumUntil` timestamp in both the browser and Cloud Functions. A legacy profile with `premium: true` but no valid expiry is not automatically treated as paid forever. Verify its payment history and migrate legitimate accounts with an explicit expiry before release.
- Question-bank activation is now opt-in. No legacy bank is treated as approved just because a status record is missing. Each subject must pass structural checks and receive an administrator's academic-review attestation before CBT entry is enabled.
- Hosting is configured for the `JAMB-main` directory and excludes backend source, private course archives, and private question-bank seed files. Deploy only after confirming the adjacent private content is uploaded to the private Storage bucket.

The 58 placeholder image references in the supplied private question bank still require content-owner/subject-teacher review. They are not silently replaced with unrelated images. Official CBT remains blocked until the bank is corrected and reviewed.
