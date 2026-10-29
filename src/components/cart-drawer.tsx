"use client";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { menuItems } from "@/data/menu";
import { formatINR } from "@/lib/format-currency";

const whatsappNumber = process.env.NEXT_PUBLIC_CAFE_WHATSAPP_NUMBER || "";

function validWhatsapp(n: string) {
  return /^\d{7,15}$/.test(n);
}

export function CartDrawer() {
  const { lines, setQty, remove, clear } = useCart();
  const [open, setOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState<"takeaway" | "delivery">("takeaway");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resolved = lines.map((l) => {
    const item = menuItems.find((m) => m.id === l.itemId)!;
    return { ...l, item, lineTotal: item.price * l.quantity };
  });
  const subtotal = resolved.reduce((s, r) => s + r.lineTotal, 0);
  const count = lines.reduce((s, l) => s + l.quantity, 0);

  const submit = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name required";
    if (!phone.trim()) e.phone = "Phone required";
    if (type === "delivery" && !address.trim()) e.address = "Address required";
    setErrors(e);
    if (Object.keys(e).length) return;
    if (!validWhatsapp(whatsappNumber)) {
      alert("WhatsApp number not configured.");
      return;
    }
    const itemsText = resolved
      .map((r, i) => `${i + 1}. ${r.item.name} x ${r.quantity} - ${formatINR(r.lineTotal)}`)
      .join("\n");
    const msg = `Maison Elise - New Order

Customer: ${name}
Order type: ${type}
Phone: ${phone}

Items:
${itemsText}

Subtotal: ${formatINR(subtotal)}
Additional charges: ${formatINR(0)}
Total: ${formatINR(subtotal)}

Delivery address: ${type === "delivery" ? address : "N/A"}
Special instructions: ${notes || "None"}

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

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end animate-fade-in">
          <div className="bg-[#FFF2E7] w-full max-w-md h-full p-4 overflow-y-auto animate-slide-in-right">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-xl text-[#512B32]">Your Cart</h2>
              <button onClick={() => setOpen(false)}>Close</button>
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

      {checkout && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-[#FFF2E7] w-full max-w-md p-4 max-h-[90vh] overflow-y-auto">
            <h2 className="font-serif text-xl text-[#512B32]">Checkout</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-[#D5B47A]/40 p-2" />
                {errors.name && <p className="text-xs text-red-700">{errors.name}</p>}
              </div>
              <div>
                <label className="text-sm">Order type</label>
                <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full border border-[#D5B47A]/40 p-2">
                  <option value="takeaway">Takeaway</option>
                  <option value="delivery">Delivery</option>
                </select>
              </div>
              <div>
                <label className="text-sm">Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-[#D5B47A]/40 p-2" />
                {errors.phone && <p className="text-xs text-red-700">{errors.phone}</p>}
              </div>
              {type === "delivery" && (
                <div>
                  <label className="text-sm">Delivery address</label>
                  <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border border-[#D5B47A]/40 p-2" />
                  {errors.address && <p className="text-xs text-red-700">{errors.address}</p>}
                  <p className="text-xs text-[#5A4A4D] mt-1">Delivery availability, charges, and minimums must be confirmed by the cafe.</p>
                </div>
              )}
              <div>
                <label className="text-sm">Special instructions</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border border-[#D5B47A]/40 p-2" />
              </div>
              <p className="text-sm text-[#342025]">Total: {formatINR(subtotal)}</p>
              <button onClick={submit} className="w-full py-2 bg-[#512B32] text-[#FFF2E7]">Proceed to Order</button>
              <button onClick={() => setCheckout(false)} className="w-full py-2 border border-[#D5B47A]/40 text-[#342025]">Back to Cart</button>
            </div>
            <p className="text-xs text-[#5A4A4D] mt-3">Opening WhatsApp does not confirm the order. Send the message and wait for cafe confirmation.</p>
          </div>
        </div>
      )}
    </>
  );
}
