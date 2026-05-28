"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "motion/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

type GalleryImage = { src: string; alt: string };

const IMAGES: GalleryImage[] = [
  {
    src: "/assets/gallery/preparacion-burguer.webp",
    alt: "Preparación de hamburguesa en cocina",
  },
  {
    src: "/assets/gallery/plato-sushi.webp",
    alt: "Plato de sushi terminado",
  },
  {
    src: "/assets/gallery/repartidor-rappi.webp",
    alt: "Repartidor saliendo a entrega",
  },
  {
    src: "/assets/gallery/dashboard-analisis.webp",
    alt: "Dashboard de análisis de Pimentón",
  },
  {
    src: "/assets/gallery/preparacion-pedido-veggie.webp",
    alt: "Preparación de pedido veggie",
  },
  {
    src: "/assets/gallery/plato-burguer.webp",
    alt: "Hamburguesa gourmet emplatada",
  },
];

// Desktop grid placement for each cell. 12 cols × 4 rows; image 4
// (dashboard, index 3) is the center hero spanning the middle.
const DESKTOP_AREAS = [
  "md:[grid-area:1/1/3/4]", // 0: top-left
  "md:[grid-area:1/4/2/9]", // 1: top-middle band
  "md:[grid-area:1/9/3/13]", // 2: top-right
  "md:[grid-area:2/4/5/9]", // 3: HERO center
  "md:[grid-area:3/1/5/4]", // 4: bottom-left
  "md:[grid-area:3/9/5/13]", // 5: bottom-right
];

// End-state transforms for the scrub. Non-hero cells fly outward and
// fade; hero stays centered and scales up. Values in vw/vh so cells
// reach off-viewport regardless of their starting size.
const SCRUB_TARGETS: Array<{
  x?: string | number;
  y?: string | number;
  scale: number;
  opacity?: number;
}> = [
  { x: "-50vw", y: "-45vh", scale: 1.5, opacity: 0 }, // 0
  { x: 0, y: "-65vh", scale: 1.4, opacity: 0 }, // 1
  { x: "50vw", y: "-45vh", scale: 1.5, opacity: 0 }, // 2
  { x: 0, y: 0, scale: 1.7 }, // 3 HERO
  { x: "-50vw", y: "45vh", scale: 1.5, opacity: 0 }, // 4
  { x: "50vw", y: "45vh", scale: 1.5, opacity: 0 }, // 5
];

export function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = useReducedMotion() ?? false;

  useGSAP(
    () => {
      if (reduced) return;

      const mm = gsap.matchMedia();

      // Only run pin+scrub on desktop. Mobile gets a static bento.
      mm.add("(min-width: 768px)", () => {
        const cells = cellRefs.current.filter(
          (el): el is HTMLDivElement => el !== null,
        );
        if (cells.length !== IMAGES.length) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        cells.forEach((el, i) => {
          tl.to(el, SCRUB_TARGETS[i], 0);
        });
      });
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-pimenton-dark md:h-screen"
    >
      <div className="grid grid-cols-2 gap-3 p-6 sm:gap-4 sm:p-8 md:absolute md:inset-0 md:grid-cols-12 md:grid-rows-4 md:gap-4 md:p-8 lg:p-12">
        {IMAGES.map((img, i) => (
          <div
            key={img.src}
            ref={(el) => {
              cellRefs.current[i] = el;
            }}
            className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-pimenton-dark-surface md:aspect-auto ${DESKTOP_AREAS[i]}`}
            style={{ willChange: "transform, opacity" }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(min-width: 1024px) 40vw, (min-width: 768px) 40vw, 50vw"
              priority={i === 3}
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
