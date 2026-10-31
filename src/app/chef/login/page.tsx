"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import LoginCard from "@/components/ui/login-card";

export default function ChefLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (email: string, password: string) => {
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
    <LoginCard
      variant="chef"
      title="Chef Login"
      description="Sign in to manage kitchen orders"
      onSubmit={submit}
      isLoading={loading}
      error={error}
    />
  );
}
