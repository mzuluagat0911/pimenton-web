/**
 * Visuales del blog estático: portada, cifras, gráficos y foto de apoyo.
 * El redactor escribe texto; el renderizador adjunta estos bloques para que
 * cada artículo no quede en un muro de párrafos.
 */

export type VisualLang = "es" | "en";

export interface CoverAsset {
  src: string;
  alt: Record<VisualLang, string>;
  caption: Record<VisualLang, string>;
}

interface Stat {
  value: string;
  label: Record<VisualLang, string>;
}

interface ChartItem {
  label: Record<VisualLang, string>;
  value: number;
  display: Record<VisualLang, string>;
  accent?: boolean;
}

interface ChartSpec {
  kind: "stack" | "bars";
  kicker: Record<VisualLang, string>;
  title: Record<VisualLang, string>;
  caption: Record<VisualLang, string>;
  items: ChartItem[];
}

export interface ArticleVisual {
  cover: CoverAsset;
  stats: Stat[];
  chart: ChartSpec;
  mid: CoverAsset;
}

const IMG = {
  dashboard: "/assets/gallery/dashboard-analisis.webp",
  burger: "/assets/gallery/plato-burguer.webp",
  sushi: "/assets/gallery/plato-sushi.webp",
  kitchen: "/assets/gallery/preparacion-burguer.webp",
  veggie: "/assets/gallery/preparacion-pedido-veggie.webp",
  courier: "/assets/gallery/repartidor-rappi.webp",
  performance: "/assets/services/service_performance.webp",
  estrategia: "/assets/services/service_estrategia.webp",
  consultoria: "/assets/services/service_consultoria.webp",
  tecnologia: "/assets/services/service_tecnologia.webp",
  gestion: "/assets/services/service_gestion-integral.webp",
} as const;

