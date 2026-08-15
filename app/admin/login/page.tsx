import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { AdminLoginForm } from "@/components/admin/login-form";
import { getAdminUser, isAdminConfigured, safeAdminReturnTo } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Acesso administrativo", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
  const [params, admin] = await Promise.all([searchParams, getAdminUser()]);
  if (admin) redirect("/admin/dashboard");
  const returnTo = safeAdminReturnTo(params.returnTo);

  return (
    <main className="admin-login">
      <div className="login-visual">
        <div className="login-grid" />
        <div className="login-brand-lockup">
          <span className="admin-brand-logo" aria-hidden="true" />
          <p>JP / CODELAB</p>
        </div>
        <h1>Seu trabalho<br />continua <em>aqui.</em></h1>
        <span>Painel privado para projetos, mensagens, foto e presença digital.</span>
      </div>
      <section className="login-panel">
        <div className="login-card">
          <span className="login-icon"><ShieldCheck /></span>
          <p>PAINEL ADMINISTRATIVO</p>
          <h2>Bem-vindo, João.</h2>
          <span>Use seu usuário e sua senha para acessar o painel.</span>
          <AdminLoginForm configured={isAdminConfigured()} returnTo={returnTo} />
          <div className="login-note"><ShieldCheck size={15} />A sessão é assinada, expira automaticamente e a senha não é enviada para o navegador.</div>
          <Link className="back-site" href="/"><ArrowLeft size={15} />Voltar ao portfólio</Link>
        </div>
      </section>
    </main>
  );
}
