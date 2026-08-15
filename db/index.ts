import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import { defaultSettings, demoProjects } from "@/lib/portfolio";
import * as schema from "./schema";

let initialization: Promise<void> | null = null;

export function getDb() {
  if (!env.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or let your control plane inject the real binding values before using the database."
    );
  }

  return drizzle(env.DB, { schema });
}

async function existingColumns(database: D1Database, table: "projects" | "site_settings") {
  const result = await database.prepare(`PRAGMA table_info(${table})`).all<{ name: string }>();
  return new Set((result.results ?? []).map((column) => column.name));
}

export async function ensureDatabase() {
  if (!initialization) {
    initialization = (async () => {
      const database = env.DB;
      if (!database) throw new Error("D1 unavailable");

      await database.batch([
        database.prepare(`CREATE TABLE IF NOT EXISTS projects (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          title TEXT NOT NULL,
          slug TEXT NOT NULL,
          short_description TEXT NOT NULL,
          description TEXT NOT NULL,
          cover_image TEXT,
          gallery TEXT DEFAULT '[]' NOT NULL,
          technologies TEXT DEFAULT '[]' NOT NULL,
          category TEXT NOT NULL,
          project_date TEXT NOT NULL,
          project_url TEXT,
          github_url TEXT,
          show_project_link INTEGER DEFAULT false NOT NULL,
          challenge TEXT DEFAULT '' NOT NULL,
          solution TEXT DEFAULT '' NOT NULL,
          result TEXT DEFAULT '' NOT NULL,
          featured INTEGER DEFAULT false NOT NULL,
          published INTEGER DEFAULT false NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
        )`),
        database.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug)"),
        database.prepare("CREATE INDEX IF NOT EXISTS idx_projects_published_featured ON projects(published, featured)"),
        database.prepare(`CREATE TABLE IF NOT EXISTS project_images (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          project_id INTEGER NOT NULL,
          url TEXT NOT NULL,
          alt TEXT DEFAULT '' NOT NULL,
          position INTEGER DEFAULT 0 NOT NULL,
          FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
        )`),
        database.prepare("CREATE INDEX IF NOT EXISTS idx_project_images_project ON project_images(project_id)"),
        database.prepare(`CREATE TABLE IF NOT EXISTS contact_messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          subject TEXT NOT NULL,
          message TEXT NOT NULL,
          status TEXT DEFAULT 'new' NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
        )`),
        database.prepare("CREATE INDEX IF NOT EXISTS idx_contact_messages_status_created ON contact_messages(status, created_at)"),
        database.prepare("CREATE INDEX IF NOT EXISTS idx_contact_messages_email_created ON contact_messages(email, created_at)"),
        database.prepare(`CREATE TABLE IF NOT EXISTS experiences (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          period TEXT NOT NULL,
          role TEXT NOT NULL,
          company TEXT NOT NULL,
          description TEXT NOT NULL,
          position INTEGER DEFAULT 0 NOT NULL
        )`),
        database.prepare(`CREATE TABLE IF NOT EXISTS site_settings (
          id INTEGER PRIMARY KEY DEFAULT 1 NOT NULL,
          name TEXT DEFAULT 'Seu Nome' NOT NULL,
          headline TEXT DEFAULT 'Programador Freelancer' NOT NULL,
          bio TEXT DEFAULT '' NOT NULL,
          email TEXT DEFAULT 'ola@seudominio.com' NOT NULL,
          avatar TEXT DEFAULT '' NOT NULL,
          github TEXT DEFAULT '' NOT NULL,
          linkedin TEXT DEFAULT '' NOT NULL,
          instagram TEXT DEFAULT '' NOT NULL,
          whatsapp TEXT DEFAULT '' NOT NULL,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
        )`),
        database.prepare(`CREATE TABLE IF NOT EXISTS admin_login_attempts (
          key TEXT PRIMARY KEY NOT NULL,
          failures INTEGER DEFAULT 0 NOT NULL,
          blocked_until INTEGER DEFAULT 0 NOT NULL,
          updated_at INTEGER DEFAULT 0 NOT NULL
        )`),
      ]);

      const [projectColumns, settingsColumns] = await Promise.all([
        existingColumns(database, "projects"),
        existingColumns(database, "site_settings"),
      ]);
      if (!projectColumns.has("show_project_link")) {
        await database.prepare("ALTER TABLE projects ADD show_project_link INTEGER DEFAULT false NOT NULL").run();
      }
      if (!settingsColumns.has("avatar")) {
        await database.prepare("ALTER TABLE site_settings ADD avatar TEXT DEFAULT '' NOT NULL").run();
      }
      if (!settingsColumns.has("whatsapp")) {
        await database.prepare("ALTER TABLE site_settings ADD whatsapp TEXT DEFAULT '' NOT NULL").run();
      }

      const db = getDb();
      await db.insert(schema.siteSettings).values({ id: 1, ...defaultSettings }).onConflictDoNothing({ target: schema.siteSettings.id });
      for (const project of demoProjects) {
        await db.insert(schema.projects).values({
          ...project,
          gallery: JSON.stringify(project.gallery),
          technologies: JSON.stringify(project.technologies),
        }).onConflictDoNothing({ target: schema.projects.slug });
      }
    })().catch((error) => {
      initialization = null;
      throw error;
    });
  }

  await initialization;
}

export async function getReadyDb() {
  await ensureDatabase();
  return getDb();
}
