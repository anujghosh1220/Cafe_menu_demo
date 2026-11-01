"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { useAdmin } from "@/components/admin-provider";
import { createClient } from "@/lib/supabase/client";
import { formatINR } from "@/lib/format-currency";
import { Loader2 } from "lucide-react";

export function FeaturedDishes() {
  const { add } = useCart();
  const { state } = useAdmin();
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }
    (async () => {
      try {
        const { data } = await supabase.from("homepage_favourites").select("menu_item_id").order("display_order", { ascending: true });
        setIds((data || []).map((d: any) => d.menu_item_id));
      } catch (error) {
        console.error("Error loading featured dishes:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <section className="py-8">
        <h2 className="font-serif text-2xl text-[#512B32]">Maison Élise Favourites</h2>
        <p className="text-sm text-[#5A4A4D] mt-1">A few things we think you'll love.</p>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#D5B47A] animate-spin" />
        </div>
      </section>
    );
  }

  const items = ids.map((id) => state.items.find((m) => m.id === id)).filter(Boolean) as any;
  if (items.length === 0) return null;

  return (
    <section className="py-8">
      <h2 className="font-serif text-2xl text-[#512B32]">Maison Élise Favourites</h2>
      <p className="text-sm text-[#5A4A4D] mt-1">A few things we think you'll love.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {items.map((item: any) => (
          <div key={item.id} className="group border border-[#D5B47A]/40 p-4 bg-[#FFF2E7] rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition">
            <span className="text-[10px] uppercase tracking-widest text-[#512B32]">House Favourite</span>
            <a href={`#${item.id}`}>
              <h3 className="font-medium text-[#342025] mt-2">{item.name}</h3>
              <p className="text-sm text-[#5A4A4D] mt-1 line-clamp-2">{item.description}</p>
            </a>
            <div className="flex items-center justify-between mt-3">
              <p className="text-[#512B32] font-serif">{formatINR(item.price)}</p>
              <button onClick={() => add(item.id)} className="text-xs px-3 py-1.5 bg-[#512B32] text-[#FFF2E7] rounded-full hover:bg-[#342025] transition active:scale-95">Add</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
