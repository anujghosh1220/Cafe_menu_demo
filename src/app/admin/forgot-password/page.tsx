"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-[#342025] via-[#512B32] to-[#342025] flex items-center justify-center p-4">
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#D5B47A]/20 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#C99C91]/20 blur-3xl animate-pulse" />
      <div className="relative w-full max-w-md bg-[#342025]/60 backdrop-blur-xl rounded-2xl border border-[#D5B47A]/30 shadow-2xl p-8 animate-scale-in">
        <Link href="/admin/login" className="inline-flex items-center gap-2 text-[#D5B47A] hover:text-[#FFF2E7] transition mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to login</span>
        </Link>
        <div className="mb-6">
          <p className="text-xs tracking-[0.3em] text-[#D5B47A]">MAISON ÉLISE</p>
          <h1 className="font-serif text-2xl text-[#FFF2E7] mt-2">Forgot Password</h1>
          <p className="text-sm text-[#C99C91] mt-1">Enter your admin email to receive a reset link</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D5B47A]" />
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full pl-10 pr-3 py-3 rounded-lg bg-[#FFF2E7]/5 border border-[#D5B47A]/30 text-[#FFF2E7] placeholder:text-[#C99C91] focus:outline-none focus:border-[#D5B47A] transition" disabled={loading} />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
          {message && (
            <div className="flex items-center gap-2 text-sm text-green-300 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <CheckCircle className="w-4 h-4" />
              <span>{message}</span>
            </div>
          )}
          <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-[#512B32] text-[#FFF2E7] border border-[#D5B47A]/40 hover:bg-[#D5B47A] hover:text-[#342025] transition disabled:opacity-50">
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
      </div>
    </div>
  );
}
