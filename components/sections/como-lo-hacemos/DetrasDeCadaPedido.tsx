"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { splitHighlight } from "@/components/ui-custom/Highlight";
import { EASE } from "@/components/sections/servicios/Eyebrow";
import { CtaPill } from "@/components/ui-custom/CtaPill";
import { ControlRoomAutonomous } from "@/components/sections/control-room/Autonomous";

const COL3_LOGOS = [
  "foodapp_rappi",
  "foodapp_pedidos-ya",
  "foodapp_uber-eats",
  "foodapp_glovo",
  "foodapp_deliveroo",
  "tool_delivery-hero",
];

// ── Count-up sutil para los números del dashboard ──
function CountUp({
  value,
  prefix = "",
  inView,
  reduced,
}: {
  value: number;
  prefix?: string;
  inView: boolean;
  reduced: boolean;
}) {
  const mv = useMotionValue(reduced ? value : 0);
  const text = useTransform(
    mv,
    (v) => prefix + Math.round(v).toLocaleString("es-ES"),
  );
  useEffect(() => {
    if (reduced) {
      mv.set(value);
      return;
    }
    if (!inView) return;
    const controls = animate(mv, value, { duration: 1.4, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, reduced, value, mv]);
  return <motion.span>{text}</motion.span>;
}

// ── Col 1: mockup dashboard (panel dark + panel claro) ──
function MockDashboard({ inView, reduced }: { inView: boolean; reduced: boolean }) {
  return (
    <div className="w-full space-y-3">
      {/* Panel órdenes (dark) */}
      <div className="rounded-xl border border-pimenton-dark-border bg-pimenton-dark p-3.5">
        <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-pimenton-text-on-dark-muted">
          Órdenes 2025
        </p>
        <div className="mt-1.5 flex items-end justify-between gap-3">
          <span className="font-display text-2xl font-bold tabular-nums text-pimenton-accent">
            <CountUp value={12850} inView={inView} reduced={reduced} />
          </span>
          <svg
            width="64"
            height="26"
            viewBox="0 0 64 26"
            fill="none"
            aria-hidden
            className="text-pimenton-accent"
          >
            <path
              d="M1 24 L13 17 L25 19 L37 9 L49 11 L63 2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      {/* Panel facturación (claro) */}
      <div className="rounded-xl bg-pimenton-bg p-3.5">
        <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-pimenton-text-muted">
          Facturación
        </p>
        <div className="mt-1.5 flex items-end justify-between gap-3">
          <span className="font-display text-2xl font-bold tabular-nums text-pimenton-text">
            <CountUp value={323000} prefix="$" inView={inView} reduced={reduced} />
          </span>
          <div className="flex h-6 items-end gap-1">
            {[10, 16, 12, 20, 18].map((h, i) => (
              <span
                key={i}
                className="w-1.5 rounded-sm bg-pimenton-accent"
                style={{ height: h }}
              />
            ))}
          </div>
        </div>
        <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.16em] text-pimenton-text-muted">
          16.150 pedidos · 10.77 ROI
        </p>
      </div>
    </div>
  );
}

// ── Col 2: mockup nota de iPhone ──
function MockNota() {
  return (
    <div className="mx-auto w-full max-w-[190px] rounded-[1.75rem] border-2 border-pimenton-dark-border bg-pimenton-bg p-3.5 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.6)]">
      <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-pimenton-text/20" />
      <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-pimenton-text-muted">
        Parte diario · 24/05
      </p>
      <ul className="mt-3 space-y-2 text-xs leading-snug text-pimenton-text">
        <li>
          <span className="font-semibold text-pimenton-accent">+18%</span>{" "}
          conversión vs ayer
        </li>
        <li>Menú optimizado en 3 plataformas</li>
        <li>
          Campaña Rappi:{" "}
          <span className="font-semibold text-pimenton-accent">+$4.2k</span> en
          24h
        </li>
      </ul>
    </div>
  );
}

// ── Col 3: grid de logos de food apps ──
function MockLogos() {
  return (
    <div className="grid w-full grid-cols-3 gap-x-4 gap-y-6">
      {COL3_LOGOS.map((name) => (
        <div key={name} className="flex h-9 items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/assets/logos-platforms/${name}.svg`}
            alt=""
            aria-hidden
            draggable={false}
            className="max-h-[60%] max-w-[82%] object-contain opacity-90"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </div>
      ))}
    </div>
  );
}

// ── Col 4: tarjeta de perfil Growth Manager ──
function MockPerfil({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-pimenton-accent/15 ring-1 ring-pimenton-accent/30">
        <span className="font-display text-2xl font-bold text-pimenton-accent">
          MA
        </span>
      </div>
      <p className="mt-4 text-sm font-bold uppercase tracking-wide text-pimenton-text-on-dark">
        Martina Álvarez
      </p>
      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-pimenton-text-on-dark-muted">
        Growth Manager · Argentina
      </p>
      <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-pimenton-dark px-2.5 py-1 text-[10px] font-medium text-pimenton-text-on-dark-muted">
        <motion.span
          aria-hidden
          className="inline-block size-1.5 rounded-full bg-pimenton-accent"
          animate={reduced ? undefined : { opacity: [1, 0.3, 1] }}
          transition={
            reduced
              ? undefined
              : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
          }
        />
        En línea
      </span>
    </div>
  );
}

function Card({
  children,
  title,
  desc,
  index,
  tilt = false,
  reduced,
}: {
  children: React.ReactNode;
  title: string;
  desc: string;
  index: number;
  tilt?: boolean;
  reduced: boolean;
}) {
  return (
    <motion.article
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: reduced ? 0 : index * 0.12,
        ease: EASE,
      }}
      whileHover={
        reduced
          ? undefined
          : tilt
            ? { scale: 1.02, rotateY: 4, rotateX: -3 }
            : { scale: 1.02 }
      }
      style={tilt && !reduced ? { transformStyle: "preserve-3d" } : undefined}
      className="group flex flex-col rounded-2xl border border-pimenton-dark-border bg-pimenton-dark-soft p-6 transition-colors duration-300 hover:border-pimenton-accent/40 sm:p-7"
    >
      <div className="flex min-h-[208px] flex-1 items-center justify-center">
        {children}
      </div>
      <h3 className="mt-6 text-xl font-semibold uppercase tracking-tight text-pimenton-text-on-dark sm:text-2xl">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-pimenton-text-on-dark-muted">
        {desc}
      </p>
    </motion.article>
  );
}

