/**
 * IDs públicos de medición / verificación.
 * Definir en Vercel → Environment Variables (Production + Preview).
 * Si están vacíos, no se inyecta nada (el sitio sigue igual).
 */
export const GA_MEASUREMENT_ID = (
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? ""
).trim();

export const GOOGLE_SITE_VERIFICATION = (
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? ""
).trim();
