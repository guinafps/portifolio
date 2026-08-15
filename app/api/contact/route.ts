import { env } from "cloudflare:workers";
import { and, eq, gte, sql } from "drizzle-orm";
import { getReadyDb } from "@/db";
import { contactMessages } from "@/db/schema";
import { cleanText, contactSchema } from "@/lib/validation";

type RuntimeEnv = {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
};

function sqliteDate(date: Date) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

async function sendNotification(data: { name: string; email: string; subject: string; message: string }) {
  const runtime = env as unknown as RuntimeEnv;
  if (!runtime.RESEND_API_KEY || !runtime.CONTACT_TO_EMAIL) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${runtime.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: "Portfolio <onboarding@resend.dev>",
      to: [runtime.CONTACT_TO_EMAIL],
      reply_to: data.email,
      subject: `Novo contato: ${data.subject}`,
      text: `${data.name} (${data.email})\n\n${data.message}`,
    }),
  });
}

export async function POST(request: Request) {
  try {
    const raw = await request.json();
    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues[0]?.message || "Revise os campos." }, { status: 400 });
    }

    const data = Object.fromEntries(
      Object.entries(parsed.data).map(([key, value]) => [key, cleanText(value)]),
    ) as typeof parsed.data;

    const db = await getReadyDb();
    const cutoff = sqliteDate(new Date(Date.now() - 10 * 60 * 1000));
    const [recent] = await db
      .select({ count: sql<number>`count(*)` })
      .from(contactMessages)
      .where(and(eq(contactMessages.email, data.email), gte(contactMessages.createdAt, cutoff)));

    if (Number(recent.count) >= 3) {
      return Response.json({ error: "Você enviou algumas mensagens em sequência. Aguarde dez minutos." }, { status: 429 });
    }

    await db.insert(contactMessages).values(data);
    try {
      await sendNotification(data);
    } catch (error) {
      console.error("[contact] A mensagem foi salva, mas a notificação por e-mail falhou.", error);
    }

    return Response.json({ message: "Mensagem recebida. Em breve conversamos." }, { status: 201 });
  } catch (error) {
    console.error("[contact] Falha ao receber mensagem.", error);
    return Response.json({ error: "O envio está temporariamente indisponível. Tente novamente em instantes." }, { status: 500 });
  }
}
