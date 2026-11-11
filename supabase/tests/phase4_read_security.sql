-- Run on a disposable local database after migrations; all fixtures roll back.
begin;

do $$
declare unprotected text;
begin
  select string_agg(c.relname, ', ') into unprotected
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity;
  if unprotected is not null then raise exception 'RLS disabled on: %', unprotected; end if;
  if has_table_privilege('anon', 'public.listing_private', 'SELECT')
     or has_table_privilege('authenticated', 'public.listing_private', 'SELECT') then
    raise exception 'Private IMEI table is accessible to a client role';
  end if;
  if has_column_privilege('anon', 'public.profiles', 'phone_e164', 'SELECT')
     or exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'public_profiles' and column_name = 'phone_e164') then
    raise exception 'Anonymous profile exposes phone numbers';
  end if;
end $$;

insert into auth.users (id) values
  ('00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000002');
insert into public.profiles (id, display_name, phone_e164, is_suspended) values
  ('00000000-0000-0000-0000-000000000001', 'Test owner', 'test-owner', false),
  ('00000000-0000-0000-0000-000000000002', 'Test suspended', 'test-suspended', true);
insert into public.listings (id, short_id, slug, seller_id, title, price_pkr, condition, status) values
  ('10000000-0000-0000-0000-000000000001', 'test0001', 'active', '00000000-0000-0000-0000-000000000001', 'Active test', 1000, 'used', 'active'),
  ('10000000-0000-0000-0000-000000000002', 'test0002', 'draft', '00000000-0000-0000-0000-000000000001', 'Draft test', 1000, 'used', 'draft');

do $$
declare apple_id integer; samsung_id integer; test_model integer;
begin
  select id into strict apple_id from public.brands where slug = 'apple';
  select id into strict samsung_id from public.brands where slug = 'samsung';
  select id into strict test_model from public.models where slug = 'iphone-x';
  insert into public.listings (short_id, slug, seller_id, title, price_pkr, condition, brand_id, model_id, network_lock, pta_status)
    values ('testjv01', 'valid-jv', '00000000-0000-0000-0000-000000000001', 'Example phone', 1000, 'used', apple_id, test_model, 'jv', 'non_pta');
  if not exists (select 1 from public.listings where short_id = 'testjv01' and search_vector @@ to_tsquery('simple', 'iphonex')) then
    raise exception 'Listing search vector does not include model aliases';
  end if;
  begin
    insert into public.listings (short_id, slug, seller_id, title, price_pkr, condition, brand_id, network_lock)
      values ('testjv02', 'invalid-jv', '00000000-0000-0000-0000-000000000001', 'Example phone', 1000, 'used', samsung_id, 'jv');
    raise exception 'Non-Apple JV listing was accepted';
  exception when check_violation then null;
  end;
  begin
    insert into public.listings (short_id, slug, seller_id, title, price_pkr, condition, brand_id, network_lock, pta_status)
      values ('testjv03', 'invalid-jv-pta', '00000000-0000-0000-0000-000000000001', 'Example phone', 1000, 'used', apple_id, 'jv', 'pta_approved');
    raise exception 'PTA-approved JV listing was accepted';
  exception when check_violation then null;
  end;
end $$;

set local role anon;
do $$
begin
  if (select count(*) from public.public_profiles where id in ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002')) <> 1 then
    raise exception 'Public profile view exposes suspended profile';
  end if;
  if (select count(*) from public.listings where id in ('10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002')) <> 1 then
    raise exception 'Anonymous listing visibility is incorrect';
  end if;
  if has_table_privilege(current_user, 'public.profiles', 'SELECT')
     or exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'public_shops' and column_name in ('phone_e164', 'whatsapp_e164')) then
    raise exception 'Anonymous access exposes private contact fields';
  end if;
end $$;
reset role;

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);
do $$
declare affected integer;
begin
  if (select count(*) from public.profiles where id in ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002')) <> 1 then
    raise exception 'Authenticated profile isolation failed';
  end if;
  if (select count(*) from public.listings where id in ('10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002')) <> 2 then
    raise exception 'Owner cannot read own draft';
  end if;
  if has_column_privilege(current_user, 'public.profiles', 'role', 'UPDATE')
     or has_column_privilege(current_user, 'public.profiles', 'strikes', 'UPDATE')
     or has_table_privilege(current_user, 'public.listing_private', 'SELECT') then
    raise exception 'Authenticated client can access a protected capability';
  end if;
  update public.profiles set display_name = 'Edited locally' where id = '00000000-0000-0000-0000-000000000001';
  get diagnostics affected = row_count;
  if affected <> 1 then raise exception 'Owner could not update own profile'; end if;
  update public.profiles set display_name = 'Unauthorized' where id = '00000000-0000-0000-0000-000000000002';
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Owner updated another profile'; end if;
  insert into public.favorites (user_id, listing_id)
    values ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001');
  begin
    insert into public.favorites (user_id, listing_id)
      values ('00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001');
    raise exception 'User saved a favourite as another user';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.favorites (user_id, listing_id)
      values ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002');
    raise exception 'User saved a draft as a favourite';
  exception when insufficient_privilege then null;
  end;
  delete from public.favorites where user_id = '00000000-0000-0000-0000-000000000001';
  get diagnostics affected = row_count;
  if affected <> 1 then raise exception 'Owner could not delete own favourite'; end if;
end $$;
reset role;
rollback;
