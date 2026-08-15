import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull(),
  coverImage: text("cover_image"),
  gallery: text("gallery").notNull().default("[]"),
  technologies: text("technologies").notNull().default("[]"),
  category: text("category").notNull(),
  projectDate: text("project_date").notNull(),
  projectUrl: text("project_url"),
  githubUrl: text("github_url"),
  showProjectLink: integer("show_project_link", { mode: "boolean" }).notNull().default(false),
  challenge: text("challenge").notNull().default(""),
  solution: text("solution").notNull().default(""),
  result: text("result").notNull().default(""),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("idx_projects_slug").on(table.slug), index("idx_projects_published_featured").on(table.published, table.featured)]);

export const projectImages = sqliteTable("project_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  url: text("url").notNull(), alt: text("alt").notNull().default(""), position: integer("position").notNull().default(0),
}, (table) => [index("idx_project_images_project").on(table.projectId)]);

export const contactMessages = sqliteTable("contact_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }), name: text("name").notNull(), email: text("email").notNull(),
  subject: text("subject").notNull(), message: text("message").notNull(),
  status: text("status", { enum: ["new", "read", "replied"] }).notNull().default("new"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_contact_messages_status_created").on(table.status, table.createdAt), index("idx_contact_messages_email_created").on(table.email, table.createdAt)]);

export const experiences = sqliteTable("experiences", {
  id: integer("id").primaryKey({ autoIncrement: true }), period: text("period").notNull(), role: text("role").notNull(),
  company: text("company").notNull(), description: text("description").notNull(), position: integer("position").notNull().default(0),
});

export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey().default(1), name: text("name").notNull().default("Seu Nome"),
  headline: text("headline").notNull().default("Programador Freelancer"), bio: text("bio").notNull().default(""),
  email: text("email").notNull().default("ola@seudominio.com"), avatar: text("avatar").notNull().default(""), github: text("github").notNull().default(""),
  linkedin: text("linkedin").notNull().default(""), instagram: text("instagram").notNull().default(""),
  whatsapp: text("whatsapp").notNull().default(""), updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const adminLoginAttempts = sqliteTable("admin_login_attempts", {
  key: text("key").primaryKey(),
  failures: integer("failures").notNull().default(0),
  blockedUntil: integer("blocked_until").notNull().default(0),
  updatedAt: integer("updated_at").notNull().default(0),
});
