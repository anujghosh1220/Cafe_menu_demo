-- Minimal, safe migration for existing cafe_settings schema (id is boolean)
-- Ensure singleton row exists without overwriting whatsapp_number
insert into public.cafe_settings (id, whatsapp_number)
values (true, null)
on conflict (id) do nothing;
EOF