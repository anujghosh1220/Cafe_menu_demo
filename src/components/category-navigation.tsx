"use client";
import { useEffect, useState } from "react";
import { menuCategories } from "@/data/menu";

export function CategoryNavigation() {
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
    menuCategories.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <nav className="sticky top-0 bg-[#FFF2E7] z-10 border-b border-[#D5B47A]/30">
      <div className="flex gap-2 overflow-x-auto px-4 py-3">
        {menuCategories.map((c) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className={`whitespace-nowrap text-xs uppercase tracking-wider px-3 py-1.5 border ${
              active === c.id ? "bg-[#512B32] text-[#FFF2E7] border-[#512B32]" : "border-[#D5B47A]/40 text-[#342025]"
            }`}
          >
            {c.name}
          </a>
        ))}
      </div>
    </nav>
  );
}
