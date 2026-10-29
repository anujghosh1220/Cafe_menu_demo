"use client";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { useAdmin } from "@/components/admin-provider";
import { createClient } from "@/lib/supabase/client";
import { formatINR } from "@/lib/format-currency";

function validWhatsapp(n: string) {
  return /^\d{7,15}$/.test(n);
}

export function CartDrawer() {
  const { lines, setQty, remove, clear } = useCart();
  const { state } = useAdmin();
  let whatsappNumber = process.env.NEXT_PUBLIC_CAFE_WHATSAPP_NUMBER || state.whatsapp;
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  const close = () => {
    setClosing(true);
    setTimeout(() => { setOpen(false); setClosing(false); }, 300);
  };
  const [checkout, setCheckout] = useState(false);
  const [checkoutClosing, setCheckoutClosing] = useState(false);
  const closeCheckout = () => {
    setCheckoutClosing(true);
    setTimeout(() => { setCheckout(false); setCheckoutClosing(false); }, 200);
  };

  const [table, setTable] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resolved = lines.map((l) => {
    const item = state.items.find((m) => m.id === l.itemId)!;
    return { ...l, item, lineTotal: item.price * l.quantity };
  });
  const subtotal = resolved.reduce((s, r) => s + r.lineTotal, 0);
  const count = lines.reduce((s, l) => s + l.quantity, 0);

  const submit = async () => {
    const e: Record<string, string> = {};
    if (!table) e.table = "Table required";
    setErrors(e);
    if (Object.keys(e).length) return;
    if (!validWhatsapp(whatsappNumber)) {
      // try supabase
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from("cafe_settings").select("whatsapp_number").limit(1).single();
        if (error) { console.error(error); alert("Could not load WhatsApp configuration."); return; }
        const n = (data?.whatsapp_number || "").replace(/[^\d]/g, "");
        if (!n) { alert("WhatsApp number not configured."); return; }
        whatsappNumber = n;
      } catch (e) { console.error(e); alert("Could not load WhatsApp configuration."); return; }
    }
    const itemsText = resolved
      .map((r, i) => `${i + 1}. ${r.item.name} x ${r.quantity} - ${formatINR(r.lineTotal)}`)
      .join("\n");
    const msg = `NEW DINE-IN ORDER - MAISON ELISE

Table: ${table}${phone.trim() ? `\nPhone: ${phone}` : ""}

ORDER ITEMS
${itemsText}

Total: ${formatINR(subtotal)}${notes.trim() ? `

Special Instructions: ${notes}` : ""}

Please confirm availability and order acceptance.`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-40 bg-[#512B32] text-[#FFF2E7] px-4 py-2"
      >
        Cart ({count})
      </button>

      {(open || closing) && (
        <div className={`fixed inset-0 z-50 bg-black/50 flex justify-end ${closing ? "animate-fade-out" : "animate-fade-in"}`}>
          <div className={`bg-[#FFF2E7] w-full max-w-md h-full p-4 overflow-y-auto ${closing ? "translate-x-full transition-transform duration-300" : "animate-slide-in-right"}`}>
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-xl text-[#512B32]">Your Cart</h2>
              <button onClick={close}>Close</button>
            </div>
            {resolved.length === 0 ? (
              <p className="mt-6 text-[#5A4A4D]">Your cart is empty.</p>
            ) : (
              <>
                {resolved.map((r) => (
                  <div key={r.itemId} className="border-b border-[#D5B47A]/30 py-3">
                    <div className="flex justify-between">
                      <span className="text-[#342025]">{r.item.name}</span>
                      <span className="text-[#512B32]">{formatINR(r.lineTotal)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => setQty(r.itemId, r.quantity - 1)}>-</button>
                      <span>{r.quantity}</span>
                      <button onClick={() => setQty(r.itemId, r.quantity + 1)}>+</button>
                      <button onClick={() => remove(r.itemId)} className="ml-auto text-xs text-[#5A4A4D]">Remove</button>
                    </div>
                  </div>
                ))}
                <div className="mt-4">
                  <p className="font-medium text-[#342025]">Subtotal: {formatINR(subtotal)}</p>
                  <button onClick={() => setCheckout(true)} className="mt-3 w-full py-2 bg-[#512B32] text-[#FFF2E7]">Proceed to Order</button>
                  <button onClick={() => { if (confirm("Clear cart?")) clear(); }} className="mt-2 w-full py-2 border border-[#D5B47A]/40 text-[#342025]">Clear Cart</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {(checkout || checkoutClosing) && (
        <div className={`fixed inset-0 z-50 bg-black/50 flex items-center justify-center ${checkoutClosing ? "animate-fade-out" : "animate-fade-in"}`}>
          <div className={`bg-[#FFF2E7] w-full max-w-md p-4 max-h-[90vh] overflow-y-auto ${checkoutClosing ? "opacity-0 transition-opacity duration-200" : "animate-fade-in"}`}>
            <h2 className="font-serif text-xl text-[#512B32]">Checkout</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm">Table Number</label>
                <select value={table} onChange={(e) => setTable(e.target.value)} className="w-full border border-[#D5B47A]/40 p-2">
                  <option value="">Select a table</option>
                  {state.tables.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
                {errors.table && <p className="text-xs text-red-700">{errors.table}</p>}
              </div>
              <div>
                <label className="text-sm">Special Instructions (Optional)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border border-[#D5B47A]/40 p-2" />
              </div>
              <p className="text-sm text-[#342025]">Total: {formatINR(subtotal)}</p>
              <button onClick={submit} className="w-full py-2 bg-[#512B32] text-[#FFF2E7]">Proceed to Order</button>
              <button onClick={() => closeCheckout()} className="w-full py-2 border border-[#D5B47A]/40 text-[#342025]">Back to Cart</button>
            </div>
            <p className="text-xs text-[#5A4A4D] mt-3">Opening WhatsApp does not confirm the order. Send the message and wait for cafe confirmation.</p>
          </div>
        </div>
      )}
    </>
  );
}
