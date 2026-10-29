# Hon. Duncan Maina Mathenge: official website

Multi-page React + Vite site for the Member of Parliament for Nyeri Town, with a Firebase admin dashboard at `/admin`.
Built by SpenceTec and Logistics Limited.

## Run locally
```bash
npm install
npm run dev      # http://localhost:5173
npm run lint
npm run build    # output in dist/
```

## Content
The site ships with built-in content (profile, committees, Bills, motions) taken from the Parliament of Kenya, Mzalendo and TrackMinster.
Once Firebase is connected, anything saved in the dashboard replaces the built-in version.

**Portrait:** put `portrait.jpg` (or `.png` / `.webp`) in `src/assets/images/`, or upload it from the dashboard (Profile and career).

## Firebase setup (free Spark plan, no Storage needed)
1. Firebase console: create a project, then Build, Firestore Database, create (production mode).
2. Build, Authentication, Sign-in method: enable **Email/Password**. Add the office users under Users.
3. Project settings, Your apps, add a **Web app**. Copy `apiKey`, `authDomain`, `projectId`, `appId` into `site.config.js`.
4. Firestore, Rules: paste the contents of `firestore.rules` and Publish.
5. Make someone an administrator: Firestore, start collection `admins`, document ID = that user's **UID** (shown on the "No access" screen after they sign in), field `ok` = boolean `true`.
6. Authentication, Settings, Authorized domains: add the live domain and the `*.workers.dev` address.
7. Redeploy. Open `/admin`.

Photos are resized in the browser and stored in Firestore (about 100 to 200 KB each; a project can hold up to 5). Videos are links (YouTube, Google Drive, Facebook, TikTok).
Projects and News support **Import from file** (CSV or JSON; duplicates by title are skipped). Use the "CSV template" button for the columns.

## Deploy to Cloudflare Workers
```bash
npm run build
npx wrangler deploy
```
`wrangler.jsonc` serves `dist/` with single-page-app fallback, so `/about`, `/admin` etc. work on refresh.

## Filling a new database

After Firebase is connected and your account is in `admins`, open `/admin/starter` (“Fill the database” in the dashboard menu) and press the button. It writes the profile, career, education, Parliament record, contact details and news into Firestore. Items already in the database are kept unless you tick “Replace”, so it is safe to press again.

## Uploading videos

The Gallery accepts video files as well as video links (Dashboard → Gallery → Add item → Type: **Video file (upload)**). Videos are stored in Firebase Storage, because the database only holds small records.

One-time setup in the Firebase console:

1. **Build → Storage → Get started.** Firebase asks for the Blaze (pay-as-you-go) plan to create the bucket. It includes a free monthly allowance, so a handful of short videos usually costs nothing, but a card must be on file. Setting a budget alert under Billing is a good idea.
2. Choose a location (us-central1, us-east1 or us-west1 keep you inside the free allowance) and finish.
3. **Storage → Rules:** paste the contents of `storage.rules` and **Publish**. Firebase asks to let Storage read Firestore (to check `admins`); allow it.
4. The bucket name must match `storageBucket` in `site.config.js` (it already does if you pasted the full config from the console).

Tips: MP4 (H.264) plays everywhere. Keep files under 200 MB; exporting at 720p keeps them small. Deleting a video item in the dashboard also deletes the file from Storage.
