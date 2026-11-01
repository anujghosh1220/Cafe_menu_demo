"use client";
import { ReactNode, useState } from "react";
import { LogOut, ChefHat, Bell, Menu, X, Flame } from "lucide-react";

export default function ChefDashboardShell({ children, onLogout, connectionStatus }: {
  children: ReactNode;
  onLogout?: () => void;
  connectionStatus?: string;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFF2E7] flex flex-col">
      {/* Desktop Header */}
      <header className="hidden lg:flex sticky top-0 z-30 bg-[#512B32] border-b border-[#D5B47A]/20 shadow-lg">
        <div className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#D5B47A]/20 flex items-center justify-center border border-[#D5B47A]/30">
              <Flame className="w-6 h-6 text-[#D5B47A]" />
            </div>
            <div>
              <h1 className="font-serif text-xl text-[#FFF2E7]">Maison Élise</h1>
              <p className="text-[10px] uppercase tracking-widest text-[#D5B47A]">Kitchen Command Center</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${connectionStatus === "Live" ? "bg-green-400 animate-pulse" : "bg-yellow-400"}`} />
              <span className="text-sm text-[#C99C91]">{connectionStatus}</span>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#C99C91] hover:bg-[#342025] hover:text-[#FFF2E7] transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Log out</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-30 bg-[#512B32] border-b border-[#D5B47A]/20 shadow-lg">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-[#C99C91] hover:text-[#FFF2E7] rounded-lg hover:bg-[#342025] transition"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#D5B47A]/20 flex items-center justify-center border border-[#D5B47A]/30">
                <Flame className="w-4 h-4 text-[#D5B47A]" />
              </div>
              <div>
                <h1 className="font-serif text-base text-[#FFF2E7]">Maison Élise</h1>
                <p className="text-[8px] uppercase tracking-widest text-[#D5B47A]">Kitchen</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${connectionStatus === "Live" ? "bg-green-400 animate-pulse" : "bg-yellow-400"}`} />
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 text-[#C99C91] hover:text-[#FFF2E7] rounded-lg hover:bg-[#342025] transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#512B32] animate-slide-in-left">
            <div className="p-4 border-b border-[#D5B47A]/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#D5B47A]/20 flex items-center justify-center border border-[#D5B47A]/30">
                  <Flame className="w-5 h-5 text-[#D5B47A]" />
                </div>
                <div>
                  <h1 className="font-serif text-lg text-[#FFF2E7]">Maison Élise</h1>
                  <p className="text-[10px] uppercase tracking-widest text-[#D5B47A]">Kitchen</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#C99C91] hover:text-[#FFF2E7] rounded-lg hover:bg-[#342025] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-[#C99C91]">
                <div className={`w-2 h-2 rounded-full ${connectionStatus === "Live" ? "bg-green-400 animate-pulse" : "bg-yellow-400"}`} />
                <span className="text-sm">{connectionStatus}</span>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#C99C91] hover:bg-[#342025] hover:text-[#FFF2E7] transition-all duration-200 mt-4"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Log out</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-6 overflow-x-hidden animate-slide-up">
        {children}
      </main>
    </div>
  );
}
