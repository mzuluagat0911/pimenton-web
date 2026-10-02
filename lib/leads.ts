import type { LeadPayload } from "@/data/consultationForm";

const CRM_PATH = "/api/crm/landing-leads";

export type LeadResult =
  | { ok: true; id?: string }
  | { ok: false; status: number; kind: "invalid" | "unavailable" };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Crea la oportunidad en el CRM. Espera la respuesta: un 201 es el único
 * éxito y no debe reenviarse. El botón de enviar tiene que quedar
 * deshabilitado mientras esta promesa está en curso.
 */
export async function sendLead(payload: LeadPayload): Promise<LeadResult> {
  const res = await fetch(CRM_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.status === 201) {
    const data: unknown = await res.json().catch(() => null);
    const id = isRecord(data) && typeof data.id === "string" ? data.id : undefined;
    return { ok: true, id };
  }

  if (res.status === 422) {
    return { ok: false, status: 422, kind: "invalid" };
  }

  return { ok: false, status: res.status, kind: "unavailable" };
}
