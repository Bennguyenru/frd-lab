// FRD Lab Hub: account management for lab admins.
// Deploy in Supabase: Edge Functions > Deploy a new function > Via editor > name it "admin-users" > paste this file.
// Only signed-in admins can call it. The service key never leaves Supabase.
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

// Readable temporary password, e.g. "Lab-7k2m-9qxp-4hwe" (about 59 bits, no modulo bias).
// It stops working for lab data after 72 hours if it is not replaced (see temp_passwords in schema.sql).
function tempPassword() {
  const abc = "abcdefghjkmnpqrstuvwxyz23456789";
  const one = () => { const b = new Uint8Array(1); do { crypto.getRandomValues(b); } while (b[0] >= 248); return abc[b[0] % abc.length]; };
  const pick = (n: number) => Array.from({ length: n }, one).join("");
  return "Lab-" + pick(4) + "-" + pick(4) + "-" + pick(4);
}

// Works with both the legacy service_role key and the newer secret keys.
function serviceKey(): string | undefined {
  const one = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SECRET_KEY");
  if (one) return one;
  const many = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (!many) return undefined;
  try {
    const o = JSON.parse(many);
    return typeof o === "string" ? o : (o.default ?? Object.values(o)[0]) as string;
  } catch {
    return many.split(",")[0].trim();
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Use POST" }, 405);
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const secret = serviceKey();
    if (!secret) return json({ error: "The function has no service key in its environment." }, 500);
    const admin = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });

    // Who is calling?
    const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
    const { data: who, error: whoErr } = await admin.auth.getUser(jwt);
    if (whoErr || !who?.user) return json({ error: "Please sign in again." }, 401);
    const { data: me } = await admin.from("profiles").select("role, must_change_password").eq("id", who.user.id).single();
    if (me?.role !== "admin" || me?.must_change_password) return json({ error: "Only lab admins can manage accounts." }, 403);
    const audit = (action: string, target: string | null, detail = "") =>
      admin.from("admin_audit").insert({ actor: who.user.id, action, target, detail });

    const body = await req.json().catch(() => ({}));
    const action = String(body.action ?? "");
    const role = body.role === "admin" ? "admin" : "member";
    const fullName = String(body.full_name ?? "").trim().slice(0, 120);
    const studentId = String(body.student_id ?? "").trim().toUpperCase().slice(0, 40);
    const className = String(body.class_name ?? "").trim().toUpperCase().slice(0, 40);
    const phone = String(body.phone ?? "").replace(/[^\d+]/g, "").slice(0, 20);

    // Accounts are created with a temporary password only (no emails are sent).
    if (action === "create") {
      const email = String(body.email ?? "").trim().toLowerCase();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "Enter a valid email address." }, 400);
      const password = tempPassword();
      const { data, error } = await admin.auth.admin.createUser({
        email, password, email_confirm: true, user_metadata: { full_name: fullName },
      });
      if (error) return json({ error: error.message }, 400);
      const userId = data.user.id;
      const { error: pErr } = await admin.from("profiles").upsert({
        id: userId, email, full_name: fullName, role, must_change_password: true,
        student_id: studentId, class_name: className,
      });
      if (pErr) return json({ error: pErr.message }, 400);
      if (phone) await admin.from("contacts").upsert({ user_id: userId, phone });
      await audit("create_account", userId, `${email} as ${role}`);
      return json({ ok: true, id: userId, email, password });
    }

    if (action === "reset_password") {
      const id = String(body.user_id ?? "");
      if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ error: "Unknown account." }, 400);
      const { data: target } = await admin.from("profiles").select("role, email").eq("id", id).single();
      if (!target) return json({ error: "Unknown account." }, 400);
      const password = tempPassword();
      // email_confirm: people first invited by email who never clicked the link could not sign in.
      const { error } = await admin.auth.admin.updateUserById(id, { password, email_confirm: true });
      if (error) return json({ error: error.message }, 400);
      await admin.from("profiles").update({ must_change_password: true }).eq("id", id);
      await audit("reset_password", id, target.role === "admin" ? `${target.email} (admin account)` : target.email);
      return json({ ok: true, password });
    }

    return json({ error: "Unknown action." }, 400);
  } catch (e) {
    return json({ error: String((e as Error)?.message ?? e) }, 500);
  }
});
