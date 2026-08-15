import { eq } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { getDb } from "@/db";
import { adminLoginAttempts } from "@/db/schema";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;
const encoder = new TextEncoder();
let initialization: Promise<void> | null = null;

async function ensureLoginAttemptsTable() {
  if (!initialization) {
    const runtime = env as unknown as { DB?: { prepare(sql: string): { run(): Promise<unknown> } } };
    if (!runtime.DB) throw new Error("D1 unavailable");
    initialization = runtime.DB.prepare(`CREATE TABLE IF NOT EXISTS admin_login_attempts (
      key TEXT PRIMARY KEY NOT NULL,
      failures INTEGER DEFAULT 0 NOT NULL,
      blocked_until INTEGER DEFAULT 0 NOT NULL,
      updated_at INTEGER DEFAULT 0 NOT NULL
    )`).run().then(() => undefined).catch((error) => { initialization = null; throw error; });
  }
  await initialization;
}

function base64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export async function loginFingerprint(request: Request) {
  const forwarded = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(forwarded));
  return base64Url(new Uint8Array(digest));
}

export async function checkLoginAllowed(key: string) {
  try {
    await ensureLoginAttemptsTable();
    const [attempt] = await getDb().select().from(adminLoginAttempts).where(eq(adminLoginAttempts.key, key)).limit(1);
    const now = Date.now();
    if (!attempt || attempt.blockedUntil <= now) return { allowed: true, retryAfter: 0 };
    return { allowed: false, retryAfter: Math.ceil((attempt.blockedUntil - now) / 1000) };
  } catch {
    return { allowed: true, retryAfter: 0 };
  }
}

export async function recordLoginFailure(key: string) {
  try {
    await ensureLoginAttemptsTable();
    const db = getDb();
    const [current] = await db.select().from(adminLoginAttempts).where(eq(adminLoginAttempts.key, key)).limit(1);
    const now = Date.now();
    const failures = !current || current.updatedAt < now - WINDOW_MS ? 1 : current.failures + 1;
    const blockedUntil = failures >= MAX_FAILURES ? now + WINDOW_MS : 0;
    await db.insert(adminLoginAttempts).values({ key, failures, blockedUntil, updatedAt: now }).onConflictDoUpdate({
      target: adminLoginAttempts.key,
      set: { failures, blockedUntil, updatedAt: now },
    });
  } catch {
    // Local preview can run before its D1 migrations are applied.
  }
}

export async function clearLoginFailures(key: string) {
  try {
    await ensureLoginAttemptsTable();
    await getDb().delete(adminLoginAttempts).where(eq(adminLoginAttempts.key, key));
  } catch {
    // Authentication still works locally when D1 is unavailable.
  }
}
