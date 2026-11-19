# daam. redesign audit — 2026-11-11

## Scope and references
Existing Next.js 16.4.5 app, not a new repository. Read START_HERE, all DESIGN and PROMPTS documents, QA checklist and HTML/CSS motion/page prototypes from the supplied ZIP, extracted safely into `design-references/daam`. Inspected seven reference screens, eight artwork assets and four before screens. The new user-approved brief replaces the old lime/dark art direction in CLAUDE.md. Preserve domain rules, translations, backend and security.

## Observed system
- Shared header/footer and semantic CSS tokens cover public and account routes. Existing OS-based dark defaults and saved dark preference explain the cream-to-black mismatch. Adopt a light-first product without the header theme switch; keep explicit dark preview in the development gallery only.
- Fonts: existing Geist Sans/Mono and Noto Nastaliq Urdu. Keep these loaded fonts; add a restrained system serif accent only to short English editorial headings.
- Homepage: oversized photographic hero, duplicate search, sparse category tiles, dense badges and identical phone SVGs. Recompose every section around the supplied pearl artwork, one primary search, meaningful brand identities, compact accurate metadata and editorial seller CTA.
- Browse: nuqs URL filters, accessible mobile drawer, result sorting, aliases and empty state already work. Preserve them; improve hierarchy, sidebar grouping and three-column desktop cards.
- Detail: existing lightbox, swipe, specs, CPID warnings, seller panels and sticky contact controls work as local preview. Reuse and restyle. No actual seller contact currently occurs.
- Sell: six-step validated form, image compression, reorder/preview, draft restoration and local completion already exist. No server publish action exists. Keep explicit preview messaging and do not label a local completion as a database publish.
- Account/login/favorites/messages: preview provider and browser storage, not real Auth/Realtime. Do not conflate this with authentication or persisted seller data.
- Backend: migrations, RLS, catalog reads, public listing read helper and campaign server actions are present. Current listing UI imports mock fixtures, not live rows. Real Supabase Auth/Storage stack is not configured/running; existing isolated PostgreSQL containers are not equivalent. No reset of user databases is authorized by this audit.
- Promotions: prior campaign table has server admin checks, RLS/audit, scheduled public selection, draft/published and enabled states. Missing media upload, Karachi timezone editor, archive and useful list/preview. Extend safely with an additive migration and validated upload flow; verify what can run locally and document full-stack blocker.

## Implementation order / files
1. Checkpoint current source, capture before screens; write this audit and progress log.
2. `app/globals.css`, design tokens, theme bootstrap, shared UI primitives, header/footer: warm light system everywhere.
3. Homepage, shared hero/art/reveal/search/category/card components and supplied optimized assets.
4. Browse/detail, sell wizard, login, dashboard, messages, editorial pages: coherent layouts, preserve validated interactions.
5. Campaign validation/actions/schema/editor/public slots: timezone, archive, media and previews.
6. Responsive/browser/security regression and production checks; screenshots and refinement report.

## Verification plan
Screenshots of home, browse, detail, sell, login, favorites, messages, dashboard, informational pages and admin guard at 1440/390; responsive checks 320/375/768/1024, English/Urdu and reduced motion. Execute lint/types/unit/build and existing browser journeys. Add meaningful schedule/upload authorization tests and SQL policy coverage. Production services, physical devices and human Urdu review must be reported separately from emulation.
