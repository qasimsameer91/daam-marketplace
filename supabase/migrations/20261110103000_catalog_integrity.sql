-- A public listing must not combine unrelated catalog records or locations.
create function public.check_listing_catalog_links() returns trigger
language plpgsql set search_path = pg_catalog, public as $$
begin
  if new.model_id is not null and not exists (
    select 1 from public.models m where m.id = new.model_id and m.brand_id = new.brand_id
  ) then raise exception 'Listing model does not belong to brand' using errcode = '23514'; end if;
  if new.variant_id is not null and not exists (
    select 1 from public.model_variants v where v.id = new.variant_id and v.model_id = new.model_id
  ) then raise exception 'Listing variant does not belong to model' using errcode = '23514'; end if;
  if new.color_id is not null and not exists (
    select 1 from public.model_colors c where c.id = new.color_id and c.model_id = new.model_id
  ) then raise exception 'Listing color does not belong to model' using errcode = '23514'; end if;
  if new.area_id is not null and not exists (
    select 1 from public.areas a where a.id = new.area_id and a.city_id = new.city_id
  ) then raise exception 'Listing area does not belong to city' using errcode = '23514'; end if;
  return new;
end $$;
create trigger listings_catalog_links before insert or update of brand_id, model_id, variant_id, color_id, city_id, area_id
  on public.listings for each row execute function public.check_listing_catalog_links();

-- Build a title from catalog facts when a model is selected. Custom listings
-- keep their submitted title until the later server-side publishing workflow.
create function public.generate_listing_title() returns trigger
language plpgsql set search_path = pg_catalog, public as $$
declare model_name text; storage_value smallint; pta_label text; condition_label text;
begin
  select m.name into model_name from public.models m where m.id = new.model_id;
  if model_name is null then return new; end if;
  select v.storage_gb into storage_value from public.model_variants v where v.id = new.variant_id;
  pta_label := case new.pta_status
    when 'pta_approved' then 'PTA Approved' when 'non_pta' then 'Non-PTA'
    when 'cpid_patched' then 'CPID Patched' else 'PTA Unknown' end;
  condition_label := case new.condition
    when 'grade_9' then '9/10' when 'grade_8' then '8/10' when 'grade_7' then '7/10'
    else replace(initcap(new.condition::text), '_', ' ') end;
  new.title := concat_ws(' · ', concat_ws(' ', model_name, case when storage_value is null then null else storage_value::text || 'GB' end), pta_label, condition_label);
  return new;
end $$;
create trigger listings_generate_title before insert or update of model_id, variant_id, pta_status, condition, title
  on public.listings for each row execute function public.generate_listing_title();

-- Explicit failures prevent callers from mistaking placeholders for real checks.
create function public.compute_daam_meter(p_listing_id uuid) returns void
language plpgsql set search_path = pg_catalog as $$
begin
  raise exception 'Daam Meter computation is not implemented until Phase 7' using errcode = '0A000';
end $$;
create function public.check_listing_risk(p_listing_id uuid) returns void
language plpgsql set search_path = pg_catalog as $$
begin
  raise exception 'Listing risk checks are not implemented until Phase 6' using errcode = '0A000';
end $$;
revoke all on function public.compute_daam_meter(uuid) from public;
revoke all on function public.check_listing_risk(uuid) from public;
