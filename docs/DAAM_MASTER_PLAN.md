# DAAM: Master Product & Build Plan

**Version:** 1.0 · **Date:** 10 Nov 2026 · **Status:** Planning approved, ready for build
**Tagline:** *Sahi phone. Sahi daam.*

This is the source of truth for Daam, a premium marketplace in Pakistan for buying and selling used, refurbished and new mobile phones. `CLAUDE.md` holds the coding rules and `PHASE_PROMPTS.md` holds the copy-paste prompts for each build phase. When a decision changes, update the Decision Log (Section 1) first.

---

## Table of Contents

1. Decision Log
2. Vision & Positioning
3. Users, Roles & Verification Levels
4. Brand Identity
5. Catalog Structure
6. PTA & Network Status Model (critical)
7. Condition Grades & Specifications
8. Sell Wizard (Listing Creation)
9. Search, Filters & Sorting
10. Daam Meter (Price Intelligence)
11. Trust & Safety System
12. Pakistan-Specific Features
13. UI/UX Design System
14. Motion Design System
15. Sitemap & Pages
16. Technical Architecture
17. Database Schema
18. Business Model
19. Admin Dashboard & Permissions
20. Development Roadmap (Phases 1–11)
21. Go-To-Market (Lahore Launch)
22. MVP Scope: In / Out
23. Risks & Mitigations
24. Open Items for the Founder

---

## 1. Decision Log

| #    | Decision | Status | Notes |
|------|----------|--------|-------|
| D-01 | Brand name is **Daam** (Urdu for "price") | LOCKED | Domain, social handles and trademark checks still pending (Phase 1) |
| D-02 | **Hybrid marketplace:** individuals (C2C) and shops (B2C) | LOCKED | Shops must pass extra verification; individuals verify by phone OTP |
| D-03 | Launch city is **Lahore** (Hafeez Centre, Hall Road) | RECOMMENDED | Listings are open in every city from day 1; marketing and shop onboarding start in Lahore |
| D-04 | Stack: Next.js + TypeScript + Tailwind + shadcn/ui + Motion + Supabase + Vercel | LOCKED | See Section 16 |
| D-05 | Phones only at MVP (no tablets, watches or accessories) | RECOMMENDED | A clear focus is part of the brand |
| D-06 | Contact methods: in-app chat + WhatsApp + call reveal, all requiring login | RECOMMENDED | Chat lets us detect scams; login stops number scraping |
| D-07 | No in-app payments between buyers and sellers at MVP | RECOMMENDED | Paid promotions start with manual payment (JazzCash/Easypaisa/bank) and move to a gateway later |
| D-08 | PTA is modelled as **two fields**: `pta_status` + `network_lock` | RECOMMENDED | This corrects the original spec: "Factory Unlocked" and "Carrier Locked" describe the network lock, not PTA status |
| D-09 | CPID/patched phones may be listed **only as a forced disclosure**: red warning, never featurable, admin kill switch | OPEN | **Needs a lawyer's opinion before launch.** IMEI tampering is illegal in Pakistan |
| D-10 | IMEI is collected privately, stored encrypted + hashed, and only the last 4 digits are ever shown | LOCKED | |
| D-11 | English + Urdu (RTL) at launch; i18n built in from day 1 | LOCKED | Core flows (browse, listing, sell, chat) fully translated |
| D-12 | Individuals list free (up to 3 active listings); shops get a free tier, with paid tiers after traction | RECOMMENDED | Pricing in Section 18 is a hypothesis to test |
| D-13 | **Daam Meter** is the signature feature: a fair-price badge on every listing | LOCKED | The brand name *is* the feature |
| D-14 | All listings are pre-moderated during the launch period (target review time under 2 hours) | RECOMMENDED | Moves to risk-based moderation once volume grows |

---

## 2. Vision & Positioning

**One-liner:** Daam is where Pakistan buys and sells phones with the truth shown upfront: PTA status, real condition and a fair price, before anyone meets.

**The problem.** Pakistan's used-phone trade runs on OLX, Facebook groups, WhatsApp and personal trust at markets. Buyers can't easily tell:
- whether a phone is properly PTA approved or a CPID/patched device;
- whether "10/10 condition" hides a replaced screen or a weak battery;
- whether a price is fair or a trap (scam bait is often priced far below market).

**The promise.** Every Daam listing answers three questions at a glance:
1. **Will it work on my SIM?** (PTA + network lock badge)
2. **What condition is it really in?** (standardised grade, battery %, repair history)
3. **Is the price fair?** (Daam Meter: Great / Fair / Above market)

**How we beat general classifieds:**

| Lever | What Daam does differently |
|-------|---------------------------|
| PTA clarity | A two-field status model, buyer explainers, a "check before you pay" flow and moderator-checked badges |
| Honest condition | A standard grade scale with definitions and photo guidance; battery health required for iPhones |
| Fair price | Daam Meter on every card and listing page, plus live price guidance while selling |
| Verified shops | Shops prove identity and location; strike system; ratings tied to real deals |
| Phone-native UX | Picking a model auto-fills its specs; filters built for phones; listing takes about 2 minutes |
| Safety | IMEI duplicate and stolen-device checks, scam-pattern warnings in chat, safe-meetup guidance |

**North-star metric:** *Qualified conversations per week* (a buyer and seller exchange at least 3 messages, or a WhatsApp/call is revealed on an active listing).

---

## 3. Users, Roles & Verification Levels

### Roles
| Role | Can do |
|------|--------|
| Guest | Browse, search, read guides |
| User (buyer/seller) | All of the above, plus favourites, chat, list phones, review, report |
| Shop owner | All of the above, plus a shop storefront, more listings, shop analytics, promotions |
| Support | Read users and listings, reply to tickets |
| Moderator | Review listings and reports, hold/reject listings, warn users |
| Admin | Everything moderators can do, plus suspend users, approve shop verification, manage catalog, promotions and payments |
| Super admin | Everything, including managing admins, app settings and kill switches |

### Verification levels
| Level | Requirements | Badge | Unlocks |
|-------|-------------|-------|---------|
| L0 Guest | — | — | Browse |
| L1 Phone verified | Pakistani mobile number + OTP (required for any action) | — | Chat, list, reveal contact |
| L2 ID verified (individual, optional) | CNIC front/back + live selfie, reviewed by admin | "ID Verified" | Higher trust, ranking boost |
| Verified Shop | L1 + owner CNIC + selfie + shop photos (signboard visible + interior) + address + Google Maps pin + 10-minute video call; NTN or market association card optional | "Verified Shop" | Shop storefront, up to 50 active listings (free tier) |
| Trusted Shop (later) | Verified Shop + physical visit + 60 days with no confirmed complaints + rating ≥ 4.5 | "Daam Trusted" | Top ranking, Daam Check partner eligibility |

**Rules**
- One account per phone number.
- Individuals can have at most **3 active listings**. Above that, they are prompted to open a shop account. This stops dealers posing as individuals.
- A verification badge **can never be bought**. Paid plans can speed up review, but every check must still pass.
- CNIC images go to a private storage bucket and are viewable only by admins through signed URLs that expire in 5 minutes. They are **auto-deleted 30 days after the decision**; we keep only the decision, date, reviewer and the CNIC's last 4 digits.

---

## 4. Brand Identity

### 4.1 Core
- **Name:** Daam (دام): "price, value."
- **Primary tagline:** *Sahi phone. Sahi daam.* ("Right phone. Right price.")
- **Alternates:** *Har phone ka sahi daam.* / *The right price for every phone.*
- **Personality:** honest, sharp, calm, a little witty. Like a friend from Hafeez Centre who knows every phone's real price and won't let you get scammed.
- **Voice rules:**
  - Plain words. Numbers beat adjectives ("Battery 89%", not "great battery").
  - Never hype. Never claim something we haven't checked.
  - Roman-Urdu flavour in marketing ("Daam check karo"); clean English or Urdu in the UI.
  - Warnings are calm and specific, never scary.

### 4.2 Logo direction
- **Concept A, Tag Wordmark (primary):** lowercase `daam` in a custom geometric sans. The counter (inner hole) of the `d` is punched like a price-tag hole, with a hairline string in large lockups only.
- **Concept B, Tag Monogram (app icon/favicon):** a price-tag silhouette (rounded rectangle with one clipped corner and a hole) holding a bold lowercase `d`.
- **Concept C, Meter (alternative):** a tiny gauge needle between the two `a`s, referencing the Daam Meter.
- **Recommendation:** A + B as one system (wordmark for web, monogram for app, favicon and social avatar).

