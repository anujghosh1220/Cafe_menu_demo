create table if not exists public.chef_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique,
  name text not null,
  email text not null unique,
  active boolean not null default true
);

alter table public.chef_accounts enable row level security;

create policy "chef_accounts_read_admin" on public.chef_accounts for select to authenticated
  using (auth.uid() = '8102fac5-eae6-4c8e-8062-488454f2ad3f'::uuid);

create policy "chef_accounts_write_admin" on public.chef_accounts for all to authenticated
  using (auth.uid() = '8102fac5-eae6-4c8e-8062-488454f2ad3f'::uuid)
  with check (auth.uid() = '8102fac5-eae6-4c8e-8062-488454f2ad3f'::uuid);
EOF