const PACKS: Record<string, ArticleVisual> = {
  pl: {
    cover: {
      src: IMG.dashboard,
      alt: {
        es: "Tablero de P&L de delivery: margen, comisión y pedidos",
        en: "Delivery P&L dashboard: margin, commission, and orders",
      },
      caption: {
        es: "El P&L por pedido es el tablero que falta en la mayoría de las cocinas.",
        en: "The per-order P&L is the dashboard missing from most kitchens.",
      },
    },
    stats: [
      {
        value: "30%",
        label: { es: "comisión típica sobre el ticket", en: "typical commission on the ticket" },
      },
      {
        value: "15%",
        label: { es: "margen cuando nadie mide contribución", en: "margin when nobody measures contribution" },
      },
      {
        value: "$100",
        label: { es: "ejemplo de pedido, desarmado abajo", en: "sample order, broken down below" },
      },
    ],
    chart: {
      kind: "stack",
      kicker: { es: "Ejemplo ilustrativo", en: "Illustrative example" },
      title: {
        es: "A dónde se va un pedido de $100",
        en: "Where a $100 order actually goes",
      },
      caption: {
        es: "Comida, comisión, packaging, ads y promo se comen el ticket antes del margen. Cada restaurante tiene su propia estructura.",
        en: "Food, commission, packaging, ads, and promo eat the ticket before margin. Every restaurant has its own structure.",
      },
      items: [
        { label: { es: "Comida", en: "Food" }, value: 32, display: { es: "$32", en: "$32" } },
        { label: { es: "Comisión", en: "Commission" }, value: 28, display: { es: "$28", en: "$28" } },
        { label: { es: "Packaging y ads", en: "Packaging & ads" }, value: 12, display: { es: "$12", en: "$12" } },
        { label: { es: "Promo", en: "Promo" }, value: 10, display: { es: "$10", en: "$10" } },
        { label: { es: "Margen", en: "Margin" }, value: 18, display: { es: "$18", en: "$18" }, accent: true },
      ],
    },
    mid: {
      src: IMG.performance,
      alt: {
        es: "Operación de delivery midiendo performance por canal",
        en: "Delivery operations measuring performance by channel",
      },
      caption: {
        es: "Si la liquidación y el P&L no se cruzan, estás opinando del canal a ciegas.",
        en: "If the payout and the P&L never meet, you're judging the channel blind.",
      },
    },
  },
  ticket: {
    cover: {
      src: IMG.burger,
      alt: {
        es: "Plato de burger gourmet: ticket alto sin bajar precio",
        en: "Gourmet burger plate: high ticket without cutting price",
      },
      caption: {
        es: "Subir ticket es vender más completo, no más barato.",
        en: "Raising ticket is selling more complete, not cheaper.",
      },
    },
    stats: [
      { value: "+15%", label: { es: "ticket extra, sin descuento", en: "extra ticket, no discount" } },
      { value: "3×", label: { es: "más sano que empujar volumen", en: "healthier than pushing volume" } },
      { value: "0", label: { es: "promos agresivas necesarias", en: "aggressive promos required" } },
    ],
    chart: {
      kind: "bars",
      kicker: { es: "Impacto relativo", en: "Relative impact" },
      title: {
        es: "Qué mueve más el margen",
        en: "What moves margin more",
      },
      caption: {
        es: "Un +15% de ticket suele dejar más contribución que un +30% de órdenes comprado con descuento.",
        en: "A +15% ticket usually leaves more contribution than a +30% order lift bought with discounts.",
      },
      items: [
        { label: { es: "Ticket +15% con combos", en: "Ticket +15% with combos" }, value: 92, display: { es: "Alto", en: "High" }, accent: true },
        { label: { es: "Órdenes +30% con promo", en: "Orders +30% with promo" }, value: 48, display: { es: "Medio", en: "Medium" } },
        { label: { es: "Bajar precios", en: "Cut prices" }, value: 18, display: { es: "Negativo", en: "Negative" } },
      ],
    },
    mid: {
      src: IMG.sushi,
      alt: {
        es: "Plato premium para menú digital de delivery",
        en: "Premium plate for a digital delivery menu",
      },
      caption: {
        es: "Foto, descripción y posición en el menú son pricing.",
        en: "Photo, description, and menu position are pricing.",
      },
    },
  },
  rank: {
    cover: {
      src: IMG.estrategia,
      alt: {
        es: "Estrategia de visibilidad en apps de delivery",
        en: "Visibility strategy on delivery apps",
      },
      caption: {
        es: "Aparecer primero no es un truco del algoritmo: son palancas que sí controlás.",
        en: "Ranking first isn't an algorithm trick: there are levers you do control.",
      },
    },
    stats: [
      { value: "4", label: { es: "palancas que sí controlás", en: "levers you actually control" } },
      { value: "1", label: { es: "regla: cada palanca cruza margen", en: "rule: every lever crosses margin" } },
      { value: "0", label: { es: "sentido gastar ads con margen negativo", en: "point spending ads on negative margin" } },
    ],
    chart: {
      kind: "bars",
      kicker: { es: "Palancas de ranking", en: "Ranking levers" },
      title: {
        es: "Qué mueve visibilidad (y qué te cuesta)",
        en: "What moves visibility (and what it costs you)",
      },
      caption: {
        es: "Ads sin P&L es comprar posición a pérdida. Foto, rating y menú son palancas más baratas.",
        en: "Ads without a P&L is buying position at a loss. Photo, rating, and menu are cheaper levers.",
      },
      items: [
        { label: { es: "Menú + fotos + mix", en: "Menu + photos + mix" }, value: 78, display: { es: "Alto / barato", en: "High / cheap" }, accent: true },
        { label: { es: "Rating y tiempos", en: "Rating and times" }, value: 70, display: { es: "Alto / ops", en: "High / ops" } },
        { label: { es: "Pricing alineado", en: "Aligned pricing" }, value: 62, display: { es: "Medio", en: "Medium" } },
        { label: { es: "Ads de la plataforma", en: "Platform ads" }, value: 40, display: { es: "Caro", en: "Expensive" } },
      ],
    },
    mid: {
      src: IMG.courier,
      alt: {
        es: "Repartidor entregando un pedido: rating y tiempos en la calle",
        en: "Courier delivering an order: rating and times on the street",
      },
      caption: {
        es: "El ranking también se cocina en packing y tiempos. Un 4.2 no se arregla con más ads.",
        en: "Ranking is also cooked in packing and times. A 4.2 isn't fixed with more ads.",
      },
    },
  },
  cancel: {
    cover: {
      src: IMG.kitchen,
      alt: {
        es: "Cocina preparando un pedido: donde nacen las cancelaciones",
        en: "Kitchen prepping an order: where cancellations are born",
      },
      caption: {
        es: "Las cancelaciones no son “la app”: son stock, tiempos y datos sucios.",
        en: "Cancellations aren't “the app”: they're stock, times, and dirty data.",
      },
    },
    stats: [
      { value: "35%", label: { es: "típico por stock / 86", en: "typical from stock / 86s" } },
      { value: "28%", label: { es: "por tiempo de preparación", en: "from prep time" } },
      { value: "1", label: { es: "sucursal que desordena a las demás", en: "location that drags the rest" } },
    ],
    chart: {
      kind: "stack",
      kicker: { es: "Causas frecuentes", en: "Common causes" },
      title: {
        es: "De dónde salen las cancelaciones",
        en: "Where cancellations actually come from",
      },
      caption: {
        es: "Distribución ilustrativa. El primer paso es etiquetar cada cancelación: sin causa, no hay palanca.",
        en: "Illustrative split. The first step is tagging every cancellation: no cause, no lever.",
      },
      items: [
        { label: { es: "Stock / 86", en: "Stock / 86" }, value: 35, display: { es: "35%", en: "35%" }, accent: true },
        { label: { es: "Tiempo de prep", en: "Prep time" }, value: 28, display: { es: "28%", en: "28%" } },
        { label: { es: "Dirección / rider", en: "Address / rider" }, value: 22, display: { es: "22%", en: "22%" } },
        { label: { es: "Otros", en: "Other" }, value: 15, display: { es: "15%", en: "15%" } },
      ],
    },
    mid: {
      src: IMG.veggie,
      alt: {
        es: "Pedido en preparación: control de stock y tiempos",
        en: "Order being prepared: stock and time control",
      },
      caption: {
        es: "Una sucursal con stock mentiroso cancela por las dos. El 86 tiene que ser un dato, no un rumor.",
        en: "A location with lying stock cancels for two. The 86 has to be a data point, not a rumor.",
      },
    },
  },
  ops: {
    cover: {
      src: IMG.tecnologia,
      alt: {
        es: "Control room de delivery multi-sucursal",
        en: "Multi-location delivery control room",
      },
      caption: {
        es: "Un ritual de 10 minutos vale más que un dashboard que nadie abre.",
        en: "A 10-minute ritual is worth more than a dashboard nobody opens.",
      },
    },
    stats: [
      { value: "10'", label: { es: "standup diario, no una reunión eterna", en: "daily standup, not an endless meeting" } },
      { value: "3", label: { es: "capas: diario, weekly, war room", en: "layers: daily, weekly, war room" } },
      { value: "1", label: { es: "tablero. El resto es ruido", en: "board. Everything else is noise" } },
    ],
    chart: {
      kind: "bars",
      kicker: { es: "Ritual de ops", en: "Ops ritual" },
      title: {
        es: "Qué se mira cada mañana (y en qué orden)",
        en: "What you look at each morning (and in what order)",
      },
      caption: {
        es: "Si el tablero no cabe en una pantalla, no se usa. Cinco indicadores, dueño, umbral, decisión.",
        en: "If the board doesn't fit on one screen, it doesn't get used. Five metrics, owner, threshold, decision.",
      },
      items: [
        { label: { es: "Cancelaciones / 86", en: "Cancellations / 86s" }, value: 90, display: { es: "1º", en: "1st" }, accent: true },
        { label: { es: "Tiempo de prep", en: "Prep time" }, value: 75, display: { es: "2º", en: "2nd" } },
        { label: { es: "Conectividad / stock", en: "Connectivity / stock" }, value: 62, display: { es: "3º", en: "3rd" } },
        { label: { es: "Ticket y mix", en: "Ticket and mix" }, value: 50, display: { es: "4º", en: "4th" } },
        { label: { es: "Ads y ranking", en: "Ads and ranking" }, value: 38, display: { es: "5º", en: "5th" } },
      ],
    },
    mid: {
      src: IMG.gestion,
      alt: {
        es: "Equipo operando delivery con un tablero compartido",
        en: "Team running delivery from a shared board",
      },
      caption: {
        es: "Weekly compara sucursales. War room se abre por umbral, no por costumbre.",
        en: "Weekly compares locations. War room opens on a threshold, not by habit.",
      },
    },
  },
  rating: {
    cover: {
      src: IMG.courier,
      alt: {
        es: "Repartidor entregando un pedido: el rating se cocina en la calle",
        en: "Courier handing off an order: rating is cooked on the street",
      },
      caption: {
        es: "El cliente no separa la app de tu sucursal. Tiempos, packing y pedido correcto son el rating.",
        en: "The customer doesn't separate the app from your location. Times, packing, and a correct order are the rating.",
      },
    },
    stats: [
      { value: "48h", label: { es: "ventana para frenar la caída", en: "window to stop the drop" } },
      { value: "1", label: { es: "sucursal. Nunca promediés la cadena", en: "location. Never average the chain" } },
      { value: "4", label: { es: "causas que sí mueven estrellas", en: "causes that actually move stars" } },
    ],
    chart: {
      kind: "bars",
      kicker: { es: "Qué mueve el rating", en: "What moves rating" },
      title: {
        es: "Las quejas que bajan estrellas (y el orden para atacarlas)",
        en: "The complaints that drop stars (and the order to attack them)",
      },
      caption: {
        es: "Ilustrativo. Pedí las 20 reseñas bajas de la sucursal en rojo y etiquetalas: si no hay causa, no hay playbook.",
        en: "Illustrative. Pull the 20 low reviews from the red location and tag them: no cause, no playbook.",
      },
      items: [
        { label: { es: "Tiempo / frío", en: "Time / cold food" }, value: 88, display: { es: "1º", en: "1st" }, accent: true },
        { label: { es: "Pedido errado / incompleto", en: "Wrong / incomplete order" }, value: 72, display: { es: "2º", en: "2nd" } },
        { label: { es: "Packing / derrame", en: "Packing / spills" }, value: 58, display: { es: "3º", en: "3rd" } },
        { label: { es: "86 / ítem faltante", en: "86 / missing item" }, value: 45, display: { es: "4º", en: "4th" } },
      ],
    },
    mid: {
      src: IMG.kitchen,
      alt: {
        es: "Cocina armando un pedido: donde se gana o se pierde el rating",
        en: "Kitchen packing an order: where rating is won or lost",
      },
      caption: {
        es: "El rating se recupera en el pase, no en un mensaje pidiendo 5 estrellas.",
        en: "Rating is recovered at the pass, not in a message asking for 5 stars.",
      },
    },
  },
};

