import { MenuItemRow } from "./menu-item-row";
import type { Category, MenuItem } from "@/data/menu";

export function MenuSection({ category, items }: { category: Category; items: MenuItem[] }) {
  return (
    <section id={category.id} className="scroll-mt-20 py-6">
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-xs uppercase tracking-widest text-[#D5B47A]">{category.number}</span>
        <h2 className="font-serif text-2xl text-[#512B32]">{category.name}</h2>
      </div>
      <div>
        {items.map((item) => (
          <MenuItemRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
