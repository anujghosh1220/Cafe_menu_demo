"use client";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Plus, Trash2, Search, Filter, Utensils, Table, Settings, Heart, Home, ChefHat, Check, X, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/components/admin-provider";
import DashboardShell from "@/components/dashboard-shell";
import type { MenuItem } from "@/data/menu";

export default function AdminPage() {
  const { state, setState, addMenuItem, deleteMenuItemById, updateMenuItemById } = useAdmin();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const logout = async () => {
    const supabase = createClient();
    if (!supabase) return;
    setLoggingOut(true);
    const { error } = await supabase.auth.signOut();
    setLoggingOut(false);
    if (error) { alert("Logout failed"); return; }
    router.push("/admin/login");
  };
  const [tab, setTab] = useState<"dashboard" | "menu" | "tables" | "settings" | "favourites" | "pairings" | "chef">("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [chefs, setChefs] = useState<any[]>([]);
  const [chefName, setChefName] = useState("");
  const [chefEmail, setChefEmail] = useState("");
  const [chefError, setChefError] = useState("");
  const loadChefs = async () => {
    const supabase = createClient();
    if (!supabase) { setChefError("Supabase not configured"); return; }
    const { data, error } = await supabase.from("chef_accounts").select("*").order("name", { ascending: true });
    if (error) { setChefError(error.message); console.error(error); return; }
    setChefError("");
    setChefs(data || []);
  };
  const [chefPass, setChefPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [chefConfirm, setChefConfirm] = useState("");
  const [waInput, setWaInput] = useState(state.whatsapp);
  const [waStatus, setWaStatus] = useState<"saved" | "unsaved" | "invalid" | "saving" | "">("");
  useEffect(() => { setWaInput(state.whatsapp); }, [state.whatsapp]);

  const normalizeWa = (v: string) => v.replace(/[^\d]/g, "");
  const saveWa = async () => {
    const n = normalizeWa(waInput.trim());
    if (n.length < 10) { setWaStatus("invalid"); return; }
    setWaStatus("saving");
    try {
      const supabase = createClient(); if (!supabase) { alert("Supabase not configured"); return; }
      const { error } = await supabase.from("cafe_settings").update({ whatsapp_number: n }).eq("id", true);
      if (error) { setWaStatus("invalid"); console.error(error); return; }
      setState({ ...state, whatsapp: n });
      setWaStatus("saved");
    } catch (e) {
      setWaStatus("invalid");
      console.error(e);
    }
  };

  const waChanged = normalizeWa(waInput.trim()) !== state.whatsapp;
  const [price, setPrice] = useState("");
  const [cat, setCat] = useState(state.categories[0].id);
  const [favIds, setFavIds] = useState<string[]>([]);
  const [pairList, setPairList] = useState<{ id: number; a: string; b: string; title: string }[]>([]);
  const [favToAdd, setFavToAdd] = useState("");
  const [pairA, setPairA] = useState("");
  const [pairB, setPairB] = useState("");
  const [pairTitle, setPairTitle] = useState("");

  const [favError, setFavError] = useState("");
  const loadFavs = async () => {
    const supabase = createClient();
    if (!supabase) { setFavError("Supabase not configured"); return; }
    const { data, error } = await supabase.from("homepage_favourites").select("menu_item_id").order("display_order", { ascending: true });
    if (error) { setFavError(error.message || JSON.stringify(error)); console.error("loadFavs error", error); return; }
    setFavError("");
    setFavIds((data || []).map((d: any) => d.menu_item_id));
  };
  const loadPairs = async () => {
    const supabase = createClient();
    if (!supabase) return;
    const { data } = await supabase.from("perfect_together").select("id,item_a_id,item_b_id,title").order("display_order", { ascending: true });
    setPairList((data || []).map((d: any) => ({ id: d.id, a: d.item_a_id, b: d.item_b_id, title: d.title || "" })));
  };
  useEffect(() => { loadFavs(); loadPairs(); loadChefs(); }, []);

  const addItem = async () => {
    if (!name.trim() || !price) return;
    try {
      await addMenuItem({ name: name.trim(), price: parseInt(price, 10), category: cat, description: desc.trim(), sort_order: state.items.length });
      setName(""); setPrice(""); setDesc("");
    } catch (e) { alert("Failed to add item"); console.error(e); }
  };

  const removeItem = async (id: string) => {
    if (!confirm("Delete this menu item? This action cannot be undone.")) return;
    try { await deleteMenuItemById(id); } catch (e) { alert("Failed to delete"); console.error(e); }
  };

  const updatePrice = async (id: string, p: string) => {
    const v = parseInt(p, 10);
    if (isNaN(v) || v < 0) return;
    try { await updateMenuItemById(id, { price: v }); } catch (e) { alert("Failed to update price"); console.error(e); }
  };

  const addTable = () => {
    const n = state.tables.length + 1;
    setState({ ...state, tables: [...state.tables, { id: `table-${Date.now()}`, name: `Table ${n}` }] });
  };

  const removeTable = (id: string) => {
    if (!confirm("Remove this table? This action cannot be undone.")) return;
    setState({ ...state, tables: state.tables.filter((t) => t.id !== id) });
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl text-[#512B32] mb-2">Welcome Back</h2>
        <p className="text-[#5A4A4D]">Here's an overview of your café today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#512B32] to-[#342025] rounded-2xl p-6 shadow-lg animate-scale-in animate-delay-100">
          <div className="flex items-center justify-between mb-4">
            <Utensils className="w-8 h-8 text-[#D5B47A]" />
            <span className="text-[10px] uppercase tracking-widest text-[#C99C91]">Menu</span>
          </div>
          <p className="text-4xl font-serif text-[#FFF2E7] mb-1">{state.items.length}</p>
          <p className="text-sm text-[#C99C91]">Menu Items</p>
        </div>

        <div className="bg-gradient-to-br from-[#D5B47A] to-[#C99C91] rounded-2xl p-6 shadow-lg animate-scale-in animate-delay-200">
          <div className="flex items-center justify-between mb-4">
            <Table className="w-8 h-8 text-[#342025]" />
            <span className="text-[10px] uppercase tracking-widest text-[#512B32]">Seating</span>
          </div>
          <p className="text-4xl font-serif text-[#342025] mb-1">{state.tables.length}</p>
          <p className="text-sm text-[#512B32]">Tables</p>
        </div>

        <div className="bg-white/60 border border-[#D5B47A]/30 rounded-2xl p-6 shadow-lg animate-scale-in animate-delay-300">
          <div className="flex items-center justify-between mb-4">
            <Settings className="w-8 h-8 text-[#512B32]" />
            <span className="text-[10px] uppercase tracking-widest text-[#5A4A4D]">Integration</span>
          </div>
          <p className="text-4xl font-serif text-[#512B32] mb-1">{state.whatsapp ? "Active" : "Pending"}</p>
          <p className="text-sm text-[#5A4A4D]">WhatsApp Status</p>
        </div>
      </div>

    </div>
  );

  const renderMenu = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[#512B32] mb-1">Menu Management</h2>
          <p className="text-sm text-[#5A4A4D]">Add, edit, and manage your menu items</p>
        </div>
      </div>

      <div className="bg-white/60 border border-[#D5B47A]/30 rounded-2xl p-6">
        <h3 className="font-medium text-[#342025] mb-4">Add New Item</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Item name" value={name} onChange={(e)=>setName(e.target.value)} className="w-full border border-[#D5B47A]/40 rounded-lg p-3 bg-white/80 focus:outline-none focus:border-[#512B32] focus:ring-2 focus:ring-[#512B32]/10 transition" />
          <input placeholder="Price" value={price} onChange={(e)=>setPrice(e.target.value)} className="w-full border border-[#D5B47A]/40 rounded-lg p-3 bg-white/80 focus:outline-none focus:border-[#512B32] focus:ring-2 focus:ring-[#512B32]/10 transition" />
          <select value={cat} onChange={(e)=>setCat(e.target.value)} className="w-full border border-[#D5B47A]/40 rounded-lg p-3 bg-white/80 focus:outline-none focus:border-[#512B32] focus:ring-2 focus:ring-[#512B32]/10 transition">
            {state.categories.map((c)=> <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <textarea placeholder="Description" value={desc} onChange={(e)=>setDesc(e.target.value)} className="w-full border border-[#D5B47A]/40 rounded-lg p-3 bg-white/80 focus:outline-none focus:border-[#512B32] focus:ring-2 focus:ring-[#512B32]/10 transition resize-none" rows={3} />
        </div>
        <button onClick={addItem} className="mt-4 px-6 py-3 bg-[#512B32] text-[#FFF2E7] rounded-lg hover:bg-[#342025] transition flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A4A4D]" />
            <input placeholder="Search menu..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-[#D5B47A]/40 rounded-lg bg-white/80 focus:outline-none focus:border-[#512B32] focus:ring-2 focus:ring-[#512B32]/10 transition" />
          </div>
          <div className="relative sm:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A4A4D]" />
            <select value={categoryFilter} onChange={(e)=>setCategoryFilter(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-[#D5B47A]/40 rounded-lg bg-white/80 focus:outline-none focus:border-[#512B32] focus:ring-2 focus:ring-[#512B32]/10 transition appearance-none">
              <option value="">All categories</option>
              {state.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          {state.items.filter((i) => (!searchTerm || i.name.toLowerCase().includes(searchTerm.toLowerCase())) && (!categoryFilter || i.categoryId === categoryFilter)).map((i) => (
            <div key={i.id} className="bg-white/60 border border-[#D5B47A]/30 rounded-xl p-4 hover:border-[#D5B47A] transition flex items-center gap-4">
              <div className="flex-1">
                <p className="font-medium text-[#342025]">{i.name}</p>
                <p className="text-sm text-[#5A4A4D] mt-1 line-clamp-1">{i.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="text-sm text-[#5A4A4D] mr-2">₹</span>
                  <input defaultValue={i.price} onBlur={(e)=>updatePrice(i.id,e.target.value)} className="w-20 border border-[#D5B47A]/40 rounded-lg p-2 text-center bg-white/80 focus:outline-none focus:border-[#512B32] transition" />
                </div>
                <button onClick={()=>removeItem(i.id)} className="p-2 text-red-700 hover:bg-red-50 rounded-lg transition" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTables = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[#512B32] mb-1">Table Management</h2>
          <p className="text-sm text-[#5A4A4D]">Manage your café seating</p>
        </div>
        <button onClick={addTable} className="px-6 py-3 bg-[#512B32] text-[#FFF2E7] rounded-lg hover:bg-[#342025] transition flex items-center gap-2 self-start">
          <Plus className="w-4 h-4" />
          Add Table
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.tables.map((t) => (
          <div key={t.id} className="bg-white/60 border border-[#D5B47A]/30 rounded-xl p-6 hover:border-[#D5B47A] transition">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-[#512B32]/10 flex items-center justify-center">
                <Table className="w-6 h-6 text-[#512B32]" />
              </div>
              <button onClick={()=>removeTable(t.id)} className="p-2 text-red-700 hover:bg-red-50 rounded-lg transition" title="Remove">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <p className="font-serif text-xl text-[#342025]">{t.name}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-[#512B32] mb-1">Settings</h2>
        <p className="text-sm text-[#5A4A4D]">Configure your café settings</p>
      </div>

      <div className="bg-white/60 border border-[#D5B47A]/30 rounded-2xl p-6">
        <h3 className="font-medium text-[#342025] mb-4">WhatsApp Integration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#342025] mb-2">WhatsApp Number</label>
            <input placeholder="919876543210" value={waInput} onChange={(e) => { setWaInput(e.target.value); setWaStatus(waChanged ? "unsaved" : ""); }} className="w-full border border-[#D5B47A]/40 rounded-lg p-3 bg-white/80 focus:outline-none focus:border-[#512B32] focus:ring-2 focus:ring-[#512B32]/10 transition" />
            <p className="text-xs text-[#5A4A4D] mt-2">Enter the country code followed by your number, without the + sign or spaces.</p>
          </div>
          <button onClick={saveWa} disabled={waStatus === "saving"} className="px-6 py-3 bg-[#512B32] text-[#FFF2E7] rounded-lg hover:bg-[#342025] transition disabled:opacity-50 flex items-center gap-2">
            {waStatus === "saving" ? "Saving..." : "Save Changes"}
          </button>
          <div className="flex items-center gap-2 text-sm">
            {waStatus === "saved" && <><Check className="w-4 h-4 text-green-700" /><span className="text-green-700">Saved and configured: ••••••{state.whatsapp.slice(-4)}</span></>}
            {waStatus === "unsaved" && <><AlertCircle className="w-4 h-4 text-[#5A4A4D]" /><span className="text-[#5A4A4D]">Unsaved changes</span></>}
            {waStatus === "invalid" && <><X className="w-4 h-4 text-red-700" /><span className="text-red-700">Invalid number</span></>}
            {!waStatus && state.whatsapp && <><Check className="w-4 h-4 text-green-700" /><span className="text-green-700">Saved and configured: ••••••{state.whatsapp.slice(-4)}</span></>}
            {!waStatus && !state.whatsapp && <><AlertCircle className="w-4 h-4 text-[#5A4A4D]" /><span className="text-[#5A4A4D]">Not configured</span></>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFavourites = () => (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-[#512B32] mb-1">Featured Items</h2>
        <p className="text-sm text-[#5A4A4D]">Manage items featured on the homepage</p>
      </div>

      <div className="bg-white/60 border border-[#D5B47A]/30 rounded-2xl p-6">
        <h3 className="font-medium text-[#342025] mb-4">Add Featured Item</h3>
        <div className="flex gap-4">
          <select value={favToAdd} onChange={(e)=>setFavToAdd(e.target.value)} className="flex-1 border border-[#D5B47A]/40 rounded-lg p-3 bg-white/80 focus:outline-none focus:border-[#512B32] focus:ring-2 focus:ring-[#512B32]/10 transition">
            <option value="">Select item</option>
            {state.items.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
          <button onClick={async () => {
            if (!favToAdd) return;
            const supabase = createClient(); if (!supabase) { alert("Supabase not configured"); return; }
            const { error } = await supabase.from("homepage_favourites").insert({ menu_item_id: favToAdd, display_order: favIds.length });
            if (error) { alert("Failed to add favourite"); console.error(error); return; }
            setFavToAdd(""); loadFavs();
          }} className="px-6 py-3 bg-[#512B32] text-[#FFF2E7] rounded-lg hover:bg-[#342025] transition flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {favIds.map((id: string, idx: number) => {
          const item = state.items.find((i) => i.id === id);
          return (
            <div key={id} className="bg-white/60 border border-[#D5B47A]/30 rounded-xl p-4 hover:border-[#D5B47A] transition flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#D5B47A]/20 flex items-center justify-center text-[#D5B47A] font-serif font-bold">
                {idx + 1}
              </div>
              <div className="flex-1">
                <p className="font-medium text-[#342025]">{item?.name || id}</p>
              </div>
              <button onClick={async () => {
                const supabase = createClient(); if (!supabase) { alert("Supabase not configured"); return; }
                await supabase.from("homepage_favourites").delete().eq("menu_item_id", id);
                loadFavs();
              }} className="p-2 text-red-700 hover:bg-red-50 rounded-lg transition" title="Remove">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
        {favError && <p className="text-sm text-red-700">{favError}</p>}
        {favIds.length === 0 && <p className="text-sm text-[#5A4A4D] text-center py-8">No featured items yet.</p>}
      </div>
    </div>
  );

  const renderPairings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-[#512B32] mb-1">Perfect Together</h2>
        <p className="text-sm text-[#5A4A4D]">Manage item pairings</p>
      </div>

      <div className="bg-white/60 border border-[#D5B47A]/30 rounded-2xl p-6">
        <h3 className="font-medium text-[#342025] mb-4">Add Pairing</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select value={pairA} onChange={(e)=>setPairA(e.target.value)} className="border border-[#D5B47A]/40 rounded-lg p-3 bg-white/80 focus:outline-none focus:border-[#512B32] focus:ring-2 focus:ring-[#512B32]/10 transition">
            <option value="">Item A</option>
            {state.items.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
          <select value={pairB} onChange={(e)=>setPairB(e.target.value)} className="border border-[#D5B47A]/40 rounded-lg p-3 bg-white/80 focus:outline-none focus:border-[#512B32] focus:ring-2 focus:ring-[#512B32]/10 transition">
            <option value="">Item B</option>
            {state.items.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
          <input placeholder="Title (optional)" value={pairTitle} onChange={(e)=>setPairTitle(e.target.value)} className="border border-[#D5B47A]/40 rounded-lg p-3 bg-white/80 focus:outline-none focus:border-[#512B32] focus:ring-2 focus:ring-[#512B32]/10 transition" />
          <button onClick={async () => {
            if (!pairA || !pairB || pairA === pairB) return;
            const supabase = createClient(); if (!supabase) { alert("Supabase not configured"); return; }
            const { error } = await supabase.from("perfect_together").insert({ item_a_id: pairA, item_b_id: pairB, title: pairTitle, display_order: pairList.length });
            if (error) { alert("Failed to add pairing"); console.error(error); return; }
            setPairA(""); setPairB(""); setPairTitle(""); loadPairs();
          }} className="px-6 py-3 bg-[#512B32] text-[#FFF2E7] rounded-lg hover:bg-[#342025] transition flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {pairList.map((p: any) => {
          const a = state.items.find((i) => i.id === p.a);
          const b = state.items.find((i) => i.id === p.b);
          return (
            <div key={p.id} className="bg-white/60 border border-[#D5B47A]/30 rounded-xl p-4 hover:border-[#D5B47A] transition flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#D5B47A]/20 flex items-center justify-center">
                <Home className="w-5 h-5 text-[#D5B47A]" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-[#342025]">{a?.name} + {b?.name}</p>
                {p.title && <p className="text-sm text-[#5A4A4D] mt-1">{p.title}</p>}
              </div>
              <button onClick={async () => {
                const supabase = createClient(); if (!supabase) { alert("Supabase not configured"); return; }
                await supabase.from("perfect_together").delete().eq("id", p.id);
                loadPairs();
              }} className="p-2 text-red-700 hover:bg-red-50 rounded-lg transition" title="Remove">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
        {pairList.length === 0 && <p className="text-sm text-[#5A4A4D] text-center py-8">No pairings yet.</p>}
      </div>
    </div>
  );

  const renderChef = () => (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-[#512B32] mb-1">Chef Management</h2>
        <p className="text-sm text-[#5A4A4D]">Manage chef accounts</p>
      </div>

      <div className="bg-white/60 border border-[#D5B47A]/30 rounded-2xl p-6">
        <h3 className="font-medium text-[#342025] mb-4">Add New Chef</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input placeholder="Name" value={chefName} onChange={(e)=>setChefName(e.target.value)} className="border border-[#D5B47A]/40 rounded-lg p-3 bg-white/80 focus:outline-none focus:border-[#512B32] focus:ring-2 focus:ring-[#512B32]/10 transition" />
          <input placeholder="Email" value={chefEmail} onChange={(e)=>setChefEmail(e.target.value)} className="border border-[#D5B47A]/40 rounded-lg p-3 bg-white/80 focus:outline-none focus:border-[#512B32] focus:ring-2 focus:ring-[#512B32]/10 transition" />
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Password" value={chefPass} onChange={(e)=>setChefPass(e.target.value)} className="w-full border border-[#D5B47A]/40 rounded-lg p-3 pr-10 bg-white/80 focus:outline-none focus:border-[#512B32] focus:ring-2 focus:ring-[#512B32]/10 transition" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A4A4D] hover:text-[#512B32] transition">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="relative">
            <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm" value={chefConfirm} onChange={(e)=>setChefConfirm(e.target.value)} className="w-full border border-[#D5B47A]/40 rounded-lg p-3 pr-10 bg-white/80 focus:outline-none focus:border-[#512B32] focus:ring-2 focus:ring-[#512B32]/10 transition" />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A4A4D] hover:text-[#512B32] transition">
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <button onClick={async () => {
          if (!chefName || !chefEmail || !chefPass || chefPass !== chefConfirm) { alert("Invalid input"); return; }
          const res = await fetch("/api/admin/chef", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: chefName, email: chefEmail, password: chefPass }) });
          const json = await res.json();
          if (!res.ok) { alert(json.error || "Failed"); return; }
          setChefName(""); setChefEmail(""); setChefPass(""); setChefConfirm(""); loadChefs();
        }} className="mt-4 px-6 py-3 bg-[#512B32] text-[#FFF2E7] rounded-lg hover:bg-[#342025] transition flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Chef
        </button>
      </div>

      <div className="space-y-2">
        {chefs.map((c: any) => (
          <div key={c.id} className="bg-white/60 border border-[#D5B47A]/30 rounded-xl p-4 hover:border-[#D5B47A] transition flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#512B32]/10 flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-[#512B32]" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-[#342025]">{c.name}</p>
              <p className="text-sm text-[#5A4A4D]">{c.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-3 py-1 rounded-full ${c.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                {c.active ? "Active" : "Disabled"}
              </span>
              <button onClick={async () => {
                if (!confirm("Remove this chef? This action cannot be undone.")) return;
                await fetch("/api/admin/chef", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: c.email }) });
                loadChefs();
              }} className="p-2 text-red-700 hover:bg-red-50 rounded-lg transition" title="Remove">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {chefError && <p className="text-sm text-red-700">{chefError}</p>}
        {chefs.length === 0 && <p className="text-sm text-[#5A4A4D] text-center py-8">No chefs yet.</p>}
      </div>
    </div>
  );

  return (
    <DashboardShell title="Admin Dashboard" onLogout={logout} activeTab={tab} onTabChange={setTab}>
      {tab === "dashboard" && renderDashboard()}
      {tab === "menu" && renderMenu()}
      {tab === "tables" && renderTables()}
      {tab === "settings" && renderSettings()}
      {tab === "favourites" && renderFavourites()}
      {tab === "pairings" && renderPairings()}
      {tab === "chef" && renderChef()}
    </DashboardShell>
  );
}

