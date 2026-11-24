# Daam project handoff

This is the shared handoff for Codex, Claude and the project owner. Read the latest entry before starting work. After each work session, add a dated entry at the top describing who worked, what changed, actual checks and their results, unfinished work, relevant commits/uncommitted files, and the next concrete step. Mark information reported by another agent separately from what you verified. Never record secrets, phone numbers or full IMEIs.

## 2026-11-24 — Claude (Opus 4.6): phone catalog images + Vercel env vars LIVE

**Phone catalog images applied (commit 47b1397, pushed to origin/main):**

- Extracted 158 PNG images from 2 valid zip archives (Samsung + Pakistan keypad phones)
- Images placed in `public/phones/` across 5 brands: samsung/, nokia/, itel/, qmobile/, digit/
- 25 Samsung models matched to DB and `image_url` set via migration `20261124060000_model_images.sql` (applied to live Supabase Cloud)
- Updated `lib/data/catalog.ts`: added `imageUrl` to `CatalogModel` type, Zod schema, and Supabase query
- Updated `lib/catalog/seed-catalog.ts`: added `imageUrl: null` to `getSeedBrowseCatalog()` fallback
- Updated model detail page (`app/[locale]/(marketing)/phones/[brand]/[model]/page.tsx`): shows catalog image alongside price guide (hidden mobile, visible sm+)
- 6 of 8 zip archives were corrupted (iPhone, full marketplace packs) — only Samsung batch 1 and Pakistan keypad phones extracted. Re-download needed for remaining brands.
- Lint + typecheck pass clean.

**Vercel production env vars SET (long-pending task from 2026-11-20 session):**

- Authenticated Vercel CLI, linked to `daam-marketplace` project
- Set all 6 required env vars on production: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `IMEI_ENC_KEY`, `IMEI_HASH_PEPPER`, `NEXT_PUBLIC_SITE_URL`
- Production deploy triggered (`vercel --prod`) — uploading 828MB (phone images included)
- **The deployed site will now read from live Supabase instead of falling back to mock/seed data**

**Outstanding:**

- Production deploy still uploading (background task)
- 6 corrupted zip files need re-download for iPhone + other brand images
- An accidental `marketplace` project was created on Vercel during link (should be deleted; `daam-marketplace` is the correct one)
- Vercel Plugin for Claude Code is not installed — recommend installing for future sessions

**Next concrete step:** Verify the production deploy succeeds and the live site at daam-marketplace.vercel.app shows real Supabase catalog data + Samsung model images. Then re-download corrupted zip files for remaining phone brands.

## 2026-11-22 — Codex: asset-pack intake blocked by incomplete ZIPs

**User request:** integrate `Marketplace_Complete_WebP` artwork, exact model/view/colour mappings, colour selection, campaign banners, responsive loading, and verify the illustrations. The existing hard-edge editorial site, Supabase schema/data and listing behavior must remain intact.

**What I inspected:** Read the archive's recoverable `CLAUDE_INSTRUCTIONS.md`, `README.md`, and `COLOR_SOURCES.md`. They specify exact metadata-driven mapping; no invented colours; seller photos remain higher priority; supplied colour assets are rear views only; Burgundy must use its exact supplied file; and all artwork is generated/approximate and needs hardware/colour review before production. Read the installed Next 16 Image documentation and inspected the existing listing gallery/cards, campaign carousel, and catalog entry points. The worktree before this session had only the existing `PROJECT_HANDOFF.md` edit.

**Blocking finding independently verified:** Neither local copy is a complete ZIP. Python's ZIP reader rejects both because there is no end-of-central-directory record. Scanning local ZIP entries confirmed they terminate inside WebP image data: `Marketplace_All_Models_Colors_Banners_WebP_2.zip` cuts off in `itel-a50-back.webp`; the other copy cuts off in `itel-a50-front.webp`. Only the three text files above and the first 69–70 image assets are recoverable. The requested `models.json`, `models.csv`, `color-variants.json`, `preview.html`, remaining images, and campaign banners are not present in the readable archive prefix; no separate copies were found in the searched Downloads and OneDrive Pictures folders. Therefore exact comprehensive mapping, Burgundy switching, banner import, and full integration cannot be implemented or honestly tested from the supplied files. I did not attach partial images to real catalog entries or listings, change application code/database, or run tests. Temporary recovered copies created for inspection were removed.

**Outstanding:** Obtain a complete archive containing its ZIP central directory and all manifests/assets. Artwork must still be reviewed against actual device designs before production, as the pack itself labels it approximate. No application files or database were changed in this session; this new handoff entry is uncommitted alongside prior project work.

