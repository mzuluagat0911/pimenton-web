"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { copy } from "@/data/copy";
import { locations, type Location } from "@/data/locations";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function MapPin({
  location,
  index,
  inView,
  active,
  reduced,
  onPointerEnter,
  onPointerLeave,
  onClick,
}: {
  location: Location;
  index: number;
  inView: boolean;
  active: boolean;
  reduced: boolean;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  onClick: () => void;
}) {
  return (
    <div
      className="absolute"
      style={{
        left: `${location.x}%`,
        top: `${location.y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: active ? 30 : 10,
      }}
      data-pin
    >
      {/* Radar pulse — sits behind the pin, expands+fades on a loop */}
      {!reduced && (
        <motion.span
          aria-hidden
          className="absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pimenton-accent sm:size-9"
          animate={{ scale: [1, 2.4], opacity: [0.45, 0] }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: "easeOut",
            delay: 0.3 + index * 0.25,
          }}
        />
      )}

      <motion.button
        type="button"
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onClick={onClick}
        aria-label={`${location.country}, ${location.restaurants} restaurantes`}
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0, y: -18 }}
        animate={
          inView
            ? reduced
              ? { opacity: 1 }
              : { opacity: 1, scale: active ? 1.18 : 1, y: 0 }
            : reduced
              ? { opacity: 0 }
              : { opacity: 0, scale: 0, y: -18 }
        }
        transition={{
          delay: reduced ? 0 : 0.2 + index * 0.12,
          duration: 0.55,
          ease: [0.34, 1.56, 0.64, 1], // small overshoot for the "pop"
          scale: { duration: 0.2, ease: "easeOut" },
        }}
        className="relative flex size-7 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-pimenton-accent-deep bg-pimenton-yellow shadow-[0_4px_10px_-2px_rgba(193,52,32,0.4)] outline-none focus-visible:ring-2 focus-visible:ring-pimenton-accent focus-visible:ring-offset-2 focus-visible:ring-offset-pimenton-bg sm:size-9"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/logos/isologo/isologo-crema.svg"
          alt=""
          aria-hidden
          className="h-full w-full object-contain"
          draggable={false}
        />
      </motion.button>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-3 -translate-x-1/2 whitespace-nowrap rounded-md bg-pimenton-dark px-3 py-2 text-center shadow-lg"
          >
            <p className="text-xs font-semibold text-pimenton-text-on-dark sm:text-sm">
              {location.country}
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-pimenton-text-on-dark-muted sm:text-xs">
              {location.restaurants} restaurantes
            </p>
            <span
              aria-hidden
              className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-pimenton-dark"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function WhereWeOperate() {
  const { heading, subheading } = copy.whereWeOperate;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduced = useReducedMotion() ?? false;

  // Two state sources: hover (transient) and click (sticky). Either one
  // shows the tooltip. Sticky is what makes tap-to-show work on touch
  // where pointerLeave fires immediately after pointerEnter.
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [stickyId, setStickyId] = useState<string | null>(null);
  const activeId = hoveredId ?? stickyId;

  // Stagger entry by restaurant count desc so the biggest markets pop first
  const orderedLocations = useMemo(
    () => [...locations].sort((a, b) => b.restaurants - a.restaurants),
    [],
  );

  // Tap-outside-to-dismiss on touch devices
  useEffect(() => {
    if (!stickyId) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest("[data-pin]")) {
        setStickyId(null);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [stickyId]);

  return (
    <section
      ref={ref}
      className="bg-pimenton-bg px-[5%] sm:px-16 lg:px-24 pt-12 pb-24 sm:pt-16 sm:pb-32"
    >
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={
            inView
              ? { opacity: 1, y: 0 }
              : reduced
                ? { opacity: 0 }
                : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.8, ease: EASE }}
          className="max-w-3xl text-3xl font-semibold leading-[1.05] tracking-tight text-pimenton-text sm:text-4xl"
        >
          {heading}
        </motion.h2>
        <motion.p
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={
            inView
              ? { opacity: 1, y: 0 }
              : reduced
                ? { opacity: 0 }
                : { opacity: 0, y: 16 }
          }
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-pimenton-text-muted"
        >
          {subheading}
        </motion.p>

        <div
          className="relative mx-auto mt-12 w-full max-w-5xl sm:mt-16"
          style={{ aspectRatio: "1010 / 666" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/map/worldmap.svg"
            alt=""
            className="absolute inset-0 h-full w-full select-none"
            draggable={false}
          />
          {orderedLocations.map((loc, i) => (
            <MapPin
              key={loc.id}
              location={loc}
              index={i}
              inView={inView}
              active={activeId === loc.id}
              reduced={reduced}
              onPointerEnter={() => setHoveredId(loc.id)}
              onPointerLeave={() =>
                setHoveredId((prev) => (prev === loc.id ? null : prev))
              }
              onClick={() =>
                setStickyId((prev) => (prev === loc.id ? null : loc.id))
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
