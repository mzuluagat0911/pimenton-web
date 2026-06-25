/**
 * Los 4 pasos del proceso de Pimentón (página /como-lo-hacemos).
 *
 * Cada paso se ilustra con un icono SVG de la iconografía de marca
 * (en /public/assets/icons/proceso/). Se renderiza como máscara y se
 * tinta con un color de paleta — ver ProcessIcon en CuatroPasos.tsx.
 */

type Localized = { es: string; en: string };

export type Paso = {
  num: string;
  title: Localized;
  description: Localized;
  /** Frase destacada en coral, debajo de la descripción. */
  highlight: Localized;
  /** Ruta del SVG de iconografía en /public/assets/icons/proceso/. */
  icon: string;
};

export const pasos: Paso[] = [
  {
    num: "01",
    title: { es: "Analizamos", en: "We analyze" },
    description: {
      es: "Entendemos tu negocio y detectamos oportunidades clave.",
      en: "We understand your business and spot key opportunities.",
    },
    highlight: {
      es: "Somos expertos en APPs de delivery.",
      en: "We're experts in delivery apps.",
    },
    icon: "/assets/icons/proceso/analizamos-icon.svg",
  },
  {
    num: "02",
    title: { es: "Diagnosticamos", en: "We diagnose" },
    description: {
      es: "Estudiamos tu restaurante y cada métrica para hacer crecer tus ventas.",
      en: "We study your restaurant and every metric to grow your sales.",
    },
    highlight: {
      es: "Tenemos herramientas, tecnología y un equipo de Data especializado.",
      en: "We have the tools, technology, and a specialized Data team.",
    },
    icon: "/assets/icons/proceso/diagnosticamos-icon.svg",
  },
  {
    num: "03",
    title: { es: "Operamos", en: "We operate" },
    description: {
      es: "Operamos tu delivery, llevamos la relación con las APPs.",
      en: "We run your delivery and manage the relationship with the apps.",
    },
    highlight: {
      es: "Un Growth Manager estará a cargo de tu negocio.",
      en: "A Growth Manager will be in charge of your business.",
    },
    icon: "/assets/icons/proceso/operamos-icon.svg",
  },
  {
    num: "04",
    title: { es: "Optimizamos", en: "We optimize" },
    description: {
      es: "Ajustamos las variables que impactan en tus ventas.",
      en: "We fine-tune the variables that drive your sales.",
    },
    highlight: {
      es: "Trabajamos en la visibilidad, facturación, ticket promedio, conversión y recompra.",
      en: "We work on visibility, revenue, average ticket, conversion, and repeat orders.",
    },
    icon: "/assets/icons/proceso/optimizamos-icon.svg",
  },
];

/* ════════════════════════════════════════════════════════════════════
 * Sección "Detrás de cada pedido, hay una decisión" (DetrasDeCadaPedido)
 * Data de las animaciones de las 4 columnas.
 * ════════════════════════════════════════════════════════════════════ */

// ── Columna 1 — Dashboard en vivo ──
// Valores base + rangos de incremento/fluctuación. La subida es CONTINUA
// (los números nunca resetean): cada tick suma un poco. El ROI sólo
// micro-fluctúa alrededor de su base (no crece indefinidamente).
export const dashboardConfig = {
  ordenes: { base: 12850, inc: [1, 4] as const },
  facturacion: { base: 323000, inc: [200, 900] as const },
  pedidos: { base: 16150, inc: [1, 3] as const },
  roi: { base: 10.77, fluct: 0.05 },
  /** Intervalo entre ticks (ms) — randomizado dentro del rango. */
  tickMs: [3000, 5000] as const,
};

// ── Columna 2 — Partes diarios (typing en loop, 2 días alternados) ──
// `highlight` es el fragmento del texto que va en coral.
export type ParteItem = { text: Localized; highlight?: Localized };
export type ParteDiario = { fecha: string; items: ParteItem[] };

