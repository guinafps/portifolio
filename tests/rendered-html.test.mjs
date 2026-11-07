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
  assert.match(home, /jp-portrait/);
  assert.match(home, /jp-projects/);
  assert.doesNotMatch(home, /DISPONÍVEL PARA PROJETOS/i);
  assert.doesNotMatch(home, /jp-available/);
  assert.doesNotMatch(home + contact + shell, /mailto:|settings\.email/);
  assert.match(shell, /footer-contact-cta/);
});

test("offers a fixed theme, three languages, visual capabilities and an animated cursor", async () => {
  const [preferences, shell, home] = await Promise.all([
    readFile(new URL("../components/public/preferences.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/public/site-shell.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/public/home-experience.tsx", import.meta.url), "utf8"),
  ]);
  for (const locale of ['"pt"', '"en"', '"es"']) assert.match(preferences, new RegExp(locale));
  assert.match(preferences, /jp-theme/);
  assert.match(shell, /cursor-canvas/);
  assert.match(shell, /cursor-ring/);
  assert.doesNotMatch(shell, /theme-cinematic|theme-toggle|toggleTheme/);
  assert.match(preferences, /dataset.theme = "dark"/);
  assert.match(shell, /language-menu/);
  assert.match(home, /nova-service-icon/);
  assert.match(home, /Globe2, Layers3, MessageCircle/);
  assert.match(home, /homeCopy\[locale\]/);
});

test("new opening uses the formal portrait, resource readiness and a measured transfer", async () => {
  const [home, intro, scroll, css] = await Promise.all([
    readFile(new URL("../components/public/home-experience.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/public/intro-sequence.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/public/smooth-scroll.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/cinematic.css", import.meta.url), "utf8"),
  ]);
  assert.match(home, /joao-pedro-formal\.png/);
  assert.match(intro, /getBoundingClientRect/);
  assert.match(intro, /img.decode\(\)/);
  assert.match(intro, /document.fonts.ready/);
  assert.match(intro, /prefers-reduced-motion/);
  assert.match(intro, /setTimeout\(finish, 7000\)/);
  assert.match(intro, /Escape/);
  assert.match(intro, /await travel.finished/);
  assert.match(intro, /duration: 1.45/);
  assert.doesNotMatch(intro, /if \(reduced \|\||window.scrollY > 50|motion-preview/);
  assert.match(intro, /jp-intro-full-motion/);
  assert.match(intro, /await dissolve.finished/);
  assert.match(intro, /navigation\?\.type === "back_forward"/);
  assert.match(home, /Rever abertura completa/);
  assert.match(scroll, /syncTouch: false/);
  assert.match(scroll, /lenis.destroy\(\)/);
  assert.match(css, /backdrop-filter:blur/);
  assert.doesNotMatch(css, /#6410c9|#ffe000/i);
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

test("refresh keeps screenshots uncropped and uses the accessible shadcn accordion", async () => {
  const [home, accordion, css, copy] = await Promise.all([
    readFile(new URL("../components/public/home-experience.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/ui/accordion.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/reference-layout.css", import.meta.url), "utf8"),
    readFile(new URL("../components/public/home-copy.ts", import.meta.url), "utf8"),
  ]);
  assert.match(home, /<Accordion type="single" collapsible/);
  assert.match(accordion, /@radix-ui\/react-accordion/);
  assert.match(css, /\.jp-project-cover \.project-visual>img[^}]*object-fit:contain/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /max-width:380px/);
  assert.match(css, /--font-manrope/);
  for (const locale of ["pt", "en", "es"]) assert.match(copy, new RegExp(`${locale}: \\{`));
});
