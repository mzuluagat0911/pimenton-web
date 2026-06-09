"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useIsMobile } from "@/components/hooks/use-is-mobile";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Variantes del video de fondo. Mobile es 3:4 (vertical) y desktop 16:9.
const DESKTOP_SRC = "/assets/video/equipo-hero-desktop.mp4";
const MOBILE_SRC = "/assets/video/equipo-hero-mobile.mp4";

export function EquipoHero() {
  const reduced = useReducedMotion() ?? false;
  // Corte en 768px: < 768 = mobile (vertical 3:4), >= 768 = desktop (16:9).
  const isMobile = useIsMobile(768);
  const [videoReady, setVideoReady] = useState(false);

  // El `src` se resuelve SOLO en el cliente (cuando ya conocemos el
  // viewport): así mobile descarga únicamente el vertical y desktop el
  // horizontal — nunca ambos. Mientras tanto (SSR / primer render) el
  // fondo es el bg oscuro de la sección, sin descargar ningún video.
  const src =
    isMobile == null ? undefined : isMobile ? MOBILE_SRC : DESKTOP_SRC;

  // Al cruzar el breakpoint (resize / rotación) el src cambia y el <video>
  // se re-monta (key={src}); reseteamos el fade para que el nuevo entre
  // suave.
  useEffect(() => {
    setVideoReady(false);
  }, [src]);

  return (
    <section className="relative isolate flex min-h-[88vh] items-center justify-center overflow-hidden bg-pimenton-dark">
      {/* Video de fondo — sólo la variante correcta según viewport */}
      {src && (
        <motion.video
          key={src}
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden
          onCanPlay={() => setVideoReady(true)}
          onLoadedData={() => setVideoReady(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: videoReady ? 1 : 0 }}
          transition={{ duration: reduced ? 0.4 : 1, ease: EASE }}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
      )}

      {/* Overlay oscuro para legibilidad del logo */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-pimenton-dark/60"
      />

      {/* Contenido: logo Pimentón + eyebrow */}
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
          Cultura Pimentón
        </p>
      </motion.div>
    </section>
  );
}
