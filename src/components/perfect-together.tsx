"use client";
import { useCart } from "@/components/cart-provider";
import { menuItems } from "@/data/menu";
import { formatINR } from "@/lib/format-currency";

const pairings = [
  { a: "hot-drinks-1", b: "snacks-5", reason: "A warm, spiced chai balances the crisp, savoury cutlet." },
  { a: "cold-drinks-1", b: "desserts-2", reason: "Chilled coffee and a rich brownie make a comforting duo." },
  { a: "momos-1", b: "cold-drinks-3", reason: "Fresh lime soda cuts through the soft, savoury momos." },
  { a: "main-course-1", b: "rice-biryani-2", reason: "Jeera rice soaks up the rich paneer butter masala gravy." },
  { a: "desserts-6", b: "hot-drinks-4", reason: "A warm lava cake pairs beautifully with a cappuccino." },
];

export function PerfectTogether() {
  const { add } = useCart();
  const resolved = pairings.map((p) => {
    const a = menuItems.find((m) => m.id === p.a)!;
    const b = menuItems.find((m) => m.id === p.b)!;
    return { ...p, a, b, total: a.price + b.price };
  });

  return (
    <section className="py-8">
      <h2 className="font-serif text-2xl text-[#512B32]">Perfect Together</h2>
      <p className="text-sm text-[#5A4A4D] mt-1">A little something to make your favourite even better.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {resolved.map((p, i) => (
          <div key={i} className="border border-[#D5B47A]/40 p-4">
            <p className="text-[#342025] font-medium">{p.a.name} + {p.b.name}</p>
            <p className="text-sm text-[#5A4A4D] mt-1">{p.reason}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-[#512B32]">{formatINR(p.total)}</span>
              <button onClick={() => { add(p.a.id); add(p.b.id); }} className="text-xs px-3 py-1 bg-[#512B32] text-[#FFF2E7]">Add both</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
