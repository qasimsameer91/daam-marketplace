-- Security-definer predicates avoid recursive RLS and inspect both directions
-- of a block without exposing other people's block records.
create function public.can_open_conversation(p_listing_id uuid, p_seller_id uuid)
returns boolean language sql stable security definer set search_path = pg_catalog, public as $$
  select auth.uid() is not null and exists (
    select 1 from public.listings l
    where l.id = p_listing_id and l.seller_id = p_seller_id and l.status = 'active'
      and l.seller_id <> auth.uid()
      and not exists (select 1 from public.blocks b where
        (b.blocker_id = auth.uid() and b.blocked_id = l.seller_id) or
        (b.blocker_id = l.seller_id and b.blocked_id = auth.uid()))
  );
$$;
create function public.can_access_conversation(p_conversation_id uuid)
returns boolean language sql stable security definer set search_path = pg_catalog, public as $$
  select auth.uid() is not null and exists (
    select 1 from public.conversations c
    where c.id = p_conversation_id and auth.uid() in (c.buyer_id, c.seller_id)
      and not exists (select 1 from public.blocks b where
        (b.blocker_id = c.buyer_id and b.blocked_id = c.seller_id) or
        (b.blocker_id = c.seller_id and b.blocked_id = c.buyer_id))
  );
$$;
revoke all on function public.can_open_conversation(uuid, uuid) from public;
revoke all on function public.can_access_conversation(uuid) from public;
grant execute on function public.can_open_conversation(uuid, uuid) to authenticated;
grant execute on function public.can_access_conversation(uuid) to authenticated;

grant insert (blocker_id, blocked_id), delete on public.blocks to authenticated;
create policy blocks_insert_own on public.blocks for insert to authenticated
  with check (blocker_id = (select auth.uid()) and blocker_id <> blocked_id);
create policy blocks_delete_own on public.blocks for delete to authenticated
  using (blocker_id = (select auth.uid()));

grant select on public.conversations, public.messages to authenticated;
grant insert (listing_id, buyer_id, seller_id) on public.conversations to authenticated;
create policy conversation_read_participant on public.conversations for select to authenticated
  using (public.can_access_conversation(id));
create policy conversation_insert_buyer on public.conversations for insert to authenticated
  with check (buyer_id = (select auth.uid()) and public.can_open_conversation(listing_id, seller_id));

grant insert (conversation_id, sender_id, kind, body, offer_pkr, attachment_path)
  on public.messages to authenticated;
create policy messages_read_participant on public.messages for select to authenticated
  using (public.can_access_conversation(conversation_id));
create policy messages_insert_participant on public.messages for insert to authenticated
  with check (
    sender_id = (select auth.uid()) and public.can_access_conversation(conversation_id)
    and kind in ('text', 'image', 'offer')
    and (kind <> 'offer' or (offer_pkr > 0 and offer_pkr <= 2000000))
  );
