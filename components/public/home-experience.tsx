"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import type { Project, SiteSettings } from "@/lib/portfolio";
import { usePreferences } from "./preferences";
import { ProjectVisual } from "./project-visual";
import { SiteShell } from "./site-shell";

const capabilities = [
  {
    index: "01",
    title: "cap.fivem.title",
    label: "cap.fivem.label",
    text: "cap.fivem.text",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/FiveM-Logo.png/960px-FiveM-Logo.png",
    mediaClass: "is-logo fivem-media",
  },
  {
    index: "02",
    title: "cap.discord.title",
    label: "cap.discord.label",
    text: "cap.discord.text",
    image: "https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/66e3d7f4ef6498ac018f2c55_Symbol.svg",
    mediaClass: "is-logo discord-media",
  },
  {
    index: "03",
    title: "cap.sites.title",
    label: "cap.sites.label",
    text: "cap.sites.text",
    image: "https://images.unsplash.com/photo-1505238680356-667803448bb6?auto=format&fit=crop&w=1200&q=82",
    mediaClass: "is-photo",
  },
  {
    index: "04",
    title: "cap.apps.title",
    label: "cap.apps.label",
    text: "cap.apps.text",
    image: "https://unsplash.com/blog/content/images/2021/01/Cover-blog-5.jpg",
    mediaClass: "is-photo",
  },
];

const ticker = ["LUA", "FIVEM", "DISCORD BOTS", "NODE.JS", "WEBSITES", "APLICAÇÕES"];
const MotionLink = motion.create(Link);
const reveal = { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const };

