-- Ordinary sellers can only set public listing fields. Verification,
-- promotion, counters, price estimates and moderation fields stay server-owned.
grant insert (seller_id, shop_id, short_id, slug, status, brand_id, model_id,
  variant_id, color_id, custom_brand, custom_model, title, description, price_pkr,
  is_negotiable, pta_status, network_lock, pta_reg_type, imei_last4, condition,
  battery_health, screen_condition, body_condition, box_status, accessories,
  warranty_type, warranty_months_left, repair_history, functional_issues,
  purchase_month, city_id, area_id, contact_chat, contact_whatsapp, contact_call)
on public.listings to authenticated;
grant update (shop_id, slug, status, brand_id, model_id, variant_id, color_id,
  custom_brand, custom_model, title, description, price_pkr, is_negotiable,
  pta_status, network_lock, pta_reg_type, imei_last4, condition, battery_health,
  screen_condition, body_condition, box_status, accessories, warranty_type,
  warranty_months_left, repair_history, functional_issues, purchase_month, city_id,
  area_id, contact_chat, contact_whatsapp, contact_call) on public.listings to authenticated;

create policy listings_insert_own on public.listings for insert to authenticated
  with check (
    seller_id = (select auth.uid()) and status in ('draft', 'pending_review') and
    (shop_id is null or exists (select 1 from public.shops s where s.id = shop_id and s.owner_id = (select auth.uid())))
  );
create policy listings_update_own on public.listings for update to authenticated
  using (seller_id = (select auth.uid()))
  with check (
    seller_id = (select auth.uid()) and
    (shop_id is null or exists (select 1 from public.shops s where s.id = shop_id and s.owner_id = (select auth.uid())))
  );

-- RLS checks row ownership, but cannot compare old/new state. The trigger
-- prevents a seller from publishing, approving or reviving a listing directly.
create function public.check_owner_listing_transition() returns trigger
language plpgsql set search_path = pg_catalog, public as $$
begin
  -- Once a listing leaves draft, changing its content must go through a
  -- moderation-aware server workflow; otherwise verified facts can be swapped
  -- after approval while retaining their old badges.
  if current_user = 'authenticated' and old.status <> 'draft' and
    (to_jsonb(new) - 'status' - 'updated_at' - 'search_vector') is distinct from
    (to_jsonb(old) - 'status' - 'updated_at' - 'search_vector') then
    raise exception 'Published or submitted listing changes require moderation' using errcode = '42501';
  end if;
  if current_user = 'authenticated' and new.status is distinct from old.status and not (
    (old.status = 'draft' and new.status = 'pending_review') or
    (old.status = 'active' and new.status = 'sold')
  ) then
    raise exception 'Listing status transition requires moderation' using errcode = '42501';
  end if;
  return new;
end $$;
create trigger listings_owner_transition before update on public.listings
  for each row execute function public.check_owner_listing_transition();

-- Moderation goes through an audited security-definer function. The role is
-- read from the protected profile row, never from user-controlled JWT metadata.
create function public.moderate_listing(p_listing_id uuid, p_status public.listing_status, p_note text)
returns void language plpgsql security definer set search_path = pg_catalog, public as $$
declare actor uuid := auth.uid(); old_row public.listings%rowtype;
begin
  if actor is null or not exists (
    select 1 from public.profiles p where p.id = actor and p.role in ('moderator', 'admin', 'super_admin') and p.is_suspended is not true
  ) then raise exception 'Moderator access required' using errcode = '42501'; end if;
  if p_note is not null and char_length(p_note) > 2000 then
    raise exception 'Moderation note too long' using errcode = '22001';
  end if;
  select * into old_row from public.listings where id = p_listing_id for update;
  if not found then raise exception 'Listing not found' using errcode = 'P0002'; end if;
  update public.listings set status = p_status, moderation_note = p_note where id = p_listing_id;
  insert into public.audit_log (actor_id, action, target_type, target_id, before, after)
    values (actor, 'listing.status', 'listing', p_listing_id::text,
            jsonb_build_object('status', old_row.status), jsonb_build_object('status', p_status));
end $$;
revoke all on function public.moderate_listing(uuid, public.listing_status, text) from public;
grant execute on function public.moderate_listing(uuid, public.listing_status, text) to authenticated;
