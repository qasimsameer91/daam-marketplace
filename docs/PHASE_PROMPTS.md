# Daam: Claude Code Phase Prompts

How to use:
1. Put `CLAUDE.md` in the repo root and `DAAM_MASTER_PLAN.md` + this file in `/docs`.
2. Run one prompt per Claude Code session (or per `/clear`). Paste the whole block.
3. Don't start the next phase until the current phase's **exit criteria** pass. Commit at the end of every phase.
4. Long phases (3, 6, 9) are split into parts; run them in order.

---

## Phase 0: Project Scaffold

```
Read CLAUDE.md and docs/DAAM_MASTER_PLAN.md sections 1, 16 and 17.

Set up the Daam project from scratch:
1. Create a Next.js app (latest stable, App Router, TypeScript strict, ESLint, src-less layout matching the folder structure in plan section 16.3), using pnpm.
2. Install and configure: Tailwind CSS v4, shadcn/ui (init only, no components yet), motion, next-intl (locales en + ur, default en, ur is RTL), nuqs, zod, react-hook-form, @hookform/resolvers, @supabase/supabase-js, @supabase/ssr, server-only, lucide-react, clsx, tailwind-merge.
3. Dev tooling: Prettier (+ tailwind plugin), Vitest + Testing Library, Playwright, husky + lint-staged (lint + typecheck on commit).
4. Add package.json scripts: dev, build, start, lint, typecheck, test, test:e2e, db:reset, db:types.
5. Create the folder structure from plan 16.3 with placeholder index files where useful.
6. Create .env.example with: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, IMEI_ENC_KEY, IMEI_HASH_PEPPER, NEXT_PUBLIC_TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY, RESEND_API_KEY, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, NEXT_PUBLIC_POSTHOG_KEY, SENTRY_DSN, NEXT_PUBLIC_SITE_URL.
7. Set up next-intl locale routing (/[locale]) with en/ur message files and an RTL `dir` attribute on <html> for ur. (Use middleware or proxy, whichever the installed Next.js version uses.)
8. Initialise Supabase locally (supabase init) — no migrations yet.
9. Add a minimal home page that says "daam" so we can confirm everything runs.
10. Initialise git with a sensible .gitignore and make the first commit.

Exit criteria: `pnpm dev` runs, /en and /ur both render (ur is RTL), lint + typecheck + an example vitest test pass.
Do NOT build any features yet.
```

---

## Phase 1: Seed Data Preparation (founder tasks + one Claude Code task)

**Founder (outside Claude Code):** buy the domain, secure social handles, generate the logo (plan 4.8), book a legal consult (plan 24), start founding-shop conversations.

```
Read docs/DAAM_MASTER_PLAN.md sections 5, 6, 7 and 12.

Create seed data CSVs in /supabase/seed:
1. brands.csv: id, name, slug, parent_slug, sort_order. Include all launch brands from section 5 (Redmi and Poco have parent_slug "xiaomi").
2. cities.csv: name_en, name_ur, slug, province, is_major, sort_order for every city listed in section 12.
3. areas.csv: city_slug, name_en, name_ur, slug, with 25–40 well-known areas for Lahore and 10–20 each for Karachi, Islamabad and Rawalpindi.
4. models.csv: brand_slug, series, name, slug, release_year, supports_battery_health, popularity; variants.csv: model_slug, ram_gb, storage_gb; colors.csv: model_slug, name, hex; aliases.csv: model_slug, alias.
   Draft these for the most commonly traded phones in Pakistan over roughly the last 5 years (target ~250 models). Use only models and variants you are confident exist. Add a column `needs_review` = true for any row you are less than certain about. Include Pakistani shorthand aliases (e.g. "13 pm", "s23u", "note 13").
5. content_blocks.csv: key, body_en, body_ur for all PTA status explanations (section 6.1), network lock explanations (6.2), the "check before you pay" steps (6.4) and the safe-meetup tips (section 11). Keep the wording factual and calm; never imply CPID or JV equals PTA approval. Mark body_ur as draft for a human reviewer.
6. app_settings.csv: allow_cpid_listings=true, max_free_listings_individual=3, premoderation_enabled=true, scam_price_ratio=0.5, listing_expiry_days=30, daam_min_comparables=5.

Write a short /supabase/seed/README.md explaining each file and that `needs_review` rows must be checked by a human before production.
```

---

## Phase 2: UI/UX Design System

