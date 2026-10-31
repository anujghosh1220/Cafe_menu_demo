"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { useAdmin } from "@/components/admin-provider";
import { createClient } from "@/lib/supabase/client";
import { formatINR } from "@/lib/format-currency";

export function PerfectTogether() {
  const { add } = useCart();
  const { state } = useAdmin();
  const [pairings, setPairings] = useState<{ a: string; b: string }[]>([]);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    supabase.from("perfect_together").select("item_a_id,item_b_id").order("display_order", { ascending: true })
      .then(({ data }) => setPairings((data || []).map((d: any) => ({ a: d.item_a_id, b: d.item_b_id }))));
  }, []);

  const resolved = pairings.map((p) => {
    const a = state.items.find((m) => m.id === p.a);
    const b = state.items.find((m) => m.id === p.b);
    if (!a || !b) return null;
    return { a, b, total: a.price + b.price };
  }).filter(Boolean) as any[];

  if (resolved.length === 0) return null;

  return (
    <section className="py-8">
      <h2 className="font-serif text-2xl text-[#512B32]">Perfect Together</h2>
      <p className="text-sm text-[#5A4A4D] mt-1">A little something to make your favourite even better.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {resolved.map((p: any, i: number) => (
          <div key={i} className="border border-[#D5B47A]/40 p-5 bg-[#FFF2E7] rounded-2xl shadow-sm hover:shadow-md transition">
            <p className="text-[#342025] font-medium">{p.a.name} + {p.b.name}</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-[#512B32] font-serif">{formatINR(p.total)}</span>
              <button onClick={() => { add(p.a.id); add(p.b.id); }} className="text-xs px-4 py-2 bg-[#512B32] text-[#FFF2E7] rounded-full hover:bg-[#342025] transition active:scale-95">Add both</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
