# MR.Career — Hosting-ready package (V13.47)

A static, client-side career planning website. No build command, server, account system, or database is required for the current version.

## Latest UI fix (V13.47)

- Replaced the Career Switch Planner current-role and target-role native browser dropdowns with searchable custom dropdowns.
- Role results are limited to a 154px scroll region (about five visible rows); users scroll for more roles.
- This avoids the browser-controlled native select popup opening upward and showing a long, uncontrolled list.

## Latest UI fix (V13.47)

- Fixed Career Switch Planner role dropdown layering: the active role card now paints above later grid cards, preventing role text from showing through the target-date field.
- Dropdown results remain limited to a 154px scroll area. No role selection, storage, or planner behavior was changed.

## Latest UI refinement (V13.47)

- Adjusted the role dropdown results viewport to 145px with 29px rows, fitting five complete role rows without changing selection behavior.

## Files

- `index.html` — default website entry point for static hosting.
- `app.html` — same application filename retained for compatibility with previous versions.
- `404.html` — simple fallback page.
- `.nojekyll` — allows GitHub Pages to serve files without Jekyll processing.
- `netlify.toml` — Netlify publish directory and basic response headers.
- `vercel.json` — Vercel static hosting headers.
- `DEPLOYMENT_CHECKLIST.md` — step-by-step hosting and smoke-test checklist.

## Fastest hosting options

### Netlify
1. Extract this ZIP.
2. Open Netlify and choose **Add new site / Deploy manually** (wording may vary).
3. Drag the extracted folder contents, or the folder itself if the interface accepts it, into the deploy area.
4. Confirm the deployed site opens `index.html`.

### GitHub Pages
1. Create a GitHub repository and upload all files from this folder to the repository root.
2. Open **Settings → Pages**.
3. Choose deployment from the `main` branch and `/ (root)`, then save.
4. Wait for the published URL and open it.

### Vercel
1. Create a Git repository containing all files in this folder.
2. Import that repository into Vercel.
3. Choose the static/other framework preset; leave build command and output directory empty or set output directory to `.` if required by the interface.
4. Deploy and test the published URL.

## Important local-data note

The app stores its data in the user's browser. It does not sync between browsers or devices. Browser storage is scoped to the site origin, so moving from a local file or an older hosted URL to a new domain may make previous progress appear missing. Export a backup from the old version before switching, then import it on the new site if the app's backup format supports it. Do not clear browser site data unless you intend to remove locally stored information.

## Local test

Open `index.html` in a modern browser. For the most reliable testing, use a simple local static server rather than opening the file directly, because some browser APIs behave differently for `file://` URLs. There is no package installation or build step.

## Release notes

This package carries forward V13.39 certification recommendations and audit fixes. It adds hosting entry points and deployment configuration without introducing a backend or changing the app to require a database.


## V13.41 — Reliability and discoverability update
- Added public About, Privacy, Terms, Contact and Accessibility pages linked by the application footer.
- Added local global search for app pages and curriculum topics. Open with the Search button, Ctrl/Cmd+K, or `/` when not typing in a field.
- Added a dashboard Continue Learning card that resumes an in-progress topic first, then recommends the next incomplete topic; completed topics remain separate from planner sessions and projects.
- Added a confirmation before importing data, a 10 MB backup limit, and application identity checks. Export now records the current release and schema version.
- Progress metrics continue to derive from the existing shared browser state and curriculum. The app remains static and local-first; no database or account was added.
- Privacy/terms content is starter copy and should be reviewed against the actual hosting provider and any third-party scripts before launch.


## V13.42 — Fixed welcome role dropdown
- The welcome-page role menu is absolutely positioned over the existing card, so opening it does not increase the card or page height.
- The role list has a fixed scroll viewport sized for approximately five visible role rows; search remains available for finding other roles.


## V13.43 — Welcome dropdown overlap polish
- Raised the welcome role picker and its dropdown above the underlying action buttons using explicit stacking contexts.
- Kept the menu surface opaque and constrained scrolling/clipping to the role list itself so underlying button text cannot visually bleed through.
- No role selection, navigation, curriculum, planner, storage or backup logic changed.


## V13.44 update
- Visible product branding updated to **MR.Career**.
- Removed the Home hut icon and interview-answer button symbols.
- Saved-profile timestamps now display the date only.
- Custom role menus are constrained to five visible rows with scrolling for the remaining roles.
- Removed the blue focus glow; backup compatibility identifiers are intentionally preserved.
