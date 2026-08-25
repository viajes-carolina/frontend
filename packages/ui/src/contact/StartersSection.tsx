"use client";

import React from "react";
import { ContactPageDTO } from "@vc/api-client";

// Curva real exportada desde Figma ("Ruta de frases iniciales", node 583:6) —
// mismo trazo "papel continuo" usado en la ruta de la Misión de Nosotros.
const STARTERS_ROUTE_PATH =
  "M0.135466 12.8157C313.469 -19.1843 493.469 39.4824 746.802 10.149C1013.47 -19.1843 1226.8 36.8157 1493.47 4.8157";
const STARTERS_ROUTE_VIEWBOX_W = 1493.63;
const STARTERS_ROUTE_VIEWBOX_H = 19.9755;

// Posiciones reales de las 3 paradas sobre la curva (coordenadas del propio Figma).
const STARTER_DOT_POSITIONS = [
  { x: 89.33, y: 28 },
  { x: 585.33, y: 14.67 },
  { x: 1086.67, y: 25.33 },
];

export interface StartersSectionProps {
  page: ContactPageDTO;
  className?: string;
}

export function StartersSection({ page, className = "" }: StartersSectionProps) {
  const phrases = page.starterPhrases ?? [];
  if (!page.startersTitle && phrases.length === 0) return null;

  const dotPositions =
    phrases.length === STARTER_DOT_POSITIONS.length
      ? STARTER_DOT_POSITIONS
      : phrases.map((_, i) => ({
          x: (i / Math.max(phrases.length - 1, 1)) * STARTERS_ROUTE_VIEWBOX_W,
          y: STARTERS_ROUTE_VIEWBOX_H / 2,
        }));

  return (
    <section className={`relative w-full overflow-hidden bg-white py-16 sm:py-20 lg:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-6">
            {page.startersBadge && (
              <p className="font-sora text-xs font-semibold uppercase tracking-wider text-brand-accent">{page.startersBadge}</p>
            )}
            <h2
              className="font-display mt-3 text-3xl font-semibold leading-tight text-brand-navy sm:text-4xl lg:text-[48px]"
              style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
            >
              {page.startersTitle}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-2">
            <p className="font-inter text-base text-brand-navy/75 sm:text-lg">{page.startersSubtitle}</p>
          </div>
        </div>

        {phrases.length > 0 && (
          <>
            {/* Móvil/Tablet: lista vertical simple */}
            <div className="relative mt-14 flex flex-col gap-8 sm:hidden">
              {phrases.map((phrase, i) => (
                <div key={i}>
                  <p className="font-sora text-xs font-semibold text-brand-accent">{String(i + 1).padStart(2, "0")}</p>
                  <p
                    className="font-display mt-2 text-xl italic leading-snug text-brand-navy"
                    style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
                  >
                    &ldquo;{phrase.quote}&rdquo;
                  </p>
                  <p className="font-inter mt-2 text-sm text-brand-navy/70">{phrase.support}</p>
                </div>
              ))}
            </div>

            <div className="relative mt-20 hidden h-24 sm:block">
              <svg
                viewBox={`0 0 ${STARTERS_ROUTE_VIEWBOX_W} ${STARTERS_ROUTE_VIEWBOX_H}`}
                preserveAspectRatio="none"
                className="absolute inset-x-0 top-0 h-full w-full"
                aria-hidden="true"
              >
                <path d={STARTERS_ROUTE_PATH} stroke="#2E4D61" strokeOpacity="0.3" strokeWidth="2" fill="none" />
              </svg>
              {phrases.map((phrase, i) => {
                const pos = dotPositions[i];
                const isLast = i === phrases.length - 1;
                return (
                  <span
                    key={i}
                    className={`absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full ${isLast ? "bg-brand-accent" : "bg-brand-navy"}`}
                    style={{ left: `${(pos.x / STARTERS_ROUTE_VIEWBOX_W) * 100}%`, top: `${(pos.y / STARTERS_ROUTE_VIEWBOX_H) * 100}%` }}
                    aria-hidden="true"
                  />
                );
              })}
            </div>

            <div className="mt-10 hidden grid-cols-3 gap-8 sm:grid lg:mt-16">
              {phrases.map((phrase, i) => (
                <div key={i}>
                  <p className="font-sora text-xs font-semibold text-brand-accent">{String(i + 1).padStart(2, "0")}</p>
                  <p
                    className="font-display mt-2 text-xl italic leading-snug text-brand-navy lg:text-2xl"
                    style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
                  >
                    &ldquo;{phrase.quote}&rdquo;
                  </p>
                  <p className="font-inter mt-2 text-sm text-brand-navy/70 lg:text-base">{phrase.support}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {page.startersClosing && (
          <p className="font-inter mt-14 text-base font-semibold text-brand-navy sm:mt-16">{page.startersClosing}</p>
        )}
      </div>
    </section>
  );
}
