"use client";

import React from "react";
import type { PromotionDTO } from "@vc/api-client";
import { Badge, StarIcon } from "@vc/ui";
import {
  TableEmptyCell,
  TableRowActions,
  TableText,
  TableThumbnail,
  TableTitle,
  TableToggle,
  type DataTableColumn,
  type DataTableRowAction,
} from "../../../components/table";
import { formatCatalogDate, formatDuration, isPromotionExpired } from "../../../lib/promotionsCatalog";

/* ==========================================================================
   Declaración de la tabla de Promociones: qué columnas tiene.

   Los filtros ya no se declaran aquí: los resuelve el servidor y viven en
   `lib/promotionsCatalog.ts` (`PROMOTION_CATALOG_FILTERS`), sin `match`, porque
   un predicado local solo vería las 15 filas de la página.
   ========================================================================== */

/* ── Columnas ─────────────────────────────────────────────────────────────── */

export interface PromotionColumnHandlers {
  onToggleActive: (promo: PromotionDTO) => void;
  onEdit: (promo: PromotionDTO) => void;
  onDelete: (promo: PromotionDTO) => void;
  onOpenFacebookPost: (promo: PromotionDTO) => void;
  /** Motivo por el que una fila no se puede ocultar, o `undefined` si sí puede. */
  hideBlockedReason: (promo: PromotionDTO) => string | undefined;
  busy: boolean;
}

function rowActions(promo: PromotionDTO, handlers: PromotionColumnHandlers): DataTableRowAction[] {
  const actions: DataTableRowAction[] = [
    { id: "edit", label: "Editar contenido", onSelect: () => handlers.onEdit(promo) },
  ];

  /* Solo si existe el post: un ítem apagado "Ver publicación" en 7 de cada 32
     filas es ruido, y la ausencia ya se cuenta en la métrica del resumen. */
  if (promo.facebookPermalinkUrl) {
    actions.push({
      id: "facebook",
      label: "Ver publicación en Facebook",
      onSelect: () => handlers.onOpenFacebookPost(promo),
    });
  }

  actions.push({
    id: "delete",
    label: "Eliminar",
    tone: "danger",
    onSelect: () => handlers.onDelete(promo),
  });

  return actions;
}

/**
 * Columnas del diseño, con una corrección de honestidad: "ÚLTIMA PUBLICACIÓN"
 * se llama aquí "CREADA". No existe `published_at` en el modelo; el dato que
 * hay es `createdAt`, que además es el criterio con el que se elige la portada.
 * Mantener el rótulo original sería inventar una semántica que el dato no tiene.
 */
export function buildPromotionColumns(
  handlers: PromotionColumnHandlers
): readonly DataTableColumn<PromotionDTO>[] {
  const now = new Date();

  return [
    {
      id: "photo",
      header: "Foto",
      width: "w-[86px]",
      cell: (promo) => <TableThumbnail url={promo.featuredMediaUrl} alt={`Foto de ${promo.title}`} />,
    },
    {
      id: "title",
      header: "Título",
      width: "min-w-[260px]",
      cell: (promo) => (
        <TableTitle
          title={promo.title}
          meta={
            <>
              {promo.destination?.trim() || (
                <span className="italic text-control-disabled-ink">Sin destino</span>
              )}
              {" · "}
              {formatDuration(promo.durationDays, promo.durationNights)}
            </>
          }
        />
      ),
    },
    {
      id: "source",
      header: "Fuente",
      width: "w-[104px]",
      cell: (promo) => (
        <TableText tone="muted">{promo.source === "FACEBOOK" ? "Facebook" : "Manual"}</TableText>
      ),
    },
    {
      id: "status",
      header: "Estado",
      width: "w-[168px]",
      cell: (promo) => {
        const expired = isPromotionExpired(promo, now);
        return (
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge tone={promo.active ? "info" : "neutral"}>
              {promo.active ? "Visible" : "Oculta"}
            </Badge>
            {/* La vigencia es independiente de la visibilidad: el Home ordena
                por fecha de creación y no mira `validUntil`, así que una
                promoción puede estar visible Y vencida a la vez. */}
            {expired && (
              <Badge tone="danger" title={`Su vigencia terminó el ${promo.validUntil}`}>
                Vencida
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "cover",
      header: "Portada",
      width: "w-[178px]",
      cell: (promo) => {
        const reason = handlers.hideBlockedReason(promo);
        return (
          <div className="flex items-center gap-2">
            <TableToggle
              checked={promo.active}
              onChange={() => handlers.onToggleActive(promo)}
              label={`${promo.active ? "Ocultar" : "Mostrar"} «${promo.title}» en la portada de Inicio`}
              disabled={handlers.busy || Boolean(reason)}
              reason={reason}
            />
            {/* `featuredInHome` lo calcula el servidor, que es quien ve el
                catálogo entero. Deducirlo de la página visible pintaría la
                estrella sobre la fila más reciente de CADA página. */}
            {promo.featuredInHome && (
              <Badge
                tone="accent"
                icon={<StarIcon size={10} />}
                title="Es una de las 3 promociones que el Home muestra ahora mismo"
              >
                En portada
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "createdAt",
      header: "Creada",
      width: "w-[132px]",
      cell: (promo) => {
        const label = formatCatalogDate(promo.createdAt, now);
        return label ? <TableText>{label}</TableText> : <TableEmptyCell>Sin fecha</TableEmptyCell>;
      },
    },
    {
      id: "actions",
      header: "Acciones",
      headerHidden: true,
      align: "end",
      width: "w-[64px]",
      cell: (promo) => (
        <TableRowActions actions={rowActions(promo, handlers)} label={`Acciones de «${promo.title}»`} />
      ),
    },
  ];
}
