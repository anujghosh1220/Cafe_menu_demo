"use client";
import Link from "next/link";

export function MenuHeader() {
  return (
    <header className="relative py-6 px-4 border-b border-[#D5B47A]/30 bg-[#FFF2E7]/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-[1320px] mx-auto flex flex-col items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl text-[#512B32] tracking-tight">Maison Élise</span>
        </Link>
        <nav className="flex gap-4 text-xs uppercase tracking-[0.3em]">
          <Link href="#menu" className="text-[#5A4A4D] hover:text-[#512B32] transition">Menu</Link>
          <Link href="#favourites" className="text-[#5A4A4D] hover:text-[#512B32] transition">Favourites</Link>
        </nav>
      </div>
    </header>
  );
}
