"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useIsMobile } from "@/components/hooks/use-is-mobile";
import { useCopy } from "@/components/i18n/LanguageContext";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const DESKTOP_SRC = "/assets/video/equipo-hero-desktop.mp4";
const MOBILE_SRC = "/assets/video/equipo-hero-mobile.mp4";
const DESKTOP_POSTER = "/assets/video/equipo-hero-desktop-poster.webp";
const MOBILE_POSTER = "/assets/video/equipo-hero-mobile-poster.webp";

export function EquipoHero() {
  const reduced = useReducedMotion() ?? false;
  const { eyebrow } = useCopy().equipo.hero;
  const isMobile = useIsMobile(768);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sólo la variante del viewport: mobile vertical, desktop horizontal.
  // SSR / primer paint: sin src (fondo oscuro + poster cuando ya hay viewport).
  const src =
    isMobile == null ? undefined : isMobile ? MOBILE_SRC : DESKTOP_SRC;
  const poster =
    isMobile == null ? undefined : isMobile ? MOBILE_POSTER : DESKTOP_POSTER;

  useEffect(() => {
    setVideoReady(false);
  }, [src]);

  // Autoplay fiable en producción: muted+playsInline no siempre alcanzan
  // (Safari / data saver). Forzamos play() cuando el elemento está listo.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !src || reduced) return;

    const tryPlay = () => {
      const p = el.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          /* Autoplay bloqueado — queda el poster visible */
        });
      }
    };

    tryPlay();
    el.addEventListener("canplay", tryPlay);
    return () => el.removeEventListener("canplay", tryPlay);
  }, [src, reduced]);

  return (
    <section className="relative isolate flex min-h-[88vh] items-center justify-center overflow-hidden bg-pimenton-dark">
      {poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          aria-hidden
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          draggable={false}
        />
      )}

      {src && !reduced && (
        <motion.video
          key={src}
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden
          onCanPlay={() => setVideoReady(true)}
          onPlaying={() => setVideoReady(true)}
          onLoadedData={() => setVideoReady(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: videoReady ? 1 : 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
      )}

      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-pimenton-dark/60"
      />

      <motion.div
        className="relative z-10 flex flex-col items-center px-6 text-center"
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduced ? 0.6 : 0.9, ease: EASE }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/logos/principal/logo-blanco.webp"
          alt="Pimentón"
          className="h-16 w-auto sm:h-24 lg:h-28"
          draggable={false}
        />
        <p className="mt-7 font-sans text-xs font-medium uppercase tracking-[0.3em] text-pimenton-accent sm:text-sm">
          {eyebrow}
        </p>
      </motion.div>
    </section>
  );
}
