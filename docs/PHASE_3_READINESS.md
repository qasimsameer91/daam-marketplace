# Phase 3 readiness review

Reviewed November 10, 2026. The mock frontend is implemented. The mobile performance exit gate remains open; Phase 4 has not started.

## Changes

- Contact, listing-report and stolen-phone forms explicitly describe local previews in English and Urdu. Completion does not claim messages or reports were submitted.
- Browse renders URL-dependent results on the server under Suspense, instead of waiting for client JavaScript. This trades a static result grid for request-time rendering. Browser tests verify filtered results with JavaScript disabled.
- First-row browse images load eagerly with high priority and cards no longer start invisible. Subsequent images remain lazy. Card headings follow the page hierarchy and the logo's accessible name includes its visible brand.
- Sell/account navigation, mobile navigation, popular searches and listing-card links do not prefetch automatically. Clicking them can therefore require a network request.
- Shared motion uses `m` and `LazyMotion`; browse keeps layout features locally. The hero no longer rotates on initial load. Reduced-motion behavior is preserved.
- The tracked theme script is cached on the server and inlined into the head, removing a blocking network request. Only repository-controlled content enters that script.
- Account/sell translations are supplied in the app layout, rather than serialized on public pages. This removes the login sample phone number from public listing HTML without weakening the privacy assertion.

## Validation

Production build, lint, typecheck and 142 unit tests pass. The final production browser run passed 73 cases; one desktop-only gallery case was intentionally skipped on mobile. Coverage includes en/ur routes, URL filtering, JavaScript-disabled browse results, local-only contact/report previews, masked IMEI/public phone-number exclusion, account/login/chat demos, sell completion/draft recovery and saved-theme restoration. Production `/en/dev/design` and `/ur/dev/design` return HTTP 404.

Lighthouse 13.6.0 uses its default mobile simulation against `next start --port 3001`, with Playwright Chromium. Audits run sequentially, separately from the browser suite. These local lab measurements do not establish physical-device or field performance.

Raw reports are ignored local artifacts under `playwright-report/phase-3/{en-home,en-browse,ur-home,ur-browse}.json`. Reproduce after building and starting production:

| Route | Performance | Accessibility | LCP | CLS | Script transfer |
| --- | ---: | ---: | ---: | ---: | ---: |
| `/en` | 85 | 100 | 3.90 s | 0 | 304 KiB |
| `/en/phones` | 84 | 100 | 4.08 s | 0 | 340 KiB |
| `/ur` | 76 | 100 | 5.25 s | 0.00034 | 304 KiB |
| `/ur/phones` | 76 | 100 | 5.56 s | 0.00034 | 340 KiB |

English home meets the score threshold in this run; the other three routes do not. All four pass accessibility >=95 and CLS <0.05. All four fail LCP <2.5 s. The observed script totals also exceed 200 KiB and require bundle analysis. Earlier English measurements were home 82 / accessibility 100 and browse 60 / accessibility 98; changing CPU load means this is not a controlled benchmark. The first browse image is now discoverable in the initial document according to Lighthouse.

```powershell
$env:CHROME_PATH = node -p "require('@playwright/test').chromium.executablePath()"
pnpm dlx lighthouse http://localhost:3001/en '--only-categories=performance,accessibility' --chrome-flags='--headless --no-sandbox' --output=json --output-path=./playwright-report/phase-3/en-home.json --quiet
```

Repeat with the other three routes and distinct output paths. Script transfer totals above include every Lighthouse-observed script request and transfer overhead; they are not an exact isolated route gzip bundle measurement.

## Remaining exit work

- Achieve performance >=85 on both locales' home/browse pages, LCP <2.5 s and route JavaScript <200 KiB gzip. Do not mark these passed based only on functional tests.
- Reduce shared JavaScript and client translation payloads further. The root error chunk still includes both full catalogs; individual property selection alone did not remove them from its generated chunk.
- Improve Urdu font delivery while retaining Nastaliq, character coverage and stable layout. Urdu loads roughly 234 KiB of Nastaliq font data plus another 20 KiB resource; English does not request those fonts.
- Physical-device, assistive-technology listening and independent human Urdu reviews remain deferred by the user. Browser emulation does not satisfy them.

No backend service, authentication, storage upload, database change or deployment was performed.