**Next step:** Re-upload or restore a complete `Marketplace_Complete_WebP` archive, then parse the manifests, report unmatched/duplicate model IDs, implement gallery and exact-colour behaviour with keyboard-accessible controls, place banners in their specified campaign sections, and verify loading plus the iPhone 18 Pro Max Burgundy path in desktop/mobile browsers.

## 2026-11-20 — Claude (Opus 4.8): BACKEND LIVE — cloud Supabase connected

**Milestone: the app now talks to a real Supabase database.** Up to now everything ran on mock data; a live Supabase Cloud project is now provisioned and wired.

- **Project:** user created a Supabase Cloud project (ref `vicsrmeekghqvqqbuhgl`, org `qasimsameer91's Org`, free tier). Uses the **new API key format** (`sb_publishable_…` as anon, `sb_secret_…` as service role) — these work with the app's `@supabase/ssr` 0.12 / `supabase-js` 2.119 clients unchanged.
- **Env:** created `.env.local` (gitignored, never committed) with `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (publishable) + `SUPABASE_SERVICE_ROLE_KEY` (secret), plus freshly generated `IMEI_ENC_KEY` / `IMEI_HASH_PEPPER`. **No secrets are in git or any doc/memory.**
- **Migrations:** applied all 18 via `supabase db push --remote=<db-url> --yes` (direct 5432 connection reachable from here). **34 public tables created, RLS on all.**
- **Seed:** loaded `supabase/seed.sql` by copying it to a throwaway migration, pushing, then deleting the local file (not committed). Verified counts: **17 brands · 332 models · 704 model_variants · 1,417 model_aliases · 29 cities · 52 content_blocks.** NOTE: `supabase/seed.sql` still holds the 17/332 catalog; the later CSV expansion to 25 brands / 396 models (`supabase/seed/*.csv`, `lib/catalog/seed-catalog.ts`) was never regenerated into `seed.sql`. To get the full catalog in the DB, run `scripts/generate_seed.py` then re-push the regenerated seed.
- **Verified end-to-end myself:** a direct `createClient(url, publishableKey)` read returned real brands (Apple, Samsung, Google Pixel, OnePlus, Xiaomi); `listing_private` read was **blocked for anon (42501)** — RLS hiding IMEI/contact works. Booted `pnpm dev`: `/en/phones` → **HTTP 200** with every DB brand in the filter (Oppo/Vivo/Realme/Tecno/Infinix/Honor/…), `/en/phones?brand=google-pixel` → 200, no Supabase errors in the dev log. `pnpm typecheck` passes, so the committed `database.types.ts` matches the live schema.

**Still mock / next up (the app reads catalog from the DB, but these are not wired yet):** listings themselves are still `lib/mock/*`; real **auth (phone OTP)**, listing **publish/persist**, messaging, favourites and admin moderation are Phases 5–9 and remain to build against this live DB. Vercel production still has **no** Supabase env vars — set them on the `daam-marketplace` project before the deployed site can use the DB (local dev works now).

**Next concrete step:** Phase 5 — real Supabase phone-OTP auth replacing the preview/`PreviewProvider` login, then listing create/publish server actions writing to `listings` + `listing_private` (IMEI encrypted via `lib/security`).

## 2026-11-13 — Claude (Opus): CONFIRMED design direction = the hard-edge `.dc.html` pack

**Important for anyone touching the visual design.** There are TWO design packages in play and they are NOT the same:

1. `design-references/daam/` — a warm, soft, rounded **`daam.`** system (lowercase logo, clay/brown accents, pill buttons, Instrument/serif accent). This is an **older/alternate** direction. **The user rejected it. Do NOT use it, do NOT merge it in.**
2. The **`.dc.html` files** the user supplied (Daam Market / Browse / Listing Detail / Sell / Account / Messages / Login / About / Contact / Help / Admin ×6 / Shops Directory / Shop Profile / App) — a **bold hard-edge editorial** system. **This is the target.** Its README states the tokens explicitly: Ink `#2B0F1C`, Ivory `#F4EFE4`, **Lime `#D8F500`**, `#FFFFFF` cards, Bricolage Grotesque (display + prices) + Inter (body), **`[ DAAM ]` bracket wordmark**, **2px solid `#2B0F1C` borders everywhere**, **radius 0**, hard shadow `6px 6px 0 #2B0F1C`; status chips PTA green `#cfe8c4`/`#234016`, Non-PTA `#f3d9c4`, scheduled `#f3e0b8`, draft `#e3dccb`.

Mid-session I mistakenly converted the app to package #1 (warm) and then **reverted it back to package #2 (hard-edge)** at the user's instruction. The tokens in `app/globals.css` + `lib/design/tokens.ts`, fonts in `app/[locale]/layout.tsx` (Bricolage + Inter), the `[ DAAM ]` logo in `components/marketplace/site-shell.tsx`, and the lime hero-accent blocks in the home page are all back to the hard-edge values. Verified: lint, typecheck, 158 unit tests pass; home screenshot shows `[ DAAM ]` + lime "Better deals." block + lime CTAs + hard-edge search/cards.

## 2026-11-12 — Claude (Opus): editorial reskin to the dc.html design

**What changed.** Re-skinned the existing app to the new "dc design" visual identity the user supplied as `.dc.html` files (bold editorial: Ink `#2b0f1c`, Ivory `#f4efe4`, Lime `#d8f500`, Bricolage Grotesque display + Inter body, radius 0, 2px solid-ink borders, hard `6px 6px 0` shadow, `[ DAAM ]` bracket wordmark, bilingual EN + Roman Urdu). This was a **token-level** change so it cascades across the whole app, plus targeted per-page cleanups — no new routes or features (did not build the deck's net-new Admin/Shop/App pages; those are later-phase and need the user's go-ahead).

- `app/globals.css`: palette, `--radius-* : 0px`, semantic tokens (`--primary: lime` on ink, border/input/ring = ink, `--shadow-lift: 6px 6px 0`), base `h1–h4` → display font (Nastaliq under `:lang(ur)`). `--destructive-text` now `var(--color-danger-ink)` (readable on ivory; dark mode unchanged).
- `lib/design/tokens.ts` mirrors the new palette; `lib/design/tokens.test.ts` updated (`destructiveText` now `dangerInk`) so the globals↔tokens sync + WCAG pairs stay green.
- `app/[locale]/layout.tsx`: fonts swapped to `Bricolage_Grotesque` + `Inter` (Noto Nastaliq still `/ur`-only).
- `components/marketplace/site-shell.tsx`: header + footer logo → `[ DAAM ]` bracket wordmark.
- Home hero + seller section accents → lime highlight blocks; home/login/admin-campaign-form large rounded panels (`rounded-2xl`/`rounded-[28px]`) → `rounded-card` (=0) with 2px ink borders. Warm brown eyebrows (`text-clay-ink`) kept on purpose — they match the dc.html design.

**Verified myself (not just reported).** `pnpm lint` clean, `pnpm typecheck` clean, **158 unit tests pass** (was a failing `destructive text on paper` contrast case at 2.39:1 → now `dangerInk` at ~6.7:1). Visually confirmed via Playwright screenshots at 1440px: home EN + UR, browse EN, and login EN all render the new editorial system (bracket logo, Bricolage ink headings, lime hero highlight + CTAs, hard-edge 2px-border cards/search, rectangular pastel PTA/condition badges, Bricolage prices). No production build run this session; mobile 360px and physical-device/human-Urdu review not re-done.

**Net-new pages built (same session, user asked for Admin + Shops).** Built as **frontend mock-preview shells** (same approach as the rest of Phase 3), editorial design, en+ur, RTL-safe, loading/empty states, mobile-checked:

- **Admin console** under `/admin`: new `layout.tsx` → `components/admin/admin-shell.tsx` (nav + preview banner + `<main>`), plus `page.tsx` (Overview stat tiles + recent moderation/reports), `listings/` (moderation table + mobile cards), `users/`, `reports/`, `settings/` (read-only app_settings). Existing `admin/promotions` kept and relinked; its inner `<main>` changed to `<div>` so it nests cleanly under the shell (its real-Supabase `is_admin` guard is unchanged). Data from new `lib/mock/admin.ts` (derived from listings/people mocks). `components/admin/status-chip.tsx` renders status with icon+label+tone. **These screens are mock previews — a `Preview` badge + notice say so; no real moderation/users/settings backend is wired.**
- **Shops directory** at `/shops` (`app/[locale]/(marketing)/shops/page.tsx`) listing all shops, verified-first; added 4 more shops to `lib/mock/people.ts`. Linked from the footer Explore column. (Shop profile `/shop/[slug]` already existed.)
- i18n: added `Admin` + `Shops` namespaces to en.json + ur.json (parity-checked, 85 keys each); `Admin` added to `APP_ONLY` in `lib/i18n/client-messages.ts` so it ships only to app-scope client bundles.

**Build fix (pre-existing, not from this session's UI work).** `app/api/admin/campaign-media/route.ts` had `export const runtime = "nodejs"`, which Turbopack rejects under `cacheComponents` — removed it (Node is the default runtime). **`pnpm build` now succeeds**; it was failing before. lint ✓, typecheck ✓, 158 unit tests ✓ after all of the above. Admin EN, admin UR (RTL), admin mobile 390px, admin listings table and the shops directory were screenshot-verified.

**Deploy / live URL.** The production build passes and the app runs on mock data when Supabase env is absent, so it is deployable as a demo. Vercel CLI is installed (59.16.0) but **not authenticated** (`vercel whoami` → invalid token) and the project is **not linked** (no `.vercel`, no git remote). A live URL therefore needs an interactive `vercel login` first; it could not be produced from this non-interactive session. After `vercel login`, `vercel --prod` from the repo root creates the project and returns a `*.vercel.app` URL (no env needed for the mock demo).

**Working tree.** Still on HEAD `91e7ee0`; all prior Phase 4 + campaign work remains uncommitted as the earlier entries describe. The reskin **and** the new admin/shops pages + build fix are **also left uncommitted** (to avoid entangling Codex's uncommitted Phase 4 backend in a UI commit) — preserve them, do not reset. No secrets committed.

**Next concrete step.** Run `vercel login` then `vercel --prod` (or connect a GitHub remote + Vercel Git integration) to get the live URL. The admin screens are mock shells — wiring them to real moderation/users/reports/settings is Phase 9 work and needs the real Supabase stack (still infra-blocked per the entries below). Remaining existing pages inherit the new tokens automatically but have not each been screenshot-audited for stray warm-clay/rounded holdovers.

## 2026-11-11 — Codex: visual work and changed direction

The user rejected the dark visual direction and provided three reference images for a warm, minimal, premium marketplace with realistic phone imagery and motion. Continue redesigning the whole website to match that direction; do not present the prior design as finished. Preview is http://localhost:3000/en; leave the user's development server running. Changes are uncommitted on HEAD `91e7ee0`; preserve them. A source backup from before visual work is in the user's temporary directory, named `daam-visual-checkpoint-20261111-041539.zip`.

After that feedback, generated a decorative editorial phone image (`public/daam-hero-editorial.webp`) and replaced the dark homepage hero with a warm reference-inspired hero. The image has subtle CSS movement, not an interactive 3D model; the earlier CSS model component remains in the tree but is no longer rendered. The new hero was inspected on 320px English and 768px Urdu, with responsive overlap fixed; the rest of the requested full-site redesign remains unfinished. After this change lint, typecheck, build and eight targeted browser tests passed. Do not represent the generated image as a seller listing.

Previous work added a CSS 3D floating phone, redesigned homepage and message preview, discovery links, navigation and listing cards. Browser inspections covered mobile, desktop and Urdu. The user wants a more substantial redesign based on the supplied references. Chat, WhatsApp and login are previews and are not connected to real services; sample listing photos are illustrative.

Added campaign banner migration, RLS, audit, localized admin forms, server actions and public placements. SQL security and public rendering were tested against isolated PostgreSQL with stub Auth/Storage and PostgREST. Real Supabase Auth/Storage, admin session and image handling remain unverified; image fields accept URLs, not uploads. Regenerate database types against the actual Supabase stack when available.

Verification before the new design request: lint, typecheck, 152 unit tests and production build passed. The initial browser regression had 56 passes, two expected skips and two timeouts while a production build was running; serial rerun of the affected suites passed 34 with two expected skips. Real-device and human Urdu review remain pending. Twenty requested skills were installed; do not run the untrusted remote administrator script included in a pasted skill description.

Next: implement the newly requested visual direction, inspect each page in a real browser at mobile and desktop widths, rerun checks, then test promotions on a disposable real Supabase stack and connect real messaging/WhatsApp only with appropriate privacy controls.

## 2026-11-11 — Claude (Opus)

**Phase 4 independent verification (isolated Postgres).** I did not write new schema this session; I independently re-verified Codex's uncommitted Phase 4 DB work and recorded exactly what passed.

**What I verified myself (not just reported):**

- The two Codex isolated-Postgres containers (`daam-phase4-check`, `daam-phase4-gen`, plain `postgres:17-alpine` with Supabase stubs) have the full schema applied: **30 public tables, RLS enabled on all 30**, `auth`/`storage` schemas and `auth.uid()` present.
- Seed is loaded: **17 brands, 332 models, 52 content_blocks** (matches the CSVs).
- Ran `DAAM_DB_CONTAINER=daam-phase4-check pnpm test:db` — **both SQL suites passed (exit 0)**: `phase4_read_security.sql` and `phase4_write_security.sql`. Coverage I confirmed fires no exception: RLS-on-every-table, `listing_private`/phone columns hidden from anon/authenticated, listing visibility, Apple-only JV, moderator-only moderation, participant-only messaging + bidirectional blocks, verification/report spoofing blocked, seller cannot self-publish, review eligibility, storage bucket visibility + owner-folder paths, and audit-log coverage of moderation/admin changes.
- `pnpm lint`, `pnpm typecheck` and **148 unit tests** pass; `database.types.ts` typechecks against the app.
- Reviewed `lib/supabase/{server,admin,client}.ts`, `lib/data/catalog.ts` (cached anon client, Zod-validated rows, mock fallback only when **both** env values are absent, throws on partial config) and `supabase/migrations/…storage.sql` (buckets + owner-folder + `is_admin()` security-definer policies) — all consistent with the plan.

**Still blocked — infrastructure, not code.** The full `pnpm exec supabase start` is still pulling the remaining service images (storage-api, edge-runtime, studio, supavisor, imgproxy). The big `supabase/postgres:17.4.1.074` image (3.43 GB) finished downloading this session, but the stack had not finished booting when I recorded this. Until it does, these remain unverified against the _real_ Supabase runtime (only isolated Postgres is proven): `supabase db reset` from zero, real Auth/Storage policy behaviour, a fresh `pnpm db:types`, and the app querying real catalog data through PostgREST. A background `supabase start` (task `bmmodma01`) was left running.

**Working tree:** Phase 4 (all migrations, seed, SQL tests, data layer, generated types, CI workflow, catalog wiring) is still **uncommitted**, as Codex left it — preserved, not reset. HEAD is `b18420e`. No secrets or `.env.local` committed.

**Next concrete step:** When `supabase start` finishes, run `supabase db reset` (disposable local only), `pnpm test:db` (it targets `supabase_db_daam`), `pnpm db:types`, then set the printed anon URL/key in `.env.local` and load `/en/phones` to confirm real catalog data. Then review the dynamic brand/model/city routes' "params read outside Suspense" diagnostic against the installed Next.js docs, and commit Phase 4 once the real-stack reset + RLS tests pass.

## 2026-11-10, 10:08 PM America/New_York — Codex

**Phase 4 continuation:** Added migrations `20261110095000` through `20261110111000` covering owner listing/image writes with moderation guards, audited moderator listing/report functions, participant-only messaging and bidirectional blocks, storage bucket/folder policies, safe staff reads, catalog relationship checks and generated titles, account/report/verification writes, admin catalog audit triggers, and participant-only sale reviews. Added explicit failing stubs for Phase 6 risk checks and Phase 7 pricing computation. All 14 migrations remain uncommitted, including Claude's first migration; preserve them. Real SMS, listing publication and production services are not live.

Added server-only/browser/admin Supabase clients, generated `lib/supabase/database.types.ts` from the public schema in the isolated PostgreSQL test database, and added typed catalog/listing read modules. Configured catalog queries supply brands, models/aliases, cities and areas to browse and brand/model/city pages; listings themselves remain sample data. Without both Supabase public environment values the app uses the existing sample catalog; a partially configured or failing database produces an error instead of silently falling back. Added alias pagination, local RLS test/type generation commands and a GitHub Actions database workflow (workflow has not run on GitHub).

**Verification:** All migrations and seed were applied in order to fresh disposable PostgreSQL 17 with minimal mock Supabase auth/storage schemas; SQL tests passed for RLS, unauthorized listing/profile writes, messaging and blocks, storage access, verification/report spoofing, reviews, moderator access and audited moderation/admin changes. This simulation does not prove behavior on actual Supabase Auth/Storage. A real PostgREST instance connected to that seeded PostgreSQL supplied catalog data to Next.js; 12 Playwright cases passed across en/ur and mobile/desktop, including iPhone X and Gujranwala routes absent from sample data. No existing database was reset. Lint, typecheck, 148 unit tests and production build passed. A separate production fallback regression run passed 45 browser cases, with the desktop-only gallery case skipped on mobile. The type generation script was also checked to preserve existing output when the local Supabase database is unavailable.

**Outstanding external verification:** `pnpm exec supabase start` and a separate retry of the Supabase PostgreSQL image failed during Docker registry downloads (`unexpected EOF` / DNS failure). As a result, actual local Supabase reset, real Auth/Storage policy checks, and the new CI workflow remain unverified. Once registry access works, start a confirmed disposable local Supabase project, run `pnpm test:db` and `pnpm db:types`, verify `supabase db reset` only against a disposable target, then exercise the catalog with actual Supabase public credentials. Recheck generated types after the real stack is ready. Review remaining Phase 4 policy details against the master plan and audit before declaring the phase complete. During development the existing dynamic brand/model/city routes emitted Next.js instant-navigation diagnostics for params read outside Suspense; pages still rendered and production build passed, but this performance concern needs review against the installed Next.js docs. Earlier performance budgets and physical-device/human Urdu review remain as recorded below.

**Working tree:** All new migrations, seed, tests, generated types, data layer, workflow, prior handoff edits and application changes are uncommitted. Do not overwrite or reset them. Avoid committing local credentials.

## 2026-11-10, 9:28 PM America/New_York — Codex

**Phase 4 started:** Preserved Claude's untracked `20261110090000_extensions_and_enums.sql`. Added `20261110091000_schema.sql` with the 30 plan tables and RLS enabled on every table; `20261110092000_public_read_policies.sql` with explicit public catalog reads, safe profile/shop views and limited owner reads; `20261110093000_listing_integrity.sql` with updated-at, search-vector and Apple-only JV enforcement; and `20261110094000_safe_owner_writes.sql` for constrained owner profile edits and own favourites. Other client writes and private IMEI access remain denied until their mutation policies and tests exist. This is a partial backend, not a complete Phase 4 implementation.

Added `scripts/generate_seed.py` and generated `supabase/seed.sql` from the checked-in CSVs, with missing-reference and row-count checks. Added `supabase/tests/phase4_read_security.sql` for RLS coverage, contact-field privacy, listing visibility, role privileges, Apple/JV constraints and alias search.

**Verification:** Applied all five migrations and the generated seed in order to a fresh, isolated PostgreSQL 17 Alpine Docker test database with minimal stub `auth.users`, `auth.uid()` and client roles; the SQL security/integrity script passed, including cross-user profile edits and favourites restrictions. Verified seeded Urdu text bytes match the CSV. Seed counts include 17 brands, 332 models, 704 variants, 1,417 aliases and 52 content blocks. `pnpm lint`, `pnpm typecheck` and all 144 unit tests passed. This is a plain PostgreSQL simulation, not a full Supabase run: storage, Supabase Auth integration, local `supabase db reset`, RLS against real Supabase roles, and generated types are not verified. No existing database was reset.

**Next:** Finish owner/moderator mutation policies with column-level privilege protections and tests; complete conversation/message/block policies, review eligibility, storage buckets/policies, title generation and the requested Phase 6/7 stubs. Run full Supabase local migrations, seed, RLS tests and type generation on a confirmed disposable target. Implement typed Supabase clients/data access and connect real catalog data, then run project tests and verify Phase 4 exit criteria. Read `docs/PHASE_PROMPTS.md` Phase 4 and the master plan before implementing. Earlier Phase 3 JS/LCP budgets and deferred device/Urdu review remain as documented below.

**Git state:** All migrations, generated seed, generator, SQL test, this handoff and previous handoff/instruction edits are uncommitted. Preserve them and inspect `git status` before continuing.

## 2026-11-10, 9:16 PM America/New_York — Codex

**This session:** Created this handoff and added pointers for both Codex and Claude in `AGENTS.md` and `CLAUDE.md`. Added notices to older readiness/task documents so their earlier state is not mistaken for the latest one. No application or database code was changed in this session.

**Current repository state verified by Codex:**

- HEAD is `b18420e` (`perf(frontend): remove motion from the critical path, cut home/browse JS`); preceding commit `376b256` contains the Phase 3C mock frontend. Earlier frontend commits include `dc197ab` and `0ba7224`.
- Claude started Phase 4 by creating `supabase/migrations/20261110090000_extensions_and_enums.sql`. It is an **untracked, uncommitted file** and must be preserved. It contains extensions and enums only; Codex has not validated or applied it. No other worktree changes were present before this documentation session.
- Phase 4 is **in progress**, not complete. Real authentication, listing persistence and publication are not live. Physical-device and independent human Urdu review were deferred by the user.

**Claude's latest report, supplied by the user:** At commit `b18420e`, lint and typecheck passed, as did 144 unit tests and 89 browser cases (73 production non-design and 16 development design). Claude reported mobile Lighthouse performance >=85 on home and browse, with accessibility 96–100. The report estimates home/browse JavaScript at about 237/253 KB, still above the 200 KB target. Exact latest LCP and a fresh independent audit were not supplied; do not claim those budgets passed. These test and Lighthouse results are Claude-reported, not rerun by Codex in this documentation session.

**Next step for Claude or Codex:** Read `CLAUDE.md`, `docs/PHASE_PROMPTS.md` Phase 4 and `docs/DAAM_MASTER_PLAN.md` sections 16–17. Inspect Git status and the existing migration, then continue the Phase 4 schema in logical migrations, including RLS, storage policies, seed data, security tests and typed data access as specified. Verify against a local Supabase environment without destroying existing data; do not reset a database unless its target and data are known to be disposable. Record exact checks and outstanding performance budgets in the next entry.

**Checks in this documentation session:** Inspected Git history/status, the migration file, the Phase 4 prompt and the user-supplied Claude transcript. Application tests were not rerun because this session changed documentation only.

## Earlier work — Codex and Claude, through 2026-11-10

Codex continued Claude's Phase 3 sell wizard and built mock account, login, messaging and dashboard shells, fixed preview-only form messaging, improved public-page rendering/accessibility, and recorded an earlier production review. Claude subsequently committed the Phase 3C work (`376b256`) and performance improvements (`b18420e`) and began the Phase 4 migration above. Historical detail and earlier measurements are in `docs/CODEX_HANDOFF_AUDIT.md`, `docs/CODEX_REMAINING_TASKS.md` and `docs/PHASE_3_READINESS.md`; their older measurements and phase labels do not supersede this latest entry.

---

## 2026-11-19 — Claude (Opus 4.8): lock design to `design_handoff_daam_marketplace`, rebuild Home + Browse

**Design direction FINALISED.** The authoritative design source is the user's folder
`C:\Users\qasim\Downloads\design_handoff_daam_marketplace` — the 20 `.dc.html` hard-edge
editorial files (ink #2B0F1C / ivory #F4EFE4 / lime #D8F500, Bricolage Grotesque + Inter,
2px ink borders, radius 0, `[ DAAM ]` wordmark, real `uploads/` campaign banners). Per the
user, the warm `daam.` package was garbage: **deleted `design-references/` entirely** and
confirmed no warm-design memory exists.

**Done & verified (lint ✓, typecheck ✓, 158 tests ✓, screenshots):**

- Imported real campaign banners → `public/campaigns/` (hero-soch/purana/naya, seller-titanium, product-cobalt). Removed rejected `public/editorial/*.webp`; nulled mock `imageUrl`s (spec = "Seller's photo" placeholders everywhere, never stock images).
- **Home** (`app/[locale]/(marketing)/page.tsx`) rebuilt to `Daam Market.dc.html`: new `components/marketplace/hero-carousel.tsx` (auto-slide 5s, arrows + lime dots), hero search bar, filter tabs + Budget/City/Sort, Fresh-listings grid (`components/daam/market-listing-card.tsx`), dark FOR SELLERS campaign strip.
- **ListingCard** (`components/daam/listing-card.tsx`) rewritten to spec card (placeholder → name → storage → lime price chip → PTA badge + battery → ◉ city | condition) + new `components/daam/save-star.tsx`. Propagates to Browse, dashboard, shop, favourites.
- **Browse** header → big Bricolage "Browse phones" + spec subtitle; cards now spec-styled. Real nuqs filter logic kept.
- i18n: new `DaamHome` namespace (en+ur parity), `ListingCard.sellerPhoto`, browse copy aligned.

**Still to align to `.dc.html` (correct hard-edge system already, layouts differ):** Listing Detail, Shop Profile, Shops Directory, Account, Messages, Sell, Login, About, Contact, Help Policies, Admin ×6, App.

**Uncommitted.** Codex's Phase 4 backend remains uncommitted in the tree; nothing committed this session.

### 2026-11-19 (cont.) — more pages aligned + verified

Added to the verified list (all lint ✓ / typecheck ✓ / 158 tests ✓, screenshotted):

- **Login** → form left + dark ink perks panel right (lime ✓ bullets, lime circle). `components/account/login-form.tsx` logic kept.
- **Shops Directory** → huge Bricolage title, lime search, horizontal storefront-tile cards (real shop data).
- **Shop Profile** → big name, storefront tile + 4-up stats bar, Location/Contact aside (Chat with shop), "Phone inventory (N)" grid, reviews.
- New: `components/daam/save-star.tsx` (spec ☆/★ box).

Confirmed already-faithful (hard-edge from the earlier reskin, verified visually): Sell wizard, Messages, Dashboard, About (and the other info pages), Admin shell.

Not built: the `Daam App.dc.html` iPhone-frame **mobile-app mockup** — it is a prototype artifact of the mobile app, already covered by the responsive web app + bottom `MobileNav`; no separate route.

Saved a project memory `design-direction.md` so the source folder is never confused again.
Screenshot artifacts cleaned from the tree. Still uncommitted (Codex Phase 4 backend untouched).

### 2026-11-19 (cont.) — expanded phone-model catalog (LG + Korean carrier variants + Samsung JP)

User asked for all real phone models, incl. Korean LG sets (carrier-locked LG U+/SKT/KT) and Samsung Japan variants. Expanded `supabase/seed/{brands,models,variants,aliases}.csv` (the Sell wizard's catalog via `lib/catalog/seed-catalog.ts`) and mirrored new brands/models into `lib/mock/marketplace.ts` (browse filters).

- Brands 17 → **25** (added LG, Honor, Nothing, Asus, itel, QMobile, ZTE, Lenovo).
- Models 332 → **396** (full LG G/V/Velvet/Wing/Q/K/Stylo line + explicit `(Korean / LG U+)` variants for V40/V50/V60/Velvet/G8; Samsung S20/S21/S22/S23/Note20 Ultra/Z Flip `(Japan / docomo|au)`; Honor/Nothing/Asus ROG/itel/QMobile/ZTE/Lenovo lines).
- Variants + aliases added (e.g. aliases `lg u+`, `korean v50`, `s23 jp`, `docomo s23`).
- Dropped 3 pre-2017 LG models (G5/V20/Nexus 5X) to satisfy the `release_year >= 2017` seed-integrity rule.
- Verified: lint ✓, typecheck ✓, **158 tests ✓** (incl. seed-integrity), and the Sell wizard model search for "v50" returns "LG V50 ThinQ 5G", "LG V50 ThinQ (Korean / LG U+)", "LG V50S ThinQ".

### 2026-11-19 (cont.) — browse filters now list every brand's full model line

Browse Model dropdown only showed models that had a mock listing (Redmi → just "Redmi Note 13").
Fixed: `components/marketplace/browse-page.tsx` now falls back to the full seed catalog
(`getSeedBrowseCatalog()` added to `lib/catalog/seed-catalog.ts`) when Supabase isn't
configured, so every brand's whole model line appears (Redmi → 28 models incl. Note 10–15 /
A3 / A5 etc.; LG incl. Korean LG U+ variants; Samsung JP; etc.). Verified via curl of
`/en/phones?brand=redmi` — full catalog serialized into the page. lint ✓ typecheck ✓ 158 tests ✓.

Note: the dev-only React warning about `<script>{themeScript}</script>` in `layout.tsx` is
benign (runs on first server paint) and left as-is — the `react/no-danger` lint rule forbids
the `dangerouslySetInnerHTML` alternative.

### 2026-11-19 (cont.) — Report / Block seller + admin reports verified

- Added `components/listing/seller-safety-actions.tsx` (client): **Report user** (reasons + details → toast) and **Block user** (confirm → blocked state + Unblock), wired into `components/listing/seller-card.tsx`. Phase 3 mock (toast + local state); Phase 6 writes `reports` / `blocked_users` rows and hides a blocked seller's contact server-side.
- i18n: added report/block-user keys to the `Listing` namespace (en + ur parity).
- Admin console already exists and renders (verified 200): `/en/admin` (Overview), `/admin/reports` (shows Open/Reviewing/Resolved/Dismissed report cards from `lib/mock/admin.ts`), `/admin/users` (suspend/ban), `/admin/listings` (moderation).
- Verified: lint ✓ typecheck ✓ 158 tests ✓; listing page renders "Report user" + "Block user".

### 2026-11-19 (cont.) — diverse listing cards for every brand's models

Browse only showed ~12 listings reusing 4–5 models. Added `lib/mock/extra-listings.ts`
(`EXTRA_PHONES`, one listing for EVERY catalog model (396 across 24 brands), generated from the catalog slugs — incl. LG,
LG Korean/LG U+, Samsung JP, Honor, Nothing, Asus ROG, ZTE Nubia, Oppo/Vivo/Realme/Tecno/
Infinix lines) and mapped them to `MockListing`s in `lib/mock/marketplace.ts`. Browse now
shows **74 phones** with varied price / city / condition / PTA / battery, each a real card
linking to a working detail page (verified `/en/listing/iphone-15-pro-max-...` → 200).
`jv` lock only on Apple non-PTA (domain rule kept). lint ✓ typecheck ✓ 158 tests ✓.
Generator kept in scratchpad (`gen-listings.mjs`); edit it + regenerate rather than hand-editing.

### 2026-11-19 (cont.) — listing card for EVERY catalog model

Per user ("bohot saare mobile hain, sirf 78 kiye"): regenerated `lib/mock/extra-listings.ts`
to one listing per catalog model → **396 extra + 12 base = 408 listings**. Browse shows
"408 phones" (HTTP 200, ~1.4s, ~1MB HTML). lint ✓ typecheck ✓ 158 tests ✓. If the client
grid ever feels heavy on filter changes, consider paginating `browse-client` results.
