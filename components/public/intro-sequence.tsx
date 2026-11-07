"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { animate } from "motion";
import { usePreferences } from "./preferences";

export type IntroStage = "loading" | "transfer" | "done";
type Frame = { left: number; top: number; width: number; height: number; x: number; y: number; scale: number };

/** One portrait, two measured positions: loading screen -> actual hero image. */
export function IntroSequence({ src, targetRef, onStageChange, fullMotion = false, onEnableMotion }: {
  src: string;
  targetRef: RefObject<HTMLImageElement | null>;
  onStageChange: (stage: IntroStage) => void;
  fullMotion?: boolean;
  onEnableMotion: () => void;
}) {
  const { locale } = usePreferences();
  const [stage, setStage] = useState<IntroStage>("loading");
  const [progress, setProgress] = useState(0);
  const [frame, setFrame] = useState<Frame | null>(null);
  const [photoReady, setPhotoReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const photo = useRef<HTMLImageElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const labels = useRef<HTMLDivElement>(null);
  const finishRef = useRef<() => void>(() => {});
  const words = {
    pt: { loading: "Preparando a experiência", skip: "Pular abertura", ready: "Tudo pronto", enable: "Ativar animação completa", reduced: "Seu aparelho prefere menos movimento." },
    en: { loading: "Preparing the experience", skip: "Skip intro", ready: "All set", enable: "Enable full animation", reduced: "Your device prefers reduced motion." },
    es: { loading: "Preparando la experiencia", skip: "Saltar introducción", ready: "Todo listo", enable: "Activar animación completa", reduced: "Tu dispositivo prefiere menos movimiento." },
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
    let readyAt = 0;
    const started = performance.now();
    const controls: ReturnType<typeof animate>[] = [];
    const root = document.documentElement;
    const priorRestoration = history.scrollRestoration;
    let restoredScroll = false;
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
      if (restoredScroll) history.scrollRestoration = priorRestoration;
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

    // A visitor can explicitly opt in for this intro without changing device accessibility settings.
    let optedIn = fullMotion;
    try { optedIn ||= sessionStorage.getItem("jp-intro-full-motion") === "true"; } catch { /* Storage is optional. */ }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches && !optedIn;
    setReducedMotion(reduced);
    root.dataset.introMotion = reduced ? "reduced" : "full";
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const deepLink = location.hash && location.hash !== "#inicio";
    if (!fullMotion && (deepLink || navigation?.type === "back_forward")) {
      finish();
      return () => { disposed = true; unlock(); };
    }

    root.classList.add("jp-intro-lock");
    history.scrollRestoration = "manual";
    restoredScroll = true;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
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
    const initialWidth = innerWidth;
    const onResize = () => {
      // Mobile browser chrome changes height while scrolling; it must not cancel the photo transfer.
      if (transferring) { if (Math.abs(innerWidth - initialWidth) > 5) finish(); }
      else setFrame(measure());
    };
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") finish(); };
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);
    deadline = window.setTimeout(finish, 7000);

    const transfer = async () => {
      if (transferring || disposed || finished) return;
      transferring = true;
      setProgress(100);
      const destination = measure();
      if (!destination || !photo.current || !backdrop.current) { finish(); return; }
      notify("transfer");
      if (reduced) {
        // Keep the name, photo and progress; replace the large zoom with a gentle dissolve.
        if (labels.current) controls.push(animate(labels.current, { opacity: 0 }, { duration: .2, reduceMotion: false }));
        controls.push(animate(photo.current, { opacity: 0 }, { duration: .25, reduceMotion: false }));
        const dissolve = animate(backdrop.current, { opacity: 0 }, { duration: .4, reduceMotion: false });
        controls.push(dissolve);
        await dissolve.finished;
        finish();
        return;
      }
      // Full movement is either the system default or an explicit visitor choice.
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
      setProgress(Math.min(resourcesReady ? 100 : 99, Math.round(displayed)));
      if (resourcesReady && displayed > 99.2 && time - started > 1700) {
        if (!readyAt) { readyAt = time; setProgress(100); }
        if (time - readyAt > 280) { void transfer().catch(finish); return; }
      }
      raf = requestAnimationFrame(tick);
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
      delete root.dataset.introMotion;
    };
  }, [src, targetRef, onStageChange, fullMotion]);

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
      {reducedMotion && stage === "loading" && <div className="jp-intro-motion-choice"><span>{words.reduced}</span><button onClick={onEnableMotion}>{words.enable}</button></div>}
    </div>
    <noscript><style>{`.jp-intro,.jp-intro-replay { display:none } .jp-reference[data-intro-stage="loading"] :is(.jp-hero-intro,.jp-hero-signature) { opacity:1 }`}</style></noscript>
  </div>;
}