export function HomeExperience({ projects, settings }: { projects: Project[]; settings: SiteSettings }) {
  const { t } = usePreferences();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 150, damping: 30, restDelta: 0.001 });
  const portraitY = useTransform(scrollYProgress, [0, 0.24], [0, 72]);
  const portraitScale = useTransform(scrollYProgress, [0, 0.24], [1, 1.035]);
  const portraitSource = settings.avatar && !settings.avatar.includes("avatars.githubusercontent.com")
    ? settings.avatar
    : "/joao-pedro.png";

  return (
    <SiteShell settings={settings}>
      <motion.div className="scroll-progress" style={{ scaleX }} />
      <main className="studio-home">
        <section className="studio-hero" id="inicio">
          <div className="studio-hero-noise" aria-hidden="true" />
          <motion.div
            className="studio-hero-meta"
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <span>PORTFÓLIO / 24—26</span>
            <span>{t("home.hero.meta")}</span>
            <span>@GUINAFPS</span>
          </motion.div>

          <div className="studio-hero-layout">
            <div className="studio-hero-copy">
              <motion.p
                className="studio-kicker"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, ...reveal }}
              >
                {t("home.hero.kicker")} <i /> {t("home.hero.role")}
              </motion.p>

              <motion.h1 initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.095, delayChildren: 0.18 } } }}>
                {[t("home.hero.line1"), t("home.hero.line2"), t("home.hero.line3")].map((line, index) => (
                  <span className={index === 1 ? "is-accent" : ""} key={line}>
                    <motion.b
                      variants={{
                        hidden: { y: "115%", rotate: 2 },
                        show: { y: 0, rotate: 0, transition: reveal },
                      }}
                    >
                      {line}
                    </motion.b>
                  </span>
                ))}
              </motion.h1>

              <motion.div
                className="studio-hero-bottom"
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.48, ...reveal }}
              >
                <p>
                  {t("home.hero.description")}
                </p>
                <div>
                  <MotionLink className="studio-button solid" href="/projects" whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                    {t("home.hero.projects")} <ArrowUpRight />
                  </MotionLink>
                  <MotionLink className="studio-button ghost" href="/contact" whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                    {t("home.hero.contact")}
                  </MotionLink>
                </div>
              </motion.div>
            </div>

            <motion.aside
              className="noir-portrait"
              style={{ y: portraitY, scale: portraitScale }}
              initial={{ opacity: 0, x: 70, clipPath: "inset(0 0 100% 0)" }}
              animate={{ opacity: 1, x: 0, clipPath: "inset(0 0 0% 0)" }}
              transition={{ delay: 0.24, duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="noir-portrait-frame">
                <img src={portraitSource} alt={`Retrato de ${settings.name}`} />
                <div className="noir-portrait-shade" aria-hidden="true" />
                <motion.div className="noir-sweep" aria-hidden="true" animate={{ y: ["-20%", "620%"] }} transition={{ duration: 5.5, repeat: Infinity, ease: "linear" }} />
              </div>
              <div className="noir-photo-label top"><span>01</span> JOÃO PEDRO / 2026</div>
              <div className="noir-photo-label bottom">PROGRAMADOR<br />FREELANCER</div>
              <div className="noir-skill skill-a">LUA / FIVEM</div>
              <div className="noir-skill skill-b">DISCORD BOTS</div>
              <div className="noir-skill skill-c">WEB / FULL STACK</div>
              <span className="noir-monogram">JP</span>
            </motion.aside>
          </div>

          <div className="studio-ticker" aria-label={`Áreas de atuação: ${ticker.join(", ")}`}>
            <div>{[...ticker, ...ticker].map((item, index) => <span key={`${item}-${index}`}>{item}<i aria-hidden="true" /></span>)}</div>
          </div>
        </section>

        <section className="studio-about" id="sobre">
          <div className="studio-section-label"><span>01</span><p>{t("home.about.label")}</p></div>
          <div className="studio-about-intro">
            <motion.h2
              initial={{ opacity: 0, y: 55 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={reveal}
            >
              {t("home.about.line1")}<br />{t("home.about.line2")}<br /><em>{t("home.about.line3")}</em>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ delay: 0.12, ...reveal }}
            >
              <p>{t("home.about.bio")}</p>
              <span>{t("home.about.since")}</span>
            </motion.div>
          </div>

          <div className="studio-capabilities">
            {capabilities.map((capability, index) => (
              <motion.article
                key={capability.index}
                initial={{ opacity: 0, y: 55, rotate: index % 2 ? 1.4 : -1.4 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                whileHover={{ y: -10, rotate: index % 2 ? -0.7 : 0.7 }}
                transition={{ delay: index * 0.06, ...reveal }}
              >
                <div className={`capability-media ${capability.mediaClass}`}>
                  <img src={capability.image} alt="" loading="lazy" referrerPolicy="no-referrer" />
                  <i aria-hidden="true" />
                </div>
                <div className="capability-meta"><span>{capability.index}</span><p>{t(capability.label)}</p></div>
                <h3>{t(capability.title)}</h3>
                <p>{t(capability.text)}</p>
                <ArrowDownRight />
              </motion.article>
            ))}
          </div>
        </section>

        <section className="studio-projects" id="projetos">
          <div className="studio-section-label light"><span>02</span><p>{t("home.projects.label")}</p></div>
          <div className="studio-projects-head">
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={reveal}
            >
              {t("home.projects.line1")}<br /><em>{t("home.projects.line2")}</em>
            </motion.h2>
            <p>{t("home.projects.description")}</p>
          </div>

          <div className="studio-project-grid">
            {projects.map((project, index) => (
              <MotionLink
                href={`/projects/${project.slug}`}
                className={`studio-project-card card-${(index % 4) + 1}`}
                key={project.id}
                initial={{ opacity: 0, y: 70, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-8%" }}
                whileHover={{ y: -10 }}
                transition={{ delay: (index % 2) * 0.08, ...reveal }}
              >
                <ProjectVisual project={project} priority={index < 2} />
                <div className="studio-project-meta">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p>{project.category} / {project.projectDate}</p>
                    <h3>{project.title}</h3>
                    <small>{project.technologies.slice(0, 4).join(" · ")}</small>
                  </div>
                  <ArrowUpRight />
                </div>
              </MotionLink>
            ))}
          </div>
          <MotionLink className="studio-all-work" href="/projects" whileHover={{ x: 8 }}>
            {t("home.projects.archive")} <span>{String(projects.length).padStart(2, "0")}</span><ArrowUpRight />
          </MotionLink>
        </section>

        <section className="studio-proof" id="experiencia">
          <div className="studio-section-label"><span>03</span><p>{t("home.proof.label")}</p></div>
          <div className="studio-proof-layout">
            <motion.div
              className="studio-log"
              initial={{ opacity: 0, x: -45 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={reveal}
            >
              <div><i /><i /><i /><span>JP_ACTIVITY.LOG</span></div>
              <p><b>2024.09</b> {t("home.proof.start")}</p>
              <p><b>2024—25</b> {t("home.proof.middle")}</p>
              <p><b>2025—26</b> {t("home.proof.now")}</p>
              <p className="is-running"><b>NOW</b> {t("home.proof.evolving")}<span>_</span></p>
            </motion.div>
            <div className="studio-stats">
              {[
                { value: "09/24", label: t("home.stat.start") },
                { value: "04", label: t("home.stat.cases") },
                { value: "07", label: t("home.stat.repos") },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 38 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, ...reveal }}
                >
                  <strong>{stat.value}</strong><span>{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="studio-contact">
          <div className="studio-contact-orbit" aria-hidden="true"><span>JP</span></div>
          <p>04 / {t("home.contact.label")}</p>
          <h2>{t("home.contact.line1")}<br /><em>{t("home.contact.line2")}</em></h2>
          <div className="studio-contact-cta">
            <MotionLink href="/contact" whileHover={{ rotate: -4, scale: 1.04 }} whileTap={{ scale: 0.98 }}>
              {t("home.contact.cta")} <ArrowUpRight />
            </MotionLink>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
