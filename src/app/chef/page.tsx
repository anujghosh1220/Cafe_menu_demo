"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ChefDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    const load = async () => {
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      setOrders(data || []);
    };
    load();
    const channel = supabase.channel("orders").on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, (payload) => {
      setOrders((prev) => [payload.new, ...prev]);
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const logout = async () => {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    router.push("/chef/login");
  };

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.from("orders").update({ status }).eq("id", id);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <h1 className="font-serif text-2xl text-[#512B32]">Chef Dashboard</h1>
        <button onClick={logout} className="text-sm text-[#5A4A4D]">Logout</button>
      </div>
      <div className="mt-6 space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="border border-[#D5B47A]/40 p-4 bg-[#FFF2E7]">
            <p className="text-sm text-[#5A4A4D]">Table: {o.table_number} · {new Date(o.created_at).toLocaleString()}</p>
            <p className="text-[#342025] font-medium mt-1">Total: {o.total}</p>
            <ul className="text-sm mt-2">
              {(o.items || []).map((it: any, i: number) => <li key={i}>{it.qty} × {it.name}</li>)}
            </ul>
            {o.special_instructions && <p className="text-sm mt-2">Instructions: {o.special_instructions}</p>}
            <div className="flex gap-2 mt-3 flex-wrap">
              {["accepted","preparing","ready","completed"].map((s) => (
                <button key={s} onClick={() => updateStatus(o.id, s)} className="text-xs px-3 py-1 border border-[#D5B47A]/40">{s}</button>
              ))}
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="text-[#5A4A4D]">No orders.</p>}
      </div>
    </main>
  );
}
