import { and, desc, eq, sql } from "drizzle-orm";
import { getReadyDb } from "@/db";
import { contactMessages, projects, siteSettings } from "@/db/schema";
import {
  defaultSettings,
  demoProjects,
  safeJsonArray,
  type ContactMessage,
  type Project,
  type SiteSettings,
} from "./portfolio";
import { isBlobStoreConfigured, readPortfolioState } from "./blob-store";

type ProjectRow = typeof projects.$inferSelect;

function rowToProject(row: ProjectRow): Project {
  return {
    ...row,
    gallery: safeJsonArray(row.gallery),
    technologies: safeJsonArray(row.technologies),
  };
}

export async function getPublishedProjects(): Promise<Project[]> {
  if (isBlobStoreConfigured()) {
    const { projects: storedProjects } = await readPortfolioState();
    return storedProjects
      .filter((project) => project.published)
      .sort((left, right) => Number(right.featured) - Number(left.featured) || right.projectDate.localeCompare(left.projectDate) || right.id - left.id);
  }
  try {
    const db = await getReadyDb();
    const rows = await db
      .select()
      .from(projects)
      .where(eq(projects.published, true))
      .orderBy(desc(projects.featured), desc(projects.projectDate), desc(projects.id));
    return rows.length ? rows.map(rowToProject) : demoProjects;
  } catch {
    return demoProjects;
  }
}

export async function getAllProjects(): Promise<Project[]> {
  if (isBlobStoreConfigured()) {
    const { projects: storedProjects } = await readPortfolioState();
    return storedProjects.sort((left, right) => (right.updatedAt || "").localeCompare(left.updatedAt || "") || right.id - left.id);
  }
  try {
    const rows = await (await getReadyDb()).select().from(projects).orderBy(desc(projects.updatedAt), desc(projects.id));
    return rows.length ? rows.map(rowToProject) : demoProjects;
  } catch {
    return demoProjects;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (isBlobStoreConfigured()) {
    const { projects: storedProjects } = await readPortfolioState();
    return storedProjects.find((project) => project.slug === slug && project.published) ?? null;
  }
  try {
    const [row] = await (await getReadyDb())
      .select()
      .from(projects)
      .where(and(eq(projects.slug, slug), eq(projects.published, true)))
      .limit(1);
    if (row) return rowToProject(row);
  } catch (error) {
    void error;
  }
  return demoProjects.find((project) => project.slug === slug) ?? null;
}

export async function getProjectById(id: number): Promise<Project | null> {
  if (isBlobStoreConfigured()) {
    const { projects: storedProjects } = await readPortfolioState();
    return storedProjects.find((project) => project.id === id) ?? null;
  }
  try {
    const [row] = await (await getReadyDb()).select().from(projects).where(eq(projects.id, id)).limit(1);
    if (row) return rowToProject(row);
  } catch (error) {
    void error;
  }
  return demoProjects.find((project) => project.id === id) ?? null;
}

export async function getSettings(): Promise<SiteSettings> {
  if (isBlobStoreConfigured()) {
    const { settings } = await readPortfolioState();
    return { ...settings, whatsapp: settings.whatsapp || defaultSettings.whatsapp };
  }
  try {
    const [row] = await (await getReadyDb()).select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);
    const settings = row ?? defaultSettings;
    return { ...settings, whatsapp: settings.whatsapp || defaultSettings.whatsapp };
  } catch {
    return defaultSettings;
  }
}

export async function getMessages(): Promise<ContactMessage[]> {
  if (isBlobStoreConfigured()) {
    const { messages } = await readPortfolioState();
    return messages.sort((left, right) => right.createdAt.localeCompare(left.createdAt) || right.id - left.id);
  }
  try {
    return await (await getReadyDb()).select().from(contactMessages).orderBy(desc(contactMessages.createdAt), desc(contactMessages.id));
  } catch {
    return [];
  }
}

export async function getDashboardStats() {
  if (isBlobStoreConfigured()) {
    const { projects: storedProjects, messages } = await readPortfolioState();
    return {
      total: storedProjects.length,
      published: storedProjects.filter((project) => project.published).length,
      drafts: storedProjects.filter((project) => !project.published).length,
      featured: storedProjects.filter((project) => project.featured).length,
      messages: messages.length,
    };
  }
  try {
    const db = await getReadyDb();
    const [[projectStats], [messageStats]] = await Promise.all([
      db.select({
        total: sql<number>`count(*)`,
        published: sql<number>`sum(case when ${projects.published} = 1 then 1 else 0 end)`,
        drafts: sql<number>`sum(case when ${projects.published} = 0 then 1 else 0 end)`,
        featured: sql<number>`sum(case when ${projects.featured} = 1 then 1 else 0 end)`,
      }).from(projects),
      db.select({ messages: sql<number>`count(*)` }).from(contactMessages),
    ]);
    return {
      total: Number(projectStats.total || 0),
      published: Number(projectStats.published || 0),
      drafts: Number(projectStats.drafts || 0),
      featured: Number(projectStats.featured || 0),
      messages: Number(messageStats.messages || 0),
    };
  } catch {
    return {
      total: demoProjects.length,
      published: demoProjects.length,
      drafts: 0,
      featured: demoProjects.filter((project) => project.featured).length,
      messages: 0,
    };
  }
}
