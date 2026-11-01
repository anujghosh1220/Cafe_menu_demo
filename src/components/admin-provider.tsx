"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { menuCategories as defaultCategories } from "@/data/menu";
import type { MenuItem, Category } from "@/data/menu";
import { fetchMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from "@/lib/menu";
import type { MenuItemRow } from "@/lib/menu";

export type AdminState = {
  categories: Category[];
  items: MenuItem[];
  tables: { id: string; name: string }[];
  whatsapp: string;
};

const KEY = "maison-elise-admin-v1";

function rowToItem(row: MenuItemRow): MenuItem {
  return {
    id: row.id,
    categoryId: row.category || "",
    name: row.name,
    description: row.description || "",
    price: Number(row.price),
    vegetarian: true,
    available: row.is_available,
  };
}

const defaultState: AdminState = {
  categories: defaultCategories,
  items: [],
  tables: [1,2,3,4,5].map((n) => ({ id: `table-${n}`, name: `Table ${n}` })),
  whatsapp: process.env.NEXT_PUBLIC_CAFE_WHATSAPP_NUMBER || "",
};

const Ctx = createContext<{ state: AdminState; setState: (s: AdminState) => void; loading: boolean; error: string | null; refreshMenu: () => Promise<void>; addMenuItem: (item: Partial<MenuItemRow>) => Promise<void>; updateMenuItemById: (id: string, updates: Partial<MenuItemRow>) => Promise<void>; deleteMenuItemById: (id: string) => Promise<void> } | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AdminState>(defaultState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshMenu = async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchMenuItems();
      setState((prev) => ({ ...prev, items: rows.map(rowToItem) }));
    } catch (e: any) {
      setError(e?.message || "Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // load tables/whatsapp from localStorage
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.tables)) {
          setState((prev) => ({ ...prev, tables: parsed.tables, whatsapp: parsed.whatsapp || prev.whatsapp }));
        }
      }
    } catch {}
    refreshMenu();
  }, []);

  useEffect(() => {
    try { window.localStorage.setItem(KEY, JSON.stringify({ tables: state.tables, whatsapp: state.whatsapp })); } catch {}
  }, [state.tables, state.whatsapp]);

  const addMenuItem = async (item: Partial<MenuItemRow>) => {
    const row = await createMenuItem({ ...item, is_available: true });
    setState((prev) => ({ ...prev, items: [...prev.items, rowToItem(row)] }));
  };

  const updateMenuItemById = async (id: string, updates: Partial<MenuItemRow>) => {
    const row = await updateMenuItem(id, updates);
    setState((prev) => ({ ...prev, items: prev.items.map((i) => (i.id === id ? rowToItem(row) : i)) }));
  };

  const deleteMenuItemById = async (id: string) => {
    await deleteMenuItem(id);
    setState((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== id) }));
  };

  return (
    <Ctx.Provider value={{ state, setState, loading, error, refreshMenu, addMenuItem, updateMenuItemById, deleteMenuItemById }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdmin");
  return ctx;
}
