insert into storage.buckets (id, name, public) values
  ('listing-images', 'listing-images', true),
  ('verification-docs', 'verification-docs', false),
  ('payment-proofs', 'payment-proofs', false),
  ('chat-attachments', 'chat-attachments', false)
on conflict (id) do nothing;
do $$ begin
  if not exists (select 1 from storage.buckets where id = 'listing-images' and public = true)
     or (select count(*) from storage.buckets where id in ('verification-docs', 'payment-proofs', 'chat-attachments') and public = false) <> 3 then
    raise exception 'Existing storage bucket visibility conflicts with the required privacy settings';
  end if;
end $$;

create function public.is_admin() returns boolean
language sql stable security definer set search_path = pg_catalog, public as $$
  select auth.uid() is not null and exists (
    select 1 from public.profiles p where p.id = auth.uid()
      and p.role in ('admin', 'super_admin') and p.is_suspended is not true
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- User-owned files use <user UUID>/<filename>. Never allow root-level objects.
create policy listing_images_public_read on storage.objects for select to anon, authenticated
  using (bucket_id = 'listing-images');
create policy listing_images_owner_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'listing-images' and position('/' in name) > 0 and split_part(name, '/', 1) = (select auth.uid())::text);
create policy listing_images_owner_update on storage.objects for update to authenticated
  using (bucket_id = 'listing-images' and position('/' in name) > 0 and split_part(name, '/', 1) = (select auth.uid())::text)
  with check (bucket_id = 'listing-images' and position('/' in name) > 0 and split_part(name, '/', 1) = (select auth.uid())::text);
create policy listing_images_owner_delete on storage.objects for delete to authenticated
  using (bucket_id = 'listing-images' and position('/' in name) > 0 and split_part(name, '/', 1) = (select auth.uid())::text);

create policy private_documents_read on storage.objects for select to authenticated
  using (bucket_id in ('verification-docs', 'payment-proofs') and
    ((position('/' in name) > 0 and split_part(name, '/', 1) = (select auth.uid())::text) or public.is_admin()));
create policy private_documents_insert on storage.objects for insert to authenticated
  with check (bucket_id in ('verification-docs', 'payment-proofs') and position('/' in name) > 0 and split_part(name, '/', 1) = (select auth.uid())::text);
create policy private_documents_delete on storage.objects for delete to authenticated
  using (bucket_id in ('verification-docs', 'payment-proofs') and position('/' in name) > 0 and split_part(name, '/', 1) = (select auth.uid())::text);

-- Chat attachment paths are <conversation UUID>/<filename>. A CASE protects
-- the UUID cast from malformed object names and denies access on bad input.
create function public.can_access_chat_path(p_path text) returns boolean
language sql stable set search_path = pg_catalog, public as $$
  select case when position('/' in p_path) > 0 and split_part(p_path, '/', 1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    then public.can_access_conversation(split_part(p_path, '/', 1)::uuid) else false end;
$$;
revoke all on function public.can_access_chat_path(text) from public;
grant execute on function public.can_access_chat_path(text) to authenticated;
create policy chat_attachments_read on storage.objects for select to authenticated
  using (bucket_id = 'chat-attachments' and public.can_access_chat_path(name));
create policy chat_attachments_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'chat-attachments' and public.can_access_chat_path(name));
create policy chat_attachments_delete on storage.objects for delete to authenticated
  using (bucket_id = 'chat-attachments' and owner_id = (select auth.uid())::text and public.can_access_chat_path(name));
