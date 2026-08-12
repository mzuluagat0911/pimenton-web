import type { Destino } from "../lib/state.js";
import { brandContext } from "../config/context.js";

const GOAL: Record<Destino, string> = {
  pimenton:
    "posicionar la AGENCIA Pimentón ante dueños y operadores de RESTAURANTES " +
    "en LATAM y USA, con foco fuerte en DELIVERY y APPS DE DELIVERY: " +
    "rentabilidad del canal, P&L de apps (comisiones, packaging, ads, margen), " +
    "Rappi/PedidosYa/Uber Eats/DiDi/DoorDash/Grubhub, growth de pedidos, " +
    "menú/conversión en apps, ops de pedidos y SEO/GEO. " +
    "Prioriza huecos reales de búsqueda en esos segmentos; no te limites a una lista fija. " +
    "PROHIBIDO: feature dumps de Control Room (eso es el carril control-room).",
  "control-room":
    "posicionar CONTROL ROOM ante ops multi-sucursal: visibilidad de pedidos, " +
    "alertas, rituales operativos, calidad de experiencia y de-dato-a-acción. " +
    "PROHIBIDO: estrategia de ads/ROAS, storytelling de agencia, SEO/GEO de marca " +
    "(eso es el carril pimenton).",
};

export function researchSystem(destino: Destino): string {
  return [
    `Eres un estratega de contenidos SEO/GEO. Objetivo: ${GOAL[destino]}`,
    "",
    "Contexto de marca (respeta territorio editorial y tono):",
    brandContext(destino),
    "",
    "Usa la búsqueda web para ver qué se busca y qué ya rankea. Prioriza huecos y",
    "ángulos con respuesta clara y citable (GEO = ser citado por ChatGPT/Perplexity/AI Overviews).",
    "Elige temas dentro de los PILARES de la marca; no cruces territorio con el otro carril.",
    "",
    "Ángulos NEUTROS sobre food apps: valor para la industria (medir, P&L, ops, menú).",
    "Evita ideas beligerantes anti-apps o que pongan a la plataforma como villano;",
    "preferí 'cómo leer el canal' / 'cómo no perder margen por falta de medición'.",
  ].join("\n");
}

export function researchUser(seed: string, covered: string[], n: number): string {
  const semilla = seed
    ? `Tema semilla: "${seed}".`
    : "Sin semilla: propón tú los temas más valiosos según la marca.";
  const yaHecho =
    covered.length > 0
      ? `Keywords YA cubiertas (NO repitas ni variantes casi idénticas):\n- ${covered.join("\n- ")}`
      : "Aún no hay keywords cubiertas.";
  return [
    semilla,
    "",
    yaHecho,
    "",
    `Investiga material para ${n} ideas de blog fuertes en SEO y GEO. Para cada una:`,
    "keyword principal, variantes long-tail, intención, preguntas relacionadas (PAA),",
    "un ángulo diferenciador y por qué vale la pena. Responde en texto (aún no JSON).",
  ].join("\n");
}

export function structureSystem(): string {
  return [
    "Convierte los hallazgos en ideas estructuradas. Devuelve EXACTAMENTE el esquema JSON.",
    "title_es en español y title_en en inglés, atractivos y con la keyword.",
    "Títulos neutros: sin clickbait anti-apps ni lenguaje de 'guerra' contra marketplaces.",
  ].join("\n");
}
