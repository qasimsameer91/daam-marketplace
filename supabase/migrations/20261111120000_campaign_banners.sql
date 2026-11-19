-- Editorial campaigns are distinct from paid listing promotions. Public rows
-- are visible only while published, approved, active and within their schedule.
create function public.safe_campaign_url(value text) returns boolean
language sql immutable strict set search_path = pg_catalog as $$
  select length(value) <= 2048 and value !~ '[[:space:]<>\\]'
    and ((left(value, 1) = '/' and left(value, 2) <> '//')
      or value ~* '^https://[a-z0-9]([a-z0-9.-]*[a-z0-9])?([:/?#].*)?$');
$$;

create table public.campaign_banners (
  id uuid primary key default gen_random_uuid(),
  title_en text not null check (char_length(trim(title_en)) between 1 and 100),
  title_ur text not null check (char_length(trim(title_ur)) between 1 and 150),
  subtitle_en text not null default '' check (char_length(subtitle_en) <= 120),
  subtitle_ur text not null default '' check (char_length(subtitle_ur) <= 180),
  description_en text not null default '' check (char_length(description_en) <= 400),
  description_ur text not null default '' check (char_length(description_ur) <= 600),
  desktop_image_url text check (desktop_image_url is null or public.safe_campaign_url(desktop_image_url)),
  mobile_image_url text check (mobile_image_url is null or public.safe_campaign_url(mobile_image_url)),
  cta_en text not null check (char_length(trim(cta_en)) between 1 and 60),
  cta_ur text not null check (char_length(trim(cta_ur)) between 1 and 90),
  cta_url text not null check (public.safe_campaign_url(cta_url)),
  theme text not null default 'dark' check (theme in ('dark', 'light', 'lime')),
  placement text not null check (placement in ('home_hero', 'below_hero', 'featured_category', 'mid_page', 'listing_page', 'seasonal')),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  priority smallint not null default 0 check (priority between -100 and 100),
  status text not null default 'draft' check (status in ('draft', 'published')),
  is_active boolean not null default false,
  approved_at timestamptz,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint campaign_schedule_valid check (ends_at > starts_at),
  constraint campaign_publication_approved check (status <> 'published' or approved_at is not null)
);
create index campaign_public_placement on public.campaign_banners (placement, priority desc, starts_at desc)
  where status = 'published' and is_active = true;
alter table public.campaign_banners enable row level security;
revoke all on public.campaign_banners from public, anon, authenticated;
grant select on public.campaign_banners to anon, authenticated;
grant insert, update, delete on public.campaign_banners to authenticated;

create policy campaign_public_read on public.campaign_banners for select to anon, authenticated
  using (status = 'published' and is_active = true and approved_at is not null
    and starts_at <= now() and ends_at > now());
create policy campaign_admin_manage on public.campaign_banners for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create function public.campaign_set_metadata() returns trigger
language plpgsql set search_path = pg_catalog, public as $$
begin
  if tg_op = 'INSERT' then new.created_by := auth.uid(); else new.created_by := old.created_by; end if;
  new.updated_by := auth.uid();
  new.updated_at := now();
  if new.status = 'published' then new.approved_at := now(); else new.approved_at := null; end if;
  return new;
end $$;
create trigger campaign_set_metadata before insert or update on public.campaign_banners
  for each row execute function public.campaign_set_metadata();
create trigger audit_admin_change after insert or update or delete on public.campaign_banners
  for each row execute function public.audit_admin_change();
