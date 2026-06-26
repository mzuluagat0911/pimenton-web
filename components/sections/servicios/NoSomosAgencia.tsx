"use client";

import { motion, useReducedMotion } from "motion/react";
import { Highlight } from "@/components/ui-custom/Highlight";
import { useT } from "@/components/i18n/LanguageContext";
import { EASE } from "./Eyebrow";
import { OrdenesChart } from "./OrdenesChart";

const VANITY = ["Engagement", "Synergy", "ROI", "Branding"];

// Alturas (%) de las barras del "gráfico" gris del slide — genéricas,
// planas, sin vida (contrastan con la línea coral viva de la derecha).
const AGENCY_BARS = [48, 66, 40, 72, 54, 82, 60];

// Altura fija de los visuales en desktop para que ambas columnas y sus
// labels alineen. En mobile, alto natural.
const VISUAL_H = "h-auto md:h-[460px]";

// Composición ilustrativa de "agencia tradicional": una PILA de slides
// que nunca termina (deck interminable), monocromática y sin vida — el
// slide del frente trae un gráfico de barras gris, bullets y jerga vacía,
// con su número de slide ("23/64") gritando "esto sigue y sigue".
// Contrasta con el dashboard en vivo (coral) de la derecha.
function AgencyDeck() {
  const t = useT();
  return (
    // overflow-hidden + slides 100% dentro del contenedor → nada se sale
    // hacia la derecha (sin overflow horizontal en mobile). La pila asoma
    // porque el slide del frente lleva margen arriba/derecha (mt/mr).
    <div aria-hidden className={`relative overflow-hidden ${VISUAL_H}`}>
      {/* Slides de atrás — asoman escalonados arriba-derecha, dentro del
          contenedor: el más al fondo pegado al borde sup-der, el del medio
          a 8px. */}
      <div className="absolute bottom-4 left-4 right-0 top-0 rounded-2xl border border-pimenton-border bg-pimenton-bg-soft" />
      <div className="absolute bottom-2 left-2 right-2 top-2 rounded-2xl border border-pimenton-border bg-pimenton-bg-soft" />

      {/* Slide del frente — el contenido "aburrido". El mt/mr deja ver la pila. */}
      <div className="relative mr-4 mt-4 flex flex-col rounded-2xl border border-pimenton-border bg-pimenton-bg-soft p-6 sm:p-7 md:h-[calc(100%-1rem)]">
        {/* Header del reporte + número de slide */}
        <div className="flex items-start justify-between border-b border-pimenton-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="size-6 flex-shrink-0 rounded bg-pimenton-text/12" />
            <div>
              <p className="text-[13px] font-medium text-pimenton-text-muted">
                {t({ es: "Reporte mensual", en: "Monthly report" })}
              </p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-pimenton-text-subtle">
                {t({ es: "Resumen ejecutivo · Q3", en: "Executive summary · Q3" })}
              </p>
            </div>
          </div>
          <span className="flex-shrink-0 rounded border border-pimenton-border px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-pimenton-text-subtle">
            Slide 23/64
          </span>
        </div>

        {/* "Gráfico" de barras gris — plano, sin color. Alto fijo por
            breakpoint (definido, para que las barras en % resuelvan bien). */}
        <div className="mt-6 flex h-36 items-end gap-2 border-b border-pimenton-text/10 md:h-[200px]">
          {AGENCY_BARS.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm bg-pimenton-text/15"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>

        {/* Bullets fake */}
        <div className="mt-5 space-y-2.5">
          {["w-full", "w-4/5", "w-3/5"].map((w, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span className="size-1.5 flex-shrink-0 rounded-full bg-pimenton-text/25" />
              <span className={`h-2 ${w} rounded bg-pimenton-text/10`} />
            </div>
          ))}
        </div>

        {/* Jerga vanity */}
        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          {VANITY.map((w) => (
            <span
              key={w}
              className="rounded-full border border-pimenton-border px-3 py-1 font-sans text-[11px] uppercase tracking-[0.16em] text-pimenton-text-muted"
            >
              {w}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Column({
  visual,
  label,
  labelClass,
  text,
  textClass,
  delay,
  reduced,
}: {
  visual: React.ReactNode;
  label: React.ReactNode;
  labelClass: string;
  text: string;
  textClass: string;
  delay: number;
  reduced: boolean;
}) {
  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: reduced ? 0 : delay, ease: EASE }}
      className="flex flex-col"
    >
      <motion.div
        whileHover={reduced ? undefined : { scale: 1.015, y: -3 }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        {visual}
      </motion.div>
      <h3
        className={`mt-6 flex items-center gap-2.5 text-xl font-semibold tracking-tight sm:text-2xl ${labelClass}`}
      >
        {label}
      </h3>
      <p className={`mt-2 text-base leading-relaxed ${textClass}`}>{text}</p>
    </motion.div>
  );
}

export function NoSomosAgencia() {
  const reduced = useReducedMotion() ?? false;
  const t = useT();

  return (
    <section className="bg-pimenton-bg px-[5%] py-24 sm:px-16 sm:py-32 lg:px-24">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header left-aligned (sin eyebrow) */}
        <div className="max-w-3xl">
          <motion.h2
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="text-3xl font-semibold leading-[1.12] tracking-tight text-pimenton-text sm:text-4xl"
          >
            <span className="block">
              {t({ es: "Somos un equipo", en: "We're a delivery" })}
            </span>
            <span className="mt-1 block">
              {t({ es: "de ", en: "" })}
              <Highlight color="coral">
                {t({ es: "operación de delivery.", en: "operations team." })}
              </Highlight>
            </span>
          </motion.h2>
          <motion.p
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="mt-5 text-lg leading-relaxed text-pimenton-text-muted"
          >
            {t({
              es: "La diferencia se ve cuando abres nuestra pantalla.",
              en: "The difference shows when you open our screen.",
            })}
          </motion.p>
        </div>

        {/* Split: agencia (problema) → Pimentón (solución) */}
        <div className="mt-14 grid grid-cols-1 items-start gap-8 sm:mt-20 md:grid-cols-2 lg:gap-12">
          <Column
            visual={<AgencyDeck />}
            label={t({ es: "Agencias tradicionales", en: "Traditional agencies" })}
            labelClass="text-pimenton-text-muted"
            text={t({
              es: "Te entregan slides, métricas vanity y reportes de actividad. La operación sigue siendo tu problema.",
              en: "They hand you slides, vanity metrics, and activity reports. The operation is still your problem.",
            })}
            textClass="text-pimenton-text-muted"
            delay={0}
            reduced={reduced}
          />
          <Column
            visual={<OrdenesChart />}
            label={
              <>
                {t({ es: "Equipo", en: "Team" })}
                {/* logo 25% más grande que el texto para darle peso */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/logos/principal/logo-coral.webp"
                  alt="Pimentón"
                  className="inline-block h-[25px] w-auto sm:h-[30px]"
                  draggable={false}
                />
              </>
            }
            labelClass="text-pimenton-text"
            text={t({
              es: "Operamos tu delivery todos los días. Tomamos decisiones, ajustamos campañas, optimizamos menús. Los resultados se ven en tu P&L.",
              en: "We operate your delivery every day. We make decisions, adjust campaigns, optimize menus. The results show up in your P&L.",
            })}
            textClass="text-pimenton-text"
            delay={0.2}
            reduced={reduced}
          />
        </div>
      </div>
    </section>
  );
}
