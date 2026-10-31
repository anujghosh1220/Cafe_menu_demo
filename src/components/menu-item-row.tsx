"use client";
import { useCart } from "@/components/cart-provider";
import { formatINR } from "@/lib/format-currency";
import type { MenuItem } from "@/data/menu";

export function MenuItemRow({ item }: { item: MenuItem }) {
  const { add } = useCart();
  return (
    <div id={item.id} className="group flex items-start justify-between gap-4 py-4 border-b border-[#D5B47A]/20 hover:bg-[#FFF2E7] transition rounded-lg px-2">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-[#342025]">{item.name}</span>
          {item.vegetarian && (
            <span className="inline-block w-2 h-2 rounded-full bg-green-700 border border-green-900" aria-label="Vegetarian" title="Vegetarian" />
          )}
        </div>
        <p className="text-sm text-[#5A4A4D] mt-1">{item.description}</p>
      </div>
      <div className="text-right flex flex-col items-end gap-2">
        <span className="text-[#512B32] font-serif tabular-nums whitespace-nowrap">{formatINR(item.price)}</span>
        <button onClick={() => add(item.id)} className="text-xs px-3 py-1.5 bg-[#512B32] text-[#FFF2E7] rounded-full hover:bg-[#342025] transition active:scale-95">Add</button>
      </div>
    </div>
  );
}
