grant insert (owner_id, name, slug, logo_url, cover_url, description, market_name,
  address, city_id, area_id, lat, lng, maps_url, phone_e164, whatsapp_e164, opening_hours)
  on public.shops to authenticated;
grant update (name, slug, logo_url, cover_url, description, market_name, address,
  city_id, area_id, lat, lng, maps_url, phone_e164, whatsapp_e164, opening_hours)
  on public.shops to authenticated;
create policy shops_insert_owner on public.shops for insert to authenticated
  with check (owner_id = (select auth.uid()));
create policy shops_update_owner on public.shops for update to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));

create function public.owns_verification_paths(p_documents jsonb, p_user uuid) returns boolean
language sql immutable set search_path = pg_catalog as $$
  select case when jsonb_typeof(p_documents) = 'array' then
    jsonb_array_length(p_documents) between 1 and 10 and not exists (
      select 1 from jsonb_array_elements(p_documents) doc
      where jsonb_typeof(doc) <> 'string' or (doc #>> '{}') not like p_user::text || '/%'
    ) else false end;
$$;
revoke all on function public.owns_verification_paths(jsonb, uuid) from public;
grant execute on function public.owns_verification_paths(jsonb, uuid) to authenticated;
grant insert (user_id, shop_id, kind, documents, cnic_last4) on public.verification_requests to authenticated;
create policy verification_insert_own on public.verification_requests for insert to authenticated
  with check (
    user_id = (select auth.uid()) and public.owns_verification_paths(documents, (select auth.uid())) and
    ((kind = 'individual_id' and shop_id is null) or
     (kind = 'shop' and exists (select 1 from public.shops s where s.id = shop_id and s.owner_id = (select auth.uid()))))
    and (cnic_last4 is null or cnic_last4 ~ '^[0-9]{4}$')
  );

grant insert (reporter_id, target_type, listing_id, user_id, message_id, reason, details)
  on public.reports to authenticated;
create policy reports_insert_own on public.reports for insert to authenticated
  with check (
    reporter_id = (select auth.uid()) and num_nonnulls(listing_id, user_id, message_id) = 1 and
    ((target_type = 'listing' and listing_id is not null and exists (select 1 from public.listings l where l.id = listing_id)) or
     (target_type = 'user' and user_id is not null and exists (select 1 from public.public_profiles p where p.id = user_id)) or
     (target_type = 'message' and message_id is not null and exists (select 1 from public.messages m where m.id = message_id)))
  );

grant update (read_at) on public.notifications to authenticated;
create policy notifications_mark_own on public.notifications for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
grant insert (user_id, query, notify), update (query, notify), delete
  on public.saved_searches to authenticated;
create policy saved_searches_insert_own on public.saved_searches for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy saved_searches_update_own on public.saved_searches for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy saved_searches_delete_own on public.saved_searches for delete to authenticated
  using (user_id = (select auth.uid()));
