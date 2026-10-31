"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!email.trim()) { setError("Email is required"); return; }
    setLoading(true);
    const supabase = createClient();
    if (!supabase) { setError("Supabase not configured"); setLoading(false); return; }
    const redirectTo = `${window.location.origin}/admin/reset-password`;
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setMessage("If an account exists for that email, a password reset link will be sent.");
  };

  return (
    <main className="max-w-sm mx-auto px-4 py-20">
      <h1 className="font-serif text-2xl text-[#512B32]">Forgot Password</h1>
      <p className="text-sm text-[#5A4A4D] mt-2">Enter your admin email to receive a reset link.</p>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full border p-2" disabled={loading} />
        {error && <p className="text-sm text-red-700">{error}</p>}
        {message && <p className="text-sm text-green-700">{message}</p>}
        <button type="submit" disabled={loading} className="w-full py-2 bg-[#512B32] text-[#FFF2E7] disabled:opacity-50">
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>
      <p className="mt-4 text-sm"><Link href="/admin/login" className="text-[#5A4A4D] hover:text-[#512B32]">Back to login</Link></p>
    </main>
  );
}
