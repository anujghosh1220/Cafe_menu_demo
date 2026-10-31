"use client";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export type LoginCardProps = {
  variant: "admin" | "chef";
  title: string;
  description: string;
  onSubmit: (email: string, password: string) => Promise<void> | void;
  isLoading?: boolean;
  error?: string;
  forgotPasswordHref?: string;
};

export default function LoginCard({ title, description, onSubmit, isLoading, error, forgotPasswordHref }: LoginCardProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (py - 0.5) * -8, y: (px - 0.5) * 8 });
  };
  const handleLeave = () => setTilt({ x: 0, y: 0 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#342025] via-[#512B32] to-[#342025] p-4">
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#D5B47A]/20 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#C99C91]/20 blur-3xl animate-pulse" />
      <div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition: "transform 0.15s ease-out" }}
        className="relative w-full max-w-md rounded-2xl border border-[#D5B47A]/30 bg-[#342025]/60 backdrop-blur-xl shadow-2xl p-8 animate-[fadeIn_0.4s_ease-out]"
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute inset-[-2px] rounded-2xl animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,#D5B47A,transparent_60deg,#D5B47A,transparent_180deg,#C99C91,transparent_260deg,#D5B47A)] opacity-60" style={{ mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)", WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)", maskComposite: "exclude", WebkitMaskComposite: "xor", padding: "2px" }} />
        </div>
        <div className="relative z-10">
          <div className="text-center mb-6">
            <p className="text-xs tracking-[0.3em] text-[#D5B47A]">MAISON ÉLISE</p>
            <h1 className="font-serif text-2xl text-[#FFF2E7] mt-2">{title}</h1>
            <p className="text-sm text-[#C99C91] mt-1">{description}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D5B47A]" />
              <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full pl-10 pr-3 py-2 rounded-lg bg-[#FFF2E7]/5 border border-[#D5B47A]/30 text-[#FFF2E7] placeholder:text-[#C99C91] focus:outline-none focus:border-[#D5B47A] transition" disabled={isLoading} />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D5B47A]" />
              <input type={show ? "text" : "password"} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="w-full pl-10 pr-10 py-2 rounded-lg bg-[#FFF2E7]/5 border border-[#D5B47A]/30 text-[#FFF2E7] placeholder:text-[#C99C91] focus:outline-none focus:border-[#D5B47A] transition" disabled={isLoading} />
              <button type="button" onClick={()=>setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D5B47A]">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-sm text-red-300">{error}</p>}
            <button type="submit" disabled={isLoading} className="w-full py-2 rounded-lg bg-[#512B32] text-[#FFF2E7] border border-[#D5B47A]/40 hover:bg-[#D5B47A] hover:text-[#342025] transition flex items-center justify-center gap-2 disabled:opacity-50">
              {isLoading ? "Signing in..." : "Sign In"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
          {forgotPasswordHref && (
            <p className="mt-4 text-center text-sm">
              <a href={forgotPasswordHref} className="text-[#D5B47A] hover:text-[#FFF2E7]">Forgot password?</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
