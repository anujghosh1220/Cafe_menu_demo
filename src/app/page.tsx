"use client";
import { useState } from "react";
import { useAdmin } from "@/components/admin-provider";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { MenuHeader } from "@/components/menu-header";
import { MenuHero } from "@/components/menu-hero";
import { FeaturedDishes } from "@/components/featured-dishes";
import { PerfectTogether } from "@/components/perfect-together";
import { CategoryNavigation } from "@/components/category-navigation";
import { MenuSearch } from "@/components/menu-search";
import { MenuSection } from "@/components/menu-section";
import { MenuFooter } from "@/components/menu-footer";
import { CartDrawer } from "@/components/cart-drawer";
import { ReviewsComingSoon } from "@/components/reviews-coming-soon";

export default function Home() {
  const { state } = useAdmin();
  const [query, setQuery] = useState("");
  const categories = state.categories;
  const allItems = state.items;

  const results = query.trim()
    ? allItems.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()) || i.description.toLowerCase().includes(query.toLowerCase()))
    : allItems;

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
        {!query && <CategoryNavigation categories={categories} />}
        <div className="mt-2">
          {query ? (
            results.length === 0 ? (
              <p className="text-center text-[#5A4A4D] py-10">No items match your search.</p>
            ) : (
              <section className="py-6">
                {categories.map((c) => {
                  const items = results.filter((i) => i.categoryId === c.id);
                  if (items.length === 0) return null;
                  return <MenuSection key={c.id} category={c} items={items} />;
                })}
              </section>
            )
          ) : (
            categories.map((c) => (
              <MenuSection key={c.id} category={c} items={allItems.filter((i) => i.categoryId === c.id)} />
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
