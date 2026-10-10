# MR.Career Functional Audit & Product Recommendations

**Review date:** 10 October 2026  
**Application:** https://techi-27.github.io/MR-Career/app.html  
**Repository:** https://github.com/techi-27/MR-Career

## Executive summary

MR.Career is a local-first career-planning application. The main journey is:

**Discover a suitable role → choose a target role → plan a career switch → generate a study plan → practise and prove skills → prepare job applications.**

The navigation has been simplified to focus on that journey. Incomplete or overlapping destinations have been consolidated into core workspaces rather than deleting user progress or changing the local-storage schema.

## Navigation and feature decisions

| Previous destination | Decision | Where to go now |
| --- | --- | --- |
| Knowledge Self-Check / Quiz Center | Removed from navigation and route registry because some topics have no usable question bank. Its score is no longer used in readiness calculations. Existing saved browser data is left untouched. | Practice Labs and Interview Practice |
| Technology Explorer | Consolidated; it repeats role-focused technology/topic browsing available in the roadmap. | Roadmap & Learning |
| Skill Map / Skill Dependencies | Consolidated; dependency ordering belongs with the roadmap. | Roadmap & Learning |
| Skill Gap Analyzer | Consolidated with the readiness page, which now shows weighted priority gaps and direct Learn actions. | Job Readiness |
| Daily Career Coach | Consolidated with weekly review and next steps to avoid a separate, overlapping progress destination. | My Progress |
| Portfolio | Already a section of Project Studio, not a separate destination. | Project Studio |
| Certifications | Kept as an optional, role-specific reference. Verify details on official provider sites before booking. | Roadmap & Learning |
| Interview Practice | Kept as a core job-preparation tool. It is a self-rating workflow, not an automated answer evaluator. | Learn & Practice |
| Resume and Job Description Analyzers | Kept. They use local heuristics and keyword matching, not an ATS or AI guarantee. | Application Toolkit |
| Study Planner / Daily Calendar | Kept as a core feature. | My Career Plan |
| Career Discovery, Compare Careers, Profile and Career Switch Planner | Kept. | Explore IT Careers / My Career Plan |

Old internal links for consolidated pages redirect to the closest supported core workspace so they do not lead to a broken page.

## Current primary navigation

1. **Home** — overview, selected target role, progress and next steps.
2. **Explore IT Careers** — browse roles, discover a role fit, compare options.
3. **My Career Profile** — experience, current skills, goal, target date and study availability.
4. **My Career Plan** — current role, target role, weekly study availability, target date and plan generation.
5. **Roadmap & Learning** — target-role learning order, curriculum and certification references.
6. **Learn & Practice** — hands-on labs and interview practice.
7. **Project Studio** — project checklists and evidence.
8. **Application Toolkit** — resume and job-description analyzers.
9. **Readiness & Skill Gaps** — readiness breakdown and weighted skill gaps in one place.
10. **My Progress** — weekly study review, missed sessions and next priorities.

Workspace sub-tabs have been reduced too; the goal is fewer choices at each step, not merely hiding links from the sidebar.

## Functional checks

The automated Playwright suite checks the live app and includes coverage for:

- App initialization and uncaught JavaScript errors during tested flows.
- Main routes render useful content.
- Role selection and persistence after reload.
- Global search keyboard shortcut, filtering and Escape behavior.
- Career Discovery recommendations.
- Resume and job-description analyzer sample flows.
- Study-plan generation, session completion persistence and missed-session catch-up.
- Project checklist persistence.
- Export, import with confirmation, and reset with confirmation.
- Desktop, tablet and narrow-mobile horizontal overflow.
- Public information pages.
- Simplified navigation and safe redirects from consolidated legacy routes.

Latest successful pre-change run: [14 tests passed](https://github.com/techi-27/MR-Career/actions/runs/38045579215). The new navigation consolidation tests must pass before treating this change as validated.

## Recommended remaining work

### Priority 1 — Validate before wider launch
- Manually test profile fields, role changes after a plan exists, date validation, and study-plan regeneration.
- Validate certification names and links against official sources.
- Test keyboard-only navigation, focus visibility, zoom, contrast and screen readers.
- Review Privacy and Terms against actual hosting and data practices.
- Verify every important learning topic has clear instructions, prerequisites, and credible references.

### Priority 2 — Improve learning outcomes
- Add sample answer outlines and transparent rubrics to Interview Practice; keep its current self-rating nature clearly stated until real evaluation exists.
- Explain readiness, career-match and resume/JD scoring methods in plain language.
- Connect gaps to a learning topic, hands-on lab, project evidence and interview prompt.
- Add exportable project-evidence summaries if users need to share their work.

### Priority 3 — Maintainability
The application remains a large single-file app with accumulated CSS overrides. Refactor only in small, tested steps. Keep regression checks for role selection, navigation, planner persistence, import/export, sidebar/header, and mobile layout.

## Data safety

- Do not clear or rewrite existing user localStorage as part of navigation cleanup.
- Do not change the backup/import schema unless a migration is explicitly tested.
- Existing quiz-related saved values may remain in browser storage, but they are no longer shown or used for the readiness score.
- Keep Export and Import available and tested.

## Removal recommendation

No additional core features should be removed at this stage. Prioritize content quality, score transparency, and testing rather than further reducing the main career-learning journey.
