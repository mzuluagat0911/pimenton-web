import { splitHighlight } from "@/components/ui-custom/Highlight";
import type { Insight } from "@/data/insights";

/**
 * Cuerpo del artículo — server component (contenido estático, lectura cómoda
 * y garantizada). Ancho de lectura ~720px, leading generoso. Bullets con
 * marcador coral (guion). Conclusión con borde coral (remate).
 */
export function ArticleBody({ insight }: { insight: Insight }) {
  return (
    <section className="bg-pimenton-bg px-[5%] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[720px]">
        {/* Intro */}
        <div className="flex flex-col gap-5">
          {insight.intro.map((p, i) => (
            <p
              key={i}
              className="text-lg leading-[1.75] text-pimenton-text-soft sm:text-xl"
            >
              {p}
            </p>
          ))}
        </div>

        {/* Secciones */}
        {insight.secciones.map((sec, si) => (
          <div key={si} className="mt-12 sm:mt-16">
            <h2 className="text-2xl font-bold normal-case leading-tight tracking-tight text-pimenton-text sm:text-3xl">
              {sec.headingAccent
                ? splitHighlight(sec.heading, sec.headingAccent, "coral")
                : sec.heading}
            </h2>

            {sec.parrafos?.map((p, pi) => (
              <p
                key={pi}
                className="mt-5 text-lg leading-[1.75] text-pimenton-text-soft"
              >
                {p}
              </p>
            ))}

            {sec.bullets && (
              <ul className="mt-6 flex flex-col gap-3.5">
                {sec.bullets.map((b, bi) => (
                  <li
                    key={bi}
                    className="flex gap-4 text-lg leading-[1.6] text-pimenton-text-soft"
                  >
                    <span
                      aria-hidden
                      className="mt-[0.7em] h-px w-5 shrink-0 bg-pimenton-accent"
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}

            {sec.cierreParrafos?.map((p, pi) => (
              <p
                key={pi}
                className="mt-5 text-lg leading-[1.75] text-pimenton-text-soft"
              >
                {p}
              </p>
            ))}
          </div>
        ))}

        {/* Conclusión — remate. Misma trama que el cuerpo (text-lg), con un
            borde coral fino; sin el salto de tamaño anterior. */}
        <div className="mt-14 border-l-2 border-pimenton-accent pl-5 sm:mt-16 sm:pl-6">
          {insight.conclusion.map((p, i) => (
            <p
              key={i}
              className={`text-lg leading-[1.75] text-pimenton-text-soft ${
                i > 0 ? "mt-4" : ""
              }`}
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
