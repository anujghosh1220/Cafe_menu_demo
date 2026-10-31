"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Suspense } from "react";
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="max-w-sm mx-auto px-4 py-20"><p className="text-sm text-[#5A4A4D]">Loading...</p></main>}>
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
    <main className="max-w-sm mx-auto px-4 py-20">
      <h1 className="font-serif text-2xl text-[#512B32]">Reset Password</h1>
      {invalid && (
        <div className="mt-6 space-y-3">
          <p className="text-sm text-red-700">This reset link is invalid or expired.</p>
          <Link href="/admin/forgot-password" className="text-sm text-[#5A4A4D] hover:text-[#512B32]">Request a new link</Link>
        </div>
      )}
      {success && (
        <div className="mt-6 space-y-3">
          <p className="text-sm text-green-700">Password updated successfully.</p>
          <Link href="/admin/login" className="text-sm text-[#5A4A4D] hover:text-[#512B32]">Back to login</Link>
        </div>
      )}
      {!invalid && !success && ready && (
        <form onSubmit={submit} className="mt-6 space-y-3">
          <div className="relative">
            <input type={show ? "text" : "password"} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="New password" className="w-full border p-2 pr-10" disabled={loading} />
            <button type="button" onClick={()=>setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm">{show ? "Hide" : "Show"}</button>
          </div>
          <input type={show ? "text" : "password"} value={confirm} onChange={(e)=>setConfirm(e.target.value)} placeholder="Confirm password" className="w-full border p-2" disabled={loading} />
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-2 bg-[#512B32] text-[#FFF2E7] disabled:opacity-50">
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
      )}
      {!invalid && !success && !ready && <p className="mt-6 text-sm text-[#5A4A4D]">Verifying link...</p>}
    </main>
  );
}
