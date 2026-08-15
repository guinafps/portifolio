import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("ships a portfolio-specific homepage", async () => {
  const [home, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(home, /HomeExperience/);
  assert.match(layout, /Joao Pedro dos Santos — Programador Freelancer/);
  assert.doesNotMatch(layout, /\/og-studio\.png/);
  assert.doesNotMatch(home + layout, /codex-preview|SkeletonPreview|react-loading-skeleton/);
});

test("detail routes own their social metadata", async () => {
  const detail = await readFile(new URL("../app/projects/[slug]/page.tsx", import.meta.url), "utf8");
  assert.match(detail, /generateMetadata/);
  assert.match(detail, /— Projeto/);
  assert.match(detail, /images:\s*image\s*\?\s*\[/);
  assert.doesNotMatch(detail, /\/og\.png/);
});

test("ships Joao's real portfolio content and admin identity", async () => {
  const [portfolio, admin, settings] = await Promise.all([
    readFile(new URL("../lib/portfolio.ts", import.meta.url), "utf8"),
    readFile(new URL("../components/admin/admin-shell.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/admin/settings-form.tsx", import.meta.url), "utf8"),
  ]);
  for (const project of ["Sistema de Reembolsos", "TrantaPromos", "Portal JP", "Gerador Spotify"]) {
    assert.match(portfolio, new RegExp(project));
  }
  assert.match(portfolio, /\/joao-pedro\.png/);
  assert.match(admin, /admin-brand-logo/);
  assert.doesNotMatch(admin, /AM<span>/);
  assert.match(settings, /Trocar foto/);
});

test("protects the admin with a signed username and password session", async () => {
  const [auth, loginPage, loginRoute, adminShell] = await Promise.all([
    readFile(new URL("../lib/admin-auth.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/admin/login/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/admin/login/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../components/admin/admin-shell.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(auth, /PBKDF2/);
  assert.match(auth, /ADMIN_PASSWORD_HASH/);
  assert.match(auth, /HttpOnly; SameSite=Strict/);
  assert.match(loginRoute, /checkLoginAllowed/);
  assert.match(loginPage, /AdminLoginForm/);
  assert.doesNotMatch(loginPage, /signin-with-chatgpt/);
  assert.match(adminShell, /\/api\/admin\/logout/);
  assert.doesNotMatch(auth + loginPage + loginRoute + adminShell, /const\s+password\s*=\s*["'][^"']+["']/i);
});

test("uses JP's own studio direction without an availability badge", async () => {
  const [home, contact, shell] = await Promise.all([
    readFile(new URL("../components/public/home-experience.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/contact/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/public/site-shell.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(home, /noir-portrait/);
  assert.match(home, /studio-project-grid/);
  assert.doesNotMatch(home, /DISPONÍVEL PARA PROJETOS/i);
  assert.doesNotMatch(home, /jp-orb|jp-available/);
  assert.doesNotMatch(home + contact + shell, /mailto:|settings\.email/);
  assert.match(shell, /footer-contact-cta/);
});

test("offers theme, three languages, visual capabilities and an animated cursor", async () => {
  const [preferences, shell, home] = await Promise.all([
    readFile(new URL("../components/public/preferences.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/public/site-shell.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/public/home-experience.tsx", import.meta.url), "utf8"),
  ]);
  for (const locale of ['"pt"', '"en"', '"es"']) assert.match(preferences, new RegExp(locale));
  assert.match(preferences, /jp-theme/);
  assert.match(shell, /cursor-canvas/);
  assert.match(shell, /cursor-ring/);
  assert.match(shell, /theme-cinematic/);
  assert.match(shell, /theme-toggle/);
  assert.match(shell, /language-menu/);
  assert.match(home, /FiveM-Logo\.png/);
  assert.match(home, /discord-media/);
});

test("lets the admin upload screenshots and explicitly enable an external project link", async () => {
  const [form, schema, migration, settings] = await Promise.all([
    readFile(new URL("../components/admin/project-form.tsx", import.meta.url), "utf8"),
    readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
    readFile(new URL("../drizzle/0004_project_links_gallery_and_whatsapp.sql", import.meta.url), "utf8"),
    readFile(new URL("../lib/portfolio.ts", import.meta.url), "utf8"),
  ]);
  assert.match(form, /multiple/);
  assert.match(form, /showProjectLink/);
  assert.match(schema, /show_project_link/);
  assert.match(migration, /show_project_link/);
  assert.match(settings, /wa\.me\/5567992227140/);
});

test("initializes contact message storage before accepting a form submission", async () => {
  const [contactRoute, database] = await Promise.all([
    readFile(new URL("../app/api/contact/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../db/index.ts", import.meta.url), "utf8"),
  ]);
  assert.match(contactRoute, /await getReadyDb\(\)/);
  assert.match(database, /CREATE TABLE IF NOT EXISTS contact_messages/);
  assert.match(database, /idx_contact_messages_email_created/);
  assert.match(database, /CREATE TABLE IF NOT EXISTS projects/);
});
