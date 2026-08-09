import { log } from "../lib/logger.js";
import { loadState, saveState, coveredKeywords, markPublished } from "../lib/state.js";
import type { Destino } from "../lib/state.js";
import { DESTINOS } from "../types.js";
import type { Idea } from "../types.js";
import { env } from "../config/env.js";
import { searchIdeas } from "./searcher.js";
import { publishIdea, rebuildIndex } from "./publisher.js";

const SEEDS: Record<Destino, string> = {
  pimenton: env.SEED_PIMENTON,
  "control-room": env.SEED_CONTROL_ROOM,
};

/**
 * Posts que el Action generó pero no pudo pushear (runs fallidos por race en main).
 * Solo redacta+publica (sin Buscador) para no inventar temas nuevos.
 */
const RECOVER_BATCH: { destino: Destino; idea: Idea }[] = [
  {
    destino: "pimenton",
    idea: {
      keyword_primary: "rentabilidad delivery apps restaurantes",
      keywords_secondary: [
        "P&L delivery restaurante",
        "comisiones apps delivery",
        "margen por pedido delivery",
        "DoorDash Uber Eats Rappi rentabilidad",
      ],
      search_intent: "informacional",
      angle:
        "Explicar el P&L por pedido en apps de delivery (comisiones, packaging, ads, ticket) para dueños en LATAM y USA.",
      title_es: "Rentabilidad en apps de delivery: el P&L por pedido de tu restaurante",
      title_en: "Delivery app profitability: your restaurant’s per-order P&L",
      related_questions: [
        "¿Cuánto deja realmente un pedido de Rappi o Uber Eats?",
        "¿Qué costos van en el P&L del delivery?",
        "¿Cuándo el delivery deja de ser rentable?",
      ],
      difficulty: "media",
      rationale: "Recuperación del post perdido en el Action (attempt 1).",
    },
  },
  {
    destino: "control-room",
    idea: {
      keyword_primary: "qué indicadores revisar delivery multi-sucursal",
      keywords_secondary: [
        "KPIs delivery restaurante",
        "métricas multi-sucursal",
        "tiempos cancelaciones rating apps",
      ],
      search_intent: "informacional",
      angle:
        "Checklist matutino de indicadores para operar delivery en varias sucursales sin Excel eterno.",
      title_es: "Qué indicadores revisar cada mañana en delivery multi-sucursal",
      title_en: "Morning metrics checklist for multi-location delivery",
      related_questions: [
        "¿Qué KPIs mirar primero en ops de delivery?",
        "¿Cómo comparar sucursales sin perder el día en Excel?",
        "¿Qué alerta operativa no puedes ignorar?",
      ],
      difficulty: "media",
      rationale: "Recuperación del post perdido en el Action (attempt 1).",
    },
  },
  {
    destino: "pimenton",
    idea: {
      keyword_primary: "cuánto subir precios en apps de delivery",
      keywords_secondary: [
        "precios menú delivery",
        "markup apps delivery",
        "subir precios Rappi Uber Eats",
      ],
      search_intent: "comercial",
      angle:
        "Cómo decidir cuánto subir precios en apps sin matar conversión ni margen, con lógica de comisiones.",
      title_es: "Cuánto subir precios en apps de delivery (sin perder pedidos)",
      title_en: "How much to raise delivery app prices without losing orders",
      related_questions: [
        "¿Debo tener precios distintos en salón y en la app?",
        "¿Cuánto markup cubre la comisión?",
        "¿Cómo probar un aumento de precio en delivery?",
      ],
      difficulty: "media",
      rationale: "Recuperación del post perdido en el Action (attempt 2).",
    },
  },
  {
    destino: "control-room",
    idea: {
      keyword_primary: "cómo controlar la operación de delivery en varias sucursales",
      keywords_secondary: [
        "ops delivery multi-sucursal",
        "checklist operación delivery",
        "control diario pedidos",
      ],
      search_intent: "informacional",
      angle:
        "Sistema práctico para controlar la operación diaria de delivery en varias sucursales (ritmo, alertas, dueños de la mesa).",
      title_es: "Cómo controlar la operación de delivery en varias sucursales",
      title_en: "How to run multi-location delivery with a daily control checklist",
      related_questions: [
        "¿Quién debe mirar el delivery cada día?",
        "¿Qué ritual operativo funciona en multi-sucursal?",
        "¿Cómo pasar de dato a acción en ops?",
      ],
      difficulty: "media",
      rationale: "Recuperación del post que falló por overload Anthropic (attempt 2).",
    },
  },
];

/** Solo ideación (barato, para validar temas). No escribe ni cambia estado. */
export async function runIdeation(): Promise<void> {
  const state = loadState();
  for (const destino of DESTINOS) {
    const ideas = await searchIdeas(
      destino,
      SEEDS[destino],
      coveredKeywords(state, destino),
      env.MAX_POSTS_PER_RUN,
    );
    for (const idea of ideas) {
      log.info(`[${destino}] ${idea.keyword_primary} → ${idea.title_es}`);
    }
  }
}

/** Flujo completo: idea → redacta → genera HTML → actualiza estado + índice. */
export async function runFull(): Promise<void> {
  const state = loadState();
  for (const destino of DESTINOS) {
    try {
      const ideas = await searchIdeas(
        destino,
        SEEDS[destino],
        coveredKeywords(state, destino),
        env.MAX_POSTS_PER_RUN,
      );
      for (const idea of ideas.slice(0, env.MAX_POSTS_PER_RUN)) {
        const post = await publishIdea(destino, idea);
        markPublished(state, post);
      }
    } catch (err) {
      log.error(`[${destino}] Falló: ${(err as Error).message}`);
    }
  }
  rebuildIndex(state.published);
  saveState(state);
  log.ok(`Total publicado: ${state.published.length} posts (histórico).`);
}

/** Republica temas ya generados en Actions fallidos (sin Buscador). */
export async function runRecover(): Promise<void> {
  const state = loadState();
  for (const { destino, idea } of RECOVER_BATCH) {
    if (coveredKeywords(state, destino).includes(idea.keyword_primary)) {
      log.info(`[${destino}] Skip (ya cubierto): ${idea.keyword_primary}`);
      continue;
    }
    try {
      log.info(`[${destino}] Recuperando: ${idea.title_es}`);
      const post = await publishIdea(destino, idea);
      markPublished(state, post);
    } catch (err) {
      log.error(`[${destino}] Falló recover: ${(err as Error).message}`);
    }
  }
  rebuildIndex(state.published);
  saveState(state);
  log.ok(`Recover listo. Total histórico: ${state.published.length} posts.`);
}

export async function orchestrate(command: string): Promise<void> {
  if (command === "ideas") return runIdeation();
  if (command === "run") return runFull();
  if (command === "recover") return runRecover();
  throw new Error(`Comando desconocido: "${command}". Usa: ideas | run | recover`);
}
