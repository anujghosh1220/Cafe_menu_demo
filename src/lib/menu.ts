import { createClient } from "@/lib/supabase/client";

export type MenuItemRow = {
  id: string;
  name: string;
  price: number;
  category: string | null;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
};

export async function fetchMenuItems() {
  const supabase = createClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("menu_items").select("*").order("sort_order", { ascending: true });
  if (error) throw error;
  return (data || []) as MenuItemRow[];
}

export async function createMenuItem(item: Partial<MenuItemRow>) {
  const supabase = createClient();
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase.from("menu_items").insert(item).select().single();
  if (error) throw error;
  return data as MenuItemRow;
}

export async function updateMenuItem(id: string, updates: Partial<MenuItemRow>) {
  const supabase = createClient();
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase.from("menu_items").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data as MenuItemRow;
}

export async function deleteMenuItem(id: string) {
  const supabase = createClient();
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw error;
}