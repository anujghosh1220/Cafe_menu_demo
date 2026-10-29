-- Safe, idempotent migration for cafe_settings
create table if not exists public.cafe_settings (
  id int primary key default 1,
  whatsapp_number text
);

alter table public.cafe_settings enable row level security;

-- Public read (anon + authenticated)
drop policy if exists "cafe_settings_public_read" on public.cafe_settings;
create policy "cafe_settings_public_read"
  on public.cafe_settings for select
  to anon, authenticated
  using (true);

-- Admin-only write
drop policy if exists "cafe_settings_admin_write" on public.cafe_settings;
create policy "cafe_settings_admin_write"
  on public.cafe_settings for all
  to authenticated
  using (auth.uid() = '8102fac5-eae6-4c8e-8062-488454f2ad3f'::uuid)
  with check (auth.uid() = '8102fac5-eae6-4c8e-8062-488454f2ad3f'::uuid);

-- Ensure singleton row exists without overwriting
insert into public.cafe_settings (id, whatsapp_number)
values (1, null)
on conflict (id) do nothing;

-- Grants
grant select on public.cafe_settings to anon, authenticated;
grant insert, update, delete on public.cafe_settings to authenticated;
EOF