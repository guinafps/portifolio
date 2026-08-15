"use client";

import { useState } from "react";
import { ArrowUpRight, LoaderCircle, LockKeyhole, UserRound } from "lucide-react";

export function AdminLoginForm({ configured, returnTo }: { configured: boolean; returnTo: string }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password, returnTo }),
      });
      const data = (await response.json()) as { error?: string; redirectTo?: string };
      if (!response.ok) throw new Error(data.error || "Não foi possível entrar.");
      window.location.assign(data.redirectTo || "/admin/dashboard");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível entrar.");
      setLoading(false);
    }
  }

  return (
    <form className="admin-login-form" onSubmit={submit}>
      <label htmlFor="admin-username"><span>Usuário</span><div><UserRound size={17} /><input id="admin-username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required /></div></label>
      <label htmlFor="admin-password"><span>Senha</span><div><LockKeyhole size={17} /><input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></div></label>
      {error && <p className="login-error" role="alert">{error}</p>}
      {!configured && <p className="login-error" role="alert">As credenciais administrativas ainda não foram configuradas.</p>}
      <button className="login-button" type="submit" disabled={loading || !configured}>{loading ? <LoaderCircle className="spin" /> : <>Entrar no painel <ArrowUpRight /></>}</button>
    </form>
  );
}
