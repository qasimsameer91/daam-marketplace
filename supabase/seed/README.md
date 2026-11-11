# Seed data

CSV files that the Phase 4 seed script loads into a fresh database (`pnpm db:reset`). They follow `docs/DAAM_MASTER_PLAN.md` sections 5, 6, 7, 11 and 12.

Run `python scripts/generate_seed.py` from the repository root after changing a CSV. This regenerates `supabase/seed.sql` for the Supabase local seed configuration. The script checks for ambiguous/missing model references, and the generated SQL checks inserted row counts. A database reset destroys the target's data; use it only after confirming the target is disposable.

The catalog is data, not code. After launch, admins manage it in the admin panel, which also does CSV import and export. These files are only the starting set.

> **Before production:** a human must check every row where `needs_review = true`, and every Urdu string. See [Review checklist](#review-checklist).

## Files

| File                 | Rows  | Columns                                                                                           | Notes                                                                                                                                                                                                                                                                                                         |
| -------------------- | ----- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `brands.csv`         | 17    | `id, name, slug, parent_slug, sort_order`                                                         | Launch brands from §5. Redmi and Poco have `parent_slug = xiaomi`, so a search for "Xiaomi" can include them. `other` takes a free-text brand and model and always goes to moderation.                                                                                                                        |
| `cities.csv`         | 29    | `name_en, name_ur, slug, province, is_major, sort_order`                                          | Every city in §12. `is_major` marks the 9 largest cities.                                                                                                                                                                                                                                                     |
| `areas.csv`          | 86    | `city_slug, name_en, name_ur, slug`                                                               | Lahore 36, Karachi 18, Islamabad 16, Rawalpindi 16. Other cities have no areas yet.                                                                                                                                                                                                                           |
| `models.csv`         | 332   | `brand_slug, series, name, slug, release_year, supports_battery_health, popularity, needs_review` | `slug` is unique across all brands, so the other files can point at a model by slug alone. `series` is free text; the loader creates one `series` row per distinct (brand, series) pair. `popularity` (0–100) is a rough starting rank for ordering pickers and suggestions.                                  |
| `variants.csv`       | 704   | `model_slug, ram_gb, storage_gb, needs_review`                                                    | `ram_gb` is empty for iPhones (Apple doesn't market RAM). Storage is in GB, so 1024 = 1 TB and 2048 = 2 TB.                                                                                                                                                                                                   |
| `colors.csv`         | 393   | `model_slug, name, hex, needs_review`                                                             | Official colour names. `hex` is an **approximate swatch for the UI only**, not an official value. Colours are included only where the names were known with confidence. Models without colours still work, because colour is optional on a listing.                                                           |
| `aliases.csv`        | 1,417 | `model_slug, alias`                                                                               | Lowercase search shorthand: `13 pm`, `s23u`, `note 13`, `rn13 pro`, `fold5`, `p7p`, `op12`, `11 simple`, and spacing variants (`reno 8 t`, `s 23 ultra`).                                                                                                                                                     |
| `content_blocks.csv` | 52    | `key, body_en, body_ur, review_status`                                                            | Copy for the PTA explainers (§6.1), PTA registration types, network locks (§6.2), the "Seller says" / "Checked by Daam" labels (§6.3), "Check before you pay" (§6.4), safe-meetup tips, the chat safety message, scam warning signs and Help-centre FAQs (§11), and the CPID warning banner. Plain text only. |
| `app_settings.csv`   | 6     | `key, value`                                                                                      | `value` is JSON: `allow_cpid_listings=true`, `max_free_listings_individual=3`, `premoderation_enabled=true`, `scam_price_ratio=0.5`, `listing_expiry_days=30`, `daam_min_comparables=5`.                                                                                                                      |

`seed-integrity.test.ts` runs with `pnpm test`. It checks references between files, unique slugs, hex formats, the area targets, the alias examples above, and that no copy treats CPID or JV as PTA approval.

## Rules the data follows

- **Model names are full marketing names** ("Galaxy S23 Ultra", "Redmi Note 13", "Tecno Spark 20 Pro"), because the listing title is built from the model name without the brand (§17.4: "iPhone 14 Pro 256GB · PTA Approved · 9/10").
- **One shorthand, one model.** When the same shorthand fits several models (for example `a54` for Galaxy A54 5G and Oppo A54), only the most popular model keeps it. Full-name and full-text search still find the others.
- **`supports_battery_health` is conservative.** It is `true` only where the phone shows a battery-health percentage in Settings: every iPhone, and Pixel 8a and later. Battery health is required for iPhones (unless the phone is brand new or open box) and optional for everything else, so a `false` here never blocks a seller.
- **No scraping.** The data was drafted from general knowledge of the Pakistani market (§5). Nothing was copied from third-party spec sites.
- **PTA copy is calm and factual.** It never implies CPID, JV or "server approved" is PTA approval, and it only says "checked by Daam" in the `pta_check.daam_checked` block. It links only to official PTA channels (8484, `*8484#`, dvs.pta.gov.pk, the DVS app).

## Review checklist

`needs_review = true` means "probably right, but confirm before production". Things to check:

1. **Variants (479 of 704 rows).** RAM/storage combinations for Galaxy A, Redmi, Poco, Oppo, Vivo, Realme, Tecno, Infinix, Huawei, Motorola, Nokia, Sony and OnePlus vary by market. Check them against what Pakistani shops and official PK sites actually sell, delete combinations that weren't sold here, and add missing ones.
2. **Recent models (7 rows in `models.csv`).** Galaxy S26 / S26+ / S26 Ultra, Redmi Note 15 / 15 Pro, Infinix Hot 60 and Infinix Note 50 launched close to when this data was drafted. Confirm the names and years, and that they are actually sold in Pakistan.
3. **Colours (65 rows).** Mostly 2025 launches (iPhone 17 family, Galaxy S25 Edge/FE, Z Flip7/Fold7, Pixel 10 family) plus a few Galaxy A colour sets.
4. **All Urdu text (`review_status = ur_draft`).** The `content_blocks.csv` bodies and the city and area names are machine-drafted. A native Urdu reviewer should make them natural (plan §24, item 7). In particular, check Islamabad's sector names (`ایف-6` etc.) against how local people write them.
5. **Coverage gaps.** Add any heavily traded model that is missing; listings for it currently fall back to the `other` brand. Deactivate (`is_active = false`) models that turn out to be rarely traded.

When a row is confirmed, set `needs_review` to `false`.
