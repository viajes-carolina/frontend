"use client";

import React from "react";
import { AboutPageDTO } from "@vc/api-client";

export interface MissionSectionProps {
  page: AboutPageDTO;
  className?: string;
}

// Curva real exportada desde Figma ("Ruta · De idea a recuerdo", node 561:62) —
// el mismo trazo "papel continuo" a mano alzada que usan las demás rutas del
// sitio (Home, Acompañamiento, Llegada). preserveAspectRatio="none" para que
// se estire con el contenedor, igual que el asset original.
const JOURNEY_ROUTE_PATH =
  "M1.66712 95.0004C295 -4.99956 508.334 161.667 801.667 55.0004C1081.67 -44.9996 1255 108.334 1521.67 1.66711";
const JOURNEY_ROUTE_VIEWBOX_W = 1523.33;
const JOURNEY_ROUTE_VIEWBOX_H = 96.6676;

// Posición de cada punto sobre la curva (x,y del propio Figma, no recalculada) —
// solo válida para los 4 pasos fijos del diseño; con otra cantidad se usa un
// reparto uniforme como respaldo.
const JOURNEY_DOT_POSITIONS = [
  { x: 10.67, y: 104 },
  { x: 477.33, y: 104 },
  { x: 930.67, y: 77.33 },
  { x: 1397.33, y: 24 },
];

export function MissionSection({ page, className = "" }: MissionSectionProps) {
  const steps = page.journeySteps ?? [];
  const dotPositions =
    steps.length === JOURNEY_DOT_POSITIONS.length
      ? JOURNEY_DOT_POSITIONS
      : steps.map((_, i) => ({
          x: (i / Math.max(steps.length - 1, 1)) * JOURNEY_ROUTE_VIEWBOX_W,
          y: JOURNEY_ROUTE_VIEWBOX_H / 2,
        }));

  return (
    <section className={`relative w-full overflow-hidden bg-white py-16 sm:py-20 lg:py-24 ${className}`}>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="font-sora text-xs font-semibold uppercase tracking-wider text-brand-accent">
              02 · Por qué existimos
            </p>
            <h2
              className="font-display mt-3 text-3xl font-semibold leading-tight text-brand-navy sm:text-4xl lg:text-[50px]"
              style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
            >
              {page.missionTitle}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-2">
            <p className="font-inter text-base leading-relaxed text-brand-navy/80 sm:text-lg">
              {page.missionBody}
            </p>
            {page.missionQuote && (
              <p
                className="font-display mt-6 text-xl italic leading-snug text-brand-navy sm:text-2xl"
                style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
              >
                {page.missionQuote}
              </p>
            )}
          </div>
        </div>

        {steps.length > 0 && (
          <>
            {/* Móvil/Tablet: ruta vertical simple, la curva horizontal solo tiene sentido en pantallas anchas */}
            <div className="relative mt-16 grid grid-cols-2 gap-x-6 gap-y-10 sm:hidden">
              {steps.map((step, i) => (
                <div key={i} className="relative">
                  <p className="font-sora text-[10px] font-semibold text-brand-accent">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="font-inter mt-1 text-sm font-semibold text-brand-navy">{step.label}</p>
                </div>
              ))}
            </div>

            <div className="relative mt-20 hidden h-32 sm:block lg:h-36">
              <svg
                viewBox={`0 0 ${JOURNEY_ROUTE_VIEWBOX_W} ${JOURNEY_ROUTE_VIEWBOX_H}`}
                preserveAspectRatio="none"
                className="absolute inset-x-0 top-0 h-full w-full"
                aria-hidden="true"
              >
                <path d={JOURNEY_ROUTE_PATH} stroke="#14293B" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" fill="none" />
              </svg>
              {steps.map((step, i) => {
                const pos = dotPositions[i];
                const isLast = i === steps.length - 1;
                return (
                  <div
                    key={i}
                    className={`absolute flex flex-col ${isLast ? "items-end" : "items-start"}`}
                    style={{ left: `${(pos.x / JOURNEY_ROUTE_VIEWBOX_W) * 100}%`, top: `${(pos.y / JOURNEY_ROUTE_VIEWBOX_H) * 100}%` }}
                  >
                    <span
                      className={`h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full ${isLast ? "bg-brand-accent" : "bg-brand-navy"}`}
                      aria-hidden="true"
                    />
                    <p className="font-sora mt-2 whitespace-nowrap text-[10px] font-semibold text-brand-accent">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <p className="font-inter mt-1 whitespace-nowrap text-sm font-semibold text-brand-navy lg:text-base">
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
