# TopScore Question Bank Manager

`question-bank-manager.html` is a local-only authoring tool for the private CBT question-bank JSON. It does not call Firebase, send network requests, or contain answer keys itself.

## Open and use

1. Download the project ZIP and extract it, or open `question-bank-manager.html` directly in a modern browser.
2. Choose **Import question bank** and select your private `TopScore-Question-Bank-Private.json`, or download a blank template.
3. Select a subject, add/edit/delete questions, enter 2–6 options and select the correct answer radio button.
4. Resolve all structural validation issues, then choose **Export private JSON**.
5. Have a qualified teacher independently review question accuracy, answer keys, syllabus coverage, ambiguity, and explanations.
6. Keep the exported JSON outside the public GitHub Pages repository. Upload it only to Firebase Secret Manager as `TOPSCORE_QUESTION_BANK_JSON` using the secure deployment process in `README-SECURE-EXAM.md`.

## JSON format

Each subject key contains an array of question objects:

```json
{
  "english": [
    {
      "q": "Question text",
      "o": ["Option A", "Option B", "Option C", "Option D"],
      "a": 0,
      "e": "Explanation",
      "img": null,
      "optImgs": null
    }
  ]
}
```

`a` is a zero-based index into `o`. Supported subject keys include `english`, `mathematics`, `biology`, `physics`, `chemistry`, `government`, `economics`, `literature_in_english`, `commerce`, `accounting`, `geography`, `agricultural_science`, `christian_religious_studies`, `islamic_studies`, `french`, `fine_arts`, `music`, and `home_economics`.

## CBT readiness counts

The current secure full-paper generator needs at least 60 English questions and 40 questions for each selected elective. This tool reports quantity and structure only. It does not certify a subject as academically reviewed, and it does not yet change the server's supported-subject allowlist. A subject must not be enabled in the live CBT until the server implementation and question bank have both been reviewed and tested.


## Admin publishing and subject activation

The Admin Panel now has a **Question Banks** tab. It reads counts from the private Secret Manager bank and displays the minimum required quantity, malformed-question count, duplicate-question count, academic-review status, and CBT activation state for all 18 subject categories. The server blocks activation if the bank is short, contains malformed records, or contains duplicate question text.

- Existing English, Mathematics, Biology, Chemistry and Physics banks remain legacy-active on first deployment, but are visibly labelled as pending academic review until an admin records a review. If an admin saves a status record for one of these subjects, the subject must have `enabled: true`, `academicallyReviewed: true`, a sufficient question count, a reviewer name, and review notes to remain eligible for new exam entries.
- Other subjects are unavailable by default. They can be activated only after their bank reaches 40 questions (English requires 60), and an administrator records the qualified reviewer's name, an explicit review attestation, and review notes of at least 20 characters.
- The server checks the activation status before deducting the 500-point exam entry fee, then checks the actual private secret bank again when the exam starts. Disabled or unapproved subjects cannot be selected for a new CBT attempt.
- Deactivating a subject blocks new exam entries. Existing exam sessions and historical results are not deleted.
- `subjectBankStatus` is server-only; Firestore rules deny direct client reads and writes. Only the authenticated admin callable functions can read or update it.

The admin review record is an auditable declaration, not independent credential verification or an automated academic-quality assessment. Keep an independent teacher-review process and retain evidence outside the app. Update the Secret Manager version whenever the question bank changes, then re-check counts in the Admin Panel.

Deploy these source changes together:

```bash
firebase deploy --only functions,firestore:rules
```

The deployed functions must have the `TOPSCORE_QUESTION_BANK_JSON` secret configured. This source update has not itself been deployed or tested against the live Firebase project.
