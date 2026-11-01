"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#342025] via-[#512B32] to-[#342025] flex items-center justify-center p-4"><p className="text-sm text-[#C99C91]">Loading...</p></div>}>
      <ResetPasswordInner />
    </Suspense>
  );
}

function ResetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) { setInvalid(true); return; }
    const code = searchParams.get("code");
    const run = async () => {
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) { setInvalid(true); return; }
      }
      const { data } = await supabase.auth.getSession();
      if (data.session) setReady(true);
      else setInvalid(true);
    };
    run();
  }, [searchParams]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    setLoading(true);
    const supabase = createClient();
    if (!supabase) { setError("Supabase not configured"); setLoading(false); return; }
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSuccess(true);
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
          <h1 className="font-serif text-2xl text-[#FFF2E7] mt-2">Reset Password</h1>
          <p className="text-sm text-[#C99C91] mt-1">Create a new secure password</p>
        </div>
        {invalid && (
          <div className="flex items-center gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <AlertCircle className="w-5 h-5" />
            <div>
              <p className="font-medium">Invalid or expired link</p>
              <Link href="/admin/forgot-password" className="text-[#D5B47A] hover:text-[#FFF2E7] transition mt-1 inline-block">Request a new link</Link>
            </div>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 text-sm text-green-300 bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <CheckCircle className="w-5 h-5" />
            <div>
              <p className="font-medium">Password updated successfully</p>
              <Link href="/admin/login" className="text-[#D5B47A] hover:text-[#FFF2E7] transition mt-1 inline-block">Back to login</Link>
            </div>
          </div>
        )}
        {!invalid && !success && ready && (
          <form onSubmit={submit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D5B47A]" />
              <input type={show ? "text" : "password"} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="New password" className="w-full pl-10 pr-10 py-3 rounded-lg bg-[#FFF2E7]/5 border border-[#D5B47A]/30 text-[#FFF2E7] placeholder:text-[#C99C91] focus:outline-none focus:border-[#D5B47A] transition" disabled={loading} />
              <button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D5B47A] hover:text-[#FFF2E7] transition">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D5B47A]" />
              <input type={show ? "text" : "password"} value={confirm} onChange={(e)=>setConfirm(e.target.value)} placeholder="Confirm password" className="w-full pl-10 pr-3 py-3 rounded-lg bg-[#FFF2E7]/5 border border-[#D5B47A]/30 text-[#FFF2E7] placeholder:text-[#C99C91] focus:outline-none focus:border-[#D5B47A] transition" disabled={loading} />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
            <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-[#512B32] text-[#FFF2E7] border border-[#D5B47A]/40 hover:bg-[#D5B47A] hover:text-[#342025] transition disabled:opacity-50">
              {loading ? "Updating..." : "Update password"}
            </button>
          </form>
        )}
        {!invalid && !success && !ready && <p className="text-sm text-[#C99C91]">Verifying link...</p>}
      </div>
    </div>
  );
}
