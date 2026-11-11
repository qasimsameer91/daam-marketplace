-- Administrative catalog changes are RLS-gated and audited in the same transaction.
create function public.audit_admin_change() returns trigger
language plpgsql security definer set search_path = pg_catalog, public as $$
declare old_data jsonb; new_data jsonb; target text;
begin
  -- Migrations/seed run directly as postgres without an actor. Application
  -- requests (including service requests) do not use that database session.
  if session_user = 'postgres' and auth.uid() is null then
    if tg_op = 'DELETE' then return old; end if;
    return new;
  end if;
  old_data := case when tg_op <> 'INSERT' then to_jsonb(old) else null end;
  new_data := case when tg_op <> 'DELETE' then to_jsonb(new) else null end;
  target := coalesce(new_data->>'id', old_data->>'id', new_data->>'key', old_data->>'key');
  insert into public.audit_log(actor_id, action, target_type, target_id, before, after)
    values (auth.uid(), lower(tg_table_name || '.' || tg_op), tg_table_name, target, old_data, new_data);
  if tg_op = 'DELETE' then return old; end if;
  return new;
end $$;
revoke all on function public.audit_admin_change() from public;

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'cities', 'areas', 'brands', 'series', 'models', 'model_aliases',
    'model_variants', 'model_colors', 'content_blocks', 'price_references',
    'app_settings', 'payments', 'promotions'
  ] loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', table_name);
    execute format('create policy admin_manage on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', table_name);
    execute format('create trigger audit_admin_change after insert or update or delete on public.%I for each row execute function public.audit_admin_change()', table_name);
  end loop;
end $$;
-- Serial IDs use sequences; RLS on the target tables still limits inserts.
grant usage, select on all sequences in schema public to authenticated;

-- Report moderation cannot be forged by choosing handled_by or status fields.
create function public.moderate_report(p_report_id uuid, p_status public.report_status, p_note text)
returns void language plpgsql security definer set search_path = pg_catalog, public as $$
declare actor uuid := auth.uid(); previous public.report_status;
begin
  if not public.is_moderator() then raise exception 'Moderator access required' using errcode = '42501'; end if;
  if p_note is not null and char_length(p_note) > 2000 then raise exception 'Moderation note too long' using errcode = '22001'; end if;
  select status into previous from public.reports where id = p_report_id for update;
  if not found then raise exception 'Report not found' using errcode = 'P0002'; end if;
  update public.reports set status = p_status, handled_by = actor, handled_at = now(), resolution_note = p_note where id = p_report_id;
  insert into public.audit_log(actor_id, action, target_type, target_id, before, after)
    values(actor, 'report.status', 'report', p_report_id::text,
      jsonb_build_object('status', previous), jsonb_build_object('status', p_status));
end $$;
revoke all on function public.moderate_report(uuid, public.report_status, text) from public;
grant execute on function public.moderate_report(uuid, public.report_status, text) to authenticated;

grant select on public.reviews to anon, authenticated;
create policy reviews_read_visible on public.reviews for select to anon, authenticated
  using (is_hidden is not true);
create policy reviews_read_moderator on public.reviews for select to authenticated
  using (public.is_moderator());

-- A review is allowed only when a sold listing records both participants.
create function public.submit_review(p_listing_id uuid, p_rating smallint, p_tags text[], p_comment text)
returns uuid language plpgsql security definer set search_path = pg_catalog, public as $$
declare actor uuid := auth.uid(); item public.listings%rowtype; target uuid; direction text; result uuid;
begin
  if actor is null then raise exception 'Login required' using errcode = '42501'; end if;
  select * into item from public.listings where id = p_listing_id;
  if not found or item.status <> 'sold' or item.buyer_id is null or item.buyer_id = item.seller_id then
    raise exception 'Listing is not eligible for review' using errcode = '42501';
  end if;
  if actor = item.buyer_id then target := item.seller_id; direction := 'buyer_to_seller';
  elsif actor = item.seller_id then target := item.buyer_id; direction := 'seller_to_buyer';
  else raise exception 'Only sale participants can review' using errcode = '42501'; end if;
  insert into public.reviews (listing_id, reviewer_id, reviewee_id, direction, rating, tags, comment)
    values (p_listing_id, actor, target, direction, p_rating, coalesce(p_tags, '{}'), p_comment)
    returning id into result;
  return result;
end $$;
revoke all on function public.submit_review(uuid, smallint, text[], text) from public;
grant execute on function public.submit_review(uuid, smallint, text[], text) to authenticated;
