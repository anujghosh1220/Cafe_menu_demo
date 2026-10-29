"use client";
import { createClient } from "@/lib/supabase/client";
import { useAdmin } from "@/components/admin-provider";
import type { MenuItem } from "@/data/menu";

export default function AdminPage() {
  const { state, setState } = useAdmin();
  const [tab, setTab] = useState<"menu" | "tables" | "settings">("menu");
  const [name, setName] = useState("");
  const [waInput, setWaInput] = useState(state.whatsapp);
  const [waStatus, setWaStatus] = useState<"saved" | "unsaved" | "invalid" | "">("");
  useEffect(() => { setWaInput(state.whatsapp); }, [state.whatsapp]);

  const normalizeWa = (v: string) => v.replace(/[^\d]/g, "");
  const saveWa = async () => {
    const n = normalizeWa(waInput.trim());
    if (n.length < 10) { setWaStatus("invalid"); return; }
    setWaStatus("saving");
    try {
      const supabase = createClient();
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
  const [desc, setDesc] = useState("");

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
        {(["menu","tables","settings"] as const).map((t) => (
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
    </main>
  );
}
