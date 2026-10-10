# MR.Career Functional Audit

**Audit date:** 10 October 2026  
**Application:** https://techi-27.github.io/MR-Career/app.html  
**Repository:** https://github.com/techi-27/MR-Career

## Summary

The live application passed **14 automated Playwright tests** in GitHub Actions. The checks covered app initialization, JavaScript runtime errors during tested flows, all configured application routes, role selection and persistence, career discovery, global search, resume/JD analysis, study-plan generation and session completion, missed-session catch-up, project checklist persistence, export/import/reset, responsive overflow, and public information pages.

This is a strong smoke/regression check, **not a claim that every control and every possible workflow has been exhaustively tested**. Continue manual verification before a broad launch.

## Pages and workspaces reviewed

| Page / workspace | Current purpose | Audit result / next improvement |
| --- | --- | --- |
| Home / Dashboard | Overview and entry point | Route renders. Keep first-run role selection clear and ensure the dashboard has a helpful empty state before a role is selected. |
| Explore IT Careers | Search and browse roles | Route renders. Add filters for experience level, job family, and role type if users need faster discovery. |
| Career Discovery | Preference questions and role recommendations | Automated check confirms an answer produces recommendations. Explain recommendation scoring and allow users to compare top matches. |
| Compare Careers | Compare role paths | Route renders. Add a clear comparison summary and explain how skill-depth or readiness values are calculated. |
| My Career Profile | Experience, background and skills | Route renders. Add clearer field validation and a visible save/error status test for all profile fields. |
| Career Switch Planner | Current role, target role, study hours and target date | Route renders. Add end-to-end tests for both custom role pickers, date validation, and plan generation from this page. |
| Target Role / Job path | Role-focused guidance | Route renders. Keep role responsibilities and prerequisites grounded in current, reputable sources. |
| Study Planner / Daily Calendar | Date range, selected domains, daily schedule | Automated tests generate a plan, complete today's session, verify persistence, and move a missed session to catch-up. Further test custom ranges, invalid dates, plan edits, and repeated rescheduling. |
| Roadmap & Learning | Curriculum and topic progress | Route renders. Add tests for opening a topic, changing its status/progress, closing the learning panel, and preserving progress after refresh. |
| Technology Explorer | Explore technology areas | Route renders. Consider adding prerequisites, official documentation links, and hands-on practice links for each technology. |
| Skill Dependencies / Skill Map | Show learning order | Route renders. Explain dependency relationships and distinguish required prerequisites from suggested ordering. |
| Certifications | Role-related certification recommendations | Route renders. Periodically verify exam names, prerequisites, costs and links against official certification pages. |
| Learn & Practice / Labs | Hands-on exercises and completion tracking | Route renders. Add lab-specific validation/evidence prompts and test completion persistence across refreshes. |
| Knowledge Self-Check | Self-rate topic knowledge | Route renders. **Some topics have no stored question bank** and display a message asking users to create questions themselves. Add curated questions, answer explanations, and review mode. |
| Interview Practice | Rate interview answers | Route renders. This is currently a self-rating workflow, not an answer evaluator. Add sample answer outlines, evaluation rubrics and a notes field if useful. |
| Resume Analyzer | Local role-keyword/structure heuristic | Automated test confirms an analysis result appears. Keep the limitation visible: this is not an ATS guarantee. Add sample input, clearer score methodology, and exportable feedback. |
| Job Description Analyzer | Match a pasted JD against role-related skill areas | Automated test confirms analysis results. This is local keyword matching, not an AI judgement. Show exact matched phrases, limitations, and a prioritised learning plan. |
| Job Readiness | Summarise readiness | Route renders. Explain how the score is weighted and link each gap to a topic, lab or project. |
| Skill Gap Priorities | Highlight gaps | Route renders. Prioritise gaps by role importance and estimated effort, and avoid implying the score predicts hiring outcomes. |
| Weekly Review | Review progress | Route renders. Add a date-range summary and a clear next-week action list if users need more guidance. |
| Daily Career Coach | Next-step guidance | Route renders. Keep recommendations tied to recorded progress and let users dismiss or complete suggested actions. |
| Project Studio / Portfolio | Role-based projects, checklist and notes | Automated test confirms a checklist item persists after reload. Add project export/shareable evidence summaries and test notes persistence as well as checkboxes. |
| Public Home (index.html) | Product landing page | Loads successfully; local navigation links reviewed. |
| About (about.html) | Product explanation | Loads successfully; CTA is visible and fits the viewport. |
| Privacy (privacy.html) | Local storage and hosting explanation | Loads successfully and passes responsive overflow checks at 320, 390, 820 and 1440 px. Review wording whenever hosting or data processing changes. |
| Terms (terms.html) | Use and limitation terms | Loads successfully and passes responsive overflow checks. Have the wording reviewed for the real product and applicable jurisdiction before commercial launch. |
| Contact (contact.html) | Contact route | Loads successfully and passes responsive overflow checks. There is no contact form; users are directed to a public LinkedIn profile. Add a form only if you are ready to manage submissions and update the privacy notice. |
| Accessibility (accessibility.html) | Accessibility guidance | Loads successfully and passes responsive overflow checks. This page is not evidence of WCAG conformance; run keyboard, focus, zoom and screen-reader checks. |
| 404 fallback | Unavailable routes | Static fallback exists; verify its behaviour on the actual hosting URL during final deployment checks. |