const SLUG_PACK: Record<string, keyof typeof PACKS> = {
  "rentabilidad-delivery-apps-restaurantes": "pl",
  "delivery-app-profitability-per-order-pl": "pl",
  "take-rate-real-apps-delivery": "pl",
  "real-take-rate-delivery-apps": "pl",
  "como-leer-liquidacion-app-delivery": "pl",
  "delivery-app-payout-statement-explained": "pl",
  "cuanto-subir-precios-apps-delivery": "ticket",
  "how-much-raise-delivery-app-prices": "ticket",
  "como-aparecer-primero-apps-delivery": "rank",
  "rank-higher-delivery-apps-profitable-orders": "rank",
  "como-reducir-cancelaciones-delivery": "cancel",
  "reduce-delivery-cancellations-multiple-locations": "cancel",
  "controlar-operacion-delivery-multi-sucursal": "ops",
  "multi-location-delivery-daily-control-checklist": "ops",
  "indicadores-mañana-delivery-multi-sucursal": "ops",
  "morning-metrics-checklist-multi-location-delivery": "ops",
  "reunion-diaria-operaciones-delivery": "ops",
  "daily-delivery-operations-meeting-ritual": "ops",
  "control-room": "ops",
  "como-recuperar-rating-delivery-multi-sucursal": "rating",
  "recover-delivery-app-rating-multi-location": "rating",
};

