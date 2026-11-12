import type { Destino } from "./lib/state.js";

export type { Destino };
export type Language = "es" | "en" | "it";
export const LANGUAGES: Language[] = ["es", "en", "it"];
export const DESTINOS: Destino[] = ["pimenton", "control-room"];

/** Idea que produce el buscador. */
export interface Idea {
  keyword_primary: string;
  keywords_secondary: string[];
  search_intent: "informacional" | "comercial" | "transaccional" | "navegacional";
  angle: string;
  title_es: string;
  title_en: string;
  /** Opcional en ideas legacy (antes del italiano): el redactor cae a title_en. */
  title_it?: string;
  related_questions: string[];
  difficulty: "baja" | "media" | "alta";
  rationale: string;
}

/** Borrador que produce el redactor para un idioma (alimenta al renderizador). */
export interface WriterOutput {
  title: string;
  headline: string;
  slug: string;
  meta_description: string;
  keywords: string[];
  answer_html: string;
  body_html: string;
  faq: { q: string; a: string }[];
}
