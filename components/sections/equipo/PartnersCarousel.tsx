"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useCopy } from "@/components/i18n/LanguageContext";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Loop continuo: un valor de progreso 0→1 avanza por rAF a lo largo de
// estos segundos. Mismo patrón que ClientMarquee (suave, con slowdown al
// hover, sin saltos al cambiar de velocidad).
const LOOP_SECONDS = 55;
const NORMAL_SPEED = 1;
const HOVER_SPEED = 0.2;
const SPEED_LERP = 0.08;

// Plataformas / partners del ecosistema con los que opera Pimentón.
// SVGs en /assets/logos-platforms/. Se tintan a monocromo (brightness(0))
// y se atenúan, resaltando en hover.
const PARTNER_LOGOS: ReadonlyArray<{ name: string; src: string }> = [
  { name: "Rappi", src: "/assets/logos-platforms/foodapp_rappi.svg" },
  { name: "PedidosYa", src: "/assets/logos-platforms/foodapp_pedidos-ya.svg" },
  { name: "Uber Eats", src: "/assets/logos-platforms/foodapp_uber-eats.svg" },
  { name: "Glovo", src: "/assets/logos-platforms/foodapp_glovo.svg" },
  { name: "Deliveroo", src: "/assets/logos-platforms/foodapp_deliveroo.svg" },
  { name: "DiDi Food", src: "/assets/logos-platforms/foodapp_didi-food.svg" },
  { name: "iFood", src: "/assets/logos-platforms/foodapp_ifood.svg" },
  { name: "Wolt", src: "/assets/logos-platforms/foodapp_wolt.svg" },
  { name: "Zomato", src: "/assets/logos-platforms/foodapp_zomato.svg" },
  { name: "DoorDash", src: "/assets/logos-platforms/foodapp_doordash.svg" },
  { name: "Grubhub", src: "/assets/logos-platforms/foodapp_grubhub.svg" },
  { name: "Just Eat", src: "/assets/logos-platforms/foodapp_menulog.svg" },
  { name: "Google", src: "/assets/logos-platforms/tech_google.svg" },
];

export function PartnersCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduced = useReducedMotion() ?? false;
  const { eyebrow } = useCopy().equipo.partners;

  const progress = useMotionValue(0);
  const x = useTransform(progress, [0, 1], ["0%", "-50%"]);
  const hoveredRef = useRef(false);

  useEffect(() => {
    if (reduced) return;
    let frameId = 0;
    let lastTs = performance.now();
    let currentSpeed = NORMAL_SPEED;

    const tick = (now: number) => {
      const dt = (now - lastTs) / 1000;
      lastTs = now;

      const target = hoveredRef.current ? HOVER_SPEED : NORMAL_SPEED;
      currentSpeed += (target - currentSpeed) * SPEED_LERP;

      let next = progress.get() + (dt / LOOP_SECONDS) * currentSpeed;
      if (next >= 1) next -= 1;
      progress.set(next);

      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [progress, reduced]);

  return (
    <section className="overflow-hidden bg-pimenton-bg py-20 sm:py-24">
      <motion.p
        ref={ref}
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.7, ease: EASE }}
        className="mb-10 text-center font-mono text-xs font-medium uppercase tracking-[0.22em] text-pimenton-text-muted sm:mb-14 sm:text-sm"
      >
        {eyebrow}
      </motion.p>

      <div
        className="relative"
        onMouseEnter={() => {
          hoveredRef.current = true;
        }}
        onMouseLeave={() => {
          hoveredRef.current = false;
        }}
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        }}
      >
        <motion.div
          className="flex w-max items-center gap-12 will-change-transform sm:gap-16 lg:gap-20"
          style={reduced ? undefined : { x }}
        >
          {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((logo, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${logo.src}-${i}`}
              src={logo.src}
              alt={logo.name}
              draggable={false}
              loading="lazy"
              className="h-7 w-auto shrink-0 opacity-45 transition-opacity duration-300 hover:opacity-100 sm:h-8 lg:h-9"
              style={{ filter: "brightness(0)" }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