function packFor(slug: string): ArticleVisual {
  const key = SLUG_PACK[slug];
  if (key) return PACKS[key];
  if (/rentab|profit|take-rate|liquidac|payout|pl/.test(slug)) return PACKS.pl;
  if (/precio|ticket|price/.test(slug)) return PACKS.ticket;
  if (/cancel/.test(slug)) return PACKS.cancel;
  if (/aparecer|rank/.test(slug)) return PACKS.rank;
  if (/rating|reseña|review/.test(slug)) return PACKS.rating;
  return PACKS.ops;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function figureHtml(asset: CoverAsset, lang: VisualLang, cls: string, marker: string): string {
  return `<figure class="${cls}" data-blog-visuals="${marker}">
  <img src="${esc(asset.src)}" alt="${esc(asset.alt[lang])}" width="1200" height="800" loading="${marker === "lead" ? "eager" : "lazy"}" />
  <figcaption>${esc(asset.caption[lang])}</figcaption>
</figure>`;
}

function statsHtml(stats: Stat[], lang: VisualLang): string {
  const cells = stats
    .map(
      (s) => `    <div class="blog-stat"><b>${esc(s.value)}</b><span>${esc(s.label[lang])}</span></div>`,
    )
    .join("\n");
  return `<div class="blog-stats" data-blog-visuals="lead">
${cells}
</div>`;
}

function chartHtml(chart: ChartSpec, lang: VisualLang): string {
  if (chart.kind === "stack") {
    const segs = chart.items
      .map(
        (it, i) =>
          `    <span class="seg seg-${i}${it.accent ? " is-accent" : ""}" style="flex:${it.value}" title="${esc(it.label[lang])} ${esc(it.display[lang])}"></span>`,
      )
      .join("\n");
    const legend = chart.items
      .map(
        (it, i) =>
          `    <li><i class="swatch seg-${i}${it.accent ? " is-accent" : ""}"></i>${esc(it.label[lang])} <b>${esc(it.display[lang])}</b></li>`,
      )
      .join("\n");
    return `<figure class="blog-chart blog-chart--stack" data-blog-visuals="lead">
  <p class="chart-kicker">${esc(chart.kicker[lang])}</p>
  <figcaption>${esc(chart.title[lang])}</figcaption>
  <div class="stack" role="img" aria-label="${esc(chart.title[lang])}">
${segs}
  </div>
  <ul class="legend">
${legend}
  </ul>
  <p class="chart-note">${esc(chart.caption[lang])}</p>
</figure>`;
  }

  const rows = chart.items
    .map((it, i) => {
      const width = Math.min(100, Math.max(8, it.value));
      return `    <div class="bar-row${it.accent ? " is-accent" : ""}">
      <div class="bar-meta"><span>${esc(it.label[lang])}</span><b>${esc(it.display[lang])}</b></div>
      <div class="bar-track"><span class="bar-fill seg-${i}" style="width:${width}%"></span></div>
    </div>`;
    })
    .join("\n");
  return `<figure class="blog-chart blog-chart--bars" data-blog-visuals="lead">
  <p class="chart-kicker">${esc(chart.kicker[lang])}</p>
  <figcaption>${esc(chart.title[lang])}</figcaption>
  <div class="bars">
${rows}
  </div>
  <p class="chart-note">${esc(chart.caption[lang])}</p>
</figure>`;
}

export function coverFor(slug: string): CoverAsset {
  return packFor(slug).cover;
}

export function leadVisualHtml(slug: string, lang: VisualLang): string {
  const pack = packFor(slug);
  return [
    figureHtml(pack.cover, lang, "blog-cover", "lead"),
    statsHtml(pack.stats, lang),
    chartHtml(pack.chart, lang),
  ].join("\n");
}

export function midVisualHtml(slug: string, lang: VisualLang): string {
  return figureHtml(packFor(slug).mid, lang, "blog-figure", "mid");
}

const LEAD_RE = /<div class="blog-visuals-lead" data-blog-visuals="lead">[\s\S]*?<\/div><!-- \/blog-visuals-lead -->\n?/g;
const MID_RE = /<figure class="blog-figure" data-blog-visuals="mid">[\s\S]*?<\/figure>\n?/g;

export function wrapLead(slug: string, lang: VisualLang): string {
  return `<div class="blog-visuals-lead" data-blog-visuals="lead">
${leadVisualHtml(slug, lang)}
</div><!-- /blog-visuals-lead -->
`;
}

/** Idempotente: saca bloques viejos y vuelve a insertar portada + gráfico + foto. */
export function injectArticleVisuals(html: string, slug: string, lang: VisualLang): string {
  let out = html;
  if (!out.includes('href="/blog/visuals.css"')) {
    out = out.replace(
      "</style>",
      `</style>\n    <link rel="stylesheet" href="/blog/visuals.css" />`,
    );
  }
  out = out.replace(LEAD_RE, "").replace(MID_RE, "");

  out = out.replace(
    /<p class="byline">[\s\S]*?<\/p>/,
    (m) => `${m}\n${wrapLead(slug, lang)}`,
  );

  let h2 = 0;
  out = out.replace(/<h2\b[^>]*>/g, (m) => {
    if (m.includes('id="faq"')) return m;
    h2 += 1;
    if (h2 === 3) return `${midVisualHtml(slug, lang)}\n          ${m}`;
    return m;
  });

  return out;
}

export const VISUALS_STYLESHEET = "/blog/visuals.css";
