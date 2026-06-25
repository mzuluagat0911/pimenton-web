/**
 * Data layer del blog /insights (estático, sin CMS). El hub (/insights) y la
 * template dinámica (/insights/[slug]) se renderizan desde acá. Para sumar un
 * artículo, agregá un objeto a `insights` — sin tocar componentes.
 *
 * Contenido en español neutro (el original del Framer venía con voseo
 * argentino, neutralizado al cargarlo: el concepto no cambia, sólo la
 * conjugación). Las imágenes de hero se descargaron del Framer a
 * /public/assets/insights/[slug]/ (no se hotlinkea Framer).
 */

export interface InsightSeccion {
  heading: string;
  /** Palabra/segmento del heading a resaltar en coral (opcional) */
  headingAccent?: string;
  parrafos?: string[];
  bullets?: string[];
  /** Párrafos después de los bullets */
  cierreParrafos?: string[];
}

export interface Insight {
  slug: string;
  titulo: string;
  /** Tag editorial */
  categoria: string;
  /** Fecha ISO (para <time> y article:published_time) */
  fecha: string;
  /** Fecha legible, ej "18 feb 2026" */
  fechaDisplay: string;
  /** Bajada / descripción para el hub */
  excerpt: string;
  /** Descripción breve para la card del hub (máx 2 líneas) */
  resumen: string;
  heroImage: string;
  metaTitle: string;
  metaDescription: string;
  /** Párrafos de apertura */
  intro: string[];
  secciones: InsightSeccion[];
  /** Párrafos de cierre (remate) */
  conclusion: string[];
}

