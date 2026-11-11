-- Transactional policy tests. Requires seeded brands and local Supabase auth/storage.
begin;
insert into auth.users (id) values
  ('20000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000002'),
  ('20000000-0000-0000-0000-000000000003'),
  ('20000000-0000-0000-0000-000000000004'),
  ('20000000-0000-0000-0000-000000000005');
insert into public.profiles (id, display_name, phone_e164, role) values
  ('20000000-0000-0000-0000-000000000001', 'Seller fixture', 'fixture-seller', 'user'),
  ('20000000-0000-0000-0000-000000000002', 'Buyer fixture', 'fixture-buyer', 'user'),
  ('20000000-0000-0000-0000-000000000003', 'Other fixture', 'fixture-other', 'user'),
  ('20000000-0000-0000-0000-000000000004', 'Moderator fixture', 'fixture-moderator', 'moderator'),
  ('20000000-0000-0000-0000-000000000005', 'Admin fixture', 'fixture-admin', 'admin');
insert into public.listings (id, short_id, slug, seller_id, title, price_pkr, condition, status) values
  ('30000000-0000-0000-0000-000000000001', 'policy01', 'policy-active', '20000000-0000-0000-0000-000000000001', 'Policy fixture', 1000, 'used', 'active'),
  ('30000000-0000-0000-0000-000000000002', 'policy02', 'policy-draft', '20000000-0000-0000-0000-000000000001', 'Draft fixture', 1000, 'used', 'draft');
