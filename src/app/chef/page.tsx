"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ChefDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();

  const [connected, setConnected] = useState("Connecting…");

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/chef/login"); return; }
      const { data: chef } = await supabase.from("chef_accounts").select("active").eq("user_id", user.id).single();
      if (!chef || !chef.active) { router.push("/chef/login"); return; }
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      setOrders(data || []);
    };
    init();

    const channel = supabase.channel("orders").on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
      setOrders((prev) => {
        if (payload.eventType === "INSERT") return [payload.new, ...prev.filter((o) => o.id !== payload.new.id)];
        if (payload.eventType === "UPDATE") return prev.map((o) => (o.id === payload.new.id ? payload.new : o));
        if (payload.eventType === "DELETE") return prev.filter((o) => o.id !== payload.old.id);
        return prev;
      });
    }).subscribe((status) => {
      setConnected(status === "SUBSCRIBED" ? "Live updates connected" : "Reconnecting…");
    });

    // polling fallback
    const interval = setInterval(async () => {
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (data) setOrders(data);
    }, 20000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const logout = async () => {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    router.push("/chef/login");
  };

  const [completing, setCompleting] = useState<Set<string>>(new Set());

  const completeOrder = async (id: string) => {
    if (completing.has(id)) return;
    setCompleting((s) => new Set(s).add(id));
    const supabase = createClient();
    if (!supabase) { setCompleting((s) => { const n = new Set(s); n.delete(id); return n; }); return; }
    const { error } = await supabase.from("orders").update({ status: "completed" }).eq("id", id);
    setCompleting((s) => { const n = new Set(s); n.delete(id); return n; });
    if (error) { alert("Failed"); return; }
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "completed" } : o)));
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <h1 className="font-serif text-2xl text-[#512B32]">Chef Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#5A4A4D]">{connected}</span>
          <button onClick={logout} className="text-sm text-[#5A4A4D]">Logout</button>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {orders.map((o) => (
          <div key={o.id} className={`border border-[#D5B47A]/40 p-4 bg-[#FFF2E7] relative ${o.status === "completed" ? "opacity-50 pointer-events-none" : ""}`}>
            <p className="text-sm text-[#5A4A4D]">Table: {o.table_number} · {new Date(o.created_at).toLocaleString()}</p>
            <p className="text-[#342025] font-medium mt-1">Total: {o.total}</p>
            <ul className="text-sm mt-2">
              {(o.items || []).map((it: any, i: number) => <li key={i}>{it.qty} × {it.name}</li>)}
            </ul>
            {o.status === "completed" && <p className="text-xs text-[#D5B47A] mt-2">Completed</p>}
            {o.status !== "completed" && (
              <button disabled={completing.has(o.id)} onClick={() => completeOrder(o.id)} className="mt-3 px-3 py-1 bg-[#512B32] text-[#FFF2E7] text-sm disabled:opacity-50">
                {completing.has(o.id) ? "Completing..." : "Complete Order"}
              </button>
            )}
            {(o.status === "completed" || completing.has(o.id)) && (
              <div className="pointer-events-none absolute inset-y-0 left-1/2 w-0.5 bg-[#D5B47A] z-10" style={{ transform: "translateX(-50%)" }} />
            )}
          </div>
        ))}
        {orders.length === 0 && <p className="text-[#5A4A4D]">No orders.</p>}
      </div>
    </main>
  );
}
