"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, FolderKanban, LayoutDashboard, LogOut, Mail, Settings } from "lucide-react";
import type { AdminUser } from "@/lib/admin-auth";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projetos", icon: FolderKanban },
  { href: "/admin/messages", label: "Mensagens", icon: Mail },
  { href: "/admin/settings", label: "Configurações", icon: Settings },
];

export function AdminShell({
  user,
  title,
  eyebrow,
  action,
  children,
}: {
  user: AdminUser;
  title: string;
  eyebrow: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin/dashboard" aria-label="JP Codelab, painel">
          <span className="admin-brand-logo" aria-hidden="true" />
          <small>JP / CODELAB</small>
        </Link>
        <nav>
          {links.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link className={active ? "active" : ""} href={item.href} key={item.href}>
                <Icon size={17} />{item.label}
              </Link>
            );
          })}
        </nav>
        <div className="admin-side-foot">
          <Link href="/" target="_blank"><ExternalLink size={16} />Ver portfólio</Link>
          <form action="/api/admin/logout" method="post">
            <button type="submit"><LogOut size={16} />Sair</button>
          </form>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-header">
          <div><p>{eyebrow}</p><h1>{title}</h1></div>
          <div className="admin-header-side">
            {action}
            <div className="admin-user">
              <span>{user.displayName.slice(0, 1).toUpperCase()}</span>
              <div><b>{user.displayName}</b><small>{user.email}</small></div>
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
