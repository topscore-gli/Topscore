# TopScore — start here (15 Nov 2026)

## Changes made in this pass
- Images in /img cut from ~103 MB to ~24 MB (same filenames, max 1000px wide) so pages load on Nigerian mobile data.
- PWA fixed: manifest used a non-square 1408x768 logo as 192/512 icons (install would fail). Added img/icon-192.png and icon-512.png; service worker cache bumped to v4.
- Hosting: design reference screenshot and stray files no longer uploaded; long cache added for /img.
- Removed junk file functions/imd.

## MUST FIX before launch
1. FIREBASE API KEY MISMATCH. topscore-core.js (used by every logged-in page) has a 40-character key
   (AIzaSyA3WD52fStDaZ05JNWdpMxcP1uD_nhDmv3g). Real Google keys are 39 characters, and maintenance.html /
   indexmaintance.html contain a different key (AIzaSyA3WD52stfzLzO5895D4HsspaV5tKcCt7o).
   Open Firebase Console > Project settings > Your apps > Web app, copy the apiKey, and paste it into topscore-core.js
   (and the two maintenance pages). If the key is wrong, login, payments and exams all fail.
2. Set secrets: firebase functions:secrets:set PAYSTACK_SECRET_KEY and TOPSCORE_QUESTION_BANK_JSON (test keys first).
3. Upload private lesson content to Storage (see README-SECURE-COURSE-DELIVERY.md). The /courses pages here are
   loader stubs; without the private upload, every lesson shows empty.
4. Deploy to a staging project, test Paystack in test mode (success, fail, duplicate, webhook).
5. Add a teacher-reviewed question bank and activate it in Admin. All CBT banks are OFF by default.
   58 of 221 questions point at placeholder images.
6. Real Privacy Policy, Terms and Refund policy (operator name, support email).
7. Check functions/package.json runtime ("node": "20") against Firebase's currently supported Node versions; upgrade if deprecated.

## Realistic launch plan
- Soft launch (free lessons + topic practice + Paystack subscription) once items 1-4 and 6 pass.
- Launch CBT / leaderboard / wallet withdrawals only after item 5 and Paystack transfer testing.
