# CLAUDE.md: Daam

Daam (دام, "price") is a premium marketplace in Pakistan for used, refurbished and new mobile phones. Tagline: *Sahi phone. Sahi daam.*
The full spec is in `docs/DAAM_MASTER_PLAN.md`; read the relevant section before starting any task. Per-phase task prompts are in `docs/PHASE_PROMPTS.md`.

## Shared agent handoff

Read `PROJECT_HANDOFF.md` before starting work. At the end of each work session, add a dated entry there identifying the agent, changes, checks actually run and results, current uncommitted work, outstanding issues, and the next step. Distinguish reported results from those independently verified. Never record secrets or sensitive personal data.

## Stack
- Next.js (latest stable, App Router, RSC by default), TypeScript `strict`
- Tailwind CSS v4 (tokens in `@theme`), shadcn/ui, Lucide icons
- Motion for React (`motion/react`); GSAP only for the homepage hero if truly needed
- Supabase: Postgres, Auth (phone OTP), Storage, Realtime, Edge Functions, pg_cron (region: Mumbai)
- React Hook Form + Zod (shared schemas in `lib/validation`), nuqs (URL state), next-intl (en + ur, RTL)
- Resend (email), Cloudflare Turnstile, Upstash rate limiting, Sentry, PostHog
- Vitest (unit), Playwright (e2e), SQL/pgTAP (RLS tests)
- Hosting: Vercel

## Commands
```
pnpm dev                 # local dev
pnpm build && pnpm start
pnpm lint && pnpm typecheck
pnpm test                # vitest
pnpm test:e2e            # playwright
supabase start           # local supabase
supabase db reset        # rebuild DB from migrations + seed
supabase gen types typescript --local > lib/supabase/database.types.ts
```
(Create these scripts in Phase 0 if they don't exist.)

## Workflow rules
1. Work **one phase at a time** following `docs/PHASE_PROMPTS.md`. Don't build features from later phases.
2. Before coding, write a short plan (files to create/change). After coding, run lint, typecheck and tests, and fix failures.
3. **Ask before adding any dependency** not listed above.
4. If a decision in the master plan seems wrong, raise it; don't silently deviate. Record approved changes in the plan's Decision Log.
5. Keep commits small and descriptive (`feat(listings): ...`, `fix(auth): ...`).
6. Never put real secrets in code. Use `.env.local` and keep `.env.example` up to date.

## Code conventions
- Server Components by default; add `"use client"` only for interactivity.
- Mutations go through **Server Actions** that validate with Zod and return typed results `{ ok: true, data } | { ok: false, error }`.
- No `any`. Use generated Supabase types.
- Server-only code (service role, IMEI crypto) lives in `lib/supabase/admin.ts` / `lib/security/*` with `import "server-only"`.
- Domain logic lives in `lib/domain/*` as pure, unit-tested functions (PTA rules, condition, Daam Meter, PKR, phone validation).
- File names in kebab-case; components in PascalCase; one component per file in `components/daam`.
- Keep components small; extract hooks to `hooks/`.

## Database & security rules (non-negotiable)
- **RLS is on for every table.** Deny by default. Every new table ships with policies and an RLS test.
- **The service-role key is never imported in client code.**
- **IMEI:** never stored in plain text, never logged, never returned to the client. Store `AES-256-GCM` ciphertext + an `HMAC-SHA256` hash in `listing_private`; only `imei_last4` is public. Validate with Luhn (15 digits).
- **Phone numbers are never in public queries or HTML.** They are revealed only through the `revealContact` server action (login + rate limit + `contact_reveals` log).
- **CNIC/verification docs** go to the private bucket; admins see them only through 5-minute signed URLs; purge 30 days after decision.
- Descriptions and messages are rendered as plain text. Never use `dangerouslySetInnerHTML` with user content.
- Strip EXIF/GPS from every uploaded image; re-encode server-side.
- Every admin/moderator mutation writes to `audit_log`.

## Domain rules (non-negotiable)
- PTA is **two fields**: `pta_status` (`pta_approved | non_pta | cpid_patched | unknown`) and `network_lock` (`factory_unlocked | carrier_locked | jv | unknown`).
- `jv` ⇒ brand is Apple **and** `pta_status ≠ pta_approved` (enforced in DB, Zod and UI).
- `cpid_patched` ⇒ red warning banner, never featured/promoted, excluded from Best Deals, hidden when `app_settings.allow_cpid_listings = false`.
- **Never treat CPID, JV or "server approved" as PTA approval.** Never write "IMEI verified" or "PTA verified" unless `pta_check_source = 'daam_checked'` (a moderator checked on PTA DVS); otherwise label it "Seller says".
- PTA/safety explainer copy comes from `content_blocks` (DB), not hard-coded strings.
- Battery health is required for iPhones unless the condition is `brand_new` / `open_box`.
- Prices are integer PKR. Use `formatPKR()` (`Rs 125,000`) and `formatPKRShort()` (`Rs 1.25 lac`) only.
- Phone numbers: accept `03XXXXXXXXX` / `+923XXXXXXXXX`, store E.164 `+923XXXXXXXXX`.
- Individuals have at most 3 active listings (`app_settings.max_free_listings_individual`).
- Verification badges are never purchasable.

## Design rules
- Use design tokens only (`ink`, `paper`, `lime`, `graphite`, `slate`, `mist`, `success`, `warning`, `danger`, `info`). **No hard-coded hex values in components.**
- Lime is never used as text on light backgrounds; it always sits behind `ink` text.
- Status is never shown by colour alone (always icon + label).
- Prices, specs, grades and IMEI last 4 use **Geist Mono**; UI uses Geist Sans; Urdu uses Noto Nastaliq Urdu.
- Card radius 14px, buttons 10px, chips pill. Price-tag clipped corner = brand motif.
- Mobile-first; tap targets ≥ 44px; primary actions reachable by thumb.
- Every list or page has a skeleton loading state, an empty state and an error state.
- Use RTL-safe logical utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`), never `ml/mr/pl/pr/left/right` for layout.
- All user-facing strings go through next-intl (`messages/en.json`, `messages/ur.json`). No hard-coded UI text.

## Motion rules
- Animate only `transform` and `opacity`.
- Tokens: 120 / 200 / 320 / 500ms; ease `cubic-bezier(0.2,0,0,1)`; spring stiffness 400, damping 30.
- Respect `prefers-reduced-motion` everywhere (`useReducedMotion()` → opacity-only).
- Stagger at most 8 items at 30ms. No scroll-jacking or smooth-scroll libraries. Magnetic effects only on hero CTAs for `pointer: fine`.

## Performance budgets
- Mobile LCP < 2.5s, CLS < 0.05, JS < 200KB gzipped per route.
- `next/image` with explicit sizes; lazy-load below the fold; client-compress uploads to WebP ≤ 1600px.
- Cache read pages (ISR / `revalidateTag`); keep listing pages dynamic with short revalidation.

## Definition of done (every task)
- [ ] Matches the master plan section it implements
- [ ] Lint + typecheck + tests pass
- [ ] RLS policies + tests for any new table
- [ ] en + ur strings added; RTL checked
- [ ] Loading / empty / error states present
- [ ] Mobile (360px) and desktop checked
- [ ] Reduced motion respected
- [ ] No secrets, no full IMEI, no phone numbers leaked in responses or logs
