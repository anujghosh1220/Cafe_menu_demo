export function MenuHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#512B32] via-[#342025] to-[#512B32] text-[#FFF2E7] py-16 px-6 text-center shadow-xl animate-[fadeIn_0.6s_ease-out]">
      <div className="pointer-events-none absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#D5B47A]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-[#C99C91]/20 blur-3xl" />
      <p className="text-xs uppercase tracking-[0.4em] text-[#D5B47A]">A little taste of comfort</p>
      <h2 className="font-serif text-4xl md:text-5xl mt-3">Maison Élise</h2>
      <p className="mt-4 text-base md:text-lg text-[#FFF2E7]/90 max-w-2xl mx-auto">A warm cup, a beautiful plate, and a moment worth slowing down for.</p>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <a href="#menu" className="px-6 py-3 bg-[#D5B47A] text-[#342025] text-sm font-medium rounded-full shadow hover:scale-105 transition">Explore the Menu</a>
      </div>
    </section>
  );
}
