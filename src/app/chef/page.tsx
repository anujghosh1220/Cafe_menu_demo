"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import ChefDashboardShell from "@/components/chef-dashboard-shell";
import { Check, Clock, ChefHat, Utensils, AlertCircle, Flame, Circle, Package } from "lucide-react";

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
            applyEvent(payload);
          })
          .subscribe((status, err) => {
            if (cancelled || !mountedRef.current) return;
            if (status === "SUBSCRIBED") {
              setConnected("Live");
              backoffRef.current = 1000;
              fetchOrders();
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

  const pendingOrders = orders.filter(o => o.status !== "completed");
  const completedOrders = orders.filter(o => o.status === "completed");

  const getElapsedTime = (createdAt: string) => {
    const now = Date.now();
    const created = new Date(createdAt).getTime();
    const elapsed = Math.floor((now - created) / 60000);
    if (elapsed < 1) return "Just now";
    if (elapsed < 60) return `${elapsed}m ago`;
    const hours = Math.floor(elapsed / 60);
    return `${hours}h ago`;
  };

  return (
    <ChefDashboardShell onLogout={logout} connectionStatus={connected}>
      <div className="space-y-6 lg:space-y-8">
        {pendingOrders.length === 0 && completedOrders.length === 0 && (
          <div className="text-center py-16 lg:py-24">
            <div className="w-20 h-20 rounded-2xl bg-[#512B32]/10 flex items-center justify-center mx-auto mb-6">
              <ChefHat className="w-10 h-10 text-[#512B32]" />
            </div>
            <h2 className="font-serif text-2xl lg:text-3xl text-[#512B32] mb-2">Kitchen Ready</h2>
            <p className="text-[#5A4A4D]">Orders will appear here in real-time</p>
          </div>
        )}

        {pendingOrders.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D5B47A] to-[#C99C91] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-[#342025]" />
                </div>
                <div>
                  <h2 className="font-serif text-xl lg:text-2xl text-[#512B32]">Active Orders</h2>
                  <p className="text-xs text-[#5A4A4D]">{pendingOrders.length} order{pendingOrders.length !== 1 ? 's' : ''} in progress</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {pendingOrders.map((o, index) => (
                <div key={o.id} className="bg-white/70 border border-[#D5B47A]/30 rounded-2xl p-5 lg:p-6 shadow-sm hover:shadow-lg hover:border-[#D5B47A] transition-all duration-300 animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#512B32] to-[#342025] flex items-center justify-center shadow-md">
                        <span className="text-[#D5B47A] font-serif text-xl font-bold">{o.table_number}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-[#342025]">Table {o.table_number}</p>
                        <p className="text-xs text-[#5A4A4D] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getElapsedTime(o.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#D5B47A]/20 flex items-center justify-center">
                      <Utensils className="w-4 h-4 text-[#D5B47A]" />
                    </div>
                  </div>
                  <ul className="space-y-3 mb-4">
                    {(o.items || []).map((it: any, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#342025]">
                        <span className="w-7 h-7 rounded-lg bg-[#D5B47A]/20 flex items-center justify-center text-xs text-[#512B32] font-bold flex-shrink-0">{it.qty}</span>
                        <span className="flex-1">{it.name}</span>
                      </li>
                    ))}
                  </ul>
                  {o.special_instructions && (
                    <div className="mb-4 p-3 lg:p-4 bg-gradient-to-r from-[#C99C91]/20 to-[#D5B47A]/10 border border-[#C99C91]/30 rounded-xl">
                      <p className="text-xs text-[#342025] flex items-start gap-2 font-medium">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#C99C91]" />
                        <span>{o.special_instructions}</span>
                      </p>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-[#D5B47A]/20">
                    <div>
                      <p className="text-xs text-[#5A4A4D]">Total</p>
                      <p className="font-serif text-xl lg:text-2xl text-[#512B32]">₹{o.total}</p>
                    </div>
                    <button
                      disabled={completing.has(o.id)}
                      onClick={() => completeOrder(o.id)}
                      className="px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-[#512B32] to-[#342025] text-[#FFF2E7] rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    >
                      {completing.has(o.id) ? (
                        <>
                          <Circle className="w-4 h-4 animate-spin" />
                          <span>Completing...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span className="font-medium">Complete</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {completedOrders.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4 lg:mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#342025]/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-[#5A4A4D]" />
              </div>
              <div>
                <h2 className="font-serif text-xl lg:text-2xl text-[#342025]">Completed Orders</h2>
                <p className="text-xs text-[#5A4A4D]">{completedOrders.length} order{completedOrders.length !== 1 ? 's' : ''} finished</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
              {completedOrders.map((o) => (
                <div key={o.id} className="bg-white/40 border border-[#D5B47A]/20 rounded-xl p-4 opacity-60">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#342025]">Table {o.table_number}</p>
                      <p className="text-xs text-[#5A4A4D]">{new Date(o.created_at).toLocaleTimeString()}</p>
                    </div>
                    <p className="font-serif text-lg text-[#512B32]">₹{o.total}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ChefDashboardShell>
  );
}
