"use client";
import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function QrPage() {
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    const origin = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "");
    setUrl(origin);
    if (!origin) { setError("Set NEXT_PUBLIC_SITE_URL."); return; }
    QRCode.toDataURL(origin, { width: 512, margin: 2, color: { dark: "#512B32", light: "#FFFFFF" } })
      .then(setDataUrl).catch(() => setError("Failed."));
  }, []);

  const download = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "maison-elise-menu-qr.png";
    a.click();
  };

  return (
    <main className="max-w-md mx-auto px-4 py-10 text-center">
      <h1 className="font-serif text-2xl text-[#512B32]">Scan to View Our Menu</h1>
      {error && <p className="text-red-700 mt-4">{error}</p>}
      {dataUrl && (
        <>
          <img src={dataUrl} alt="QR code" className="mx-auto mt-4" width={240} height={240} />
          <p className="text-xs text-[#5A4A4D] mt-2 break-all">{url}</p>
          <button onClick={download} className="mt-4 px-4 py-2 bg-[#512B32] text-[#FFF2E7] text-sm">Download QR Code</button>
        </>
      )}
    </main>
  );
}