```
Read CLAUDE.md and docs/DAAM_MASTER_PLAN.md sections 4, 13 and 14.

Build the Daam design system:
1. Tailwind v4 @theme tokens: all colours from 4.3 (light + dark), radii (card 14px, button 10px), font families (Geist Sans, Geist Mono, Noto Nastaliq Urdu for :lang(ur)), the type scale from 4.4, and motion tokens from section 14 as CSS variables.
2. Load fonts with next/font (Geist + Geist Mono; Noto Nastaliq Urdu only for the ur locale).
3. Add shadcn components we need (button, input, select, dialog, drawer, sheet, tabs, badge, dropdown-menu, tooltip, toast/sonner, skeleton, slider, checkbox, radio-group, switch, avatar, separator, command) and restyle them to Daam tokens.
4. Build brand components in components/daam: PriceTag, PtaBadge, NetworkLockBadge, ConditionChip, BatteryPill, DaamMeter (great/fair/high/unknown), VerifiedBadge (id/shop/trusted/founding), ListingCard + ListingCardSkeleton, BrandTile, EmptyState, SafetyCard, WizardStepper, plus a `FeaturedTag` with the clipped-corner motif.
5. Create lib/domain/pta.ts (labels, colours, icons, combined-badge logic, the jv/cpid rules), lib/domain/condition.ts, lib/domain/pricing.ts (formatPKR, formatPKRShort) and lib/domain/phone.ts (normalise/validate Pakistani numbers), all with Vitest tests.
6. Create lib/motion.ts with shared variants (fadeRise, stagger, sheet, modal, stamp) that automatically degrade under reduced motion.
7. Build /[locale]/dev/design: a kitchen-sink page showing every component in every state, light/dark toggle, en/ur toggle, reduced-motion preview. (Block this route in production.)

Exit criteria: no hard-coded hex values in components; design page works in en (LTR) and ur (RTL), light and dark; contrast passes WCAG AA; domain tests pass.
```

---

## Phase 3: Frontend (Mock Data)

### Part A: Layout, home, browse
```
Read CLAUDE.md and docs/DAAM_MASTER_PLAN.md sections 2, 9, 13, 14 and 15.

Using typed mock data (lib/mock/*.ts, shaped like the Section 17 schema), build:
1. App shell: sticky header (logo, search bar, Sell button in lime, language switch, auth avatar placeholder), mobile bottom nav (Home, Search, Sell, Messages, Account), footer with all policy/info links.
2. Homepage: animated hero (floating phone + gently swinging price tag; parallax desktop-only; reduced-motion safe), search bar with suggestions, brand tiles, "Fresh listings" grid with staggered reveals, "How Daam keeps you safe" (PTA, condition, Daam Meter, verified shops), PTA explainer teaser, city chips, shop CTA.
3. /phones browse page: filter sidebar (desktop) / bottom sheet (mobile) with every filter from section 9, filter chips, sort menu, results grid with layout animations, URL state via nuqs, skeletons, empty state.
4. /brands, /phones/[brand], /phones/[brand]/[model] (model page includes a price-guide block with a mock median and range by PTA status/condition), /[city]/phones.
5. Page transitions (≤200ms fade/slide) via a route template.

Exit criteria: all pages render in en + ur at 360px and 1440px; Lighthouse mobile performance ≥ 85 on home and browse.
```

### Part B: Listing detail, profiles, static pages
```
Continue Phase 3 with mock data:
1. /listing/[slug]-[shortId]: gallery (swipe on mobile, thumbnails on desktop, fullscreen viewer), price + Daam Meter with "Typical price Rs X – Y", PTA + network badges with an expandable explainer (from mock content_blocks), CPID red banner variant, "Seller says" vs "Checked by Daam" labels, spec table, condition details, IMEI "on file ••••1234", seller card (badges, rating, member since, response time), contact buttons (Chat, WhatsApp, Call — show-number behaviour mocked), safety tips, report button, similar phones.
2. /u/[username] and /shop/[slug] storefront.
3. Static pages: /pta-guide (with the full "check before you pay" flow), /safety, /about, /contact, /help (FAQ accordion), /terms, /privacy, /policies/listings, /for-shops (plans marked "coming soon"), /report-stolen (form UI only), 404, 500.
Add JSON-LD placeholders for Product/Offer and FAQPage.
```

