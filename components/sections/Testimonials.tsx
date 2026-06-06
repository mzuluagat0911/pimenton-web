"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { Star } from "lucide-react";
import { copy } from "@/data/copy";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const ENTRY_SPRING = {
  type: "spring" as const,
  stiffness: 80,
  damping: 14,
  mass: 0.7,
};
const TILT_SPRING = { stiffness: 220, damping: 22 };
const TILT_MAX_DEG = 5;

type TestimonialItem = (typeof copy.testimonials.items)[number];

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Hook: 3D tilt following the cursor position over the card. Returns
 * motion values for rotateX/Y and the handlers to wire into the
 * card. Disabled under reduced motion.
 */
function useCardTilt(disabled: boolean) {
  const ref = useRef<HTMLElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, TILT_SPRING);
  const springY = useSpring(rotateY, TILT_SPRING);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * -TILT_MAX_DEG * 2);
    rotateX.set(py * TILT_MAX_DEG * 2);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return { ref, springX, springY, handleMouseMove, handleMouseLeave };
}

function StarRow() {
  return (
    <div aria-label="5 estrellas" className="flex gap-1 text-pimenton-accent">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="size-4 fill-current" strokeWidth={0} />
      ))}
    </div>
  );
}

function PortraitAvatar({ name }: { name: string }) {
  // DiceBear "notionists" — illustrated portraits, deterministic per seed.
  // Loaded as a plain <img> (external SVG, no Next config needed). Falls
  // back to initials via onError if the request fails.
  const seed = encodeURIComponent(name);
  const url = `https://api.dicebear.com/9.x/notionists/svg?seed=${seed}&backgroundColor=ffe0d7,ffd9cf,ffcec1`;
  return (
    <div className="flex size-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-pimenton-accent/30 bg-pimenton-accent/15 font-mono text-xs font-semibold tracking-wide text-pimenton-accent">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt=""
        aria-hidden
        className="h-full w-full object-cover"
        draggable={false}
        onError={(e) => {
          // Fallback to initials if DiceBear is unreachable
          const target = e.currentTarget;
          target.style.display = "none";
          if (target.nextSibling) return;
          const span = document.createElement("span");
          span.textContent = getInitials(name);
          target.parentElement?.appendChild(span);
        }}
      />
    </div>
  );
}

function IntroCard({
  brand,
  heading,
  subheading,
  inView,
  reduced,
  rotateZStart,
}: {
  brand: string;
  heading: string;
  subheading: string;
  inView: boolean;
  reduced: boolean;
  rotateZStart: number;
}) {
  const tilt = useCardTilt(reduced);
  return (
    <motion.article
      ref={tilt.ref}
      initial={
        reduced
          ? { opacity: 0 }
          : { opacity: 0, y: 70, rotate: rotateZStart, scale: 0.94 }
      }
      animate={
        inView
          ? { opacity: 1, y: 0, rotate: 0, scale: 1 }
          : reduced
            ? { opacity: 0 }
            : { opacity: 0, y: 70, rotate: rotateZStart, scale: 0.94 }
      }
      transition={reduced ? { duration: 0.4 } : ENTRY_SPRING}
      style={
        reduced
          ? undefined
          : {
              rotateX: tilt.springY,
              rotateY: tilt.springX,
              transformPerspective: 1000,
            }
      }
      onMouseMove={tilt.handleMouseMove}
      onMouseLeave={tilt.handleMouseLeave}
      className="relative flex h-full flex-col justify-between rounded-2xl border border-pimenton-border bg-pimenton-surface p-7 sm:p-8"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute right-7 top-7 block size-3 border-r border-t border-pimenton-accent sm:right-8 sm:top-8"
      />

      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/logos/principal/logo-coral.webp"
          alt={brand}
          className="h-7 w-auto sm:h-8"
          draggable={false}
        />
        <h2 className="mt-10 text-3xl font-semibold leading-[1.05] tracking-tight text-pimenton-text sm:text-4xl">
          {heading}
        </h2>
      </div>

      <p className="mt-12 text-sm leading-relaxed text-pimenton-text-muted sm:text-base">
        {subheading}
      </p>
    </motion.article>
  );
}

function TestimonialCard({
  item,
  index,
  inView,
  reduced,
  rotateZStart,
}: {
  item: TestimonialItem;
  index: number;
  inView: boolean;
  reduced: boolean;
  rotateZStart: number;
}) {
  const tilt = useCardTilt(reduced);
  return (
    <motion.article
      ref={tilt.ref}
      initial={
        reduced
          ? { opacity: 0 }
          : { opacity: 0, y: 70, rotate: rotateZStart, scale: 0.94 }
      }
      animate={
        inView
          ? { opacity: 1, y: 0, rotate: 0, scale: 1 }
          : reduced
            ? { opacity: 0 }
            : { opacity: 0, y: 70, rotate: rotateZStart, scale: 0.94 }
      }
      transition={
        reduced
          ? { duration: 0.4 }
          : { ...ENTRY_SPRING, delay: (index + 1) * 0.12 }
      }
      style={
        reduced
          ? undefined
          : {
              rotateX: tilt.springY,
              rotateY: tilt.springX,
              transformPerspective: 1000,
            }
      }
      onMouseMove={tilt.handleMouseMove}
      onMouseLeave={tilt.handleMouseLeave}
      className="relative flex h-full flex-col rounded-2xl border border-pimenton-border bg-pimenton-surface p-7 transition-shadow duration-300 hover:shadow-[0_22px_44px_-22px_rgba(15,15,14,0.22)] sm:p-8"
    >
      <StarRow />

      <p className="mt-6 text-base leading-relaxed text-pimenton-text-soft">
        {item.quote}
      </p>

      <div className="mt-auto pt-10">
        <div className="space-y-5">
          {item.metrics.map((m) => (
            <div key={m.label}>
              <p className="font-display text-3xl font-semibold tracking-tight text-pimenton-accent sm:text-4xl">
                {m.value}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-pimenton-text-muted sm:text-sm">
                {m.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3 border-t border-pimenton-border pt-5">
          <PortraitAvatar name={item.name} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-pimenton-text">
              {item.name}
            </p>
            <p className="truncate text-xs text-pimenton-text-muted sm:text-sm">
              {item.role}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function Testimonials() {
  const { intro, items } = copy.testimonials;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const reduced = useReducedMotion() ?? false;

  // Alternating rotation start angles for the "deck deal" entry — cards
  // arrive from slightly different tilts and settle to 0.
  const rotations = [-2.5, 2, -1.8, 2.2];

  return (
    <section
      ref={ref}
      id="testimonios"
      className="scroll-mt-24 bg-pimenton-bg px-8 sm:px-16 lg:px-24 py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          style={{ perspective: 1200 }}
        >
          <IntroCard
            brand={intro.brand}
            heading={intro.heading}
            subheading={intro.subheading}
            inView={inView}
            reduced={reduced}
            rotateZStart={rotations[0]}
          />
          {items.map((item, i) => (
            <TestimonialCard
              key={item.name}
              item={item}
              index={i}
              inView={inView}
              reduced={reduced}
              rotateZStart={rotations[i + 1] ?? 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
