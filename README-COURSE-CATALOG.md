# TopScore course catalogue update

Added `courses.html` and `course-catalog.json`. The catalogue is generated from the five subject folders already present in `courses/`: Mathematics, English Language, Biology, Physics and Chemistry. Each subject has its own Lucide vector icon (calculator, book-open-check, dna, atom and flask-conical). Subject cards link to the existing subject landing pages. Free counts are read from the existing `free-pages.json` allowlist; this page does not grant premium access.

The dashboard My Courses navigation and quick-action More link now point to `courses.html`. No lesson files were renamed or removed.

To add a new subject, add its course folder and landing page, then add its metadata to the `subjects` array in `course-catalog.json` (icon must be a Lucide icon name) and update the approved free-page allowlist in `free-pages.json` as appropriate. This is a student-facing catalogue update; secure admin CRUD and backend enforcement still require a server-side role-checked implementation.
