import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { CaseExperience } from "@/components/public/case-experience";
import { SiteShell } from "@/components/public/site-shell";
import { getProjectBySlug, getPublishedProjects, getSettings } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

async function absoluteUrl(path: string) {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") || "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") || "https";
  return path.startsWith("http") ? path : `${protocol}://${host}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Projeto não encontrado" };
  const image = project.coverImage ? await absoluteUrl(project.coverImage) : null;
  const title = `${project.title} — Projeto`;
  const description = project.shortDescription;
  return {
    title,
    description,
    alternates: { canonical: await absoluteUrl(`/projects/${project.slug}`) },
    openGraph: { title, description, type: "article", images: image ? [{ url: image, alt: `Capa do projeto ${project.title}` }] : [] },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : [] },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const [project, allProjects, settings] = await Promise.all([
    getProjectBySlug(slug),
    getPublishedProjects(),
    getSettings(),
  ]);
  if (!project) notFound();
  const index = allProjects.findIndex((item) => item.slug === project.slug);
  const next = allProjects.length > 1 ? allProjects[(index + 1) % allProjects.length] : null;

  return (
    <SiteShell settings={settings} compact>
      <CaseExperience project={project} next={next} />
    </SiteShell>
  );
}
