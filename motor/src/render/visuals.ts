/**
 * Visuales del blog estático: portada, cifras, gráficos y foto de apoyo.
 * El redactor escribe texto; el renderizador adjunta estos bloques para que
 * cada artículo no quede en un muro de párrafos.
 *
 * Portadas: cada slug ES (y su par EN) recibe una foto ÚNICA. Si falta
 * entrada en COVER_BY_SLUG, se asigna automáticamente desde el pool
 * evitando repetir imágenes ya usadas por otros posts.
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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
  casoBirra: "/assets/casos/la-birra-bar/hero.jpg",
  casoEmpanadas: "/assets/casos/tienda-de-empanadas/hero.jpg",
  casoPekin: "/assets/casos/grupo-pekin/hero.jpg",
  casoLima: "/assets/casos/lima-sushi/hero.jpg",
  casoRoma: "/assets/casos/roma-del-abasto/hero.jpg",
  casoPiccola: "/assets/casos/la-piccola-italia/hero.jpg",
  insightRentable: "/assets/insights/delivery-rentable/hero.jpg",
  insightPro: "/assets/insights/profesionalizar-delivery/hero.jpg",
  insightTicket: "/assets/insights/ticket-promedio/hero.jpg",
  reseñas: "/assets/reseñas/background-resenas.webp",
  equipo1: "/assets/equipo/equipo-valor-1-v2.webp",
  equipo2: "/assets/equipo/equipo-valor-2-v2.webp",
  equipo3: "/assets/equipo/equipo-valor-3-v2.webp",
} as const;

/** EN → ES para que el par bilingüe comparta la misma portada. */
const SLUG_CANONICAL: Record<string, string> = {
  "delivery-app-profitability-per-order-pl": "rentabilidad-delivery-apps-restaurantes",
  "morning-metrics-checklist-multi-location-delivery": "indicadores-mañana-delivery-multi-sucursal",
  "how-much-raise-delivery-app-prices": "cuanto-subir-precios-apps-delivery",
  "multi-location-delivery-daily-control-checklist": "controlar-operacion-delivery-multi-sucursal",
  "real-take-rate-delivery-apps": "take-rate-real-apps-delivery",
  "reduce-delivery-cancellations-multiple-locations": "como-reducir-cancelaciones-delivery",
  "delivery-app-payout-statement-explained": "como-leer-liquidacion-app-delivery",
  "daily-delivery-operations-meeting-ritual": "reunion-diaria-operaciones-delivery",
  "rank-higher-delivery-apps-profitable-orders": "como-aparecer-primero-apps-delivery",
  "recover-delivery-app-rating-multi-location": "como-recuperar-rating-delivery-multi-sucursal",
  "kitchen-prep-time-multi-location-delivery": "tiempo-de-preparacion-delivery",
  "how-many-delivery-apps-restaurant": "cuantas-apps-delivery-restaurante",
  "compare-delivery-locations-fairly": "como-comparar-sucursales-delivery",
  "delivery-app-promotions-worth-it": "promociones-apps-delivery-cuales-convienen",
  "delivery-war-room-multi-location-ops": "war-room-operaciones-delivery",
  "delivery-packaging-cost-per-order": "cuanto-cuesta-packaging-delivery-pnl",
};

function canonicalSlug(slug: string): string {
  return SLUG_CANONICAL[slug] ?? slug;
}

function asset(
  src: string,
  altEs: string,
  altEn: string,
  capEs: string,
  capEn: string,
): CoverAsset {
  return {
    src,
    alt: { es: altEs, en: altEn },
    caption: { es: capEs, en: capEn },
  };
}

