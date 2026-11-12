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
import { canonicalSiteUrl } from "../config/site-url.js";

export type VisualLang = "es" | "en" | "it";

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
  equipoCompleto: "/assets/equipo/equipo-completo-v2.webp",
  equipoHero: "/assets/video/equipo-hero-desktop-poster.webp",
  coverPass: "/assets/blog-covers/cover-pass-bags.jpg",
  coverBurgerBox: "/assets/blog-covers/cover-burger-box.jpg",
  coverPizza: "/assets/blog-covers/cover-pizza-peel.jpg",
  coverSushiBox: "/assets/blog-covers/cover-sushi-box.jpg",
  coverCourierWindow: "/assets/blog-covers/cover-courier-window.jpg",
  coverMise: "/assets/blog-covers/cover-mise-en-place.jpg",
  coverStorefronts: "/assets/blog-covers/cover-two-storefronts.jpg",
  coverHuddle: "/assets/blog-covers/cover-huddle.jpg",
  coverPackaging: "/assets/blog-covers/cover-packaging-line.jpg",
  coverEmpanadas: "/assets/blog-covers/cover-empanadas.jpg",
  coverTacos: "/assets/blog-covers/cover-tacos.jpg",
  coverPastry: "/assets/blog-covers/cover-coffee-pastry.jpg",
  coverInventory: "/assets/blog-covers/cover-inventory.jpg",
  coverTablet: "/assets/blog-covers/cover-tablet-expo.jpg",
  coverDining: "/assets/blog-covers/cover-dining-bags.jpg",
  coverGrill: "/assets/blog-covers/cover-grill.jpg",
} as const;

/** EN → ES para que el par bilingüe comparta la misma portada (IT se lee de state.json). */
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
  "out-of-stock-delivery-menu-availability": "productos-agotados-delivery-disponibilidad-menu",
  "delivery-contribution-margin-per-order": "margen-contribucion-pedido-delivery",
  "when-to-pause-store-delivery-apps": "cuando-pausar-tienda-apps-delivery",
  "improve-restaurant-rating-delivery-apps": "como-mejorar-rating-apps-delivery",
  "delivery-order-error-rate-by-location": "tasa-error-pedidos-delivery",
};

/** Pares EN→ES registrados en esta corrida, antes de que state.json los tenga. */
const runtimePairs = new Map<string, string>();

/**
 * El artículo EN y el ES son el mismo post: comparten portada.
 * Llamar antes de renderizar el par, si todavía no está en state.json.
 */
export function linkCoverPair(esSlug: string, enSlug: string): void {
  if (enSlug && enSlug !== esSlug) runtimePairs.set(enSlug, esSlug);
  resetVisualAssignments();
}

let pairCache: Map<string, string> | null = null;

function slugPairs(): Map<string, string> {
  if (pairCache) return pairCache;
  const map = new Map<string, string>([
    ...Object.entries(SLUG_CANONICAL),
    ...runtimePairs,
  ]);
  const here = dirname(fileURLToPath(import.meta.url));
  const statePath = join(here, "..", "..", "data", "state.json");
  if (existsSync(statePath)) {
    try {
      const raw = JSON.parse(readFileSync(statePath, "utf8")) as {
        published?: { slug?: string; pathEn?: string; pathIt?: string }[];
      };
      for (const p of raw.published ?? []) {
        const en = p.pathEn?.split("/").pop();
        if (p.slug && en) map.set(en, p.slug);
        const it = p.pathIt?.split("/").pop();
        if (p.slug && it) map.set(it, p.slug);
      }
    } catch {
      /* ignore */
    }
  }
  pairCache = map;
  return map;
}

function canonicalSlug(slug: string): string {
  return slugPairs().get(slug) ?? slug;
}

function asset(
  src: string,
  altEs: string,
  altEn: string,
  altIt: string,
  capEs: string,
  capEn: string,
  capIt: string,
): CoverAsset {
  return {
    src,
    alt: { es: altEs, en: altEn, it: altIt },
    caption: { es: capEs, en: capEn, it: capIt },
  };
}

