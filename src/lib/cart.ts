export type CartLine = { itemId: string; quantity: number };

export const CART_STORAGE_KEY = "maison-elise-cart-v1";

export function loadCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x) => x && typeof x.itemId === "string" && Number.isInteger(x.quantity) && x.quantity > 0)
      .map((x) => ({ itemId: x.itemId, quantity: x.quantity }));
  } catch {
    return [];
  }
}

export function saveCart(lines: CartLine[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
}

export function addItem(lines: CartLine[], itemId: string): CartLine[] {
  const existing = lines.find((l) => l.itemId === itemId);
  if (existing) return lines.map((l) => (l.itemId === itemId ? { ...l, quantity: l.quantity + 1 } : l));
  return [...lines, { itemId, quantity: 1 }];
}

export function updateQty(lines: CartLine[], itemId: string, qty: number): CartLine[] {
  if (qty <= 0) return lines.filter((l) => l.itemId !== itemId);
  return lines.map((l) => (l.itemId === itemId ? { ...l, quantity: qty } : l));
}

export function removeItem(lines: CartLine[], itemId: string): CartLine[] {
  return lines.filter((l) => l.itemId !== itemId);
}
