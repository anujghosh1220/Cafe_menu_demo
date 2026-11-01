"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChefHat, ArrowLeft, Flame } from "lucide-react";

export default function ChefLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const supabase = createClient();
    if (!supabase) { setError("Supabase not configured"); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    router.push("/chef");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#342025] via-[#512B32] to-[#342025] flex items-center justify-center p-4">
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#D5B47A]/20 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#C99C91]/20 blur-3xl animate-pulse" />
      <div className="relative w-full max-w-md bg-[#342025]/60 backdrop-blur-xl rounded-2xl border border-[#D5B47A]/30 shadow-2xl p-8 animate-scale-in">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D5B47A] to-[#C99C91] flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Flame className="w-8 h-8 text-[#342025]" />
          </div>
          <p className="text-xs tracking-[0.3em] text-[#D5B47A]">MAISON ÉLISE</p>
          <h1 className="font-serif text-2xl text-[#FFF2E7] mt-2">Kitchen Access</h1>
          <p className="text-sm text-[#C99C91] mt-1">Sign in to manage kitchen orders</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#D5B47A] mb-2 uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="chef@maisonelise.com"
              className="w-full px-4 py-3 rounded-lg bg-[#FFF2E7]/5 border border-[#D5B47A]/30 text-[#FFF2E7] placeholder:text-[#C99C91] focus:outline-none focus:border-[#D5B47A] focus:ring-2 focus:ring-[#D5B47A]/10 transition"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#D5B47A] mb-2 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••••"
                className="w-full px-4 py-3 pr-12 rounded-lg bg-[#FFF2E7]/5 border border-[#D5B47A]/30 text-[#FFF2E7] placeholder:text-[#C99C91] focus:outline-none focus:border-[#D5B47A] focus:ring-2 focus:ring-[#D5B47A]/10 transition"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D5B47A] hover:text-[#FFF2E7] transition"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-sm text-red-300 text-center">{error}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#512B32] to-[#342025] text-[#FFF2E7] border border-[#D5B47A]/40 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-pulse">Signing in...</span>
              </>
            ) : (
              <>
                <ChefHat className="w-4 h-4" />
                <span className="font-medium">Access Kitchen</span>
              </>
            )}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/admin/login" className="inline-flex items-center gap-2 text-sm text-[#D5B47A] hover:text-[#FFF2E7] transition">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Admin</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
