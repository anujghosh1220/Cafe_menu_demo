"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { loadCart, saveCart, addItem, updateQty, removeItem } from "@/lib/cart";
import type { CartLine } from "@/lib/cart";

type CartContextValue = {
  lines: CartLine[];
  add: (itemId: string) => void;
  setQty: (itemId: string, qty: number) => void;
  remove: (itemId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    setLines(loadCart());
  }, []);

  useEffect(() => {
    saveCart(lines);
  }, [lines]);

  const value: CartContextValue = {
    lines,
    add: (id) => setLines((prev) => addItem(prev, id)),
    setQty: (id, qty) => setLines((prev) => updateQty(prev, id, qty)),
    remove: (id) => setLines((prev) => removeItem(prev, id)),
    clear: () => setLines([]),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
