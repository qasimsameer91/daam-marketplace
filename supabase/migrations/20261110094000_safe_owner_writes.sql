-- Owners may edit ordinary profile fields; role, strikes, verification,
-- suspension, ratings, account type and phone are deliberately excluded.
grant update (username, display_name, avatar_url, city_id, area_id, bio,
  whatsapp_enabled, locale, last_seen_at) on public.profiles to authenticated;
create policy profiles_update_own on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- A user may save an active listing only to their own favourites.
grant insert (user_id, listing_id) on public.favorites to authenticated;
grant delete on public.favorites to authenticated;
create policy favorites_insert_own on public.favorites for insert to authenticated
  with check (
    user_id = (select auth.uid()) and exists (
      select 1 from public.listings l where l.id = listing_id and l.status = 'active'
    )
  );
create policy favorites_delete_own on public.favorites for delete to authenticated
  using (user_id = (select auth.uid()));
