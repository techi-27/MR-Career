# MR.Career V13.47 — Dropdown Text Overlap Fix

## Reported issue
The custom role list in Career Switch Planner was being painted beneath a later grid card, causing the target-date input and its placeholder to appear over role options.

## Fix
- CSS-only stacking-context correction on the active `.v9-selectgrid` card.
- The active role picker card is elevated above sibling grid cards while its menu is open.
- Menu, search input, and scrollable results receive opaque theme backgrounds.
- Preserved the existing custom dropdown JS and role-selection flow.

## Additional overlap review
- Checked the relevant role-picker/card/grid stacking rules and ensured the menu's 154px result viewport clips and scrolls its options.
- This is a targeted static CSS audit, not a full interactive browser audit.

## Validation
- Inline JavaScript syntax: PASS for both `app.html` script blocks.
- ZIP integrity: PASS.
- Interactive browser test: not run; Chromium could not launch in this environment.


## V13.47 live browser refinement
- Set role-results viewport to 145px and role rows to 29px each so five complete rows fit exactly.
- Search, scroll, and selection behavior remain unchanged.
