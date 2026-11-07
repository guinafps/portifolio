"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { animate } from "motion";
import { usePreferences } from "./preferences";

export type IntroStage = "loading" | "transfer" | "done";
type Frame = { left: number; top: number; width: number; height: number; x: number; y: number; scale: number };

/** One portrait, two measured positions: loading screen -> actual hero image. */
export function IntroSequence({ src, targetRef, onStageChange }: {
  src: string;
  targetRef: RefObject<HTMLImageElement | null>;
  onStageChange: (stage: IntroStage) => void;
}) {
  const { locale } = usePreferences();
  const [stage, setStage] = useState<IntroStage>("loading");
  const [progress, setProgress] = useState(0);
  const [frame, setFrame] = useState<Frame | null>(null);
  const [photoReady, setPhotoReady] = useState(false);
  const photo = useRef<HTMLImageElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const labels = useRef<HTMLDivElement>(null);
  const finishRef = useRef<() => void>(() => {});
  const words = {
    pt: { loading: "Preparando a experiência", skip: "Pular abertura", ready: "Tudo pronto" },
    en: { loading: "Preparing the experience", skip: "Skip intro", ready: "All set" },
    es: { loading: "Preparando la experiencia", skip: "Saltar introducción", ready: "Todo listo" },
  }[locale];

  useEffect(() => {
    let disposed = false;
    let transferring = false;
    let targetProgress = 0;
    let displayed = 0;
    let raf = 0;
    let resourcesReady = false;
    let finished = false;
    let deadline = 0;
    const started = performance.now();
    const controls: ReturnType<typeof animate>[] = [];
    const root = document.documentElement;
    const originalFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const inertTargets = [...document.querySelectorAll<HTMLElement>(".site-nav, .jp-reference, .site-footer")];
    const priorInert = inertTargets.map(element => element.inert);
    const notify = (next: IntroStage) => {
      root.dataset.intro = next;
      setStage(next);
      onStageChange(next);
      window.dispatchEvent(new CustomEvent("jp:intro", { detail: next }));
    };
    const unlock = () => {
      root.classList.remove("jp-intro-lock");
      inertTargets.forEach((element, index) => { element.inert = priorInert[index]; });
    };
    const finish = () => {
      if (disposed || finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(deadline);
      controls.forEach(control => control.stop());
      notify("done");
      unlock();
      if (originalFocus && originalFocus !== document.body) originalFocus.focus({ preventScroll: true });
    };
    finishRef.current = finish;

    // The QA preview is explicit and development-only; production always honors accessibility settings.
    const motionPreview = process.env.NODE_ENV !== "production" && new URLSearchParams(location.search).has("motion-preview");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches && !motionPreview;
    if (reduced || location.hash || window.scrollY > 50) {
      finish();
      return () => { disposed = true; unlock(); };
    }

    root.classList.add("jp-intro-lock");
    inertTargets.forEach(element => { element.inert = true; });
    notify("loading");
    const measure = () => {
      const box = targetRef.current?.getBoundingClientRect();
      if (!box || !box.width) return null;
      const width = Math.min(310, innerWidth * .58);
      return { left: box.left, top: box.top, width: box.width, height: box.height,
        x: (innerWidth - width) / 2 - box.left,
        y: innerHeight * .22 - box.top, scale: width / box.width };
    };
    setFrame(measure());
    const onResize = () => { if (transferring) finish(); else setFrame(measure()); };
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") finish(); };
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);
    deadline = window.setTimeout(finish, 7000);

    const transfer = async () => {
      if (transferring || disposed) return;
      transferring = true;
      setProgress(100);
      const destination = measure();
      if (!destination || !photo.current || !backdrop.current) { finish(); return; }
      notify("transfer");
      // Reduced motion has already exited above; keep the development preview deterministic too.
      if (labels.current) controls.push(animate(labels.current, { opacity: 0, y: -20 }, { duration: .35, reduceMotion: false }));
      controls.push(animate(backdrop.current, { opacity: 0 }, { duration: 1.05, delay: .22, reduceMotion: false }));
      const travel = animate(photo.current, {
        x: [destination.x, 0], y: [destination.y, 0], scale: [destination.scale, 1], opacity: 1,
      }, { duration: 1.45, ease: [.76, 0, .24, 1], reduceMotion: false });
      controls.push(travel);
      await travel.finished;
      finish();
    };
    const tick = (time: number) => {
      if (disposed || transferring || root.dataset.intro === "done") return;
      displayed += (targetProgress - displayed) * .065;
      setProgress(Math.min(100, Math.round(displayed)));
      if (resourcesReady && displayed > 99.2 && time - started > 1300) void transfer();
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // Percentages represent completed preparation steps, not simulated download bytes.
    let completed = 10;
    targetProgress = completed;
    const mark = (weight: number) => { if (!disposed) targetProgress = (completed += weight); };
    const portraitReady = new Promise<void>((resolve) => {
      const img = new Image();
      img.src = src;
      img.decode().then(() => { if (!disposed) setPhotoReady(true); resolve(); }).catch(() => resolve());
    }).then(() => mark(60));
    const fontsReady = document.fonts.ready.then(() => mark(20));
    Promise.all([portraitReady, fontsReady]).then(() => {
      if (disposed) return;
      requestAnimationFrame(() => { if (!disposed) { mark(10); resourcesReady = true; } });
    });
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      clearTimeout(deadline);
      controls.forEach(control => control.stop());
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
      unlock();
      delete root.dataset.intro;
    };
  }, [src, targetRef, onStageChange]);

  if (stage === "done") return null;
  return <div className={`jp-intro is-${stage}`} aria-label={words.loading} aria-busy={stage === "loading"}>
    <div className="jp-intro-backdrop" ref={backdrop} />
    {frame && <img ref={photo} src={src} alt="" className={`jp-intro-portrait ${photoReady ? "is-ready" : ""}`} style={{
      left: frame.left, top: frame.top, width: frame.width, height: frame.height,
      transform: `translate(${frame.x}px, ${frame.y}px) scale(${frame.scale})`,
    }} />}
    <div ref={labels} className="jp-intro-labels">
      <p className="jp-intro-name">JOÃO PEDRO<span>DOS SANTOS</span></p>
      <div className="jp-intro-meter">
        <div className="jp-intro-meter-label"><span>{progress === 100 ? words.ready : words.loading}</span><span>{progress.toString().padStart(2, "0")}%</span></div>
        <div className="jp-intro-track" role="progressbar" aria-label={words.loading} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><i style={{ transform: `scaleX(${progress / 100})` }} /></div>
      </div>
      <button className="jp-intro-skip" onClick={() => finishRef.current()}>{words.skip}</button>
    </div>
    <noscript><style>{`.jp-intro { display:none }`}</style></noscript>
  </div>;
}
