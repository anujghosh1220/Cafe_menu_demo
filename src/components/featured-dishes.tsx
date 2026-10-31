"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { useAdmin } from "@/components/admin-provider";
import { createClient } from "@/lib/supabase/client";
import { formatINR } from "@/lib/format-currency";

export function FeaturedDishes() {
  const { add } = useCart();
  const { state } = useAdmin();
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    supabase.from("homepage_favourites").select("menu_item_id").order("display_order", { ascending: true })
      .then(({ data }) => setIds((data || []).map((d: any) => d.menu_item_id)));
  }, []);

  const items = ids.map((id) => state.items.find((m) => m.id === id)).filter(Boolean) as any;
  if (items.length === 0) return null;

  return (
    <section className="py-10">
      <h2 className="font-serif text-2xl text-[#512B32]">Maison Élise Favourites</h2>
      <p className="text-sm text-[#5A4A4D] mt-1">A few things we think you'll love.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {items.map((item: any) => (
          <a key={item.id} href={`#${item.id}`} className="border border-[#D5B47A]/40 p-4 block bg-[#FFF2E7] rounded-xl hover:shadow-lg transition">
            <span className="text-[10px] uppercase tracking-widest text-[#512B32]">House Favourite</span>
            <h3 className="font-medium text-[#342025] mt-2">{item.name}</h3>
            <p className="text-sm text-[#5A4A4D] mt-1 line-clamp-2">{item.description}</p>
            <div className="flex items-center justify-between mt-3">
              <p className="text-[#512B32] font-serif">{formatINR(item.price)}</p>
              <button onClick={(e) => { e.preventDefault(); add(item.id); }} className="text-xs px-3 py-1.5 bg-[#512B32] text-[#FFF2E7] rounded-full hover:bg-[#342025] transition active:scale-95">Add</button>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
