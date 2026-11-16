# TopScore dashboard implementation update

This update replaces the old mobile-only dashboard with a responsive dashboard based on the approved first TopScore desktop reference.

## Included
- Desktop sidebar and dashboard composition matching the approved reference.
- Responsive tablet and phone layouts with mobile bottom navigation.
- TopScore logo, generated JAMB hero/student artwork, trophy artwork and student avatar crops under `assets/dashboard/`.
- Lucide SVG icon set rendered as actual vector icons.
- Existing TopScore Firebase authentication and callable-function integration.
- Live signed-in student name, points balance, quiz performance by subject, exam leaderboard and recent points/exam activity.
- Authentication now routes students to `dashboard.html` after login/registration.
- Basic PWA shell caching for dashboard assets.

## Important data integrity notes
- The overall performance and subject percentages are based on recorded quiz results returned by `getPerformance`.
- Points and leaderboard entries come from existing TopScore backend functions.
- Course completion displays the student's `courseCompletionPct` field; it remains 0 until actual lesson-completion tracking is implemented and populated. It is intentionally not fabricated from quiz scores.
- Referral reward displays the configured ₦500 reward per qualifying subscribed referral, not a student's earned balance.

## Existing backend
This update preserves the supplied TopScore Firebase/Firestore/Cloud Functions and Paystack integration. It does not deploy backend changes or alter production credentials. Firebase Functions, Firestore rules/indexes and Paystack secrets must be deployed/configured in the owner's Firebase project before live transactions can operate.
