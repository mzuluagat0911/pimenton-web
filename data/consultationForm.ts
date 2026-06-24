/**
 * Fuente única para el form de consultoría (versión con emojis 3D).
 * - Categorías, tamaños y países destacados con su asset 3D + fallback Unicode.
 * - Lista completa de países para el dropdown "Otro país" (reutiliza countries.ts).
 * - Phone code lookup para pre-llenar el input del paso 4.
 * - Builder del mensaje pre-armado de WhatsApp + URL final (bilingüe).
 *
 * Labels visibles (categorías, tamaños, países destacados) son bilingües
 * { es, en } y se resuelven con useT en el componente. El mensaje de
 * WhatsApp se arma en el idioma activo.
 *
 * El form NO se envía a backend: el "envío" abre wa.me en pestaña nueva.
 */

import { countries as allCountries, findCountry } from "./countries";
import {
  whatsappRegions,
  whatsappUrl,
  type WhatsappRegion,
} from "./whatsapp";

export type Lang = "es" | "en";
type Localized = { es: string; en: string };
const L = (loc: Localized, lang: Lang) => loc[lang];

// ────────── Tipos ──────────

export type CategoryId =
  | "burger"
  | "pizza"
  | "sushi"
  | "dessert"
  | "bakery"
  | "other";

export type SizeId = "solo" | "small" | "medium" | "large";

// ────────── Opciones de los pasos ──────────

type CategoryOption = {
  id: CategoryId;
  label: Localized;
  /** Nombre del PNG en /public/assets/emoji/3d/ */
  emoji: string;
  /** Unicode emoji que se muestra si el PNG no existe todavía */
  fallback: string;
};

export const categories: ReadonlyArray<CategoryOption> = [
  {
    id: "burger",
    label: { es: "Burger", en: "Burger" },
    emoji: "burger.png",
    fallback: "🍔",
  },
  {
    id: "pizza",
    label: { es: "Pizza", en: "Pizza" },
    emoji: "pizza.png",
    fallback: "🍕",
  },
  {
    id: "sushi",
    label: { es: "Sushi", en: "Sushi" },
    emoji: "sushi.png",
    fallback: "🍣",
  },
  {
    id: "dessert",
    label: { es: "Postres", en: "Desserts" },
    emoji: "donut.png",
    fallback: "🍩",
  },
  {
    id: "bakery",
    label: { es: "Panaderías", en: "Bakeries" },
    emoji: "croissant.png",
    fallback: "🥐",
  },
  {
    id: "other",
    label: { es: "Otros", en: "Other" },
    emoji: "plate.png",
    fallback: "🍽️",
  },
] as const;

type SizeOption = {
  id: SizeId;
  label: Localized;
  caption: Localized;
  emoji: string;
  fallback: string;
};

export const sizes: ReadonlyArray<SizeOption> = [
  {
    id: "solo",
    label: { es: "1 Local", en: "1 location" },
    caption: { es: "", en: "" },
    emoji: "chef.png",
    fallback: "👨‍🍳",
  },
  {
    id: "small",
    label: { es: "2-5 locales", en: "2-5 locations" },
    caption: { es: "", en: "" },
    emoji: "building-small.png",
    fallback: "🏪",
  },
  {
    id: "medium",
    label: { es: "6-20 locales", en: "6-20 locations" },
    caption: { es: "", en: "" },
    emoji: "building-medium.png",
    fallback: "🏢",
  },
  {
    id: "large",
    label: { es: "+20 locales", en: "+20 locations" },
    caption: { es: "", en: "" },
    emoji: "building-large.png",
    fallback: "🏬",
  },
] as const;

type FeaturedCountry = {
  /** ISO 3166-1 alpha-2 — matchea con countries.ts */
  isoCode: string;
  label: Localized;
  emoji: string;
  fallback: string;
};

export const featuredCountries: ReadonlyArray<FeaturedCountry> = [
  {
    isoCode: "AR",
    label: { es: "Argentina", en: "Argentina" },
    emoji: "flag-ar.png",
    fallback: "🇦🇷",
  },
  {
    isoCode: "CL",
    label: { es: "Chile", en: "Chile" },
    emoji: "flag-cl.png",
    fallback: "🇨🇱",
  },
  {
    isoCode: "CO",
    label: { es: "Colombia", en: "Colombia" },
    emoji: "flag-co.png",
    fallback: "🇨🇴",
  },
  {
    isoCode: "ES",
    label: { es: "España", en: "Spain" },
    emoji: "flag-es.png",
    fallback: "🇪🇸",
  },
  {
    isoCode: "MX",
    label: { es: "México", en: "Mexico" },
    emoji: "flag-mx.png",
    fallback: "🇲🇽",
  },
  {
    isoCode: "PE",
    label: { es: "Perú", en: "Peru" },
    emoji: "flag-pe.png",
    fallback: "🇵🇪",
  },
  {
    isoCode: "UY",
    label: { es: "Uruguay", en: "Uruguay" },
    emoji: "flag-uy.png",
    fallback: "🇺🇾",
  },
  {
    isoCode: "US",
    label: { es: "USA", en: "USA" },
    emoji: "flag-us.png",
    fallback: "🇺🇸",
  },
] as const;

// ────────── Helpers de países ──────────

/**
 * Convierte un ISO alpha-2 al emoji de bandera nativo (regional indicator
 * symbols). Funciona en macOS, iOS, Android, Linux moderno. Windows no
 * renderiza flags pero la lista del dropdown sigue legible con el nombre.
 */
