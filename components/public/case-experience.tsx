"use client";

import Link from "@/components/ui/safe-link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import type { Project } from "@/lib/portfolio";
import { ProjectVisual } from "./project-visual";
import { usePreferences } from "./preferences";

const MotionLink = motion.create(Link);
const ease = [0.16, 1, 0.3, 1] as const;

export function CaseExperience({ project, next }: { project: Project; next: Project | null }) {
  const { t } = usePreferences();
  const story = [
    [t("case.goalLabel"), t("case.goal"), project.challenge],
    [t("case.buildLabel"), t("case.build"), project.solution],
    [t("case.resultLabel"), t("case.result"), project.result],
  ];
  const gallery = project.gallery.length ? project.gallery : ["", ""];

  return (
    <main className="case-page">
      <header className="case-hero case-hero-animated">
        <MotionLink href="/projects" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} whileHover={{ x: -5 }}>
          <ArrowLeft size={15} /> {t("case.all")}
        </MotionLink>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>{project.category} / {project.projectDate}</motion.p>
        <h1>
          <motion.span
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.95, delay: 0.12, ease }}
          >
            {project.title}
          </motion.span>
        </h1>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.45, ease }}
        >
          <span>{project.shortDescription}</span>
          <div>{project.technologies.map((tech, index) => <motion.small initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 + index * 0.055 }} key={tech}>{tech}</motion.small>)}</div>
        </motion.div>
        <span className="case-hero-index" aria-hidden="true">{String(project.id).padStart(2, "0")}</span>
        <motion.i className="case-hero-scan" aria-hidden="true" animate={{ x: ["-100%", "360%"] }} transition={{ duration: 6.5, repeat: Infinity, ease: "linear" }} />
      </header>

      <motion.section
        className="case-cover"
        initial={{ opacity: 0, y: 70, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-8%" }}
        transition={{ duration: 0.9, ease }}
      >
        <ProjectVisual project={project} priority />
      </motion.section>

      <motion.section
        className="case-intro"
        initial={{ opacity: 0, y: 55 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.85, ease }}
      >
        <p>{t("case.overview")}</p>
        <h2>{project.description}</h2>
        <div className="case-links">
          {project.showProjectLink && project.projectUrl && <motion.a whileHover={{ x: 5 }} href={project.projectUrl} target="_blank" rel="noreferrer">{t("case.open")} <ArrowUpRight /></motion.a>}
          {project.githubUrl && <motion.a whileHover={{ x: 5 }} href={project.githubUrl} target="_blank" rel="noreferrer">{t("case.code")} <ArrowUpRight /></motion.a>}
        </div>
      </motion.section>

      <section className="case-story">
        {story.map((item, index) => (
          <motion.article
            key={item[0]}
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.7, delay: index * 0.08, ease }}
          >
            <span>{item[0]}</span><h3>{item[1]}</h3><p>{item[2]}</p><i aria-hidden="true" />
          </motion.article>
        ))}
      </section>

      <section className="case-gallery">
        {gallery.map((image, index) => (
          <motion.div
            className={`gallery-frame frame-${index + 1}`}
            key={`${image}-${index}`}
            initial={{ opacity: 0, y: 65, rotate: index ? 1.4 : -1.4 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.85, delay: index * 0.08, ease }}
          >
            {image ? <img src={image} alt={`${project.title}, imagem ${index + 1}`} loading="lazy" /> : <div><span>{String(index + 1).padStart(2, "0")}</span><strong>{project.title}</strong><small>{t("case.frame")}</small></div>}
          </motion.div>
        ))}
      </section>

      <MotionLink
        className="next-project"
        href={next ? `/projects/${next.slug}` : "/projects"}
        initial={{ opacity: 0, y: 45 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover="hover"
      >
        <span>{next ? t("case.next") : t("case.projects")}</span>
        <h2>{next ? next.title : t("case.back")}</h2>
        <motion.span className="next-project-action" variants={{ hover: { rotate: -8, scale: 1.06 } }}><ArrowRight /></motion.span>
      </MotionLink>
    </main>
  );
}
