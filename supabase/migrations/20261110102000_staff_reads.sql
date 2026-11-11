create function public.is_moderator() returns boolean
language sql stable security definer set search_path = pg_catalog, public as $$
  select auth.uid() is not null and exists (
    select 1 from public.profiles p where p.id = auth.uid()
      and p.role in ('moderator', 'admin', 'super_admin') and p.is_suspended is not true
  );
$$;
revoke all on function public.is_moderator() from public;
grant execute on function public.is_moderator() to authenticated;
create policy listings_read_moderator on public.listings for select to authenticated
  using (public.is_moderator());
create policy reports_read_moderator on public.reports for select to authenticated
  using (public.is_moderator());
create policy verification_read_staff on public.verification_requests for select to authenticated
  using (public.is_admin());

grant select on public.audit_log, public.contact_reveals, public.promotions,
  public.price_references, public.app_settings to authenticated;
create policy audit_read_admin on public.audit_log for select to authenticated using (public.is_admin());
create policy reveals_read_admin on public.contact_reveals for select to authenticated using (public.is_admin());
create policy promotions_read_admin on public.promotions for select to authenticated using (public.is_admin());
create policy prices_read_admin on public.price_references for select to authenticated using (public.is_admin());
create policy settings_read_admin on public.app_settings for select to authenticated using (public.is_admin());
create policy payments_read_admin on public.payments for select to authenticated using (public.is_admin());
