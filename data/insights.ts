/**
 * Data layer del blog /insights (estático, sin CMS). El hub (/insights) y la
 * template dinámica (/insights/[slug]) se renderizan desde acá. Para sumar un
 * artículo, agregá un objeto a `insights` — sin tocar componentes.
 *
 * Contenido bilingüe {es,en}: español neutro + inglés. Los componentes (client)
 * resuelven el idioma activo con useT(); el server (metadata + JSON-LD) usa los
 * campos meta en español por SEO (idioma por defecto). Las imágenes de hero se
 * descargaron del Framer a /public/assets/insights/[slug]/ (no se hotlinkea).
 */

type Localized = { es: string; en: string };

export interface InsightStat {
  value: Localized;
  label: Localized;
}

export interface InsightChartItem {
  label: Localized;
  /** Ancho de barra / slice (0–100). */
  value: number;
  /** Texto mostrado a la derecha (si falta, se usa `${value}%`). */
  display?: Localized;
  /** Resalta en coral (la cifra que importa). */
  accent?: boolean;
}

export interface InsightChart {
  kind: "bars" | "stack" | "compare" | "steps";
  kicker?: Localized;
  title: Localized;
  caption?: Localized;
  tone?: "dark" | "light";
  items: InsightChartItem[];
}

export interface InsightFigure {
  src: string;
  alt: Localized;
  caption: Localized;
}

export interface InsightSeccion {
  heading: Localized;
  /** Palabra/segmento del heading a resaltar en coral (opcional) */
  headingAccent?: Localized;
  parrafos?: Localized[];
  bullets?: Localized[];
  /** Párrafos después de los bullets */
  cierreParrafos?: Localized[];
  /** Foto editorial relacionada con la sección */
  figure?: InsightFigure;
  /** Gráfico o comparativa de la sección */
  chart?: InsightChart;
}

export interface Insight {
  slug: string;
  titulo: Localized;
  /** Tag editorial */
  categoria: Localized;
  /** Fecha ISO (para <time> y article:published_time) */
  fecha: string;
  /** Fecha legible, ej "18 feb 2026" */
  fechaDisplay: Localized;
  /** Bajada / descripción para el hub */
  excerpt: Localized;
  /** Descripción breve para la card del hub (máx 2 líneas) */
  resumen: Localized;
  heroImage: string;
  /** Meta tags (server-side, idioma por defecto/SEO): español */
  metaTitle: string;
  metaDescription: string;
  /** Párrafos de apertura */
  intro: Localized[];
  /** Cifras de cabecera (después del intro) */
  stats?: InsightStat[];
  /** Gráfico destacado, justo debajo de las cifras */
  featuredChart?: InsightChart;
  secciones: InsightSeccion[];
  /** Párrafos de cierre (remate) */
  conclusion: Localized[];
}