### Part C: Sell wizard UI + dashboard shells
```
Continue Phase 3 with mock data:
1. /sell wizard UI (6 screens from plan section 8) with WizardStepper, slide transitions, a progress bar, local autosave to localStorage (temporary), the ModelPicker with alias search, PTA/network explainer cards, the JV option only for Apple, battery field only when required, PhotoUploader (multi-select, local previews, dnd-kit reorder, cover = first, client compression to WebP ≤1600px with browser-image-compression; ask before installing deps), price input with a mock live DaamMeter, city → area selects, description chips, contact toggles, preview, and the "stamp" success animation.
2. Zod schemas in lib/validation/listing.ts implementing every rule from plan sections 6–8 (shared later with server actions), with unit tests.
3. Dashboard shells: /dashboard, /dashboard/listings (tabs: active, pending, drafts, sold, expired), /dashboard/favorites, /dashboard/settings, /dashboard/verify, /dashboard/shop, /messages (list + thread UI), /notifications, /login (phone + OTP UI).

Exit criteria: the sell wizard can be completed end-to-end locally; validation errors are clear in en + ur.
```

---

## Phase 4: Backend & Database

```
Read CLAUDE.md and docs/DAAM_MASTER_PLAN.md sections 16 and 17.

1. Create Supabase migrations implementing every enum, table, index and constraint in section 17 (split into logical migration files).
2. Add triggers/functions from 17.4: set_updated_at, listings_search_vector (weighted: model/aliases A, brand/variant B, title C, description D), generate_listing_title. Stub compute_daam_meter and check_listing_risk with TODOs for Phases 6–7.
3. Add a view `public_profiles` (no phone, no cnic, no strikes) and RLS policies exactly as in 17.3. listing_private must have NO policies for anon/authenticated (service role only).
4. Storage buckets: listing-images (public read, owner write to own folder), verification-docs (private), payment-proofs (private), chat-attachments (participants only), with storage policies.
5. Seed script that loads all CSVs from /supabase/seed (brands with parents, models, variants, colours, aliases, cities, areas, content_blocks, app_settings).
6. RLS test suite (pgTAP or SQL test files run in CI) covering: anon can't read listing_private, phone numbers or verification docs; user A can't update user B's listing/profile; non-participants can't read conversations/messages; users can't change their own role/strikes/shop tier; moderators can update listing status.
7. Generate TypeScript types; build lib/supabase/{server,client,admin}.ts and a typed data-access layer in lib/data/* (catalog, listings read queries).
8. Replace mock catalog data on browse/brand/model pages with real Supabase queries (listings can stay mocked until Phase 6).

Exit criteria: `supabase db reset` works from zero; all RLS tests pass; types generated; catalog pages use real data.
```

---

## Phase 5: Authentication & User Profiles

```
Read CLAUDE.md and docs/DAAM_MASTER_PLAN.md sections 3, 11 and 12.

1. Phone OTP auth with Supabase Auth. Normalise numbers with lib/domain/phone.ts; Pakistani mobile numbers only. Configure the SMS provider behind the Supabase "Send SMS" hook so it can be swapped (implement the hook as an Edge Function with a provider interface and a console/dev provider for local).
2. Cloudflare Turnstile on login; Upstash rate limits on OTP send (per phone + per IP).
3. Onboarding after first login: display name, username, city/area, locale. Creates/updates the profile row.
4. Session handling with @supabase/ssr; protected route groups (app, admin); role guard for /admin (moderator+).
5. Settings: edit profile, avatar upload, WhatsApp toggle, language, log out everywhere, delete account (soft delete + anonymise).
6. Public profile /u/[username] and shop storefront /shop/[slug] with real data.
7. Shop creation flow (name, slug, market, address, city/area, map pin with lat/lng, hours, logo/cover).
8. Verification flows: individual ID (CNIC front/back + selfie) and shop verification (owner CNIC, selfie, signboard + interior photos, optional NTN/association card) → private bucket → verification_requests row → notification to the user. Store only cnic_last4 on decision.
9. Dashboard home shows verification status and next steps.

Exit criteria: real signup/login with OTP (dev provider locally), profile + shop creation, verification submission; docs are not publicly reachable; logged-out users can't reach protected pages.
```

---

## Phase 6: Marketplace Listings

