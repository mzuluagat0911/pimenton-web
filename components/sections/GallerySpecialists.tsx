"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { galleryImages } from "@/data/gallery";

// Slab oscuro mientras carga el chunk de three.js — misma altura que la
// sección para no generar layout shift.
function GalleryFallback() {
  return <div className="h-screen w-full bg-pimenton-dark" aria-hidden />;
}

// three.js NO funciona en SSR (usa WebGL/canvas). dynamic + ssr:false lo
// carga sólo en cliente y lo code-splittea en su propio chunk: el bundle
// inicial del Home no incluye three.js.
const InfiniteGallery = dynamic(
  () => import("@/components/ui/3d-gallery-photography"),
  { ssr: false, loading: () => <GalleryFallback /> },
);

/**
 * Fallback estático para prefers-reduced-motion: grid 3×2 (desktop) /
 * 2×3 (mobile) de las 6 imágenes, fade simple sin 3D ni animación de
 * scroll. Cubre toda la sección.
 */
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
 * Sección 3D Gallery cinemática (h-screen). La galería WebGL vive de
 * fondo; el texto va encima con mix-blend-exclusion (legible sobre
 * cualquier imagen).
 *
 * Lazy mount: la galería 3D sólo se monta cuando la sección entra en
 * viewport (IntersectionObserver) y, una vez montada, se queda — no
 * vale la pena re-instanciar three.js al salir.
 *
 * Conflicto con Lenis: el componente captura wheel (preventDefault) para
 * navegar entre imágenes. Mientras la sección está activa (≥50% visible)
 * pausamos Lenis con lenis.stop() para que no choque el smooth-scroll
 * global con la navegación de la galería; al salir, lenis.start().
 * Mismo patrón que el modal del Control Room.
 */
export function GallerySpecialists() {
  const reduced = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Breakpoint: mobile < 768px. Monta la variante liviana de la galería.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Lazy mount + pausa/reanuda de Lenis. Bajo reduced-motion no hay
  // galería WebGL (mostramos el grid estático) ni Lenis instanciado, así
  // que salteamos el observer entero.
  useEffect(() => {
    if (reduced) return;
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        // Latch: montar la galería la primera vez que entra (cualquier
        // ratio > 0) y dejarla montada.
        if (entry.isIntersecting) setHasMounted(true);
        // Activa cuando ≥50% visible → pausar Lenis para que el wheel
        // lo capture la galería y no el scroll de la página.
        const active = entry.intersectionRatio >= 0.5;
        const lenis = window.__lenis;
        if (active) lenis?.stop();
        else lenis?.start();
      },
      { threshold: [0, 0.5] },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      // Salvaguarda: si desmontamos con la sección activa, reanudar Lenis
      // para no dejar el scroll del Home congelado.
      window.__lenis?.start();
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-pimenton-dark"
    >
      {/* Galería 3D fullscreen como background (o grid estático bajo
          reduced-motion). */}
      <div className="absolute inset-0">
        {reduced ? (
          <StaticGalleryGrid />
        ) : hasMounted ? (
          isMobile ? (
            <InfiniteGallery
              images={galleryImages}
              speed={0.9}
              zSpacing={2.5}
              visibleCount={6}
              falloff={{ near: 0.6, far: 10 }}
              className="h-screen w-full"
            />
          ) : (
            <InfiniteGallery
              images={galleryImages}
              speed={1.2}
              zSpacing={3}
              visibleCount={12}
              falloff={{ near: 0.8, far: 14 }}
              className="h-screen w-full"
            />
          )
        ) : (
          <GalleryFallback />
        )}
      </div>

      {/* Texto fijo encima — mix-blend-exclusion lo mantiene legible
          sobre cualquier imagen. pointer-events-none para no bloquear la
          interacción con la galería. */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center mix-blend-exclusion">
        <h2 className="font-display text-4xl font-black leading-tight tracking-tight text-pimenton-bg md:text-6xl lg:text-8xl">
          Especialistas en delivery,
          <br />
          <span className="text-pimenton-accent">Pimentón.</span>
        </h2>
      </div>

      {/* Hint de navegación abajo — sólo con la galería interactiva. */}
      {!reduced && (
        <div className="pointer-events-none absolute bottom-8 left-0 right-0 px-4 text-center font-mono text-[11px] font-semibold uppercase text-pimenton-bg mix-blend-exclusion">
          <p>Usá el scroll, las flechas o desliza para navegar</p>
          <p className="mt-1 opacity-60">
            El auto-play se reanuda tras 3s de inactividad
          </p>
        </div>
      )}
    </section>
  );
}
