"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export function SmoothScroll({ paused }: { paused: boolean }) {
  const instance = useRef<Lenis | null>(null);
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true, lerp: .085, smoothWheel: true, syncTouch: false,
      anchors: { offset: -95 }, stopInertiaOnNavigate: true,
      prevent: node => node.closest("[data-lenis-prevent], input, textarea, select, .mobile-menu") !== null,
    });
    instance.current = lenis;
    const intro = (event: Event) => (event as CustomEvent).detail === "done" ? lenis.start() : lenis.stop();
    const top = () => lenis.scrollTo(0, { duration: 1.4 });
    window.addEventListener("jp:intro", intro);
    window.addEventListener("jp:scroll-top", top);
    if (document.documentElement.dataset.intro && document.documentElement.dataset.intro !== "done") lenis.stop();
    return () => {
      window.removeEventListener("jp:intro", intro);
      window.removeEventListener("jp:scroll-top", top);
      lenis.destroy();
      instance.current = null;
    };
  }, []);
  useEffect(() => {
    if (paused) instance.current?.stop();
    else if (!document.documentElement.dataset.intro || document.documentElement.dataset.intro === "done") instance.current?.start();
  }, [paused]);
  return null;
}
