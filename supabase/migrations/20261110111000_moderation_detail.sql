-- The public listing grant deliberately omits moderation fields. Staff obtain
-- the complete non-IMEI row through this role-checked function instead.
create function public.moderation_listing(p_listing_id uuid)
returns setof public.listings language plpgsql stable security definer
set search_path = pg_catalog, public as $$
begin
  if not public.is_moderator() then
    raise exception 'Moderator access required' using errcode = '42501';
  end if;
  return query select l.* from public.listings l where l.id = p_listing_id;
end $$;
revoke all on function public.moderation_listing(uuid) from public;
grant execute on function public.moderation_listing(uuid) to authenticated;
