/**
 * Data layer del blog /insights (estático, sin CMS). El hub (/insights) y la
 * template dinámica (/insights/[slug]) se renderizan desde acá. Para sumar un
 * artículo, agregá un objeto a `insights` — sin tocar componentes.
 *
 * Contenido bilingüe {es,en}: español neutro + inglés. Los componentes (client)
 * resuelven el idioma activo con useT(); el server elige metaTitle y
 * metaDescription según /es o /en. Las imágenes de hero viven en
 * /public/assets/insights/[slug]/.
 */

type Localized = { es: string; en: string; it: string };

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
  metaTitle: Localized;
  metaDescription: Localized;
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
      it: "Perché il tuo delivery vende, ma non è redditizio (e come risolverlo)",
    },
    categoria: { es: "Rentabilidad", en: "Profitability", it: "Redditività" },
    fecha: "2026-02-18",
    fechaDisplay: { es: "18 feb 2026", en: "Feb 18, 2026", it: "18 feb 2026" },
    excerpt: {
      es: "Muchos restaurantes aumentan pedidos en apps de delivery, pero el margen no mejora. Te explicamos por qué sucede y cómo transformar el canal en una unidad realmente rentable.",
      en: "Many restaurants grow orders on delivery apps, but their margin doesn't improve. We explain why it happens and how to turn the channel into a truly profitable unit.",
      it: "Molti ristoranti aumentano gli ordini sulle app di delivery, ma il margine non migliora. Ti spieghiamo perché succede e come trasformare il canale in un'unità davvero redditizia.",
    },
    resumen: {
      es: "Vender más no siempre es ganar más. Por qué tu delivery pierde margen y cómo revertirlo.",
      en: "Selling more isn't always earning more. Why your delivery loses margin and how to reverse it.",
      it: "Vendere di più non significa sempre guadagnare di più. Perché il tuo delivery perde margine e come invertire la rotta.",
    },
    heroImage: "/assets/insights/delivery-rentable/hero.jpg",
    metaTitle: {
      es: "Por qué tu delivery vende pero no es rentable | Insights Pimentón",
      en: "Why your delivery sells but isn't profitable | Pimentón Insights",
      it: "Perché il tuo delivery vende ma non rende | Insights Pimentón",
    },
    metaDescription: {
      es: "Vender más no es ganar más. Descubre por qué tu delivery pierde margen y cómo convertirlo en una unidad de negocio rentable con estrategia, datos y pricing.",
      en: "Selling more isn't earning more. Why your delivery loses margin, and how to turn it into a profitable unit with strategy, data, and pricing.",
      it: "Vendere di più non è guadagnare di più. Scopri perché il tuo delivery perde margine e come renderlo un business redditizio con strategia, dati e pricing.",
    },
    intro: [
      {
        es: "Tu delivery puede estar creciendo… y al mismo tiempo estar perdiendo rentabilidad. Vender más no siempre significa ganar más.",
        en: "Your delivery can be growing… and losing profitability at the same time. Selling more doesn't always mean earning more.",
        it: "Il tuo delivery può crescere… e allo stesso tempo perdere redditività. Vendere di più non significa sempre guadagnare di più.",
      },
      {
        es: "En los marketplaces es común ver un aumento en pedidos mientras el margen se diluye entre comisiones, promociones mal diseñadas y precios desalineados. El problema no suele ser la falta de ventas, sino la falta de estructura estratégica.",
        en: "On marketplaces it's common to see orders rise while margin dilutes between commissions, poorly designed promotions, and misaligned prices. The problem usually isn't a lack of sales, but a lack of strategic structure.",
        it: "Sui marketplace è comune vedere gli ordini aumentare mentre il margine si diluisce tra commissioni, promozioni progettate male e prezzi disallineati. Il problema di solito non è la mancanza di vendite, ma la mancanza di una struttura strategica.",
      },
    ],
    stats: [
      {
        value: { es: "30%", en: "30%", it: "30%" },
        label: {
          es: "del ticket se va en comisión, antes de cocinar.",
          en: "of the ticket goes to commission, before you cook.",
          it: "del ticket se ne va in commissioni, prima ancora di cucinare.",
        },
      },
      {
        value: { es: "15%", en: "15%", it: "15%" },
        label: {
          es: "margen típico cuando nadie arma el P&L por pedido.",
          en: "typical margin when nobody builds a P&L per order.",
          it: "margine tipico quando nessuno costruisce il P&L per ordine.",
        },
      },
      {
        value: { es: "0", en: "0", it: "0" },
        label: {
          es: "decisiones buenas sin dato de contribución.",
          en: "good decisions without contribution data.",
          it: "decisioni giuste senza il dato di contribuzione.",
        },
      },
    ],
    featuredChart: {
      kind: "stack",
      kicker: { es: "Ejemplo ilustrativo", en: "Illustrative example", it: "Esempio illustrativo" },
      title: {
        es: "A dónde se va un pedido de $100",
        en: "Where a $100 order actually goes",
        it: "Dove finisce un ordine da $100",
      },
      caption: {
        es: "Sin P&L por orden, el margen se diluye entre comisión, packaging y promos. Cada restaurante tiene su propia estructura: esto es una foto típica, no una promesa.",
        en: "Without a P&L per order, margin dilutes across commission, packaging, and promos. Every restaurant has its own structure — this is a typical snapshot, not a promise.",
        it: "Senza un P&L per ordine, il margine si diluisce tra commissione, packaging e promo. Ogni ristorante ha la sua struttura: questa è una fotografia tipica, non una promessa.",
      },
      items: [
        { label: { es: "Comida", en: "Food", it: "Cibo" }, value: 32, display: { es: "$32", en: "$32", it: "$32" } },
        { label: { es: "Comisión", en: "Commission", it: "Commissione" }, value: 28, display: { es: "$28", en: "$28", it: "$28" } },
        { label: { es: "Packaging y ads", en: "Packaging & ads", it: "Packaging e ads" }, value: 12, display: { es: "$12", en: "$12", it: "$12" } },
        { label: { es: "Promo", en: "Promo", it: "Promo" }, value: 10, display: { es: "$10", en: "$10", it: "$10" } },
        {
          label: { es: "Margen", en: "Margin", it: "Margine" },
          value: 18,
          display: { es: "$18", en: "$18", it: "$18" },
          accent: true,
        },
      ],
    },
    secciones: [
      {
        heading: {
          es: "El error más común: medir volumen y no rentabilidad",
          en: "The most common mistake: measuring volume, not profitability",
          it: "L'errore più comune: misurare il volume e non la redditività",
        },
        headingAccent: { es: "rentabilidad", en: "profitability", it: "redditività" },
        parrafos: [
          {
            es: "Muchos restaurantes celebran el crecimiento en órdenes mensuales. Pero pocas veces analizan el margen real por pedido.",
            en: "Many restaurants celebrate growth in monthly orders. But they rarely analyze the real margin per order.",
            it: "Molti ristoranti festeggiano la crescita degli ordini mensili. Ma raramente analizzano il margine reale per ordine.",
          },
          {
            es: "Preguntas clave que casi nadie se hace:",
            en: "Key questions almost no one asks:",
            it: "Domande chiave che quasi nessuno si pone:",
          },
        ],
        bullets: [
          {
            es: "¿Cuánto margen deja cada producto dentro de la app?",
            en: "How much margin does each product leave inside the app?",
            it: "Quanto margine lascia ogni prodotto dentro l'app?",
          },
          { es: "¿La promo compensa la comisión?", en: "Does the promo offset the commission?", it: "La promo compensa la commissione?" },
          {
            es: "¿El combo más vendido es realmente rentable?",
            en: "Is the best-selling combo actually profitable?",
            it: "Il combo più venduto è davvero redditizio?",
          },
        ],
        cierreParrafos: [
          {
            es: "Sin esta información, el canal crece desordenado.",
            en: "Without this information, the channel grows in a disorganized way.",
            it: "Senza queste informazioni, il canale cresce in modo disordinato.",
          },
        ],
        chart: {
          kind: "compare",
          kicker: { es: "El mismo mes", en: "The same month", it: "Lo stesso mese" },
          title: {
            es: "Dos lecturas del canal. Sólo una paga.",
            en: "Two readings of the channel. Only one pays.",
            it: "Due letture del canale. Solo una paga.",
          },
          caption: {
            es: "Celebrar órdenes mientras el margen cae es el error más caro del delivery.",
            en: "Celebrating orders while margin falls is delivery's most expensive mistake.",
            it: "Festeggiare gli ordini mentre il margine scende è l'errore più costoso del delivery.",
          },
          items: [
            {
              label: { es: "Órdenes (lo que se celebra)", en: "Orders (what gets celebrated)", it: "Ordini (ciò che si festeggia)" },
              value: 42,
              display: { es: "+42%", en: "+42%", it: "+42%" },
            },
            {
              label: { es: "Margen por pedido (lo que importa)", en: "Margin per order (what matters)", it: "Margine per ordine (ciò che conta)" },
              value: 18,
              display: { es: "−18%", en: "−18%", it: "−18%" },
              accent: true,
            },
          ],
        },
      },
      {
        heading: {
          es: "Promociones que aumentan ventas, pero destruyen margen",
          en: "Promotions that boost sales but destroy margin",
          it: "Promozioni che aumentano le vendite, ma distruggono il margine",
        },
        headingAccent: { es: "margen", en: "margin", it: "margine" },
        parrafos: [
          {
            es: "Las apps incentivan descuentos constantes. El problema es que muchas promociones:",
            en: "Apps incentivize constant discounts. The problem is that many promotions:",
            it: "Le app spingono verso sconti continui. Il problema è che molte promozioni:",
          },
        ],
        bullets: [
          { es: "No elevan ticket promedio", en: "Don't raise the average ticket", it: "Non alzano il ticket medio" },
          { es: "Canibalizan ventas orgánicas", en: "Cannibalize organic sales", it: "Cannibalizzano le vendite organiche" },
          {
            es: "Atraen clientes sensibles solo al precio",
            en: "Attract customers who care only about price",
            it: "Attirano clienti sensibili solo al prezzo",
          },
        ],
        cierreParrafos: [
          {
            es: "Una promoción estratégica debe tener un objetivo claro: aumentar margen, visibilidad o adquisición. Si no cumple una función, está erosionando rentabilidad.",
            en: "A strategic promotion must have a clear goal: increase margin, visibility, or acquisition. If it doesn't serve a function, it's eroding profitability.",
            it: "Una promozione strategica deve avere un obiettivo chiaro: aumentare margine, visibilità o acquisizione. Se non svolge una funzione, sta erodendo la redditività.",
          },
        ],
        figure: {
          src: "/assets/gallery/dashboard-analisis.webp",
          alt: {
            es: "Tablero de análisis de delivery con métricas de margen y pedidos",
            en: "Delivery analytics dashboard with margin and order metrics",
            it: "Dashboard di analisi del delivery con metriche di margine e ordini",
          },
          caption: {
            es: "Si la promo no aparece en un tablero de contribución, se está evaluando por volumen — no por margen.",
            en: "If the promo doesn't show up on a contribution dashboard, you're judging it by volume — not margin.",
            it: "Se la promo non compare in una dashboard di contribuzione, la stai valutando per volume — non per margine.",
          },
        },
      },
      {
        heading: {
          es: "Arquitectura de menú y pricing mal optimizados",
          en: "Poorly optimized menu architecture and pricing",
          it: "Architettura del menu e pricing ottimizzati male",
        },
        headingAccent: { es: "pricing", en: "pricing", it: "pricing" },
        parrafos: [
          {
            es: "El orden del menú impacta en lo que el cliente elige. Un canal bien operado:",
            en: "The menu order impacts what the customer chooses. A well-run channel:",
            it: "L'ordine del menu influisce su ciò che il cliente sceglie. Un canale gestito bene:",
          },
        ],
        bullets: [
          { es: "Destaca productos de mayor margen", en: "Highlights higher-margin products", it: "Mette in evidenza i prodotti a margine più alto" },
          {
            es: "Diseña combos que elevan ticket promedio",
            en: "Designs combos that raise the average ticket",
            it: "Progetta combo che alzano il ticket medio",
          },
          {
            es: "Ajusta precios según comportamiento del consumidor",
            en: "Adjusts prices based on consumer behavior",
            it: "Adegua i prezzi in base al comportamento del consumatore",
          },
        ],
        cierreParrafos: [
          {
            es: "El delivery no es solo publicar la carta física en una app. Es diseñar una experiencia digital estratégica.",
            en: "Delivery isn't just posting your physical menu on an app. It's designing a strategic digital experience.",
            it: "Il delivery non è solo pubblicare il menu cartaceo su un'app. È progettare un'esperienza digitale strategica.",
          },
        ],
        figure: {
          src: "/assets/gallery/plato-burguer.webp",
          alt: {
            es: "Plato de burger gourmet listo para delivery",
            en: "Gourmet burger plate ready for delivery",
            it: "Piatto di burger gourmet pronto per il delivery",
          },
          caption: {
            es: "El producto de mayor margen tiene que verse primero. En la app, lo que no se ve no se vende.",
            en: "The highest-margin product has to be seen first. In the app, what isn't seen doesn't sell.",
            it: "Il prodotto con il margine più alto deve vedersi per primo. Nell'app, ciò che non si vede non si vende.",
          },
        },
      },
      {
        heading: {
          es: "El delivery como unidad de negocio",
          en: "Delivery as a business unit",
          it: "Il delivery come unità di business",
        },
        headingAccent: { es: "unidad de negocio", en: "business unit", it: "unità di business" },
        parrafos: [
          {
            es: "Cuando se analiza correctamente, el canal digital puede:",
            en: "When analyzed correctly, the digital channel can:",
            it: "Se analizzato correttamente, il canale digitale può:",
          },
        ],
        bullets: [
          { es: "Aumentar facturación", en: "Increase revenue", it: "Aumentare il fatturato" },
          { es: "Mejorar margen promedio", en: "Improve average margin", it: "Migliorare il margine medio" },
          { es: "Generar previsibilidad mensual", en: "Generate monthly predictability", it: "Generare prevedibilità mensile" },
        ],
        cierreParrafos: [
          {
            es: "Pero eso requiere gestión diaria, análisis de datos y ajustes constantes. No es automático. Es estratégico.",
            en: "But that requires daily management, data analysis, and constant adjustments. It's not automatic. It's strategic.",
            it: "Ma questo richiede gestione quotidiana, analisi dei dati e aggiustamenti continui. Non è automatico. È strategico.",
          },
        ],
        figure: {
          src: "/assets/services/service_gestion-integral.webp",
          alt: {
            es: "Operación integral de delivery: cocina, packing y control",
            en: "End-to-end delivery operations: kitchen, packing, and control",
            it: "Operatività del delivery end-to-end: cucina, packing e controllo",
          },
          caption: {
            es: "Cuando el canal se opera como unidad de negocio, cocina, pricing y data dejan de vivir en silos.",
            en: "When the channel is run as a business unit, kitchen, pricing, and data stop living in silos.",
            it: "Quando il canale è gestito come unità di business, cucina, pricing e dati smettono di vivere in compartimenti stagni.",
          },
        },
      },
    ],
    conclusion: [
      { es: "El objetivo no es vender más. Es vender mejor.", en: "The goal isn't to sell more. It's to sell better.", it: "L'obiettivo non è vendere di più. È vendere meglio." },
      {
        es: "Un delivery bien operado no depende de descuentos constantes ni de la suerte del algoritmo. Depende de decisiones informadas.",
        en: "A well-run delivery operation doesn't depend on constant discounts or the luck of the algorithm. It depends on informed decisions.",
        it: "Un delivery gestito bene non dipende da sconti continui né dalla fortuna dell'algoritmo. Dipende da decisioni informate.",
      },
    ],
  },
  {
    slug: "ticket-promedio",
    titulo: {
      es: "Cómo aumentar el ticket promedio en apps de delivery (sin depender de descuentos)",
      en: "How to raise the average ticket on delivery apps (without relying on discounts)",
      it: "Come aumentare il ticket medio sulle app di delivery (senza dipendere dagli sconti)",
    },
    categoria: { es: "Estrategia", en: "Strategy", it: "Strategia" },
    fecha: "2026-02-18",
    fechaDisplay: { es: "18 feb 2026", en: "Feb 18, 2026", it: "18 feb 2026" },
    excerpt: {
      es: "Subir el ticket promedio es una de las formas más efectivas de mejorar la rentabilidad en delivery. Te mostramos estrategias prácticas para lograrlo sin erosionar margen.",
      en: "Raising the average ticket is one of the most effective ways to improve delivery profitability. We show you practical strategies to do it without eroding margin.",
      it: "Alzare il ticket medio è uno dei modi più efficaci per migliorare la redditività del delivery. Ti mostriamo strategie pratiche per riuscirci senza erodere il margine.",
    },
    resumen: {
      es: "Estrategias prácticas para subir el ticket promedio y mejorar el margen sin depender de descuentos.",
      en: "Practical strategies to raise the average ticket and improve margin without relying on discounts.",
      it: "Strategie pratiche per alzare il ticket medio e migliorare il margine senza dipendere dagli sconti.",
    },
    heroImage: "/assets/insights/ticket-promedio/hero.jpg",
    metaTitle: {
      es: "Cómo aumentar el ticket promedio en delivery | Insights Pimentón",
      en: "How to raise the average delivery ticket | Pimentón Insights",
      it: "Come aumentare il ticket medio nel delivery | Insights Pimentón",
    },
    metaDescription: {
      es: "Mejora tu rentabilidad en delivery subiendo el ticket promedio, no bajando precios. Combos estratégicos, arquitectura de menú, upselling y pricing inteligente.",
      en: "Improve delivery profitability by raising the average ticket, not by cutting prices. Strategic combos, menu architecture, upselling, and smarter pricing.",
      it: "Migliora la redditività del delivery alzando il ticket medio, non abbassando i prezzi. Combo strategici, architettura del menu, upselling e pricing mirato.",
    },
    intro: [
      {
        es: "Si quieres mejorar tu rentabilidad en delivery, no empieces bajando precios. Empieza subiendo el ticket promedio.",
        en: "If you want to improve your delivery profitability, don't start by lowering prices. Start by raising the average ticket.",
        it: "Se vuoi migliorare la redditività del tuo delivery, non iniziare abbassando i prezzi. Inizia alzando il ticket medio.",
      },
      {
        es: "Muchos restaurantes intentan crecer aumentando pedidos. Pero una estrategia más inteligente es lograr que cada orden facture más. El impacto en margen es inmediato… y mucho más saludable.",
        en: "Many restaurants try to grow by increasing orders. But a smarter strategy is to get each order to bill more. The impact on margin is immediate… and much healthier.",
        it: "Molti ristoranti cercano di crescere aumentando gli ordini. Ma una strategia più intelligente è fare in modo che ogni ordine fatturi di più. L'impatto sul margine è immediato… e molto più sano.",
      },
    ],
    stats: [
      {
        value: { es: "+15%", en: "+15%", it: "+15%" },
        label: {
          es: "de ticket extra, sin descuento permanente.",
          en: "extra ticket, with no permanent discount.",
          it: "di ticket in più, senza sconti permanenti.",
        },
      },
      {
        value: { es: "3×", en: "3×", it: "3×" },
        label: {
          es: "más sano que empujar volumen a costa de margen.",
          en: "healthier than pushing volume at the cost of margin.",
          it: "più sano che spingere il volume a scapito del margine.",
        },
      },
      {
        value: { es: "0", en: "0", it: "0" },
        label: {
          es: "promos agresivas necesarias para vender mejor.",
          en: "aggressive promos needed to sell better.",
          it: "promo aggressive necessarie per vendere meglio.",
        },
      },
    ],
    featuredChart: {
      kind: "bars",
      kicker: { es: "Impacto relativo", en: "Relative impact", it: "Impatto relativo" },
      title: {
        es: "Qué mueve más el margen (sin quemar precio)",
        en: "What moves margin more (without burning price)",
        it: "Cosa sposta di più il margine (senza bruciare il prezzo)",
      },
      caption: {
        es: "Un +15% de ticket suele dejar más contribución que un +30% de órdenes comprado con descuento. El volumen sin ticket es ruido.",
        en: "A +15% ticket usually leaves more contribution than a +30% order lift bought with discounts. Volume without ticket is noise.",
        it: "Un +15% di ticket di solito lascia più contribuzione di un +30% di ordini comprato con lo sconto. Il volume senza ticket è rumore.",
      },
      tone: "dark",
      items: [
        {
          label: { es: "Subir ticket 15% con combos", en: "Raise ticket 15% with combos", it: "Alzare il ticket del 15% con i combo" },
          value: 92,
          display: { es: "Alto", en: "High", it: "Alto" },
          accent: true,
        },
        {
          label: { es: "Subir órdenes 30% con promo", en: "Raise orders 30% with a promo", it: "Aumentare gli ordini del 30% con una promo" },
          value: 48,
          display: { es: "Medio", en: "Medium", it: "Medio" },
        },
        {
          label: { es: "Bajar precios para competir", en: "Cut prices to compete", it: "Abbassare i prezzi per competere" },
          value: 18,
          display: { es: "Negativo", en: "Negative", it: "Negativo" },
        },
      ],
    },
    secciones: [
      {
        heading: {
          es: "Por qué el ticket promedio es la métrica que más impacto tiene",
          en: "Why average ticket is the metric with the biggest impact",
          it: "Perché il ticket medio è la metrica con più impatto",
        },
        headingAccent: { es: "ticket promedio", en: "average ticket", it: "ticket medio" },
        parrafos: [
          { es: "Subir el ticket promedio mejora:", en: "Raising the average ticket improves:", it: "Alzare il ticket medio migliora:" },
        ],
        bullets: [
          { es: "Margen por pedido", en: "Margin per order", it: "Margine per ordine" },
          { es: "Eficiencia operativa", en: "Operational efficiency", it: "Efficienza operativa" },
          { es: "Rentabilidad frente a comisiones", en: "Profitability against commissions", it: "Redditività rispetto alle commissioni" },
        ],
        cierreParrafos: [
          {
            es: "Si tu ticket promedio aumenta un 15%, el impacto en margen puede ser mayor que aumentar 30% las órdenes. Y no requiere descuentos.",
            en: "If your average ticket rises 15%, the impact on margin can be greater than a 30% increase in orders. And it requires no discounts.",
            it: "Se il tuo ticket medio aumenta del 15%, l'impatto sul margine può essere maggiore che aumentare gli ordini del 30%. E non richiede sconti.",
          },
        ],
        chart: {
          kind: "compare",
          kicker: { es: "Misma cocina", en: "Same kitchen", it: "Stessa cucina" },
          title: {
            es: "+15% ticket vs +30% órdenes",
            en: "+15% ticket vs +30% orders",
            it: "+15% ticket vs +30% ordini",
          },
          caption: {
            es: "Más pedidos implican más packing, más picos y más comisión. Más ticket aprovecha el pedido que ya entró.",
            en: "More orders mean more packing, more peaks, and more commission. More ticket leverages the order that already came in.",
            it: "Più ordini significano più packing, più picchi e più commissioni. Più ticket sfrutta l'ordine che è già entrato.",
          },
          items: [
            {
              label: { es: "Ticket promedio", en: "Average ticket", it: "Ticket medio" },
              value: 15,
              display: { es: "+15%", en: "+15%", it: "+15%" },
              accent: true,
            },
            {
              label: { es: "Órdenes con descuento", en: "Discounted orders", it: "Ordini scontati" },
              value: 30,
              display: { es: "+30%", en: "+30%", it: "+30%" },
            },
          ],
        },
      },
      {
        heading: {
          es: "Diseña combos estratégicos, no promociones",
          en: "Design strategic combos, not promotions",
          it: "Progetta combo strategici, non promozioni",
        },
        headingAccent: { es: "combos estratégicos", en: "strategic combos", it: "combo strategici" },
        parrafos: [
          {
            es: "Un error frecuente es usar descuentos agresivos para “mover volumen”. En cambio, diseña:",
            en: "A common mistake is using aggressive discounts to “move volume.” Instead, design:",
            it: "Un errore frequente è usare sconti aggressivi per “muovere volume”. Invece, progetta:",
          },
        ],
        bullets: [
          {
            es: "Combos que agrupen productos de alto margen",
            en: "Combos that group high-margin products",
            it: "Combo che raggruppino prodotti ad alto margine",
          },
          {
            es: "Opciones familiares con percepción de valor",
            en: "Family options with perceived value",
            it: "Opzioni family con un valore percepito",
          },
          {
            es: "Packs que incluyan bebidas o complementos",
            en: "Packs that include drinks or sides",
            it: "Pack che includano bevande o contorni",
          },
        ],
        cierreParrafos: [
          {
            es: "El objetivo no es vender más barato. Es vender más completo.",
            en: "The goal isn't to sell cheaper. It's to sell more complete.",
            it: "L'obiettivo non è vendere a meno. È vendere ordini più completi.",
          },
        ],
        figure: {
          src: "/assets/gallery/plato-sushi.webp",
          alt: {
            es: "Plato de sushi premium, ejemplo de producto con ticket alto",
            en: "Premium sushi plate, an example of a high-ticket product",
            it: "Piatto di sushi premium, esempio di prodotto a ticket alto",
          },
          caption: {
            es: "Un combo bien armado agrupa alto margen (plato + bebida + extra) y se siente como valor, no como descuento.",
            en: "A well-built combo groups high margin (main + drink + extra) and feels like value, not a discount.",
            it: "Un combo costruito bene raggruppa alto margine (piatto + bevanda + extra) e si percepisce come valore, non come sconto.",
          },
        },
        chart: {
          kind: "stack",
          kicker: { es: "Combo de alto margen", en: "High-margin combo", it: "Combo ad alto margine" },
          title: {
            es: "Cómo se arma un ticket más completo",
            en: "How a more complete ticket is built",
            it: "Come si costruisce un ticket più completo",
          },
          caption: {
            es: "El plato abre la orden. La bebida y el extra son el ticket que casi nadie pelea — y donde vive el margen.",
            en: "The main opens the order. The drink and the extra are the ticket almost nobody fights over — and where margin lives.",
            it: "Il piatto apre l'ordine. La bevanda e l'extra sono il ticket che quasi nessuno si contende — ed è lì che vive il margine.",
          },
          items: [
            { label: { es: "Plato principal", en: "Main", it: "Piatto principale" }, value: 58, display: { es: "58%", en: "58%", it: "58%" } },
            { label: { es: "Bebida", en: "Drink", it: "Bevanda" }, value: 24, display: { es: "24%", en: "24%", it: "24%" }, accent: true },
            { label: { es: "Extra / postre", en: "Side / dessert", it: "Extra / dessert" }, value: 18, display: { es: "18%", en: "18%", it: "18%" } },
          ],
        },
      },
      {
        heading: {
          es: "Arquitectura del menú: lo que se ve, se vende",
          en: "Menu architecture: what gets seen, gets sold",
          it: "Architettura del menu: ciò che si vede, si vende",
        },
        headingAccent: { es: "se vende", en: "gets sold", it: "si vende" },
        parrafos: [
          {
            es: "Las apps funcionan como una góndola digital. Si el producto de mayor margen está escondido al final del menú, no se vende.",
            en: "Apps work like a digital shelf. If the highest-margin product is hidden at the end of the menu, it doesn't sell.",
            it: "Le app funzionano come uno scaffale digitale. Se il prodotto con il margine più alto è nascosto in fondo al menu, non si vende.",
          },
          { es: "Algunas acciones clave:", en: "Some key actions:", it: "Alcune azioni chiave:" },
        ],
        bullets: [
          { es: "Destacar productos premium al inicio", en: "Feature premium products at the top", it: "Mettere in evidenza i prodotti premium in cima" },
          {
            es: "Usar descripciones que aumenten percepción de valor",
            en: "Use descriptions that increase perceived value",
            it: "Usare descrizioni che aumentino il valore percepito",
          },
          { es: "Incorporar fotos profesionales", en: "Add professional photos", it: "Inserire foto professionali" },
          { es: "Simplificar categorías", en: "Simplify categories", it: "Semplificare le categorie" },
        ],
        cierreParrafos: [
          { es: "El orden impacta directamente en el ticket.", en: "Order directly impacts the ticket.", it: "L'ordine influisce direttamente sul ticket." },
        ],
        figure: {
          src: "/assets/gallery/plato-burguer.webp",
          alt: {
            es: "Burger gourmet con presentación de alto valor percibido",
            en: "Gourmet burger with high perceived-value presentation",
            it: "Burger gourmet con una presentazione ad alto valore percepito",
          },
          caption: {
            es: "Foto, descripción y posición en el menú son pricing. El producto premium escondido al final no existe.",
            en: "Photo, description, and menu position are pricing. A premium product hidden at the bottom doesn't exist.",
            it: "Foto, descrizione e posizione nel menu sono pricing. Il prodotto premium nascosto in fondo non esiste.",
          },
        },
      },
      {
        heading: {
          es: "Upselling y cross-selling inteligente",
          en: "Smart upselling and cross-selling",
          it: "Upselling e cross-selling intelligente",
        },
        headingAccent: { es: "inteligente", en: "Smart", it: "intelligente" },
        parrafos: [
          { es: "Las apps permiten sugerencias automáticas:", en: "Apps allow automatic suggestions:", it: "Le app permettono suggerimenti automatici:" },
        ],
        bullets: [
          { es: "“Agrega una bebida por…”", en: "“Add a drink for…”", it: "“Aggiungi una bevanda a…”" },
          { es: "“Completa tu combo por…”", en: "“Complete your combo for…”", it: "“Completa il tuo combo a…”" },
          { es: "“Otros clientes también pidieron…”", en: "“Other customers also ordered…”", it: "“Altri clienti hanno ordinato anche…”" },
        ],
        cierreParrafos: [
          {
            es: "Cuando está bien configurado, el upselling eleva ticket promedio, no genera fricción y aumenta margen sin bajar precios. Pero requiere análisis constante.",
            en: "When set up well, upselling raises the average ticket, creates no friction, and increases margin without lowering prices. But it requires constant analysis.",
            it: "Se configurato bene, l'upselling alza il ticket medio, non crea attrito e aumenta il margine senza abbassare i prezzi. Ma richiede un'analisi costante.",
          },
        ],
        figure: {
          src: "/assets/gallery/preparacion-burguer.webp",
          alt: {
            es: "Preparación de burger en cocina para un pedido delivery",
            en: "Burger being prepared in the kitchen for a delivery order",
            it: "Preparazione di un burger in cucina per un ordine delivery",
          },
          caption: {
            es: "El upsell tiene que ser operable: si la cocina no puede sumar el extra en 30 segundos, la sugerencia de la app es teatro.",
            en: "The upsell has to be operable: if the kitchen can't add the extra in 30 seconds, the app suggestion is theater.",
            it: "L'upsell deve essere gestibile: se la cucina non riesce ad aggiungere l'extra in 30 secondi, il suggerimento dell'app è solo teatro.",
          },
        },
      },
      {
        heading: {
          es: "Precio estratégico vs precio competitivo",
          en: "Strategic pricing vs. competitive pricing",
          it: "Prezzo strategico vs prezzo competitivo",
        },
        headingAccent: { es: "estratégico", en: "Strategic", it: "strategico" },
        parrafos: [
          {
            es: "Muchos restaurantes fijan precios en apps “mirando a la competencia”. El problema: no consideran estructura de costos ni comisión.",
            en: "Many restaurants set prices on apps “by watching the competition.” The problem: they don't consider cost structure or commission.",
            it: "Molti ristoranti fissano i prezzi sulle app “guardando la concorrenza”. Il problema: non considerano né la struttura dei costi né la commissione.",
          },
          { es: "Un pricing correcto en marketplaces:", en: "Correct pricing on marketplaces:", it: "Un pricing corretto sui marketplace:" },
        ],
        bullets: [
          { es: "Compensa comisión", en: "Offsets commission", it: "Compensa la commissione" },
          { es: "Mantiene percepción de marca", en: "Maintains brand perception", it: "Mantiene la percezione del brand" },
          { es: "Sostiene margen", en: "Sustains margin", it: "Sostiene il margine" },
        ],
        cierreParrafos: [
          {
            es: "No se trata de ser el más barato. Se trata de ser rentable.",
            en: "It's not about being the cheapest. It's about being profitable.",
            it: "Non si tratta di essere il più economico. Si tratta di essere redditizio.",
          },
        ],
      },
    ],
    conclusion: [
      {
        es: "El crecimiento sano en delivery no depende de descuentos permanentes. Depende de diseño estratégico del menú, arquitectura digital y análisis de datos.",
        en: "Healthy growth in delivery doesn't depend on permanent discounts. It depends on strategic menu design, digital architecture, and data analysis.",
        it: "Una crescita sana nel delivery non dipende da sconti permanenti. Dipende dal design strategico del menu, dall'architettura digitale e dall'analisi dei dati.",
      },
      {
        es: "Cuando el ticket promedio sube, la rentabilidad deja de ser un problema.",
        en: "When the average ticket rises, profitability stops being a problem.",
        it: "Quando il ticket medio sale, la redditività smette di essere un problema.",
      },
    ],
  },
  {
    slug: "profesionalizar-delivery",
    titulo: {
      es: "Cómo profesionalizar el canal de delivery en tu restaurante (guía paso a paso)",
      en: "How to professionalize the delivery channel in your restaurant (step-by-step guide)",
      it: "Come professionalizzare il canale delivery nel tuo ristorante (guida passo passo)",
    },
    categoria: { es: "Operación", en: "Operations", it: "Operatività" },
    fecha: "2026-02-12",
    fechaDisplay: { es: "12 feb 2026", en: "Feb 12, 2026", it: "12 feb 2026" },
    excerpt: {
      es: "El delivery ya no es un canal secundario. En esta guía te mostramos cómo estructurarlo como una verdadera unidad de negocio rentable y escalable.",
      en: "Delivery is no longer a secondary channel. In this guide we show you how to structure it as a truly profitable and scalable business unit.",
      it: "Il delivery non è più un canale secondario. In questa guida ti mostriamo come strutturarlo come una vera unità di business redditizia e scalabile.",
    },
    resumen: {
      es: "Cómo estructurar tu delivery como una unidad de negocio rentable y escalable, paso a paso.",
      en: "How to structure your delivery as a profitable, scalable business unit, step by step.",
      it: "Come strutturare il tuo delivery come un'unità di business redditizia e scalabile, passo dopo passo.",
    },
    heroImage: "/assets/insights/profesionalizar-delivery/hero.jpg",
    metaTitle: {
      es: "Cómo profesionalizar el canal de delivery | Insights Pimentón",
      en: "How to professionalize your delivery channel | Pimentón Insights",
      it: "Come professionalizzare il canale delivery | Insights Pimentón",
    },
    metaDescription: {
      es: "Guía paso a paso para profesionalizar el delivery de tu restaurante: entender tus números, diseñar el menú, estrategia de promociones y gestión diaria basada en datos.",
      en: "A step-by-step guide to professionalize restaurant delivery: understand your numbers, design the menu, promotion strategy, and daily management based on data.",
      it: "Guida passo passo per professionalizzare il delivery del tuo ristorante: capire i numeri, progettare il menu, strategia promo e gestione quotidiana sui dati.",
    },
    intro: [
      {
        es: "El delivery ya no es un complemento. Es una unidad de negocio. Y si no está profesionalizado, está perdiendo dinero.",
        en: "Delivery is no longer an add-on. It's a business unit. And if it isn't professionalized, it's losing money.",
        it: "Il delivery non è più un complemento. È un'unità di business. E se non è professionalizzato, sta perdendo soldi.",
      },
      {
        es: "Muchos restaurantes operan el canal digital de forma reactiva: cargan el menú, activan promociones y esperan resultados. Pero las marcas que crecen de forma sostenida lo gestionan con estructura, datos y estrategia diaria. Esta es la hoja de ruta para hacerlo bien.",
        en: "Many restaurants run the digital channel reactively: they upload the menu, turn on promotions, and wait for results. But the brands that grow sustainably manage it with structure, data, and daily strategy. This is the roadmap to do it right.",
        it: "Molti ristoranti gestiscono il canale digitale in modo reattivo: caricano il menu, attivano le promozioni e aspettano i risultati. Ma i brand che crescono in modo sostenibile lo gestiscono con struttura, dati e strategia quotidiana. Questa è la roadmap per farlo bene.",
      },
    ],
    stats: [
      {
        value: { es: "5", en: "5", it: "5" },
        label: {
          es: "pasos. No un proyecto eterno.",
          en: "steps. Not an endless project.",
          it: "passi. Non un progetto infinito.",
        },
      },
      {
        value: { es: "1", en: "1", it: "1" },
        label: {
          es: "unidad de negocio, no un extra de la cocina.",
          en: "business unit, not a kitchen side quest.",
          it: "unità di business, non un extra della cucina.",
        },
      },
      {
        value: { es: "24/7", en: "24/7", it: "24/7" },
        label: {
          es: "el canal no se opera solo.",
          en: "the channel does not run itself.",
          it: "il canale non si gestisce da solo.",
        },
      },
    ],
    featuredChart: {
      kind: "steps",
      kicker: { es: "Hoja de ruta", en: "Roadmap", it: "Roadmap" },
      title: {
        es: "De canal reactivo a unidad de negocio",
        en: "From reactive channel to business unit",
        it: "Da canale reattivo a unità di business",
      },
      caption: {
        es: "El orden importa: sin números reales, el menú y las promos se diseñan a ciegas.",
        en: "Order matters: without real numbers, the menu and promos are designed blind.",
        it: "L'ordine conta: senza numeri reali, menu e promo si progettano alla cieca.",
      },
      tone: "dark",
      items: [
        {
          label: { es: "Entender tus números reales", en: "Understand your real numbers", it: "Capire i tuoi numeri reali" },
          value: 20,
          display: { es: "Margen, ticket, comisión, promos", en: "Margin, ticket, commission, promos", it: "Margine, ticket, commissione, promo" },
        },
        {
          label: { es: "Diseñar el menú para vender mejor", en: "Design the menu to sell better", it: "Progettare il menu per vendere meglio" },
          value: 40,
          display: { es: "Arquitectura, fotos, combos", en: "Architecture, photos, combos", it: "Architettura, foto, combo" },
        },
        {
          label: { es: "Promociones con objetivo", en: "Promotions with a goal", it: "Promozioni con un obiettivo" },
          value: 60,
          display: { es: "Visibilidad, adquisición o margen", en: "Visibility, acquisition, or margin", it: "Visibilità, acquisizione o margine" },
        },
        {
          label: { es: "Gestión diaria del canal", en: "Daily channel management", it: "Gestione quotidiana del canale" },
          value: 80,
          display: { es: "Precios, ranking, stock", en: "Prices, ranking, stock", it: "Prezzi, ranking, stock" },
        },
        {
          label: { es: "Integrarlo al resto del negocio", en: "Integrate it with the rest of the business", it: "Integrarlo con il resto del business" },
          value: 100,
          display: { es: "Marca, cocina, fidelización", en: "Brand, kitchen, loyalty", it: "Brand, cucina, fidelizzazione" },
          accent: true,
        },
      ],
    },
    secciones: [
      {
        heading: {
          es: "Paso 1 – Entender tus números reales",
          en: "Step 1 – Understand your real numbers",
          it: "Passo 1 – Capire i tuoi numeri reali",
        },
        headingAccent: { es: "Paso 1", en: "Step 1", it: "Passo 1" },
        parrafos: [
          { es: "Antes de optimizar, necesitas claridad.", en: "Before optimizing, you need clarity.", it: "Prima di ottimizzare, ti serve chiarezza." },
          {
            es: "Métricas básicas que todo restaurante debería conocer:",
            en: "Basic metrics every restaurant should know:",
            it: "Metriche di base che ogni ristorante dovrebbe conoscere:",
          },
        ],
        bullets: [
          { es: "Margen por producto en app", en: "Margin per product in the app", it: "Margine per prodotto nell'app" },
          { es: "Ticket promedio", en: "Average ticket", it: "Ticket medio" },
          { es: "Comisión real por pedido", en: "Real commission per order", it: "Commissione reale per ordine" },
          { es: "Costo de promociones activas", en: "Cost of active promotions", it: "Costo delle promozioni attive" },
          { es: "Rentabilidad por canal", en: "Profitability per channel", it: "Redditività per canale" },
        ],
        cierreParrafos: [
          {
            es: "Sin esta base, cualquier decisión es intuición.",
            en: "Without this foundation, any decision is just intuition.",
            it: "Senza questa base, qualsiasi decisione è solo intuizione.",
          },
        ],
        figure: {
          src: "/assets/gallery/dashboard-analisis.webp",
          alt: {
            es: "Dashboard de métricas de delivery: ticket, margen y pedidos",
            en: "Delivery metrics dashboard: ticket, margin, and orders",
            it: "Dashboard delle metriche di delivery: ticket, margine e ordini",
          },
          caption: {
            es: "Paso 1: si no está en el tablero, no existe. Margen por producto, ticket, comisión real, costo de promos.",
            en: "Step 1: if it isn't on the dashboard, it doesn't exist. Margin per product, ticket, real commission, promo cost.",
            it: "Passo 1: se non è nella dashboard, non esiste. Margine per prodotto, ticket, commissione reale, costo delle promo.",
          },
        },
      },
      {
        heading: {
          es: "Paso 2 – Diseñar el menú para vender mejor",
          en: "Step 2 – Design the menu to sell better",
          it: "Passo 2 – Progettare il menu per vendere meglio",
        },
        headingAccent: { es: "Paso 2", en: "Step 2", it: "Passo 2" },
        parrafos: [
          {
            es: "La carta física no funciona igual en una app. Un menú profesional en delivery:",
            en: "The physical menu doesn't work the same in an app. A professional delivery menu:",
            it: "Il menu cartaceo non funziona allo stesso modo in un'app. Un menu professionale per il delivery:",
          },
        ],
        bullets: [
          { es: "Prioriza productos de mayor margen", en: "Prioritizes higher-margin products", it: "Dà priorità ai prodotti a margine più alto" },
          { es: "Simplifica categorías", en: "Simplifies categories", it: "Semplifica le categorie" },
          { es: "Optimiza descripciones", en: "Optimizes descriptions", it: "Ottimizza le descrizioni" },
          { es: "Usa imágenes de alta calidad", en: "Uses high-quality images", it: "Usa immagini di alta qualità" },
          { es: "Crea combos estratégicos", en: "Creates strategic combos", it: "Crea combo strategici" },
        ],
        cierreParrafos: [
          {
            es: "El diseño del menú impacta directamente en facturación y rentabilidad.",
            en: "Menu design directly impacts revenue and profitability.",
            it: "Il design del menu influisce direttamente su fatturato e redditività.",
          },
        ],
        figure: {
          src: "/assets/gallery/plato-sushi.webp",
          alt: {
            es: "Plato de sushi con presentación pensada para foto de menú digital",
            en: "Sushi plate with presentation designed for a digital menu photo",
            it: "Piatto di sushi con una presentazione pensata per la foto del menu digitale",
          },
          caption: {
            es: "La carta física no se copia a la app. Se rediseña: menos categorías, más margen arriba, fotos que venden.",
            en: "The physical menu isn't copied into the app. It's redesigned: fewer categories, more margin up top, photos that sell.",
            it: "Il menu cartaceo non si copia nell'app. Si riprogetta: meno categorie, più margine in alto, foto che vendono.",
          },
        },
      },
      {
        heading: {
          es: "Paso 3 – Definir una estrategia de promociones inteligente",
          en: "Step 3 – Define a smart promotions strategy",
          it: "Passo 3 – Definire una strategia promozionale intelligente",
        },
        headingAccent: { es: "Paso 3", en: "Step 3", it: "Passo 3" },
        parrafos: [
          {
            es: "No todas las promos sirven. Una estrategia profesional:",
            en: "Not all promos work. A professional strategy:",
            it: "Non tutte le promo funzionano. Una strategia professionale:",
          },
        ],
        bullets: [
          {
            es: "Define objetivos claros (visibilidad, adquisición, rentabilidad)",
            en: "Defines clear goals (visibility, acquisition, profitability)",
            it: "Definisce obiettivi chiari (visibilità, acquisizione, redditività)",
          },
          { es: "Mide impacto real", en: "Measures real impact", it: "Misura l'impatto reale" },
          {
            es: "Evita descuentos permanentes sin análisis",
            en: "Avoids permanent discounts without analysis",
            it: "Evita sconti permanenti senza analisi",
          },
          { es: "Ajusta según estacionalidad", en: "Adjusts for seasonality", it: "Si adegua alla stagionalità" },
        ],
        cierreParrafos: [
          {
            es: "Promocionar sin estrategia puede aumentar ventas… y reducir margen.",
            en: "Promoting without a strategy can increase sales… and reduce margin.",
            it: "Fare promozioni senza strategia può aumentare le vendite… e ridurre il margine.",
          },
        ],
        chart: {
          kind: "bars",
          kicker: { es: "Objetivo de la promo", en: "Promo goal", it: "Obiettivo della promo" },
          title: {
            es: "No todas las promos sirven para lo mismo",
            en: "Not every promo is for the same job",
            it: "Non tutte le promo servono allo stesso scopo",
          },
          caption: {
            es: "Si no definís el objetivo, la promo por defecto es descuento permanente — y eso no es estrategia.",
            en: "If you don't define the goal, the default promo is a permanent discount — and that isn't a strategy.",
            it: "Se non definisci l'obiettivo, la promo di default è lo sconto permanente — e questa non è strategia.",
          },
          items: [
            {
              label: { es: "Visibilidad (aparecer más)", en: "Visibility (show up more)", it: "Visibilità (apparire di più)" },
              value: 70,
              display: { es: "Corto plazo", en: "Short term", it: "Breve termine" },
            },
            {
              label: { es: "Adquisición (cliente nuevo)", en: "Acquisition (new customer)", it: "Acquisizione (nuovo cliente)" },
              value: 55,
              display: { es: "Con tope", en: "Capped", it: "Con tetto" },
            },
            {
              label: { es: "Rentabilidad (ticket / mix)", en: "Profitability (ticket / mix)", it: "Redditività (ticket / mix)" },
              value: 88,
              display: { es: "La que escala", en: "The one that scales", it: "Quella che scala" },
              accent: true,
            },
          ],
        },
      },
      {
        heading: {
          es: "Paso 4 – Gestionar el canal todos los días",
          en: "Step 4 – Manage the channel every day",
          it: "Passo 4 – Gestire il canale ogni giorno",
        },
        headingAccent: { es: "Paso 4", en: "Step 4", it: "Passo 4" },
        parrafos: [
          {
            es: "El delivery es dinámico. Los algoritmos cambian, la competencia se mueve, el comportamiento del consumidor evoluciona.",
            en: "Delivery is dynamic. Algorithms change, competitors move, consumer behavior evolves.",
            it: "Il delivery è dinamico. Gli algoritmi cambiano, la concorrenza si muove, il comportamento del consumatore evolve.",
          },
          { es: "La gestión diaria implica:", en: "Daily management involves:", it: "La gestione quotidiana significa:" },
        ],
        bullets: [
          { es: "Revisar métricas", en: "Reviewing metrics", it: "Controllare le metriche" },
          { es: "Ajustar precios", en: "Adjusting prices", it: "Adeguare i prezzi" },
          { es: "Optimizar productos", en: "Optimizing products", it: "Ottimizzare i prodotti" },
          { es: "Evaluar posicionamiento en la app", en: "Evaluating positioning in the app", it: "Valutare il posizionamento nell'app" },
          { es: "Tomar decisiones basadas en datos", en: "Making data-driven decisions", it: "Prendere decisioni basate sui dati" },
        ],
        cierreParrafos: [
          { es: "No es un canal “automático”.", en: "It's not an “automatic” channel.", it: "Non è un canale “automatico”." },
        ],
        figure: {
          src: "/assets/gallery/preparacion-pedido-veggie.webp",
          alt: {
            es: "Preparación de un pedido veggie en cocina, operación diaria de delivery",
            en: "Veggie order being prepared in the kitchen, daily delivery operations",
            it: "Preparazione di un ordine veggie in cucina, operatività quotidiana del delivery",
          },
          caption: {
            es: "La gestión diaria es prosaica: stock, tiempos, ranking, precios. El algoritmo se mueve; el restaurante también tiene que moverse.",
            en: "Daily management is prosaic: stock, times, ranking, prices. The algorithm moves; the restaurant has to move too.",
            it: "La gestione quotidiana è concreta: stock, tempi, ranking, prezzi. L'algoritmo si muove; anche il ristorante deve muoversi.",
          },
        },
      },
      {
        heading: {
          es: "Paso 5 – Pensar el delivery como parte del negocio, no como algo aislado",
          en: "Step 5 – Think of delivery as part of the business, not something isolated",
          it: "Passo 5 – Pensare il delivery come parte del business, non come qualcosa di isolato",
        },
        headingAccent: { es: "Paso 5", en: "Step 5", it: "Passo 5" },
        parrafos: [
          { es: "El canal digital impacta en:", en: "The digital channel impacts:", it: "Il canale digitale influisce su:" },
        ],
        bullets: [
          { es: "Branding", en: "Branding", it: "Branding" },
          { es: "Percepción de marca", en: "Brand perception", it: "Percezione del brand" },
          { es: "Experiencia del cliente", en: "Customer experience", it: "Esperienza del cliente" },
          { es: "Fidelización", en: "Loyalty", it: "Fidelizzazione" },
        ],
        cierreParrafos: [
          {
            es: "Cuando está alineado con la operación interna, potencia todo el negocio. Cuando no, genera fricción.",
            en: "When it's aligned with internal operations, it boosts the whole business. When it isn't, it creates friction.",
            it: "Quando è allineato con l'operatività interna, potenzia tutto il business. Quando non lo è, crea attrito.",
          },
        ],
        figure: {
          src: "/assets/gallery/repartidor-rappi.webp",
          alt: {
            es: "Repartidor entregando un pedido: el delivery como cara de la marca",
            en: "Courier delivering an order: delivery as the face of the brand",
            it: "Rider che consegna un ordine: il delivery come volto del brand",
          },
          caption: {
            es: "El cliente no separa “la app” de tu restaurante. Packaging, tiempos y trato son marca — aunque el pedido haya salido por marketplace.",
            en: "The customer doesn't separate “the app” from your restaurant. Packaging, times, and handling are brand — even if the order left through a marketplace.",
            it: "Il cliente non separa “l'app” dal tuo ristorante. Packaging, tempi e trattamento sono brand — anche se l'ordine è uscito da un marketplace.",
          },
        },
      },
    ],
    conclusion: [
      {
        es: "Profesionalizar el delivery no significa hacerlo más complejo. Significa hacerlo estratégico.",
        en: "Professionalizing delivery doesn't mean making it more complex. It means making it strategic.",
        it: "Professionalizzare il delivery non significa renderlo più complesso. Significa renderlo strategico.",
      },
      {
        es: "Con estructura, análisis y enfoque en rentabilidad, el canal deja de ser una urgencia operativa y se convierte en una fuente sólida de crecimiento.",
        en: "With structure, analysis, and a focus on profitability, the channel stops being an operational emergency and becomes a solid source of growth.",
        it: "Con struttura, analisi e focus sulla redditività, il canale smette di essere un'emergenza operativa e diventa una fonte solida di crescita.",
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
