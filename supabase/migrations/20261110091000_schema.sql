-- Phase 4 schema from master plan 17.2. RLS remains deny-by-default until explicitly granted.

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
  unique nulls not distinct (model_id, ram_gb, storage_gb)
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

-- Protect every table immediately, including tables without client access policies.
alter table public.cities enable row level security;
alter table public.areas enable row level security;
alter table public.profiles enable row level security;
alter table public.shops enable row level security;
alter table public.verification_requests enable row level security;
alter table public.brands enable row level security;
alter table public.series enable row level security;
alter table public.models enable row level security;
alter table public.model_aliases enable row level security;
alter table public.model_variants enable row level security;
alter table public.model_colors enable row level security;
alter table public.listings enable row level security;
alter table public.listing_private enable row level security;
alter table public.listing_images enable row level security;
alter table public.favorites enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.contact_reveals enable row level security;
alter table public.reviews enable row level security;
alter table public.reports enable row level security;
alter table public.blocks enable row level security;
alter table public.stolen_device_reports enable row level security;
alter table public.notifications enable row level security;
alter table public.price_references enable row level security;
alter table public.payments enable row level security;
alter table public.promotions enable row level security;
alter table public.content_blocks enable row level security;
alter table public.app_settings enable row level security;
alter table public.audit_log enable row level security;
alter table public.saved_searches enable row level security;
