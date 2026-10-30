"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAdmin } from "@/components/admin-provider";
import type { MenuItem } from "@/data/menu";

export default function AdminPage() {
  const { state, setState } = useAdmin();
  const [tab, setTab] = useState<"menu" | "tables" | "settings" | "favourites" | "pairings" | "chef">("menu");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [chefs, setChefs] = useState<any[]>([]);
  const [chefName, setChefName] = useState("");
  const [chefEmail, setChefEmail] = useState("");
  const loadChefs = async () => {
    const supabase = createClient();
    if (!supabase) return;
    const { data } = await supabase.from("chef_accounts").select("*").order("name", { ascending: true });
    setChefs(data || []);
  };
  const [chefPass, setChefPass] = useState("");
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

  const addItem = () => {
    if (!name.trim() || !price) return;
    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      categoryId: cat,
      name: name.trim(),
      description: desc.trim(),
      price: parseInt(price, 10),
      vegetarian: true,
      available: true,
    };
    setState({ ...state, items: [...state.items, newItem] });
    setName(""); setPrice(""); setDesc("");
  };

  const removeItem = (id: string) => {
    if (!confirm("Delete item?")) return;
    setState({ ...state, items: state.items.filter((i) => i.id !== id) });
  };

  const updatePrice = (id: string, p: string) => {
    const v = parseInt(p, 10);
    if (isNaN(v) || v < 0) return;
    setState({ ...state, items: state.items.map((i) => (i.id === id ? { ...i, price: v } : i)) });
  };

  const addTable = () => {
    const n = state.tables.length + 1;
    setState({ ...state, tables: [...state.tables, { id: `table-${Date.now()}`, name: `Table ${n}` }] });
  };

  const removeTable = (id: string) => {
    if (!confirm("Remove table?")) return;
    setState({ ...state, tables: state.tables.filter((t) => t.id !== id) });
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <h1 className="font-serif text-2xl text-[#512B32]">Maison Elise — Admin</h1>
        <a href="/" className="text-sm text-[#5A4A4D]">Back to menu</a>
      </div>
      <p className="text-xs text-[#5A4A4D] mt-2">No-login demo. Changes stored in this browser only.</p>
      <div className="flex gap-2 mt-4">
        {(["menu","tables","settings","favourites","pairings","chef"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1 border ${tab===t?"bg-[#512B32] text-[#FFF2E7]":"border-[#D5B47A]/40"}`}>{t}</button>
        ))}
      </div>
      <div className="mt-4 text-sm text-[#5A4A4D]">
        Items: {state.items.length} · Tables: {state.tables.length} · WhatsApp: {state.whatsapp ? "configured" : "not configured"}
      </div>

      {tab === "menu" && (
        <section className="mt-6">
          <div className="border border-[#D5B47A]/40 p-4 space-y-2">
            <input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} className="w-full border p-2" />
            <input placeholder="Price" value={price} onChange={(e)=>setPrice(e.target.value)} className="w-full border p-2" />
            <select value={cat} onChange={(e)=>setCat(e.target.value)} className="w-full border p-2">
              {state.categories.map((c)=> <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <textarea placeholder="Description" value={desc} onChange={(e)=>setDesc(e.target.value)} className="w-full border p-2" />
            <button onClick={addItem} className="px-3 py-1 bg-[#512B32] text-[#FFF2E7]">Add Item</button>
          </div>
          <div className="mt-6 space-y-2">
            {state.items.map((i) => (
              <div key={i.id} className="flex items-center gap-2 border-b border-[#D5B47A]/30 py-2">
                <span className="flex-1 text-sm">{i.name}</span>
                <input defaultValue={i.price} onBlur={(e)=>updatePrice(i.id,e.target.value)} className="w-20 border p-1" />
                <button onClick={()=>removeItem(i.id)} className="text-xs text-red-700">Delete</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "tables" && (
        <section className="mt-6 space-y-2">
          {state.tables.map((t) => (
            <div key={t.id} className="flex items-center gap-2 border-b border-[#D5B47A]/30 py-2">
              <span className="flex-1">{t.name}</span>
              <button onClick={()=>removeTable(t.id)} className="text-xs text-red-700">Remove</button>
            </div>
          ))}
          <button onClick={addTable} className="mt-3 px-3 py-1 bg-[#512B32] text-[#FFF2E7]">Add Table</button>
        </section>
      )}

      {tab === "settings" && (
        <section className="mt-6 space-y-2">
          <label className="text-sm">WhatsApp Number (with country code)</label>
          <input placeholder="919876543210" value={waInput} onChange={(e) => { setWaInput(e.target.value); setWaStatus(waChanged ? "unsaved" : ""); }} className="w-full border p-2" />
          <p className="text-xs text-[#5A4A4D]">Enter the country code followed by your number, without the + sign or spaces.</p>
          <button onClick={saveWa} className="px-3 py-1 bg-[#512B32] text-[#FFF2E7]">Save WhatsApp Number</button>
          <p className="text-xs">
            {waStatus === "saved" && <span className="text-green-700">Saved and configured: ••••••{state.whatsapp.slice(-4)}</span>}
            {waStatus === "unsaved" && <span className="text-[#5A4A4D]">Unsaved changes</span>}
            {waStatus === "invalid" && <span className="text-red-700">Invalid number</span>}
            {!waStatus && state.whatsapp && <span className="text-green-700">Saved and configured: ••••••{state.whatsapp.slice(-4)}</span>}
            {!waStatus && !state.whatsapp && <span className="text-[#5A4A4D]">Not configured</span>}
          </p>
        </section>
      )}
      {tab === "favourites" && (
        <section className="mt-6 space-y-2">
          <div className="flex gap-2">
            <select value={favToAdd} onChange={(e)=>setFavToAdd(e.target.value)} className="border p-2">
              <option value="">Select item</option>
              {state.items.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
            <button onClick={async () => {
              if (!favToAdd) return;
              const supabase = createClient(); if (!supabase) { alert("Supabase not configured"); return; }
              const { error } = await supabase.from("homepage_favourites").insert({ menu_item_id: favToAdd, display_order: favIds.length });
              if (error) { alert("Failed to add favourite"); console.error(error); return; }
              setFavToAdd(""); loadFavs();
            }} className="px-3 py-1 bg-[#512B32] text-[#FFF2E7]">Add</button>
          </div>
          {favIds.map((id, idx) => {
            const item = state.items.find((i) => i.id === id);
            return (
              <div key={id} className="flex items-center gap-2 border-b border-[#D5B47A]/30 py-2">
                <span className="flex-1">{item?.name || id}</span>
                <button onClick={async () => {
                  const supabase = createClient(); if (!supabase) { alert("Supabase not configured"); return; }
                  await supabase.from("homepage_favourites").delete().eq("menu_item_id", id);
                  loadFavs();
                }} className="text-xs text-red-700">Remove</button>
              </div>
            );
          })}
          {favError && <p className="text-sm text-red-700">{favError}</p>}
          {favIds.length === 0 && <p className="text-sm text-[#5A4A4D]">No favourites.</p>}
        </section>
      )}

      {tab === "pairings" && (
        <section className="mt-6 space-y-2">
          <div className="flex gap-2 flex-wrap">
            <select value={pairA} onChange={(e)=>setPairA(e.target.value)} className="border p-2">
              <option value="">Item A</option>
              {state.items.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
            <select value={pairB} onChange={(e)=>setPairB(e.target.value)} className="border p-2">
              <option value="">Item B</option>
              {state.items.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
            <input placeholder="Title" value={pairTitle} onChange={(e)=>setPairTitle(e.target.value)} className="border p-2" />
            <button onClick={async () => {
              if (!pairA || !pairB || pairA === pairB) return;
              const supabase = createClient(); if (!supabase) { alert("Supabase not configured"); return; }
              const { error } = await supabase.from("perfect_together").insert({ item_a_id: pairA, item_b_id: pairB, title: pairTitle, display_order: pairList.length });
              if (error) { alert("Failed to add pairing"); console.error(error); return; }
              setPairA(""); setPairB(""); setPairTitle(""); loadPairs();
            }} className="px-3 py-1 bg-[#512B32] text-[#FFF2E7]">Add Pairing</button>
          </div>
          {pairList.map((p) => {
            const a = state.items.find((i) => i.id === p.a);
            const b = state.items.find((i) => i.id === p.b);
            return (
              <div key={p.id} className="flex items-center gap-2 border-b border-[#D5B47A]/30 py-2">
                <span className="flex-1">{a?.name} + {b?.name}</span>
                <button onClick={async () => {
                  const supabase = createClient(); if (!supabase) { alert("Supabase not configured"); return; }
                  await supabase.from("perfect_together").delete().eq("id", p.id);
                  loadPairs();
                }} className="text-xs text-red-700">Remove</button>
              </div>
            );
          })}
          {pairList.length === 0 && <p className="text-sm text-[#5A4A4D]">No pairings.</p>}
        </section>
      )}

      {tab === "chef" && (
        <section className="mt-6 space-y-2">
          <h2 className="font-serif text-xl text-[#512B32]">Chef Management</h2>
          <div className="flex gap-2 flex-wrap">
            <input placeholder="Name" value={chefName} onChange={(e)=>setChefName(e.target.value)} className="border p-2" />
            <input placeholder="Email" value={chefEmail} onChange={(e)=>setChefEmail(e.target.value)} className="border p-2" />
            <input type="password" placeholder="Password" value={chefPass} onChange={(e)=>setChefPass(e.target.value)} className="border p-2" />
            <input type="password" placeholder="Confirm" value={chefConfirm} onChange={(e)=>setChefConfirm(e.target.value)} className="border p-2" />
            <button onClick={async () => {
              if (!chefName || !chefEmail || !chefPass || chefPass !== chefConfirm) { alert("Invalid"); return; }
              const res = await fetch("/api/admin/chef", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: chefName, email: chefEmail, password: chefPass }) });
              if (!res.ok) { alert("Failed"); return; }
              setChefName(""); setChefEmail(""); setChefPass(""); setChefConfirm(""); loadChefs();
            }} className="px-3 py-1 bg-[#512B32] text-[#FFF2E7]">Add Chef</button>
          </div>
          {chefs.map((c) => (
            <div key={c.id} className="flex items-center gap-2 border-b border-[#D5B47A]/30 py-2">
              <span className="flex-1">{c.name} — {c.email} ({c.active ? "Active" : "Disabled"})</span>
              <button onClick={async () => {
                if (!confirm("Remove chef?")) return;
                await fetch("/api/admin/chef", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: c.email }) });
                loadChefs();
              }} className="text-xs text-red-700">Remove</button>
            </div>
          ))}
          {chefs.length === 0 && <p className="text-sm text-[#5A4A4D]">No chefs.</p>}
        </section>
      )}

      </main>
  );
}

