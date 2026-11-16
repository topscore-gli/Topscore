# TopScore student performance analytics

## Student page

Open `performance.html` after signing in with an active subscription. The page reads the authenticated student's `getPerformance` callable response and displays:

- practice attempt count, average and best score over the last 90 days;
- recorded study time;
- daily, weekly and monthly average score trend;
- subject averages for the selected period;
- topic-level average, best score and first recorded attempt.

Dates are grouped using `Africa/Lagos` calendar days.

## Data integrity and limitations

The browser-based lesson/topic quiz still submits the number correct and total. The callable validates these values and calculates the percentage itself, but a modified browser can still falsify the submitted counts because the underlying topic question banks and answer keys are not yet fully server-hosted. Such rows are stored with `scoreVerification: practice_client_reported` and must only be treated as practice analytics. The practice percentile is an estimate from first recorded practice attempts, not an official JAMB percentile or a verified ranking.

The online CBT flow is separate and should use server-delivered questions, server-side answer evaluation and server-controlled timing. Only results marked `verifiedByServer: true` are eligible for the official online-examination leaderboard.

## Deploy

After testing in the Firebase Emulator, deploy the updated callable functions and composite index:

```bash
firebase deploy --only functions,firestore:indexes
```

No deployment or live integration test has been performed as part of this source update.
