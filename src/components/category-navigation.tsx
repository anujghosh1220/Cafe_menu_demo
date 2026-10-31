"use client";
import { useEffect, useState } from "react";
import type { Category } from "@/data/menu";

export function CategoryNavigation({ categories }: { categories: Category[] }) {
  const [active, setActive] = useState<string>("");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    categories.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [categories]);

  return (
    <nav className="sticky top-0 z-10 bg-[#FFF2E7]/90 backdrop-blur border-b border-[#D5B47A]/30">
      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none">
        {categories.map((c) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className={`whitespace-nowrap text-xs uppercase tracking-wider px-4 py-2 rounded-full border transition-all duration-200 ${
              active === c.id
                ? "bg-[#512B32] text-[#FFF2E7] border-[#512B32] shadow"
                : "border-[#D5B47A]/40 text-[#342025] hover:border-[#D5B47A] hover:bg-[#FFF2E7]"
            }`}
          >
            {c.name}
          </a>
        ))}
      </div>
    </nav>
  );
}
