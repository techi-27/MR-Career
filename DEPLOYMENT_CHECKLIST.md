# Deployment checklist

## Before publishing
- [ ] Keep a copy of the previous release ZIP.
- [ ] Export/backup any important in-app progress before changing domains or origins.
- [ ] Upload all files from this package, not only `index.html`, so host configuration and fallback files are included.

## After publishing
- [ ] Open the public URL in a desktop browser.
- [ ] Open the same URL on a mobile device or responsive emulator.
- [ ] Check Home, career/role pages, roadmap, study planner, certifications, and other navigation pages.
- [ ] Change a setting or mark a task complete, refresh, and confirm it persists.
- [ ] Test export and import with a small backup before relying on it.
- [ ] Test a nonexistent URL and confirm the fallback page behaves acceptably.
- [ ] Check browser console for JavaScript errors and failed network requests.
- [ ] Verify outbound certification/resource links open the intended official pages.
- [ ] Test the site in a private window to understand the first-time experience.

## Known scope limitation

The JavaScript syntax and ZIP structure can be checked before deployment, but final interactive verification must be run in a real browser after hosting. This package does not claim a full end-to-end browser test has been completed.


## V13.45 role-dropdown regression check
- [ ] In Career Switch Planner, open Current career and Target career; verify about five role rows are visible at once.
- [ ] Scroll the dropdown list and confirm later roles are reachable.
- [ ] Search for a role, select it, and verify the planner updates and the menu closes.


## V13.46 overlap regression check
- [ ] Open Current career; verify role text and menu background fully cover the target-date field behind it.
- [ ] Scroll the role list and verify no text escapes the results viewport.
- [ ] Open Target career and repeat the same checks.
- [ ] Close the menu and verify the date field and other grid cards remain usable.

- [ ] Confirm exactly five complete role rows fit in the dropdown viewport.
