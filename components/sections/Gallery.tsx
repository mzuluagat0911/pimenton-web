"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ImageIcon } from "lucide-react";
import { copy } from "@/data/copy";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type GalleryImage = (typeof copy.gallery.images)[number];

// Hardcoded bento layout. Six slots with mixed col/row spans for the
// desktop bento; each carries its own subtle parallax intensity so the
// composition feels layered as the section scrolls past. Intensities
// alternate sign so cells drift in opposite directions — gives depth.
const SLOTS: Array<{ className: string; parallax: number }> = [
  {
    // A — large feature, top-left, 2 rows tall
    className:
      "sm:col-span-2 lg:col-span-7 lg:row-span-2 aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto",
    parallax: -50,
  },
  {
    // B — wide medium, top-right
    className:
      "lg:col-span-5 lg:row-span-1 aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto",
    parallax: 30,
  },
  {
    // C — wide medium, sits below B
    className:
      "lg:col-span-5 lg:row-span-1 aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto",
    parallax: -25,
  },
  {
    // D — bottom-left, 4 cols
    className:
      "lg:col-span-4 lg:row-span-1 aspect-[4/3] sm:aspect-[3/2] lg:aspect-auto",
    parallax: 35,
  },
  {
    // E — bottom-middle, 4 cols
    className:
      "lg:col-span-4 lg:row-span-1 aspect-[4/3] sm:aspect-[3/2] lg:aspect-auto",
    parallax: -35,
  },
  {
    // F — bottom-right, 4 cols
    className:
      "lg:col-span-4 lg:row-span-1 aspect-[4/3] sm:aspect-[3/2] lg:aspect-auto",
    parallax: 45,
  },
];

function Placeholder({ idx, alt }: { idx: number; alt: string }) {
  const num = String(idx + 1).padStart(2, "0");
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-pimenton-bg-soft p-6">
      <ImageIcon
        aria-hidden
        className="size-8 text-pimenton-text-muted/40"
        strokeWidth={1.5}
      />
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-pimenton-text-muted/60">
        Imagen {num}
      </span>
      <span className="max-w-[28ch] text-center text-xs leading-relaxed text-pimenton-text-muted/50">
        {alt}
      </span>
    </div>
  );
}

function GalleryCell({
  image,
  idx,
  scrollYProgress,
  reduced,
}: {
  image: GalleryImage;
  idx: number;
  scrollYProgress: MotionValue<number>;
  reduced: boolean;
}) {
  const slot = SLOTS[idx];
  const inViewRef = useRef<HTMLDivElement>(null);
  const inView = useInView(inViewRef, { once: true, amount: 0.2 });

  // Each cell's own y motion value, derived from the shared scroll
  // progress so we only register one scroll listener for the whole
  // section. Reduced motion collapses parallax to 0.
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [0, slot.parallax],
  );

  return (
    <motion.div
      ref={inViewRef}
      className={`group relative overflow-hidden rounded-2xl border border-pimenton-border bg-pimenton-bg-soft transition-shadow duration-500 hover:shadow-[0_20px_50px_-24px_rgba(15,15,14,0.18)] ${slot.className}`}
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
      animate={
        inView
          ? { opacity: 1, scale: 1 }
          : reduced
            ? { opacity: 0 }
            : { opacity: 0, scale: 1.05 }
      }
      transition={{ duration: 0.8, ease: EASE }}
      style={reduced ? undefined : { y }}
    >
      {image.src ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
          className={`object-cover transition-transform duration-700 ${
            reduced ? "" : "group-hover:scale-[1.04]"
          }`}
        />
      ) : (
        <Placeholder idx={idx} alt={image.alt} />
      )}
    </motion.div>
  );
}

export function Gallery() {
  const { images } = copy.gallery;
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;

  // Single useScroll for the whole section — each cell derives its
  // own y motion value from this shared progress.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={sectionRef}
      className="bg-pimenton-bg px-8 sm:px-16 lg:px-24 py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-12 lg:auto-rows-[220px] lg:gap-6">
          {images.map((image, i) => (
            <GalleryCell
              key={i}
              image={image}
              idx={i}
              scrollYProgress={scrollYProgress}
              reduced={reduced}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
