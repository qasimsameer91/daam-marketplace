# Daam project handoff

This is the shared handoff for Codex, Claude and the project owner. Read the latest entry before starting work. After each work session, add a dated entry at the top describing who worked, what changed, actual checks and their results, unfinished work, relevant commits/uncommitted files, and the next concrete step. Mark information reported by another agent separately from what you verified. Never record secrets, phone numbers or full IMEIs.

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
