create table if not exists public.homepage_favourites (
  id bigserial primary key,
  menu_item_id text not null,
  display_order int not null default 0,
  unique (menu_item_id)
);

create table if not exists public.perfect_together (
  id bigserial primary key,
  item_a_id text not null,
  item_b_id text not null,
  display_order int not null default 0,
  title text
);

alter table public.homepage_favourites enable row level security;
alter table public.perfect_together enable row level security;

create policy "hf_read" on public.homepage_favourites for select to anon, authenticated using (true);
create policy "hf_write" on public.homepage_favourites for all to authenticated
  using (auth.uid() = '8102fac5-eae6-4c8e-8062-488454f2ad3f'::uuid)
  with check (auth.uid() = '8102fac5-eae6-4c8e-8062-488454f2ad3f'::uuid);

create policy "pt_read" on public.perfect_together for select to anon, authenticated using (true);
create policy "pt_write" on public.perfect_together for all to authenticated
  using (auth.uid() = '8102fac5-eae6-4c8e-8062-488454f2ad3f'::uuid)
  with check (auth.uid() = '8102fac5-eae6-4c8e-8062-488454f2ad3f'::uuid);
EOF