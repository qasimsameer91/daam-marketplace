# Mobile and Urdu review

Reviewed November 10, 2026. This is an AI copy review and browser-engine review; no physical phone or independent human reviewer was available.

## Changes

- Improved Urdu condition, identity-verification, negotiable/fixed-price, description-example and drawer labels. Translation keys and ICU placeholders preserved.
- Fixed a reduced-motion hydration mismatch: OS preferences are applied after the initial client render matches SSR.
- Disabled favourite buttons until hydrated; WebKit exposed a first-tap event being lost before client readiness.
- Added `playwright.mobile-review.config.ts` and `e2e/mobile-review.spec.ts` for touch checks and screenshots, isolated from the default desktop suite.

## Browser checks

Android-style Chromium at 360px and iPhone 13 emulation using WebKit 27.2 cover English/Urdu and light/dark. Checks include RTL direction, Urdu font family, no horizontal overflow, 44px favourite targets, first-tap toggling, named dialogs, overlays fitting the viewport, close controls and uncaught page errors. Screenshots wait for opacity transitions and disable CSS animations before capture.

Run:

```powershell
pnpm exec playwright install webkit
pnpm exec playwright test --config=playwright.mobile-review.config.ts
```

Screenshots are stored under the ignored `test-results/mobile-review-*` folders. Android Urdu listing and dialog screenshots were visually inspected; copy fits and dialog actions remain visible. The normal Playwright suite retains its original projects.

Results: all four Android cases passed, and all four iPhone/WebKit cases passed across the runs. The Urdu/light WebKit case exceeded the original 30-second whole-test budget while capturing screenshots; it passed in 30.2 seconds after the dedicated visual-review configuration was given 60 seconds. Lint, typecheck, 89 unit tests and production build passed. This does not imply physical-device or human approval.

## Limits and required sign-off

- iPhone emulation uses WebKit on Windows, not Safari running on iOS hardware. Android emulation does not measure a budget phone's rendering performance or touch behavior on hardware.
- Urdu copy was reviewed by the assistant. Safety/PTA seed copy remains `ur_draft`; no legal claims or review-status fields were changed.
- WebKit development runs can emit React/Radix hidden-input style-normalization hydration warnings (`margin` shorthand vs longhand); these differ from the repaired reduced-motion text mismatch. Track them during final browser/production QA; passing page-error checks does not certify a warning-free console.
- A physical Android/iPhone check and independent Urdu review remain unverified. The assistant cannot supply those sign-offs.

On actual phones, open the dev preview in both languages/themes; check scrolling, Nastaliq letter clipping, tap/close controls, zoom, portrait/landscape and the software keyboard. Have an Urdu reader review buyer-facing copy and safety instructions, recording device/browser, date and findings.
