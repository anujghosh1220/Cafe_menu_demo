"use client";
import { ReactNode, useState } from "react";
import { LogOut, Menu, X, LayoutDashboard, Utensils, Table, Settings, Heart, ChefHat, LogOut as LogOutIcon, Home } from "lucide-react";

type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: "menu", label: "Menu", icon: <Utensils className="w-5 h-5" /> },
  { id: "tables", label: "Tables", icon: <Table className="w-5 h-5" /> },
  { id: "favourites", label: "Featured", icon: <Heart className="w-5 h-5" /> },
  { id: "pairings", label: "Pairings", icon: <Home className="w-5 h-5" /> },
  { id: "chef", label: "Chefs", icon: <ChefHat className="w-5 h-5" /> },
  { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
];

export default function DashboardShell({ title, children, onLogout, activeTab, onTabChange }: {
  title: string;
  children: ReactNode;
  onLogout?: () => void;
  activeTab?: string;
  onTabChange?: (tab: any) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleTabChange = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
      setMobileOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF2E7] text-[#342025] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#512B32] border-r border-[#D5B47A]/20 flex-shrink-0">
        <div className="p-6 border-b border-[#D5B47A]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D5B47A]/20 flex items-center justify-center">
              <span className="text-[#D5B47A] font-serif text-lg">M</span>
            </div>
            <div>
              <h1 className="font-serif text-lg text-[#FFF2E7]">Maison Élise</h1>
              <p className="text-[10px] uppercase tracking-widest text-[#D5B47A]">Admin</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-[#D5B47A] text-[#342025] shadow-lg"
                  : "text-[#C99C91] hover:bg-[#342025] hover:text-[#FFF2E7]"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        {onLogout && (
          <div className="p-4 border-t border-[#D5B47A]/20">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#C99C91] hover:bg-[#342025] hover:text-[#FFF2E7] transition-all duration-200"
            >
              <LogOutIcon className="w-5 h-5" />
              <span className="font-medium">Log out</span>
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#512B32] animate-slide-in-left">
            <div className="p-6 border-b border-[#D5B47A]/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D5B47A]/20 flex items-center justify-center">
                  <span className="text-[#D5B47A] font-serif text-lg">M</span>
                </div>
                <div>
                  <h1 className="font-serif text-lg text-[#FFF2E7]">Maison Élise</h1>
                  <p className="text-[10px] uppercase tracking-widest text-[#D5B47A]">Admin</p>
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-[#C99C91] hover:text-[#FFF2E7] rounded-lg hover:bg-[#342025] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-[#D5B47A] text-[#342025] shadow-lg"
                      : "text-[#C99C91] hover:bg-[#342025] hover:text-[#FFF2E7]"
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
            {onLogout && (
              <div className="p-4 border-t border-[#D5B47A]/20">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#C99C91] hover:bg-[#342025] hover:text-[#FFF2E7] transition-all duration-200"
                >
                  <LogOutIcon className="w-5 h-5" />
                  <span className="font-medium">Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-[#FFF2E7]/95 backdrop-blur-sm border-b border-[#D5B47A]/30">
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 text-[#342025] hover:text-[#512B32] rounded-lg hover:bg-[#D5B47A]/10 transition"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="font-serif text-lg text-[#512B32]">{title}</h1>
                <p className="text-[10px] uppercase tracking-widest text-[#D5B47A]">Admin</p>
              </div>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 text-[#5A4A4D] hover:text-[#512B32] rounded-lg hover:bg-[#D5B47A]/10 transition"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:block sticky top-0 z-30 bg-[#FFF2E7]/95 backdrop-blur-sm border-b border-[#D5B47A]/30">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="font-serif text-2xl text-[#512B32]">{title}</h1>
              <p className="text-sm text-[#5A4A4D] mt-1">Luxury Hospitality Command Center</p>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#5A4A4D] hover:text-[#512B32] hover:bg-[#D5B47A]/10 transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Log out</span>
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden animate-slide-up">
          {children}
        </main>
      </div>
    </div>
  );
}
