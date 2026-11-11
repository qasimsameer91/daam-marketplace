-- Start with explicit privileges. Later migrations can add narrowly scoped mutations;
-- no client receives access merely because a new table was added.
revoke all on all tables in schema public from public, anon, authenticated;
revoke all on all sequences in schema public from public, anon, authenticated;

-- Catalog and published editorial content are public.
do $$
declare table_name text;
begin
  foreach table_name in array array[
    'cities', 'areas', 'brands', 'series', 'models', 'model_aliases',
    'model_variants', 'model_colors', 'content_blocks'
  ] loop
    execute format('grant select on public.%I to anon, authenticated', table_name);
    execute format('create policy public_catalog_read on public.%I for select to anon, authenticated using (true)', table_name);
  end loop;
end $$;

-- Only the owner may read the full profile. Other visitors use the safe view.
grant select on public.profiles to authenticated;
create policy profiles_read_own on public.profiles for select to authenticated
  using (id = (select auth.uid()));

create view public.public_profiles with (security_barrier = true) as
select id, username, display_name, avatar_url, account_type, city_id, area_id,
       bio, id_verified_at, rating_avg, rating_count, created_at
from public.profiles
where is_suspended is not true;
revoke all on public.public_profiles from public;
grant select on public.public_profiles to anon, authenticated;

-- Shop contact numbers are private too. Only a safe projection is public.
grant select on public.shops to authenticated;
create policy shops_read_own on public.shops for select to authenticated
  using (owner_id = (select auth.uid()));
create view public.public_shops with (security_barrier = true) as
select id, owner_id, name, slug, logo_url, cover_url, description, market_name,
       address, city_id, area_id, lat, lng, maps_url, opening_hours, tier,
       verified_at, plan, is_founding_shop, created_at, updated_at
from public.shops;
revoke all on public.public_shops from public;
grant select on public.public_shops to anon, authenticated;

-- No policies or grants for listing_private: service role only.
-- Row policies are paired with column grants to exclude moderation-only fields.
grant select (
  id, short_id, slug, seller_id, shop_id, status, brand_id, model_id, variant_id,
  color_id, custom_brand, custom_model, title, description, price_pkr, is_negotiable,
  pta_status, network_lock, pta_reg_type, pta_check_source, pta_checked_at, imei_last4,
  condition, battery_health, screen_condition, body_condition, box_status, accessories,
  warranty_type, warranty_months_left, repair_history, functional_issues, purchase_month,
  city_id, area_id, contact_chat, contact_whatsapp, contact_call, cover_image_path,
  image_count, completion_score, daam_band, daam_median_pkr, daam_p25_pkr,
  daam_p75_pkr, daam_computed_at, view_count, favorite_count, contact_count,
  is_featured, featured_until, bumped_at, published_at, expires_at, sold_at,
  created_at, updated_at
) on public.listings to anon, authenticated;
create policy listings_read_public_or_owner on public.listings for select to anon, authenticated
  using (status in ('active', 'sold') or seller_id = (select auth.uid()));

grant select (id, listing_id, storage_path, width, height, sort_order, created_at)
  on public.listing_images to anon, authenticated;
create policy listing_images_read_visible on public.listing_images for select to anon, authenticated
  using (exists (select 1 from public.listings l where l.id = listing_id));

-- Owners may read their own records. Mutations and privileged moderation are
-- intentionally deferred until their complete policies and tests are in place.
grant select on public.verification_requests, public.favorites, public.notifications,
  public.saved_searches, public.payments, public.reports, public.blocks to authenticated;
create policy verification_read_own on public.verification_requests for select to authenticated
  using (user_id = (select auth.uid()));
create policy favorites_read_own on public.favorites for select to authenticated
  using (user_id = (select auth.uid()));
create policy notifications_read_own on public.notifications for select to authenticated
  using (user_id = (select auth.uid()));
create policy saved_searches_read_own on public.saved_searches for select to authenticated
  using (user_id = (select auth.uid()));
create policy payments_read_own on public.payments for select to authenticated
  using (user_id = (select auth.uid()));
create policy reports_read_own on public.reports for select to authenticated
  using (reporter_id = (select auth.uid()));
create policy blocks_read_own on public.blocks for select to authenticated
  using (blocker_id = (select auth.uid()));
