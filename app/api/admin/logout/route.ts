import { clearAdminSessionCookie } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const secure = new URL(request.url).protocol === "https:";
  return new Response(null, { status: 303, headers: { Location: "/admin/login", "Set-Cookie": clearAdminSessionCookie(secure), "Cache-Control": "no-store" } });
}
