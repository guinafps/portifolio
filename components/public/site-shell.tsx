"use client";

import { useEffect, useRef, useState } from "react";
import Link from "@/components/ui/safe-link";
import { ArrowUpRight, Check, ChevronDown, ChevronUp, Languages, Menu, Moon, Sun, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { SiteSettings } from "@/lib/portfolio";
import { usePreferences, type Locale, type Theme } from "./preferences";

const links = [
  { href: "/#sobre", label: "nav.about" },
  { href: "/projects", label: "nav.projects" },
  { href: "/#experiencia", label: "nav.experience" },
  { href: "/contact", label: "nav.contact" },
];

const languages: { value: Locale; short: string; label: string }[] = [
  { value: "pt", short: "PT", label: "Português (BR)" },
  { value: "en", short: "EN", label: "English" },
  { value: "es", short: "ES", label: "Español" },
];

type CursorParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
};

function CursorExperience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!canvas || !ring || !dot || !finePointer) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const target = { x: -120, y: -120 };
    const follower = { x: -120, y: -120 };
    const last = { x: -120, y: -120 };
    let particles: CursorParticle[] = [];
    let frame = 0;
    let visible = false;
    let interactive = false;

    document.documentElement.dataset.cursor = "custom";

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * ratio);
      canvas.height = Math.round(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const setVisible = (nextVisible: boolean) => {
      visible = nextVisible;
      ring.dataset.visible = String(nextVisible);
      dot.dataset.visible = String(nextVisible);
    };

    const setInteractive = (nextInteractive: boolean) => {
      if (interactive === nextInteractive) return;
      interactive = nextInteractive;
      ring.dataset.active = String(nextInteractive);
    };

    const addParticles = (x: number, y: number, amount: number) => {
      for (let index = 0; index < amount; index += 1) {
        particles.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 0.9,
          vy: (Math.random() - 0.5) * 0.9,
          life: 0.72 + Math.random() * 0.28,
          size: 1.5 + Math.random() * 3.5,
        });
      }
      if (particles.length > 90) particles = particles.slice(-90);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      target.x = event.clientX;
      target.y = event.clientY;
      document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);

      if (!visible) {
        follower.x = event.clientX;
        follower.y = event.clientY;
        last.x = event.clientX;
        last.y = event.clientY;
        setVisible(true);
      }

      const distance = Math.hypot(event.clientX - last.x, event.clientY - last.y);
      addParticles(event.clientX, event.clientY, Math.min(5, Math.max(1, Math.ceil(distance / 20))));
      last.x = event.clientX;
      last.y = event.clientY;
      setInteractive(event.target instanceof Element && Boolean(event.target.closest("a, button, input, textarea, select, label")));
    };

    const onPointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) setVisible(false);
    };

    const onWindowBlur = () => setVisible(false);

    const render = () => {
      follower.x += (target.x - follower.x) * 0.14;
      follower.y += (target.y - follower.y) * 0.14;
      ring.style.transform = `translate3d(${follower.x}px, ${follower.y}px, 0) translate(-50%, -50%)`;
      dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;

      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (visible) {
        const tether = context.createLinearGradient(follower.x, follower.y, target.x, target.y);
        tether.addColorStop(0, "rgba(143, 29, 44, 0)");
        tether.addColorStop(1, interactive ? "rgba(238, 235, 231, .52)" : "rgba(205, 49, 72, .38)");
        context.beginPath();
        context.moveTo(follower.x, follower.y);
        context.lineTo(target.x, target.y);
        context.lineWidth = interactive ? 1.5 : 1;
        context.strokeStyle = tether;
        context.stroke();
      }

      particles = particles.filter((particle) => {
        particle.life -= 0.022;
        if (particle.life <= 0) return false;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.985;
        particle.vy *= 0.985;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
        context.fillStyle = `rgba(195, 44, 66, ${particle.life * 0.62})`;
        context.fill();
        return true;
      });

      frame = window.requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onPointerOut);
    window.addEventListener("blur", onWindowBlur);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("blur", onWindowBlur);
      delete document.documentElement.dataset.cursor;
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="cursor-canvas" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true"><span>JP</span></div>
      <div ref={dotRef} className="cursor-live-dot" aria-hidden="true" />
    </>
  );
}

