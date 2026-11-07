"use client";

import Link from "@/components/ui/safe-link";
import { useRef, useState } from "react";
import { ArrowUpRight, Code2, Globe2, Layers3, MessageCircle, Fingerprint, Workflow, Play } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Project, SiteSettings } from "@/lib/portfolio";
import { usePreferences } from "./preferences";
import { ProjectVisual } from "./project-visual";
import { SiteShell } from "./site-shell";
import { homeCopy } from "./home-copy";
import { referenceCopy } from "./reference-copy";
import { IntroSequence, type IntroStage } from "./intro-sequence";

const serviceIcons = [Globe2, Layers3, MessageCircle, Code2];
const serviceBrands = ["", "", "discord", "fivem"];
const differenceIcons = [Fingerprint, Workflow, MessageCircle];

export function HomeExperience({ projects, settings }: { projects: Project[]; settings: SiteSettings }) {
  const { locale } = usePreferences();
  const c = homeCopy[locale];
  const r = referenceCopy[locale];
  const reduce = useReducedMotion();
  const [introStage, setIntroStage] = useState<IntroStage>("loading");
  const [introRun, setIntroRun] = useState(0);
  const portraitRef = useRef<HTMLImageElement>(null);
  const showcaseRef = useRef<HTMLElement>(null);
  const { scrollYProgress: sceneProgress } = useScroll({ target: showcaseRef, offset: ["start end", "end start"] });
  const deviceY = useTransform(sceneProgress, [0, .5, 1], [80, 0, -50]);
  const deviceScale = useTransform(sceneProgress, [0, .5, 1], [.84, 1, .98]);
  const deviceRotate = useTransform(sceneProgress, [0, .5, 1], [12, 0, -4]);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 150, damping: 30 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const portraitX = useSpring(mouseX, { stiffness: 55, damping: 28 });
  const portraitY = useSpring(mouseY, { stiffness: 55, damping: 28 });
  const contact = settings.whatsapp || "/contact";
  const external = settings.whatsapp ? { target: "_blank", rel: "noreferrer" } : {};
  const portrait = "/joao-pedro-formal.png";
  const replayIntro = () => {
    try { sessionStorage.setItem("jp-intro-full-motion", "true"); } catch { /* The animation also works without storage. */ }
    mouseX.set(0);
    mouseY.set(0);
    setIntroStage("loading");
    setIntroRun(run => run + 1);
  };

  const ContactButton = ({ dark = false }: { dark?: boolean }) => <a className={`jp-action${dark ? " jp-action-dark" : ""}`} href={contact} {...external}>{r.quote}<span><ArrowUpRight size={19} /></span></a>;

  return <SiteShell settings={settings}>
    <IntroSequence key={introRun} src={portrait} targetRef={portraitRef} onStageChange={setIntroStage} fullMotion={introRun > 0} onEnableMotion={replayIntro} />
    <a className="jp-skip-link" href="#conteudo">{locale === "en" ? "Skip to content" : locale === "es" ? "Ir al contenido" : "Pular para o conteúdo"}</a>
    <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />
    <main className="jp-reference" id="conteudo" data-intro-stage={introStage}>
      <section className="jp-hero" id="inicio" onPointerMove={(event) => {
        if (reduce || introStage !== "done" || event.pointerType !== "mouse") return;
        const box = event.currentTarget.getBoundingClientRect();
        mouseX.set((event.clientX - box.left - box.width / 2) * 0.012);
        mouseY.set((event.clientY - box.top - box.height / 2) * 0.008);
      }} onPointerLeave={() => { mouseX.set(0); mouseY.set(0); }}>
        <div className="jp-hero-atmosphere" aria-hidden="true" />
        <motion.div className="jp-portrait" style={{ x: portraitX, y: portraitY }}>
          <img ref={portraitRef} src={portrait} alt={settings.name} width="1122" height="1402" fetchPriority="high" />
        </motion.div>
        <div className="jp-hero-shade" aria-hidden="true" />
        <div className="jp-hero-intro">
          <p className="jp-hero-identity">João Pedro dos Santos</p>
          <h1>{r.headline.map((line) => <span key={line}>{line}</span>)}</h1>
          <p className="jp-hero-description">{r.intro}</p>
          <div className="jp-hero-actions"><ContactButton /><Link className="jp-outline-action" href="#projetos">{r.projects}</Link></div>
          <button className="jp-intro-replay" onClick={replayIntro}><Play size={11} aria-hidden="true" />{locale === "en" ? "Replay full intro" : locale === "es" ? "Repetir introducción completa" : "Rever abertura completa"}</button>
        </div>
        <div className="jp-hero-signature"><h2>{r.sideTitle.map((line) => <span key={line}>{line}</span>)}</h2><p>{r.sideText}</p></div>
      </section>

      <section className="jp-about jp-light" id="sobre"><div className="jp-container jp-about-grid">
        <div><span className="jp-kicker">{r.aboutLabel}</span><h2>{r.aboutTitle.map((line, index) => <span key={line} className={index === 2 ? "jp-accent" : ""}>{line}</span>)}</h2><div className="jp-byline"><img src={portrait} alt="" width="42" height="42" /><span>{r.since}</span></div></div>
        <div className="jp-about-text"><p>{c.aboutText}</p><p>{c.aboutText2}</p><ContactButton dark /></div>
      </div></section>

      <section ref={showcaseRef} className="jp-showcase jp-dark" aria-labelledby="showcase-title">
        <div className="jp-showcase-glow" aria-hidden="true" />
        <h2 id="showcase-title">{r.showcaseTitle.map(line => <span key={line}>{line}</span>)}</h2>
        <motion.div className="jp-showcase-device" style={{ y: deviceY, scale: deviceScale, rotateX: deviceRotate }}>{projects[0] ? <ProjectVisual project={projects[0]} /> : <div className="jp-code-preview"><Code2 /><span>João Pedro</span></div>}</motion.div>
        <div className="jp-showcase-bottom jp-container"><p>{r.showcaseLeft}<small>{r.showcaseLeftSmall}</small></p><div><p>{r.showcaseRight}</p><ContactButton /></div></div>
      </section>

      <section className="jp-facts jp-dark" aria-label={locale === "en" ? "Portfolio facts" : locale === "es" ? "Datos del portafolio" : "Sobre este portfólio"}><dl className="jp-container">{[String(projects.length).padStart(2, "0"), "09.2024", "04", "03"].map((value, index) => <div key={index}><dt>{r.stats[index]}</dt><dd>{value}</dd></div>)}</dl></section>

      <section className="jp-projects jp-light" id="projetos"><div className="jp-container">
        <header className="jp-centered-heading"><h2>{r.projectsTitle}</h2><p>{r.projectsIntro}</p></header>
        <div className="jp-project-grid">{projects.slice(0, 6).map((project) => <Link className="jp-project-card" href={`/projects/${project.slug}`} key={project.id}>
          <div className="jp-project-cover"><ProjectVisual project={project} /></div>
          <div className="jp-project-meta"><div><h3>{project.title}</h3><p>{project.projectDate} · {project.category}</p></div><span className="jp-project-arrow"><ArrowUpRight size={17} /><span>{c.case}</span></span></div>
        </Link>)}</div>
        <div className="jp-projects-end"><Link className="jp-action jp-action-dark" href="/projects">{c.all}<span><ArrowUpRight size={19} /></span></Link></div>
      </div></section>

      <section className="jp-process jp-light" id="experiencia"><div className="jp-container"><h2>{r.processTitle}<br /><span className="jp-accent">{r.processAccent}</span></h2><ol className="jp-process-track">{r.steps.map(([title, description], index) => <li key={title}><span className="jp-step-number">{index + 1}</span><h3>{title}</h3><p>{description}</p></li>)}</ol></div></section>

      <section className="jp-differences jp-dark" id="diferenciais"><div className="jp-container"><h2>{r.differencesTitle.map(line => <span key={line}>{line}</span>)}</h2><div className="jp-difference-grid">{r.differences.map(([title, description], index) => { const Icon = differenceIcons[index]; return <article key={title}><Icon className="jp-difference-icon" size={30} aria-hidden="true" /><h3>{title}</h3><p>{description}</p><div className={`jp-planet jp-planet-${index}`} aria-hidden="true"><span /></div></article>; })}</div><ContactButton /></div></section>

      <section className="jp-services jp-light"><div className="jp-container"><header className="jp-centered-heading"><h2>{r.servicesTitle}<br /><span className="jp-accent">{r.servicesAccent}</span></h2></header><div className="jp-service-layout"><div className="jp-orbit-art" aria-hidden="true"><i /><i /><i /><span className="jp-orbit-logo"><img src="/jp-monogram.png" alt="" width="120" height="120" /></span><span className="jp-orbit-node node-web"><Globe2 /></span><span className="jp-orbit-node node-code"><Code2 /></span><span className="jp-orbit-node node-data"><Layers3 /></span><span className="jp-orbit-node node-chat"><MessageCircle /></span></div><div className="jp-service-grid">{c.serviceTitles.map((title, index) => { const Icon = serviceIcons[index]; return <article key={title}><div className="nova-service-icon">{serviceBrands[index] ? <span className={`nova-brand-icon brand-${serviceBrands[index]}`} aria-hidden="true" /> : <Icon strokeWidth={1.4} aria-hidden="true" />}</div><h3>{title}</h3><p>{c.serviceTexts[index]}</p></article>; })}</div></div></div></section>

      <section className="jp-contact jp-dark" id="contato"><div className="jp-container"><h2>{r.contactTitle.map(line => <span key={line}>{line}</span>)}</h2><p>{r.contactText}</p><ContactButton /><Link className="jp-form-link" href="/contact">{c.form}</Link><div className="jp-contact-brand" aria-hidden="true"><div /><img src="/jp-monogram.png" alt="" width="220" height="220" /></div></div></section>

      <section className="jp-faq jp-dark" id="faq"><div className="jp-container"><h2>{r.faqTitle}</h2><Accordion type="single" collapsible key={locale}>{c.faqs.map(([question, answer], index) => <AccordionItem key={index} value={`faq-${index}`}><AccordionTrigger>{question}</AccordionTrigger><AccordionContent><p>{answer}</p></AccordionContent></AccordionItem>)}</Accordion></div></section>
    </main>
  </SiteShell>;
}
