import { z } from "zod";
import { adminSessionCookie, createAdminSession, isAdminConfigured, safeAdminReturnTo, verifyAdminCredentials } from "@/lib/admin-auth";
import { checkLoginAllowed, clearLoginFailures, loginFingerprint, recordLoginFailure } from "@/lib/login-security";

const loginSchema = z.object({
  username: z.string().trim().min(1).max(80),
  password: z.string().min(1).max(200),
  returnTo: z.string().optional(),
});

export async function POST(request: Request) {
  if (!isAdminConfigured()) return Response.json({ error: "O acesso administrativo ainda não foi configurado." }, { status: 503 });
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Preencha usuário e senha." }, { status: 400 });

  const fingerprint = await loginFingerprint(request);
  const guard = await checkLoginAllowed(fingerprint);
  if (!guard.allowed) return Response.json({ error: "Muitas tentativas. Aguarde alguns minutos." }, { status: 429, headers: { "Retry-After": String(guard.retryAfter) } });

  const valid = await verifyAdminCredentials(parsed.data.username, parsed.data.password);
  if (!valid) {
    await recordLoginFailure(fingerprint);
    await new Promise((resolve) => setTimeout(resolve, 650));
    return Response.json({ error: "Usuário ou senha incorretos." }, { status: 401 });
  }

  await clearLoginFailures(fingerprint);
  const session = await createAdminSession(parsed.data.username.trim());
  const secure = new URL(request.url).protocol === "https:";
  const redirectTo = safeAdminReturnTo(parsed.data.returnTo);
  return Response.json({ ok: true, redirectTo }, { headers: { "Set-Cookie": adminSessionCookie(session, secure), "Cache-Control": "no-store" } });
}
