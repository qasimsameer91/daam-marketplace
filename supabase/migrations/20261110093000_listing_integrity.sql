-- Cross-table rule cannot be expressed as a CHECK: JV applies to Apple only.
create function public.enforce_listing_jv_brand() returns trigger
language plpgsql set search_path = pg_catalog, public as $$
begin
  if new.network_lock = 'jv' and not exists (
    select 1 from public.brands b where b.id = new.brand_id and lower(b.slug::text) = 'apple'
  ) then
    raise exception 'JV network lock is only available for Apple listings'
      using errcode = '23514';
  end if;
  return new;
end $$;
create trigger listings_jv_brand before insert or update of brand_id, network_lock
on public.listings for each row execute function public.enforce_listing_jv_brand();

create function public.set_updated_at() returns trigger
language plpgsql set search_path = pg_catalog as $$
begin
  new.updated_at = now();
  return new;
end $$;

do $$
declare item record;
begin
  for item in
    select table_name from information_schema.columns
    where table_schema = 'public' and column_name = 'updated_at'
      and table_name in (select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relkind = 'r')
  loop
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', item.table_name);
  end loop;
end $$;

-- Search is deliberately derived from catalog data and plain text only.
create function public.listings_search_vector() returns trigger
language plpgsql set search_path = pg_catalog, public as $$
declare model_text text; brand_text text; variant_text text; color_text text; city_text text;
begin
  select concat_ws(' ', m.name, (select string_agg(a.alias::text, ' ') from public.model_aliases a where a.model_id = m.id))
    into model_text from public.models m where m.id = new.model_id;
  select b.name into brand_text from public.brands b where b.id = new.brand_id;
  select concat_ws(' ', v.ram_gb, v.storage_gb) into variant_text from public.model_variants v where v.id = new.variant_id;
  select c.name into color_text from public.model_colors c where c.id = new.color_id;
  select c.name_en into city_text from public.cities c where c.id = new.city_id;
  new.search_vector :=
    setweight(to_tsvector('simple', concat_ws(' ', model_text, new.custom_model)), 'A') ||
    setweight(to_tsvector('simple', concat_ws(' ', brand_text, new.custom_brand, variant_text, color_text, city_text)), 'B') ||
    setweight(to_tsvector('simple', coalesce(new.title, '')), 'C') ||
    setweight(to_tsvector('simple', coalesce(new.description, '')), 'D');
  return new;
end $$;
create trigger listings_search_vector before insert or update of
  brand_id, model_id, variant_id, color_id, city_id, custom_brand, custom_model, title, description
on public.listings for each row execute function public.listings_search_vector();
