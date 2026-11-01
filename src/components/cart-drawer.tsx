"use client";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { useAdmin } from "@/components/admin-provider";
import { createClient } from "@/lib/supabase/client";
import { formatINR } from "@/lib/format-currency";
import { X, ShoppingBag, ChevronRight, Check, Trash2 } from "lucide-react";

export function CartDrawer() {
  const { lines, setQty, remove, clear } = useCart();
  const { state } = useAdmin();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [checkoutClosing, setCheckoutClosing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  const [table, setTable] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const close = () => {
    setClosing(true);
    setTimeout(() => { setOpen(false); setClosing(false); }, 300);
  };
  const closeCheckout = () => {
    setCheckoutClosing(true);
    setTimeout(() => { setCheckout(false); setCheckoutClosing(false); }, 200);
  };

  const resolved = lines.map((l) => {
    const item = state.items.find((m) => m.id === l.itemId)!;
    return { ...l, item, lineTotal: item.price * l.quantity };
  });
  const subtotal = resolved.reduce((s, r) => s + r.lineTotal, 0);
  const count = lines.reduce((s, l) => s + l.quantity, 0);

  const submit = async () => {
    if (saving) return;
    if (resolved.length === 0) return;
    const e: Record<string, string> = {};
    if (!table) e.table = "Table required";
    setErrors(e);
    if (Object.keys(e).length) return;

    setSaving(true);
    try {
      const supabase = createClient();
      if (!supabase) { alert("Supabase not configured"); return; }
      const { data, error } = await supabase.from("orders").insert({
        table_number: table,
        items: resolved.map((r) => ({ name: r.item.name, qty: r.quantity, price: r.item.price })),
        total: subtotal,
        special_instructions: notes.trim() || null,
        status: "new",
      }).select().single();
      if (error) { alert("Failed to save order"); console.error("order insert error", { message: error.message, code: (error as any).code, details: (error as any).details, hint: (error as any).hint }); return; }
      setConfirmedOrder(data);
      setConfirmOpen(true);
      setCheckout(false);
      closeCheckout();
      clear();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#512B32] text-[#FFF2E7] px-5 py-3 rounded-full shadow-lg hover:bg-[#342025] hover:shadow-xl transition-all duration-200 flex items-center gap-2"
      >
        <ShoppingBag className="w-4 h-4" />
        <span className="font-medium">Cart</span>
        {count > 0 && (
          <span className="bg-[#D5B47A] text-[#342025] text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>
        )}
      </button>

      {(open || closing) && (
        <div className={`fixed inset-0 z-50 bg-black/50 flex justify-end ${closing ? "animate-fade-out" : "animate-fade-in"}`}>
          <div className={`bg-[#FFF2E7] w-full max-w-md h-full flex flex-col ${closing ? "translate-x-full transition-transform duration-300" : "animate-slide-in-right"}`}>
            <div className="sticky top-0 bg-[#FFF2E7]/95 backdrop-blur-sm border-b border-[#D5B47A]/30 p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-serif text-2xl text-[#512B32]">Your Cart</h2>
                  <p className="text-sm text-[#5A4A4D] mt-1">{count} {count === 1 ? 'item' : 'items'}</p>
                </div>
                <button
                  onClick={close}
                  className="p-2 text-[#5A4A4D] hover:text-[#512B32] hover:bg-[#D5B47A]/10 rounded-full transition"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {resolved.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-[#D5B47A]/40 mb-4" />
                  <p className="text-[#5A4A4D] mb-2">Your cart is empty</p>
                  <p className="text-sm text-[#5A4A4D]/70">Add some delicious items to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {resolved.map((r) => (
                    <div key={r.itemId} className="bg-white/60 border border-[#D5B47A]/30 rounded-xl p-4">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-[#342025]">{r.item.name}</h3>
                          <p className="text-sm text-[#5A4A4D] mt-1 line-clamp-2">{r.item.description}</p>
                        </div>
                        <span className="text-[#512B32] font-serif tabular-nums whitespace-nowrap">{formatINR(r.lineTotal)}</span>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setQty(r.itemId, r.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-[#D5B47A]/40 text-[#342025] hover:bg-[#D5B47A]/10 transition flex items-center justify-center"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium text-[#342025]">{r.quantity}</span>
                          <button
                            onClick={() => setQty(r.itemId, r.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-[#D5B47A]/40 text-[#342025] hover:bg-[#D5B47A]/10 transition flex items-center justify-center"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => remove(r.itemId)}
                          className="text-xs text-[#5A4A4D] hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-full transition flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {resolved.length > 0 && (
              <div className="sticky bottom-0 bg-[#FFF2E7]/95 backdrop-blur-sm border-t border-[#D5B47A]/30 p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#342025]">Subtotal</span>
                  <span className="text-[#512B32] font-serif text-xl">{formatINR(subtotal)}</span>
                </div>
                <button
                  onClick={() => setCheckout(true)}
                  className="w-full py-3 bg-[#512B32] text-[#FFF2E7] rounded-full font-medium hover:bg-[#342025] transition flex items-center justify-center gap-2"
                >
                  Proceed to Order
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { if (confirm("Clear cart?")) clear(); }}
                  className="w-full py-2 border border-[#D5B47A]/40 text-[#5A4A4D] rounded-full hover:bg-[#D5B47A]/10 transition text-sm"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {(checkout || checkoutClosing) && (
        <div className={`fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 ${checkoutClosing ? "animate-fade-out" : "animate-fade-in"}`}>
          <div className={`bg-[#FFF2E7] w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl ${checkoutClosing ? "opacity-0 transition-opacity duration-200" : "animate-fade-in"}`}>
            <div className="sticky top-0 bg-[#FFF2E7]/95 backdrop-blur-sm border-b border-[#D5B47A]/30 p-6">
              <div className="flex justify-between items-center">
                <h2 className="font-serif text-2xl text-[#512B32]">Checkout</h2>
                <button
                  onClick={closeCheckout}
                  className="p-2 text-[#5A4A4D] hover:text-[#512B32] hover:bg-[#D5B47A]/10 rounded-full transition"
                  aria-label="Close checkout"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#342025] mb-2">Table Number</label>
                <select
                  value={table}
                  onChange={(e) => setTable(e.target.value)}
                  className="w-full border border-[#D5B47A]/40 p-3 rounded-lg bg-white/60 text-[#342025] focus:outline-none focus:ring-2 focus:ring-[#512B32] transition"
                >
                  <option value="">Select a table</option>
                  {state.tables.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
                {errors.table && <p className="text-xs text-red-700 mt-1">{errors.table}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#342025] mb-2">Special Instructions <span className="text-[#5A4A4D] font-normal">(Optional)</span></label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any dietary requirements or preferences?"
                  rows={3}
                  className="w-full border border-[#D5B47A]/40 p-3 rounded-lg bg-white/60 text-[#342025] focus:outline-none focus:ring-2 focus:ring-[#512B32] transition resize-none"
                />
              </div>
              <div className="border-t border-[#D5B47A]/30 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#342025] font-medium">Total</span>
                  <span className="text-[#512B32] font-serif text-2xl">{formatINR(subtotal)}</span>
                </div>
              </div>
              <button
                onClick={submit}
                disabled={saving}
                className="w-full py-3 bg-[#512B32] text-[#FFF2E7] rounded-full font-medium hover:bg-[#342025] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="animate-pulse">Placing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Place Order</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <button
                onClick={closeCheckout}
                className="w-full py-2 border border-[#D5B47A]/40 text-[#5A4A4D] rounded-full hover:bg-[#D5B47A]/10 transition text-sm"
              >
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmOpen && confirmedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FFF2E7] w-full max-w-md rounded-2xl shadow-xl p-6 text-center">
            <div className="w-16 h-16 bg-[#512B32] rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-[#D5B47A]" />
            </div>
            <h2 className="font-serif text-2xl text-[#512B32] mb-2">Order Confirmed!</h2>
            <p className="text-sm text-[#5A4A4D] mb-6">Your order has been placed successfully</p>
            <div className="bg-white/60 border border-[#D5B47A]/30 rounded-xl p-4 text-left space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-[#5A4A4D]">Order ID</span>
                <span className="text-[#342025] font-medium">{confirmedOrder.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#5A4A4D]">Table</span>
                <span className="text-[#342025] font-medium">{confirmedOrder.table_number}</span>
              </div>
              <div className="border-t border-[#D5B47A]/20 pt-2 mt-2">
                <p className="text-xs text-[#5A4A4D] mb-1">Items</p>
                <ul className="text-sm text-[#342025] space-y-1">
                  {(confirmedOrder.items || []).map((it: any, i: number) => (
                    <li key={i}>{it.qty} × {it.name}</li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-[#D5B47A]/20 pt-2 flex justify-between">
                <span className="text-[#5A4A4D]">Total</span>
                <span className="text-[#512B32] font-serif font-medium">{formatINR(confirmedOrder.total)}</span>
              </div>
              {confirmedOrder.special_instructions && (
                <div className="border-t border-[#D5B47A]/20 pt-2">
                  <p className="text-xs text-[#5A4A4D]">Instructions</p>
                  <p className="text-sm text-[#342025]">{confirmedOrder.special_instructions}</p>
                </div>
              )}
            </div>
            <button
              onClick={() => { setConfirmOpen(false); setConfirmedOrder(null); }}
              className="w-full py-3 bg-[#512B32] text-[#FFF2E7] rounded-full font-medium hover:bg-[#342025] transition"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
