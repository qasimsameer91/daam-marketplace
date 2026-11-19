-- Draft artwork stays private. Publishing a campaign makes only its referenced
-- objects readable; pausing/archiving/expiry revokes that access automatically.
update storage.buckets set public=false where id='campaign-images';
create function public.campaign_media_is_public(p_path text) returns boolean
language sql stable set search_path=pg_catalog,public as $$
  select exists(select 1 from public.campaign_banners c
    where c.status='published' and c.is_active=true and c.approved_at is not null
      and c.starts_at<=now() and c.ends_at>now()
      and ('/api/campaign-media/'||p_path in (c.desktop_image_url,c.mobile_image_url)));
$$;
revoke all on function public.campaign_media_is_public(text) from public;
grant execute on function public.campaign_media_is_public(text) to anon,authenticated;
drop policy campaign_images_public_read on storage.objects;
create policy campaign_images_published_read on storage.objects for select to anon,authenticated
  using(bucket_id='campaign-images' and public.campaign_media_is_public(name));
create policy campaign_images_admin_read on storage.objects for select to authenticated
  using(bucket_id='campaign-images' and public.is_admin());