### 4.3 Colour palette
| Token | Hex | Use |
|-------|-----|-----|
| `ink` | `#0E0F12` | Primary text, dark surfaces, logo |
| `paper` | `#F7F6F2` | Light background (warm off-white, not pure white) |
| `lime` (brand) | `#D7FF3F` | Primary CTA backgrounds (with ink text), highlights, "Great daam" |
| `graphite` | `#2A2C31` | Dark-mode cards, secondary dark surfaces |
| `slate` | `#6B6F76` | Secondary text |
| `mist` | `#E7E6E1` | Borders, dividers |
| `success` | `#12B76A` | PTA Approved badge, success states |
| `warning` | `#F59E0B` | Non-PTA, Unknown, caution |
| `danger` | `#E5484D` | CPID/patched, JV, blocked, destructive |
| `info` | `#3B82F6` | Info banners, links in dense UI |

**Dark mode:** background `#0B0C0E`, surface `#15171B`, text `#F2F1EC`, lime unchanged.
**Rules:** lime is **never** used as text on light backgrounds; it always sits behind ink text. Status is never shown by colour alone (always icon + label).

### 4.4 Typography
- **UI & headings:** Geist Sans (free, modern, excellent at small sizes).
- **Prices, specs, grades, IMEI last 4:** Geist Mono. This is our signature "price tag" look.
- **Urdu:** Noto Nastaliq Urdu (line-height 1.9–2.2, loaded only for `/ur`). Use Noto Naskh Arabic as the fallback in dense UI (filters, tables) if Nastaliq breaks the layout.
- **Scale (rem):** 0.75 / 0.875 / 1 / 1.125 / 1.25 / 1.5 / 2 / 2.5 / 3.5 / 4.5. Display headings get tight letter-spacing (-0.02em).

### 4.5 Iconography & shape
- Lucide icons (shadcn default), 1.5px stroke, rounded caps.
- Custom icon set for PTA states, condition grades, verified badges and the Daam Meter.
- Card radius 14px, buttons 10px, chips full-pill.
- **Brand motif:** the clipped price-tag corner on featured cards, badges, OG images and social posts.

### 4.6 Imagery & social
- Real phone photos on neutral backgrounds. No stock photos of people. 3D phone renders only in the homepage hero.
- **Social grid:** ink backgrounds, lime price-tag stickers, mono numbers.
- **Content pillars:** *Daam Check* (is this price fair?), PTA explainers, scam alerts, phone grading guides, "what X gets you" (e.g., the best phone for Rs 50,000).
- **Social handles:** secure `@daam.pk` / `@daampk` / `@getdaam` everywhere (check availability).

### 4.7 Favicon & app icon
- Monogram B: a lime tag with an ink `d`. Dark variant: an ink tag with a lime `d`.
- Export sizes: 16, 32, 48, 180 (Apple touch), 192, 512, plus a maskable 512 for the PWA.

### 4.8 Logo image-generation prompt
> Minimal premium logo for a Pakistani mobile-phone marketplace brand named "daam". Lowercase wordmark "daam" in a custom geometric sans-serif typeface, bold weight, tight letter spacing, perfectly balanced. The inner counter of the letter "d" is shaped like the punched hole of a price tag. Next to the wordmark, a separate app-icon mark: a price-tag silhouette (rounded rectangle with one clipped corner and a small round hole) in electric lime green #D7FF3F containing a bold lowercase "d" in near-black #0E0F12. Flat vector, no gradients, no 3D, no shadows, no mockups, no extra text, no emojis. Clean white background, generous padding, high contrast, Swiss modernist precision, inspired by the restraint of premium tech brands. Logo sheet layout: wordmark on top, icon mark below, plus one inverted version on a #0E0F12 background.

