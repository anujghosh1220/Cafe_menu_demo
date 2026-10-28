"use client";
import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function MenuQrDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [dataUrl, setDataUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    if (!open) return;
    const origin = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "");
    setUrl(origin);
    if (!origin) {
      setError("Set NEXT_PUBLIC_SITE_URL to generate a production QR code.");
      return;
    }
    QRCode.toDataURL(origin, { width: 512, margin: 2, color: { dark: "#512B32", light: "#FFFFFF" } })
      .then(setDataUrl)
      .catch(() => setError("Failed to generate QR code."));
  }, [open]);

  if (!open) return null;

  const download = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "the-chai-room-menu-qr.png";
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal="true" aria-labelledby="qr-title">
      <div className="bg-[#FFF2E7] p-6 max-w-sm w-full mx-4">
        <div className="flex justify-between items-center">
          <h2 id="qr-title" className="font-serif text-xl text-[#512B32]">Scan to View Our Menu</h2>
          <button onClick={onClose} aria-label="Close" className="text-[#5A4A4D]">✕</button>
        </div>
        <p className="text-sm text-[#5A4A4D] mt-2">Point your camera at the code to open the menu.</p>
        {error && <p className="text-sm text-red-700 mt-4">{error}</p>}
        {dataUrl && (
          <>
            <img src={dataUrl} alt="QR code" className="mx-auto mt-4" width={220} height={220} />
            <p className="text-xs text-[#5A4A4D] mt-2 break-all">{url}</p>
            <button onClick={download} className="mt-4 w-full py-2 bg-[#512B32] text-[#FFF2E7] text-sm">
              Download QR Code
            </button>
          </>
        )}
      </div>
    </div>
  );
}
