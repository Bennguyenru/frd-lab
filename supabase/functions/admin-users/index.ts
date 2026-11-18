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

// Readable temporary password, e.g. "Lab-7k2m-9qxp"
function tempPassword() {
  const abc = "abcdefghjkmnpqrstuvwxyz23456789";
  const pick = (n: number) => Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) => abc[b % abc.length]).join("");
  return "Lab-" + pick(4) + "-" + pick(4);
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
    const { data: me } = await admin.from("profiles").select("role").eq("id", who.user.id).single();
    if (me?.role !== "admin") return json({ error: "Only lab admins can manage accounts." }, 403);

    const body = await req.json().catch(() => ({}));
    const action = String(body.action ?? "");
    const role = body.role === "admin" ? "admin" : "member";
    const fullName = String(body.full_name ?? "").trim().slice(0, 120);
    const studentId = String(body.student_id ?? "").trim().toUpperCase().slice(0, 40);
    const className = String(body.class_name ?? "").trim().toUpperCase().slice(0, 40);
    const phone = String(body.phone ?? "").replace(/[^\d+]/g, "").slice(0, 20);

    if (action === "create" || action === "invite") {
      const email = String(body.email ?? "").trim().toLowerCase();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "Enter a valid email address." }, 400);
      let userId: string, password: string | null = null;
      if (action === "invite") {
        const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
          data: { full_name: fullName },
          redirectTo: typeof body.redirectTo === "string" ? body.redirectTo : undefined,
        });
        if (error) return json({ error: error.message }, 400);
        userId = data.user.id;
      } else {
        password = tempPassword();
        const { data, error } = await admin.auth.admin.createUser({
          email, password, email_confirm: true, user_metadata: { full_name: fullName },
        });
        if (error) return json({ error: error.message }, 400);
        userId = data.user.id;
      }
      const { error: pErr } = await admin.from("profiles").upsert({
        id: userId, email, full_name: fullName, role, must_change_password: action === "create",
        student_id: studentId, class_name: className,
      });
      if (pErr) return json({ error: pErr.message }, 400);
      if (phone) await admin.from("contacts").upsert({ user_id: userId, phone });
      return json({ ok: true, id: userId, email, password });
    }

    if (action === "reset_password") {
      const id = String(body.user_id ?? "");
      const password = tempPassword();
      const { error } = await admin.auth.admin.updateUserById(id, { password });
      if (error) return json({ error: error.message }, 400);
      await admin.from("profiles").update({ must_change_password: true }).eq("id", id);
      return json({ ok: true, password });
    }

    return json({ error: "Unknown action." }, 400);
  } catch (e) {
    return json({ error: String((e as Error)?.message ?? e) }, 500);
  }
});
