create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  table_number text not null,
  items jsonb not null,
  total int not null,
  special_instructions text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "orders_insert_anon" on public.orders for insert to anon, authenticated with check (true);
create policy "orders_select_admin_chef" on public.orders for select to authenticated using (true);
create policy "orders_update_chef" on public.orders for update to authenticated using (true) with check (true);
EOF