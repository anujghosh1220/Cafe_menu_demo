"use client";
import { ReactNode } from "react";
import { LogOut } from "lucide-react";

export default function DashboardShell({ title, children, onLogout }: { title: string; children: ReactNode; onLogout?: () => void }) {
  return (
    <div className="min-h-screen bg-[#FFF2E7] text-[#342025]">
      <header className="sticky top-0 z-30 border-b border-[#D5B47A]/30 bg-[#FFF2E7]/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-serif text-xl text-[#512B32]">{title}</h1>
          {onLogout && (
            <button onClick={onLogout} className="flex items-center gap-1 text-sm text-[#5A4A4D] hover:text-[#512B32]">
              <LogOut className="w-4 h-4" /> Log out
            </button>
          )}
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8 animate-[fadeIn_0.3s_ease-out]">{children}</main>
    </div>
  );
}