insert into public.listings (id, short_id, slug, seller_id, buyer_id, title, price_pkr, condition, status) values
  ('30000000-0000-0000-0000-000000000003', 'policy04', 'policy-sold', '20000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 'Sold fixture', 1000, 'used', 'sold');
insert into public.conversations (id, listing_id, buyer_id, seller_id) values
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001');
insert into public.listing_images (listing_id, storage_path) values
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001/locked.webp');
insert into storage.objects (bucket_id, name) values
  ('listing-images', '20000000-0000-0000-0000-000000000001/locked.webp');
update public.listings set cover_image_path = '20000000-0000-0000-0000-000000000001/missing.webp'
  where id = '30000000-0000-0000-0000-000000000001';
do $$ begin
  if (select count(*) from storage.buckets where id in ('verification-docs', 'payment-proofs', 'chat-attachments') and public = false) <> 3
     or not exists (select 1 from storage.buckets where id = 'listing-images' and public = true) then
    raise exception 'Storage bucket visibility is incorrect';
  end if;
end $$;

set local role authenticated;
select set_config('request.jwt.claim.sub', '20000000-0000-0000-0000-000000000002', true);
do $$
declare affected int;
begin
  if (select count(*) from public.conversations where id = '40000000-0000-0000-0000-000000000001') <> 1 then
    raise exception 'Buyer cannot read own conversation';
  end if;
  if has_column_privilege(current_user, 'public.shops', 'tier', 'UPDATE')
     or has_column_privilege(current_user, 'public.verification_requests', 'status', 'UPDATE') then
    raise exception 'User can change protected verification or shop status';
  end if;
  insert into public.verification_requests (user_id, kind, documents, cnic_last4)
    values (auth.uid(), 'individual_id', '["20000000-0000-0000-0000-000000000002/document.webp"]'::jsonb, '1234');
  begin
    insert into public.verification_requests (user_id, kind, documents)
      values (auth.uid(), 'individual_id', '["20000000-0000-0000-0000-000000000001/document.webp"]'::jsonb);
    raise exception 'Verification accepted another user document path';
  exception when insufficient_privilege then null; end;
  insert into public.reports (reporter_id, target_type, listing_id, reason)
    values (auth.uid(), 'listing', '30000000-0000-0000-0000-000000000001', 'other');
  perform public.submit_review('30000000-0000-0000-0000-000000000003', 5::smallint, array['as_described'], 'Policy fixture');
  begin
    insert into public.reports (reporter_id, target_type, listing_id, reason)
      values ('20000000-0000-0000-0000-000000000001', 'listing', '30000000-0000-0000-0000-000000000001', 'other');
    raise exception 'User submitted a report as another user';
  exception when insufficient_privilege then null; end;
  insert into public.messages (conversation_id, sender_id, kind, body)
    values ('40000000-0000-0000-0000-000000000001', auth.uid(), 'text', 'Policy fixture');
  insert into storage.objects (bucket_id, name)
    values ('chat-attachments', '40000000-0000-0000-0000-000000000001/example.webp');
  insert into public.messages (conversation_id, sender_id, kind, attachment_path)
    values ('40000000-0000-0000-0000-000000000001', auth.uid(), 'image', '40000000-0000-0000-0000-000000000001/example.webp');
  begin
    insert into public.messages (conversation_id, sender_id, kind, attachment_path)
      values ('40000000-0000-0000-0000-000000000001', auth.uid(), 'image', '40000000-0000-0000-0000-000000000099/private.webp');
    raise exception 'Image message referenced another conversation';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.messages (conversation_id, sender_id, kind, attachment_path)
      values ('40000000-0000-0000-0000-000000000001', auth.uid(), 'image', '40000000-0000-0000-0000-000000000001/missing.webp');
    raise exception 'Image message referenced a missing object';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.messages (conversation_id, sender_id, kind, body)
      values ('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'text', 'Impersonation');
    raise exception 'Message sender spoof was accepted';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.listings (seller_id, short_id, slug, title, price_pkr, condition, status)
      values (auth.uid(), 'policy03', 'policy-direct-active', 'Fixture', 1000, 'used', 'active');
    raise exception 'Seller could directly publish a listing';
  exception when insufficient_privilege then null; end;
  update public.listings set title = 'Unauthorized' where id = '30000000-0000-0000-0000-000000000002';
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Buyer changed another seller listing'; end if;
  begin
    perform public.moderate_listing('30000000-0000-0000-0000-000000000002', 'active', null);
    raise exception 'Non-moderator could moderate';
  exception when insufficient_privilege then null; end;
  begin
    perform public.moderation_listing('30000000-0000-0000-0000-000000000002');
    raise exception 'Non-moderator accessed moderation details';
  exception when insufficient_privilege then null; end;
end $$;

select set_config('request.jwt.claim.sub', '20000000-0000-0000-0000-000000000001', true);
do $$
declare affected integer;
begin
  insert into storage.objects (bucket_id, name)
    values ('listing-images', '20000000-0000-0000-0000-000000000001/example.webp'),
           ('verification-docs', '20000000-0000-0000-0000-000000000001/id.webp');
  update storage.objects set name = name where bucket_id = 'listing-images' and name = '20000000-0000-0000-0000-000000000001/locked.webp';
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Reviewed image was replaced'; end if;
  delete from storage.objects where bucket_id = 'listing-images' and name = '20000000-0000-0000-0000-000000000001/locked.webp';
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Reviewed image was deleted'; end if;
  begin
    insert into storage.objects (bucket_id, name)
      values ('listing-images', '20000000-0000-0000-0000-000000000001/missing.webp');
    raise exception 'Reviewed image path was reused';
  exception when insufficient_privilege then null; end;
  begin
    insert into storage.objects (bucket_id, name)
      values ('verification-docs', '20000000-0000-0000-0000-000000000002/forged.webp');
    raise exception 'User uploaded to another owner folder';
  exception when insufficient_privilege then null; end;
  insert into public.listing_images (listing_id, storage_path)
    values ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001/example.webp');
  begin
    insert into public.listing_images (listing_id, storage_path)
      values ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001/example.webp');
    raise exception 'Seller changed images on an active listing';
  exception when insufficient_privilege then null; end;
  begin
    update public.listings set title = 'Changed after approval' where id = '30000000-0000-0000-0000-000000000001';
    raise exception 'Seller changed a published listing without review';
  exception when insufficient_privilege then null; end;
  begin
    update public.listings set status = 'active' where id = '30000000-0000-0000-0000-000000000002';
    raise exception 'Seller could approve own draft';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.conversations (listing_id, buyer_id, seller_id)
      values ('30000000-0000-0000-0000-000000000001', auth.uid(), auth.uid());
    raise exception 'Seller could message own listing';
  exception when insufficient_privilege then null; end;
end $$;

select set_config('request.jwt.claim.sub', '20000000-0000-0000-0000-000000000003', true);
do $$ begin
  if exists (select 1 from public.conversations where id = '40000000-0000-0000-0000-000000000001')
     or exists (select 1 from public.messages where conversation_id = '40000000-0000-0000-0000-000000000001')
     or exists (select 1 from storage.objects where bucket_id in ('verification-docs', 'chat-attachments')) then
    raise exception 'Nonparticipant can see a conversation';
  end if;
  begin
    perform public.submit_review('30000000-0000-0000-0000-000000000003', 5::smallint, null, null);
    raise exception 'Nonparticipant could review a sale';
  exception when insufficient_privilege then null; end;
end $$;

select set_config('request.jwt.claim.sub', '20000000-0000-0000-0000-000000000002', true);
insert into public.blocks (blocker_id, blocked_id)
  values ('20000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001');
select set_config('request.jwt.claim.sub', '20000000-0000-0000-0000-000000000001', true);
do $$ begin
  if exists (select 1 from public.conversations where id = '40000000-0000-0000-0000-000000000001')
     or exists (select 1 from storage.objects where bucket_id = 'chat-attachments') then
    raise exception 'Block did not hide conversation from the other participant';
  end if;
  begin
    insert into public.messages (conversation_id, sender_id, kind, body)
      values ('40000000-0000-0000-0000-000000000001', auth.uid(), 'text', 'Blocked');
    raise exception 'Blocked participant could send message';
  exception when insufficient_privilege then null; end;
end $$;

select set_config('request.jwt.claim.sub', '20000000-0000-0000-0000-000000000004', true);
do $$ begin
  if not exists (select 1 from public.moderation_listing('30000000-0000-0000-0000-000000000002')) then
    raise exception 'Moderator cannot inspect draft';
  end if;
end $$;
select public.moderate_listing('30000000-0000-0000-0000-000000000002', 'active', 'Policy fixture');
select public.moderate_report((select id from public.reports where reporter_id = '20000000-0000-0000-0000-000000000002' limit 1), 'actioned', 'Policy fixture');
select set_config('request.jwt.claim.sub', '20000000-0000-0000-0000-000000000005', true);
update public.content_blocks set body_en = body_en || ' fixture' where key = 'pta_status.pta_approved';
reset role;
do $$ begin
  if not exists (select 1 from public.audit_log where actor_id = '20000000-0000-0000-0000-000000000004' and target_id = '30000000-0000-0000-0000-000000000002' and action = 'listing.status') then
    raise exception 'Moderation action was not audited';
  end if;
  if not exists (select 1 from public.audit_log where actor_id = '20000000-0000-0000-0000-000000000004' and action = 'report.status')
     or not exists (select 1 from public.audit_log where actor_id = '20000000-0000-0000-0000-000000000005' and action = 'content_blocks.update') then
    raise exception 'Report or admin catalog change was not audited';
  end if;
end $$;
set local role anon;
do $$ begin
  if (select count(*) from storage.objects where bucket_id = 'listing-images' and name = '20000000-0000-0000-0000-000000000001/example.webp') <> 1
     or exists (select 1 from storage.objects where bucket_id = 'verification-docs' and name = '20000000-0000-0000-0000-000000000001/id.webp') then
    raise exception 'Anonymous storage visibility is incorrect';
  end if;
end $$;
reset role;
rollback;