### Part A: Create & manage
```
Read CLAUDE.md and docs/DAAM_MASTER_PLAN.md sections 6, 7, 8 and 11.

1. Wire the sell wizard to the DB: a draft row is created on screen 1 and autosaved on each screen via server actions using the shared Zod schemas; resume drafts from the dashboard.
2. IMEI pipeline (lib/security/imei.ts, server-only): Luhn validation, AES-256-GCM encryption with IMEI_ENC_KEY, HMAC-SHA256 with IMEI_HASH_PEPPER, write to listing_private, set listings.imei_last4. Full IMEIs never go back to the client or into logs.
3. Image pipeline: client compression → signed upload to listing-images/{userId}/{listingId}/ → server action re-encodes with sharp (strip EXIF/GPS, max 1600px, WebP), computes a perceptual hash, stores listing_images rows; reorder + delete; cover = sort_order 0.
4. Publish: compute completion_score, generate the title/slug/short_id, enforce the individual 3-active-listing cap and the shop plan limits, set status pending_review (when premoderation_enabled) or active, expires_at = now + listing_expiry_days.
5. Implement check_listing_risk: duplicate IMEI hash on another user's active listing, stolen registry match, pHash match on another user's listing, banned keywords → status on_hold + hold_reasons.
6. My listings: edit (edits to price/PTA/photos re-run risk checks), delete, mark as sold (sold on Daam → choose a buyer from conversations; or elsewhere), renew expired listings.
```

### Part B: View, favourite, contact, basic moderation
```
Continue Phase 6:
1. Listing detail page with real data (incremental revalidation; increment view_count server-side, debounced per viewer).
2. Browse/brand/model/city pages show real active listings.
3. Favourites (optimistic toggle, count updates).
4. revealContact server action: login required, rate-limited, logs contact_reveals, returns the phone only to that request; WhatsApp deep link with a prefilled message.
5. Stolen-device report form → stolen_device_reports (hash + last4 only).
6. Basic admin moderation page: list pending/on_hold listings with risk reasons; approve / reject with reason templates; writes audit_log; notifies the seller.
7. Unit tests: PTA rules, completion score, IMEI crypto round-trip; Playwright e2e: create listing → moderator approves → appears in browse.

Exit criteria: the full listing lifecycle works; JV + PTA Approved is impossible; a duplicate IMEI across accounts goes on hold; uploaded images carry no EXIF; no full IMEI or phone number appears in any page payload.
```

---

## Phase 7: Search, Filters & Daam Meter

```
Read CLAUDE.md and docs/DAAM_MASTER_PLAN.md sections 9 and 10.

1. Search: a Postgres RPC `search_listings(params)` combining tsvector rank, pg_trgm similarity on model names, alias matching, all filters, all sorts and pagination (keyset where possible). Return facet counts for brand, PTA status, condition, storage and city via a companion RPC.
2. Search suggestions endpoint (models, brands, recent searches stored locally).
3. Wire the browse UI fully (nuqs URL state, facets, chips, sort, infinite scroll or pagination, skeletons, empty state with "relax filters" suggestions).
4. Daam Meter: implement compute_daam_meter (comparable set, ≥ daam_min_comparables, median/p25/p75, bands, price_references fallback), run it on publish/price change, add a pg_cron nightly recompute, and apply the scam guard (price < scam_price_ratio × median → on_hold).
5. A live Daam Meter server action for the sell wizard (debounced as the user types the price).
6. Model pages become price guides: median + range by PTA group and condition band, listing count, recent listings; JSON-LD ItemList.
7. City × brand × model routes with real data and proper metadata.
8. Seed script for 2,000 synthetic listings (dev only) to test performance.

Exit criteria: "13 pm" finds iPhone 13 Pro Max; facet counts are correct; p95 search < 300ms on synthetic data; Daam Meter values match a manual calculation on 10 sample listings.
```

---

## Phase 8: Messaging & Notifications

```
Read CLAUDE.md and docs/DAAM_MASTER_PLAN.md sections 11 and 15.

1. Conversations: "Chat with seller" creates or opens a conversation (unique per listing + buyer); sellers can't chat with themselves; blocked users can't message.
2. Realtime chat with Supabase Realtime: text, images (chat-attachments bucket), offers (offer_pkr with accept/decline system messages), read receipts, unread counts, typing indicator (optional), conversation list with last message previews.
3. A safety system message at the start of each conversation (from content_blocks); scam-pattern detection on send (token money, advance payment, Easypaisa/JazzCash first, courier/COD on high-value phones, external links) → flag the message + show a warning card to the recipient.
4. Block and report from chat.
5. Notifications: create rows for new_message, listing_approved/rejected, listing_expiring, review_received, verification_result, report_update; bell with unread badge (realtime), /notifications page, mark read/all read.
6. Email via Resend for verification_result, listing_approved/rejected, listing_expiring and first message on a listing; respect user settings.
7. Reviews: when a seller marks a listing sold to a buyer, both get a review prompt; only that buyer/seller pair can review that listing; update rating_avg/rating_count; show reviews on profiles and storefronts.

Exit criteria: two browsers chat in real time; a scam phrase triggers a warning; blocked users can't message; reviews are possible only after a confirmed Daam sale.
```

