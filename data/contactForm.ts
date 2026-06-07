/**
 * Fuente única para el formulario de consultoría:
 * - Opciones de los selectores (categoría / ubicaciones / país)
 * - Ruteo país → región WhatsApp (consume data/whatsapp.ts)
 * - Builder del mensaje pre-cargado con omisión de campos vacíos
 *
 * El formulario es 100% client-side: el "envío" abre wa.me en pestaña
 * nueva con el mensaje encodeado. No hay backend.
 */

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

export type CountryId =
  | "usa"
  | "argentina"
  | "espana"
  | "mexico"
  | "chile"
  | "otros";

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

export const countries: ReadonlyArray<Option<CountryId>> = [
  { id: "usa", label: "USA" },
  { id: "argentina", label: "Argentina" },
  { id: "espana", label: "España" },
  { id: "mexico", label: "México" },
  { id: "chile", label: "Chile" },
  { id: "otros", label: "Otros" },
] as const;

// ────────────── Ruteo país → región ──────────────

/**
 * Mapea cada país del selector al ID de región de WhatsApp.
 * - USA → usa
 * - España (y, a futuro, otros países de Europa) → europe
 * - Argentina/México/Chile → latam
 * - Otros → fallback latam (per spec)
 *
 * Si en el futuro se agregan más países al selector, extender este mapa.
 * El selector actual del form es la única fuente de IDs válidos.
 */
const COUNTRY_TO_REGION: Record<CountryId, WhatsappRegion["id"]> = {
  usa: "usa",
  espana: "europe",
  argentina: "latam",
  mexico: "latam",
  chile: "latam",
  otros: "latam",
};

export function regionForCountry(countryId: CountryId): WhatsappRegion {
  const regionId = COUNTRY_TO_REGION[countryId];
  const region = whatsappRegions.find((r) => r.id === regionId);
  if (!region) {
    // Hard fallback — no debería pasar porque el mapa cubre todo CountryId.
    return whatsappRegions[0]!;
  }
  return region;
}

// ────────────── Snapshot del formulario ──────────────

/**
 * Estado completo del formulario al momento de "enviar". Los campos
 * opcionales (name, instagram) pueden venir vacíos; los "otros" tienen
 * sentido sólo cuando el ID elegido es "otros".
 */
export type FormSnapshot = {
  category: CategoryId;
  categoryOther: string;
  locations: LocationsId;
  country: CountryId;
  countryOther: string;
  /** Tu nombre — opcional (acompaña al mensaje si está cargado) */
  name: string;
  restaurant: string;
  phone: string;
  /** Instagram — opcional */
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
  if (snap.country === "otros") {
    return snap.countryOther.trim() || "Otros";
  }
  return countries.find((c) => c.id === snap.country)?.label ?? "";
}

function locationsLabel(snap: FormSnapshot): string {
  return locations.find((l) => l.id === snap.locations)?.label ?? "";
}

/**
 * Normaliza el handle de IG: agrega "@" si el usuario no lo puso.
 * Devuelve "" si el input está vacío (la línea se omite).
 */
function formatInstagram(raw: string): string {
  const trimmed = raw.trim().replace(/^@+/, "");
  if (!trimmed) return "";
  return `@${trimmed}`;
}

// ────────────── Builder del resumen (UI confirmación) ──────────────

export type SummaryRow = { label: string; value: string };

export function buildSummary(snap: FormSnapshot): SummaryRow[] {
  const rows: SummaryRow[] = [];
  const name = snap.name.trim();
  if (name) rows.push({ label: "Tu nombre", value: name });
  rows.push({ label: "Restaurante", value: snap.restaurant.trim() });
  rows.push({ label: "Categoría", value: categoryLabel(snap) });
  rows.push({ label: "Ubicaciones", value: locationsLabel(snap) });
  rows.push({ label: "País", value: countryLabel(snap) });
  rows.push({ label: "Teléfono", value: snap.phone.trim() });
  const ig = formatInstagram(snap.instagram);
  if (ig) rows.push({ label: "Instagram", value: ig });
  return rows;
}

// ────────────── Builder del mensaje WhatsApp ──────────────

/**
 * Mensaje pre-cargado para wa.me. Los campos opcionales sin valor se
 * OMITEN — nunca aparece "Instagram: -" o "Nombre: -".
 *
 * El teléfono no se incluye porque WhatsApp ya lo expone como remitente
 * en la conversación: repetirlo en el cuerpo del mensaje es ruido.
 */
export function buildWhatsappMessage(snap: FormSnapshot): string {
  const lines: string[] = [];
  lines.push(
    "Hola Pimentón 👋 Quiero profesionalizar el delivery de mi restaurante.",
  );
  lines.push("");

  const name = snap.name.trim();
  if (name) lines.push(`- Nombre: ${name}`);
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
 * Consume whatsappUrl() de data/whatsapp.ts (que ya hace el
 * encodeURIComponent del texto).
 */
export function buildWhatsappLink(snap: FormSnapshot): string {
  const region = regionForCountry(snap.country);
  return whatsappUrl(region, buildWhatsappMessage(snap));
}