/** Pool de portadas (orden = prioridad de asignación automática). */
const COVER_POOL: CoverAsset[] = [
  asset(IMG.dashboard, "Tablero de análisis de delivery", "Delivery analytics dashboard", "Números del canal, sin drama.", "Channel numbers, no drama."),
  asset(IMG.performance, "Operación midiendo performance de delivery", "Ops measuring delivery performance", "Medir antes de opinar del canal.", "Measure before judging the channel."),
  asset(IMG.estrategia, "Estrategia de canales de delivery", "Delivery channel strategy", "Elegir dónde jugar con criterio.", "Choose where to play with criteria."),
  asset(IMG.consultoria, "Consultoría revisando liquidación de apps", "Consultancy reviewing app payouts", "La liquidación cuenta la historia real.", "The payout tells the real story."),
  asset(IMG.tecnologia, "Tecnología y control de pedidos", "Tech and order control", "Visibilidad para no operar a ciegas.", "Visibility so you don't fly blind."),
  asset(IMG.gestion, "Gestión integral multi-sucursal", "Multi-location ops management", "Un ritmo, varios locales.", "One rhythm, several locations."),
  asset(IMG.burger, "Plato de burger para menú digital", "Burger plate for a digital menu", "El menú también es pricing.", "The menu is pricing too."),
  asset(IMG.sushi, "Plato de sushi listo para delivery", "Sushi plate ready for delivery", "Presentación que convierte en la app.", "Presentation that converts in the app."),
  asset(IMG.kitchen, "Cocina preparando un pedido", "Kitchen preparing an order", "El pase define tiempos y rating.", "The pass defines times and rating."),
  asset(IMG.veggie, "Pedido veggie empaquetado", "Packed veggie order", "Packaging también es margen.", "Packaging is margin too."),
  asset(IMG.courier, "Repartidor en ruta de delivery", "Courier on a delivery route", "La última milla cierra la experiencia.", "Last mile closes the experience."),
  asset(IMG.casoBirra, "Local de restaurante en servicio", "Restaurant floor in service", "Ops reales, no slides.", "Real ops, not slides."),
  asset(IMG.casoEmpanadas, "Cocina de empanadas multi-sucursal", "Multi-location empanada kitchen", "Comparar locales con método.", "Compare locations with a method."),
  asset(IMG.casoPekin, "Cocina de cadena en hora pico", "Chain kitchen at peak hour", "Volumen sin perder control.", "Volume without losing control."),
  asset(IMG.casoLima, "Plato premium de sushi", "Premium sushi plate", "Ticket y foto van juntos.", "Ticket and photo go together."),
  asset(IMG.casoRoma, "Interior de restaurante", "Restaurant interior", "Misma marca, distintas realidades por local.", "Same brand, different realities per location."),
  asset(IMG.casoPiccola, "Sala de restaurante italiano", "Italian restaurant dining room", "Experiencia que también viaja en la app.", "Experience that also travels in the app."),
  asset(IMG.insightRentable, "Delivery rentable en la práctica", "Profitable delivery in practice", "Rentabilidad es sistema, no suerte.", "Profitability is a system, not luck."),
  asset(IMG.insightPro, "Profesionalizar el canal delivery", "Professionalizing the delivery channel", "Proceso antes que volumen.", "Process before volume."),
  asset(IMG.insightTicket, "Subir ticket promedio en delivery", "Raising average delivery ticket", "Más ticket, mejor contribución.", "Higher ticket, better contribution."),
  asset(IMG.reseñas, "Gestión de reseñas y rating", "Review and rating management", "El rating se gana en el pase.", "Rating is won at the pass."),
  asset(IMG.equipo1, "Equipo de ops en acción", "Ops team in action", "Personas detrás del ritual diario.", "People behind the daily ritual."),
  asset(IMG.equipo2, "Equipo revisando números de delivery", "Team reviewing delivery numbers", "Datos con dueño.", "Data with an owner."),
  asset(IMG.equipo3, "Equipo de growth gastronómico", "Foodservice growth team", "Criterio de restaurante, no de slide.", "Restaurant judgment, not slideware."),
];

