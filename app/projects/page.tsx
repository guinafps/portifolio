import type { Metadata } from "next";
import Link from "@/components/ui/safe-link";
import { ArrowUpRight } from "lucide-react";
import { AnimatedPageHero } from "@/components/public/animated-page-hero";
import { ProjectsIndex } from "@/components/public/projects-index";
import { I18nText } from "@/components/public/preferences";
import { SectionHeading, SiteShell } from "@/components/public/site-shell";
import { getPublishedProjects, getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projetos — Joao Pedro dos Santos",
  description: "Cases reais de aplicações, bots, portais e automações desenvolvidos por Joao Pedro dos Santos.",
};

export default async function ProjectsPage() {
  const [projects, settings] = await Promise.all([getPublishedProjects(), getSettings()]);

  return (
    <SiteShell settings={settings} compact>
      <main className="inner-page projects-page">
        <AnimatedPageHero
          eyebrow={`GITHUB / ${String(projects.length).padStart(2, "0")} CASES`}
          lines={["projects.hero.line1", "projects.hero.line2", "projects.hero.line3"]}
          accentLine={1}
          description="projects.hero.description"
          index="02"
          translate
        />
        <section className="archive-section">
          <div className="archive-intro"><span><I18nText id="projects.selected" /></span><p>{String(projects.length).padStart(2, "0")} <I18nText id="projects.works" /></p></div>
          <ProjectsIndex projects={projects} />
        </section>
        <section className="next-cta">
          <SectionHeading index="03" kicker={<I18nText id="projects.next" />}><I18nText id="projects.next1" /><br /><em><I18nText id="projects.next2" /></em></SectionHeading>
          <Link href="/contact"><I18nText id="projects.start" /> <ArrowUpRight /></Link>
        </section>
      </main>
    </SiteShell>
  );
}