---

## Phase 9: Admin Dashboard

### Part A
```
Read CLAUDE.md and docs/DAAM_MASTER_PLAN.md section 19.

Build /admin with a sidebar, role-aware navigation and a strict server-side permission check per action (permission matrix in section 19):
1. Overview KPIs + daily charts.
2. Moderation queue (risk flags, keyboard shortcuts: A approve, R reject, H hold; reject reason templates; side-by-side photos).
3. PTA check tool: reveal the IMEI (server-side, logged in audit_log), a link that opens PTA's official DVS site, and a form to record compliant + model-match → sets pta_check_source = 'daam_checked', pta_checked_at, pta_checked_by.
4. Reports queue with actions (dismiss, remove listing, warn, strike, suspend) and automatic suspension at 3 strikes.
5. Users: search, detail, suspend/unsuspend, role change (super_admin only).
```

### Part B
```
Continue Phase 9:
1. Verification requests: document viewer with 5-minute signed URLs, a video-call checklist for shops, approve/reject/needs-more-info, sets shop tier/badges, purge job for docs after 30 days.
2. Shops management (tier, plan, founding flag, strikes).
3. Catalog CRUD for brands, series, models, variants, colours, aliases + CSV import/export.
4. Price references editor with a comparable-count view per variant.
5. Payments → promotions: review uploaded payment proofs, confirm, activate featured/bump/city_top with start/end; CPID listings can never be promoted.
6. Content blocks editor (en/ur), app settings + kill switches (super_admin), audit log viewer with filters.
7. Admin requires MFA (Supabase TOTP) before access.

Exit criteria: each role can do exactly what the matrix allows; every mutation is audit-logged; the CPID kill switch hides CPID listings instantly.
```

---

## Phase 10: Security & Testing

```
Read CLAUDE.md and docs/DAAM_MASTER_PLAN.md sections 11 and 16.5.

1. Playwright e2e for: signup/login, create listing, moderator approve, search + filter, favourite, chat + offer, report, mark sold + review, admin verification approve, CPID kill switch.
2. Vitest coverage for all lib/domain and lib/security modules (target ≥ 90% on those folders).
3. RLS test suite in CI (GitHub Actions: lint, typecheck, unit, RLS, e2e against local Supabase).
4. Security headers + strict CSP (next.config), Turnstile on signup/post/report, verify rate limits on OTP/contact reveal/messages/listing creation.
5. Self-audit: grep the codebase and network payloads to confirm no full IMEI, phone numbers, CNIC data or service keys leak; confirm every table has RLS; confirm no dangerouslySetInnerHTML with user content.
6. Accessibility audit (axe in Playwright) and performance pass (Lighthouse CI on home, browse, listing, sell).
7. Write docs/RUNBOOK.md: backups, restore drill steps, incident response, how to rotate IMEI keys, kill switches.

Exit criteria: CI fully green; Lighthouse mobile ≥ 85 performance / ≥ 95 accessibility on key pages; no critical/high issues open.
```

---

## Phase 11: Deployment & Launch

```
Read CLAUDE.md and docs/DAAM_MASTER_PLAN.md sections 16, 20 (Phase 11) and 21.

1. Production setup checklist: Supabase prod project (Mumbai region), Vercel project linked to the repo with prod/preview envs, custom domain + SSL, env vars set, pg_cron jobs enabled, storage policies verified, the SMS provider live.
2. SEO: sitemaps (static, brands, models, cities, listings) + robots.txt, hreflang en/ur, canonical URLs, OG images with next/og in the price-tag style, JSON-LD validated; sold/expired listing handling (banner for 30 days, then 410).
3. Monitoring: Sentry (client + server), PostHog events for the core funnel (view listing → contact, sell wizard step completion), Vercel Analytics, uptime alerts.
4. A beta gate: an app setting `invite_only` + invite codes for the private beta.
5. Founding Shop tooling: a bulk-assist flow so an admin can create listings on behalf of a founding shop (logged in audit_log, with the shop's consent flag).
6. A production smoke-test script and a launch checklist in docs/LAUNCH.md.

Exit criteria: production live behind invite-only; a real listing created, approved, found by search and contacted on production; monitoring alerts working.
```
