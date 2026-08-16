import { get, put } from "@vercel/blob";
import { env } from "cloudflare:workers";
import {
  defaultSettings,
  demoProjects,
  type ContactMessage,
  type Project,
  type SiteSettings,
} from "./portfolio";

const STATE_PATH = "jpdev/data/portfolio-state.json";

export type PortfolioState = {
  projects: Project[];
  settings: SiteSettings;
  messages: ContactMessage[];
  nextProjectId: number;
  nextMessageId: number;
};

let mutationQueue: Promise<unknown> = Promise.resolve();

export function blobStoreToken() {
  const runtime = env as unknown as { BLOB_READ_WRITE_TOKEN?: string };
  return (typeof process !== "undefined" ? process.env.BLOB_READ_WRITE_TOKEN?.trim() : "")
    || runtime.BLOB_READ_WRITE_TOKEN?.trim()
    || "";
}

function cloneProjects() {
  return demoProjects.map((project) => ({
    ...project,
    gallery: [...project.gallery],
    technologies: [...project.technologies],
  }));
}

function defaultState(): PortfolioState {
  const projects = cloneProjects();
  return {
    projects,
    settings: { ...defaultSettings },
    messages: [],
    nextProjectId: Math.max(0, ...projects.map((project) => project.id)) + 1,
    nextMessageId: 1,
  };
}

function normalizeState(value: unknown): PortfolioState {
  const fallback = defaultState();
  if (!value || typeof value !== "object") return fallback;
  const candidate = value as Partial<PortfolioState>;
  const projects = Array.isArray(candidate.projects) ? candidate.projects : fallback.projects;
  const messages = Array.isArray(candidate.messages) ? candidate.messages : [];
  const settings = candidate.settings && typeof candidate.settings === "object"
    ? { ...defaultSettings, ...candidate.settings }
    : fallback.settings;
  return {
    projects,
    messages,
    settings,
    nextProjectId: Math.max(
      Number(candidate.nextProjectId) || 0,
      Math.max(0, ...projects.map((project) => Number(project.id) || 0)) + 1,
    ),
    nextMessageId: Math.max(
      Number(candidate.nextMessageId) || 0,
      Math.max(0, ...messages.map((message) => Number(message.id) || 0)) + 1,
    ),
  };
}

export function isBlobStoreConfigured() {
  return Boolean(blobStoreToken());
}

export async function readPortfolioState(): Promise<PortfolioState> {
  const result = await get(STATE_PATH, { access: "private", useCache: false, token: blobStoreToken() });
  if (!result || result.statusCode !== 200 || !result.stream) return defaultState();
  const raw = await new Response(result.stream).json();
  return normalizeState(raw);
}

async function writePortfolioState(state: PortfolioState) {
  await put(STATE_PATH, JSON.stringify(state), {
    access: "private",
    allowOverwrite: true,
    contentType: "application/json; charset=utf-8",
    token: blobStoreToken(),
  });
}

export function mutatePortfolioState<T>(mutation: (state: PortfolioState) => T | Promise<T>): Promise<T> {
  const operation = mutationQueue.then(async () => {
    const state = await readPortfolioState();
    const result = await mutation(state);
    await writePortfolioState(state);
    return result;
  });
  mutationQueue = operation.then(() => undefined, () => undefined);
  return operation;
}
