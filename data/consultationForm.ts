/**
 * Fuente única para el form de consultoría (versión con emojis 3D).
 * - Categorías, tamaños y países destacados con su asset 3D + fallback Unicode.
 * - Lista completa de países para el dropdown "Otro país" (reutiliza countries.ts).
 * - Phone code lookup para pre-llenar el input del paso 4.
 * - Builder del mensaje pre-armado de WhatsApp + URL final.
 *
 * El form NO se envía a backend: el "envío" abre wa.me en pestaña nueva.
 */

import { countries as allCountries, findCountry } from "./countries";
import {
  whatsappRegions,
  whatsappUrl,
  type WhatsappRegion,
} from "./whatsapp";

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
  label: string;
  /** Nombre del PNG en /public/assets/emoji/3d/ */
  emoji: string;
  /** Unicode emoji que se muestra si el PNG no existe todavía */
  fallback: string;
};

export const categories: ReadonlyArray<CategoryOption> = [
  { id: "burger", label: "Burger", emoji: "burger.png", fallback: "🍔" },
  { id: "pizza", label: "Pizza", emoji: "pizza.png", fallback: "🍕" },
  { id: "sushi", label: "Sushi", emoji: "sushi.png", fallback: "🍣" },
  { id: "dessert", label: "Postres", emoji: "donut.png", fallback: "🍩" },
  { id: "bakery", label: "Panaderías", emoji: "croissant.png", fallback: "🥐" },
  { id: "other", label: "Otros", emoji: "plate.png", fallback: "🍽️" },
] as const;

type SizeOption = {
  id: SizeId;
  label: string;
  caption: string;
  emoji: string;
  fallback: string;
};

export const sizes: ReadonlyArray<SizeOption> = [
  {
    id: "solo",
    label: "Solo yo",
    caption: "1 sucursal",
    emoji: "chef.png",
    fallback: "👨‍🍳",
  },
  {
    id: "small",
    label: "Pequeño",
    caption: "2 – 5 sucursales",
    emoji: "building-small.png",
    fallback: "🏪",
  },
  {
    id: "medium",
    label: "Mediano",
    caption: "6 – 20 sucursales",
    emoji: "building-medium.png",
    fallback: "🏢",
  },
  {
    id: "large",
    label: "Grande",
    caption: "+20 sucursales",
    emoji: "building-large.png",
    fallback: "🏬",
  },
] as const;

type FeaturedCountry = {
  /** ISO 3166-1 alpha-2 — matchea con countries.ts */
  isoCode: string;
  label: string;
  emoji: string;
  fallback: string;
};

export const featuredCountries: ReadonlyArray<FeaturedCountry> = [
  { isoCode: "AR", label: "Argentina", emoji: "flag-ar.png", fallback: "🇦🇷" },
  { isoCode: "CL", label: "Chile", emoji: "flag-cl.png", fallback: "🇨🇱" },
  { isoCode: "CO", label: "Colombia", emoji: "flag-co.png", fallback: "🇨🇴" },
  { isoCode: "ES", label: "España", emoji: "flag-es.png", fallback: "🇪🇸" },
  { isoCode: "MX", label: "México", emoji: "flag-mx.png", fallback: "🇲🇽" },
  { isoCode: "PE", label: "Perú", emoji: "flag-pe.png", fallback: "🇵🇪" },
  { isoCode: "UY", label: "Uruguay", emoji: "flag-uy.png", fallback: "🇺🇾" },
  { isoCode: "US", label: "USA", emoji: "flag-us.png", fallback: "🇺🇸" },
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
 * nativo (no usamos PNG de Fluent para esta lista — demasiados).
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

// ────────── Builder del mensaje WhatsApp ──────────

function categoryLabel(id: CategoryId): string {
  return categories.find((c) => c.id === id)?.label ?? id;
}

function sizeLabel(id: SizeId): string {
  const s = sizes.find((s) => s.id === id);
  return s ? `${s.label} (${s.caption})` : id;
}

/**
 * Mensaje pre-armado para wa.me. Ejemplo de output:
 *
 *   ¡Hola Pimentón! 👋 Soy de Brasa & Fuego.
 *   Tenemos un restaurante de Burger, Pizza en Argentina con Pequeño (2 – 5 sucursales).
 *   Instagram: @brasayfuego
 *   Me gustaría agendar la consultoría gratuita.
 *
 * La línea de Instagram se OMITE entera si el campo viene vacío
 * (no aparece "Instagram: -").
 */
export function buildWhatsappMessage(snap: FormSnapshot): string {
  const cats = snap.categories.map(categoryLabel).join(", ");
  const size = sizeLabel(snap.size);
  const ig = formatInstagram(snap.instagram);
  const lines = [
    `¡Hola Pimentón! 👋 Soy de ${snap.restaurant.trim()}.`,
    `Tenemos un restaurante de ${cats} en ${snap.countryLabel} con ${size}.`,
  ];
  if (ig) lines.push(`Instagram: ${ig}`);
  lines.push("Me gustaría agendar la consultoría gratuita.");
  return lines.join("\n");
}

/** URL final wa.me, con número de región resuelto + mensaje encodeado. */
export function buildWhatsappLink(snap: FormSnapshot): string {
  const region = regionForCountry(snap.countryIso);
  return whatsappUrl(region, buildWhatsappMessage(snap));
}
