"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import LoginCard from "@/components/ui/login-card";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (email: string, password: string) => {
    setError("");
    setLoading(true);
    const supabase = createClient()!;
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    router.push("/admin");
  };

  return (
    <LoginCard
      variant="admin"
      title="Admin Login"
      description="Sign in to manage your café"
      onSubmit={submit}
      isLoading={loading}
      error={error}
      forgotPasswordHref="/admin/forgot-password"
    />
  );
}
