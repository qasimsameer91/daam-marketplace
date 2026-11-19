-- Additive editorial CMS extension. Existing campaigns and listing media are preserved.
alter table public.campaign_banners drop constraint campaign_banners_status_check;
alter table public.campaign_banners add constraint campaign_banners_status_check check (status in ('draft','published','archived'));
alter table public.campaign_banners drop constraint campaign_banners_theme_check;
alter table public.campaign_banners add constraint campaign_banners_theme_check check (theme in ('dark','light','lime','sand','pearl'));
alter table public.campaign_banners alter column theme set default 'light';

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('campaign-images','campaign-images',true,4194304,array['image/webp'])
on conflict (id) do nothing;

create table public.campaign_media (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique check (storage_path ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.webp$'),
  width integer not null check (width between 1 and 2400),
  height integer not null check (height between 1 and 2400),
  bytes integer not null check (bytes between 1 and 4194304),
  created_by uuid not null default auth.uid() references public.profiles(id),
  created_at timestamptz not null default now()
);
alter table public.campaign_media enable row level security;
revoke all on public.campaign_media from public, anon, authenticated;
grant select,insert,delete on public.campaign_media to authenticated;
create policy campaign_media_admin_read on public.campaign_media for select to authenticated using (public.is_admin());
create policy campaign_media_admin_insert on public.campaign_media for insert to authenticated
  with check (public.is_admin() and created_by=auth.uid() and split_part(storage_path,'/',1)=auth.uid()::text);
create policy campaign_media_admin_delete on public.campaign_media for delete to authenticated using (public.is_admin());
create trigger audit_admin_change after insert or delete on public.campaign_media for each row execute function public.audit_admin_change();

create policy campaign_images_public_read on storage.objects for select to anon,authenticated using (bucket_id='campaign-images');
create policy campaign_images_admin_insert on storage.objects for insert to authenticated
  with check (bucket_id='campaign-images' and public.is_admin() and split_part(name,'/',1)=auth.uid()::text
    and name ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.webp$');
create policy campaign_images_admin_delete on storage.objects for delete to authenticated using (bucket_id='campaign-images' and public.is_admin());