export const partesDiarios: ParteDiario[] = [
  {
    fecha: "24/05",
    items: [
      {
        text: { es: "+18% conversión vs ayer", en: "+18% conversion vs. yesterday" },
        highlight: { es: "+18%", en: "+18%" },
      },
      {
        text: {
          es: "Menú optimizado en 3 plataformas",
          en: "Menu optimized across 3 platforms",
        },
      },
      {
        text: { es: "Campaña Rappi: +$4.2k en 24h", en: "Rappi campaign: +$4.2k in 24h" },
        highlight: { es: "+$4.2k", en: "+$4.2k" },
      },
    ],
  },
  {
    // TODO: copy del día 2 confirmable por Santiago — son métricas
    // plausibles de ejemplo, editables.
    fecha: "25/05",
    items: [
      {
        text: {
          es: "+12% ticket promedio vs semana pasada",
          en: "+12% avg. ticket vs. last week",
        },
        highlight: { es: "+12%", en: "+12%" },
      },
      {
        text: {
          es: "2 nuevas promos activas en PedidosYa",
          en: "2 new promos live on PedidosYa",
        },
      },
      {
        text: {
          es: "Recompra: +9% en clientes frecuentes",
          en: "Repeat orders: +9% among regulars",
        },
        highlight: { es: "+9%", en: "+9%" },
      },
    ],
  },
];

// ── Columna 3 — Pool de logos de food apps (13, paths verificados) ──
// Los primeros 6 son los originales (se usan como estado estático en
// reduced-motion). Todos tienen archivo .svg en /public.
export const col3LogoPool: readonly string[] = [
  "/assets/logos-platforms/foodapp_rappi.svg",
  "/assets/logos-platforms/foodapp_pedidos-ya.svg",
  "/assets/logos-platforms/foodapp_uber-eats.svg",
  "/assets/logos-platforms/foodapp_glovo.svg",
  "/assets/logos-platforms/foodapp_deliveroo.svg",
  "/assets/logos-platforms/tool_delivery-hero.svg",
  "/assets/logos-platforms/foodapp_didi-food.svg",
  "/assets/logos-platforms/foodapp_doordash.svg",
  "/assets/logos-platforms/foodapp_grubhub.svg",
  "/assets/logos-platforms/foodapp_ifood.svg",
  "/assets/logos-platforms/foodapp_menulog.svg", // marca "Just Eat" (JET)
  "/assets/logos-platforms/foodapp_wolt.svg",
  "/assets/logos-platforms/foodapp_zomato.svg",
] as const;

// ── Columna 4 — Equipo de Growth & Customer Success (rotan en loop) ──
// Personas reales del equipo de Pimentón. Fotos en /public/assets/team/
// (los nombres de archivo codifican nombre-apellido-rol-país).
export type GrowthManager = {
  nombre: string;
  rol: Localized;
  pais: Localized;
  foto: string;
};

export const growthManagers: GrowthManager[] = [
  {
    nombre: "Martín Camacho",
    rol: { es: "Growth Manager", en: "Growth Manager" },
    pais: { es: "Ecuador", en: "Ecuador" },
    foto: "/assets/team/martin-camacho-growth-manager-ecuador.webp",
  },
  {
    nombre: "Patricia Carrasco",
    rol: { es: "Growth Manager", en: "Growth Manager" },
    pais: { es: "España", en: "Spain" },
    foto: "/assets/team/patricia-carrasco-growth-manager-espana.webp",
  },
  {
    nombre: "Virginia Rondón",
    rol: { es: "Growth Manager", en: "Growth Manager" },
    pais: { es: "LatAm", en: "LatAm" },
    foto: "/assets/team/virginia-rondon-growth-manager-latam.webp",
  },
  {
    nombre: "Carolina Medina",
    rol: { es: "Customer Success", en: "Customer Success" },
    pais: { es: "LatAm", en: "LatAm" },
    foto: "/assets/team/carolina-medina-customer-success-latam.webp",
  },
  {
    nombre: "Jesús Morán Morales",
    rol: { es: "Customer Success", en: "Customer Success" },
    pais: { es: "USA", en: "USA" },
    foto: "/assets/team/jesus-moran-morales-customer-success-usa.webp",
  },
  {
    nombre: "Marielith Medina",
    rol: { es: "Customer Success", en: "Customer Success" },
    pais: { es: "LatAm", en: "LatAm" },
    foto: "/assets/team/marielith-medina-customer-success-latam.webp",
  },
];