export const insights: Insight[] = [
  {
    slug: "delivery-rentable",
    titulo:
      "Por qué tu delivery vende, pero no es rentable (y cómo solucionarlo)",
    categoria: "Rentabilidad",
    fecha: "2026-02-18",
    fechaDisplay: "18 feb 2026",
    excerpt:
      "Muchos restaurantes aumentan pedidos en apps de delivery, pero el margen no mejora. Te explicamos por qué sucede y cómo transformar el canal en una unidad realmente rentable.",
    resumen:
      "Vender más no siempre es ganar más. Por qué tu delivery pierde margen y cómo revertirlo.",
    heroImage: "/assets/insights/delivery-rentable/hero.jpg",
    metaTitle:
      "Por qué tu delivery vende pero no es rentable | Insights Pimentón",
    metaDescription:
      "Vender más no es ganar más. Descubre por qué tu delivery pierde margen y cómo convertirlo en una unidad de negocio rentable con estrategia, datos y pricing.",
    intro: [
      "Tu delivery puede estar creciendo… y al mismo tiempo estar perdiendo rentabilidad. Vender más no siempre significa ganar más.",
      "En los marketplaces es común ver un aumento en pedidos mientras el margen se diluye entre comisiones, promociones mal diseñadas y precios desalineados. El problema no suele ser la falta de ventas, sino la falta de estructura estratégica.",
    ],
    secciones: [
      {
        heading: "El error más común: medir volumen y no rentabilidad",
        headingAccent: "rentabilidad",
        parrafos: [
          "Muchos restaurantes celebran el crecimiento en órdenes mensuales. Pero pocas veces analizan el margen real por pedido.",
          "Preguntas clave que casi nadie se hace:",
        ],
        bullets: [
          "¿Cuánto margen deja cada producto dentro de la app?",
          "¿La promo compensa la comisión?",
          "¿El combo más vendido es realmente rentable?",
        ],
        cierreParrafos: ["Sin esta información, el canal crece desordenado."],
      },
      {
        heading: "Promociones que aumentan ventas, pero destruyen margen",
        headingAccent: "margen",
        parrafos: [
          "Las apps incentivan descuentos constantes. El problema es que muchas promociones:",
        ],
        bullets: [
          "No elevan ticket promedio",
          "Canibalizan ventas orgánicas",
          "Atraen clientes sensibles solo al precio",
        ],
        cierreParrafos: [
          "Una promoción estratégica debe tener un objetivo claro: aumentar margen, visibilidad o adquisición. Si no cumple una función, está erosionando rentabilidad.",
        ],
      },
      {
        heading: "Arquitectura de menú y pricing mal optimizados",
        headingAccent: "pricing",
        parrafos: [
          "El orden del menú impacta en lo que el cliente elige. Un canal bien operado:",
        ],
        bullets: [
          "Destaca productos de mayor margen",
          "Diseña combos que elevan ticket promedio",
          "Ajusta precios según comportamiento del consumidor",
        ],
        cierreParrafos: [
          "El delivery no es solo publicar la carta física en una app. Es diseñar una experiencia digital estratégica.",
        ],
      },
      {
        heading: "El delivery como unidad de negocio",
        headingAccent: "unidad de negocio",
        parrafos: ["Cuando se analiza correctamente, el canal digital puede:"],
        bullets: [
          "Aumentar facturación",
          "Mejorar margen promedio",
          "Generar previsibilidad mensual",
        ],
        cierreParrafos: [
          "Pero eso requiere gestión diaria, análisis de datos y ajustes constantes. No es automático. Es estratégico.",
        ],
      },
    ],
    conclusion: [
      "El objetivo no es vender más. Es vender mejor.",
      "Un delivery bien operado no depende de descuentos constantes ni de la suerte del algoritmo. Depende de decisiones informadas.",
    ],
  },
  {
    slug: "ticket-promedio",
    titulo:
      "Cómo aumentar el ticket promedio en apps de delivery (sin depender de descuentos)",
    categoria: "Estrategia",
    fecha: "2026-02-18",
    fechaDisplay: "18 feb 2026",
    excerpt:
      "Subir el ticket promedio es una de las formas más efectivas de mejorar la rentabilidad en delivery. Te mostramos estrategias prácticas para lograrlo sin erosionar margen.",
    resumen:
      "Estrategias prácticas para subir el ticket promedio y mejorar el margen sin depender de descuentos.",
    heroImage: "/assets/insights/ticket-promedio/hero.jpg",
    metaTitle:
      "Cómo aumentar el ticket promedio en delivery | Insights Pimentón",
    metaDescription:
      "Mejora tu rentabilidad en delivery subiendo el ticket promedio, no bajando precios. Combos estratégicos, arquitectura de menú, upselling y pricing inteligente.",
    intro: [
      "Si quieres mejorar tu rentabilidad en delivery, no empieces bajando precios. Empieza subiendo el ticket promedio.",
      "Muchos restaurantes intentan crecer aumentando pedidos. Pero una estrategia más inteligente es lograr que cada orden facture más. El impacto en margen es inmediato… y mucho más saludable.",
    ],
    secciones: [
      {
        heading:
          "Por qué el ticket promedio es la métrica que más impacto tiene",
        headingAccent: "ticket promedio",
        parrafos: ["Subir el ticket promedio mejora:"],
        bullets: [
          "Margen por pedido",
          "Eficiencia operativa",
          "Rentabilidad frente a comisiones",
        ],
        cierreParrafos: [
          "Si tu ticket promedio aumenta un 15%, el impacto en margen puede ser mayor que aumentar 30% las órdenes. Y no requiere descuentos.",
        ],
      },
      {
        heading: "Diseña combos estratégicos, no promociones",
        headingAccent: "combos estratégicos",
        parrafos: [
          "Un error frecuente es usar descuentos agresivos para “mover volumen”. En cambio, diseña:",
        ],
        bullets: [
          "Combos que agrupen productos de alto margen",
          "Opciones familiares con percepción de valor",
          "Packs que incluyan bebidas o complementos",
        ],
        cierreParrafos: [
          "El objetivo no es vender más barato. Es vender más completo.",
        ],
      },
      {
        heading: "Arquitectura del menú: lo que se ve, se vende",
        headingAccent: "se vende",
        parrafos: [
          "Las apps funcionan como una góndola digital. Si el producto de mayor margen está escondido al final del menú, no se vende.",
          "Algunas acciones clave:",
        ],
        bullets: [
          "Destacar productos premium al inicio",
          "Usar descripciones que aumenten percepción de valor",
          "Incorporar fotos profesionales",
          "Simplificar categorías",
        ],
        cierreParrafos: ["El orden impacta directamente en el ticket."],
      },
      {
        heading: "Upselling y cross-selling inteligente",
        headingAccent: "inteligente",
        parrafos: ["Las apps permiten sugerencias automáticas:"],
        bullets: [
          "“Agrega una bebida por…”",
          "“Completa tu combo por…”",
          "“Otros clientes también pidieron…”",
        ],
        cierreParrafos: [
          "Cuando está bien configurado, el upselling eleva ticket promedio, no genera fricción y aumenta margen sin bajar precios. Pero requiere análisis constante.",
        ],
      },
      {
        heading: "Precio estratégico vs precio competitivo",
        headingAccent: "estratégico",
        parrafos: [
          "Muchos restaurantes fijan precios en apps “mirando a la competencia”. El problema: no consideran estructura de costos ni comisión.",
          "Un pricing correcto en marketplaces:",
        ],
        bullets: [
          "Compensa comisión",
          "Mantiene percepción de marca",
          "Sostiene margen",
        ],
        cierreParrafos: [
          "No se trata de ser el más barato. Se trata de ser rentable.",
        ],
      },
    ],
    conclusion: [
      "El crecimiento sano en delivery no depende de descuentos permanentes. Depende de diseño estratégico del menú, arquitectura digital y análisis de datos.",
      "Cuando el ticket promedio sube, la rentabilidad deja de ser un problema.",
    ],
  },
  {
    slug: "profesionalizar-delivery",
    titulo:
      "Cómo profesionalizar el canal de delivery en tu restaurante (guía paso a paso)",
    categoria: "Operación",
    fecha: "2026-02-12",
    fechaDisplay: "12 feb 2026",
    excerpt:
      "El delivery ya no es un canal secundario. En esta guía te mostramos cómo estructurarlo como una verdadera unidad de negocio rentable y escalable.",
    resumen:
      "Cómo estructurar tu delivery como una unidad de negocio rentable y escalable, paso a paso.",
    heroImage: "/assets/insights/profesionalizar-delivery/hero.jpg",
    metaTitle:
      "Cómo profesionalizar el canal de delivery | Insights Pimentón",
    metaDescription:
      "Guía paso a paso para profesionalizar el delivery de tu restaurante: entender tus números, diseñar el menú, estrategia de promociones y gestión diaria basada en datos.",
    intro: [
      "El delivery ya no es un complemento. Es una unidad de negocio. Y si no está profesionalizado, está perdiendo dinero.",
      "Muchos restaurantes operan el canal digital de forma reactiva: cargan el menú, activan promociones y esperan resultados. Pero las marcas que crecen de forma sostenida lo gestionan con estructura, datos y estrategia diaria. Esta es la hoja de ruta para hacerlo bien.",
    ],
    secciones: [
      {
        heading: "Paso 1 – Entender tus números reales",
        headingAccent: "Paso 1",
        parrafos: [
          "Antes de optimizar, necesitas claridad.",
          "Métricas básicas que todo restaurante debería conocer:",
        ],
        bullets: [
          "Margen por producto en app",
          "Ticket promedio",
          "Comisión real por pedido",
          "Costo de promociones activas",
          "Rentabilidad por canal",
        ],
        cierreParrafos: ["Sin esta base, cualquier decisión es intuición."],
      },
      {
        heading: "Paso 2 – Diseñar el menú para vender mejor",
        headingAccent: "Paso 2",
        parrafos: [
          "La carta física no funciona igual en una app. Un menú profesional en delivery:",
        ],
        bullets: [
          "Prioriza productos de mayor margen",
          "Simplifica categorías",
          "Optimiza descripciones",
          "Usa imágenes de alta calidad",
          "Crea combos estratégicos",
        ],
        cierreParrafos: [
          "El diseño del menú impacta directamente en facturación y rentabilidad.",
        ],
      },
      {
        heading: "Paso 3 – Definir una estrategia de promociones inteligente",
        headingAccent: "Paso 3",
        parrafos: ["No todas las promos sirven. Una estrategia profesional:"],
        bullets: [
          "Define objetivos claros (visibilidad, adquisición, rentabilidad)",
          "Mide impacto real",
          "Evita descuentos permanentes sin análisis",
          "Ajusta según estacionalidad",
        ],
        cierreParrafos: [
          "Promocionar sin estrategia puede aumentar ventas… y reducir margen.",
        ],
      },
      {
        heading: "Paso 4 – Gestionar el canal todos los días",
        headingAccent: "Paso 4",
        parrafos: [
          "El delivery es dinámico. Los algoritmos cambian, la competencia se mueve, el comportamiento del consumidor evoluciona.",
          "La gestión diaria implica:",
        ],
        bullets: [
          "Revisar métricas",
          "Ajustar precios",
          "Optimizar productos",
          "Evaluar posicionamiento en la app",
          "Tomar decisiones basadas en datos",
        ],
        cierreParrafos: ["No es un canal “automático”."],
      },
      {
        heading:
          "Paso 5 – Pensar el delivery como parte del negocio, no como algo aislado",
        headingAccent: "Paso 5",
        parrafos: ["El canal digital impacta en:"],
        bullets: [
          "Branding",
          "Percepción de marca",
          "Experiencia del cliente",
          "Fidelización",
        ],
        cierreParrafos: [
          "Cuando está alineado con la operación interna, potencia todo el negocio. Cuando no, genera fricción.",
        ],
      },
    ],
    conclusion: [
      "Profesionalizar el delivery no significa hacerlo más complejo. Significa hacerlo estratégico.",
      "Con estructura, análisis y enfoque en rentabilidad, el canal deja de ser una urgencia operativa y se convierte en una fuente sólida de crecimiento.",
    ],
  },
];

/** Devuelve un artículo por slug (o undefined). */
export function getInsight(slug: string): Insight | undefined {
  return insights.find((a) => a.slug === slug);
}

/** Otros artículos (para "Más artículos"), excluyendo el actual. */
export function getOtrosInsights(slug: string, limit = 2): Insight[] {
  return insights.filter((a) => a.slug !== slug).slice(0, limit);
}
