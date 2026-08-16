import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { PreferencesProvider } from "@/components/public/preferences";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") || "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") || "https";
  const base = new URL(`${protocol}://${host}`);
  const title = "Joao Pedro dos Santos — Programador Freelancer";
  const description = "Programador freelancer desde setembro de 2024, com experiência em Lua para FiveM, mod menus, bots para Discord, sites e aplicações.";
  return {
    metadataBase: base,
    title: { default: title, template: "%s | Joao Pedro dos Santos" },
    description,
    alternates: { canonical: "/" },
    icons: {
      icon: [{ url: "/favicon-jp.png?v=20260816", type: "image/png" }],
      shortcut: "/favicon-jp.png?v=20260816",
      apple: "/favicon-jp.png?v=20260816",
    },
    openGraph: { title, description, type: "website", locale: "pt_BR", url: base, siteName: "Joao Pedro dos Santos" },
    twitter: { card: "summary", title, description },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon-jp.png?v=20260816" type="image/png" />
        <link rel="shortcut icon" href="/favicon-jp.png?v=20260816" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon-jp.png?v=20260816" />
      </head>
      <body className={`${geist.variable} ${mono.variable}`}>
        <PreferencesProvider>{children}</PreferencesProvider>
      </body>
    </html>
  );
}

