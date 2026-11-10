# Daam remaining work

Scope: Phase 2 only. Updated November 10, 2026.

## Completed in this continuation

- [x] Inspect Git history and existing Phase 2 implementation; preserve uncommitted work.
- [x] Fix motion-demo TypeScript error (`components/dev/motion-demo.tsx`).
- [x] Add localized kitchen sink (`app/[locale]/dev/design/page.tsx`).
- [x] Connect existing theme, language and reduced-motion controls.
- [x] Block design route in production with `notFound()`.
- [x] Cache seed content reads (`lib/content/seed-content-blocks.ts`).
- [x] Add browser coverage (`e2e/design.spec.ts`).
- [x] Run lint, typecheck, 89 Vitest tests and production build successfully.
- [x] Verify browser rendering in English/Urdu, theme changes, reduced-motion toggle and no horizontal overflow.

## Phase 2 gates still pending

- [x] Add component state/size matrix: all six button variants with text sizes, disabled/loading states and icon sizes; disabled form controls; checked/unchecked/indeterminate checkboxes; both status-chip sizes; price sizes; expired PTA checks. Verify select/menu/model-search/wizard/favourite interactions.
- [x] Keyboard navigation, dialog focus and programmatic accessible-name review (12 Playwright cases across en/ur and mobile/desktop). Assistive-technology listening review remains manual.
- [x] Lighthouse accessibility >= 95: 100 in English/Urdu, light/dark; fixed missing slider/progressbar names.
- [ ] Visual review on real budget Android and iPhone; Urdu typography/content reviewer.
- [x] Assistant Urdu copy review and touch-browser review in Android-style Chromium; iPhone WebKit coverage added. Physical devices and independent human sign-off are distinct and remain pending. See `PHASE_2_MOBILE_URDU_REVIEW.md`.
- [x] Verify all eight touch-browser cases across Android-style Chromium and iPhone WebKit (en/ur, light/dark); repair reduced-motion hydration and favourite first-tap readiness. WebKit Urdu/light required the screenshot suite's 60-second budget and passed on rerun. Lint/typecheck/89 unit tests/build pass.
- [x] Verify production HTTP 404 for `/en/dev/design` and `/ur/dev/design`.
- [ ] Review and commit the complete existing Phase 2 diff when ready.

User decision: physical-device and independent human Urdu review are deferred, remaining unchecked. They do not block subsequent implementation. Current request is to show the existing design preview; Phase 3 frontend is the next implementation phase. Do not claim deferred checks were performed in a browser emulator.

## Component-state continuation

- Added `components/dev/component-states.tsx` and rendered it on the design page, with en/ur copy in `DevDesign.states`.
- Expanded `e2e/design.spec.ts` to cover city selection, keyboard checkbox/slider input, tabs, menus, model search results/empty state, wizard progression, favourites, disabled/loading states and expired check fallback.
- Checks: lint, typecheck, 89 unit tests and production build pass. Full browser suite: 20/22 passed on first complete run; two Urdu desktop cases timed out while Lighthouse was also running and both passed when rerun alone (22 cases verified across the runs).
- Urdu preview at 360px inspected via screenshot; no horizontal overflow. This is browser emulation, not physical-device approval.
- Accessibility reports remain under ignored `playwright-report`; see `PHASE_2_ACCESSIBILITY.md`.

## Accessibility continuation

- Fixed slider thumb names and wizard progressbar name.
- Replaced theme selector's custom radio buttons with native radios supporting arrow keys and visible keyboard focus, with 44px targets.
- Fixed command dialog's missing command context (opening it previously crashed), moved its title/description inside the portal, and registered its trigger so closing restores focus.
- Enabled drawer autofocus and added an accessible close action to the preview.
- Added a pause/resume control to the animated preview; automatic band cycling stops under reduced motion; applied the capped stagger delay inside the animation variant.
- Files: `components/ui/{slider,command,drawer}.tsx`, `components/daam/wizard-stepper.tsx`, `components/dev/{design-preview-shell,motion-demo,overlays-demo}.tsx`, `messages/{en,ur}.json`, `e2e/design.spec.ts`.
- Validation: 89 unit tests, 12 browser cases, lint and typecheck passed. Lighthouse 13.6.0 reports saved under ignored `playwright-report/lighthouse-*.json`; summary in `docs/PHASE_2_ACCESSIBILITY.md`.

## Later phases (not implemented here)

- [ ] Phase 3: mock frontend pages, sell wizard, dashboard shells.
- [ ] Phase 4: migrations, RLS/storage policies and tests, generated types and catalog queries.
- [ ] Phases 5â€“9: authentication, listings, search/pricing, messaging, admin.
- [ ] Phases 10â€“11: security/reliability verification and approved deployment.

