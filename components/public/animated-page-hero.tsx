"use client";

import { ArrowDown, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { usePreferences } from "./preferences";

const ease = [0.16, 1, 0.3, 1] as const;

export function AnimatedPageHero({
  eyebrow,
  lines,
  accentLine,
  description,
  index,
  actionHref,
  actionLabel,
  translate = false,
  variant = "default",
}: {
  eyebrow: string;
  lines: string[];
  accentLine: number;
  description: string;
  index: string;
  actionHref?: string;
  actionLabel?: string;
  translate?: boolean;
  variant?: "default" | "about" | "contact";
}) {
  const { t } = usePreferences();
  const text = (value: string) => translate ? t(value) : value;
  return (
    <header className={`page-hero animated-page-hero ${variant === "contact" ? "contact-hero" : ""} ${variant === "about" ? "about-hero" : ""}`}>
      <div className="inner-hero-grid" aria-hidden="true" />
      <motion.p initial={{ opacity: 0, x: -22 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.08 }}>
        {text(eyebrow)}
      </motion.p>
      <span className="inner-hero-index" aria-hidden="true">{index}</span>
      <motion.h1
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } }}
      >
        {lines.map((line, lineIndex) => (
          <span className={lineIndex === accentLine ? "accent" : ""} key={line}>
            <motion.b
              variants={{
                hidden: { y: "112%", rotate: 1.5 },
                show: { y: 0, rotate: 0, transition: { duration: 0.9, ease } },
              }}
            >
              {text(line)}
            </motion.b>
          </span>
        ))}
      </motion.h1>
      <motion.div
        className="inner-hero-foot"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.5, ease }}
      >
        <p>{text(description)}</p>
        {actionHref && actionLabel
          ? <a className="inner-hero-action" href={actionHref}>{text(actionLabel)}<ArrowUpRight /></a>
          : <span>ROLE PARA EXPLORAR <ArrowDown /></span>}
      </motion.div>
      <div className="inner-hero-orbit" aria-hidden="true"><i /><i /><span>JP</span></div>
      <motion.div
        className="inner-hero-line"
        aria-hidden="true"
        animate={{ scaleX: [0.05, 1, 0.05], opacity: [0.25, 0.8, 0.25] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </header>
  );
}
