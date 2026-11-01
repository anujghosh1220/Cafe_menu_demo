"use client";
import { Search, X } from "lucide-react";

export function MenuSearch({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A4A4D]" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search menu..."
        aria-label="Search menu"
        className="w-full pl-10 pr-10 py-3 border border-[#D5B47A]/40 bg-white/80 text-[#342025] rounded-full focus:outline-none focus:ring-2 focus:ring-[#512B32] transition"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A4A4D]"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