/** Pool de portadas (orden = prioridad de asignación automática). */
const COVER_POOL: CoverAsset[] = [
  asset(IMG.dashboard, "Tablero de análisis de delivery", "Delivery analytics dashboard", "Dashboard di analisi del delivery", "Números del canal, sin drama.", "Channel numbers, no drama.", "I numeri del canale, senza drammi."),
  asset(IMG.performance, "Operación midiendo performance de delivery", "Ops measuring delivery performance", "Operatività che misura la performance del delivery", "Medir antes de opinar del canal.", "Measure before judging the channel.", "Misurare prima di giudicare il canale."),
  asset(IMG.estrategia, "Estrategia de canales de delivery", "Delivery channel strategy", "Strategia dei canali delivery", "Elegir dónde jugar con criterio.", "Choose where to play with criteria.", "Scegliere dove giocare, con criterio."),
  asset(IMG.consultoria, "Consultoría revisando liquidación de apps", "Consultancy reviewing app payouts", "Consulenza che rivede l'estratto conto delle app", "La liquidación cuenta la historia real.", "The payout tells the real story.", "L'estratto conto racconta la storia vera."),
  asset(IMG.tecnologia, "Tecnología y control de pedidos", "Tech and order control", "Tecnologia e controllo degli ordini", "Visibilidad para no operar a ciegas.", "Visibility so you don't fly blind.", "Visibilità per non lavorare alla cieca."),
  asset(IMG.gestion, "Gestión integral multi-sucursal", "Multi-location ops management", "Gestione integrata multi-sede", "Un ritmo, varios locales.", "One rhythm, several locations.", "Un ritmo, più locali."),
  asset(IMG.burger, "Plato de burger para menú digital", "Burger plate for a digital menu", "Burger impiattato per il menu digitale", "El menú también es pricing.", "The menu is pricing too.", "Anche il menu è pricing."),
  asset(IMG.sushi, "Plato de sushi listo para delivery", "Sushi plate ready for delivery", "Piatto di sushi pronto per il delivery", "Presentación que convierte en la app.", "Presentation that converts in the app.", "Una presentazione che converte nell'app."),
  asset(IMG.kitchen, "Cocina preparando un pedido", "Kitchen preparing an order", "Cucina che prepara un ordine", "El pase define tiempos y rating.", "The pass defines times and rating.", "Il pass decide tempi e rating."),
  asset(IMG.veggie, "Pedido veggie empaquetado", "Packed veggie order", "Ordine veggie confezionato", "Packaging también es margen.", "Packaging is margin too.", "Anche il packaging è margine."),
  asset(IMG.courier, "Repartidor en ruta de delivery", "Courier on a delivery route", "Rider in consegna", "La última milla cierra la experiencia.", "Last mile closes the experience.", "L'ultimo miglio chiude l'esperienza."),
  asset(IMG.casoBirra, "Local de restaurante en servicio", "Restaurant floor in service", "Sala del ristorante in servizio", "Ops reales, no slides.", "Real ops, not slides.", "Operatività reale, non slide."),
  asset(IMG.casoEmpanadas, "Cocina de empanadas multi-sucursal", "Multi-location empanada kitchen", "Cucina di empanadas multi-sede", "Comparar locales con método.", "Compare locations with a method.", "Confrontare i locali con metodo."),
  asset(IMG.casoPekin, "Cocina de cadena en hora pico", "Chain kitchen at peak hour", "Cucina di una catena nell'ora di punta", "Volumen sin perder control.", "Volume without losing control.", "Volume senza perdere il controllo."),
  asset(IMG.casoLima, "Plato premium de sushi", "Premium sushi plate", "Piatto premium di sushi", "Ticket y foto van juntos.", "Ticket and photo go together.", "Scontrino e foto vanno insieme."),
  asset(IMG.casoRoma, "Interior de restaurante", "Restaurant interior", "Interno di un ristorante", "Misma marca, distintas realidades por local.", "Same brand, different realities per location.", "Stesso brand, realtà diverse per ogni locale."),
  asset(IMG.casoPiccola, "Sala de restaurante italiano", "Italian restaurant dining room", "Sala di un ristorante italiano", "Experiencia que también viaja en la app.", "Experience that also travels in the app.", "Un'esperienza che viaggia anche nell'app."),
  asset(IMG.insightRentable, "Delivery rentable en la práctica", "Profitable delivery in practice", "Delivery redditizio nella pratica", "Rentabilidad es sistema, no suerte.", "Profitability is a system, not luck.", "La redditività è un sistema, non fortuna."),
  asset(IMG.insightPro, "Profesionalizar el canal delivery", "Professionalizing the delivery channel", "Professionalizzare il canale delivery", "Proceso antes que volumen.", "Process before volume.", "Processo prima del volume."),
  asset(IMG.insightTicket, "Subir ticket promedio en delivery", "Raising average delivery ticket", "Aumentare lo scontrino medio nel delivery", "Más ticket, mejor contribución.", "Higher ticket, better contribution.", "Scontrino più alto, contribuzione migliore."),
  asset(IMG.reseñas, "Gestión de reseñas y rating", "Review and rating management", "Gestione di recensioni e rating", "El rating se gana en el pase.", "Rating is won at the pass.", "Il rating si conquista al pass."),
  asset(IMG.equipo1, "Equipo de ops en acción", "Ops team in action", "Team ops in azione", "Personas detrás del ritual diario.", "People behind the daily ritual.", "Persone dietro il rituale quotidiano."),
  asset(IMG.equipo2, "Equipo revisando números de delivery", "Team reviewing delivery numbers", "Team che rivede i numeri del delivery", "Datos con dueño.", "Data with an owner.", "Dati con un responsabile."),
  asset(IMG.equipo3, "Equipo de growth gastronómico", "Foodservice growth team", "Team di growth per la ristorazione", "Criterio de restaurante, no de slide.", "Restaurant judgment, not slideware.", "Criterio da ristoratore, non da slide."),
  asset(IMG.equipoCompleto, "Equipo de Pimentón junto", "Pimentón team together", "Il team di Pimentón al completo", "La operación tiene dueños.", "The operation has owners.", "L'operatività ha dei responsabili."),
  asset(IMG.equipoHero, "Equipo en la operación diaria", "Team in the daily operation", "Team nell'operatività quotidiana", "Personas, no solo tableros.", "People, not just dashboards.", "Persone, non solo dashboard."),
  asset(IMG.coverPass, "Bolsas de delivery en el pase", "Delivery bags at the pass", "Borse delivery al pass", "El pase es donde se gana el pedido.", "The pass is where the order is won.", "Al pass si vince l'ordine."),
  asset(IMG.coverBurgerBox, "Burger entrando a la caja de delivery", "Burger going into a delivery box", "Burger che entra nel box delivery", "Empaque y presentación viajan juntos.", "Packaging and presentation travel together.", "Packaging e presentazione viaggiano insieme."),
  asset(IMG.coverPizza, "Pizza saliendo del horno para delivery", "Pizza leaving the oven for delivery", "Pizza che esce dal forno per il delivery", "El horno marca el reloj del canal.", "The oven sets the channel clock.", "Il forno detta il ritmo del canale."),
  asset(IMG.coverSushiBox, "Sushi armado para llevar", "Sushi packed to go", "Sushi confezionato da asporto", "El armado también es margen.", "Plating is margin too.", "Anche l'assemblaggio è margine."),
  asset(IMG.coverCourierWindow, "Ventana de retiro para repartidores", "Courier pickup window", "Finestra di ritiro per i rider", "La última milla empieza en el local.", "Last mile starts at the store.", "L'ultimo miglio parte dal locale."),
  asset(IMG.coverMise, "Mise en place antes del servicio", "Mise en place before service", "Mise en place prima del servizio", "Si falta insumo, falla el pedido.", "If an item is missing, the order fails.", "Se manca un ingrediente, salta l'ordine."),
  asset(IMG.coverStorefronts, "Dos locales de la misma calle", "Two storefronts on the same street", "Due locali sulla stessa via", "Cada local es una operación distinta.", "Each location is its own operation.", "Ogni locale è un'operatività a sé."),
  asset(IMG.coverHuddle, "Reunión corta de cocina antes del turno", "Short kitchen huddle before the shift", "Breve riunione di cucina prima del turno", "Diez minutos alinean el turno.", "Ten minutes align the shift.", "Dieci minuti allineano il turno."),
  asset(IMG.coverPackaging, "Estación de packaging de delivery", "Delivery packaging station", "Postazione packaging del delivery", "Caja, bolsa y sello son costo.", "Box, bag, and seal are cost.", "Scatola, busta e sigillo sono costo."),
  asset(IMG.coverEmpanadas, "Empanadas listas para despachar", "Empanadas ready to dispatch", "Empanadas pronte da spedire", "Volumen con el mismo estándar.", "Volume with the same standard.", "Volume con lo stesso standard."),
  asset(IMG.coverTacos, "Tacos porcionados para llevar", "Tacos portioned for takeaway", "Tacos porzionati da asporto", "La porción define el ticket.", "The portion defines the ticket.", "La porzione definisce lo scontrino."),
  asset(IMG.coverPastry, "Café y medialunas para delivery de mañana", "Coffee and pastries for the morning delivery", "Caffè e cornetti per il delivery del mattino", "El turno de la mañana también es canal.", "The morning shift is a channel too.", "Anche il turno del mattino è canale."),
  asset(IMG.coverInventory, "Depósito de insumos del restaurante", "Restaurant ingredient storage", "Magazzino ingredienti del ristorante", "Stock corto se ve en cancelaciones.", "Short stock shows up as cancellations.", "Lo stock corto si vede nelle cancellazioni."),
  asset(IMG.coverTablet, "Tablet de expo en la cocina", "Expo tablet in the kitchen", "Tablet di expo in cucina", "Un tablero, un dueño, un umbral.", "One board, one owner, one threshold.", "Una dashboard, un responsabile, una soglia."),
  asset(IMG.coverDining, "Bolsas de delivery en el salón", "Delivery bags in the dining room", "Borse delivery in sala", "El canal convive con el salón.", "The channel lives next to the dining room.", "Il canale convive con la sala."),
  asset(IMG.coverGrill, "Parrilla en hora pico", "Grill at peak hour", "Griglia nell'ora di punta", "El pico no perdona el prep time.", "Peak hour does not forgive prep time.", "Il picco non perdona i tempi di preparazione."),
];

