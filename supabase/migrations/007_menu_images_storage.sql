-- Run after creating the 'menu-images' bucket in Supabase Dashboard
-- Bucket: menu-images, public = true, file size limit 5MB
-- Allowed MIME types: image/jpeg, image/png, image/webp

drop policy if exists "menu_images_public_read" on storage.objects;
create policy "menu_images_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'menu-images');

drop policy if exists "menu_images_admin_insert" on storage.objects;
create policy "menu_images_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'menu-images' and auth.uid() = '8102fac5-eae6-4c8e-8062-488454f2ad3f'::uuid);

drop policy if exists "menu_images_admin_update" on storage.objects;
create policy "menu_images_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'menu-images' and auth.uid() = '8102fac5-eae6-4c8e-8062-488454f2ad3f'::uuid)
  with check (bucket_id = 'menu-images' and auth.uid() = '8102fac5-eae6-4c8e-8062-488454f2ad3f'::uuid);

drop policy if exists "menu_images_admin_delete" on storage.objects;
create policy "menu_images_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'menu-images' and auth.uid() = '8102fac5-eae6-4c8e-8062-488454f2ad3f'::uuid);
EOF