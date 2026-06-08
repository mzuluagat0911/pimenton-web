"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ImageTrail } from "@/components/ui/image-trail";
import { galleryImages } from "@/data/gallery";

// Texto fijo encima — mix-blend-exclusion lo mantiene legible sobre el
// fondo y las imágenes que aparecen con el cursor. pointer-events-none
// para no bloquear el seguimiento del mouse/touch.
function GalleryOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6 text-center mix-blend-exclusion">
      <h2 className="font-display text-4xl font-black leading-tight tracking-tight text-pimenton-bg md:text-6xl lg:text-8xl">
        Especialistas en delivery,
        <br />
        {/* Logo coral en lugar de la palabra "Pimentón". Altura ≈ font-size
            por breakpoint para que coincida con el tamaño del texto.
            alt="Pimentón" mantiene el nombre accesible del heading. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/logos/principal/logo-coral.webp"
          alt="Pimentón"
          className="mt-2 inline-block h-9 w-auto align-middle md:mt-3 md:h-16 lg:mt-4 lg:h-24"
          draggable={false}
        />
      </h2>
    </div>
  );
}

// Fallback para prefers-reduced-motion: grid estático de las 6 imágenes,
// sin el efecto de trail (que es puramente de movimiento).
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.src}
            alt={img.alt}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Cierre del Home (pre-footer, después del form). Sección a pantalla
 * completa: al mover el cursor/dedo, las fotos de Pimentón van dejando
 * un "trail" detrás del título.
 *
 * El trail sólo se monta cuando la sección está en viewport (useInView)
 * para no spawnear items mientras el usuario está en otras secciones.
 *
 * prefers-reduced-motion: grid estático de las 6 imágenes (sin trail).
 */
export function GallerySpecialists() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const inView = useInView(ref, { amount: 0.3 });

  return (
    <section className="relative h-screen w-full overflow-hidden bg-pimenton-dark">
      {/* Capa del trail / grid estático */}
      <div ref={ref} className="absolute inset-0 z-0">
        {reduced ? (
          <StaticGalleryGrid />
        ) : (
          inView && (
            <ImageTrail containerRef={ref} interval={60} rotationRange={18}>
              {galleryImages.map((img) => (
                <div
                  key={img.src}
                  className="relative h-28 w-40 overflow-hidden rounded-xl shadow-2xl sm:h-36 sm:w-52"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable={false}
                  />
                </div>
              ))}
            </ImageTrail>
          )
        )}
      </div>

      <GalleryOverlay />
    </section>
  );
}
