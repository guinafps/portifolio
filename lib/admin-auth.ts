import { env } from "cloudflare:workers";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "jp_admin_session";
const SESSION_SECONDS = 60 * 60 * 12;
const PBKDF2_ITERATIONS = 210_000;
const encoder = new TextEncoder();

type RuntimeEnv = {
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD_HASH?: string;
  ADMIN_SESSION_SECRET?: string;
};

export type AdminUser = {
  userId: string;
  displayName: string;
  email: string;
  fullName: string | null;
};

function config() {
  const runtime = env as unknown as RuntimeEnv;
  return {
    username: runtime.ADMIN_USERNAME?.trim() || "",
    passwordHash: runtime.ADMIN_PASSWORD_HASH?.trim() || "",
    sessionSecret: runtime.ADMIN_SESSION_SECRET?.trim() || "",
  };
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array) {
  const length = Math.max(left.length, right.length);
  let difference = left.length ^ right.length;
  for (let index = 0; index < length; index += 1) difference |= (left[index] ?? 0) ^ (right[index] ?? 0);
  return difference === 0;
}

async function derivePassword(password: string, salt: Uint8Array) {
  const material = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: PBKDF2_ITERATIONS },
    material,
    256,
  );
  return new Uint8Array(bits);
}

async function hmacKey(secret: string) {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export function isAdminConfigured() {
  const current = config();
  return Boolean(current.username && current.passwordHash && current.sessionSecret.length >= 32);
}

export async function verifyAdminCredentials(username: string, password: string) {
  const current = config();
  const [saltPart, expectedPart] = current.passwordHash.split(".");
  if (!isAdminConfigured() || !saltPart || !expectedPart) return false;
  try {
    const usernameMatches = constantTimeEqual(encoder.encode(username.trim()), encoder.encode(current.username));
    const actualPassword = await derivePassword(password, base64UrlToBytes(saltPart));
    const passwordMatches = constantTimeEqual(actualPassword, base64UrlToBytes(expectedPart));
    return usernameMatches && passwordMatches;
  } catch {
    return false;
  }
}

export async function createAdminSession(username: string) {
  const current = config();
  const payload = bytesToBase64Url(encoder.encode(JSON.stringify({ sub: username, exp: Date.now() + SESSION_SECONDS * 1000 })));
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", await hmacKey(current.sessionSecret), encoder.encode(payload)));
  return `${payload}.${bytesToBase64Url(signature)}`;
}

async function verifyAdminSession(token: string) {
  const current = config();
  const [payload, signature] = token.split(".");
  if (!isAdminConfigured() || !payload || !signature) return false;
  try {
    const validSignature = await crypto.subtle.verify("HMAC", await hmacKey(current.sessionSecret), base64UrlToBytes(signature), encoder.encode(payload));
    if (!validSignature) return false;
    const parsed = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload))) as { sub?: string; exp?: number };
    return parsed.sub === current.username && typeof parsed.exp === "number" && parsed.exp > Date.now();
  } catch {
    return false;
  }
}

export function adminSessionCookie(token: string, secure: boolean) {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_SECONDS}${secure ? "; Secure" : ""}`;
}

export function clearAdminSessionCookie(secure: boolean) {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure ? "; Secure" : ""}`;
}

export function safeAdminReturnTo(value: unknown) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return "/admin/dashboard";
  try {
    const parsed = new URL(value, "https://portfolio.local");
    if (parsed.origin !== "https://portfolio.local" || !parsed.pathname.startsWith("/admin/") || parsed.pathname === "/admin/login") return "/admin/dashboard";
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return "/admin/dashboard";
  }
}

export async function getAdminUser(): Promise<AdminUser | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token || !(await verifyAdminSession(token))) return null;
  const { username } = config();
  return { userId: `admin:${username}`, displayName: "João Pedro", email: `@${username}`, fullName: "João Pedro dos Santos" };
}

export async function requireAdmin(returnTo: string): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user) redirect(`/admin/login?returnTo=${encodeURIComponent(safeAdminReturnTo(returnTo))}`);
  return user;
}

export async function isAdminRequest() {
  return Boolean(await getAdminUser());
}
