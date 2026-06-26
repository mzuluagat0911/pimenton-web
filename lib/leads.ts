import type { LeadPayload } from "@/data/consultationForm";

/**
 * Envía el lead del form de consultoría a un Google Sheet vía webhook de
 * Google Apps Script (respaldo / CRM). Es un AÑADIDO a la apertura de
 * WhatsApp, nunca un reemplazo.
 *
 * Diseño "fire-and-forget" y a prueba de fallos:
 * - No devuelve promesa para esperar: dispara el POST y vuelve enseguida, así
 *   el caller puede abrir WhatsApp inmediatamente sin demoras.
 * - `mode: "no-cors"` porque Apps Script no manda headers CORS desde el
 *   browser. La respuesta es opaca (no se puede leer) — no la necesitamos.
 * - Todo envuelto en try/catch + `.catch`: si el webhook falla, tarda o la
 *   variable no está, no rompe nada ni muestra error al usuario. WhatsApp es
 *   el canal principal; el Sheet es respaldo.
 */
export function sendLead(payload: LeadPayload): void {
  try {
    const url = process.env.NEXT_PUBLIC_LEADS_WEBHOOK_URL;
    if (!url) return; // sin webhook configurado → no-op silencioso

    void fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {
      /* respaldo CRM: si el POST falla, lo ignoramos en silencio */
    });
  } catch {
    /* nunca propagar: la apertura de WhatsApp no depende de esto */
  }
}