export function SiteShell({
  children,
  settings,
  compact = false,
}: {
  children: React.ReactNode;
  settings: SiteSettings;
  compact?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [themeTransition, setThemeTransition] = useState<Theme | null>(null);
  const themeTimers = useRef<number[]>([]);
  const reduce = useReducedMotion();
  const { locale, setLocale, theme, toggleTheme, t } = usePreferences();
  const socialLinks = [
    ["GitHub", settings.github],
    ["Instagram", settings.instagram],
    ["WhatsApp", settings.whatsapp],
  ].filter((item): item is [string, string] => Boolean(item[1]));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => () => themeTimers.current.forEach((timer) => window.clearTimeout(timer)), []);

  useEffect(() => {
    if (!languageOpen) return;
    const closeLanguageMenu = (event: PointerEvent) => {
      if (event.target instanceof Element && !event.target.closest(".language-picker")) setLanguageOpen(false);
    };
    window.addEventListener("pointerdown", closeLanguageMenu);
    return () => window.removeEventListener("pointerdown", closeLanguageMenu);
  }, [languageOpen]);

  function changeTheme() {
    if (themeTransition) return;
    const nextTheme = theme === "dark" ? "light" : "dark";
    setThemeTransition(nextTheme);
    themeTimers.current.push(window.setTimeout(toggleTheme, 720));
    themeTimers.current.push(window.setTimeout(() => setThemeTransition(null), 1420));
  }

  function changeLanguage(nextLocale: Locale) {
    setLocale(nextLocale);
    setLanguageOpen(false);
  }

  return (
    <div className={compact ? "site compact" : "site"}>
      <div className="pointer-light" aria-hidden="true" />
      <CursorExperience />
      <AnimatePresence>
        {themeTransition && (
          <motion.div
            key={themeTransition}
            className={`theme-cinematic is-${themeTransition}`}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.34, ease: "easeOut" } }}
            aria-hidden="true"
          >
            <motion.div
              className="theme-cinematic-wipe"
              initial={{ clipPath: "circle(0% at calc(100% - 121px) 48px)" }}
              animate={{ clipPath: "circle(165% at calc(100% - 121px) 48px)" }}
              transition={{ duration: 0.82, ease: [0.76, 0, 0.24, 1] }}
            />
            <div className="theme-cinematic-grid" />
            <div className="theme-cinematic-panels">
              {Array.from({ length: 7 }, (_, index) => (
                <motion.i
                  key={index}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.66, delay: index * 0.045, ease: [0.76, 0, 0.24, 1] }}
                />
              ))}
            </div>
            <div className="theme-cinematic-orbits"><i /><i /><i /></div>
            <motion.div
              className="theme-cinematic-mark"
              initial={{ opacity: 0, scale: 0.45, rotate: -32 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.45, 1, 1.04, 1.3], rotate: [-32, 0, 0, 12] }}
              transition={{ duration: 1.38, times: [0, 0.27, 0.76, 1], ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="theme-cinematic-logo" />
              <p>{themeTransition === "light" ? "MODO CLARO" : "MODO ESCURO"}</p>
              {themeTransition === "light" ? <Sun /> : <Moon />}
            </motion.div>
            <motion.div
              className="theme-cinematic-line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: [0, 1, 1, 0] }}
              transition={{ duration: 1.35, times: [0, 0.32, 0.76, 1], ease: [0.76, 0, 0.24, 1] }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.header
        className={`site-nav ${scrolled ? "is-scrolled" : ""}`}
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link className="site-mark" href="/" aria-label={`${settings.name}, início`}>
          <span className="site-logo-image" aria-hidden="true" />
        </Link>
        <nav className="desktop-nav" aria-label={t("nav.primary")}>
          {links.map((link) => (
            <Link key={link.label} href={link.href}>{t(link.label)}</Link>
          ))}
          <Link className="nav-cta" href="/contact">
            {t("nav.talk")} <ArrowUpRight size={14} />
          </Link>
        </nav>
        <div className="site-preferences">
          <button className="theme-toggle" type="button" onClick={changeTheme} aria-label={theme === "dark" ? t("a11y.lightTheme") : t("a11y.darkTheme")} title={theme === "dark" ? t("a11y.lightTheme") : t("a11y.darkTheme")} disabled={Boolean(themeTransition)}>
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>
          <div className="language-picker">
            <button
              className="language-trigger"
              type="button"
              onClick={() => setLanguageOpen((open) => !open)}
              aria-label={t("a11y.language")}
              aria-haspopup="menu"
              aria-expanded={languageOpen}
            >
              <Languages />
              <motion.span key={locale} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>{locale.toUpperCase()}</motion.span>
              <ChevronDown className={languageOpen ? "is-open" : ""} />
            </button>
            <AnimatePresence>
              {languageOpen && (
                <motion.div
                  className="language-menu"
                  role="menu"
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  {languages.map((language) => (
                    <button
                      type="button"
                      role="menuitemradio"
                      aria-checked={locale === language.value}
                      className={locale === language.value ? "active" : ""}
                      onClick={() => changeLanguage(language.value)}
                      key={language.value}
                    >
                      <span>{language.short}</span>
                      <b>{language.label}</b>
                      {locale === language.value && <Check />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <button
          className="menu-button"
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            {links.map((link, index) => (
              <motion.div
                key={link.label}
                initial={reduce ? false : { y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.16 + index * 0.07 }}
              >
                <Link href={link.href} onClick={() => setMenuOpen(false)}>
                  <span>0{index + 1}</span>{t(link.label)}
                </Link>
              </motion.div>
            ))}
            <Link className="mobile-contact-link" href="/contact" onClick={() => setMenuOpen(false)}>
              {t("nav.startContact")} <ArrowUpRight size={18} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {children}

      <footer className="site-footer">
        <div className="footer-primary">
          <div className="footer-brand-block">
            <Link className="site-mark" href="/" aria-label={`${settings.name}, início`}>
              <span className="site-logo-image" aria-hidden="true" />
            </Link>
            <div>
              <span>{t("footer.role")}</span>
              <h2>{t("footer.title1")}<br />{t("footer.title2")}</h2>
            </div>
          </div>
          <Link className="footer-contact-cta" href="/contact">
            <span>{t("footer.cta")}</span>
            <ArrowUpRight />
          </Link>
        </div>

        <div className="footer-directory">
          <div className="footer-column">
            <p>{t("footer.navigation")}</p>
            {links.map((link, index) => (
              <Link key={link.label} href={link.href}>
                <span>0{index + 1}</span>{t(link.label)}
              </Link>
            ))}
          </div>
          <div className="footer-column">
            <p>{t("footer.networks")}</p>
            {socialLinks.map(([label, url]) => (
              <a key={label} href={url} target="_blank" rel="noreferrer">
                {label}<ArrowUpRight />
              </a>
            ))}
          </div>
          <div className="footer-column footer-focus">
            <p>{t("footer.focus")}</p>
            <span>{t("footer.fivem")}</span>
            <span>{t("footer.discord")}</span>
            <span>{t("footer.web")}</span>
            <span>{t("footer.experiences")}</span>
          </div>
        </div>

        <div className="footer-signature">
          <span>© {new Date().getFullYear()} {settings.name}</span>
          <span>{t("footer.portfolio")}</span>
          <button onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}>
            {t("footer.top")} <ChevronUp />
          </button>
        </div>
      </footer>
    </div>
  );
}

export function SectionHeading({
  index,
  kicker,
  children,
}: {
  index: string;
  kicker: React.ReactNode;
  children: React.ReactNode;
}) {
  return <div className="section-heading"><span>{index}</span><p>{kicker}</p><h2>{children}</h2></div>;
}

export function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 46, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.82, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