export function isoToFlagEmoji(iso: string): string {
  return iso.toUpperCase().replace(/./g, (c) =>
    String.fromCodePoint(127397 + c.charCodeAt(0)),
  );
}

const featuredIsoSet = new Set(featuredCountries.map((c) => c.isoCode));

/**
 * Países restantes para el dropdown "Otro país" — todos los de
 * countries.ts excepto los 8 destacados. Cada uno con su flag emoji
 * nativo. Los nombres del long-tail quedan en español (countries.ts);
 * los 8 destacados sí son bilingües.
 */
export const otherCountries = allCountries
  .filter((c) => !featuredIsoSet.has(c.code))
  .map((c) => ({
    code: c.code,
    name: c.name,
    flag: isoToFlagEmoji(c.code),
  }));

// ────────── Phone country code lookup ──────────

const PHONE_CODES: Record<string, string> = {
  // Featured
  AR: "+54 9 ",
  CL: "+56 9 ",
  CO: "+57 ",
  ES: "+34 ",
  MX: "+52 1 ",
  PE: "+51 9 ",
  UY: "+598 ",
  US: "+1 ",
  // Vecinos LatAm comunes
  BR: "+55 ",
  EC: "+593 ",
  BO: "+591 ",
  PY: "+595 ",
  VE: "+58 ",
  CA: "+1 ",
  // Europa común
  PT: "+351 ",
  IT: "+39 ",
  FR: "+33 ",
  DE: "+49 ",
  GB: "+44 ",
  NL: "+31 ",
};

/** Devuelve el prefijo telefónico para pre-llenar el input. Vacío si
 *  no tenemos un código en el lookup. */
export function phoneCodeForCountry(iso: string): string {
  return PHONE_CODES[iso.toUpperCase()] ?? "";
}

// ────────── WhatsApp routing por región ──────────

/**
 * Resuelve la región WhatsApp para un país por su ISO code. Reutiliza
 * la región pre-asignada en data/countries.ts. Fallback a LatAm si
 * el código no existe (no debería pasar — los IDs vienen del selector).
 */
export function regionForCountry(iso: string): WhatsappRegion {
  const country = findCountry(iso);
  const regionId = country?.region ?? "latam";
  const region = whatsappRegions.find((r) => r.id === regionId);
  return region ?? whatsappRegions[0]!;
}

// ────────── Snapshot del form al momento de enviar ──────────

export type FormSnapshot = {
  /** Multi-select del paso 1 */
  categories: CategoryId[];
  /** ISO alpha-2 del país elegido en el paso 2 */
  countryIso: string;
  /** Nombre legible del país (para el cuerpo del mensaje) */
  countryLabel: string;
  /** Selección del paso 3 */
  size: SizeId;
  /** Nombre del restaurante — obligatorio */
  restaurant: string;
  /** Teléfono WhatsApp — obligatorio */
  phone: string;
  /** Handle de Instagram — opcional (línea omitida si vacío) */
  instagram: string;
};

/** Normaliza un handle de IG: saca @ inicial si vino y lo vuelve a
 *  anteponer al armar el output. "" si vacío (línea se omite). */
function formatInstagram(raw: string): string {
  const trimmed = raw.trim().replace(/^@+/, "");
  if (!trimmed) return "";
  return `@${trimmed}`;
}

// ────────── Builder del mensaje WhatsApp (bilingüe) ──────────

function categoryLabel(id: CategoryId, lang: Lang): string {
  const cat = categories.find((c) => c.id === id);
  return cat ? L(cat.label, lang) : id;
}

function sizeLabel(id: SizeId, lang: Lang): string {
  const s = sizes.find((s) => s.id === id);
  return s ? `${L(s.label, lang)} (${L(s.caption, lang)})` : id;
}

// Plantillas del mensaje por idioma. La línea de Instagram se omite entera
// si el campo viene vacío.
const MESSAGE = {
  es: {
    greeting: (r: string) => `¡Hola Pimentón! 👋 Soy de ${r}.`,
    body: (cats: string, country: string, size: string) =>
      `Tenemos un restaurante de ${cats} en ${country} con ${size}.`,
    instagram: (ig: string) => `Instagram: ${ig}`,
    closing: "Me gustaría agendar la consultoría gratuita.",
  },
  en: {
    greeting: (r: string) => `Hi Pimentón! 👋 I'm from ${r}.`,
    body: (cats: string, country: string, size: string) =>
      `We run a ${cats} restaurant in ${country}, ${size}.`,
    instagram: (ig: string) => `Instagram: ${ig}`,
    closing: "I'd like to book the free consultation.",
  },
} as const;

export function buildWhatsappMessage(snap: FormSnapshot, lang: Lang): string {
  const m = MESSAGE[lang];
  const cats = snap.categories.map((id) => categoryLabel(id, lang)).join(", ");
  const size = sizeLabel(snap.size, lang);
  const ig = formatInstagram(snap.instagram);
  const lines = [
    m.greeting(snap.restaurant.trim()),
    m.body(cats, snap.countryLabel, size),
  ];
  if (ig) lines.push(m.instagram(ig));
  lines.push(m.closing);
  return lines.join("\n");
}

/** URL final wa.me, con número de región resuelto + mensaje en el idioma. */
export function buildWhatsappLink(snap: FormSnapshot, lang: Lang): string {
  const region = regionForCountry(snap.countryIso);
  return whatsappUrl(region, buildWhatsappMessage(snap, lang));
}
