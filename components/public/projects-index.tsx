"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Project } from "@/lib/portfolio";
import { ProjectVisual } from "./project-visual";
import { usePreferences } from "./preferences";

const MotionLink = motion.create(Link);

export function ProjectsIndex({ projects }: { projects: Project[] }) {
  const { t } = usePreferences();
  const categories = useMemo(() => ["__all__", ...Array.from(new Set(projects.map((project) => project.category)))], [projects]);
  const [filter, setFilter] = useState("__all__");
  const visible = filter === "__all__" ? projects : projects.filter((project) => project.category === filter);

  return (
    <>
      <motion.div
        className="project-filters"
        role="group"
        aria-label={t("projects.filter")}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {categories.map((category) => (
          <button key={category} className={filter === category ? "active" : ""} onClick={() => setFilter(category)}>
            {filter === category && <motion.i layoutId="active-filter" />}
            <span>{category === "__all__" ? t("projects.all") : category}</span>
          </button>
        ))}
      </motion.div>

      <motion.div className="project-grid-editorial" layout>
        <AnimatePresence mode="popLayout">
          {visible.map((project, index) => (
            <MotionLink
              layout
              href={`/projects/${project.slug}`}
              className={`project-tile ${index % 3 === 1 ? "wide" : ""}`}
              key={project.id}
              initial={{ opacity: 0, y: 55, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 28, scale: 0.97 }}
              transition={{ duration: 0.62, delay: index * 0.055, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -10, scale: 1.006 }}
            >
              <span className="tile-ghost-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <ProjectVisual project={project} priority={index < 2} />
              <div className="tile-meta">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h2>{project.title}</h2>
                  <p>{project.shortDescription}</p>
                  <small>{project.technologies.slice(0, 3).join(" · ")}</small>
                </div>
                <span className="tile-arrow"><ArrowUpRight /></span>
              </div>
            </MotionLink>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
