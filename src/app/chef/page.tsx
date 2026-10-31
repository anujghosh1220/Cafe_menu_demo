"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/dashboard-shell";

type Order = any;

export default function ChefDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();
  const [connected, setConnected] = useState("Connecting…");

  const bufferRef = useRef<Order[]>([]);
  const channelRef = useRef<any>(null);
  const mountedRef = useRef(true);
  const reconnectTimer = useRef<any>(null);
  const backoffRef = useRef(1000);
  const pollingRef = useRef<any>(null);
  const fetchingRef = useRef(false);
  const lastFetchRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;
    const supabase = createClient();
    if (!supabase) return;
    let cancelled = false;

    const reconcile = (incoming: Order[]) => {
      setOrders((prev) => {
        const map = new Map(prev.map((o) => [o.id, o]));
        for (const o of incoming) map.set(o.id, { ...map.get(o.id), ...o });
        return Array.from(map.values()).sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
    };

    const fetchOrders = async () => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;
      try {
        const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
        if (cancelled || !mountedRef.current) return;
        if (data) {
          // reconcile buffered realtime events received before/during fetch
          const buffered = bufferRef.current;
          bufferRef.current = [];
          const merged = [...data];
          for (const b of buffered) {
            const idx = merged.findIndex((o) => o.id === b.id);
            if (idx >= 0) merged[idx] = { ...merged[idx], ...b };
            else merged.unshift(b);
          }
          reconcile(merged);
          lastFetchRef.current = Date.now();
        }
      } finally {
        fetchingRef.current = false;
      }
    };

    const applyEvent = (payload: any) => {
      const ev = payload?.new || payload?.old;
      if (payload.eventType === "INSERT" && payload.new) {
        setOrders((prev) => {
          if (prev.some((o) => o.id === payload.new.id)) return prev;
          return [payload.new, ...prev].sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });
      } else if (payload.eventType === "UPDATE" && payload.new) {
        setOrders((prev) => prev.map((o) => (o.id === payload.new.id ? { ...o, ...payload.new } : o)));
      } else if (payload.eventType === "DELETE" && payload.old) {
        setOrders((prev) => prev.filter((o) => o.id !== payload.old.id));
      }
    };

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (cancelled || !mountedRef.current) return;
      if (!user) { router.push("/chef/login"); return; }
      const { data: chef } = await supabase.from("chef_accounts").select("active").eq("user_id", user.id).single();
      if (cancelled || !mountedRef.current) return;
      if (!chef || !chef.active) { router.push("/chef/login"); return; }

      const connect = () => {
        if (cancelled || !mountedRef.current) return;
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
        const channel = supabase
          .channel("orders-chef")
          .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
            if (!mountedRef.current) return;
            // buffer if not yet subscribed? We'll apply directly; fetch reconciles.
            applyEvent(payload);
          })
          .subscribe((status, err) => {
            if (cancelled || !mountedRef.current) return;
            if (status === "SUBSCRIBED") {
              setConnected("Live");
              backoffRef.current = 1000;
              // fetch after subscription active
              fetchOrders();
              // reconnect reconciliation
            } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
              setConnected("Reconnecting…");
              scheduleReconnect();
            } else if (status === "CLOSED") {
              setConnected("Offline");
              scheduleReconnect();
            }
            if (err) {
              console.error("channel error", err);
            }
          });
        channelRef.current = channel;
      };

      const scheduleReconnect = () => {
        if (reconnectTimer.current) return;
        const delay = backoffRef.current;
        backoffRef.current = Math.min(backoffRef.current * 2, 15000);
        reconnectTimer.current = setTimeout(() => {
          reconnectTimer.current = null;
          connect();
        }, delay);
      };

      connect();

      // polling fallback 12s
      pollingRef.current = setInterval(() => {
        fetchOrders();
      }, 12000);
    };

    init();

    return () => {
      cancelled = true;
      mountedRef.current = false;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  const logout = async () => {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    router.push("/chef/login");
  };

  const [completing, setCompleting] = useState<Set<string>>(new Set());
  const [justCompleted, setJustCompleted] = useState<Set<string>>(new Set());

  const completeOrder = async (id: string) => {
    if (completing.has(id)) return;
    setCompleting((s) => new Set(s).add(id));
    const supabase = createClient();
    if (!supabase) { setCompleting((s) => { const n = new Set(s); n.delete(id); return n; }); return; }
    const { error } = await supabase.from("orders").update({ status: "completed" }).eq("id", id);
    setCompleting((s) => { const n = new Set(s); n.delete(id); return n; });
    if (error) { alert("Failed"); return; }
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "completed" } : o)));
    setJustCompleted((s) => new Set(s).add(id));
  };

  return (
    <DashboardShell title="Chef Dashboard" onLogout={logout}>
      <div className="flex justify-end items-center mb-4">
        <span className="text-xs text-[#5A4A4D]">{connected}</span>
      </div>
      <div className="mt-6 space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="border border-[#D5B47A]/40 p-4 bg-[#FFF2E7] relative" style={{ opacity: o.status === "completed" ? 0.35 : 1, transition: "opacity 0.5s ease 0.8s" }}>
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
            {o.status === "completed" && (
              <div className="pointer-events-none absolute -left-4 -right-4 top-1/2 h-0.5 bg-[#D5B47A] z-10 origin-left" style={{ transform: justCompleted.has(o.id) ? "scaleX(0)" : "scaleX(1)", animation: justCompleted.has(o.id) ? "drawLine 0.75s cubic-bezier(0.22,1,0.36,1) forwards" : "none" }} />
            )}
          </div>
        ))}
        {orders.length === 0 && <p className="text-[#5A4A4D]">No orders.</p>}
      </div>
    </DashboardShell>
  );
}