## Automated checks completed

- App loads over HTTP 200 and has no uncaught JavaScript errors during the tested load.
- All configured application routes render content without the generic page-error fallback.
- No page-level horizontal overflow at 1440, 820, 390 or 320 px for the app; public information pages are also checked at these widths.
- Role selection updates the target role and survives reload.
- Global search opens with Ctrl+K, filters results and closes with Escape.
- Career Discovery accepts an answer and displays recommendations.
- Resume Analyzer and Job Description Analyzer produce results for sample text.
- Study Planner generates a dated plan, marks a session complete, preserves completion after reload, and moves a missed session to catch-up.
- Project checklist completion persists after reload.
- Export downloads a JSON backup; importing that backup restores the selected role after confirmation.
- Reset requests confirmation and returns to first-run role setup.
- Public information pages load and the About CTA is visible.

**Latest run:** [14 tests passed](https://github.com/techi-27/MR-Career/actions/runs/38045479891)  
**Test code:** [tests/e2e/live-app.spec.js](https://github.com/techi-27/MR-Career/blob/main/tests/e2e/live-app.spec.js)

## Recommended priorities

### P1 — Before a wider public launch
1. Manually test all profile and Career Switch Planner fields, including invalid/missing dates and role changes after a plan exists.
2. Review all curriculum topics with missing quiz questions; build a useful baseline question bank.
3. Validate certification and external learning links against official sources.
4. Perform keyboard-only, focus-order, browser zoom, contrast and screen-reader checks on desktop and mobile.
5. Review Privacy and Terms for the actual deployment and any third-party services.

### P2 — Improve learning outcomes
1. Add answer outlines and rubrics to Interview Practice.
2. Explain how readiness, role match and resume/JD scores are calculated.
3. Connect each identified skill gap to a topic, lab, project and interview prompt.
4. Add a clear export/share summary for project evidence and progress.

### P3 — Maintainability
The main app.html is a large single-file application with many accumulated CSS blocks and !important declarations. Refactor the stylesheet in small, tested sections, consolidate duplicate overrides, and keep a visual regression test for the sidebar, header controls, planner, and mobile layouts. **Do not remove features just to reduce file size**; remove duplicate code only after verifying equivalent behaviour.

## Removal recommendation

No major feature should be removed based on this audit. The more useful next step is to improve incomplete learning content, score transparency, accessibility validation, and maintainability while preserving the local-first, no-login design.
