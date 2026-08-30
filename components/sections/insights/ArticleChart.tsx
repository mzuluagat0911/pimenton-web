"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useT } from "@/components/i18n/LanguageContext";
import type { InsightChart } from "@/data/insights";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const STACK_TONES = [
  "bg-pimenton-accent",
  "bg-pimenton-dark",
  "bg-pimenton-mint",
  "bg-pimenton-yellow",
  "bg-pimenton-border-strong",
] as const;

const STACK_SWATCH = [
  "bg-pimenton-accent",
  "bg-pimenton-dark",
  "bg-pimenton-mint",
  "bg-pimenton-yellow",
  "bg-pimenton-border-strong",
] as const;

function ChartChrome({
  chart,
  dark,
  children,
}: {
  chart: InsightChart;
  dark: boolean;
  children: ReactNode;
}) {
  const t = useT();
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.figure
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: EASE }}
      className={`my-10 overflow-hidden rounded-2xl border sm:my-12 ${
        dark
          ? "border-pimenton-dark-border bg-pimenton-dark"
          : "border-pimenton-border bg-pimenton-surface"
      }`}
    >
      <div className="px-5 pb-6 pt-5 sm:px-6 sm:pb-7 sm:pt-6">
        {chart.kicker && (
          <p
            className={`font-mono text-[10px] font-semibold uppercase tracking-[0.18em] ${
              dark ? "text-pimenton-accent" : "text-pimenton-accent"
            }`}
          >
            {t(chart.kicker)}
          </p>
        )}
        <figcaption
          className={`text-lg font-bold leading-snug tracking-tight normal-case ${
            chart.kicker ? "mt-1.5" : ""
          } ${dark ? "text-pimenton-text-on-dark" : "text-pimenton-text"}`}
        >
          {t(chart.title)}
        </figcaption>
        <div className="mt-5">{children}</div>
        {chart.caption && (
          <p
            className={`mt-5 text-[13px] leading-relaxed ${
              dark
                ? "text-pimenton-text-on-dark-muted"
                : "text-pimenton-text-muted"
            }`}
          >
            {t(chart.caption)}
          </p>
        )}
      </div>
    </motion.figure>
  );
}

