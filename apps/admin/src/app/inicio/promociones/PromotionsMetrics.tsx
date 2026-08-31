"use client";

import React from "react";
import type { PromotionsCatalogSummaryDTO } from "@vc/api-client";

/* ==========================================================================
   Resumen del catálogo: cuatro tarjetas de métrica (diseño `958:639`).

   Dos de las cuatro que dibuja el diseño no tienen dato real detrás y se
   sustituyen por la métrica equivalente que SÍ existe:

     "Borradores"              → "Ocultas"                (`active === false`)
     "Importadas de Facebook"  → "Publicadas en Facebook" (`facebookPermalinkUrl`)

   Una promoción no tiene estados de publicación: solo `active`. Y Facebook es
   SALIDA, no entrada — al crear una promoción el backend publica el post en la
   Página; las filas `source='FACEBOOK'` son legado de un ingestor retirado que
   una migración dejó todas inactivas, así que contarlas como "importadas"
   describiría un flujo que ya no existe.

   Los cuatro números vienen del `summary` de la respuesta, que el servidor
   calcula SIN aplicar búsqueda ni filtros. Es deliberado: estas tarjetas
   describen el catálogo entero, así que filtrar por "Ocultas" no debe cambiar
   el "Promociones totales" de 32 a 29.
   ========================================================================== */

interface MetricCard {
  id: string;
  value: number;
  label: string;
  /** Color de la barrita indicadora de 34x3 del diseño. */
  barClassName: string;
  /** Contexto largo para quien se detiene sobre la tarjeta. */
  title: string;
}

export interface PromotionsMetricsProps {
  summary: PromotionsCatalogSummaryDTO;
}

function buildCards(summary: PromotionsCatalogSummaryDTO): MetricCard[] {
  return [
    {
      id: "total",
      value: summary.total,
      label: "Promociones totales",
      barClassName: "bg-info",
      title: "Todas las promociones del catálogo, visibles u ocultas. No cambia al filtrar.",
    },
    {
      id: "cover",
      value: summary.featuredInHome,
      label: "Visibles en portada",
      barClassName: "bg-brand-accent",
      title: "Las 3 promociones visibles más recientes: son las que el Home muestra ahora mismo.",
    },
    {
      id: "facebook",
      value: summary.publishedOnFacebook,
      label: "Publicadas en Facebook",
      barClassName: "bg-info",
      title: "Promociones que tienen un post asociado en la Página de Facebook.",
    },
    {
      id: "hidden",
      value: summary.hidden,
      label: "Ocultas",
      barClassName: "bg-neutral-quiet-ink",
      title: "Promociones que no se muestran en Inicio.",
    },
  ];
}

export function PromotionsMetrics({ summary }: PromotionsMetricsProps) {
  return (
    <section
      aria-label="Resumen del catálogo"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {buildCards(summary).map((card) => (
        <p
          key={card.id}
          title={card.title}
          className="flex min-h-[92px] flex-col rounded-[10px] border border-divider-soft bg-white px-4 py-[18px]"
        >
          <span className="font-inter text-[24px] font-bold leading-none text-admin-heading">
            {card.value}
          </span>
          <span className="mt-3 block font-inter text-[11px] leading-none text-neutral-quiet-ink">
            {card.label}
          </span>
          <span
            aria-hidden="true"
            className={`mt-2 block h-[3px] w-[34px] rounded-[2px] ${card.barClassName}`}
          />
        </p>
      ))}
    </section>
  );
}
