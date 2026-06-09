/**
 * Fuente única para el formulario de consultoría:
 * - Opciones de los selectores (categoría / ubicaciones)
 * - Países: lookup contra data/countries.ts (lista exhaustiva con
 *   ruteo país → región WhatsApp embebido)
 * - Builder del mensaje pre-cargado con omisión de campos opcionales
 *   vacíos
 *
 * El formulario es 100% client-side: el "envío" abre wa.me en pestaña
 * nueva con el mensaje encodeado. No hay backend.
 */

import { countries, findCountry, type Country } from "./countries";
import {
  whatsappRegions,
  whatsappUrl,
  type WhatsappRegion,
} from "./whatsapp";

// ────────────── Tipos de opciones ──────────────

export type CategoryId =
  | "burger"
  | "pizza"
  | "sushi"
  | "postres"
  | "panaderias"
  | "otros";

export type LocationsId = "1" | "2-5" | "5+";

export type Option<Id extends string> = { id: Id; label: string };

export const categories: ReadonlyArray<Option<CategoryId>> = [
  { id: "burger", label: "Burger" },
  { id: "pizza", label: "Pizza" },
  { id: "sushi", label: "Sushi" },
  { id: "postres", label: "Postres" },
  { id: "panaderias", label: "Panaderías" },
  { id: "otros", label: "Otros" },
] as const;

export const locations: ReadonlyArray<Option<LocationsId>> = [
  { id: "1", label: "1" },
  { id: "2-5", label: "2 a 5" },
  { id: "5+", label: "+5" },
] as const;

// ────────────── Ruteo país → región ──────────────

/**
 * Resuelve la región WhatsApp para un país por su ISO code. Si el código
 * no se encuentra (caso defensivo, no debería pasar dado que los códigos
 * vienen del select), defaultea a LatAm.
 */
export function regionForCountry(countryCode: string): WhatsappRegion {
  const country = findCountry(countryCode);
  const regionId = country?.region ?? "latam";
  const region = whatsappRegions.find((r) => r.id === regionId);
  if (!region) return whatsappRegions[0]!;
  return region;
}

// ────────────── Snapshot del formulario ──────────────

/**
 * Estado completo del formulario al momento de "enviar". `categoryOther`
 * sólo tiene sentido cuando category === "otros". Los campos opcionales
 * (instagram) pueden venir vacíos. Nombre, restaurante, teléfono, país,
 * categoría y ubicaciones son obligatorios.
 */
export type FormSnapshot = {
  category: CategoryId;
  categoryOther: string;
  locations: LocationsId;
  /** ISO 3166-1 alpha-2 code — siempre presente al enviar */
  country: string;
  /** Nombre de la persona — obligatorio */
  name: string;
  restaurant: string;
  phone: string;
  /** Handle de Instagram — opcional (línea omitida si vacío) */
  instagram: string;
};

// ────────────── Helpers de presentación ──────────────

function categoryLabel(snap: FormSnapshot): string {
  if (snap.category === "otros") {
    return snap.categoryOther.trim() || "Otros";
  }
  return categories.find((c) => c.id === snap.category)?.label ?? "";
}

function countryLabel(snap: FormSnapshot): string {
  return findCountry(snap.country)?.name ?? "";
}

function locationsLabel(snap: FormSnapshot): string {
  return locations.find((l) => l.id === snap.locations)?.label ?? "";
}

/**
 * Normaliza el handle de IG: elimina `@` inicial si vino del input y lo
 * vuelve a anteponer al armar el output. Devuelve "" si vacío (la línea
 * se omite del mensaje).
 */
function formatInstagram(raw: string): string {
  const trimmed = raw.trim().replace(/^@+/, "");
  if (!trimmed) return "";
  return `@${trimmed}`;
}

// ────────────── Builder del resumen (UI confirmación) ──────────────

export type SummaryRow = { label: string; value: string };

export function buildSummary(snap: FormSnapshot): SummaryRow[] {
  const rows: SummaryRow[] = [
    { label: "Tu nombre", value: snap.name.trim() },
    { label: "Restaurante", value: snap.restaurant.trim() },
    { label: "Categoría", value: categoryLabel(snap) },
    { label: "Ubicaciones", value: locationsLabel(snap) },
    { label: "País", value: countryLabel(snap) },
    { label: "Teléfono", value: snap.phone.trim() },
  ];
  const ig = formatInstagram(snap.instagram);
  if (ig) rows.push({ label: "Instagram", value: ig });
  return rows;
}

// ────────────── Builder del mensaje WhatsApp ──────────────

/**
 * Mensaje pre-cargado para wa.me. Instagram se OMITE entero si vacío
 * (no aparece "Instagram: -"). El teléfono no se incluye porque
 * WhatsApp ya expone el número del remitente al receptor — repetirlo
 * en el cuerpo es ruido.
 */
export function buildWhatsappMessage(snap: FormSnapshot): string {
  const lines: string[] = [];
  lines.push(
    "Hola Pimentón 👋 Quiero profesionalizar el delivery de mi restaurante.",
  );
  lines.push("");
  lines.push(`- Nombre: ${snap.name.trim()}`);
  lines.push(`- Restaurante: ${snap.restaurant.trim()}`);
  lines.push(`- Categoría: ${categoryLabel(snap)}`);
  lines.push(`- Ubicaciones: ${locationsLabel(snap)}`);
  lines.push(`- País: ${countryLabel(snap)}`);
  const ig = formatInstagram(snap.instagram);
  if (ig) lines.push(`- Instagram: ${ig}`);
  lines.push("");
  lines.push("Me gustaría coordinar una consultoría.");
  return lines.join("\n");
}

/**
 * URL final wa.me — número según ruteo de país + texto encodeado.
 * Consume whatsappUrl() de data/whatsapp.ts (que hace el
 * encodeURIComponent del texto).
 */
export function buildWhatsappLink(snap: FormSnapshot): string {
  const region = regionForCountry(snap.country);
  return whatsappUrl(region, buildWhatsappMessage(snap));
}

// Re-export para que el form consuma todo desde acá si quiere
export { countries, findCountry };
export type { Country };
