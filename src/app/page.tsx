"use client";
import { useState } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { MenuHeader } from "@/components/menu-header";
import { MenuHero } from "@/components/menu-hero";
import { CategoryNavigation } from "@/components/category-navigation";
import { MenuSearch } from "@/components/menu-search";
import { MenuSection } from "@/components/menu-section";
import { FeaturedDishes } from "@/components/featured-dishes";
import { PerfectTogether } from "@/components/perfect-together";
import { ReviewsComingSoon } from "@/components/reviews-coming-soon";
import { MenuFooter } from "@/components/menu-footer";
import { CartDrawer } from "@/components/cart-drawer";
import { menuCategories } from "@/data/menu";
import { searchItems, itemsByCategory } from "@/lib/menu-utils";

export default function Home() {
  const [query, setQuery] = useState("");

  return (
    <>
    <AuroraBackground className="min-h-screen justify-start">
      <main className="w-full max-w-[1320px] mx-auto px-6" id="top">
        <MenuHeader />
        <MenuHero />
        <FeaturedDishes />
        <PerfectTogether />
        <div className="my-4" id="menu">
          <MenuSearch value={query} onChange={setQuery} />
        </div>
        {!query && <CategoryNavigation />}
        <div className="mt-2">
          {query ? (
            searchItems(query).length === 0 ? (
              <p className="text-center text-[#5A4A4D] py-10">No items match your search.</p>
            ) : (
              <section className="py-6">
                {menuCategories.map((c) => {
                  const items = searchItems(query).filter((i) => i.categoryId === c.id);
                  if (items.length === 0) return null;
                  return <MenuSection key={c.id} category={c} items={items} />;
                })}
              </section>
            )
          ) : (
            menuCategories.map((c) => (
              <MenuSection key={c.id} category={c} items={itemsByCategory(c.id)} />
            ))
          )}
        </div>
        <ReviewsComingSoon />
        <MenuFooter />
      </main>
    </AuroraBackground>
    <CartDrawer />
    </>
  );
}