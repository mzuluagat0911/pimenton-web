"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { galleryImages } from "@/data/gallery";

// Slab oscuro mientras carga el chunk de three.js — llena el contenedor
// sticky para no generar layout shift.
function GalleryFallback() {
  return <div className="h-full w-full bg-pimenton-dark" aria-hidden />;
}

// three.js NO funciona en SSR (WebGL/canvas). dynamic + ssr:false lo carga
// sólo en cliente y lo code-splittea en su propio chunk: el bundle inicial
// del Home no incluye three.js.
const InfiniteGallery = dynamic(
  () => import("@/components/ui/3d-gallery-photography"),
  { ssr: false, loading: () => <GalleryFallback /> },
);

// Texto fijo encima — mix-blend-exclusion lo mantiene legible sobre
// cualquier imagen. pointer-events-none para no bloquear la galería.
function GalleryOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center mix-blend-exclusion">
      <h2 className="font-display text-4xl font-black leading-tight tracking-tight text-pimenton-bg md:text-6xl lg:text-8xl">
        Especialistas en delivery,
        <br />
        <span className="text-pimenton-accent">Pimentón.</span>
      </h2>
    </div>
  );
}

// Fallback estático para prefers-reduced-motion: grid 3×2 (desktop) /
// 2×3 (mobile), fade simple, sin 3D ni scrub.
function StaticGalleryGrid() {
  return (
    <div className="grid h-full w-full grid-cols-2 grid-rows-3 gap-1 sm:grid-cols-3 sm:grid-rows-2">
      {galleryImages.map((img, i) => (
        <motion.div
          key={img.src}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.08 }}
          className="relative overflow-hidden"
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Sección 3D Gallery cinemática y FINITA.
 *
 * En vez de capturar el wheel (lo que la hacía infinita y chocaba con
 * Lenis), la sección se PINNEA: un spacer alto crea un tramo de scroll
 * acotado, un hijo sticky queda fijo a pantalla completa, y el progreso
 * del scroll (useScroll 0→1) maneja el "vuelo" por las imágenes. Cuando
 * se consume el spacer, el pin se libera y el scroll sigue al footer.
 *
 * Como no se captura wheel, no hay conflicto con Lenis: no hace falta
 * stop()/start(). El scroll de la página nunca queda atrapado.
 *
 * Lazy mount: la galería WebGL se monta la primera vez que la sección
 * entra en viewport y queda montada (no vale re-instanciar three.js).
 *
 * prefers-reduced-motion: grid estático de 1 pantalla, sin pin ni scrub.
 *
 * Tunables: SPACER_VH (cuánto scroll dura) acá, y SCROLL_LOOPS (cuánto
 * vuela la galería por ese scroll) en el componente 3D.
 */
const SPACER_VH = 250;

export function GallerySpecialists() {
  const reduced = useReducedMotion() ?? false;
  const spacerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(spacerRef, { amount: 0.1 });
  const [hasMounted, setHasMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Progreso del scroll por el spacer (0 al entrar pin → 1 al soltarlo).
  // Se escribe en un ref plano que el componente 3D lee en su useFrame.
  const progressRef = useRef(0);
  const { scrollYProgress } = useScroll({
    target: spacerRef,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
  });

  // Latch: montar la galería la primera vez que entra en viewport.
  useEffect(() => {
    if (inView) setHasMounted(true);
  }, [inView]);

  // Breakpoint mobile < 768px → variante liviana (menos planos).
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Reduced motion: una sola pantalla con grid estático, sin pin.
  if (reduced) {
    return (
      <section className="relative h-screen w-full overflow-hidden bg-pimenton-dark">
        <div className="absolute inset-0">
          <StaticGalleryGrid />
        </div>
        <GalleryOverlay />
      </section>
    );
  }

  return (
    <section className="relative bg-pimenton-dark">
      <div ref={spacerRef} className="relative" style={{ height: `${SPACER_VH}vh` }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <div className="absolute inset-0">
            {hasMounted ? (
              isMobile ? (
                <InfiniteGallery
                  images={galleryImages}
                  visibleCount={6}
                  progressRef={progressRef}
                  className="h-full w-full"
                />
              ) : (
                <InfiniteGallery
                  images={galleryImages}
                  visibleCount={12}
                  progressRef={progressRef}
                  className="h-full w-full"
                />
              )
            ) : (
              <GalleryFallback />
            )}
          </div>
          <GalleryOverlay />
        </div>
      </div>
    </section>
  );
}
