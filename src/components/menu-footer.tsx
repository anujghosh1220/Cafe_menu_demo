export function MenuFooter() {
  return (
    <footer className="mt-12 border-t border-[#D5B47A]/30 bg-[#FFF2E7]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#512B32] mb-4">
            <span className="text-[#D5B47A] font-serif text-2xl">M</span>
          </div>
          <h2 className="font-serif text-3xl text-[#512B32] mb-2">Maison Élise</h2>
          <p className="text-[#5A4A4D] max-w-md mx-auto mb-6">A warm cup, a beautiful plate, and a moment worth slowing down for.</p>
          <div className="flex justify-center gap-6 mb-8">
            <a href="#menu" className="text-sm text-[#342025] hover:text-[#512B32] transition">Menu</a>
            <a href="#featured" className="text-sm text-[#342025] hover:text-[#512B32] transition">Featured</a>
            <a href="#perfect" className="text-sm text-[#342025] hover:text-[#512B32] transition">Pairings</a>
          </div>
          <div className="border-t border-[#D5B47A]/20 pt-6">
            <p className="text-xs text-[#C99C91]">© 2026 Maison Élise — Sample digital menu</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