export const insights: Insight[] = [
  {
    slug: "delivery-rentable",
    titulo: {
      es: "Por qué tu delivery vende, pero no es rentable (y cómo solucionarlo)",
      en: "Why your delivery sells but isn't profitable (and how to fix it)",
    },
    categoria: { es: "Rentabilidad", en: "Profitability" },
    fecha: "2026-02-18",
    fechaDisplay: { es: "18 feb 2026", en: "Feb 18, 2026" },
    excerpt: {
      es: "Muchos restaurantes aumentan pedidos en apps de delivery, pero el margen no mejora. Te explicamos por qué sucede y cómo transformar el canal en una unidad realmente rentable.",
      en: "Many restaurants grow orders on delivery apps, but their margin doesn't improve. We explain why it happens and how to turn the channel into a truly profitable unit.",
    },
    resumen: {
      es: "Vender más no siempre es ganar más. Por qué tu delivery pierde margen y cómo revertirlo.",
      en: "Selling more isn't always earning more. Why your delivery loses margin and how to reverse it.",
    },
    heroImage: "/assets/insights/delivery-rentable/hero.jpg",
    metaTitle:
      "Por qué tu delivery vende pero no es rentable | Insights Pimentón",
    metaDescription:
      "Vender más no es ganar más. Descubre por qué tu delivery pierde margen y cómo convertirlo en una unidad de negocio rentable con estrategia, datos y pricing.",
    intro: [
      {
        es: "Tu delivery puede estar creciendo… y al mismo tiempo estar perdiendo rentabilidad. Vender más no siempre significa ganar más.",
        en: "Your delivery can be growing… and losing profitability at the same time. Selling more doesn't always mean earning more.",
      },
      {
        es: "En los marketplaces es común ver un aumento en pedidos mientras el margen se diluye entre comisiones, promociones mal diseñadas y precios desalineados. El problema no suele ser la falta de ventas, sino la falta de estructura estratégica.",
        en: "On marketplaces it's common to see orders rise while margin dilutes between commissions, poorly designed promotions, and misaligned prices. The problem usually isn't a lack of sales, but a lack of strategic structure.",
      },
    ],
    stats: [
      {
        value: { es: "30%", en: "30%" },
        label: {
          es: "del ticket se va en comisión, antes de cocinar.",
          en: "of the ticket goes to commission, before you cook.",
        },
      },
      {
        value: { es: "15%", en: "15%" },
        label: {
          es: "margen típico cuando nadie arma el P&L por pedido.",
          en: "typical margin when nobody builds a P&L per order.",
        },
      },
      {
        value: { es: "0", en: "0" },
        label: {
          es: "decisiones buenas sin dato de contribución.",
          en: "good decisions without contribution data.",
        },
      },
    ],
    featuredChart: {
      kind: "stack",
      kicker: { es: "Ejemplo ilustrativo", en: "Illustrative example" },
      title: {
        es: "A dónde se va un pedido de $100",
        en: "Where a $100 order actually goes",
      },
      caption: {
        es: "Sin P&L por orden, el margen se diluye entre comisión, packaging y promos. Cada restaurante tiene su propia estructura: esto es una foto típica, no una promesa.",
        en: "Without a P&L per order, margin dilutes across commission, packaging, and promos. Every restaurant has its own structure — this is a typical snapshot, not a promise.",
      },
      items: [
        { label: { es: "Comida", en: "Food" }, value: 32, display: { es: "$32", en: "$32" } },
        { label: { es: "Comisión", en: "Commission" }, value: 28, display: { es: "$28", en: "$28" } },
        { label: { es: "Packaging y ads", en: "Packaging & ads" }, value: 12, display: { es: "$12", en: "$12" } },
        { label: { es: "Promo", en: "Promo" }, value: 10, display: { es: "$10", en: "$10" } },
        {
          label: { es: "Margen", en: "Margin" },
          value: 18,
          display: { es: "$18", en: "$18" },
          accent: true,
        },
      ],
    },
    secciones: [
      {
        heading: {
          es: "El error más común: medir volumen y no rentabilidad",
          en: "The most common mistake: measuring volume, not profitability",
        },
        headingAccent: { es: "rentabilidad", en: "profitability" },
        parrafos: [
          {
            es: "Muchos restaurantes celebran el crecimiento en órdenes mensuales. Pero pocas veces analizan el margen real por pedido.",
            en: "Many restaurants celebrate growth in monthly orders. But they rarely analyze the real margin per order.",
          },
          {
            es: "Preguntas clave que casi nadie se hace:",
            en: "Key questions almost no one asks:",
          },
        ],
        bullets: [
          {
            es: "¿Cuánto margen deja cada producto dentro de la app?",
            en: "How much margin does each product leave inside the app?",
          },
          { es: "¿La promo compensa la comisión?", en: "Does the promo offset the commission?" },
          {
            es: "¿El combo más vendido es realmente rentable?",
            en: "Is the best-selling combo actually profitable?",
          },
        ],
        cierreParrafos: [
          {
            es: "Sin esta información, el canal crece desordenado.",
            en: "Without this information, the channel grows in a disorganized way.",
          },
        ],
        chart: {
          kind: "compare",
          kicker: { es: "El mismo mes", en: "The same month" },
          title: {
            es: "Dos lecturas del canal. Sólo una paga.",
            en: "Two readings of the channel. Only one pays.",
          },
          caption: {
            es: "Celebrar órdenes mientras el margen cae es el error más caro del delivery.",
            en: "Celebrating orders while margin falls is delivery's most expensive mistake.",
          },
          items: [
            {
              label: { es: "Órdenes (lo que se celebra)", en: "Orders (what gets celebrated)" },
              value: 42,
              display: { es: "+42%", en: "+42%" },
            },
            {
              label: { es: "Margen por pedido (lo que importa)", en: "Margin per order (what matters)" },
              value: 18,
              display: { es: "−18%", en: "−18%" },
              accent: true,
            },
          ],
        },
      },
      {
        heading: {
          es: "Promociones que aumentan ventas, pero destruyen margen",
          en: "Promotions that boost sales but destroy margin",
        },
        headingAccent: { es: "margen", en: "margin" },
        parrafos: [
          {
            es: "Las apps incentivan descuentos constantes. El problema es que muchas promociones:",
            en: "Apps incentivize constant discounts. The problem is that many promotions:",
          },
        ],
        bullets: [
          { es: "No elevan ticket promedio", en: "Don't raise the average ticket" },
          { es: "Canibalizan ventas orgánicas", en: "Cannibalize organic sales" },
          {
            es: "Atraen clientes sensibles solo al precio",
            en: "Attract customers who care only about price",
          },
        ],
        cierreParrafos: [
          {
            es: "Una promoción estratégica debe tener un objetivo claro: aumentar margen, visibilidad o adquisición. Si no cumple una función, está erosionando rentabilidad.",
            en: "A strategic promotion must have a clear goal: increase margin, visibility, or acquisition. If it doesn't serve a function, it's eroding profitability.",
          },
        ],
        figure: {
          src: "/assets/gallery/dashboard-analisis.webp",
          alt: {
            es: "Tablero de análisis de delivery con métricas de margen y pedidos",
            en: "Delivery analytics dashboard with margin and order metrics",
          },
          caption: {
            es: "Si la promo no aparece en un tablero de contribución, se está evaluando por volumen — no por margen.",
            en: "If the promo doesn't show up on a contribution dashboard, you're judging it by volume — not margin.",
          },
        },
      },
      {
        heading: {
          es: "Arquitectura de menú y pricing mal optimizados",
          en: "Poorly optimized menu architecture and pricing",
        },
        headingAccent: { es: "pricing", en: "pricing" },
        parrafos: [
          {
            es: "El orden del menú impacta en lo que el cliente elige. Un canal bien operado:",
            en: "The menu order impacts what the customer chooses. A well-run channel:",
          },
        ],
        bullets: [
          { es: "Destaca productos de mayor margen", en: "Highlights higher-margin products" },
          {
            es: "Diseña combos que elevan ticket promedio",
            en: "Designs combos that raise the average ticket",
          },
          {
            es: "Ajusta precios según comportamiento del consumidor",
            en: "Adjusts prices based on consumer behavior",
          },
        ],
        cierreParrafos: [
          {
            es: "El delivery no es solo publicar la carta física en una app. Es diseñar una experiencia digital estratégica.",
            en: "Delivery isn't just posting your physical menu on an app. It's designing a strategic digital experience.",
          },
        ],
        figure: {
          src: "/assets/gallery/plato-burguer.webp",
          alt: {
            es: "Plato de burger gourmet listo para delivery",
            en: "Gourmet burger plate ready for delivery",
          },
          caption: {
            es: "El producto de mayor margen tiene que verse primero. En la app, lo que no se ve no se vende.",
            en: "The highest-margin product has to be seen first. In the app, what isn't seen doesn't sell.",
          },
        },
      },
      {
        heading: {
          es: "El delivery como unidad de negocio",
          en: "Delivery as a business unit",
        },
        headingAccent: { es: "unidad de negocio", en: "business unit" },
        parrafos: [
          {
            es: "Cuando se analiza correctamente, el canal digital puede:",
            en: "When analyzed correctly, the digital channel can:",
          },
        ],
        bullets: [
          { es: "Aumentar facturación", en: "Increase revenue" },
          { es: "Mejorar margen promedio", en: "Improve average margin" },
          { es: "Generar previsibilidad mensual", en: "Generate monthly predictability" },
        ],
        cierreParrafos: [
          {
            es: "Pero eso requiere gestión diaria, análisis de datos y ajustes constantes. No es automático. Es estratégico.",
            en: "But that requires daily management, data analysis, and constant adjustments. It's not automatic. It's strategic.",
          },
        ],
        figure: {
          src: "/assets/services/service_gestion-integral.webp",
          alt: {
            es: "Operación integral de delivery: cocina, packing y control",
            en: "End-to-end delivery operations: kitchen, packing, and control",
          },
          caption: {
            es: "Cuando el canal se opera como unidad de negocio, cocina, pricing y data dejan de vivir en silos.",
            en: "When the channel is run as a business unit, kitchen, pricing, and data stop living in silos.",
          },
        },
      },
    ],
    conclusion: [
      { es: "El objetivo no es vender más. Es vender mejor.", en: "The goal isn't to sell more. It's to sell better." },
      {
        es: "Un delivery bien operado no depende de descuentos constantes ni de la suerte del algoritmo. Depende de decisiones informadas.",
        en: "A well-run delivery operation doesn't depend on constant discounts or the luck of the algorithm. It depends on informed decisions.",
      },
    ],
  },
  {
    slug: "ticket-promedio",
    titulo: {
      es: "Cómo aumentar el ticket promedio en apps de delivery (sin depender de descuentos)",
      en: "How to raise the average ticket on delivery apps (without relying on discounts)",
    },
    categoria: { es: "Estrategia", en: "Strategy" },
    fecha: "2026-02-18",
    fechaDisplay: { es: "18 feb 2026", en: "Feb 18, 2026" },
    excerpt: {
      es: "Subir el ticket promedio es una de las formas más efectivas de mejorar la rentabilidad en delivery. Te mostramos estrategias prácticas para lograrlo sin erosionar margen.",
      en: "Raising the average ticket is one of the most effective ways to improve delivery profitability. We show you practical strategies to do it without eroding margin.",
    },
    resumen: {
      es: "Estrategias prácticas para subir el ticket promedio y mejorar el margen sin depender de descuentos.",
      en: "Practical strategies to raise the average ticket and improve margin without relying on discounts.",
    },
    heroImage: "/assets/insights/ticket-promedio/hero.jpg",
    metaTitle:
      "Cómo aumentar el ticket promedio en delivery | Insights Pimentón",
    metaDescription:
      "Mejora tu rentabilidad en delivery subiendo el ticket promedio, no bajando precios. Combos estratégicos, arquitectura de menú, upselling y pricing inteligente.",
    intro: [
      {
        es: "Si quieres mejorar tu rentabilidad en delivery, no empieces bajando precios. Empieza subiendo el ticket promedio.",
        en: "If you want to improve your delivery profitability, don't start by lowering prices. Start by raising the average ticket.",
      },
      {
        es: "Muchos restaurantes intentan crecer aumentando pedidos. Pero una estrategia más inteligente es lograr que cada orden facture más. El impacto en margen es inmediato… y mucho más saludable.",
        en: "Many restaurants try to grow by increasing orders. But a smarter strategy is to get each order to bill more. The impact on margin is immediate… and much healthier.",
      },
    ],
    stats: [
      {
        value: { es: "+15%", en: "+15%" },
        label: {
          es: "de ticket extra, sin descuento permanente.",
          en: "extra ticket, with no permanent discount.",
        },
      },
      {
        value: { es: "3×", en: "3×" },
        label: {
          es: "más sano que empujar volumen a costa de margen.",
          en: "healthier than pushing volume at the cost of margin.",
        },
      },
      {
        value: { es: "0", en: "0" },
        label: {
          es: "promos agresivas necesarias para vender mejor.",
          en: "aggressive promos needed to sell better.",
        },
      },
    ],
    featuredChart: {
      kind: "bars",
      kicker: { es: "Impacto relativo", en: "Relative impact" },
      title: {
        es: "Qué mueve más el margen (sin quemar precio)",
        en: "What moves margin more (without burning price)",
      },
      caption: {
        es: "Un +15% de ticket suele dejar más contribución que un +30% de órdenes comprado con descuento. El volumen sin ticket es ruido.",
        en: "A +15% ticket usually leaves more contribution than a +30% order lift bought with discounts. Volume without ticket is noise.",
      },
      tone: "dark",
      items: [
        {
          label: { es: "Subir ticket 15% con combos", en: "Raise ticket 15% with combos" },
          value: 92,
          display: { es: "Alto", en: "High" },
          accent: true,
        },
        {
          label: { es: "Subir órdenes 30% con promo", en: "Raise orders 30% with a promo" },
          value: 48,
          display: { es: "Medio", en: "Medium" },
        },
        {
          label: { es: "Bajar precios para competir", en: "Cut prices to compete" },
          value: 18,
          display: { es: "Negativo", en: "Negative" },
        },
      ],
    },
    secciones: [
      {
        heading: {
          es: "Por qué el ticket promedio es la métrica que más impacto tiene",
          en: "Why average ticket is the metric with the biggest impact",
        },
        headingAccent: { es: "ticket promedio", en: "average ticket" },
        parrafos: [
          { es: "Subir el ticket promedio mejora:", en: "Raising the average ticket improves:" },
        ],
        bullets: [
          { es: "Margen por pedido", en: "Margin per order" },
          { es: "Eficiencia operativa", en: "Operational efficiency" },
          { es: "Rentabilidad frente a comisiones", en: "Profitability against commissions" },
        ],
        cierreParrafos: [
          {
            es: "Si tu ticket promedio aumenta un 15%, el impacto en margen puede ser mayor que aumentar 30% las órdenes. Y no requiere descuentos.",
            en: "If your average ticket rises 15%, the impact on margin can be greater than a 30% increase in orders. And it requires no discounts.",
          },
        ],
        chart: {
          kind: "compare",
          kicker: { es: "Misma cocina", en: "Same kitchen" },
          title: {
            es: "+15% ticket vs +30% órdenes",
            en: "+15% ticket vs +30% orders",
          },
          caption: {
            es: "Más pedidos implican más packing, más picos y más comisión. Más ticket aprovecha el pedido que ya entró.",
            en: "More orders mean more packing, more peaks, and more commission. More ticket leverages the order that already came in.",
          },
          items: [
            {
              label: { es: "Ticket promedio", en: "Average ticket" },
              value: 15,
              display: { es: "+15%", en: "+15%" },
              accent: true,
            },
            {
              label: { es: "Órdenes con descuento", en: "Discounted orders" },
              value: 30,
              display: { es: "+30%", en: "+30%" },
            },
          ],
        },
      },
      {
        heading: {
          es: "Diseña combos estratégicos, no promociones",
          en: "Design strategic combos, not promotions",
        },
        headingAccent: { es: "combos estratégicos", en: "strategic combos" },
        parrafos: [
          {
            es: "Un error frecuente es usar descuentos agresivos para “mover volumen”. En cambio, diseña:",
            en: "A common mistake is using aggressive discounts to “move volume.” Instead, design:",
          },
        ],
        bullets: [
          {
            es: "Combos que agrupen productos de alto margen",
            en: "Combos that group high-margin products",
          },
          {
            es: "Opciones familiares con percepción de valor",
            en: "Family options with perceived value",
          },
          {
            es: "Packs que incluyan bebidas o complementos",
            en: "Packs that include drinks or sides",
          },
        ],
        cierreParrafos: [
          {
            es: "El objetivo no es vender más barato. Es vender más completo.",
            en: "The goal isn't to sell cheaper. It's to sell more complete.",
          },
        ],
        figure: {
          src: "/assets/gallery/plato-sushi.webp",
          alt: {
            es: "Plato de sushi premium, ejemplo de producto con ticket alto",
            en: "Premium sushi plate, an example of a high-ticket product",
          },
          caption: {
            es: "Un combo bien armado agrupa alto margen (plato + bebida + extra) y se siente como valor, no como descuento.",
            en: "A well-built combo groups high margin (main + drink + extra) and feels like value, not a discount.",
          },
        },
        chart: {
          kind: "stack",
          kicker: { es: "Combo de alto margen", en: "High-margin combo" },
          title: {
            es: "Cómo se arma un ticket más completo",
            en: "How a more complete ticket is built",
          },
          caption: {
            es: "El plato abre la orden. La bebida y el extra son el ticket que casi nadie pelea — y donde vive el margen.",
            en: "The main opens the order. The drink and the extra are the ticket almost nobody fights over — and where margin lives.",
          },
          items: [
            { label: { es: "Plato principal", en: "Main" }, value: 58, display: { es: "58%", en: "58%" } },
            { label: { es: "Bebida", en: "Drink" }, value: 24, display: { es: "24%", en: "24%" }, accent: true },
            { label: { es: "Extra / postre", en: "Side / dessert" }, value: 18, display: { es: "18%", en: "18%" } },
          ],
        },
      },
      {
        heading: {
          es: "Arquitectura del menú: lo que se ve, se vende",
          en: "Menu architecture: what gets seen, gets sold",
        },
        headingAccent: { es: "se vende", en: "gets sold" },
        parrafos: [
          {
            es: "Las apps funcionan como una góndola digital. Si el producto de mayor margen está escondido al final del menú, no se vende.",
            en: "Apps work like a digital shelf. If the highest-margin product is hidden at the end of the menu, it doesn't sell.",
          },
          { es: "Algunas acciones clave:", en: "Some key actions:" },
        ],
        bullets: [
          { es: "Destacar productos premium al inicio", en: "Feature premium products at the top" },
          {
            es: "Usar descripciones que aumenten percepción de valor",
            en: "Use descriptions that increase perceived value",
          },
          { es: "Incorporar fotos profesionales", en: "Add professional photos" },
          { es: "Simplificar categorías", en: "Simplify categories" },
        ],
        cierreParrafos: [
          { es: "El orden impacta directamente en el ticket.", en: "Order directly impacts the ticket." },
        ],
        figure: {
          src: "/assets/gallery/plato-burguer.webp",
          alt: {
            es: "Burger gourmet con presentación de alto valor percibido",
            en: "Gourmet burger with high perceived-value presentation",
          },
          caption: {
            es: "Foto, descripción y posición en el menú son pricing. El producto premium escondido al final no existe.",
            en: "Photo, description, and menu position are pricing. A premium product hidden at the bottom doesn't exist.",
          },
        },
      },
      {
        heading: {
          es: "Upselling y cross-selling inteligente",
          en: "Smart upselling and cross-selling",
        },
        headingAccent: { es: "inteligente", en: "Smart" },
        parrafos: [
          { es: "Las apps permiten sugerencias automáticas:", en: "Apps allow automatic suggestions:" },
        ],
        bullets: [
          { es: "“Agrega una bebida por…”", en: "“Add a drink for…”" },
          { es: "“Completa tu combo por…”", en: "“Complete your combo for…”" },
          { es: "“Otros clientes también pidieron…”", en: "“Other customers also ordered…”" },
        ],
        cierreParrafos: [
          {
            es: "Cuando está bien configurado, el upselling eleva ticket promedio, no genera fricción y aumenta margen sin bajar precios. Pero requiere análisis constante.",
            en: "When set up well, upselling raises the average ticket, creates no friction, and increases margin without lowering prices. But it requires constant analysis.",
          },
        ],
        figure: {
          src: "/assets/gallery/preparacion-burguer.webp",
          alt: {
            es: "Preparación de burger en cocina para un pedido delivery",
            en: "Burger being prepared in the kitchen for a delivery order",
          },
          caption: {
            es: "El upsell tiene que ser operable: si la cocina no puede sumar el extra en 30 segundos, la sugerencia de la app es teatro.",
            en: "The upsell has to be operable: if the kitchen can't add the extra in 30 seconds, the app suggestion is theater.",
          },
        },
      },
      {
        heading: {
          es: "Precio estratégico vs precio competitivo",
          en: "Strategic pricing vs. competitive pricing",
        },
        headingAccent: { es: "estratégico", en: "Strategic" },
        parrafos: [
          {
            es: "Muchos restaurantes fijan precios en apps “mirando a la competencia”. El problema: no consideran estructura de costos ni comisión.",
            en: "Many restaurants set prices on apps “by watching the competition.” The problem: they don't consider cost structure or commission.",
          },
          { es: "Un pricing correcto en marketplaces:", en: "Correct pricing on marketplaces:" },
        ],
        bullets: [
          { es: "Compensa comisión", en: "Offsets commission" },
          { es: "Mantiene percepción de marca", en: "Maintains brand perception" },
          { es: "Sostiene margen", en: "Sustains margin" },
        ],
        cierreParrafos: [
          {
            es: "No se trata de ser el más barato. Se trata de ser rentable.",
            en: "It's not about being the cheapest. It's about being profitable.",
          },
        ],
      },
    ],
    conclusion: [
      {
        es: "El crecimiento sano en delivery no depende de descuentos permanentes. Depende de diseño estratégico del menú, arquitectura digital y análisis de datos.",
        en: "Healthy growth in delivery doesn't depend on permanent discounts. It depends on strategic menu design, digital architecture, and data analysis.",
      },
      {
        es: "Cuando el ticket promedio sube, la rentabilidad deja de ser un problema.",
        en: "When the average ticket rises, profitability stops being a problem.",
      },
    ],
  },
  {
    slug: "profesionalizar-delivery",
    titulo: {
      es: "Cómo profesionalizar el canal de delivery en tu restaurante (guía paso a paso)",
      en: "How to professionalize the delivery channel in your restaurant (step-by-step guide)",
    },
    categoria: { es: "Operación", en: "Operations" },
    fecha: "2026-02-12",
    fechaDisplay: { es: "12 feb 2026", en: "Feb 12, 2026" },
    excerpt: {
      es: "El delivery ya no es un canal secundario. En esta guía te mostramos cómo estructurarlo como una verdadera unidad de negocio rentable y escalable.",
      en: "Delivery is no longer a secondary channel. In this guide we show you how to structure it as a truly profitable and scalable business unit.",
    },
    resumen: {
      es: "Cómo estructurar tu delivery como una unidad de negocio rentable y escalable, paso a paso.",
      en: "How to structure your delivery as a profitable, scalable business unit, step by step.",
    },
    heroImage: "/assets/insights/profesionalizar-delivery/hero.jpg",
    metaTitle:
      "Cómo profesionalizar el canal de delivery | Insights Pimentón",
    metaDescription:
      "Guía paso a paso para profesionalizar el delivery de tu restaurante: entender tus números, diseñar el menú, estrategia de promociones y gestión diaria basada en datos.",
    intro: [
      {
        es: "El delivery ya no es un complemento. Es una unidad de negocio. Y si no está profesionalizado, está perdiendo dinero.",
        en: "Delivery is no longer an add-on. It's a business unit. And if it isn't professionalized, it's losing money.",
      },
      {
        es: "Muchos restaurantes operan el canal digital de forma reactiva: cargan el menú, activan promociones y esperan resultados. Pero las marcas que crecen de forma sostenida lo gestionan con estructura, datos y estrategia diaria. Esta es la hoja de ruta para hacerlo bien.",
        en: "Many restaurants run the digital channel reactively: they upload the menu, turn on promotions, and wait for results. But the brands that grow sustainably manage it with structure, data, and daily strategy. This is the roadmap to do it right.",
      },
    ],
    stats: [
      {
        value: { es: "5", en: "5" },
        label: {
          es: "pasos. No un proyecto eterno.",
          en: "steps. Not an endless project.",
        },
      },
      {
        value: { es: "1", en: "1" },
        label: {
          es: "unidad de negocio, no un extra de la cocina.",
          en: "business unit, not a kitchen side quest.",
        },
      },
      {
        value: { es: "24/7", en: "24/7" },
        label: {
          es: "el canal no se opera solo.",
          en: "the channel does not run itself.",
        },
      },
    ],
    featuredChart: {
      kind: "steps",
      kicker: { es: "Hoja de ruta", en: "Roadmap" },
      title: {
        es: "De canal reactivo a unidad de negocio",
        en: "From reactive channel to business unit",
      },
      caption: {
        es: "El orden importa: sin números reales, el menú y las promos se diseñan a ciegas.",
        en: "Order matters: without real numbers, the menu and promos are designed blind.",
      },
      tone: "dark",
      items: [
        {
          label: { es: "Entender tus números reales", en: "Understand your real numbers" },
          value: 20,
          display: { es: "Margen, ticket, comisión, promos", en: "Margin, ticket, commission, promos" },
        },
        {
          label: { es: "Diseñar el menú para vender mejor", en: "Design the menu to sell better" },
          value: 40,
          display: { es: "Arquitectura, fotos, combos", en: "Architecture, photos, combos" },
        },
        {
          label: { es: "Promociones con objetivo", en: "Promotions with a goal" },
          value: 60,
          display: { es: "Visibilidad, adquisición o margen", en: "Visibility, acquisition, or margin" },
        },
        {
          label: { es: "Gestión diaria del canal", en: "Daily channel management" },
          value: 80,
          display: { es: "Precios, ranking, stock", en: "Prices, ranking, stock" },
        },
        {
          label: { es: "Integrarlo al resto del negocio", en: "Integrate it with the rest of the business" },
          value: 100,
          display: { es: "Marca, cocina, fidelización", en: "Brand, kitchen, loyalty" },
          accent: true,
        },
      ],
    },
    secciones: [
      {
        heading: {
          es: "Paso 1 – Entender tus números reales",
          en: "Step 1 – Understand your real numbers",
        },
        headingAccent: { es: "Paso 1", en: "Step 1" },
        parrafos: [
          { es: "Antes de optimizar, necesitas claridad.", en: "Before optimizing, you need clarity." },
          {
            es: "Métricas básicas que todo restaurante debería conocer:",
            en: "Basic metrics every restaurant should know:",
          },
        ],
        bullets: [
          { es: "Margen por producto en app", en: "Margin per product in the app" },
          { es: "Ticket promedio", en: "Average ticket" },
          { es: "Comisión real por pedido", en: "Real commission per order" },
          { es: "Costo de promociones activas", en: "Cost of active promotions" },
          { es: "Rentabilidad por canal", en: "Profitability per channel" },
        ],
        cierreParrafos: [
          {
            es: "Sin esta base, cualquier decisión es intuición.",
            en: "Without this foundation, any decision is just intuition.",
          },
        ],
        figure: {
          src: "/assets/gallery/dashboard-analisis.webp",
          alt: {
            es: "Dashboard de métricas de delivery: ticket, margen y pedidos",
            en: "Delivery metrics dashboard: ticket, margin, and orders",
          },
          caption: {
            es: "Paso 1: si no está en el tablero, no existe. Margen por producto, ticket, comisión real, costo de promos.",
            en: "Step 1: if it isn't on the dashboard, it doesn't exist. Margin per product, ticket, real commission, promo cost.",
          },
        },
      },
      {
        heading: {
          es: "Paso 2 – Diseñar el menú para vender mejor",
          en: "Step 2 – Design the menu to sell better",
        },
        headingAccent: { es: "Paso 2", en: "Step 2" },
        parrafos: [
          {
            es: "La carta física no funciona igual en una app. Un menú profesional en delivery:",
            en: "The physical menu doesn't work the same in an app. A professional delivery menu:",
          },
        ],
        bullets: [
          { es: "Prioriza productos de mayor margen", en: "Prioritizes higher-margin products" },
          { es: "Simplifica categorías", en: "Simplifies categories" },
          { es: "Optimiza descripciones", en: "Optimizes descriptions" },
          { es: "Usa imágenes de alta calidad", en: "Uses high-quality images" },
          { es: "Crea combos estratégicos", en: "Creates strategic combos" },
        ],
        cierreParrafos: [
          {
            es: "El diseño del menú impacta directamente en facturación y rentabilidad.",
            en: "Menu design directly impacts revenue and profitability.",
          },
        ],
        figure: {
          src: "/assets/gallery/plato-sushi.webp",
          alt: {
            es: "Plato de sushi con presentación pensada para foto de menú digital",
            en: "Sushi plate with presentation designed for a digital menu photo",
          },
          caption: {
            es: "La carta física no se copia a la app. Se rediseña: menos categorías, más margen arriba, fotos que venden.",
            en: "The physical menu isn't copied into the app. It's redesigned: fewer categories, more margin up top, photos that sell.",
          },
        },
      },
      {
        heading: {
          es: "Paso 3 – Definir una estrategia de promociones inteligente",
          en: "Step 3 – Define a smart promotions strategy",
        },
        headingAccent: { es: "Paso 3", en: "Step 3" },
        parrafos: [
          {
            es: "No todas las promos sirven. Una estrategia profesional:",
            en: "Not all promos work. A professional strategy:",
          },
        ],
        bullets: [
          {
            es: "Define objetivos claros (visibilidad, adquisición, rentabilidad)",
            en: "Defines clear goals (visibility, acquisition, profitability)",
          },
          { es: "Mide impacto real", en: "Measures real impact" },
          {
            es: "Evita descuentos permanentes sin análisis",
            en: "Avoids permanent discounts without analysis",
          },
          { es: "Ajusta según estacionalidad", en: "Adjusts for seasonality" },
        ],
        cierreParrafos: [
          {
            es: "Promocionar sin estrategia puede aumentar ventas… y reducir margen.",
            en: "Promoting without a strategy can increase sales… and reduce margin.",
          },
        ],
        chart: {
          kind: "bars",
          kicker: { es: "Objetivo de la promo", en: "Promo goal" },
          title: {
            es: "No todas las promos sirven para lo mismo",
            en: "Not every promo is for the same job",
          },
          caption: {
            es: "Si no definís el objetivo, la promo por defecto es descuento permanente — y eso no es estrategia.",
            en: "If you don't define the goal, the default promo is a permanent discount — and that isn't a strategy.",
          },
          items: [
            {
              label: { es: "Visibilidad (aparecer más)", en: "Visibility (show up more)" },
              value: 70,
              display: { es: "Corto plazo", en: "Short term" },
            },
            {
              label: { es: "Adquisición (cliente nuevo)", en: "Acquisition (new customer)" },
              value: 55,
              display: { es: "Con tope", en: "Capped" },
            },
            {
              label: { es: "Rentabilidad (ticket / mix)", en: "Profitability (ticket / mix)" },
              value: 88,
              display: { es: "La que escala", en: "The one that scales" },
              accent: true,
            },
          ],
        },
      },
      {
        heading: {
          es: "Paso 4 – Gestionar el canal todos los días",
          en: "Step 4 – Manage the channel every day",
        },
        headingAccent: { es: "Paso 4", en: "Step 4" },
        parrafos: [
          {
            es: "El delivery es dinámico. Los algoritmos cambian, la competencia se mueve, el comportamiento del consumidor evoluciona.",
            en: "Delivery is dynamic. Algorithms change, competitors move, consumer behavior evolves.",
          },
          { es: "La gestión diaria implica:", en: "Daily management involves:" },
        ],
        bullets: [
          { es: "Revisar métricas", en: "Reviewing metrics" },
          { es: "Ajustar precios", en: "Adjusting prices" },
          { es: "Optimizar productos", en: "Optimizing products" },
          { es: "Evaluar posicionamiento en la app", en: "Evaluating positioning in the app" },
          { es: "Tomar decisiones basadas en datos", en: "Making data-driven decisions" },
        ],
        cierreParrafos: [
          { es: "No es un canal “automático”.", en: "It's not an “automatic” channel." },
        ],
        figure: {
          src: "/assets/gallery/preparacion-pedido-veggie.webp",
          alt: {
            es: "Preparación de un pedido veggie en cocina, operación diaria de delivery",
            en: "Veggie order being prepared in the kitchen, daily delivery operations",
          },
          caption: {
            es: "La gestión diaria es prosaica: stock, tiempos, ranking, precios. El algoritmo se mueve; el restaurante también tiene que moverse.",
            en: "Daily management is prosaic: stock, times, ranking, prices. The algorithm moves; the restaurant has to move too.",
          },
        },
      },
      {
        heading: {
          es: "Paso 5 – Pensar el delivery como parte del negocio, no como algo aislado",
          en: "Step 5 – Think of delivery as part of the business, not something isolated",
        },
        headingAccent: { es: "Paso 5", en: "Step 5" },
        parrafos: [
          { es: "El canal digital impacta en:", en: "The digital channel impacts:" },
        ],
        bullets: [
          { es: "Branding", en: "Branding" },
          { es: "Percepción de marca", en: "Brand perception" },
          { es: "Experiencia del cliente", en: "Customer experience" },
          { es: "Fidelización", en: "Loyalty" },
        ],
        cierreParrafos: [
          {
            es: "Cuando está alineado con la operación interna, potencia todo el negocio. Cuando no, genera fricción.",
            en: "When it's aligned with internal operations, it boosts the whole business. When it isn't, it creates friction.",
          },
        ],
        figure: {
          src: "/assets/gallery/repartidor-rappi.webp",
          alt: {
            es: "Repartidor entregando un pedido: el delivery como cara de la marca",
            en: "Courier delivering an order: delivery as the face of the brand",
          },
          caption: {
            es: "El cliente no separa “la app” de tu restaurante. Packaging, tiempos y trato son marca — aunque el pedido haya salido por marketplace.",
            en: "The customer doesn't separate “the app” from your restaurant. Packaging, times, and handling are brand — even if the order left through a marketplace.",
          },
        },
      },
    ],
    conclusion: [
      {
        es: "Profesionalizar el delivery no significa hacerlo más complejo. Significa hacerlo estratégico.",
        en: "Professionalizing delivery doesn't mean making it more complex. It means making it strategic.",
      },
      {
        es: "Con estructura, análisis y enfoque en rentabilidad, el canal deja de ser una urgencia operativa y se convierte en una fuente sólida de crecimiento.",
        en: "With structure, analysis, and a focus on profitability, the channel stops being an operational emergency and becomes a solid source of growth.",
      },
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
