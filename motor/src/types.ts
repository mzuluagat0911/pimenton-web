import type { Destino } from "./lib/state.js";

export type { Destino };
export type Language = "es" | "en";
export const LANGUAGES: Language[] = ["es", "en"];
export const DESTINOS: Destino[] = ["pimenton", "control-room"];

/** Idea que produce el buscador. */
export interface Idea {
  keyword_primary: string;
  keywords_secondary: string[];
  search_intent: "informacional" | "comercial" | "transaccional" | "navegacional";
  angle: string;
  title_es: string;
  title_en: string;
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
