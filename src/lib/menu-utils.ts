import { menuCategories, menuItems } from "@/data/menu";
import type { MenuItem } from "@/data/menu";

export function searchItems(query: string): MenuItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return menuItems;
  return menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q),
  );
}

export function itemsByCategory(categoryId: string): MenuItem[] {
  return menuItems.filter((item) => item.categoryId === categoryId);
}

export { menuCategories };
