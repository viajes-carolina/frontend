"use client";

import React from "react";
import type { CookieCategoryDTO } from "@vc/api-client";
import { Toggle } from "../primitives/Toggle";
import { useCookiePreferences } from "./useCookiePreferences";

export interface CookiePreferencesPanelProps {
  categories: CookieCategoryDTO[];
  acceptAllLabel: string;
  savePreferencesLabel: string;
}

// Panel de preferencias de cookies — se compone dentro de `/cookies/page.tsx`,
// antes o después del índice de `LegalArticleSection`. Persiste la elección
// del visitante en una cookie propia (`vc_cookie_consent`), sin integrar
// ningún script de analítica real.
export function CookiePreferencesPanel({ categories, acceptAllLabel, savePreferencesLabel }: CookiePreferencesPanelProps) {
  const { values, toggleCategory, acceptAll, savePreferences, justSaved } = useCookiePreferences(categories);

  return (
    <section className="w-full px-6 pb-14 pt-2 sm:px-10 sm:pb-[90px] sm:pt-2 lg:px-[192px]">
      <div className="flex flex-col gap-5 rounded-[22px] border border-neutral-border bg-white p-6 shadow-sm sm:p-[30px]">
        <div className="flex flex-col gap-1">
          <h2
            className="font-display text-2xl font-semibold leading-[1.15] text-brand-navy sm:text-[28px]"
            style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
          >
            Panel de preferencias
          </h2>
          <p className="font-inter text-[15px] leading-[1.6] text-neutral-muted">
            Elige qué cookies no esenciales permites en este navegador. Puedes cambiar tu decisión cuando quieras
            volviendo a esta página.
          </p>
        </div>

        <div className="flex flex-col divide-y divide-neutral-border">
          {categories.map((category) => (
            <div key={category.key} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
              <div className="flex flex-col gap-1">
                <p className="font-inter text-sm font-semibold text-brand-navy">{category.name}</p>
                <p className="max-w-[560px] font-inter text-[13.5px] leading-[1.6] text-neutral-muted">
                  {category.description}
                </p>
                {category.required && (
                  <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.06em] text-brand-accent">
                    Siempre activas
                  </span>
                )}
              </div>
              <Toggle
                checked={Boolean(values[category.key])}
                onChange={() => toggleCategory(category.key)}
                disabled={category.required}
                aria-label={category.name}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start gap-3 border-t border-neutral-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={savePreferences}
              className="inline-flex items-center justify-center rounded-full border-2 border-brand-navy/20 px-5 py-2.5 font-inter text-sm font-semibold text-brand-navy transition-all hover:border-brand-navy active:scale-[0.98]"
            >
              {savePreferencesLabel}
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="inline-flex items-center justify-center rounded-full bg-brand-navy px-5 py-2.5 font-inter text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
            >
              {acceptAllLabel}
            </button>
          </div>
          {justSaved && (
            <p className="font-inter text-[13px] font-semibold text-brand-accent">Preferencia guardada en este navegador.</p>
          )}
        </div>
      </div>
    </section>
  );
}
