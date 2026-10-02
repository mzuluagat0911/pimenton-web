import { NextResponse } from "next/server";

const CRM_URL = "https://control.pimenton.app/api/crm/landing-leads";

const FIELDS = [
  "nombre",
  "whatsapp",
  "categorias",
  "pais",
  "sucursales",
  "idioma",
] as const;

/**
 * El CRM solo acepta CORS desde pimenton.io. Este route hace el POST
 * desde el servidor para que localhost, previews y producción puedan
 * leer el 201 / 422 / 5xx y no duplicar oportunidades.
 */
export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json(
      { detail: [{ loc: ["body"], msg: "JSON inválido" }] },
      { status: 422 },
    );
  }

  if (!raw || typeof raw !== "object") {
    return NextResponse.json(
      { detail: [{ loc: ["body"], msg: "JSON inválido" }] },
      { status: 422 },
    );
  }

  const src = raw as Record<string, unknown>;
  const payload: Record<string, string> = {};
  for (const key of FIELDS) {
    const value = src[key];
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (!trimmed) continue;
    payload[key] = trimmed;
  }

  if (!payload.nombre) {
    return NextResponse.json(
      { detail: [{ loc: ["body", "nombre"], msg: "nombre es obligatorio" }] },
      { status: 422 },
    );
  }

  try {
    const res = await fetch(CRM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      { detail: "crm_unreachable" },
      { status: 502 },
    );
  }
}