/** Portada única por artículo — el índice y los teasers no deben repetir foto. */
const COVER_BY_SLUG: Record<string, CoverAsset> = {
  "rentabilidad-delivery-apps-restaurantes": {
    src: IMG.dashboard,
    alt: {
      es: "Tablero de P&L de delivery: margen, comisión y pedidos",
      en: "Delivery P&L dashboard: margin, commission, and orders",
      it: "Dashboard P&L del delivery: margine, commissione e ordini",
    },
    caption: {
      es: "El P&L por pedido es el tablero que falta en la mayoría de las cocinas.",
      en: "The per-order P&L is the dashboard missing from most kitchens.",
      it: "Il P&L per ordine è la dashboard che manca nella maggior parte delle cucine.",
    },
  },
  "delivery-app-profitability-per-order-pl": {
    src: IMG.dashboard,
    alt: {
      es: "Tablero de P&L de delivery: margen, comisión y pedidos",
      en: "Delivery P&L dashboard: margin, commission, and orders",
      it: "Dashboard P&L del delivery: margine, commissione e ordini",
    },
    caption: {
      es: "El P&L por pedido es el tablero que falta en la mayoría de las cocinas.",
      en: "The per-order P&L is the dashboard missing from most kitchens.",
      it: "Il P&L per ordine è la dashboard che manca nella maggior parte delle cucine.",
    },
  },
  "take-rate-real-apps-delivery": {
    src: IMG.performance,
    alt: {
      es: "Operación midiendo el costo real por canal de delivery",
      en: "Ops measuring the true cost per delivery channel",
      it: "Operatività che misura il costo reale per canale delivery",
    },
    caption: {
      es: "El take rate del contrato no es el costo que llega a caja.",
      en: "The contract take rate isn't the cost that hits the till.",
      it: "Il take rate del contratto non è il costo che arriva in cassa.",
    },
  },
  "real-take-rate-delivery-apps": {
    src: IMG.performance,
    alt: {
      es: "Operación midiendo el costo real por canal de delivery",
      en: "Ops measuring the true cost per delivery channel",
      it: "Operatività che misura il costo reale per canale delivery",
    },
    caption: {
      es: "El take rate del contrato no es el costo que llega a caja.",
      en: "The contract take rate isn't the cost that hits the till.",
      it: "Il take rate del contratto non è il costo che arriva in cassa.",
    },
  },
  "como-leer-liquidacion-app-delivery": {
    src: IMG.consultoria,
    alt: {
      es: "Liquidación de app de delivery revisada línea por línea",
      en: "Delivery app payout statement reviewed line by line",
      it: "Estratto conto dell'app di delivery rivisto riga per riga",
    },
    caption: {
      es: "Antes de opinar del canal, conciliá la liquidación.",
      en: "Before judging the channel, reconcile the payout.",
      it: "Prima di giudicare il canale, riconcilia l'estratto conto.",
    },
  },
  "delivery-app-payout-statement-explained": {
    src: IMG.consultoria,
    alt: {
      es: "Liquidación de app de delivery revisada línea por línea",
      en: "Delivery app payout statement reviewed line by line",
      it: "Estratto conto dell'app di delivery rivisto riga per riga",
    },
    caption: {
      es: "Antes de opinar del canal, conciliá la liquidación.",
      en: "Before judging the channel, reconcile the payout.",
      it: "Prima di giudicare il canale, riconcilia l'estratto conto.",
    },
  },
  "cuanto-subir-precios-apps-delivery": {
    src: IMG.burger,
    alt: {
      es: "Plato de burger gourmet: ticket alto sin bajar precio",
      en: "Gourmet burger plate: high ticket without cutting price",
      it: "Burger gourmet: scontrino alto senza abbassare il prezzo",
    },
    caption: {
      es: "Subir ticket es vender más completo, no más barato.",
      en: "Raising ticket is selling more complete, not cheaper.",
      it: "Alzare lo scontrino è vendere più completo, non più economico.",
    },
  },
  "how-much-raise-delivery-app-prices": {
    src: IMG.burger,
    alt: {
      es: "Plato de burger gourmet: ticket alto sin bajar precio",
      en: "Gourmet burger plate: high ticket without cutting price",
      it: "Burger gourmet: scontrino alto senza abbassare il prezzo",
    },
    caption: {
      es: "Subir ticket es vender más completo, no más barato.",
      en: "Raising ticket is selling more complete, not cheaper.",
      it: "Alzare lo scontrino è vendere più completo, non più economico.",
    },
  },
  "como-aparecer-primero-apps-delivery": {
    src: IMG.estrategia,
    alt: {
      es: "Estrategia de visibilidad en apps de delivery",
      en: "Visibility strategy on delivery apps",
      it: "Strategia di visibilità nelle app di delivery",
    },
    caption: {
      es: "Aparecer primero no es un truco del algoritmo: son palancas que sí controlás.",
      en: "Ranking first isn't an algorithm trick: there are levers you do control.",
      it: "Comparire per primi non è un trucco dell'algoritmo: sono leve che controlli davvero.",
    },
  },
  "rank-higher-delivery-apps-profitable-orders": {
    src: IMG.estrategia,
    alt: {
      es: "Estrategia de visibilidad en apps de delivery",
      en: "Visibility strategy on delivery apps",
      it: "Strategia di visibilità nelle app di delivery",
    },
    caption: {
      es: "Aparecer primero no es un truco del algoritmo: son palancas que sí controlás.",
      en: "Ranking first isn't an algorithm trick: there are levers you do control.",
      it: "Comparire per primi non è un trucco dell'algoritmo: sono leve che controlli davvero.",
    },
  },
  "cuantas-apps-delivery-restaurante": {
    src: IMG.sushi,
    alt: {
      es: "Plato premium: elegir apps por contribución, no por moda",
      en: "Premium plate: choose apps by contribution, not by trend",
      it: "Piatto premium: scegliere le app per contribuzione, non per moda",
    },
    caption: {
      es: "Más apps no es más margen. Es más complejidad.",
      en: "More apps isn't more margin. It's more complexity.",
      it: "Più app non significa più margine. Significa più complessità.",
    },
  },
  "how-many-delivery-apps-restaurant": {
    src: IMG.sushi,
    alt: {
      es: "Plato premium: elegir apps por contribución, no por moda",
      en: "Premium plate: choose apps by contribution, not by trend",
      it: "Piatto premium: scegliere le app per contribuzione, non per moda",
    },
    caption: {
      es: "Más apps no es más margen. Es más complejidad.",
      en: "More apps isn't more margin. It's more complexity.",
      it: "Più app non significa più margine. Significa più complessità.",
    },
  },
  "como-reducir-cancelaciones-delivery": {
    src: IMG.kitchen,
    alt: {
      es: "Cocina preparando un pedido: donde nacen las cancelaciones",
      en: "Kitchen prepping an order: where cancellations are born",
      it: "Cucina che prepara un ordine: dove nascono le cancellazioni",
    },
    caption: {
      es: "Las cancelaciones no son “la app”: son stock, tiempos y datos sucios.",
      en: "Cancellations aren't “the app”: they're stock, times, and dirty data.",
      it: "Le cancellazioni non sono “colpa dell'app”: sono stock, tempi e dati sporchi.",
    },
  },
  "reduce-delivery-cancellations-multiple-locations": {
    src: IMG.kitchen,
    alt: {
      es: "Cocina preparando un pedido: donde nacen las cancelaciones",
      en: "Kitchen prepping an order: where cancellations are born",
      it: "Cucina che prepara un ordine: dove nascono le cancellazioni",
    },
    caption: {
      es: "Las cancelaciones no son “la app”: son stock, tiempos y datos sucios.",
      en: "Cancellations aren't “the app”: they're stock, times, and dirty data.",
      it: "Le cancellazioni non sono “colpa dell'app”: sono stock, tempi e dati sporchi.",
    },
  },
  "como-recuperar-rating-delivery-multi-sucursal": {
    src: IMG.courier,
    alt: {
      es: "Repartidor entregando un pedido: el rating se cocina en la calle",
      en: "Courier handing off an order: rating is cooked on the street",
      it: "Rider che consegna un ordine: il rating si cucina in strada",
    },
    caption: {
      es: "El cliente no separa la app de tu sucursal. Tiempos, packing y pedido correcto son el rating.",
      en: "The customer doesn't separate the app from your location. Times, packing, and a correct order are the rating.",
      it: "Il cliente non separa l'app dalla tua sede. Tempi, packaging e ordine corretto sono il rating.",
    },
  },
  "recover-delivery-app-rating-multi-location": {
    src: IMG.courier,
    alt: {
      es: "Repartidor entregando un pedido: el rating se cocina en la calle",
      en: "Courier handing off an order: rating is cooked on the street",
      it: "Rider che consegna un ordine: il rating si cucina in strada",
    },
    caption: {
      es: "El cliente no separa la app de tu sucursal. Tiempos, packing y pedido correcto son el rating.",
      en: "The customer doesn't separate the app from your location. Times, packing, and a correct order are the rating.",
      it: "Il cliente non separa l'app dalla tua sede. Tempi, packaging e ordine corretto sono il rating.",
    },
  },
  "indicadores-mañana-delivery-multi-sucursal": {
    src: IMG.tecnologia,
    alt: {
      es: "Control room de delivery: checklist matutino de KPIs",
      en: "Delivery control room: morning KPI checklist",
      it: "Control room del delivery: checklist mattutina dei KPI",
    },
    caption: {
      es: "Cinco indicadores, dueño, umbral. El resto es ruido.",
      en: "Five metrics, owner, threshold. Everything else is noise.",
      it: "Cinque indicatori, responsabile, soglia. Il resto è rumore.",
    },
  },
  "morning-metrics-checklist-multi-location-delivery": {
    src: IMG.tecnologia,
    alt: {
      es: "Control room de delivery: checklist matutino de KPIs",
      en: "Delivery control room: morning KPI checklist",
      it: "Control room del delivery: checklist mattutina dei KPI",
    },
    caption: {
      es: "Cinco indicadores, dueño, umbral. El resto es ruido.",
      en: "Five metrics, owner, threshold. Everything else is noise.",
      it: "Cinque indicatori, responsabile, soglia. Il resto è rumore.",
    },
  },
  "controlar-operacion-delivery-multi-sucursal": {
    src: IMG.gestion,
    alt: {
      es: "Equipo operando delivery multi-sucursal con un tablero compartido",
      en: "Team running multi-location delivery from a shared board",
      it: "Team che gestisce il delivery multi-sede con una dashboard condivisa",
    },
    caption: {
      es: "Ritmo, alertas y dueños claros: eso es controlar la operación.",
      en: "Cadence, alerts, and clear owners: that's running the operation.",
      it: "Ritmo, alert e responsabili chiari: questo è controllare l'operatività.",
    },
  },
  "multi-location-delivery-daily-control-checklist": {
    src: IMG.gestion,
    alt: {
      es: "Equipo operando delivery multi-sucursal con un tablero compartido",
      en: "Team running multi-location delivery from a shared board",
      it: "Team che gestisce il delivery multi-sede con una dashboard condivisa",
    },
    caption: {
      es: "Ritmo, alertas y dueños claros: eso es controlar la operación.",
      en: "Cadence, alerts, and clear owners: that's running the operation.",
      it: "Ritmo, alert e responsabili chiari: questo è controllare l'operatività.",
    },
  },
  "reunion-diaria-operaciones-delivery": {
    src: IMG.equipo2,
    alt: {
      es: "Equipo revisando el ritual diario de operaciones",
      en: "Team reviewing the daily operations ritual",
      it: "Team che rivede il rituale quotidiano delle operazioni",
    },
    caption: {
      es: "Un standup de 10 minutos vale más que un dashboard que nadie abre.",
      en: "A 10-minute standup beats a dashboard nobody opens.",
      it: "Uno standup di 10 minuti vale più di una dashboard che nessuno apre.",
    },
  },
  "daily-delivery-operations-meeting-ritual": {
    src: IMG.equipo2,
    alt: {
      es: "Equipo revisando el ritual diario de operaciones",
      en: "Team reviewing the daily operations ritual",
      it: "Team che rivede il rituale quotidiano delle operazioni",
    },
    caption: {
      es: "Un standup de 10 minutos vale más que un dashboard que nadie abre.",
      en: "A 10-minute standup beats a dashboard nobody opens.",
      it: "Uno standup di 10 minuti vale più di una dashboard che nessuno apre.",
    },
  },
  "tiempo-de-preparacion-delivery": {
    src: IMG.casoRoma,
    alt: {
      es: "Cocina de restaurante midiendo tiempo de preparación",
      en: "Restaurant kitchen measuring prep time",
      it: "Cucina di un ristorante che misura il tempo di preparazione",
    },
    caption: {
      es: "El prep time es el tramo del reloj que controla tu cocina.",
      en: "Prep time is the part of the clock your kitchen controls.",
      it: "Il tempo di preparazione è la parte dell'orologio che controlla la tua cucina.",
    },
  },
  "kitchen-prep-time-multi-location-delivery": {
    src: IMG.casoRoma,
    alt: {
      es: "Cocina de restaurante midiendo tiempo de preparación",
      en: "Restaurant kitchen measuring prep time",
      it: "Cucina di un ristorante che misura il tempo di preparazione",
    },
    caption: {
      es: "El prep time es el tramo del reloj que controla tu cocina.",
      en: "Prep time is the part of the clock your kitchen controls.",
      it: "Il tempo di preparazione è la parte dell'orologio che controlla la tua cucina.",
    },
  },
  "como-comparar-sucursales-delivery": {
    src: IMG.casoEmpanadas,
    alt: {
      es: "Operación multi-sucursal: comparar locales sin sesgo de volumen",
      en: "Multi-location ops: compare stores without volume bias",
      it: "Operatività multi-sede: confrontare i locali senza distorsioni da volume",
    },
    caption: {
      es: "Sin normalizar por volumen, franja y mix, el ranking miente.",
      en: "Without normalizing by volume, shift, and mix, the ranking lies.",
      it: "Senza normalizzare per volume, fascia oraria e mix, la classifica mente.",
    },
  },
  "compare-delivery-locations-fairly": {
    src: IMG.casoEmpanadas,
    alt: {
      es: "Operación multi-sucursal: comparar locales sin sesgo de volumen",
      en: "Multi-location ops: compare stores without volume bias",
      it: "Operatività multi-sede: confrontare i locali senza distorsioni da volume",
    },
    caption: {
      es: "Sin normalizar por volumen, franja y mix, el ranking miente.",
      en: "Without normalizing by volume, shift, and mix, the ranking lies.",
      it: "Senza normalizzare per volume, fascia oraria e mix, la classifica mente.",
    },
  },
  "promociones-apps-delivery-cuales-convienen": {
    src: IMG.insightTicket,
    alt: {
      es: "Promos en delivery: calcular el 2x1 antes de publicarlo",
      en: "Delivery promos: calculate the BOGO before you publish it",
      it: "Promo nel delivery: calcola il 2x1 prima di pubblicarlo",
    },
    caption: {
      es: "La promo buena sube contribución; la mala compra volumen a pérdida.",
      en: "A good promo lifts contribution; a bad one buys volume at a loss.",
      it: "La promo buona alza la contribuzione; quella cattiva compra volume in perdita.",
    },
  },
  "delivery-app-promotions-worth-it": {
    src: IMG.insightTicket,
    alt: {
      es: "Promos en delivery: calcular el 2x1 antes de publicarlo",
      en: "Delivery promos: calculate the BOGO before you publish it",
      it: "Promo nel delivery: calcola il 2x1 prima di pubblicarlo",
    },
    caption: {
      es: "La promo buena sube contribución; la mala compra volumen a pérdida.",
      en: "A good promo lifts contribution; a bad one buys volume at a loss.",
      it: "La promo buona alza la contribuzione; quella cattiva compra volume in perdita.",
    },
  },
  "war-room-operaciones-delivery": {
    src: IMG.equipo1,
    alt: {
      es: "War room de ops: cuándo activarlo y con quién",
      en: "Ops war room: when to activate it and with whom",
      it: "War room ops: quando attivarla e con chi",
    },
    caption: {
      es: "No es más pantallas: es ritmo, dueños y umbrales.",
      en: "Not more screens: rhythm, owners, and thresholds.",
      it: "Non servono più schermi: servono ritmo, responsabili e soglie.",
    },
  },
  "delivery-war-room-multi-location-ops": {
    src: IMG.equipo1,
    alt: {
      es: "War room de ops: cuándo activarlo y con quién",
      en: "Ops war room: when to activate it and with whom",
      it: "War room ops: quando attivarla e con chi",
    },
    caption: {
      es: "No es más pantallas: es ritmo, dueños y umbrales.",
      en: "Not more screens: rhythm, owners, and thresholds.",
      it: "Non servono più schermi: servono ritmo, responsabili e soglie.",
    },
  },
  "cuanto-cuesta-packaging-delivery-pnl": {
    src: IMG.veggie,
    alt: {
      es: "Pedido empacado: el packaging también es línea de P&L",
      en: "Packed order: packaging is a P&L line too",
      it: "Ordine confezionato: anche il packaging è una riga del P&L",
    },
    caption: {
      es: "Caja, bolsa y sellos suman al costo real por pedido.",
      en: "Box, bag, and seals add to the real cost per order.",
      it: "Scatola, busta e sigilli pesano sul costo reale per ordine.",
    },
  },
  "delivery-packaging-cost-per-order": {
    src: IMG.veggie,
    alt: {
      es: "Pedido empacado: el packaging también es línea de P&L",
      en: "Packed order: packaging is a P&L line too",
      it: "Ordine confezionato: anche il packaging è una riga del P&L",
    },
    caption: {
      es: "Caja, bolsa y sellos suman al costo real por pedido.",
      en: "Box, bag, and seals add to the real cost per order.",
      it: "Scatola, busta e sigilli pesano sul costo reale per ordine.",
    },
  },
  "control-room": {
    src: IMG.tecnologia,
    alt: {
      es: "Control room de delivery multi-sucursal",
      en: "Multi-location delivery control room",
      it: "Control room del delivery multi-sede",
    },
    caption: {
      es: "Un ritual de 10 minutos vale más que un dashboard que nadie abre.",
      en: "A 10-minute ritual is worth more than a dashboard nobody opens.",
      it: "Un rituale di 10 minuti vale più di una dashboard che nessuno apre.",
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
      it: "Ristorante che misura la performance per canale delivery",
    },
    caption: {
      es: "Si la liquidación y el P&L no se cruzan, estás opinando del canal a ciegas.",
      en: "If the payout and the P&L never meet, you're judging the channel blind.",
      it: "Se estratto conto e P&L non si incrociano, stai giudicando il canale alla cieca.",
    },
  },
  "delivery-app-profitability-per-order-pl": {
    src: IMG.casoBirra,
    alt: {
      es: "Restaurante midiendo performance por canal de delivery",
      en: "Restaurant measuring delivery-channel performance",
      it: "Ristorante che misura la performance per canale delivery",
    },
    caption: {
      es: "Si la liquidación y el P&L no se cruzan, estás opinando del canal a ciegas.",
      en: "If the payout and the P&L never meet, you're judging the channel blind.",
      it: "Se estratto conto e P&L non si incrociano, stai giudicando il canale alla cieca.",
    },
  },
  "take-rate-real-apps-delivery": {
    src: IMG.casoPekin,
    alt: {
      es: "Cocina de cadena: el take rate se ve en la caja, no en el contrato",
      en: "Chain kitchen: take rate shows up in the till, not the contract",
      it: "Cucina di una catena: il take rate si vede in cassa, non nel contratto",
    },
    caption: {
      es: "Ads, promos y cancelaciones empujan el costo efectivo por encima de la comisión.",
      en: "Ads, promos, and cancellations push effective cost above the commission.",
      it: "Ads, promo e cancellazioni spingono il costo effettivo sopra la commissione.",
    },
  },
  "real-take-rate-delivery-apps": {
    src: IMG.casoPekin,
    alt: {
      es: "Cocina de cadena: el take rate se ve en la caja, no en el contrato",
      en: "Chain kitchen: take rate shows up in the till, not the contract",
      it: "Cucina di una catena: il take rate si vede in cassa, non nel contratto",
    },
    caption: {
      es: "Ads, promos y cancelaciones empujan el costo efectivo por encima de la comisión.",
      en: "Ads, promos, and cancellations push effective cost above the commission.",
      it: "Ads, promo e cancellazioni spingono il costo effettivo sopra la commissione.",
    },
  },
  "como-leer-liquidacion-app-delivery": {
    src: IMG.dashboard,
    alt: {
      es: "Tablero para conciliar liquidación y margen por pedido",
      en: "Board to reconcile payout and per-order margin",
      it: "Dashboard per riconciliare estratto conto e margine per ordine",
    },
    caption: {
      es: "Cada línea de la liquidación tiene que tener dueño en tu P&L.",
      en: "Every payout line needs an owner in your P&L.",
      it: "Ogni riga dell'estratto conto deve avere un responsabile nel tuo P&L.",
    },
  },
  "delivery-app-payout-statement-explained": {
    src: IMG.dashboard,
    alt: {
      es: "Tablero para conciliar liquidación y margen por pedido",
      en: "Board to reconcile payout and per-order margin",
      it: "Dashboard per riconciliare estratto conto e margine per ordine",
    },
    caption: {
      es: "Cada línea de la liquidación tiene que tener dueño en tu P&L.",
      en: "Every payout line needs an owner in your P&L.",
      it: "Ogni riga dell'estratto conto deve avere un responsabile nel tuo P&L.",
    },
  },
  "cuanto-subir-precios-apps-delivery": {
    src: IMG.casoLima,
    alt: {
      es: "Plato premium para menú digital de delivery",
      en: "Premium plate for a digital delivery menu",
      it: "Piatto premium per il menu digitale del delivery",
    },
    caption: {
      es: "Foto, descripción y posición en el menú son pricing.",
      en: "Photo, description, and menu position are pricing.",
      it: "Foto, descrizione e posizione nel menu sono pricing.",
    },
  },
  "how-much-raise-delivery-app-prices": {
    src: IMG.casoLima,
    alt: {
      es: "Plato premium para menú digital de delivery",
      en: "Premium plate for a digital delivery menu",
      it: "Piatto premium per il menu digitale del delivery",
    },
    caption: {
      es: "Foto, descripción y posición en el menú son pricing.",
      en: "Photo, description, and menu position are pricing.",
      it: "Foto, descrizione e posizione nel menu sono pricing.",
    },
  },
  "como-aparecer-primero-apps-delivery": {
    src: IMG.casoPiccola,
    alt: {
      es: "Local con oferta lista para aparecer primero en la app",
      en: "Location with an offer ready to rank first in the app",
      it: "Locale con un'offerta pronta per comparire per primo nell'app",
    },
    caption: {
      es: "El ranking también se cocina en packing y tiempos. Un 4.2 no se arregla con más ads.",
      en: "Ranking is also cooked in packing and times. A 4.2 isn't fixed with more ads.",
      it: "Anche il ranking si cucina nel packaging e nei tempi. Un 4.2 non si sistema con più ads.",
    },
  },
  "rank-higher-delivery-apps-profitable-orders": {
    src: IMG.casoPiccola,
    alt: {
      es: "Local con oferta lista para aparecer primero en la app",
      en: "Location with an offer ready to rank first in the app",
      it: "Locale con un'offerta pronta per comparire per primo nell'app",
    },
    caption: {
      es: "El ranking también se cocina en packing y tiempos. Un 4.2 no se arregla con más ads.",
      en: "Ranking is also cooked in packing and times. A 4.2 isn't fixed with more ads.",
      it: "Anche il ranking si cucina nel packaging e nei tempi. Un 4.2 non si sistema con più ads.",
    },
  },
  "cuantas-apps-delivery-restaurante": {
    src: IMG.performance,
    alt: {
      es: "Comparando contribución por app antes de abrir otro canal",
      en: "Comparing contribution per app before opening another channel",
      it: "Confrontare la contribuzione per app prima di aprire un altro canale",
    },
    caption: {
      es: "Si la segunda app no deja contribución, es ruido operativo.",
      en: "If the second app doesn't leave contribution, it's operational noise.",
      it: "Se la seconda app non lascia contribuzione, è rumore operativo.",
    },
  },
  "how-many-delivery-apps-restaurant": {
    src: IMG.performance,
    alt: {
      es: "Comparando contribución por app antes de abrir otro canal",
      en: "Comparing contribution per app before opening another channel",
      it: "Confrontare la contribuzione per app prima di aprire un altro canale",
    },
    caption: {
      es: "Si la segunda app no deja contribución, es ruido operativo.",
      en: "If the second app doesn't leave contribution, it's operational noise.",
      it: "Se la seconda app non lascia contribuzione, è rumore operativo.",
    },
  },
  "como-reducir-cancelaciones-delivery": {
    src: IMG.casoBirra,
    alt: {
      es: "Cocina controlando stock y tiempos para evitar cancelaciones",
      en: "Kitchen controlling stock and times to avoid cancellations",
      it: "Cucina che controlla stock e tempi per evitare cancellazioni",
    },
    caption: {
      es: "Una sucursal con stock mentiroso cancela por las dos. El 86 tiene que ser un dato, no un rumor.",
      en: "A location with lying stock cancels for two. The 86 has to be a data point, not a rumor.",
      it: "Una sede con uno stock che mente cancella per due. L'86 deve essere un dato, non una voce di corridoio.",
    },
  },
  "reduce-delivery-cancellations-multiple-locations": {
    src: IMG.casoBirra,
    alt: {
      es: "Cocina controlando stock y tiempos para evitar cancelaciones",
      en: "Kitchen controlling stock and times to avoid cancellations",
      it: "Cucina che controlla stock e tempi per evitare cancellazioni",
    },
    caption: {
      es: "Una sucursal con stock mentiroso cancela por las dos. El 86 tiene que ser un dato, no un rumor.",
      en: "A location with lying stock cancels for two. The 86 has to be a data point, not a rumor.",
      it: "Una sede con uno stock che mente cancella per due. L'86 deve essere un dato, non una voce di corridoio.",
    },
  },
  "como-recuperar-rating-delivery-multi-sucursal": {
    src: IMG.kitchen,
    alt: {
      es: "Cocina armando un pedido: donde se gana o se pierde el rating",
      en: "Kitchen packing an order: where rating is won or lost",
      it: "Cucina che assembla un ordine: dove si vince o si perde il rating",
    },
    caption: {
      es: "El rating se recupera en el pase, no en un mensaje pidiendo 5 estrellas.",
      en: "Rating is recovered at the pass, not in a message asking for 5 stars.",
      it: "Il rating si recupera al pass, non con un messaggio che chiede 5 stelle.",
    },
  },
  "recover-delivery-app-rating-multi-location": {
    src: IMG.kitchen,
    alt: {
      es: "Cocina armando un pedido: donde se gana o se pierde el rating",
      en: "Kitchen packing an order: where rating is won or lost",
      it: "Cucina che assembla un ordine: dove si vince o si perde il rating",
    },
    caption: {
      es: "El rating se recupera en el pase, no en un mensaje pidiendo 5 estrellas.",
      en: "Rating is recovered at the pass, not in a message asking for 5 stars.",
      it: "Il rating si recupera al pass, non con un messaggio che chiede 5 stelle.",
    },
  },
  "indicadores-mañana-delivery-multi-sucursal": {
    src: IMG.casoEmpanadas,
    alt: {
      es: "Sucursales en operación: el tablero matutino tiene que caber en una pantalla",
      en: "Locations live: the morning board has to fit on one screen",
      it: "Sedi in servizio: la dashboard del mattino deve stare in uno schermo",
    },
    caption: {
      es: "Weekly compara sucursales. War room se abre por umbral, no por costumbre.",
      en: "Weekly compares locations. War room opens on a threshold, not by habit.",
      it: "La weekly confronta le sedi. La war room si apre per soglia, non per abitudine.",
    },
  },
  "morning-metrics-checklist-multi-location-delivery": {
    src: IMG.casoEmpanadas,
    alt: {
      es: "Sucursales en operación: el tablero matutino tiene que caber en una pantalla",
      en: "Locations live: the morning board has to fit on one screen",
      it: "Sedi in servizio: la dashboard del mattino deve stare in uno schermo",
    },
    caption: {
      es: "Weekly compara sucursales. War room se abre por umbral, no por costumbre.",
      en: "Weekly compares locations. War room opens on a threshold, not by habit.",
      it: "La weekly confronta le sedi. La war room si apre per soglia, non per abitudine.",
    },
  },
  "controlar-operacion-delivery-multi-sucursal": {
    src: IMG.tecnologia,
    alt: {
      es: "Control room: checklist diario para varias sucursales",
      en: "Control room: daily checklist across locations",
      it: "Control room: checklist quotidiana per più sedi",
    },
    caption: {
      es: "Si no hay dueño por alerta, el dato no baja a la cocina.",
      en: "If no one owns the alert, the data never reaches the kitchen.",
      it: "Se nessuno è responsabile dell'alert, il dato non arriva in cucina.",
    },
  },
  "multi-location-delivery-daily-control-checklist": {
    src: IMG.tecnologia,
    alt: {
      es: "Control room: checklist diario para varias sucursales",
      en: "Control room: daily checklist across locations",
      it: "Control room: checklist quotidiana per più sedi",
    },
    caption: {
      es: "Si no hay dueño por alerta, el dato no baja a la cocina.",
      en: "If no one owns the alert, the data never reaches the kitchen.",
      it: "Se nessuno è responsabile dell'alert, il dato non arriva in cucina.",
    },
  },
  "reunion-diaria-operaciones-delivery": {
    src: IMG.gestion,
    alt: {
      es: "Equipo en ritual de ops: standup, weekly y war room",
      en: "Ops team ritual: standup, weekly, and war room",
      it: "Team nel rituale ops: standup, weekly e war room",
    },
    caption: {
      es: "Tres capas. Una sola verdad. Decisiones con dueño.",
      en: "Three layers. One source of truth. Decisions with owners.",
      it: "Tre livelli. Un'unica verità. Decisioni con un responsabile.",
    },
  },
  "daily-delivery-operations-meeting-ritual": {
    src: IMG.gestion,
    alt: {
      es: "Equipo en ritual de ops: standup, weekly y war room",
      en: "Ops team ritual: standup, weekly, and war room",
      it: "Team nel rituale ops: standup, weekly e war room",
    },
    caption: {
      es: "Tres capas. Una sola verdad. Decisiones con dueño.",
      en: "Three layers. One source of truth. Decisions with owners.",
      it: "Tre livelli. Un'unica verità. Decisioni con un responsabile.",
    },
  },
  "tiempo-de-preparacion-delivery": {
    src: IMG.veggie,
    alt: {
      es: "Pedido en pase: el reloj de prep time se gana acá",
      en: "Order at the pass: prep-time clock is won here",
      it: "Ordine al pass: qui si vince la corsa dei tempi di preparazione",
    },
    caption: {
      es: "Verde, ámbar, rojo por sucursal y franja. Sin umbral, no hay alerta.",
      en: "Green, amber, red by location and shift. No threshold, no alert.",
      it: "Verde, giallo, rosso per sede e fascia oraria. Senza soglia, niente alert.",
    },
  },
  "kitchen-prep-time-multi-location-delivery": {
    src: IMG.veggie,
    alt: {
      es: "Pedido en pase: el reloj de prep time se gana acá",
      en: "Order at the pass: prep-time clock is won here",
      it: "Ordine al pass: qui si vince la corsa dei tempi di preparazione",
    },
    caption: {
      es: "Verde, ámbar, rojo por sucursal y franja. Sin umbral, no hay alerta.",
      en: "Green, amber, red by location and shift. No threshold, no alert.",
      it: "Verde, giallo, rosso per sede e fascia oraria. Senza soglia, niente alert.",
    },
  },
  "como-comparar-sucursales-delivery": {
    src: IMG.casoRoma,
    alt: {
      es: "Dos locales, un mismo método: same-store antes de rankear",
      en: "Two locations, one method: same-store before ranking",
      it: "Due locali, un unico metodo: same-store prima della classifica",
    },
    caption: {
      es: "Compará tendencias normalizadas, no absolutos crudos.",
      en: "Compare normalized trends, not raw absolutes.",
      it: "Confronta trend normalizzati, non valori assoluti grezzi.",
    },
  },
  "compare-delivery-locations-fairly": {
    src: IMG.casoRoma,
    alt: {
      es: "Dos locales, un mismo método: same-store antes de rankear",
      en: "Two locations, one method: same-store before ranking",
      it: "Due locali, un unico metodo: same-store prima della classifica",
    },
    caption: {
      es: "Compará tendencias normalizadas, no absolutos crudos.",
      en: "Compare normalized trends, not raw absolutes.",
      it: "Confronta trend normalizzati, non valori assoluti grezzi.",
    },
  },
  "promociones-apps-delivery-cuales-convienen": {
    src: IMG.insightRentable,
    alt: {
      es: "Promo medida contra contribución, no contra vanidad de pedidos",
      en: "Promo measured against contribution, not order vanity",
      it: "Promo misurata sulla contribuzione, non sulla vanità degli ordini",
    },
    caption: {
      es: "Si no sabés el margen del plato, no sabés si la promo paga.",
      en: "If you don't know the plate margin, you don't know if the promo pays.",
      it: "Se non conosci il margine del piatto, non sai se la promo rende.",
    },
  },
  "delivery-app-promotions-worth-it": {
    src: IMG.insightRentable,
    alt: {
      es: "Promo medida contra contribución, no contra vanidad de pedidos",
      en: "Promo measured against contribution, not order vanity",
      it: "Promo misurata sulla contribuzione, non sulla vanità degli ordini",
    },
    caption: {
      es: "Si no sabés el margen del plato, no sabés si la promo paga.",
      en: "If you don't know the plate margin, you don't know if the promo pays.",
      it: "Se non conosci il margine del piatto, non sai se la promo rende.",
    },
  },
  "war-room-operaciones-delivery": {
    src: IMG.equipo3,
    alt: {
      es: "Equipo de growth en war room de delivery",
      en: "Growth team in a delivery war room",
      it: "Team di growth nella war room del delivery",
    },
    caption: {
      es: "Se abre por umbral: cancelaciones, rating o prep time fuera de banda.",
      en: "Opens on a threshold: cancellations, rating, or prep time out of band.",
      it: "Si apre per soglia: cancellazioni, rating o tempi di preparazione fuori range.",
    },
  },
  "delivery-war-room-multi-location-ops": {
    src: IMG.equipo3,
    alt: {
      es: "Equipo de growth en war room de delivery",
      en: "Growth team in a delivery war room",
      it: "Team di growth nella war room del delivery",
    },
    caption: {
      es: "Se abre por umbral: cancelaciones, rating o prep time fuera de banda.",
      en: "Opens on a threshold: cancellations, rating, or prep time out of band.",
      it: "Si apre per soglia: cancellazioni, rating o tempi di preparazione fuori range.",
    },
  },
  "cuanto-cuesta-packaging-delivery-pnl": {
    src: IMG.casoPekin,
    alt: {
      es: "Cocina en hora pico: el packaging se decide antes del rush",
      en: "Kitchen at peak: packaging is decided before the rush",
      it: "Cucina nell'ora di punta: il packaging si decide prima del rush",
    },
    caption: {
      es: "Costo por pedido × volumen: ahí se ve si el packaging come margen.",
      en: "Cost per order × volume: that's where packaging eats margin.",
      it: "Costo per ordine × volume: lì si vede se il packaging mangia margine.",
    },
  },
  "delivery-packaging-cost-per-order": {
    src: IMG.casoPekin,
    alt: {
      es: "Cocina en hora pico: el packaging se decide antes del rush",
      en: "Kitchen at peak: packaging is decided before the rush",
      it: "Cucina nell'ora di punta: il packaging si decide prima del rush",
    },
    caption: {
      es: "Costo por pedido × volumen: ahí se ve si el packaging come margen.",
      en: "Cost per order × volume: that's where packaging eats margin.",
      it: "Costo per ordine × volume: lì si vede se il packaging mangia margine.",
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
        it: "Dashboard P&L del delivery: margine, commissione e ordini",
      },
      caption: {
        es: "El P&L por pedido es el tablero que falta en la mayoría de las cocinas.",
        en: "The per-order P&L is the dashboard missing from most kitchens.",
        it: "Il P&L per ordine è la dashboard che manca nella maggior parte delle cucine.",
      },
    },
    stats: [
      {
        value: "30%",
        label: { es: "comisión típica sobre el ticket", en: "typical commission on the ticket", it: "commissione tipica sullo scontrino" },
      },
      {
        value: "15%",
        label: { es: "margen cuando nadie mide contribución", en: "margin when nobody measures contribution", it: "margine quando nessuno misura la contribuzione" },
      },
      {
        value: "$100",
        label: { es: "ejemplo de pedido, desarmado abajo", en: "sample order, broken down below", it: "ordine di esempio, scomposto qui sotto" },
      },
    ],
    chart: {
      kind: "stack",
      kicker: { es: "Ejemplo ilustrativo", en: "Illustrative example", it: "Esempio illustrativo" },
      title: {
        es: "A dónde se va un pedido de $100",
        en: "Where a $100 order actually goes",
        it: "Dove finisce un ordine da $100",
      },
      caption: {
        es: "Comida, comisión, packaging, ads y promo se comen el ticket antes del margen. Cada restaurante tiene su propia estructura.",
        en: "Food, commission, packaging, ads, and promo eat the ticket before margin. Every restaurant has its own structure.",
        it: "Cibo, commissione, packaging, ads e promo si mangiano lo scontrino prima del margine. Ogni ristorante ha la sua struttura.",
      },
      items: [
        { label: { es: "Comida", en: "Food", it: "Cibo" }, value: 32, display: { es: "$32", en: "$32", it: "$32" } },
        { label: { es: "Comisión", en: "Commission", it: "Commissione" }, value: 28, display: { es: "$28", en: "$28", it: "$28" } },
        { label: { es: "Packaging y ads", en: "Packaging & ads", it: "Packaging e ads" }, value: 12, display: { es: "$12", en: "$12", it: "$12" } },
        { label: { es: "Promo", en: "Promo", it: "Promo" }, value: 10, display: { es: "$10", en: "$10", it: "$10" } },
        { label: { es: "Margen", en: "Margin", it: "Margine" }, value: 18, display: { es: "$18", en: "$18", it: "$18" }, accent: true },
      ],
    },
    mid: {
      src: IMG.performance,
      alt: {
        es: "Operación de delivery midiendo performance por canal",
        en: "Delivery operations measuring performance by channel",
        it: "Operatività delivery che misura la performance per canale",
      },
      caption: {
        es: "Si la liquidación y el P&L no se cruzan, estás opinando del canal a ciegas.",
        en: "If the payout and the P&L never meet, you're judging the channel blind.",
        it: "Se estratto conto e P&L non si incrociano, stai giudicando il canale alla cieca.",
      },
    },
  },
  ticket: {
    cover: {
      src: IMG.burger,
      alt: {
        es: "Plato de burger gourmet: ticket alto sin bajar precio",
        en: "Gourmet burger plate: high ticket without cutting price",
        it: "Burger gourmet: scontrino alto senza abbassare il prezzo",
      },
      caption: {
        es: "Subir ticket es vender más completo, no más barato.",
        en: "Raising ticket is selling more complete, not cheaper.",
        it: "Alzare lo scontrino è vendere più completo, non più economico.",
      },
    },
    stats: [
      { value: "+15%", label: { es: "ticket extra, sin descuento", en: "extra ticket, no discount", it: "scontrino in più, senza sconti" } },
      { value: "3×", label: { es: "más sano que empujar volumen", en: "healthier than pushing volume", it: "più sano che spingere il volume" } },
      { value: "0", label: { es: "promos agresivas necesarias", en: "aggressive promos required", it: "promo aggressive necessarie" } },
    ],
    chart: {
      kind: "bars",
      kicker: { es: "Impacto relativo", en: "Relative impact", it: "Impatto relativo" },
      title: {
        es: "Qué mueve más el margen",
        en: "What moves margin more",
        it: "Cosa muove di più il margine",
      },
      caption: {
        es: "Un +15% de ticket suele dejar más contribución que un +30% de órdenes comprado con descuento.",
        en: "A +15% ticket usually leaves more contribution than a +30% order lift bought with discounts.",
        it: "Un +15% di scontrino lascia di solito più contribuzione di un +30% di ordini comprato con sconti.",
      },
      items: [
        { label: { es: "Ticket +15% con combos", en: "Ticket +15% with combos", it: "Scontrino +15% con combo" }, value: 92, display: { es: "Alto", en: "High", it: "Alto" }, accent: true },
        { label: { es: "Órdenes +30% con promo", en: "Orders +30% with promo", it: "Ordini +30% con promo" }, value: 48, display: { es: "Medio", en: "Medium", it: "Medio" } },
        { label: { es: "Bajar precios", en: "Cut prices", it: "Abbassare i prezzi" }, value: 18, display: { es: "Negativo", en: "Negative", it: "Negativo" } },
      ],
    },
    mid: {
      src: IMG.sushi,
      alt: {
        es: "Plato premium para menú digital de delivery",
        en: "Premium plate for a digital delivery menu",
        it: "Piatto premium per il menu digitale del delivery",
      },
      caption: {
        es: "Foto, descripción y posición en el menú son pricing.",
        en: "Photo, description, and menu position are pricing.",
        it: "Foto, descrizione e posizione nel menu sono pricing.",
      },
    },
  },
  rank: {
    cover: {
      src: IMG.estrategia,
      alt: {
        es: "Estrategia de visibilidad en apps de delivery",
        en: "Visibility strategy on delivery apps",
        it: "Strategia di visibilità nelle app di delivery",
      },
      caption: {
        es: "Aparecer primero no es un truco del algoritmo: son palancas que sí controlás.",
        en: "Ranking first isn't an algorithm trick: there are levers you do control.",
        it: "Comparire per primi non è un trucco dell'algoritmo: sono leve che controlli davvero.",
      },
    },
    stats: [
      { value: "4", label: { es: "palancas que sí controlás", en: "levers you actually control", it: "leve che controlli davvero" } },
      { value: "1", label: { es: "regla: cada palanca cruza margen", en: "rule: every lever crosses margin", it: "regola: ogni leva passa dal margine" } },
      { value: "0", label: { es: "sentido gastar ads con margen negativo", en: "point spending ads on negative margin", it: "senso spendere in ads con margine negativo" } },
    ],
    chart: {
      kind: "bars",
      kicker: { es: "Palancas de ranking", en: "Ranking levers", it: "Leve di ranking" },
      title: {
        es: "Qué mueve visibilidad (y qué te cuesta)",
        en: "What moves visibility (and what it costs you)",
        it: "Cosa muove la visibilità (e quanto ti costa)",
      },
      caption: {
        es: "Ads sin P&L es comprar posición a pérdida. Foto, rating y menú son palancas más baratas.",
        en: "Ads without a P&L is buying position at a loss. Photo, rating, and menu are cheaper levers.",
        it: "Ads senza P&L significa comprare posizione in perdita. Foto, rating e menu sono leve più economiche.",
      },
      items: [
        { label: { es: "Menú + fotos + mix", en: "Menu + photos + mix", it: "Menu + foto + mix" }, value: 78, display: { es: "Alto / barato", en: "High / cheap", it: "Alto / economico" }, accent: true },
        { label: { es: "Rating y tiempos", en: "Rating and times", it: "Rating e tempi" }, value: 70, display: { es: "Alto / ops", en: "High / ops", it: "Alto / ops" } },
        { label: { es: "Pricing alineado", en: "Aligned pricing", it: "Pricing allineato" }, value: 62, display: { es: "Medio", en: "Medium", it: "Medio" } },
        { label: { es: "Ads de la plataforma", en: "Platform ads", it: "Ads della piattaforma" }, value: 40, display: { es: "Caro", en: "Expensive", it: "Caro" } },
      ],
    },
    mid: {
      src: IMG.courier,
      alt: {
        es: "Repartidor entregando un pedido: rating y tiempos en la calle",
        en: "Courier delivering an order: rating and times on the street",
        it: "Rider che consegna un ordine: rating e tempi in strada",
      },
      caption: {
        es: "El ranking también se cocina en packing y tiempos. Un 4.2 no se arregla con más ads.",
        en: "Ranking is also cooked in packing and times. A 4.2 isn't fixed with more ads.",
        it: "Anche il ranking si cucina nel packaging e nei tempi. Un 4.2 non si sistema con più ads.",
      },
    },
  },
  cancel: {
    cover: {
      src: IMG.kitchen,
      alt: {
        es: "Cocina preparando un pedido: donde nacen las cancelaciones",
        en: "Kitchen prepping an order: where cancellations are born",
        it: "Cucina che prepara un ordine: dove nascono le cancellazioni",
      },
      caption: {
        es: "Las cancelaciones no son “la app”: son stock, tiempos y datos sucios.",
        en: "Cancellations aren't “the app”: they're stock, times, and dirty data.",
        it: "Le cancellazioni non sono “colpa dell'app”: sono stock, tempi e dati sporchi.",
      },
    },
    stats: [
      { value: "35%", label: { es: "típico por stock / 86", en: "typical from stock / 86s", it: "tipico per stock / 86" } },
      { value: "28%", label: { es: "por tiempo de preparación", en: "from prep time", it: "per tempi di preparazione" } },
      { value: "1", label: { es: "sucursal que desordena a las demás", en: "location that drags the rest", it: "sede che manda in tilt le altre" } },
    ],
    chart: {
      kind: "stack",
      kicker: { es: "Causas frecuentes", en: "Common causes", it: "Cause frequenti" },
      title: {
        es: "De dónde salen las cancelaciones",
        en: "Where cancellations actually come from",
        it: "Da dove arrivano le cancellazioni",
      },
      caption: {
        es: "Distribución ilustrativa. El primer paso es etiquetar cada cancelación: sin causa, no hay palanca.",
        en: "Illustrative split. The first step is tagging every cancellation: no cause, no lever.",
        it: "Distribuzione illustrativa. Il primo passo è etichettare ogni cancellazione: senza causa, niente leva.",
      },
      items: [
        { label: { es: "Stock / 86", en: "Stock / 86", it: "Stock / 86" }, value: 35, display: { es: "35%", en: "35%", it: "35%" }, accent: true },
        { label: { es: "Tiempo de prep", en: "Prep time", it: "Tempo di preparazione" }, value: 28, display: { es: "28%", en: "28%", it: "28%" } },
        { label: { es: "Dirección / rider", en: "Address / rider", it: "Indirizzo / rider" }, value: 22, display: { es: "22%", en: "22%", it: "22%" } },
        { label: { es: "Otros", en: "Other", it: "Altro" }, value: 15, display: { es: "15%", en: "15%", it: "15%" } },
      ],
    },
    mid: {
      src: IMG.veggie,
      alt: {
        es: "Pedido en preparación: control de stock y tiempos",
        en: "Order being prepared: stock and time control",
        it: "Ordine in preparazione: controllo di stock e tempi",
      },
      caption: {
        es: "Una sucursal con stock mentiroso cancela por las dos. El 86 tiene que ser un dato, no un rumor.",
        en: "A location with lying stock cancels for two. The 86 has to be a data point, not a rumor.",
        it: "Una sede con uno stock che mente cancella per due. L'86 deve essere un dato, non una voce di corridoio.",
      },
    },
  },
  ops: {
    cover: {
      src: IMG.tecnologia,
      alt: {
        es: "Control room de delivery multi-sucursal",
        en: "Multi-location delivery control room",
        it: "Control room del delivery multi-sede",
      },
      caption: {
        es: "Un ritual de 10 minutos vale más que un dashboard que nadie abre.",
        en: "A 10-minute ritual is worth more than a dashboard nobody opens.",
        it: "Un rituale di 10 minuti vale più di una dashboard che nessuno apre.",
      },
    },
    stats: [
      { value: "10'", label: { es: "standup diario, no una reunión eterna", en: "daily standup, not an endless meeting", it: "standup quotidiano, non una riunione infinita" } },
      { value: "3", label: { es: "capas: diario, weekly, war room", en: "layers: daily, weekly, war room", it: "livelli: quotidiano, weekly, war room" } },
      { value: "1", label: { es: "tablero. El resto es ruido", en: "board. Everything else is noise", it: "dashboard. Il resto è rumore" } },
    ],
    chart: {
      kind: "bars",
      kicker: { es: "Ritual de ops", en: "Ops ritual", it: "Rituale ops" },
      title: {
        es: "Qué se mira cada mañana (y en qué orden)",
        en: "What you look at each morning (and in what order)",
        it: "Cosa si guarda ogni mattina (e in che ordine)",
      },
      caption: {
        es: "Si el tablero no cabe en una pantalla, no se usa. Cinco indicadores, dueño, umbral, decisión.",
        en: "If the board doesn't fit on one screen, it doesn't get used. Five metrics, owner, threshold, decision.",
        it: "Se la dashboard non sta in uno schermo, non si usa. Cinque indicatori, responsabile, soglia, decisione.",
      },
      items: [
        { label: { es: "Cancelaciones / 86", en: "Cancellations / 86s", it: "Cancellazioni / 86" }, value: 90, display: { es: "1º", en: "1st", it: "1º" }, accent: true },
        { label: { es: "Tiempo de prep", en: "Prep time", it: "Tempo di preparazione" }, value: 75, display: { es: "2º", en: "2nd", it: "2º" } },
        { label: { es: "Conectividad / stock", en: "Connectivity / stock", it: "Connettività / stock" }, value: 62, display: { es: "3º", en: "3rd", it: "3º" } },
        { label: { es: "Ticket y mix", en: "Ticket and mix", it: "Scontrino e mix" }, value: 50, display: { es: "4º", en: "4th", it: "4º" } },
        { label: { es: "Ads y ranking", en: "Ads and ranking", it: "Ads e ranking" }, value: 38, display: { es: "5º", en: "5th", it: "5º" } },
      ],
    },
    mid: {
      src: IMG.gestion,
      alt: {
        es: "Equipo operando delivery con un tablero compartido",
        en: "Team running delivery from a shared board",
        it: "Team che gestisce il delivery con una dashboard condivisa",
      },
      caption: {
        es: "Weekly compara sucursales. War room se abre por umbral, no por costumbre.",
        en: "Weekly compares locations. War room opens on a threshold, not by habit.",
        it: "La weekly confronta le sedi. La war room si apre per soglia, non per abitudine.",
      },
    },
  },
  rating: {
    cover: {
      src: IMG.courier,
      alt: {
        es: "Repartidor entregando un pedido: el rating se cocina en la calle",
        en: "Courier handing off an order: rating is cooked on the street",
        it: "Rider che consegna un ordine: il rating si cucina in strada",
      },
      caption: {
        es: "El cliente no separa la app de tu sucursal. Tiempos, packing y pedido correcto son el rating.",
        en: "The customer doesn't separate the app from your location. Times, packing, and a correct order are the rating.",
        it: "Il cliente non separa l'app dalla tua sede. Tempi, packaging e ordine corretto sono il rating.",
      },
    },
    stats: [
      { value: "48h", label: { es: "ventana para frenar la caída", en: "window to stop the drop", it: "finestra per fermare il calo" } },
      { value: "1", label: { es: "sucursal. Nunca promediés la cadena", en: "location. Never average the chain", it: "sede. Mai fare la media della catena" } },
      { value: "4", label: { es: "causas que sí mueven estrellas", en: "causes that actually move stars", it: "cause che muovono davvero le stelle" } },
    ],
    chart: {
      kind: "bars",
      kicker: { es: "Qué mueve el rating", en: "What moves rating", it: "Cosa muove il rating" },
      title: {
        es: "Las quejas que bajan estrellas (y el orden para atacarlas)",
        en: "The complaints that drop stars (and the order to attack them)",
        it: "I reclami che tolgono stelle (e l'ordine per affrontarli)",
      },
      caption: {
        es: "Ilustrativo. Pedí las 20 reseñas bajas de la sucursal en rojo y etiquetalas: si no hay causa, no hay playbook.",
        en: "Illustrative. Pull the 20 low reviews from the red location and tag them: no cause, no playbook.",
        it: "Illustrativo. Prendi le 20 recensioni basse della sede in rosso ed etichettale: senza causa, niente playbook.",
      },
      items: [
        { label: { es: "Tiempo / frío", en: "Time / cold food", it: "Tempi / cibo freddo" }, value: 88, display: { es: "1º", en: "1st", it: "1º" }, accent: true },
        { label: { es: "Pedido errado / incompleto", en: "Wrong / incomplete order", it: "Ordine sbagliato / incompleto" }, value: 72, display: { es: "2º", en: "2nd", it: "2º" } },
        { label: { es: "Packing / derrame", en: "Packing / spills", it: "Packaging / fuoriuscite" }, value: 58, display: { es: "3º", en: "3rd", it: "3º" } },
        { label: { es: "86 / ítem faltante", en: "86 / missing item", it: "86 / prodotto mancante" }, value: 45, display: { es: "4º", en: "4th", it: "4º" } },
      ],
    },
    mid: {
      src: IMG.kitchen,
      alt: {
        es: "Cocina armando un pedido: donde se gana o se pierde el rating",
        en: "Kitchen packing an order: where rating is won or lost",
        it: "Cucina che assembla un ordine: dove si vince o si perde il rating",
      },
      caption: {
        es: "El rating se recupera en el pase, no en un mensaje pidiendo 5 estrellas.",
        en: "Rating is recovered at the pass, not in a message asking for 5 stars.",
        it: "Il rating si recupera al pass, non con un messaggio che chiede 5 stelle.",
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
        published?: { slug?: string; pathEn?: string; pathIt?: string }[];
      };
      for (const p of raw.published ?? []) {
        if (p.slug) slugs.add(canonicalSlug(p.slug));
        if (p.pathEn) slugs.add(canonicalSlug(p.pathEn.split("/").pop() ?? ""));
        if (p.pathIt) slugs.add(canonicalSlug(p.pathIt.split("/").pop() ?? ""));
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

function takeUnused(pool: CoverAsset[], used: Set<string>, avoid?: string): CoverAsset | undefined {
  return pool.find((a) => !used.has(a.src) && a.src !== avoid);
}

function uniqueCoverFor(slug: string): CoverAsset {
  if (!coverAssignments) {
    coverAssignments = buildUniqueAssignments(COVER_BY_SLUG, COVER_POOL);
  }
  const key = canonicalSlug(slug);
  const hit = coverAssignments.get(key);
  if (hit) return hit;
  const used = new Set([...coverAssignments.values()].map((a) => a.src));
  const pick = takeUnused(COVER_POOL, used);
  if (!pick) {
    throw new Error(
      `No quedan portadas únicas para "${key}". Ampliá COVER_POOL o revisá preferencias duplicadas.`,
    );
  }
  coverAssignments.set(key, pick);
  return pick;
}

function uniqueMidFor(slug: string): CoverAsset {
  if (!midAssignments) {
    midAssignments = buildUniqueAssignments(MID_BY_SLUG, COVER_POOL, (s) =>
      uniqueCoverFor(s).src,
    );
  }
  const key = canonicalSlug(slug);
  const coverSrc = uniqueCoverFor(key).src;
  let mid = midAssignments.get(key);
  if (!mid) {
    const used = new Set([...midAssignments.values()].map((a) => a.src));
    mid = takeUnused(COVER_POOL, used, coverSrc);
    if (!mid) {
      throw new Error(
        `No quedan fotos de apoyo únicas para "${key}". Ampliá COVER_POOL.`,
      );
    }
    midAssignments.set(key, mid);
  }
  if (mid.src === coverSrc) {
    return takeUnused(COVER_POOL, new Set(), coverSrc) ?? mid;
  }
  return mid;
}

/** Invalidar cache (tests / rebuild tras cambiar state). */
export function resetVisualAssignments(): void {
  coverAssignments = null;
  midAssignments = null;
  pairCache = null;
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
  const coverAbs = `${canonicalSiteUrl(process.env.SITE_URL)}${cover.src}`;
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
