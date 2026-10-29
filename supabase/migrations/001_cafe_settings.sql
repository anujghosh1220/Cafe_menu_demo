-- Idempotent, safe migration for cafe_settings
create table if not exists public.cafe_settings (
  id int primary key default 1,
  whatsapp_number text
);

alter table public.cafe_settings enable row level security;

-- Remove any existing policies on this table (including unknown/overly broad ones)
do $$
declare pol record;
begin
  for pol in
    select policyname from pg_policies where schemaname='public' and tablename='cafe_settings'
  loop
    execute format('drop policy if exists %I on public.cafe_settings', pol.policyname);
  end loop;
end $$;

-- Public read
create policy "cafe_settings_public_read"
  on public.cafe_settings for select
  to anon, authenticated
  using (true);

-- Admin-only write (UUID-specific)
create policy "cafe_settings_admin_write"
  on public.cafe_settings for all
  to authenticated
  using (auth.uid() = '8102fac5-eae6-4c8e-8062-488454f2ad3f'::uuid)
  with check (auth.uid() = '8102fac5-eae6-4c8e-8062-488454f2ad3f'::uuid);

-- Ensure singleton row exists without overwriting
insert into public.cafe_settings (id, whatsapp_number)
values (1, null)
on conflict (id) do nothing;

grant select on public.cafe_settings to anon, authenticated;
grant insert, update, delete on public.cafe_settings to authenticated;
EOF