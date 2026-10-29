"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { menuCategories as defaultCategories, menuItems as defaultItems } from "@/data/menu";
import type { MenuItem, Category } from "@/data/menu";

export type AdminState = {
  categories: Category[];
  items: MenuItem[];
  tables: { id: string; name: string }[];
  whatsapp: string;
};

const KEY = "maison-elise-admin-v1";

const defaultState: AdminState = {
  categories: defaultCategories,
  items: defaultItems,
  tables: [1,2,3,4,5].map((n) => ({ id: `table-${n}`, name: `Table ${n}` })),
  whatsapp: process.env.NEXT_PUBLIC_CAFE_WHATSAPP_NUMBER || "",
};

export function loadAdmin(): AdminState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items)) return defaultState;
    return { ...defaultState, ...parsed };
  } catch {
    return defaultState;
  }
}

export function saveAdmin(s: AdminState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(s));
}

const Ctx = createContext<{ state: AdminState; setState: (s: AdminState) => void } | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AdminState>(defaultState);
  useEffect(() => { setState(loadAdmin()); }, []);
  useEffect(() => { saveAdmin(state); }, [state]);
  return <Ctx.Provider value={{ state, setState }}>{children}</Ctx.Provider>;
}

export function useAdmin() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdmin");
  return ctx;
}
