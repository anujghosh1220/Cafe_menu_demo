"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function MenuHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#FFF2E7]/95 backdrop-blur-sm border-b border-[#D5B47A]/30">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#512B32] flex items-center justify-center">
                <span className="text-[#D5B47A] font-serif text-lg">M</span>
              </div>
              <div>
                <h1 className="font-serif text-xl text-[#512B32] leading-tight">Maison Élise</h1>
                <p className="text-[10px] uppercase tracking-widest text-[#D5B47A]">Digital Menu</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              <a href="#menu" className="text-sm text-[#342025] hover:text-[#512B32] px-4 py-2 rounded-full hover:bg-[#FFF2E7] transition">Menu</a>
              <a href="#featured" className="text-sm text-[#342025] hover:text-[#512B32] px-4 py-2 rounded-full hover:bg-[#FFF2E7] transition">Featured</a>
              <a href="#perfect" className="text-sm text-[#342025] hover:text-[#512B32] px-4 py-2 rounded-full hover:bg-[#FFF2E7] transition">Pairings</a>
            </nav>

            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 text-[#342025] hover:text-[#512B32] rounded-full hover:bg-[#FFF2E7] transition"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end md:hidden">
          <div className="bg-[#FFF2E7] w-full max-w-xs h-full p-6 animate-slide-in-right">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-serif text-xl text-[#512B32]">Menu</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-[#342025] hover:text-[#512B32] rounded-full hover:bg-[#FFF2E7] transition"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              <a
                href="#menu"
                onClick={() => setMobileOpen(false)}
                className="text-[#342025] py-3 px-4 rounded-lg hover:bg-[#D5B47A]/10 transition"
              >
                Menu
              </a>
              <a
                href="#featured"
                onClick={() => setMobileOpen(false)}
                className="text-[#342025] py-3 px-4 rounded-lg hover:bg-[#D5B47A]/10 transition"
              >
                Featured
              </a>
              <a
                href="#perfect"
                onClick={() => setMobileOpen(false)}
                className="text-[#342025] py-3 px-4 rounded-lg hover:bg-[#D5B47A]/10 transition"
              >
                Pairings
              </a>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
