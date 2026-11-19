begin;
insert into auth.users (id) values
  ('50000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000002');
insert into public.profiles (id, display_name, phone_e164, role) values
  ('50000000-0000-0000-0000-000000000001', 'Campaign admin', 'campaign-admin', 'admin'),
  ('50000000-0000-0000-0000-000000000002', 'Campaign user', 'campaign-user', 'user');
insert into public.campaign_banners (id, title_en, title_ur, cta_en, cta_ur, cta_url, placement, starts_at, ends_at, status, is_active) values
  ('60000000-0000-0000-0000-000000000001', 'Live', 'براہ راست', 'Browse', 'دیکھیں', '/phones', 'below_hero', now() - interval '1 day', now() + interval '1 day', 'published', true),
  ('60000000-0000-0000-0000-000000000002', 'Future', 'آئندہ', 'Browse', 'دیکھیں', '/phones', 'below_hero', now() + interval '1 day', now() + interval '2 days', 'published', true),
  ('60000000-0000-0000-0000-000000000003', 'Expired', 'ختم', 'Browse', 'دیکھیں', '/phones', 'below_hero', now() - interval '2 days', now() - interval '1 day', 'published', true),
  ('60000000-0000-0000-0000-000000000004', 'Inactive', 'غیر فعال', 'Browse', 'دیکھیں', '/phones', 'below_hero', now() - interval '1 day', now() + interval '1 day', 'published', false),
  ('60000000-0000-0000-0000-000000000005', 'Draft', 'مسودہ', 'Browse', 'دیکھیں', '/phones', 'below_hero', now() - interval '1 day', now() + interval '1 day', 'draft', true);

set local role anon;
do $$ begin
  if (select count(*) from public.campaign_banners where id::text like '60000000-%') <> 1 then
    raise exception 'Public campaign visibility ignored status, activation or schedule';
  end if;
  if has_table_privilege(current_user, 'public.campaign_banners', 'INSERT') then
    raise exception 'Anonymous visitor can edit campaigns';
  end if;
end $$;
reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '50000000-0000-0000-0000-000000000002', true);
do $$ begin
  begin
    insert into public.campaign_banners (title_en, title_ur, cta_en, cta_ur, cta_url, placement, starts_at, ends_at)
      values ('Forged', 'جعلی', 'Browse', 'دیکھیں', '/phones', 'below_hero', now(), now() + interval '1 day');
    raise exception 'Non-admin created a campaign';
  exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claim.sub', '50000000-0000-0000-0000-000000000001', true);
do $$ begin
  insert into public.campaign_banners (id, title_en, title_ur, cta_en, cta_ur, cta_url, placement, starts_at, ends_at, status, is_active)
    values ('60000000-0000-0000-0000-000000000006', 'Admin', 'منتظم', 'Browse', 'دیکھیں', '/phones', 'below_hero', now() - interval '1 day', now() + interval '1 day', 'published', true);
  if not exists (select 1 from public.campaign_banners where id = '60000000-0000-0000-0000-000000000006' and approved_at is not null and created_by = auth.uid()) then
    raise exception 'Published campaign was not approved or attributed';
  end if;
  begin
    update public.campaign_banners set cta_url = 'javascript:alert(1)' where id = '60000000-0000-0000-0000-000000000006';
    raise exception 'Unsafe URL was accepted';
  exception when check_violation then null; end;
  update public.campaign_banners set status = 'draft' where id = '60000000-0000-0000-0000-000000000006';
  if exists (select 1 from public.campaign_banners where id = '60000000-0000-0000-0000-000000000006' and approved_at is not null) then
    raise exception 'Unpublished campaign remains approved';
  end if;
  delete from public.campaign_banners where id = '60000000-0000-0000-0000-000000000006';
end $$;
reset role;
do $$ begin
  if (select count(*) from public.audit_log where actor_id = '50000000-0000-0000-0000-000000000001' and target_id = '60000000-0000-0000-0000-000000000006' and action in ('campaign_banners.insert','campaign_banners.update','campaign_banners.delete')) <> 3 then
    raise exception 'Campaign changes were not fully audited';
  end if;
end $$;
set local role authenticated;
select set_config('request.jwt.claim.sub', '50000000-0000-0000-0000-000000000002', true);
do $$ begin
  begin
    insert into storage.objects (bucket_id,name) values ('campaign-images','50000000-0000-0000-0000-000000000002/60000000-0000-0000-0000-000000000008.webp');
    raise exception 'Non-admin uploaded campaign media';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.campaign_media(storage_path,width,height,bytes) values('50000000-0000-0000-0000-000000000002/60000000-0000-0000-0000-000000000008.webp',400,200,1000);
    raise exception 'Non-admin recorded campaign media';
  exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claim.sub', '50000000-0000-0000-0000-000000000001', true);
insert into storage.objects (bucket_id,name) values ('campaign-images','50000000-0000-0000-0000-000000000001/60000000-0000-0000-0000-000000000008.webp');
insert into public.campaign_media(id,storage_path,width,height,bytes) values ('60000000-0000-0000-0000-000000000008','50000000-0000-0000-0000-000000000001/60000000-0000-0000-0000-000000000008.webp',400,200,1000);
reset role;
set local role anon;
do $$ begin
  if exists(select 1 from storage.objects where bucket_id='campaign-images') then raise exception 'Draft artwork is public'; end if;
end $$;
reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '50000000-0000-0000-0000-000000000001', true);
update public.campaign_banners set desktop_image_url='/api/campaign-media/50000000-0000-0000-0000-000000000001/60000000-0000-0000-0000-000000000008.webp' where id='60000000-0000-0000-0000-000000000001';
reset role;
set local role anon;
do $$ begin
  if not exists(select 1 from storage.objects where bucket_id='campaign-images') then raise exception 'Published artwork is unavailable'; end if;
end $$;
reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '50000000-0000-0000-0000-000000000001', true);
update public.campaign_banners set status='archived' where id='60000000-0000-0000-0000-000000000001';
reset role;
set local role anon;
do $$ begin
  if exists(select 1 from public.campaign_banners where id='60000000-0000-0000-0000-000000000001') then raise exception 'Archived campaign remains public'; end if;
  if exists(select 1 from storage.objects where bucket_id='campaign-images') then raise exception 'Archived artwork remains public'; end if;
  if has_table_privilege(current_user,'public.campaign_media','SELECT') then raise exception 'Anonymous visitor can read media audit metadata'; end if;
end $$;
reset role;
do $$ begin
  if not exists(select 1 from public.audit_log where actor_id='50000000-0000-0000-0000-000000000001' and target_id='60000000-0000-0000-0000-000000000008' and action='campaign_media.insert') then raise exception 'Media upload audit missing'; end if;
end $$;
rollback;
