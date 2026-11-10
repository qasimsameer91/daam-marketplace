# Phase 2 accessibility review

Date: November 10, 2026. Tested the development-only design preview, without changing its production block.

## Results

| Locale | Theme | Lighthouse accessibility |
| --- | --- | --- |
| English | Light | 100 |
| English | Dark | 100 |
| Urdu | Light | 100 |
| Urdu | Dark | 100 |

Lighthouse 13.6.0, bundled Playwright Chromium, default mobile emulation. Dark runs used Chromium's `--force-dark-mode`. Scores concern the base page; they do not certify all opened overlays or full WCAG compliance. No permanent dependency was added.

Initial English score was 93. Lighthouse found unnamed slider and progressbar elements; their localized names now reach the actual interactive elements.

12 Playwright cases pass across mobile and desktop: English/Urdu rendering, direction, theme switching, overflow at 360/1440px, CPID featured suppression, native-radio arrow navigation (mirrored for RTL), accessible slider/progress names, named dialogs, Tab focus containment, Escape dismissal, focus restoration, and OS reduced-motion handling.

Interaction checks found and fixed two failures the base-page score did not reveal: the drawer did not autofocus, and the model-search dialog crashed because its command input had no command context. The command dialog also needed its title inside the portal and a registered trigger for focus restoration. The preview's automatic meter now has a pause control and stops cycling under reduced motion.

## Reproduce

Start `pnpm dev`. Run `pnpm exec playwright test e2e/design.spec.ts --workers=1`.

PowerShell Lighthouse invocation (create `playwright-report` first):

```powershell
$env:CHROME_PATH = node -p "require('@playwright/test').chromium.executablePath()"
pnpm dlx lighthouse http://localhost:3000/en/dev/design --only-categories=accessibility --chrome-flags='--headless --no-sandbox' --output=json --output-path=./playwright-report/lighthouse-en-light.json --quiet
```

Repeat for `/ur/dev/design`. Add `--force-dark-mode` inside `--chrome-flags` for dark runs and use distinct report filenames. Raw reports live in the ignored `playwright-report` directory.

## Remaining manual checks

- Real Android/iPhone visual and touch review, including Urdu line wrapping.
- Human Urdu copy review and screen-reader listening test.
- Physical-device confirmation of the component state/size matrix. The matrix and automated select/menu/search/wizard/favourite checks are now implemented.

## Component-state follow-up

`ComponentStates` now displays all button variants and sizes, disabled/loading buttons, disabled form controls, mixed/unchecked checkboxes, small/medium domain chips, price tag sizes and an expired PTA check. Interactions are covered by 16 design cases plus 6 existing smoke cases across mobile/desktop and en/ur. In the complete run, 20 passed and two timed out during concurrent Lighthouse runs; both timed-out cases passed separately without code changes.

The expanded Urdu preview was visually inspected in Chromium at 360px, including its button layout; no horizontal document overflow was detected. Real-device and human language approval remain outstanding.

Do not mark the entire Phase 2 complete based only on these automated results.
