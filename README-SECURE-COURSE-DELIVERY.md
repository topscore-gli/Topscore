# Secure course delivery

## What changed

- Replaced all 240 public course HTML pages (235 catalogue lesson/quiz pages plus five subject landing pages) with lightweight loader shells.
- Moved the full lesson HTML into the sibling `PRIVATE-DO-NOT-PUBLISH/course-content/` folder, outside the public `JAMB-main` app directory.
- Added the callable `getCoursePage`. It checks the server-side allowlist, allows the 48 free pages, and requires an authenticated user with an active Premium subscription for all other pages.
- The callable reads lesson bodies from the private Firebase Storage bucket `jamb-b6a95.firebasestorage.app`. The HTML lesson bodies are not included in the public app ZIP or the Cloud Functions source.
- Added `storage.rules` to deny all direct client reads and writes. The Cloud Functions Admin SDK reads the private objects after the callable's authorization check.

## Required setup and deployment

1. In Google Cloud CLI, authenticate and select the Firebase project:

   ```bash
   gcloud auth login
   gcloud config set project jamb-b6a95
   ```

2. Upload the private course pages from the sibling folder (run this from the directory containing both `JAMB-main` and `PRIVATE-DO-NOT-PUBLISH`):

   ```bash
   gcloud storage rsync -r PRIVATE-DO-NOT-PUBLISH/course-content gs://jamb-b6a95.firebasestorage.app/course-content
   ```

3. Grant the Cloud Functions runtime service account permission to read objects. For this project, the default Compute Engine service account is typically:

   ```bash
   gcloud projects add-iam-policy-binding jamb-b6a95 \
     --member="serviceAccount:794234514415-compute@developer.gserviceaccount.com" \
     --role="roles/storage.objectViewer"
   ```

   Confirm the actual runtime service account in Google Cloud Console before applying the binding if the project uses a custom service account.

4. From `JAMB-main`, deploy the backend and Storage rules:

   ```bash
   firebase deploy --only functions,firestore,storage
   ```

5. Publish only the contents of `JAMB-main` to the public GitHub Pages/Vercel site. Do not publish the sibling `PRIVATE-DO-NOT-PUBLISH` folder or its ZIP. Remove/purge any older public course HTML copies and CDN caches.

## Required verification before paid launch

- Signed-out user can open all 48 free pages.
- Signed-out user cannot open a paid page.
- Signed-in user with expired/no Premium cannot open a paid page.
- Active subscriber can open paid pages.
- Direct browser requests to Cloud Storage objects are denied.
- Old static copies of paid lessons are no longer reachable from the public host, repository, branches, CDN, or backups.

Run `node functions/scripts/verify-course-delivery.js` from `JAMB-main` while the sibling private folder is present. This is a structural check only; it does not replace Firebase Emulator or live authorization tests.

**Status:** source implementation and structural checks completed; Cloud Storage upload, IAM permission, deployment, and live tests have not been performed. Lesson content displayed to an authorized subscriber can still be copied by that subscriber; this is access control, not DRM.
