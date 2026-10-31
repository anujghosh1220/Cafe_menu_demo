create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price int not null,
  category_id text,
  description text,
  image_url text,
  available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.menu_items enable row level security;

create policy "menu_items_read_all" on public.menu_items for select to anon, authenticated using (true);

create policy "menu_items_admin_write" on public.menu_items for all to authenticated
  using (auth.uid() = '8102fac5-eae6-4c8e-8062-488454f2ad3f'::uuid)
  with check (auth.uid() = '8102fac5-eae6-4c8e-8062-488454f2ad3f'::uuid);
EOF