*(After generating, rebuild the final logo as clean vector SVG. Don't ship AI raster output as the production logo.)*

---

## 5. Catalog Structure

**Hierarchy:** Brand → Series (optional) → Model → Variant (RAM + Storage) → Colour.

Example: Apple → iPhone → iPhone 15 → 128GB / 256GB / 512GB → Black, Blue, Green, Yellow, Pink.

**Brands (launch):** Apple, Samsung, Google Pixel, OnePlus, Xiaomi, Redmi, Poco, Oppo, Vivo, Realme, Tecno, Infinix, Huawei, Motorola, Nokia, Sony, Other.
- Redmi and Poco appear as separate brands in the UI but have `parent_brand_id = Xiaomi`, so a search for "Xiaomi" can include them.
- **Other brands:** free-text brand + model; listing goes to moderation.

**Model record:** name, slug, release year, image, `specs` JSON (display, chipset, battery mAh, cameras, 5G, eSIM, dual SIM), `supports_battery_health`, popularity score.

**Model aliases:** a table of Pakistani shorthand so search understands people: `13 pm` → iPhone 13 Pro Max, `s23u` → Galaxy S23 Ultra, `note 13` → Redmi Note 13.

**Scalability:** brands, models, variants, colours and aliases are all **data managed in the admin panel** (plus CSV import). Adding a new phone never needs a code change.

**Seeding plan:** a hand-curated list of the ~250 most traded models in Pakistan over the last 5 years, entered through CSV. **Do not scrape third-party spec sites** without permission.

---

## 6. PTA & Network Status Model (Critical)

A phone's PTA situation is two separate facts. Mixing them up is exactly how buyers get misled.

### 6.1 Field 1: `pta_status`
| Value | Buyer-facing label | Badge | Explanation shown to buyers |
|-------|-------------------|-------|----------------------------|
| `pta_approved` | PTA Approved | ✅ green | The phone's IMEI is registered with PTA and shows **"Compliant"** in DIRBS. It works on all Pakistani networks with no time limit. |
| `non_pta` | Non-PTA | ⚠️ amber | The IMEI is **not registered** with PTA. A local SIM works only for a limited period (currently about 60 days from first use), after which the phone is blocked on Pakistani networks unless the PTA tax is paid and the phone is registered through DIRBS. Wi-Fi keeps working. |
| `cpid_patched` | CPID / Patched: **NOT PTA approved** | ⛔ red | The IMEI has been changed or "patched" through an unofficial method to look approved. **This is not PTA approval.** These phones can be blocked at any time, and IMEI tampering is illegal in Pakistan. A DIRBS check often shows a different phone model than the one in hand. |
| `unknown` | Not verified | ❔ grey/amber | The seller hasn't confirmed the status. Check it yourself before paying (see 6.4). |

**Optional sub-field when `pta_approved`:** `pta_reg_type` = `official_import` (box-pack/brand warranty) | `individual_tax_paid` (owner paid the tax) | `unknown`.

### 6.2 Field 2: `network_lock`
| Value | Label | Explanation |
|-------|-------|-------------|
| `factory_unlocked` | Factory Unlocked (FU) | Works with any carrier's SIM; whether it works on Pakistani networks still depends on PTA status. |
| `carrier_locked` | Carrier Locked | Locked to a foreign carrier. It won't accept Pakistani SIMs unless officially unlocked. |
| `jv` | JV (iPhone) | A carrier-locked iPhone made to work through an unofficial SIM-unlock method (chip or eSIM workaround). It is not PTA approved, generally can't be registered in the normal way, and network service can be unstable or stop after software updates. |
| `unknown` | Not sure | — |

### 6.3 Hard rules (enforced in DB + app)
1. `network_lock = 'jv'` ⇒ brand must be Apple **and** `pta_status ≠ 'pta_approved'`.
2. `cpid_patched` listings: red banner on the listing page, **never featurable or promotable**, excluded from "Best Deals", and hidden entirely when `app_settings.allow_cpid_listings = false` (kill switch).
3. The combined badge shows both fields, e.g. `Non-PTA · JV` or `PTA Approved · FU`.
4. `pta_check_source` is `seller_declared` by default. It becomes `daam_checked` **only** after a moderator has personally checked the IMEI on PTA's official DVS and confirmed the model name matches. Badge copy: *"PTA status checked by Daam on 12 Nov 2026"*. The check expires after 30 days.
5. **We never say "IMEI verified"** unless rule 4 has actually happened. Seller-declared status is always labelled *"Seller says"*.
6. All PTA explainer copy lives in the database (`content_blocks`) so it can be updated without a redeploy when PTA rules change.

### 6.4 "Check before you pay" (buyer flow + PTA Info page)
1. Dial `*#06#` on the phone to see its IMEI(s). **Dual-SIM phones have two, so check both.**
2. Check each 15-digit IMEI through an official PTA channel:
   - SMS the IMEI to **8484**, or
   - use PTA's **DVS website** (dvs.pta.gov.pk) or the official **DVS app**, or
   - dial `*8484#`.
3. Confirm the result says **Compliant** **and** that the model name matches the phone in your hand. A mismatch is the classic sign of a patched/CPID phone.
4. Confirm the IMEI on the box matches the phone.
5. Never pay, or send a "token"/advance payment, before doing all of this.

The PTA Info page links **only** to official PTA/DIRBS channels.

---

## 7. Condition Grades & Specifications

### 7.1 Condition grades
| Value | Label | Definition |
|-------|-------|-----------|
| `brand_new` | Brand New | Sealed box, never activated |
| `open_box` | Open Box | Box opened, unused or barely used, all accessories |
| `like_new` | Like New (10/10) | No visible marks under normal light; fully functional |
| `grade_9` | 9/10 | Very faint marks visible only up close; fully functional |
| `grade_8` | 8/10 | Light visible scratches or scuffs; fully functional |
| `grade_7` | 7/10 | Clear scratches or small dents; fully functional |
| `used` | Used (6/10 or below) | Heavy wear; may have minor functional issues (must be listed) |
| `refurbished` | Refurbished | Restored by a shop or refurbisher; parts may be replaced (must be listed) |
| `for_parts` | For Parts / Repair | Major fault; sold for repair or parts |

### 7.2 Specification fields
| Field | Type | Rule |
|-------|------|------|
| Variant (RAM/storage) | FK | Required (auto-filled from model) |
| Colour | FK | Optional |
| Battery health % | 0–100 | **Required for iPhones** unless `brand_new`/`open_box`; optional elsewhere |
| Screen condition | enum | Required: flawless / minor scratches / visible scratches / cracked / replaced |
| Body condition | enum | Required: flawless / minor marks / visible marks / dents or cracks |
| Box | enum | Required: box with matching IMEI / box, IMEI doesn't match / no box |
| Accessories | multi | Charger, cable, case, earphones, original receipt |
| Warranty | enum + months | None / official brand / shop / other, plus months left |
| Repair history | multi | None, screen, battery, back glass, camera, charging port, motherboard, other |
| Functional issues | multi | Face ID/Touch ID not working, True Tone missing, speaker, mic, camera, network, none |
| Purchase month | month | Optional |

---

## 8. Sell Wizard (Listing Creation)

14 separate steps would lose non-technical users. We **group them into 6 screens** with a progress bar, autosave and big tap targets.

| Screen | Contents | Smart features |
|--------|----------|----------------|
| 1. Your phone | Brand → Model → Variant → Colour | Image tiles for popular brands, search with aliases ("13 pm"), auto-fills specs |
| 2. PTA & network | `pta_status`, `network_lock`, IMEI(s) | Explainer cards for each option; JV option only for Apple; IMEI Luhn check; "never shown publicly" note |
| 3. Condition | Grade picker with a visual guide, battery health, screen, body, repairs, issues | Battery field appears only when relevant; "how to check battery health" helper |
| 4. Box & extras | Box, accessories, warranty, purchase month | One-tap chips |
| 5. Photos | 3–10 photos | Guided shots (front with screen on, back, sides, Settings → About screen, battery-health screenshot for iPhone); drag-and-drop ordering; first photo is the cover; compressed in the browser to WebP ≤1600px; **EXIF/GPS data stripped** |
| 6. Price & location | Price, negotiable toggle, city → area, description, contact preferences | **Live Daam Meter** as the price is typed; description chips ("PTA approved", "No repairs"); WhatsApp/call toggles |
| → Preview | Exact listing card + detail preview | Completion score shown ("Add 2 more photos to reach 100%") |
| → Publish | Goes to `pending_review` during launch, otherwise `active` | Animated "stamp" success state + share to WhatsApp |

**Also included:** save as draft (autosave after every screen), edit, delete, mark as sold (asks "Sold on Daam to [pick buyer from chats] / sold elsewhere"), renew after 30-day expiry, and validation through shared Zod schemas on client and server.

**IMEI is required for every listing.** It is never public. It powers duplicate detection, stolen-device checks and moderator PTA checks. Listings show "IMEI on file · ••••1234".

---

## 9. Search, Filters & Sorting

**Filters:** brand, model, variant (storage/RAM), price range, PTA status, network lock, city/area, battery health (≥80/85/90/95), condition, colour, seller type (individual/verified shop), warranty (yes/no), box available, date listed (24h/7d/30d), "IMEI on file", "PTA checked by Daam".

**Sorting:** Most relevant (default with a query), Recently listed (default without one), Lowest price, Highest price, **Best deals** (Daam Meter score; excludes CPID and unknown PTA).

**UX**
- Filters live in the URL (shareable, back-button safe); bottom sheet on mobile, sidebar on desktop.
- Facet counts update instantly; active filters show as removable chips.
- Search suggestions in 3 groups: models, brands, recent searches.
- Zero results suggest relaxing filters plus a "save this search" CTA (later).

**Implementation:** Postgres full-text (`tsvector`) + `pg_trgm` fuzzy matching + the alias table + composite indexes, all inside Supabase. **Upgrade path:** move to Meilisearch or Typesense when active listings pass ~50k or p95 search latency exceeds 300ms.

---

## 10. Daam Meter (Price Intelligence)

**What it is:** a badge on every listing that says whether the price is good.

**How it works**
1. **Comparable set:** same `variant_id` + same PTA group (approved vs. non-approved) + same condition band (new / excellent [like_new, grade_9] / good [grade_8, grade_7] / fair [used, refurbished]) + active or sold in the last 60 days + not flagged.
2. With **≥ 5 comparables**, compute the median, p25 and p75.
3. With fewer than 5, fall back to the **admin reference price table** (`price_references`), which the team updates weekly from market checks.
4. Bands:
   - **Great daam:** below p25 (lime chip)
   - **Fair daam:** p25–p75 (neutral chip)
   - **Above market:** above p75 (slate chip)
   - **Not enough data:** no chip, or "New model" text
5. **Scam guard:** a price under 50% of the median sends the listing to `on_hold` for moderator review (classic scam bait).
6. Recomputed when a listing is published or its price changes, plus nightly for all active listings (`pg_cron`).

**Where it shows:** listing cards, the listing page (with a "Typical price: Rs X – Y" range), the sell wizard (live), and model pages (price guide).

---

## 11. Trust & Safety System

| Layer | Mechanism |
|-------|-----------|
| Identity | Phone OTP (Pakistani numbers only), one account per number, optional CNIC verification, shop verification, admin MFA |
| IMEI integrity | AES-256-GCM encryption at rest; HMAC-SHA256 hash (secret pepper) for lookups; only last 4 public; a duplicate hash on another user's active listing triggers auto-hold |
| Stolen devices | Users report stolen phones (IMEI + optional police report reference); the hash goes into a registry; any listing match triggers auto-hold + admin review; warning on the PTA page |
| Image integrity | Perceptual hash (pHash) of every photo; matches against another user's listing are flagged as possibly stolen photos |
| Price anomalies | Daam Meter scam guard (<50% of median triggers hold) |
| Moderation | Pre-moderation of all listings at launch (SLA under 2h, 10am–10pm); then risk-based (new accounts, flagged keywords, anomalies) |
| Chat safety | Keyword and pattern detection ("advance", "token money", "Easypaisa first", "courier/COD" on high-value phones, outside links) shows a warning card in chat; repeat offenders are flagged |
| Abuse limits | Rate limits (listings/day, messages/minute, OTP/hour), Cloudflare Turnstile on signup/post/report |
| Anti-scraping | Phone numbers revealed only to logged-in users, one per click, logged and rate-limited; numbers never in page HTML |
| Community | Report listing/user/message (reason enum), block user, reviews only from real deals |
| Reviews | Allowed only when the seller marks a listing sold to a specific buyer from their chats; both sides then get a review prompt |
| Shop accountability | 3 confirmed strikes = suspension; strike history visible to admins |
| Education | Safety page, safe-meetup card in every chat, PTA "check before you pay" flow |
| Audit | Every admin/moderator action logged with before/after state |

**Safe meetup recommendations (shown in chat):** meet in public places (malls, markets, busy cafés) in daylight; bring someone along; check the IMEI on 8484 and confirm the model matches before paying; test calls, camera, Face ID/fingerprint, charging and speakers; never send advance or "token" money; prefer verified shops for high-value phones.

---

## 12. Pakistan-Specific Features

- **Currency:** PKR, integer rupees only. Display `Rs 125,000`; short form on cards `Rs 1.25 lac`. One shared `formatPKR()` helper.
- **Phone numbers:** accept `03XXXXXXXXX` or `+923XXXXXXXXX`; store as E.164 `+923XXXXXXXXX`. Regex: `^(?:\+92|0)3\d{9}$`.
- **WhatsApp:** `https://wa.me/92XXXXXXXXXX?text=` prefilled with "Assalam o Alaikum, I saw your [model] on Daam: [link]".
- **Cities (seed):** Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Gujranwala, Sialkot, Peshawar, Quetta, Hyderabad, Sargodha, Bahawalpur, Sukkur, Abbottabad, Mardan, Sahiwal, Gujrat, Jhelum, Mandi Bahauddin, Sheikhupura, Rahim Yar Khan, Okara, Kasur, Dera Ghazi Khan, Larkana, Mirpur (AJK), Muzaffarabad, Gilgit. Seed areas for major cities, starting with Lahore.
- **Languages:** English + Urdu (RTL) via `next-intl`; language switcher in the header; Urdu routes under `/ur`.
- **Performance for budget Androids on 4G:** LCP < 2.5s, JS per route < 200KB gzipped, lazy images, skeletons.
- **Reviews, reports, suspicious-seller reporting:** see Section 11.

---

## 13. UI/UX Design System

### 13.1 Principles
1. **Truth is visible.** PTA, condition, battery and Daam Meter appear on every card, not buried.
2. **Clarity over decoration.** Whitespace, hierarchy and type do the heavy lifting.
3. **Calm motion.** Animation explains; it never shows off.
4. **Thumb-first.** Primary actions sit in the bottom half on mobile; tap targets ≥ 44px.
5. **Respect the user's data.** Light pages, compressed images, no autoplay video.

### 13.2 Layout
- 4px spacing base (Tailwind default scale).
- Container max 1280px; content padding 16px mobile / 24px tablet / 32px desktop.
- Listing grid: 2 columns mobile, 3 tablet, 4 desktop; gap 12–16px.

### 13.3 Listing card anatomy (top to bottom)
1. Photo (4:5), favourite heart top-right, "Featured" clipped-corner tag top-left (if promoted)
2. **Price** in Geist Mono, large, plus the Daam Meter chip
3. Model + variant ("iPhone 14 Pro · 256GB")
4. Badge row: PTA badge · condition chip · battery % (if present)
5. Footer: area, city · time ago · Verified Shop/ID badge

### 13.4 Core components
`Button` (primary lime/ink, secondary, ghost, destructive), `PriceTag`, `PtaBadge`, `NetworkLockBadge`, `ConditionChip`, `BatteryPill`, `DaamMeter`, `VerifiedBadge`, `ListingCard`, `ListingCardSkeleton`, `ListingGallery`, `SpecTable`, `FilterSheet`, `FilterChips`, `BrandTile`, `ModelPicker`, `WizardStepper`, `PhotoUploader`, `ChatThread`, `MessageBubble`, `SafetyCard`, `EmptyState`, `StatCard` (admin), `DataTable` (admin), `Toast`, `Dialog`/`Drawer`.

### 13.5 States
- **Empty states:** a friendly illustration in a line style + one-line copy + a single CTA (e.g., "No favourites yet. Tap ♡ on phones you like.").
- **Loading:** skeletons shaped like the real content; never spinners for page content.
- **Errors:** plain language plus a retry action; never raw error codes.

---

## 14. Motion Design System

**Libraries:** Motion for React (`motion/react`) for UI; plain CSS transitions for simple hovers; GSAP + ScrollTrigger **only** on the homepage hero if Motion can't do the effect. **No scroll-jacking or smooth-scroll libraries.**

**Tokens**
| Token | Value |
|-------|-------|
| `duration-fast` | 120ms (hover, press) |
| `duration-base` | 200ms (chips, toggles) |
| `duration-slow` | 320ms (drawers, modals) |
| `duration-hero` | 500–700ms (hero, success) |
| `ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` |
| `ease-emphasized` | `cubic-bezier(0.3, 0, 0, 1)` |
| `spring-snappy` | stiffness 400, damping 30 |

**Patterns**
- **Hero:** a floating phone render with a price tag that swings gently on load; subtle parallax (≤ 12px) on pointer move, desktop only.
- **Card reveals:** fade + 8px rise, staggered 30ms, at most 8 cards animated per batch; triggered once via IntersectionObserver.
- **Card hover (desktop):** image scale 1.03, shadow lift, second photo crossfade.
- **Filters:** results re-layout with `layout` + `AnimatePresence`; chips pop in with a spring.
- **Page transitions:** a short fade/slide (≤ 200ms) through a route template; no full-page blocking animations.
- **Magnetic buttons:** primary hero CTAs only, `pointer: fine` devices only.
- **Sell wizard:** horizontal slide between screens; the progress bar animates width.
- **Daam Meter:** the needle/chip animates when the price changes.
- **Modals/drawers:** scale 0.98→1 + fade; bottom sheets slide up on mobile.
- **Success:** a "stamp" animation (tag stamps "LISTED") + a light haptic-style bounce.
- **Loading:** skeleton shimmer (CSS gradient, paused under reduced motion).

**Rules:** animate only `transform` and `opacity`. Respect `prefers-reduced-motion` (`useReducedMotion()` + CSS media query → opacity-only, no parallax, no stagger). Hold 60fps on a mid-range Android, and test with CPU throttled 4×.

---

## 15. Sitemap & Pages

| # | Page | Route | MVP |
|---|------|-------|-----|
| 1 | Homepage | `/` | ✅ |
| 2 | Browse all phones / search results | `/phones` | ✅ |
| 3 | All brands | `/brands` | ✅ |
| 4 | Brand page | `/phones/[brand]` | ✅ |
| 5 | Model page (with price guide) | `/phones/[brand]/[model]` | ✅ |
| 6 | City landing | `/[city]/phones` (+ brand/model nesting) | ✅ (SEO) |
| 7 | Listing detail | `/listing/[slug]-[shortId]` | ✅ |
| 8 | Sell your phone (wizard) | `/sell` | ✅ |
| 9 | Seller profile (individual) | `/u/[username]` | ✅ |
| 10 | Shop storefront | `/shop/[slug]` | ✅ |
| 11 | User dashboard | `/dashboard` | ✅ |
| 12 | My listings | `/dashboard/listings` | ✅ |
| 13 | Favourites | `/dashboard/favorites` | ✅ |
| 14 | Messages | `/messages`, `/messages/[id]` | ✅ |
| 15 | Notifications | `/notifications` | ✅ |
| 16 | Login / signup (phone OTP) | `/login` | ✅ |
| 17 | Profile & settings | `/dashboard/settings` | ✅ |
| 18 | Get verified (ID / shop) | `/dashboard/verify` | ✅ |
| 19 | Shop dashboard (stats, listings) | `/dashboard/shop` | ✅ |
| 20 | PTA info + "check before you pay" | `/pta-guide` | ✅ |
| 21 | Safety guidelines | `/safety` | ✅ |
| 22 | About | `/about` | ✅ |
| 23 | Contact | `/contact` | ✅ |
| 24 | Help centre (FAQ) | `/help` | ✅ |
| 25 | Terms of service | `/terms` | ✅ |
| 26 | Privacy policy | `/privacy` | ✅ |
| 27 | Prohibited items & listing policy | `/policies/listings` | ✅ |
| 28 | Shop plans & pricing | `/for-shops` | ✅ (plans shown as "coming soon") |
| 29 | Report stolen phone | `/report-stolen` | ✅ |
| 30 | Admin dashboard | `/admin/*` | ✅ |
| 31 | 404 / 500 / offline | — | ✅ |
| 32 | Guides / blog | `/guides/[slug]` | Later |
| 33 | Compare phones | `/compare` | Later |
| 34 | Saved searches & alerts | `/dashboard/alerts` | Later |

---

## 16. Technical Architecture

### 16.1 Stack & reasoning
| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js (latest stable, App Router)** | SEO-critical marketplace: server rendering, ISR, metadata API, image optimisation; best-supported React framework |
| Language | **TypeScript (strict)** | Fewer bugs; types generated from the DB keep frontend and backend in sync |
| Styling | **Tailwind CSS v4** | Design tokens via `@theme`; fast iteration; consistent spacing |
| Components | **shadcn/ui** (Radix-based) | Accessible primitives we own and restyle; no vendor lock |
| Motion | **Motion for React** (+ GSAP only if needed) | Declarative, layout animations, reduced-motion support |
| Database | **Supabase Postgres** | Relational data (catalog → listings) fits SQL; RLS security; FTS + trigram search built in |
| Auth | **Supabase Auth: phone OTP** | Phone-first for Pakistan; Send-SMS hook allows a local Pakistani SMS gateway or WhatsApp OTP |
| Storage | **Supabase Storage** | Public bucket for listing photos, private bucket for verification documents |
| Realtime | **Supabase Realtime** | Chat and live notifications without extra infrastructure |
| Jobs | **pg_cron + Supabase Edge Functions** | Expiry, Daam Meter recompute, doc purge, notification fan-out |
| Forms/validation | **React Hook Form + Zod** | One schema shared by client and server |
| URL state | **nuqs** | Type-safe filter state in the URL |
| i18n | **next-intl** | en/ur, RTL, localised routing |
| Hosting | **Vercel** (functions region near the DB) + **Supabase region: Mumbai (ap-south-1)** | Lowest latency to Pakistan among standard regions |
| Email | **Resend** | Transactional email (verification results, digests) |
| Bot protection | **Cloudflare Turnstile** | Free and privacy-friendly |
| Errors | **Sentry** | Error + performance monitoring |
| Analytics | **PostHog** (product) + Vercel Analytics (web vitals) | Funnels: browse → contact; sell wizard drop-off |
| Rate limiting | **Upstash Redis** (`@upstash/ratelimit`) | Simple, serverless-friendly |
| Testing | **Vitest** (unit), **Playwright** (e2e), **pgTAP / SQL tests** (RLS) | Covers logic, flows and security |

**Deliberately not used at MVP:** microservices, a separate backend server, Kubernetes, GraphQL, a separate search engine, a native mobile app. All can come later without a rewrite.

### 16.2 Architecture
```
Browser (Next.js RSC + client islands)
  │
  ├─ Read pages (home, browse, model, listing) → React Server Components → Supabase (RLS, anon key) → cached/ISR
  ├─ Mutations (create listing, chat, report) → Server Actions (Zod) → Supabase (user session, RLS)
  ├─ Privileged ops (IMEI encrypt/hash, admin actions, pHash) → server-only modules (service role) — never shipped to client
  ├─ Realtime (chat, notifications) → Supabase Realtime channels (RLS-filtered)
  └─ Uploads → client compress → signed upload to Supabase Storage → server records + pHash
Background: pg_cron → expire listings, recompute Daam Meter, purge CNIC docs, digest emails
```

### 16.3 Folder structure
```
/app
  /[locale]
    /(marketing)        home, about, pta-guide, safety, help, for-shops, policies
    /(browse)           phones, brands, [city], listing/[slugId], shop/[slug], u/[username]
    /(auth)             login
    /(app)              sell, dashboard/*, messages/*, notifications
    /admin              admin/* (role-guarded)
  /api                  webhooks, og images, sitemap pieces
/components
  /ui                   shadcn primitives
  /daam                 brand components (PriceTag, PtaBadge, DaamMeter, ListingCard…)
  /admin
/lib
  /supabase             server.ts, client.ts, admin.ts (service role, server-only)
  /validation           zod schemas (shared)
  /domain               pta.ts, condition.ts, daam-meter.ts, pricing.ts, phone.ts
  /security             imei.ts (encrypt/hash), ratelimit.ts, turnstile.ts
  /i18n
/messages               en.json, ur.json
/supabase
  /migrations
  /seed                 brands.csv, models.csv, variants.csv, cities.csv, areas.csv
  /tests                rls tests
/docs                   DAAM_MASTER_PLAN.md, PHASE_PROMPTS.md
/e2e                    playwright
```

### 16.4 SEO strategy
- **Model pages = price guides:** "Used iPhone 13 price in Pakistan" with live median prices by PTA status and condition (from the Daam Meter). This is the biggest organic traffic lever.
- **City × model pages:** `/lahore/phones/apple/iphone-13`.
- JSON-LD: `Product` + `Offer` (price, condition, availability) on listings; `ItemList` on browse/model pages; `Organization` + `WebSite` (with SearchAction) on the homepage; `FAQPage` on the PTA guide.
- Dynamic metadata, canonical URLs, `hreflang` en/ur, sitemaps split by type (static, brands, models, cities, listings), clean slugs, OG images generated with `next/og` in the price-tag style.
- Sold/expired listings: keep the page for 30 days with a "Sold" banner and similar phones, then `410 Gone`.

### 16.5 Security checklist
- RLS on **every** table; deny-by-default policies; RLS tests in CI.
- The service-role key is used only in `server-only` modules.
- IMEI: AES-256-GCM (key from env `IMEI_ENC_KEY`), HMAC hash with `IMEI_HASH_PEPPER`; never logged.
- Descriptions and messages rendered as plain text (no HTML); strict CSP; security headers.
- Uploads: MIME sniffing, size ≤ 10MB before compression, max 10 images, images re-encoded server-side.
- Turnstile + rate limits on OTP, signup, post, report, message, contact reveal.
- Admin: MFA (TOTP) required; IP and action audit log.
- Backups: daily (point-in-time recovery once on a paid plan); restore drill before launch.
- Secrets only in Vercel/Supabase env; `.env.local` gitignored; dependency scanning (Dependabot/`npm audit`).

### 16.6 Scalability path
Indexes from day 1 → read caching (ISR + `revalidateTag`) → Meilisearch/Typesense for search → image CDN transforms → a queue for notifications → read replicas → native app (Expo) on the same Supabase backend.

---

## 17. Database Schema

Starting-point DDL. Claude Code turns this into migrations, adds RLS policies (17.3) and generates TypeScript types.

### 17.1 Enums
```sql
create extension if not exists pg_trgm;
create extension if not exists citext;

create type user_role            as enum ('user','support','moderator','admin','super_admin');
create type account_type         as enum ('individual','shop');
create type verification_kind    as enum ('individual_id','shop');
create type verification_status  as enum ('pending','approved','rejected','needs_more_info');
create type shop_tier            as enum ('none','verified','trusted');
create type shop_plan            as enum ('free','pro','elite');
create type pta_status           as enum ('pta_approved','non_pta','cpid_patched','unknown');
create type network_lock         as enum ('factory_unlocked','carrier_locked','jv','unknown');
create type pta_reg_type         as enum ('official_import','individual_tax_paid','unknown');
create type pta_check_source     as enum ('seller_declared','daam_checked');
create type phone_condition      as enum ('brand_new','open_box','like_new','grade_9','grade_8','grade_7','used','refurbished','for_parts');
create type screen_condition     as enum ('flawless','minor_scratches','visible_scratches','cracked','replaced');
create type body_condition       as enum ('flawless','minor_marks','visible_marks','dents_or_cracks');
create type box_status           as enum ('box_matching_imei','box_not_matching','no_box');
create type warranty_type        as enum ('none','official_brand','shop','other');
create type listing_status       as enum ('draft','pending_review','active','on_hold','sold','expired','rejected','removed');
create type daam_band            as enum ('great','fair','high','unknown');
create type sold_via             as enum ('daam','elsewhere');
create type report_target        as enum ('listing','user','message');
create type report_reason        as enum ('fake_listing','wrong_pta_status','stolen_device','scam_or_fraud','misleading_price','duplicate','offensive','prohibited_item','other');
create type report_status        as enum ('open','reviewing','actioned','dismissed');
create type message_kind         as enum ('text','image','offer','system','safety');
create type promo_type           as enum ('featured','bump','city_top');
create type payment_method       as enum ('jazzcash','easypaisa','bank_transfer','card','manual');
create type payment_status       as enum ('pending','confirmed','rejected','refunded');
create type payment_purpose      as enum ('promotion','subscription');
```

### 17.2 Tables
```sql
-- Locations
create table cities (
  id smallserial primary key,
  name_en text not null, name_ur text not null,
  slug text unique not null, province text not null,
  is_major boolean default false, sort_order int default 100
);
create table areas (
  id serial primary key,
  city_id smallint not null references cities(id),
  name_en text not null, name_ur text,
  slug text not null, unique (city_id, slug)
);

-- Users
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username citext unique,
  display_name text not null,
  avatar_url text,
  phone_e164 text unique not null,
  phone_verified_at timestamptz,
  account_type account_type not null default 'individual',
  role user_role not null default 'user',
  city_id smallint references cities(id),
  area_id int references areas(id),
  bio text,
  whatsapp_enabled boolean default true,
  id_verified_at timestamptz,
  cnic_last4 text,
  is_suspended boolean default false,
  suspended_reason text,
  strikes smallint default 0,
  rating_avg numeric(2,1) default 0,
  rating_count int default 0,
  locale text default 'en' check (locale in ('en','ur')),
  last_seen_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table shops (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid unique not null references profiles(id) on delete cascade,
  name text not null, slug citext unique not null,
  logo_url text, cover_url text, description text,
  market_name text,                      -- e.g. 'Hafeez Centre'
  address text not null,
  city_id smallint not null references cities(id),
  area_id int references areas(id),
  lat double precision, lng double precision, maps_url text,
  phone_e164 text, whatsapp_e164 text,
  opening_hours jsonb,
  tier shop_tier not null default 'none',
  verified_at timestamptz,
  plan shop_plan not null default 'free',
  plan_expires_at timestamptz,
  is_founding_shop boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table verification_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  shop_id uuid references shops(id) on delete cascade,
  kind verification_kind not null,
  status verification_status not null default 'pending',
  documents jsonb not null,              -- private storage paths
  cnic_last4 text,
  reviewer_id uuid references profiles(id),
  reviewed_at timestamptz,
  decision_note text,
  docs_purge_after timestamptz,          -- reviewed_at + 30 days
  created_at timestamptz default now()
);

-- Catalog
create table brands (
  id serial primary key,
  name text not null, slug citext unique not null,
  parent_brand_id int references brands(id),
  logo_url text, sort_order int default 100,
  is_active boolean default true
);
create table series (
  id serial primary key,
  brand_id int not null references brands(id),
  name text not null, slug citext not null,
  unique (brand_id, slug)
);
create table models (
  id serial primary key,
  brand_id int not null references brands(id),
  series_id int references series(id),
  name text not null, slug citext not null,
  release_year smallint,
  image_url text,
  specs jsonb default '{}'::jsonb,
  supports_battery_health boolean default false,
  popularity int default 0,
  is_active boolean default true,
  unique (brand_id, slug)
);
create table model_aliases (
  id serial primary key,
  model_id int not null references models(id) on delete cascade,
  alias citext not null, unique (model_id, alias)
);
create table model_variants (
  id serial primary key,
  model_id int not null references models(id) on delete cascade,
  ram_gb smallint,                       -- null for iPhones (not shown)
  storage_gb smallint not null,
  is_active boolean default true,
  unique (model_id, ram_gb, storage_gb)
);
create table model_colors (
  id serial primary key,
  model_id int not null references models(id) on delete cascade,
  name text not null, hex text
);

-- Listings
create table listings (
  id uuid primary key default gen_random_uuid(),
  short_id text unique not null,         -- nanoid(8)
  slug text not null,
  seller_id uuid not null references profiles(id) on delete cascade,
  shop_id uuid references shops(id) on delete set null,
  status listing_status not null default 'draft',

  brand_id int references brands(id),
  model_id int references models(id),
  variant_id int references model_variants(id),
  color_id int references model_colors(id),
  custom_brand text, custom_model text,  -- 'Other' brand only
  title text not null,                   -- generated server-side
  description text check (char_length(description) <= 2000),

  price_pkr int not null check (price_pkr between 1000 and 2000000),
  is_negotiable boolean default true,

  pta_status pta_status not null default 'unknown',
  network_lock network_lock not null default 'unknown',
  pta_reg_type pta_reg_type,
  pta_check_source pta_check_source not null default 'seller_declared',
  pta_checked_at timestamptz,
  pta_checked_by uuid references profiles(id),
  imei_last4 text,

  condition phone_condition not null,
  battery_health smallint check (battery_health between 0 and 100),
  screen_condition screen_condition,
  body_condition body_condition,
  box_status box_status,
  accessories text[] default '{}',
  warranty_type warranty_type default 'none',
  warranty_months_left smallint,
  repair_history text[] default '{}',
  functional_issues text[] default '{}',
  purchase_month date,

  city_id smallint references cities(id),
  area_id int references areas(id),
  contact_chat boolean default true,
  contact_whatsapp boolean default true,
  contact_call boolean default true,

  cover_image_path text,
  image_count smallint default 0,
  completion_score smallint default 0,

  daam_band daam_band default 'unknown',
  daam_median_pkr int,
  daam_p25_pkr int, daam_p75_pkr int,
  daam_computed_at timestamptz,

  view_count int default 0,
  favorite_count int default 0,
  contact_count int default 0,

  is_featured boolean default false,
  featured_until timestamptz,
  bumped_at timestamptz,

  published_at timestamptz,
  expires_at timestamptz,
  sold_at timestamptz,
  sold_via sold_via,
  buyer_id uuid references profiles(id),
  moderation_note text,
  hold_reasons text[] default '{}',

  search_vector tsvector,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  constraint jv_never_pta_approved check (network_lock <> 'jv' or pta_status <> 'pta_approved'),
  constraint cpid_never_featured check (pta_status <> 'cpid_patched' or is_featured = false)
);
create index listings_active_recent on listings (published_at desc) where status = 'active';
create index listings_model_variant on listings (model_id, variant_id) where status = 'active';
create index listings_city on listings (city_id) where status = 'active';
create index listings_price on listings (price_pkr) where status = 'active';
create index listings_filters on listings (pta_status, condition, network_lock) where status = 'active';
create index listings_seller on listings (seller_id, status);
create index listings_search on listings using gin (search_vector);

-- Private IMEI data (no client access at all; server/service role only)
create table listing_private (
  listing_id uuid primary key references listings(id) on delete cascade,
  imei1_enc bytea not null, imei1_hash text not null,
  imei2_enc bytea, imei2_hash text,
  created_at timestamptz default now()
);
create index listing_private_imei1 on listing_private (imei1_hash);
create index listing_private_imei2 on listing_private (imei2_hash);

create table listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  storage_path text not null,
  width int, height int,
  sort_order smallint not null default 0,
  phash text,
  created_at timestamptz default now()
);
create index listing_images_listing on listing_images (listing_id, sort_order);
create index listing_images_phash on listing_images (phash);

-- Engagement
create table favorites (
  user_id uuid references profiles(id) on delete cascade,
  listing_id uuid references listings(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, listing_id)
);

create table conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  buyer_id uuid not null references profiles(id) on delete cascade,
  seller_id uuid not null references profiles(id) on delete cascade,
  last_message_at timestamptz default now(),
  last_message_preview text,
  buyer_unread int default 0, seller_unread int default 0,
  is_archived_buyer boolean default false, is_archived_seller boolean default false,
  created_at timestamptz default now(),
  unique (listing_id, buyer_id)
);
create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid references profiles(id),           -- null for system/safety
  kind message_kind not null default 'text',
  body text check (char_length(body) <= 2000),
  offer_pkr int,
  attachment_path text,
  flagged boolean default false,
  flag_reasons text[] default '{}',
  read_at timestamptz,
  created_at timestamptz default now()
);
create index messages_conversation on messages (conversation_id, created_at);

create table contact_reveals (
  id bigserial primary key,
  listing_id uuid not null references listings(id) on delete cascade,
  viewer_id uuid not null references profiles(id) on delete cascade,
  channel text not null check (channel in ('call','whatsapp')),
  created_at timestamptz default now()
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  reviewer_id uuid not null references profiles(id) on delete cascade,
  reviewee_id uuid not null references profiles(id) on delete cascade,
  direction text not null check (direction in ('buyer_to_seller','seller_to_buyer')),
  rating smallint not null check (rating between 1 and 5),
  tags text[] default '{}',              -- 'as_described','on_time','fair_price'…
  comment text check (char_length(comment) <= 1000),
  is_hidden boolean default false,
  created_at timestamptz default now(),
  unique (listing_id, reviewer_id)
);

-- Safety
create table reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references profiles(id) on delete cascade,
  target_type report_target not null,
  listing_id uuid references listings(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  message_id uuid references messages(id) on delete cascade,
  reason report_reason not null,
  details text check (char_length(details) <= 1000),
  status report_status not null default 'open',
  handled_by uuid references profiles(id),
  handled_at timestamptz,
  resolution_note text,
  created_at timestamptz default now()
);
create table blocks (
  blocker_id uuid references profiles(id) on delete cascade,
  blocked_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (blocker_id, blocked_id)
);
create table stolen_device_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references profiles(id) on delete cascade,
  imei_hash text not null, imei_last4 text not null,
  brand_id int references brands(id), model_id int references models(id),
  police_report_ref text, details text,
  status text not null default 'pending' check (status in ('pending','confirmed','rejected')),
  created_at timestamptz default now()
);
create index stolen_imei on stolen_device_reports (imei_hash) where status <> 'rejected';

-- Notifications
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  type text not null,                    -- 'new_message','listing_approved','listing_rejected','listing_expiring','price_drop','review_received','verification_result','report_update'
  title text not null, body text,
  link text, data jsonb default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz default now()
);
create index notifications_user on notifications (user_id, created_at desc);

-- Pricing & monetisation
create table price_references (
  id serial primary key,
  variant_id int not null references model_variants(id) on delete cascade,
  pta_group text not null check (pta_group in ('approved','not_approved')),
  condition_band text not null check (condition_band in ('new','excellent','good','fair')),
  low_pkr int not null, typical_pkr int not null, high_pkr int not null,
  source_note text,
  updated_by uuid references profiles(id),
  updated_at timestamptz default now(),
  unique (variant_id, pta_group, condition_band)
);
create table payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id),
  purpose payment_purpose not null,
  amount_pkr int not null check (amount_pkr > 0),
  method payment_method not null,
  reference text, proof_path text,
  status payment_status not null default 'pending',
  reviewed_by uuid references profiles(id), reviewed_at timestamptz,
  created_at timestamptz default now()
);
create table promotions (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  type promo_type not null,
  starts_at timestamptz not null, ends_at timestamptz not null,
  payment_id uuid references payments(id),
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- Platform
create table content_blocks (            -- editable copy: PTA explainers, safety tips, banners
  key text primary key,
  body_en text not null, body_ur text,
  updated_by uuid references profiles(id),
  updated_at timestamptz default now()
);
create table app_settings (
  key text primary key,
  value jsonb not null,                  -- allow_cpid_listings, max_free_listings_individual, premoderation_enabled, scam_price_ratio…
  updated_by uuid references profiles(id),
  updated_at timestamptz default now()
);
create table audit_log (
  id bigserial primary key,
  actor_id uuid references profiles(id),
  action text not null,                  -- 'listing.reject','user.suspend','shop.verify'…
  target_type text not null, target_id text not null,
  before jsonb, after jsonb,
  ip inet,
  created_at timestamptz default now()
);
create table saved_searches (            -- Later
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  query jsonb not null, notify boolean default true,
  created_at timestamptz default now()
);
```

### 17.3 RLS summary
| Table | Select | Insert/Update/Delete |
|-------|--------|----------------------|
| cities, areas, brands, series, models, aliases, variants, colors, content_blocks | public | admin only |
| profiles | public columns via view `public_profiles` (no phone) | own row only (not role/strikes/suspension fields) |
| shops | public | owner (except tier/verified/plan fields: admin only) |
| verification_requests | own + admin | own insert; admin update |
| listings | public where status = 'active' or 'sold'; owner sees all of their own; moderators see all | owner (status limited to draft/pending/sold transitions); moderator/admin full |
| listing_private | **nobody** (service role only) | service role only |
| listing_images | public if listing visible | owner |
| favorites, notifications, saved_searches | own | own (notifications: insert by system) |
| conversations, messages | participants only, minus blocked | participants; buyer can't message own listing |
| reviews | public unless hidden | eligible reviewer only (enforced by function) |
| reports | own + moderators | own insert; moderator update |
| contact_reveals, audit_log, payments, promotions, price_references, app_settings | admin (payments: own too) | server/admin |

**Phone numbers are never in a public view.** They are fetched only by the `reveal_contact(listing_id)` server action, which checks login + rate limit and logs a `contact_reveals` row.

### 17.4 Functions & jobs
- `set_updated_at()` trigger on all mutable tables.
- `listings_search_vector()` trigger: brand + model + aliases + variant + colour + city + title + description.
- `generate_listing_title()`: e.g. "iPhone 14 Pro 256GB · PTA Approved · 9/10".
- `compute_daam_meter(listing_id)` + nightly `recompute_all_daam_meters()`.
- `check_listing_risk(listing_id)`: duplicate IMEI hash, stolen registry, pHash duplicates, price anomaly, keyword rules → sets `hold_reasons` / status.
- pg_cron: expire listings after 30 days (with a reminder notification 3 days before), purge verification docs after `docs_purge_after`, end promotions, recompute ratings.

---

## 18. Business Model

| Phase | Timing (from launch) | Free | Paid |
|-------|---------------------|------|------|
| Build supply | Months 0–3 | Everything; founding shops get Elite free for 6 months | Nothing |
| First revenue | Months 3–6 | Individual listings (3 active), chat, verification | **Bump** to top (hypothesis: Rs 149–199), **Featured** 7 days (Rs 499–799), **City Top** spot |
| Shop plans | Months 6–9 | Free shop: 50 active listings, basic storefront | **Pro** (Rs 2,500–3,500/mo): 200 listings, 5 bumps/mo, analytics, priority review. **Elite** (Rs 6,000–9,000/mo): unlimited listings, 20 bumps/mo, storefront customisation, homepage rotation, bulk upload |
| Advertising | Months 9+ | — | Banner/native slots for accessory brands, repair shops, telcos, installment providers (clearly labelled "Sponsored") |
| Transactions | Months 12+ | — | **Daam Check**: paid physical inspection at partner Trusted Shops. **Daam Protect**: escrow-style payment through a licensed payment partner (needs legal/SBP-compliant partner); fee 2–4% |

All prices are **hypotheses to validate** with founding shops. Principles: trust features are never paywalled for safety (individuals can always verify for free), and a verification badge can never be bought.

**Payments:** MVP takes manual payment (JazzCash/Easypaisa/bank transfer, user uploads proof, admin confirms). Integrate a Pakistani payment gateway (evaluate Safepay, PayFast and similar) once volume justifies it.

---

## 19. Admin Dashboard & Permissions

### Modules
1. **Overview:** KPIs (new listings, active listings, pending reviews, open reports, new users, qualified conversations, revenue), charts by day, Lahore vs. other cities.
2. **Moderation queue:** pending listings with risk flags; approve / reject (reason templates) / hold / request changes; keyboard shortcuts; side-by-side photo viewer.
3. **PTA check tool:** a moderator opens a listing, reveals the IMEI (logged), checks it on PTA DVS manually, and records the result (compliant + model match) → sets `daam_checked`.
4. **Reports:** queue by reason and severity; actions: dismiss, remove listing, warn, strike, suspend.
5. **Users:** search by phone/name; view listings, reports, strikes; suspend/unsuspend; change role (super admin only).
6. **Verification requests:** ID and shop; document viewer (signed URLs); approve / reject / needs more info; video-call checklist.
7. **Shops:** list, tier, plan, founding flag, strikes.
8. **Catalog:** brands, series, models, variants, colours, aliases; CSV import/export.
9. **Price references:** Daam Meter fallback table editor + comparable-count view.
10. **Promotions & payments:** pending payment proofs → confirm → activate promotion; promotion calendar.
11. **Content:** content blocks (PTA explainers, safety tips, banners), homepage featured brands.
12. **Settings:** kill switches (CPID listings, pre-moderation, new signups), limits, scam rules/keywords.
13. **Audit log:** filter by actor, action, target.

### Permission matrix
| Capability | Support | Moderator | Admin | Super admin |
|-----------|---------|-----------|-------|-------------|
| View users/listings | ✅ | ✅ | ✅ | ✅ |
| Approve/reject/hold listings | — | ✅ | ✅ | ✅ |
| Handle reports, warn, strike | — | ✅ | ✅ | ✅ |
| Reveal IMEI / PTA check | — | ✅ (logged) | ✅ (logged) | ✅ (logged) |
| Suspend users | — | — | ✅ | ✅ |
| Approve verification | — | — | ✅ | ✅ |
| Catalog & price references | — | — | ✅ | ✅ |
| Promotions & payments | — | — | ✅ | ✅ |
| Content blocks | — | — | ✅ | ✅ |
| App settings & kill switches | — | — | — | ✅ |
| Manage admin roles | — | — | — | ✅ |
| View audit log | — | — | ✅ | ✅ |

---

## 20. Development Roadmap

Rough estimate: **~10–12 weeks solo with Claude Code** to a public launch, assuming 4–6 focused hours a day. Phases 1 and 2 can overlap with shop outreach.

### Phase 1: Product Planning & Brand Identity (Week 1)
- **Build:** finalise this plan; logo (generate with the Section 4.8 prompt, rebuild as SVG); domain + social handles; trademark search; legal review list.
- **Components:** logo SVGs, favicon set, brand one-pager, seed catalog spreadsheet (~250 models), city/area spreadsheet.
- **Dependencies:** none.
- **Key decisions:** domain (check `daam.pk`, `daam.com.pk`, `getdaam.pk`, `daamapp.com`); D-09 CPID legal opinion; founding-shop offer.
- **How to test:** say the name and tagline to 10 people in Hafeez Centre; check they remember it the next day; logo readable at 16px.
- **Exit criteria:** domain bought, handles secured, logo SVG final, seed catalog CSV ready, at least 10 shops verbally interested.

### Phase 2: UI/UX Design System (Week 2)
- **Build:** Tailwind v4 theme tokens, shadcn setup + theming, fonts, core Daam components, motion tokens, a `/dev/design` page showing every component and state (light/dark, en/ur).
- **Components:** everything in Section 13.4.
- **Dependencies:** Phase 1 brand assets.
- **Key decisions:** final tokens; card anatomy; Urdu font rendering test.
- **How to test:** visual review on a real budget Android + iPhone; contrast checks (WCAG AA); reduced-motion toggle; RTL mirror check.
- **Exit criteria:** design page complete; no hard-coded colours anywhere; Lighthouse accessibility ≥ 95 on the design page.

### Phase 3: Frontend Development (Weeks 3–4)
- **Build:** all MVP public pages + dashboard shells with **typed mock data**; header/nav, footer, i18n routing, RTL, page transitions, hero, browse with mock filters, listing detail, sell wizard UI (no backend), empty/loading/error states.
- **Components:** layouts, ListingCard grid, FilterSheet, ListingGallery, WizardStepper, PhotoUploader (local preview + reorder).
- **Dependencies:** Phase 2.
- **Key decisions:** URL structure (Section 15); which pages are static vs. dynamic.
- **How to test:** click through every route on mobile and desktop; Lighthouse mobile performance ≥ 85 on home/browse/listing; no layout shift.
- **Exit criteria:** every MVP page renders with mock data in en + ur; the sell wizard completes end-to-end locally.

### Phase 4: Backend & Database (Week 5)
- **Build:** Supabase project (Mumbai), migrations from Section 17, RLS policies, storage buckets (`listing-images` public, `verification-docs` private, `payment-proofs` private), seed scripts (brands, models, variants, colours, aliases, cities, areas, content blocks, app settings), generated TS types, data-access layer.
- **Dependencies:** Phase 1 seed CSVs.
- **Key decisions:** IMEI crypto approach (app-level AES-GCM); exact column grants.
- **How to test:** RLS tests (anon can't read `listing_private` or phones; user A can't edit user B's listing; non-participants can't read chats); seed runs cleanly from zero.
- **Exit criteria:** `supabase db reset` rebuilds everything; all RLS tests pass; types generated; mock data swapped for real catalog data on browse/brand/model pages.

### Phase 5: Authentication & User Profiles (Week 6)
- **Build:** phone OTP login (Supabase Auth + SMS provider via Send-SMS hook), onboarding (name, city), profile edit, username, public profile page, shop creation, ID verification + shop verification request flows, dashboard shell, route protection, admin role guard, Turnstile.
- **Dependencies:** Phase 4.
- **Key decisions:** SMS provider (Pakistani gateway vs. Twilio vs. WhatsApp OTP); OTP rate limits.
- **How to test:** sign up with Jazz/Zong/Telenor/Ufone numbers; wrong OTP; expired OTP; rate-limit lockout; logout everywhere; verification docs land in the private bucket and aren't publicly reachable.
- **Exit criteria:** real users can sign up, edit profiles, create a shop and submit verification; no auth-only page reachable while logged out.

### Phase 6: Marketplace Listings (Weeks 7–8)
- **Build:** sell wizard wired to the DB (drafts, autosave), image upload pipeline (client compress → signed upload → server re-encode + pHash + EXIF strip), IMEI encryption/hashing, PTA/JV/CPID rules, completion score, publish → pending_review, my listings (edit, delete, mark sold, renew), listing detail live, favourites, contact reveal (logged), basic moderation queue (approve/reject), risk checks (duplicate IMEI, stolen registry, pHash, price anomaly).
- **Dependencies:** Phases 4–5.
- **Key decisions:** max photos (10); expiry (30 days); individual listing cap (3).
- **How to test:** create 20 listings across brands; try a JV + PTA Approved combination (must fail); duplicate IMEI across two accounts (must hold); upload a photo with GPS EXIF (must be stripped); the full IMEI never appears in any network response.
- **Exit criteria:** end-to-end listing lifecycle works; all hard rules enforced in DB and UI.

### Phase 7: Search, Filters & Daam Meter (Week 9)
- **Build:** FTS + trigram + aliases, all filters and sorts, facet counts, URL state, city pages, model price-guide pages, Daam Meter computation + chips + live meter in the sell wizard, price-reference fallback.
- **Dependencies:** Phase 6.
- **Key decisions:** relevance weighting; comparable threshold (5); band cut-offs.
- **How to test:** seed 2,000 synthetic listings; "13 pm" finds the iPhone 13 Pro Max; every filter combination returns correct counts; p95 query < 300ms; the Daam Meter matches a manual spreadsheet calculation for 10 listings.
- **Exit criteria:** search feels instant on 4G; Daam Meter shows on cards, the listing page and the sell wizard.

### Phase 8: Messaging & Notifications (Week 10)
- **Build:** conversations + realtime chat, offers (with accept/decline), image messages, read receipts, unread counts, safety card at chat start, scam-keyword warnings, block/report from chat, in-app notifications (bell + page), email notifications (Resend) for key events, WhatsApp/call reveal flow, "mark sold to [buyer]" → review prompts → reviews + ratings.
- **Dependencies:** Phases 5–6.
- **Key decisions:** message retention; which events send email.
- **How to test:** two browsers chatting in real time; a blocked user can't message; a "send token money on Easypaisa" message triggers a warning; notifications arrive; a review is possible only after a confirmed sale.
- **Exit criteria:** reliable chat; reviews tied to real deals; notifications for every key event.

### Phase 9: Admin Dashboard (Week 11)
- **Build:** all modules in Section 19 with the permission matrix, PTA check tool, payments → promotions flow, catalog CSV import, price-reference editor, settings/kill switches, audit log.
- **Dependencies:** Phases 4–8.
- **Key decisions:** reject-reason templates; strike rules.
- **How to test:** log in as each role and confirm it can do exactly what the matrix allows; every action appears in the audit log; CPID kill switch hides CPID listings instantly.
- **Exit criteria:** one moderator can clear 100 pending listings in under 45 minutes.

### Phase 10: Security & Testing (Week 11–12, overlapping)
- **Build:** Playwright e2e for critical flows (signup, list, search, chat, report, admin approve), Vitest for domain logic (PTA rules, Daam Meter, PKR formatting, phone validation, IMEI Luhn), RLS test suite in CI, security headers/CSP, rate-limit verification, dependency audit, accessibility audit, performance pass, backup restore drill.
- **Dependencies:** all feature phases.
- **How to test:** run an OWASP top-10 style self-review; try to read `listing_private` with the anon key; brute-force OTP (must lock out); Lighthouse mobile ≥ 85 performance, ≥ 95 accessibility on key pages.
- **Exit criteria:** CI green; no critical/high findings open; restore drill succeeds.

### Phase 11: Deployment & Launch (Week 12+)
- **Build:** production Supabase + Vercel projects, domain + SSL, env vars, Sentry, PostHog, sitemaps submitted to Google Search Console, legal pages final, status/monitoring alerts.
- **Launch sequence:**
  1. **Private beta (1–2 weeks):** 20–50 founding Lahore shops + ~100 invited buyers; concierge listing help; fix issues daily.
  2. **Soft launch:** open signups in Lahore; content marketing starts.
  3. **Public launch:** all cities open; PR + social push.
- **How to test:** smoke tests on production; a real phone sold end-to-end through the platform.
- **Exit criteria:** at least 500 active listings before public launch; moderation SLA met for 7 straight days; no P1 bugs open.

---

## 21. Go-To-Market (Lahore Launch)

1. **Founding shops (start now, parallel to the build):** visit Hafeez Centre and Hall Road. Offer: Elite plan free for 6 months, a permanent "Founding Shop" badge, and concierge onboarding (the team photographs and lists their stock). Target: 20 signed before beta, 50 by public launch.
2. **Content engine:** TikTok/Instagram/YouTube Shorts series:
   - *Daam Check*: "Is Rs 1.6 lac fair for a 14 Pro, Non-PTA, 86% battery?"
   - *PTA 60-second explainers*: PTA vs. Non-PTA vs. CPID vs. JV.
   - *Scam alerts*: real patterns (token money, fake 8484 screenshots).
   - The founder's existing TikTok audience is the launch amplifier.
3. **Supply hooks for individuals:** "List in 2 minutes, free", "See your phone's real daam before you sell" (a price-check tool that doubles as a listing funnel).
4. **SEO from day 1:** model price-guide pages indexed during beta.
5. **90-day targets:** 1,000+ active listings, 50 verified shops, 5,000 monthly active buyers, 1,500 qualified conversations per month, moderation SLA under 2h.

---

## 22. MVP Scope: In / Out

**IN (launch):** catalog + admin CMS, sell wizard, photo pipeline, PTA two-field model + rules, IMEI privacy + duplicate/stolen checks, search + filters + sorting, Daam Meter, city + model price pages, phone OTP auth, profiles, shops + verification, favourites, realtime chat + offers, WhatsApp/call reveal, notifications (in-app + email), reviews from real deals, reports/blocks, safety + PTA guides, admin dashboard with roles, English + Urdu, manual payments for promotions.

**OUT (later):** native mobile app, escrow/Daam Protect, Daam Check inspections, payment gateway, banner ads, saved-search alerts, compare tool, push notifications, bulk CSV upload for shops, AI photo-grading, NADRA API verification, tablets/watches/accessories, auctions, installments.

---

## 23. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Cold start (empty marketplace) | Fatal | Founding shops with concierge listing; Lahore density first; price-check tool to attract sellers |
| Scams and fake listings | Brand-killing | Pre-moderation, IMEI/pHash/price checks, chat warnings, real-deal reviews, strikes |
| Legal exposure (CPID/JV listings, IMEI handling) | High | Lawyer review before launch; CPID kill switch; clear disclosures; encrypted IMEI; privacy policy |
| PTA rule changes | Medium | All PTA copy in `content_blocks`; enums extendable; link only to official channels |
| Shops gaming the Daam Meter | Medium | Exclude flagged/removed listings, use medians not means, require ≥ 5 comparables, admin reference table |
| Number scraping by competitors/spammers | Medium | Login-gated reveal, rate limits, logging, numbers never in HTML |
| Moderation load outgrows a solo founder | Medium | Risk-based moderation after launch; hire 1–2 part-time moderators from revenue |
| SMS OTP cost / deliverability | Medium | Local gateway via Send-SMS hook; WhatsApp OTP fallback; rate limits |
| Infrastructure cost spikes | Low–Med | Client-side image compression, caching, monitoring usage alerts |

---

## 24. Open Items for the Founder

1. Buy the domain (check `.pk` options via PKNIC-accredited registrars) and secure social handles.
2. Book a short consultation with a Pakistani lawyer: CPID/JV listing policy (D-09), terms of service, privacy policy, IMEI/CNIC data handling.
3. Generate the logo with the Section 4.8 prompt; get the final version vectorised.
4. Prepare seed CSVs: top ~250 models with variants, colours and aliases; Lahore areas.
5. Start founding-shop conversations in Hafeez Centre and Hall Road.
6. Choose an SMS OTP provider (get quotes from 2–3 Pakistani gateways).
7. Find an Urdu reviewer for UI copy (natural, not machine-translated).
