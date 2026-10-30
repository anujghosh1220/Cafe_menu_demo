import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const { email, password, name } = await req.json();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceKey || !url) return NextResponse.json({ error: "Missing service config" }, { status: 500 });
  const supabase = createClient(url, serviceKey);
  const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
  let userId = data?.user?.id;
  if (error) {
    const { data: list } = await supabase.auth.admin.listUsers();
    const existing = list?.users?.find((u: any) => u.email === email);
    if (existing) {
      userId = existing.id;
      const { error: updErr } = await supabase.auth.admin.updateUserById(existing.id, { password });
      if (updErr) return NextResponse.json({ error: updErr.message }, { status: 400 });
    } else {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
  if (userId) {
    await supabase.from("chef_accounts").upsert({ user_id: userId, name, email, active: true }, { onConflict: "email" });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { email } = await req.json();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceKey || !url) return NextResponse.json({ error: "Missing service config" }, { status: 500 });
  const supabase = createClient(url, serviceKey);
  const { data: list } = await supabase.auth.admin.listUsers();
  const existing = list?.users?.find((u: any) => u.email === email);
  if (existing) {
    await supabase.auth.admin.deleteUser(existing.id);
  }
  await supabase.from("chef_accounts").update({ active: false }).eq("email", email);
  return NextResponse.json({ ok: true });
}
