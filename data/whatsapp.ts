/**
 * Fuente única de verdad para los números de WhatsApp por región.
 * Consumido por el FAB flotante y, próximamente, por el formulario de
 * consultoría (ruteo por país). Para sumar regiones, agregá una entrada
 * al array — el FAB las renderiza automáticamente.
 *
 * Formato wa.me: solo dígitos en `phone`, sin "+", sin espacios.
 */

export type WhatsappRegion = {
  id: "latam" | "europe" | "usa";
  /** Etiqueta corta (LatAm, Europa, USA) */
  title: string;
  /** Descriptor que aparece abajo del título en el selector */
  subtitle: string;
  /** Solo dígitos, en formato internacional sin "+" (formato wa.me) */
  phone: string;
};

export const whatsappRegions: readonly WhatsappRegion[] = [
  {
    id: "latam",
    title: "LatAm",
    subtitle: "Argentina y la región",
    phone: "5491157035170",
  },
  {
    id: "europe",
    title: "Europa",
    subtitle: "España y Europa",
    phone: "34683632437",
  },
  {
    id: "usa",
    title: "USA",
    subtitle: "Estados Unidos",
    phone: "5491140425909",
  },
] as const;

/**
 * Construye el deep-link a WhatsApp para una región. Si se pasa
 * `prefilledText`, se URL-encodea como mensaje pre-cargado en el chat.
 */
export function whatsappUrl(
  region: WhatsappRegion,
  prefilledText?: string,
): string {
  const base = `https://wa.me/${region.phone}`;
  return prefilledText
    ? `${base}?text=${encodeURIComponent(prefilledText)}`
    : base;
}