function BarsChart({ chart, dark }: { chart: InsightChart; dark: boolean }) {
  const t = useT();
  const reduced = useReducedMotion() ?? false;

  return (
    <ul className="flex flex-col gap-4">
      {chart.items.map((item, i) => (
        <li key={i}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <span
              className={`text-sm font-medium ${
                dark ? "text-pimenton-text-on-dark" : "text-pimenton-text"
              }`}
            >
              {t(item.label)}
            </span>
            <span
              className={`font-mono text-sm font-semibold tabular-nums ${
                item.accent
                  ? "text-pimenton-accent"
                  : dark
                    ? "text-pimenton-text-on-dark-muted"
                    : "text-pimenton-text-muted"
              }`}
            >
              {item.display ? t(item.display) : `${item.value}%`}
            </span>
          </div>
          <div
            className={`h-2 overflow-hidden rounded-full ${
              dark ? "bg-pimenton-dark-surface" : "bg-pimenton-bg-soft"
            }`}
          >
            <motion.div
              className={`h-full rounded-full ${
                item.accent ? "bg-pimenton-accent" : dark ? "bg-pimenton-mint" : "bg-pimenton-dark"
              }`}
              initial={{ width: reduced ? `${item.value}%` : 0 }}
              whileInView={{ width: `${Math.min(100, Math.max(0, item.value))}%` }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: reduced ? 0 : 0.9,
                delay: reduced ? 0 : 0.12 + i * 0.08,
                ease: EASE,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function StackChart({ chart, dark }: { chart: InsightChart; dark: boolean }) {
  const t = useT();
  const reduced = useReducedMotion() ?? false;
  const total = chart.items.reduce((s, it) => s + it.value, 0) || 1;

  return (
    <div>
      <div
        className={`flex h-10 overflow-hidden rounded-full ${
          dark ? "bg-pimenton-dark-surface" : "bg-pimenton-bg-soft"
        }`}
      >
        {chart.items.map((item, i) => (
          <motion.div
            key={i}
            className={STACK_TONES[i % STACK_TONES.length]}
            title={`${t(item.label)} ${item.display ? t(item.display) : `${item.value}%`}`}
            initial={{ flexGrow: reduced ? item.value : 0 }}
            whileInView={{ flexGrow: item.value }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: reduced ? 0 : 0.8,
              delay: reduced ? 0 : 0.15,
              ease: EASE,
            }}
            style={{ flexBasis: 0 }}
            aria-label={`${t(item.label)} ${Math.round((item.value / total) * 100)}%`}
          />
        ))}
      </div>
      <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {chart.items.map((item, i) => (
          <li key={i} className="flex items-center gap-2.5 text-sm">
            <span
              aria-hidden
              className={`size-2.5 shrink-0 rounded-full ${STACK_SWATCH[i % STACK_SWATCH.length]}`}
            />
            <span
              className={
                dark ? "text-pimenton-text-on-dark" : "text-pimenton-text-soft"
              }
            >
              {t(item.label)}
            </span>
            <span
              className={`ml-auto font-mono text-xs font-semibold tabular-nums ${
                item.accent
                  ? "text-pimenton-accent"
                  : dark
                    ? "text-pimenton-text-on-dark-muted"
                    : "text-pimenton-text-muted"
              }`}
            >
              {item.display ? t(item.display) : `${item.value}%`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CompareChart({ chart, dark }: { chart: InsightChart; dark: boolean }) {
  const t = useT();
  const reduced = useReducedMotion() ?? false;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {chart.items.map((item, i) => (
        <motion.div
          key={i}
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 0.5,
            delay: reduced ? 0 : i * 0.1,
            ease: EASE,
          }}
          className={`rounded-xl px-4 py-4 ${
            item.accent
              ? dark
                ? "bg-pimenton-accent/12 ring-1 ring-pimenton-accent/40"
                : "bg-pimenton-accent/8 ring-1 ring-pimenton-accent/25"
              : dark
                ? "bg-pimenton-dark-surface"
                : "bg-pimenton-bg-soft"
          }`}
        >
          <p
            className={`text-xs font-medium uppercase tracking-[0.12em] ${
              dark ? "text-pimenton-text-on-dark-muted" : "text-pimenton-text-muted"
            }`}
          >
            {t(item.label)}
          </p>
          <p
            className={`mt-2 font-display text-3xl font-bold leading-none tracking-tight ${
              item.accent ? "text-pimenton-accent" : dark ? "text-pimenton-text-on-dark" : "text-pimenton-text"
            }`}
          >
            {item.display ? t(item.display) : `${item.value}%`}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function StepsChart({ chart, dark }: { chart: InsightChart; dark: boolean }) {
  const t = useT();
  const reduced = useReducedMotion() ?? false;

  return (
    <ol className="flex flex-col">
      {chart.items.map((item, i) => (
        <motion.li
          key={i}
          initial={reduced ? { opacity: 1 } : { opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 0.45,
            delay: reduced ? 0 : i * 0.06,
            ease: EASE,
          }}
          className={`flex gap-4 py-3 ${
            i < chart.items.length - 1
              ? dark
                ? "border-b border-pimenton-dark-border"
                : "border-b border-pimenton-border"
              : ""
          }`}
        >
          <span className="font-display text-lg font-bold leading-none text-pimenton-accent">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0 flex-1">
            <p
              className={`text-[15px] font-semibold leading-snug normal-case ${
                dark ? "text-pimenton-text-on-dark" : "text-pimenton-text"
              }`}
            >
              {t(item.label)}
            </p>
            {item.display && (
              <p
                className={`mt-0.5 text-sm ${
                  dark
                    ? "text-pimenton-text-on-dark-muted"
                    : "text-pimenton-text-muted"
                }`}
              >
                {t(item.display)}
              </p>
            )}
          </div>
        </motion.li>
      ))}
    </ol>
  );
}

/**
 * Gráfico editorial (barras, stacked, comparativa o pasos) alineado a la
 * paleta Pimentón. El dato vive en el data layer; acá sólo se dibuja.
 */
export function ArticleChart({
  chart,
  featured = false,
}: {
  chart: InsightChart;
  featured?: boolean;
}) {
  const dark = featured || chart.tone === "dark";

  return (
    <ChartChrome chart={chart} dark={dark}>
      {chart.kind === "bars" && <BarsChart chart={chart} dark={dark} />}
      {chart.kind === "stack" && <StackChart chart={chart} dark={dark} />}
      {chart.kind === "compare" && <CompareChart chart={chart} dark={dark} />}
      {chart.kind === "steps" && <StepsChart chart={chart} dark={dark} />}
    </ChartChrome>
  );
}
