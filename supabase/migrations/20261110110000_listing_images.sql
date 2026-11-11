-- Image rows refer to objects within the owner's listing-images folder. Only
-- draft images may be changed directly; reviewed listings use a later server workflow.
grant insert (listing_id, storage_path, width, height, sort_order),
  update (sort_order), delete on public.listing_images to authenticated;
create policy listing_images_insert_owner on public.listing_images for insert to authenticated
  with check (
    position('/' in storage_path) > 0 and split_part(storage_path, '/', 1) = (select auth.uid())::text
    and exists (select 1 from public.listings l where l.id = listing_id and l.seller_id = (select auth.uid()) and l.status = 'draft')
  );
create policy listing_images_update_owner on public.listing_images for update to authenticated
  using (exists (select 1 from public.listings l where l.id = listing_id and l.seller_id = (select auth.uid()) and l.status = 'draft'))
  with check (exists (select 1 from public.listings l where l.id = listing_id and l.seller_id = (select auth.uid()) and l.status = 'draft'));
create policy listing_images_delete_owner on public.listing_images for delete to authenticated
  using (exists (select 1 from public.listings l where l.id = listing_id and l.seller_id = (select auth.uid()) and l.status = 'draft'));
