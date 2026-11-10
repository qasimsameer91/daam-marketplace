# Daam remaining work

Current scope: Phase 3 readiness/performance. Updated November 10, 2026. Phase 2 records below are historical.

## Current Claude handoff

- [x] Verify commits: Phase 2 `29a1b30`, Phase 3A `0ba7224`, Phase 3B `dc197ab`.
- [x] Preserve Claude's uncommitted six-step sell wizard, catalog loader, domain helpers, schemas and tests.
- [x] Fix interrupted browser check's ambiguous photo-cover locator.
- [x] Verify local wizard end-to-end on mobile/desktop, including errors, photos, price and preview completion.
- [x] Make completion explicitly preview-only: no real publication/moderation claim or link to a nonexistent dashboard.
- [x] Fix production prerender failure around client `new Date()` with Suspense and a localized loading skeleton.
- [x] Recover only known, well-typed stored draft values; exclude IMEIs/photos/unknown fields on restore and save.
- [x] Lint, typecheck, 142 unit tests, 12 sell browser tests and production build pass.
- [x] Complete Phase 3C dashboard/account/verification/shop shells, messaging/notifications and OTP UI in English/Urdu. All are explicitly mock frontend routes.
- [ ] Complete Phase 3 checks before starting Phase 4 backend work.

Files changed in this continuation: `hooks/use-sell-draft.ts`, `lib/validation/listing.ts`, `lib/validation/draft.test.ts`, `components/sell/sell-success.tsx`, `app/[locale]/(app)/sell/page.tsx`, `e2e/sell.spec.ts`, en/ur messages and these handoff docs.

Readiness review and fixes are recorded in `PHASE_3_READINESS.md`. Public-page performance budgets remain open. Next task: reduce shared JavaScript/translation payload and Urdu font delay, verify performance budgets, then Phase 4 database/backend. Backend authentication, persistence and publishing are not live. Physical-device and independent human Urdu reviews remain deferred by the user.

Latest checks: production build/lint/typecheck pass; 142 unit tests and 73 production browser cases pass (one mobile skip for a desktop-only gallery test). Lighthouse performance: en home/browse 85/84; ur home/browse 76/76. Accessibility: 100 on all four. LCP remains above 2.5 seconds. No performance gate has been waived.

## Account-shell continuation

- Added dashboard overview, listing tabs/actions, favourites, profile/settings, verification and shop shells; notifications and phone/OTP demo; message list and thread pages with local message/offer/block interactions.
- Preview state is held only in the app route group's React provider. It is neither authentication nor a backend session; no credentials, documents, messages or profile changes are uploaded or persisted by these screens.
- Real account deletion/session revocation and identity-document uploads are visibly unavailable. Verification demo does not claim submission or award a badge. App preview routes are marked noindex.
- Chat safety copy uses seed `content_blocks`, not hard-coded production claims. Message/offer output is plain text. The advance-payment warning is a preview heuristic, not a security guarantee.
- Added local readiness guards for text inputs and Suspense for thread route parameters; fixed nested-route mobile navigation highlighting.
- Validation: 16 account browser cases pass across en/ur at 360/1440px, checking routes, overflow, state changes, phone/OTP validation, messages/offers and absence of POST requests during demo login/chat. Lint, typecheck, 142 unit tests and production build pass. Existing sell/design regression checks are also run for the shared layout/card changes.
- Main additions: `components/account/*`, `lib/mock/account.ts`, app dashboard/login/messages/notifications routes and `e2e/account.spec.ts`. Reused existing UI/domain components; no dependency installed or database/deployment changed.

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

- [x] Phase 3: mock frontend pages, sell wizard, dashboard shells implemented.
- [ ] Phase 3 exit: mobile performance budgets; see `PHASE_3_READINESS.md`.
- [ ] Phase 4: migrations, RLS/storage policies and tests, generated types and catalog queries.
- [ ] Phases 5â€“9: authentication, listings, search/pricing, messaging, admin.
- [ ] Phases 10â€“11: security/reliability verification and approved deployment.