export function DetrasDeCadaPedido() {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="bg-pimenton-dark py-24 sm:py-32">
      {/* px en el wrapper externo (no en el max-w-7xl), igual que el Control
          Room: así el contenido llega al ancho completo de max-w-7xl y ambos
          bloques coinciden en ancho. */}
      <div className="px-[5%] sm:px-16 lg:px-24">
        <div className="mx-auto w-full max-w-7xl">
          {/* Header */}
          <div className="max-w-3xl">
          <motion.h2
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="text-3xl font-semibold leading-[1.05] tracking-tight text-pimenton-text-on-dark sm:text-4xl"
          >
            {splitHighlight(
              "Detrás de cada pedido, hay una decisión.",
              "decisión.",
              "coral",
            )}
          </motion.h2>
        </div>

        {/* Grid de 4 columnas */}
        <div
          className="mt-14 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4"
          style={{ perspective: 1000 }}
        >
          <Card
            title="Ves todos los datos en el mismo lugar"
            desc="Ventas, margen, ticket y promos. Decidimos con datos reales."
            index={0}
            tilt
            reduced={reduced}
          >
            <MockDashboard inView={inView} reduced={reduced} />
          </Card>
          <Card
            title="Nos metemos en la operación"
            desc="Operamos el canal todos los días, de punta a punta."
            index={1}
            tilt
            reduced={reduced}
          >
            <MockNota />
          </Card>
          <Card
            title="Somos expertos en APPs de Delivery"
            desc="Gestionamos el canal como si fuera nuestro."
            index={2}
            reduced={reduced}
          >
            <MockLogos />
          </Card>
          <Card
            title="Contarás con un equipo de Growth a cargo"
            desc="Un especialista de tu región, dedicado a tu negocio."
            index={3}
            reduced={reduced}
          >
            <MockPerfil reduced={reduced} />
          </Card>
          </div>
        </div>
      </div>

      {/* Control Room — variante A (video constante): los anillos rotan solos
          en loop. Va entre las 4 cards y el CTA. Renderiza full-width con su
          propio px/max-w-7xl, así alinea con el header, el grid y el CTA. */}
      <ControlRoomAutonomous />

      {/* CTA final — pill coral (mismo estilo que el resto de la web), al
          Contacto, sin icono. */}
      <div className="px-[5%] sm:px-16 lg:px-24">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex justify-center">
            <CtaPill href="/contacto" label="Hablemos" />
          </div>
        </div>
      </div>
    </section>
  );
}
