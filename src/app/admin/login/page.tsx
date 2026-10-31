"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient()!;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); return; }
    router.push("/admin");
  };

  return (
    <main className="max-w-sm mx-auto px-4 py-20">
      <h1 className="font-serif text-2xl text-[#512B32]">Admin Login</h1>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full border p-2" />
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="w-full border p-2" />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button type="submit" className="w-full py-2 bg-[#512B32] text-[#FFF2E7]">Sign in</button>
      </form>
      <p className="mt-4 text-sm"><a href="/admin/forgot-password" className="text-[#5A4A4D] hover:text-[#512B32]">Forgot password?</a></p>
    </main>
  );
}
