-- Published/submitted listing images must not be replaced behind a reviewed
-- path. Storage UPDATE (including upsert) is denied; changes use new draft keys.
create function public.can_mutate_listing_image(p_path text) returns boolean
language sql stable security definer set search_path = pg_catalog, public as $$
  select auth.uid() is not null
    and position('/' in p_path) > 0
    and split_part(p_path, '/', 1) = auth.uid()::text
    and not exists (
      select 1 from public.listing_images i join public.listings l on l.id = i.listing_id
      where i.storage_path = p_path and l.status <> 'draft'
    )
    and not exists (
      select 1 from public.listings l where l.cover_image_path = p_path and l.status <> 'draft'
    );
$$;
revoke all on function public.can_mutate_listing_image(text) from public;
grant execute on function public.can_mutate_listing_image(text) to authenticated;

drop policy listing_images_owner_insert on storage.objects;
drop policy listing_images_owner_update on storage.objects;
drop policy listing_images_owner_delete on storage.objects;
create policy listing_images_owner_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'listing-images' and public.can_mutate_listing_image(name));
create policy listing_images_owner_delete on storage.objects for delete to authenticated
  using (bucket_id = 'listing-images' and public.can_mutate_listing_image(name));

-- A participant can reference only an existing attachment in this conversation.
-- This prevents a forged message from making a later service sign a different
-- conversation's object, or an arbitrary private bucket path.
drop policy messages_insert_participant on public.messages;
create policy messages_insert_participant on public.messages for insert to authenticated
  with check (
    sender_id = (select auth.uid()) and public.can_access_conversation(conversation_id)
    and case kind
      when 'text' then body is not null and length(trim(body)) > 0 and attachment_path is null and offer_pkr is null
      when 'offer' then offer_pkr > 0 and offer_pkr <= 2000000 and attachment_path is null
      when 'image' then offer_pkr is null
        and split_part(attachment_path, '/', 1) = conversation_id::text
        and position('/' in attachment_path) > 0
        and exists (select 1 from storage.objects o where o.bucket_id = 'chat-attachments' and o.name = attachment_path)
      else false
    end
  );
