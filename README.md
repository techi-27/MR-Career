# MR.Career

**A free, browser-based workspace for IT career discovery, structured learning, hands-on practice, and interview preparation.**

MR.Career helps learners explore technology roles, understand role expectations, organise learning, practise skills, plan projects, and prepare for their next career move — all in one place.

- **Live website:** https://techi-27.github.io/MR-Career/
- **Application:** https://techi-27.github.io/MR-Career/app.html
- **About:** https://techi-27.github.io/MR-Career/about.html
- **Repository:** https://github.com/techi-27/MR-Career
- **Hosting:** GitHub Pages (static website)
- **Current model:** No account, backend API, or server-side application database is required.

> **Project status:** The site is deployed and automated Playwright smoke tests are running against the live GitHub Pages URL. The latest recorded run passed 4 tests. This is useful smoke-test coverage, not a guarantee that every feature or device has been exhaustively tested.

---

## Table of contents

- [Why MR.Career?](#why-mrcareer)
- [Who is it for?](#who-is-it-for)
- [Features](#features)
- [How to use it](#how-to-use-it)
- [Privacy and local data](#privacy-and-local-data)
- [Technology and architecture](#technology-and-architecture)
- [Repository structure](#repository-structure)
- [Run locally](#run-locally)
- [Deployment](#deployment)
- [Automated browser testing](#automated-browser-testing)
- [Accessibility and responsive design](#accessibility-and-responsive-design)
- [Known limitations](#known-limitations)
- [Launch checklist](#launch-checklist)
- [Contributing and feedback](#contributing-and-feedback)
- [Disclaimer](#disclaimer)

## Why MR.Career?

Technology career preparation can be difficult to organise across job descriptions, course notes, roadmaps, practice tasks, and project ideas. MR.Career brings these activities together in a single browser-based workspace so a learner can move from a target role to a practical learning plan.

The intended learning structure is:

**Domain → Role → Skills → Projects → Learning Path → Job Description and Responsibilities**

The workspace is intended to help users understand what a role involves, identify skills to practise, organise their study, and review their progress. It is a learning and planning aid, not a job-placement service.

## Who is it for?

MR.Career is designed for:

- Students and people beginning an IT career.
- IT professionals planning a role change or career progression.
- DevOps, Platform Engineering, Cloud, DevSecOps, MLOps and other technology learners.
- Professionals who want to compare role responsibilities and skill expectations.
- Self-directed learners who want to plan study and hands-on projects without creating an account.

The role and learning content may evolve as the project develops. Always verify time-sensitive job, certification, exam, and salary information with the relevant employer or official provider.

## Features

### 1. Career and role exploration
- Explore IT career paths and role expectations.
- Review responsibilities and skills associated with different roles.
- Use role-focused guidance to identify learning priorities.
- Move between career information and relevant learning areas.

### 2. Roadmaps and learning curriculum
- Follow structured roadmaps and topic-based learning content.
- Review curriculum areas and mark learning progress where supported.
- Use learning recommendations to identify a next topic or area to revisit.
- Explore computer fundamentals and technology-specific learning material.

### 3. Study planner
- Organise learning goals and study activities.
- Review planned work and completion progress.
- Keep study activity connected to ongoing learning goals.
- Revisit incomplete work and adjust your plan as your schedule changes.

### 4. Continue Learning
- Resume an in-progress topic where supported.
- Get a recommendation for the next incomplete topic.
- Keep completed topics distinct from other planner sessions and project activity.

### 5. Career switch planning
- Compare a current role with a target role.
- Use searchable role selectors to find roles in the planner.
- Scroll through the role results without opening an oversized native browser dropdown.
- Plan a target transition and review the skills that may need attention.

### 6. Interview preparation
- Practise role-related interview questions and answers.
- Use preparation activities to identify topics that need further study.
- Treat suggested answers as study guidance and adapt them to your actual experience.

### 7. Projects and practical skills
- Organise project ideas and hands-on practice.
- Use practical work to reinforce learning and build evidence of skills.
- Track project activity separately from curriculum completion where supported.

### 8. Search and navigation
- Use the application navigation to reach available workspaces and tools.
- Use global search for supported app pages and curriculum topics.
- Open search with the Search control, **Ctrl/Cmd + K**, or **/** when focus is not inside a text-entry field.

### 9. Export, import and local progress
- Export a backup of supported application data.
- Import a backup to restore data in the same application.
- Import includes confirmation and validation safeguards.
- Keep exported files private; they may contain personal learning notes and career progress.

### 10. Public information pages
The website includes:
- **Home** — product introduction and entry point.
- **About** — purpose and overview of the workspace.
- **Privacy** — information about browser-local data and hosting.
- **Terms** — general terms of use.
- **Accessibility** — accessibility information.
- **Contact** — feedback and contact route.

## How to use it

1. Open the [MR.Career website](https://techi-27.github.io/MR-Career/).
2. Choose **Open App** or **Get started** to enter the workspace.
3. Explore a role or career direction that matches your goal.
4. Review the skills and learning topics for that role.
5. Build a study plan and choose practical work to complete.
6. Revisit your progress regularly and adjust the next steps.
7. Export a backup periodically if your progress is important to you.

No account is required for the current version.

## Privacy and local data

MR.Career is a static, local-first website. Its current application features store supported preferences, learning progress, and workspace data in browser storage on the device and browser profile you use.

Please keep the following in mind:

- Data is **not automatically synced** across devices, browsers, or browser profiles.
- The site owner does not receive data stored solely in local browser storage through the app's current local-only features.
- The hosting provider may process standard technical information, such as requests and server logs, under its own policies.
- Clearing site data, using private browsing, changing browser profiles, or moving to a different domain can make existing progress unavailable.
- Before changing domains or clearing browser data, export a backup and keep it in a secure location.
- Importing a backup may replace current application data. Export your current data first if you need to preserve it.
- Only import backup files from sources you trust.

Read the [Privacy page](https://techi-27.github.io/MR-Career/privacy.html) for more information. The privacy notice should be reviewed whenever hosting, analytics, external scripts, forms, or other data processing changes.

## Technology and architecture

The current project is intentionally simple to host and maintain.

| Area | Current approach |
| --- | --- |
| Website | Static HTML, CSS and JavaScript |
| Main application | `app.html` |
| Landing page | `index.html` |
| Hosting | GitHub Pages |
| Data persistence | Browser-local storage |
| Account/authentication | Not required |
| Server-side app database | Not required |
| Build step | Not required for the static website |
| Browser automation | Playwright |
| CI workflow | GitHub Actions |

This architecture keeps hosting simple and avoids requiring a server or database for the current feature set. It also means there is no built-in cross-device synchronisation or central account-based recovery.

## Repository structure

Important files and folders:

| Path | Purpose |
| --- | --- |
| `index.html` | Landing page and default website entry point |
| `app.html` | Main career-planning and learning application |
| `about.html` | About page |
| `privacy.html` | Privacy information |
| `terms.html` | Terms of use |
| `accessibility.html` | Accessibility information |
| `contact.html` | Contact and feedback information |
| `404.html` | Fallback page for unavailable routes |
| `.nojekyll` | Tells GitHub Pages not to process the site through Jekyll |
| `netlify.toml` | Static hosting configuration for Netlify |
| `vercel.json` | Static hosting headers/configuration for Vercel |
| `DEPLOYMENT_CHECKLIST.md` | Manual deployment and smoke-test checklist |
| `AUDIT_NOTES.md` | Notes from recent UI/code audits |
| `package.json` | npm script and Playwright test dependency |
| `playwright.config.js` | Playwright configuration |
| `tests/e2e/live-app.spec.js` | Live browser smoke tests |
| `.github/workflows/live-browser-tests.yml` | GitHub Actions workflow for automated tests |

## Run locally

You do not need to compile the static website.

### Option A — open the page directly

Open `index.html` in a modern browser. Some browser APIs can behave differently when a page is opened using a `file://` URL, so a local HTTP server is preferable for testing.

### Option B — use a local static server

If Python is installed, run this command from the repository root:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

Stop the server with **Ctrl + C**.

## Deployment

### GitHub Pages (current hosting)

The project is published through GitHub Pages.

1. Push website files to the repository's `main` branch.
2. In GitHub, open **Settings → Pages** and verify the configured source/branch and root folder.
3. Wait for the Pages deployment workflow to finish.
4. Open the public URL and check the landing page, app and legal/information pages.
5. Run the browser test workflow and review its result.

Current URLs:

- Website: https://techi-27.github.io/MR-Career/
- Application: https://techi-27.github.io/MR-Career/app.html

### Custom domain

A custom domain can be configured in **Repository → Settings → Pages → Custom domain** after registering a domain with a registrar.

1. Add the domain in GitHub Pages settings.
2. Configure the DNS records recommended by GitHub for the chosen apex domain or subdomain.
3. Wait for DNS changes to propagate.
4. Enable **Enforce HTTPS** once GitHub makes it available.
5. Test the domain over HTTPS, including navigation links, mobile layouts, and browser storage.
6. Keep in mind that browser-local data belongs to a site origin. Moving to a custom domain may make existing progress appear missing; export a backup first.

Follow GitHub's current documentation for the exact DNS records; they can differ depending on whether you use an apex domain or a subdomain.

### Other static hosts

The repository includes configuration files for Netlify and Vercel. If deploying elsewhere, upload the complete site and verify that `index.html` is served as the landing page and that the `app.html` path remains available. Check the selected host's current documentation for its configuration steps.

## Automated browser testing

The project uses [Playwright](https://playwright.dev/) with [GitHub Actions](https://github.com/features/actions) to run smoke tests against the deployed website.

The workflow runs on pushes to `main`, pull requests targeting `main`, manual dispatch, and a daily schedule. It installs Chromium, waits for the app to return HTTP 200, executes the tests, and uploads the Playwright report and failure evidence when available.

### Current automated coverage

- Application responds with HTTP 200 and the expected page title.
- No uncaught browser JavaScript errors during the tested load/navigation flows.
- No page-level horizontal overflow at desktop (1440px), tablet (820px), mobile (390px), or small mobile (320px) widths.
- Available main navigation items can be opened without uncaught JavaScript errors.
- About page's **Open workspace** button label is visible and fits inside the viewport.

The latest recorded run passed all **4 tests**. This does not mean every workflow, browser, assistive technology, or feature has been tested. Continue manual testing for core learning flows, data import/export, keyboard navigation, and real mobile devices.

### Run the tests on your computer

Use Node.js 22 or a compatible current Node.js release.

```bash
npm install
npx playwright install --with-deps chromium
npm run test:e2e
```

To test a different deployed URL:

**Linux/macOS:**
```bash
APP_URL="https://your-domain.example/app.html" npm run test:e2e
```

**PowerShell:**
```powershell
$env:APP_URL = "https://your-domain.example/app.html"
npm run test:e2e
```

The test run creates an HTML report in `playwright-report/`; failure screenshots and traces may be saved under `test-results/`. The GitHub Actions workflow retains its uploaded report artifact for 14 days.

## Accessibility and responsive design

The pages include semantic HTML landmarks, page titles, viewport metadata, visible focus styles on relevant links, and responsive CSS breakpoints. Automated tests check page-level horizontal overflow at several viewport widths.

These checks are not a full accessibility certification. Before a wider launch, manually test keyboard-only use, focus order, contrast, text resizing, screen-reader labels, form feedback, and interactive controls.

## Known limitations

- No login, user accounts, server-side database, or cross-device synchronisation in the current version.
- Browser-local data can be lost if site data is cleared or a browser profile/device changes.
- Automated tests are smoke tests and do not exercise every feature or every possible user path.
- Career guidance and learning recommendations are educational aids and may not match every employer's requirements.
- Privacy and terms content must be kept aligned with the actual hosting setup and any future third-party integrations.
- A custom domain must be registered and configured separately; the current default address is a GitHub Pages URL.

## Launch checklist

Before announcing a public launch, work through these checks:

- [ ] Confirm the landing page, application, About, Privacy, Terms, Accessibility and Contact pages load.
- [ ] Check navigation links and the 404/fallback page.
- [ ] Test desktop, tablet, and real mobile devices.
- [ ] Test role selection, roadmaps, learning topics, study planning, interview preparation and project tracking.
- [ ] Create a small test plan, update progress, refresh the page, and verify persistence.
- [ ] Test export and import with a non-critical test backup.
- [ ] Check the browser console and failed network requests.
- [ ] Review keyboard navigation, focus visibility, contrast and text wrapping.
- [ ] Review Privacy and Terms against the actual service and hosting setup.
- [ ] If using a custom domain, verify DNS, HTTPS, redirects and all links.
- [ ] Run the latest [GitHub Actions browser tests](https://github.com/techi-27/MR-Career/actions).
- [ ] Export a backup of any important existing workspace data before changing the site's domain/origin.

The detailed [deployment checklist](DEPLOYMENT_CHECKLIST.md) contains additional manual smoke tests.

## Contributing and feedback

Feedback, bug reports, and improvement suggestions are welcome. When reporting a UI issue, include:

- The page or workspace where it occurred.
- The steps needed to reproduce it.
- Your browser and device/viewport size.
- A screenshot or browser-console error, if available.

Use the [Contact page](https://techi-27.github.io/MR-Career/contact.html) or open an issue in the [GitHub repository](https://github.com/techi-27/MR-Career/issues). Do not include passwords, sensitive personal information, or private backup files in public issues.

## Disclaimer

MR.Career is an educational and career-planning workspace. It does not guarantee employment, salary, interview success, certification completion, or hiring outcomes. Verify exam details, certification requirements, pricing, job requirements, and other time-sensitive information with the official provider or employer. The information on this website is general guidance and is not legal, financial, or professional advice.

---

**MR.Career — Learn · Practise · Build · Prepare**
