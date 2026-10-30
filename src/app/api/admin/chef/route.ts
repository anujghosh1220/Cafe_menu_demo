import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceKey || !url) return NextResponse.json({ error: "Missing service config" }, { status: 500 });
  const supabase = createClient(url, serviceKey);
  // upsert user
  const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) {
    // If user exists, update password by listing
    const { data: list } = await supabase.auth.admin.listUsers();
    const existing = list?.users?.find((u: any) => u.email === email);
    if (existing) {
      const { error: updErr } = await supabase.auth.admin.updateUserById(existing.id, { password });
      if (updErr) return NextResponse.json({ error: updErr.message }, { status: 400 });
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
