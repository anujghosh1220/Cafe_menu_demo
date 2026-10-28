export function MenuHero() {
  return (
    <section className="bg-[#512B32] text-[#FFF2E7] py-10 px-6 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-[#D5B47A]">A little taste of comfort</p>
      <h2 className="font-serif text-3xl md:text-4xl mt-2">Maison Elise</h2>
      <p className="mt-3 text-sm md:text-base text-[#FFF2E7]/90">A warm cup, a beautiful plate, and a moment worth slowing down for.</p>
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <a href="#menu" className="px-5 py-2.5 bg-[#FFF2E7] text-[#512B32] text-sm font-medium">Explore the Menu</a>
      </div>
    </section>
  );
}