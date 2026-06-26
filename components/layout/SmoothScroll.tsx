"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Mounts Lenis at the body level and wires it to GSAP's ticker so
 * ScrollTrigger pins/scrubs stay in sync with the smoothed scroll.
 * Skipped under prefers-reduced-motion. Exposes the instance on
 * window.__lenis so header / hero anchor clicks can call scrollTo.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  // Al cambiar de ruta, volvemos arriba. Next resetea el scroll nativo, pero
  // Lenis mantiene su posición interna → hay que avisarle explícitamente
  // (si no, el caso/artículo nuevo abre a la misma altura Y que el anterior).
  useEffect(() => {
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Skip Lenis entirely if the user prefers reduced motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    window.__lenis = lenis;

    // Keep ScrollTrigger synced with Lenis's scroll loop.
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const onTick = (time: number) => {
      // gsap.ticker time is in seconds, Lenis raf expects milliseconds.
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
