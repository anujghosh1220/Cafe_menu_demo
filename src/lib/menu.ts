import { createClient } from "@/lib/supabase/client";
import { menuCategories } from "@/data/menu";

const categoryToDb: Record<string, string> = Object.fromEntries(menuCategories.map((c) => [c.id, c.name]));
const dbToCategory: Record<string, string> = Object.fromEntries(menuCategories.map((c) => [c.name, c.id]));

export function toDbCategory(categoryId: string | null | undefined): string | null {
  if (!categoryId) return null;
  return categoryToDb[categoryId] || categoryId;
}

export function fromDbCategory(dbCategory: string | null | undefined): string {
  if (!dbCategory) return "";
  return dbToCategory[dbCategory] || dbCategory;
}

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
  return (data || []).map((row: any) => ({ ...row, category: fromDbCategory(row.category) })) as MenuItemRow[];
}

export async function createMenuItem(item: Partial<MenuItemRow>) {
  const supabase = createClient();
  if (!supabase) throw new Error("Supabase not configured");
  const payload = { ...item };
  if (payload.category) payload.category = toDbCategory(payload.category);
  const { data, error } = await supabase.from("menu_items").insert(payload).select().single();
  if (error) throw error;
  return { ...data, category: fromDbCategory(data.category) } as MenuItemRow;
}

export async function updateMenuItem(id: string, updates: Partial<MenuItemRow>) {
  const supabase = createClient();
  if (!supabase) throw new Error("Supabase not configured");
  const payload = { ...updates };
  if (payload.category) payload.category = toDbCategory(payload.category);
  const { data, error } = await supabase.from("menu_items").update(payload).eq("id", id).select().single();
  if (error) throw error;
  return { ...data, category: fromDbCategory(data.category) } as MenuItemRow;
}

export async function deleteMenuItem(id: string) {
  const supabase = createClient();
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw error;
}