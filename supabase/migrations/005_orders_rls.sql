-- Tighten orders RLS
drop policy if exists "orders_select_admin_chef" on public.orders;
create policy "orders_select_admin_chef"
  on public.orders for select
  to authenticated
  using (
    auth.uid() = '8102fac5-eae6-4c8e-8062-488454f2ad3f'::uuid
    or exists (select 1 from public.chef_accounts c where c.user_id = auth.uid() and c.active = true)
  );

drop policy if exists "orders_update_chef" on public.orders;
create policy "orders_update_chef"
  on public.orders for update
  to authenticated
  using (
    auth.uid() = '8102fac5-eae6-4c8e-8062-488454f2ad3f'::uuid
    or exists (select 1 from public.chef_accounts c where c.user_id = auth.uid() and c.active = true)
  )
  with check (
    auth.uid() = '8102fac5-eae6-4c8e-8062-488454f2ad3f'::uuid
    or exists (select 1 from public.chef_accounts c where c.user_id = auth.uid() and c.active = true)
  );
EOF