/**
 * Los 4 pasos del proceso de Pimentón (página /como-lo-hacemos).
 *
 * Cada paso se ilustra con un emoji 3D de Microsoft Fluent (PNG en
 * /public/assets/emoji/3d/) — mismo tratamiento que el formulario de
 * consultoría. `fallback` es el emoji Unicode equivalente, que se muestra
 * si el PNG no estuviera disponible.
 */

export type Paso = {
  num: string;
  title: string;
  description: string;
  /** Frase destacada en coral, debajo de la descripción. */
  highlight: string;
  /** Nombre del archivo PNG en /public/assets/emoji/3d/. */
  emoji: string;
  /** Emoji Unicode de fallback. */
  fallback: string;
};

export const pasos: Paso[] = [
  {
    num: "01",
    title: "Analizamos",
    description: "Entendemos tu negocio y detectamos oportunidades clave.",
    highlight: "Somos expertos en APPs de delivery.",
    emoji: "magnifying-glass.png",
    fallback: "🔍",
  },
  {
    num: "02",
    title: "Diagnosticamos",
    description:
      "Estudiamos tu restaurante y cada métrica para hacer crecer tus ventas.",
    highlight:
      "Tenemos herramientas, tecnología y un equipo de Data especializado.",
    emoji: "stethoscope.png",
    fallback: "🩺",
  },
  {
    num: "03",
    title: "Operamos",
    description: "Operamos tu delivery, llevamos la relación con las APPs.",
    highlight: "Un Growth Manager estará a cargo de tu negocio.",
    emoji: "gear.png",
    fallback: "⚙️",
  },
  {
    num: "04",
    title: "Optimizamos",
    description: "Ajustamos las variables que impactan en tus ventas.",
    highlight:
      "Trabajamos en la visibilidad, facturación, ticket promedio, conversión y recompra.",
    emoji: "chart-increasing.png",
    fallback: "📈",
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
export type ParteItem = { text: string; highlight?: string };
export type ParteDiario = { fecha: string; items: ParteItem[] };

export const partesDiarios: ParteDiario[] = [
  {
    fecha: "24/05",
    items: [
      { text: "+18% conversión vs ayer", highlight: "+18%" },
      { text: "Menú optimizado en 3 plataformas" },
      { text: "Campaña Rappi: +$4.2k en 24h", highlight: "+$4.2k" },
    ],
  },
  {
    // TODO: copy del día 2 confirmable por Santiago — son métricas
    // plausibles de ejemplo, editables.
    fecha: "25/05",
    items: [
      { text: "+12% ticket promedio vs semana pasada", highlight: "+12%" },
      { text: "2 nuevas promos activas en PedidosYa" },
      { text: "Recompra: +9% en clientes frecuentes", highlight: "+9%" },
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
  rol: string;
  pais: string;
  foto: string;
};

export const growthManagers: GrowthManager[] = [
  {
    nombre: "Martín Camacho",
    rol: "Growth Manager",
    pais: "Ecuador",
    foto: "/assets/team/martin-camacho-growth-manager-ecuador.webp",
  },
  {
    nombre: "Patricia Carrasco",
    rol: "Growth Manager",
    pais: "España",
    foto: "/assets/team/patricia-carrasco-growth-manager-espana.webp",
  },
  {
    nombre: "Virginia Rondón",
    rol: "Growth Manager",
    pais: "LatAm",
    foto: "/assets/team/virginia-rondon-growth-manager-latam.webp",
  },
  {
    nombre: "Carolina Medina",
    rol: "Customer Success",
    pais: "LatAm",
    foto: "/assets/team/carolina-medina-customer-success-latam.webp",
  },
  {
    nombre: "Jesús Morán Morales",
    rol: "Customer Success",
    pais: "USA",
    foto: "/assets/team/jesus-moran-morales-customer-success-usa.webp",
  },
  {
    nombre: "Marielith Medina",
    rol: "Customer Success",
    pais: "LatAm",
    foto: "/assets/team/marielith-medina-customer-success-latam.webp",
  },
];