/** Portada única por artículo — el índice y los teasers no deben repetir foto. */
const COVER_BY_SLUG: Record<string, CoverAsset> = {
  "rentabilidad-delivery-apps-restaurantes": {
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
  "delivery-app-profitability-per-order-pl": {
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
  "take-rate-real-apps-delivery": {
    src: IMG.performance,
    alt: {
      es: "Operación midiendo el costo real por canal de delivery",
      en: "Ops measuring the true cost per delivery channel",
    },
    caption: {
      es: "El take rate del contrato no es el costo que llega a caja.",
      en: "The contract take rate isn't the cost that hits the till.",
    },
  },
  "real-take-rate-delivery-apps": {
    src: IMG.performance,
    alt: {
      es: "Operación midiendo el costo real por canal de delivery",
      en: "Ops measuring the true cost per delivery channel",
    },
    caption: {
      es: "El take rate del contrato no es el costo que llega a caja.",
      en: "The contract take rate isn't the cost that hits the till.",
    },
  },
  "como-leer-liquidacion-app-delivery": {
    src: IMG.consultoria,
    alt: {
      es: "Liquidación de app de delivery revisada línea por línea",
      en: "Delivery app payout statement reviewed line by line",
    },
    caption: {
      es: "Antes de opinar del canal, conciliá la liquidación.",
      en: "Before judging the channel, reconcile the payout.",
    },
  },
  "delivery-app-payout-statement-explained": {
    src: IMG.consultoria,
    alt: {
      es: "Liquidación de app de delivery revisada línea por línea",
      en: "Delivery app payout statement reviewed line by line",
    },
    caption: {
      es: "Antes de opinar del canal, conciliá la liquidación.",
      en: "Before judging the channel, reconcile the payout.",
    },
  },
  "cuanto-subir-precios-apps-delivery": {
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
  "how-much-raise-delivery-app-prices": {
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
  "como-aparecer-primero-apps-delivery": {
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
  "rank-higher-delivery-apps-profitable-orders": {
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
  "cuantas-apps-delivery-restaurante": {
    src: IMG.sushi,
    alt: {
      es: "Plato premium: elegir apps por contribución, no por moda",
      en: "Premium plate: choose apps by contribution, not by trend",
    },
    caption: {
      es: "Más apps no es más margen. Es más complejidad.",
      en: "More apps isn't more margin. It's more complexity.",
    },
  },
  "how-many-delivery-apps-restaurant": {
    src: IMG.sushi,
    alt: {
      es: "Plato premium: elegir apps por contribución, no por moda",
      en: "Premium plate: choose apps by contribution, not by trend",
    },
    caption: {
      es: "Más apps no es más margen. Es más complejidad.",
      en: "More apps isn't more margin. It's more complexity.",
    },
  },
  "como-reducir-cancelaciones-delivery": {
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
  "reduce-delivery-cancellations-multiple-locations": {
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
  "como-recuperar-rating-delivery-multi-sucursal": {
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
  "recover-delivery-app-rating-multi-location": {
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
  "indicadores-mañana-delivery-multi-sucursal": {
    src: IMG.tecnologia,
    alt: {
      es: "Control room de delivery: checklist matutino de KPIs",
      en: "Delivery control room: morning KPI checklist",
    },
    caption: {
      es: "Cinco indicadores, dueño, umbral. El resto es ruido.",
      en: "Five metrics, owner, threshold. Everything else is noise.",
    },
  },
  "morning-metrics-checklist-multi-location-delivery": {
    src: IMG.tecnologia,
    alt: {
      es: "Control room de delivery: checklist matutino de KPIs",
      en: "Delivery control room: morning KPI checklist",
    },
    caption: {
      es: "Cinco indicadores, dueño, umbral. El resto es ruido.",
      en: "Five metrics, owner, threshold. Everything else is noise.",
    },
  },
  "controlar-operacion-delivery-multi-sucursal": {
    src: IMG.gestion,
    alt: {
      es: "Equipo operando delivery multi-sucursal con un tablero compartido",
      en: "Team running multi-location delivery from a shared board",
    },
    caption: {
      es: "Ritmo, alertas y dueños claros: eso es controlar la operación.",
      en: "Cadence, alerts, and clear owners: that's running the operation.",
    },
  },
  "multi-location-delivery-daily-control-checklist": {
    src: IMG.gestion,
    alt: {
      es: "Equipo operando delivery multi-sucursal con un tablero compartido",
      en: "Team running multi-location delivery from a shared board",
    },
    caption: {
      es: "Ritmo, alertas y dueños claros: eso es controlar la operación.",
      en: "Cadence, alerts, and clear owners: that's running the operation.",
    },
  },
  "reunion-diaria-operaciones-delivery": {
    src: IMG.equipo2,
    alt: {
      es: "Equipo revisando el ritual diario de operaciones",
      en: "Team reviewing the daily operations ritual",
    },
    caption: {
      es: "Un standup de 10 minutos vale más que un dashboard que nadie abre.",
      en: "A 10-minute standup beats a dashboard nobody opens.",
    },
  },
  "daily-delivery-operations-meeting-ritual": {
    src: IMG.equipo2,
    alt: {
      es: "Equipo revisando el ritual diario de operaciones",
      en: "Team reviewing the daily operations ritual",
    },
    caption: {
      es: "Un standup de 10 minutos vale más que un dashboard que nadie abre.",
      en: "A 10-minute standup beats a dashboard nobody opens.",
    },
  },
  "tiempo-de-preparacion-delivery": {
    src: IMG.casoRoma,
    alt: {
      es: "Cocina de restaurante midiendo tiempo de preparación",
      en: "Restaurant kitchen measuring prep time",
    },
    caption: {
      es: "El prep time es el tramo del reloj que controla tu cocina.",
      en: "Prep time is the part of the clock your kitchen controls.",
    },
  },
  "kitchen-prep-time-multi-location-delivery": {
    src: IMG.casoRoma,
    alt: {
      es: "Cocina de restaurante midiendo tiempo de preparación",
      en: "Restaurant kitchen measuring prep time",
    },
    caption: {
      es: "El prep time es el tramo del reloj que controla tu cocina.",
      en: "Prep time is the part of the clock your kitchen controls.",
    },
  },
  "como-comparar-sucursales-delivery": {
    src: IMG.casoEmpanadas,
    alt: {
      es: "Operación multi-sucursal: comparar locales sin sesgo de volumen",
      en: "Multi-location ops: compare stores without volume bias",
    },
    caption: {
      es: "Sin normalizar por volumen, franja y mix, el ranking miente.",
      en: "Without normalizing by volume, shift, and mix, the ranking lies.",
    },
  },
  "compare-delivery-locations-fairly": {
    src: IMG.casoEmpanadas,
    alt: {
      es: "Operación multi-sucursal: comparar locales sin sesgo de volumen",
      en: "Multi-location ops: compare stores without volume bias",
    },
    caption: {
      es: "Sin normalizar por volumen, franja y mix, el ranking miente.",
      en: "Without normalizing by volume, shift, and mix, the ranking lies.",
    },
  },
  "promociones-apps-delivery-cuales-convienen": {
    src: IMG.insightTicket,
    alt: {
      es: "Promos en delivery: calcular el 2x1 antes de publicarlo",
      en: "Delivery promos: calculate the BOGO before you publish it",
    },
    caption: {
      es: "La promo buena sube contribución; la mala compra volumen a pérdida.",
      en: "A good promo lifts contribution; a bad one buys volume at a loss.",
    },
  },
  "delivery-app-promotions-worth-it": {
    src: IMG.insightTicket,
    alt: {
      es: "Promos en delivery: calcular el 2x1 antes de publicarlo",
      en: "Delivery promos: calculate the BOGO before you publish it",
    },
    caption: {
      es: "La promo buena sube contribución; la mala compra volumen a pérdida.",
      en: "A good promo lifts contribution; a bad one buys volume at a loss.",
    },
  },
  "war-room-operaciones-delivery": {
    src: IMG.equipo1,
    alt: {
      es: "War room de ops: cuándo activarlo y con quién",
      en: "Ops war room: when to activate it and with whom",
    },
    caption: {
      es: "No es más pantallas: es ritmo, dueños y umbrales.",
      en: "Not more screens: rhythm, owners, and thresholds.",
    },
  },
  "delivery-war-room-multi-location-ops": {
    src: IMG.equipo1,
    alt: {
      es: "War room de ops: cuándo activarlo y con quién",
      en: "Ops war room: when to activate it and with whom",
    },
    caption: {
      es: "No es más pantallas: es ritmo, dueños y umbrales.",
      en: "Not more screens: rhythm, owners, and thresholds.",
    },
  },
  "cuanto-cuesta-packaging-delivery-pnl": {
    src: IMG.veggie,
    alt: {
      es: "Pedido empacado: el packaging también es línea de P&L",
      en: "Packed order: packaging is a P&L line too",
    },
    caption: {
      es: "Caja, bolsa y sellos suman al costo real por pedido.",
      en: "Box, bag, and seals add to the real cost per order.",
    },
  },
  "delivery-packaging-cost-per-order": {
    src: IMG.veggie,
    alt: {
      es: "Pedido empacado: el packaging también es línea de P&L",
      en: "Packed order: packaging is a P&L line too",
    },
    caption: {
      es: "Caja, bolsa y sellos suman al costo real por pedido.",
      en: "Box, bag, and seals add to the real cost per order.",
    },
  },
  "control-room": {
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
};

/** Foto de apoyo distinta de la portada (y, cuando se puede, de otros artículos). */
const MID_BY_SLUG: Record<string, CoverAsset> = {
  "rentabilidad-delivery-apps-restaurantes": {
    src: IMG.casoBirra,
    alt: {
      es: "Restaurante midiendo performance por canal de delivery",
      en: "Restaurant measuring delivery-channel performance",
    },
    caption: {
      es: "Si la liquidación y el P&L no se cruzan, estás opinando del canal a ciegas.",
      en: "If the payout and the P&L never meet, you're judging the channel blind.",
    },
  },
  "delivery-app-profitability-per-order-pl": {
    src: IMG.casoBirra,
    alt: {
      es: "Restaurante midiendo performance por canal de delivery",
      en: "Restaurant measuring delivery-channel performance",
    },
    caption: {
      es: "Si la liquidación y el P&L no se cruzan, estás opinando del canal a ciegas.",
      en: "If the payout and the P&L never meet, you're judging the channel blind.",
    },
  },
  "take-rate-real-apps-delivery": {
    src: IMG.casoPekin,
    alt: {
      es: "Cocina de cadena: el take rate se ve en la caja, no en el contrato",
      en: "Chain kitchen: take rate shows up in the till, not the contract",
    },
    caption: {
      es: "Ads, promos y cancelaciones empujan el costo efectivo por encima de la comisión.",
      en: "Ads, promos, and cancellations push effective cost above the commission.",
    },
  },
  "real-take-rate-delivery-apps": {
    src: IMG.casoPekin,
    alt: {
      es: "Cocina de cadena: el take rate se ve en la caja, no en el contrato",
      en: "Chain kitchen: take rate shows up in the till, not the contract",
    },
    caption: {
      es: "Ads, promos y cancelaciones empujan el costo efectivo por encima de la comisión.",
      en: "Ads, promos, and cancellations push effective cost above the commission.",
    },
  },
  "como-leer-liquidacion-app-delivery": {
    src: IMG.dashboard,
    alt: {
      es: "Tablero para conciliar liquidación y margen por pedido",
      en: "Board to reconcile payout and per-order margin",
    },
    caption: {
      es: "Cada línea de la liquidación tiene que tener dueño en tu P&L.",
      en: "Every payout line needs an owner in your P&L.",
    },
  },
  "delivery-app-payout-statement-explained": {
    src: IMG.dashboard,
    alt: {
      es: "Tablero para conciliar liquidación y margen por pedido",
      en: "Board to reconcile payout and per-order margin",
    },
    caption: {
      es: "Cada línea de la liquidación tiene que tener dueño en tu P&L.",
      en: "Every payout line needs an owner in your P&L.",
    },
  },
  "cuanto-subir-precios-apps-delivery": {
    src: IMG.casoLima,
    alt: {
      es: "Plato premium para menú digital de delivery",
      en: "Premium plate for a digital delivery menu",
    },
    caption: {
      es: "Foto, descripción y posición en el menú son pricing.",
      en: "Photo, description, and menu position are pricing.",
    },
  },
  "how-much-raise-delivery-app-prices": {
    src: IMG.casoLima,
    alt: {
      es: "Plato premium para menú digital de delivery",
      en: "Premium plate for a digital delivery menu",
    },
    caption: {
      es: "Foto, descripción y posición en el menú son pricing.",
      en: "Photo, description, and menu position are pricing.",
    },
  },
  "como-aparecer-primero-apps-delivery": {
    src: IMG.casoPiccola,
    alt: {
      es: "Local con oferta lista para aparecer primero en la app",
      en: "Location with an offer ready to rank first in the app",
    },
    caption: {
      es: "El ranking también se cocina en packing y tiempos. Un 4.2 no se arregla con más ads.",
      en: "Ranking is also cooked in packing and times. A 4.2 isn't fixed with more ads.",
    },
  },
  "rank-higher-delivery-apps-profitable-orders": {
    src: IMG.casoPiccola,
    alt: {
      es: "Local con oferta lista para aparecer primero en la app",
      en: "Location with an offer ready to rank first in the app",
    },
    caption: {
      es: "El ranking también se cocina en packing y tiempos. Un 4.2 no se arregla con más ads.",
      en: "Ranking is also cooked in packing and times. A 4.2 isn't fixed with more ads.",
    },
  },
  "cuantas-apps-delivery-restaurante": {
    src: IMG.performance,
    alt: {
      es: "Comparando contribución por app antes de abrir otro canal",
      en: "Comparing contribution per app before opening another channel",
    },
    caption: {
      es: "Si la segunda app no deja contribución, es ruido operativo.",
      en: "If the second app doesn't leave contribution, it's operational noise.",
    },
  },
  "how-many-delivery-apps-restaurant": {
    src: IMG.performance,
    alt: {
      es: "Comparando contribución por app antes de abrir otro canal",
      en: "Comparing contribution per app before opening another channel",
    },
    caption: {
      es: "Si la segunda app no deja contribución, es ruido operativo.",
      en: "If the second app doesn't leave contribution, it's operational noise.",
    },
  },
  "como-reducir-cancelaciones-delivery": {
    src: IMG.casoBirra,
    alt: {
      es: "Cocina controlando stock y tiempos para evitar cancelaciones",
      en: "Kitchen controlling stock and times to avoid cancellations",
    },
    caption: {
      es: "Una sucursal con stock mentiroso cancela por las dos. El 86 tiene que ser un dato, no un rumor.",
      en: "A location with lying stock cancels for two. The 86 has to be a data point, not a rumor.",
    },
  },
  "reduce-delivery-cancellations-multiple-locations": {
    src: IMG.casoBirra,
    alt: {
      es: "Cocina controlando stock y tiempos para evitar cancelaciones",
      en: "Kitchen controlling stock and times to avoid cancellations",
    },
    caption: {
      es: "Una sucursal con stock mentiroso cancela por las dos. El 86 tiene que ser un dato, no un rumor.",
      en: "A location with lying stock cancels for two. The 86 has to be a data point, not a rumor.",
    },
  },
  "como-recuperar-rating-delivery-multi-sucursal": {
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
  "recover-delivery-app-rating-multi-location": {
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
  "indicadores-mañana-delivery-multi-sucursal": {
    src: IMG.casoEmpanadas,
    alt: {
      es: "Sucursales en operación: el tablero matutino tiene que caber en una pantalla",
      en: "Locations live: the morning board has to fit on one screen",
    },
    caption: {
      es: "Weekly compara sucursales. War room se abre por umbral, no por costumbre.",
      en: "Weekly compares locations. War room opens on a threshold, not by habit.",
    },
  },
  "morning-metrics-checklist-multi-location-delivery": {
    src: IMG.casoEmpanadas,
    alt: {
      es: "Sucursales en operación: el tablero matutino tiene que caber en una pantalla",
      en: "Locations live: the morning board has to fit on one screen",
    },
    caption: {
      es: "Weekly compara sucursales. War room se abre por umbral, no por costumbre.",
      en: "Weekly compares locations. War room opens on a threshold, not by habit.",
    },
  },
  "controlar-operacion-delivery-multi-sucursal": {
    src: IMG.tecnologia,
    alt: {
      es: "Control room: checklist diario para varias sucursales",
      en: "Control room: daily checklist across locations",
    },
    caption: {
      es: "Si no hay dueño por alerta, el dato no baja a la cocina.",
      en: "If no one owns the alert, the data never reaches the kitchen.",
    },
  },
  "multi-location-delivery-daily-control-checklist": {
    src: IMG.tecnologia,
    alt: {
      es: "Control room: checklist diario para varias sucursales",
      en: "Control room: daily checklist across locations",
    },
    caption: {
      es: "Si no hay dueño por alerta, el dato no baja a la cocina.",
      en: "If no one owns the alert, the data never reaches the kitchen.",
    },
  },
  "reunion-diaria-operaciones-delivery": {
    src: IMG.gestion,
    alt: {
      es: "Equipo en ritual de ops: standup, weekly y war room",
      en: "Ops team ritual: standup, weekly, and war room",
    },
    caption: {
      es: "Tres capas. Una sola verdad. Decisiones con dueño.",
      en: "Three layers. One source of truth. Decisions with owners.",
    },
  },
  "daily-delivery-operations-meeting-ritual": {
    src: IMG.gestion,
    alt: {
      es: "Equipo en ritual de ops: standup, weekly y war room",
      en: "Ops team ritual: standup, weekly, and war room",
    },
    caption: {
      es: "Tres capas. Una sola verdad. Decisiones con dueño.",
      en: "Three layers. One source of truth. Decisions with owners.",
    },
  },
  "tiempo-de-preparacion-delivery": {
    src: IMG.veggie,
    alt: {
      es: "Pedido en pase: el reloj de prep time se gana acá",
      en: "Order at the pass: prep-time clock is won here",
    },
    caption: {
      es: "Verde, ámbar, rojo por sucursal y franja. Sin umbral, no hay alerta.",
      en: "Green, amber, red by location and shift. No threshold, no alert.",
    },
  },
  "kitchen-prep-time-multi-location-delivery": {
    src: IMG.veggie,
    alt: {
      es: "Pedido en pase: el reloj de prep time se gana acá",
      en: "Order at the pass: prep-time clock is won here",
    },
    caption: {
      es: "Verde, ámbar, rojo por sucursal y franja. Sin umbral, no hay alerta.",
      en: "Green, amber, red by location and shift. No threshold, no alert.",
    },
  },
  "como-comparar-sucursales-delivery": {
    src: IMG.casoRoma,
    alt: {
      es: "Dos locales, un mismo método: same-store antes de rankear",
      en: "Two locations, one method: same-store before ranking",
    },
    caption: {
      es: "Compará tendencias normalizadas, no absolutos crudos.",
      en: "Compare normalized trends, not raw absolutes.",
    },
  },
  "compare-delivery-locations-fairly": {
    src: IMG.casoRoma,
    alt: {
      es: "Dos locales, un mismo método: same-store antes de rankear",
      en: "Two locations, one method: same-store before ranking",
    },
    caption: {
      es: "Compará tendencias normalizadas, no absolutos crudos.",
      en: "Compare normalized trends, not raw absolutes.",
    },
  },
  "promociones-apps-delivery-cuales-convienen": {
    src: IMG.insightRentable,
    alt: {
      es: "Promo medida contra contribución, no contra vanidad de pedidos",
      en: "Promo measured against contribution, not order vanity",
    },
    caption: {
      es: "Si no sabés el margen del plato, no sabés si la promo paga.",
      en: "If you don't know the plate margin, you don't know if the promo pays.",
    },
  },
  "delivery-app-promotions-worth-it": {
    src: IMG.insightRentable,
    alt: {
      es: "Promo medida contra contribución, no contra vanidad de pedidos",
      en: "Promo measured against contribution, not order vanity",
    },
    caption: {
      es: "Si no sabés el margen del plato, no sabés si la promo paga.",
      en: "If you don't know the plate margin, you don't know if the promo pays.",
    },
  },
  "war-room-operaciones-delivery": {
    src: IMG.equipo3,
    alt: {
      es: "Equipo de growth en war room de delivery",
      en: "Growth team in a delivery war room",
    },
    caption: {
      es: "Se abre por umbral: cancelaciones, rating o prep time fuera de banda.",
      en: "Opens on a threshold: cancellations, rating, or prep time out of band.",
    },
  },
  "delivery-war-room-multi-location-ops": {
    src: IMG.equipo3,
    alt: {
      es: "Equipo de growth en war room de delivery",
      en: "Growth team in a delivery war room",
    },
    caption: {
      es: "Se abre por umbral: cancelaciones, rating o prep time fuera de banda.",
      en: "Opens on a threshold: cancellations, rating, or prep time out of band.",
    },
  },
  "cuanto-cuesta-packaging-delivery-pnl": {
    src: IMG.casoPekin,
    alt: {
      es: "Cocina en hora pico: el packaging se decide antes del rush",
      en: "Kitchen at peak: packaging is decided before the rush",
    },
    caption: {
      es: "Costo por pedido × volumen: ahí se ve si el packaging come margen.",
      en: "Cost per order × volume: that's where packaging eats margin.",
    },
  },
  "delivery-packaging-cost-per-order": {
    src: IMG.casoPekin,
    alt: {
      es: "Cocina en hora pico: el packaging se decide antes del rush",
      en: "Kitchen at peak: packaging is decided before the rush",
    },
    caption: {
      es: "Costo por pedido × volumen: ahí se ve si el packaging come margen.",
      en: "Cost per order × volume: that's where packaging eats margin.",
    },
  },
};

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
  "cuantas-apps-delivery-restaurante": "ticket",
  "how-many-delivery-apps-restaurant": "ticket",
  "como-reducir-cancelaciones-delivery": "cancel",
  "reduce-delivery-cancellations-multiple-locations": "cancel",
  "tiempo-de-preparacion-delivery": "cancel",
  "kitchen-prep-time-multi-location-delivery": "cancel",
  "controlar-operacion-delivery-multi-sucursal": "ops",
  "multi-location-delivery-daily-control-checklist": "ops",
  "indicadores-mañana-delivery-multi-sucursal": "ops",
  "morning-metrics-checklist-multi-location-delivery": "ops",
  "reunion-diaria-operaciones-delivery": "ops",
  "daily-delivery-operations-meeting-ritual": "ops",
  "como-comparar-sucursales-delivery": "ops",
  "compare-delivery-locations-fairly": "ops",
  "control-room": "ops",
  "como-recuperar-rating-delivery-multi-sucursal": "rating",
  "recover-delivery-app-rating-multi-location": "rating",
};

function packFor(slug: string): ArticleVisual {
  const key = SLUG_PACK[slug];
  if (key) return PACKS[key];
  if (/rentab|profit|take-rate|liquidac|payout|pl/.test(slug)) return PACKS.pl;
  if (/precio|ticket|price|cuantas-apps|how-many-delivery/.test(slug)) return PACKS.ticket;
  if (/cancel|prep-time|preparacion/.test(slug)) return PACKS.cancel;
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
  return uniqueCoverFor(slug);
}

function midFor(slug: string): CoverAsset {
  return uniqueMidFor(slug);
}

function publishedCanonicalSlugs(): string[] {
  const here = dirname(fileURLToPath(import.meta.url));
  const statePath = join(here, "..", "..", "data", "state.json");
  const slugs = new Set<string>();
  if (existsSync(statePath)) {
    try {
      const raw = JSON.parse(readFileSync(statePath, "utf8")) as {
        published?: { slug?: string; pathEn?: string }[];
      };
      for (const p of raw.published ?? []) {
        if (p.slug) slugs.add(canonicalSlug(p.slug));
        if (p.pathEn) slugs.add(canonicalSlug(p.pathEn.split("/").pop() ?? ""));
      }
    } catch {
      /* ignore */
    }
  }
  // Fallback: preferencias explícitas si todavía no hay state.
  if (slugs.size === 0) {
    for (const k of Object.keys(COVER_BY_SLUG)) slugs.add(canonicalSlug(k));
  }
  return [...slugs].filter(Boolean).sort();
}

let coverAssignments: Map<string, CoverAsset> | null = null;
let midAssignments: Map<string, CoverAsset> | null = null;

function buildUniqueAssignments(
  preferred: Record<string, CoverAsset>,
  pool: CoverAsset[],
  avoidCoverSrc?: (slug: string) => string | undefined,
): Map<string, CoverAsset> {
  const slugs = publishedCanonicalSlugs();
  const map = new Map<string, CoverAsset>();
  const used = new Set<string>();

  // 1) Preferencias explícitas si no chocan (lookup por slug canónico o crudo).
  for (const slug of slugs) {
    const pref = preferred[slug] ?? preferred[canonicalSlug(slug)];
    if (!pref) continue;
    const avoid = avoidCoverSrc?.(slug);
    if (used.has(pref.src) || (avoid && pref.src === avoid)) continue;
    map.set(slug, pref);
    used.add(pref.src);
  }

  // 2) Resto: pool sin repetir.
  const free = pool.filter((a) => !used.has(a.src));
  let i = 0;
  for (const slug of slugs) {
    if (map.has(slug)) continue;
    const avoid = avoidCoverSrc?.(slug);
    while (i < free.length && (used.has(free[i]!.src) || free[i]!.src === avoid)) i += 1;
    const pick =
      free[i] ??
      pool.find((a) => !used.has(a.src) && a.src !== avoid) ??
      pool.find((a) => !used.has(a.src));
    if (!pick) {
      // Pool agotado: no reutilizar portadas ya asignadas.
      throw new Error(
        `No quedan portadas únicas para "${slug}". Ampliá COVER_POOL o revisá preferencias duplicadas.`,
      );
    }
    map.set(slug, pick);
    used.add(pick.src);
    i += 1;
  }
  return map;
}

function uniqueCoverFor(slug: string): CoverAsset {
  if (!coverAssignments) {
    coverAssignments = buildUniqueAssignments(COVER_BY_SLUG, COVER_POOL);
  }
  const key = canonicalSlug(slug);
  return (
    coverAssignments.get(key) ??
    COVER_BY_SLUG[slug] ??
    COVER_BY_SLUG[key] ??
    COVER_POOL[0]!
  );
}

function uniqueMidFor(slug: string): CoverAsset {
  if (!midAssignments) {
    midAssignments = buildUniqueAssignments(MID_BY_SLUG, COVER_POOL, (s) =>
      uniqueCoverFor(s).src,
    );
  }
  const key = canonicalSlug(slug);
  const coverSrc = uniqueCoverFor(key).src;
  const mid =
    midAssignments.get(key) ??
    MID_BY_SLUG[slug] ??
    MID_BY_SLUG[key] ??
    COVER_POOL.find((a) => a.src !== coverSrc) ??
    COVER_POOL[1]!;
  if (mid.src === coverSrc) {
    return COVER_POOL.find((a) => a.src !== coverSrc) ?? mid;
  }
  return mid;
}

/** Invalidar cache (tests / rebuild tras cambiar state). */
export function resetVisualAssignments(): void {
  coverAssignments = null;
  midAssignments = null;
}

export function leadVisualHtml(slug: string, lang: VisualLang): string {
  const pack = packFor(slug);
  return [
    figureHtml(coverFor(slug), lang, "blog-cover", "lead"),
    statsHtml(pack.stats, lang),
    chartHtml(pack.chart, lang),
  ].join("\n");
}

export function midVisualHtml(slug: string, lang: VisualLang): string {
  return figureHtml(midFor(slug), lang, "blog-figure", "mid");
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

  const cover = coverFor(slug);
  const coverAbs = `https://pimenton.io${cover.src}`;
  // Mantener OG / Twitter / JSON-LD alineados con la portada única del artículo.
  out = out.replace(
    /(<meta property="og:image" content=")[^"]*("\s*\/?>)/,
    `$1${coverAbs}$2`,
  );
  out = out.replace(
    /(<meta name="twitter:image" content=")[^"]*("\s*\/?>)/,
    `$1${coverAbs}$2`,
  );
  out = out.replace(
    /("logo"\s*:\s*\{\s*"@type"\s*:\s*"ImageObject"\s*,\s*"url"\s*:\s*")[^"]*(")/,
    `$1${coverAbs}$2`,
  );
  out = out.replace(/("image"\s*:\s*")https:\/\/pimenton\.io[^"]*(")/, `$1${coverAbs}$2`);

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
