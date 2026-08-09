/**
 * IDs públicos de medición / verificación.
 * Definir en Vercel → Environment Variables (Production + Preview).
 * El Measurement ID es público (va en el HTML del cliente).
 */
export const GA_MEASUREMENT_ID = (
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-25DBL0EY6V"
).trim();

export const GOOGLE_SITE_VERIFICATION = (
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? ""
).trim();
