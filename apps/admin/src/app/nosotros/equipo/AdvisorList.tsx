"use client";

import React from "react";
import type { TravelAdvisorDTO } from "@vc/api-client";
import {
  Button,
  EmptyState,
  FormFeedback,
  PlusIcon,
  RetryableError,
  Skeleton,
  UsersIcon,
  type FormFeedbackState,
} from "@vc/ui";
import { AdvisorCard } from "./AdvisorCard";
import type { AdvisorCardModel } from "./advisorTeamModel";

export interface AdvisorListProps {
  cards: AdvisorCardModel[];
  /** "3 asesoras · 2 visibles en la página pública". */
  summaryLabel: string;
  loading: boolean;
  loadError: boolean;
  feedback: FormFeedbackState | null;
  /** Escritura en curso desde la lista: bloquea visibilidad y orden en todas las tarjetas. */
  busy: boolean;
  onCreate: () => void;
  onEdit: (advisor: TravelAdvisorDTO) => void;
  /**
   * Recibe la asesora completa, no su `id`: la confirmación de borrado tiene
   * que nombrar a quién se va a eliminar.
   */
  onDelete: (advisor: TravelAdvisorDTO) => void;
  onToggleActive: (advisor: TravelAdvisorDTO, active: boolean) => void;
  onMove: (advisor: TravelAdvisorDTO, direction: -1 | 1) => void;
  onRetry: () => void;
}

/* El esqueleto imita la caja real de `AdvisorCard` (radio 10px, borde y alto
   aproximado de una ficha con foto de 88px) para que no haya salto de layout al
   llegar los datos. Se compone con el átomo `Skeleton` del kit en vez de con
   `CardsGridSkeleton`, que dibuja una rejilla de 3 columnas: aquí las fichas
   son filas de ancho completo. El anuncio a lectores de pantalla va una sola
   vez, como en los esqueletos del kit. */
function AdvisorListSkeleton() {
  return (
    <>
      <span className="sr-only" role="status" aria-live="polite">
        Cargando…
      </span>
      <div className="space-y-4">
        {[0, 1, 2].map((index) => (
          <Skeleton key={index} className="h-[212px] w-full rounded-[10px]" />
        ))}
      </div>
    </>
  );
}

/**
 * Columna derecha de la pantalla: cabecera con contexto, alta de asesoras y la
 * pila de fichas del equipo. Solo decide QUÉ estado de la región se pinta
 * (cargando / error / vacío / lista); el contenido de cada ficha lo resuelve
 * `AdvisorCard` sobre el modelo ya calculado en `advisorTeamModel`.
 */
export function AdvisorList({
  cards,
  summaryLabel,
  loading,
  loadError,
  feedback,
  busy,
  onCreate,
  onEdit,
  onDelete,
  onToggleActive,
  onMove,
  onRetry,
}: AdvisorListProps) {
  return (
    <section className="min-w-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-inter text-[18px] font-bold leading-tight text-admin-heading">
            Equipo de asesoras
          </h2>
          <p className="mt-1.5 font-inter text-[11px] leading-[1.6] text-neutral-quiet-ink">
            {summaryLabel}
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={onCreate}
          icon={<PlusIcon size={16} aria-hidden="true" />}
          iconPosition="left"
        >
          Nueva asesora
        </Button>
      </div>

      {/* Fuera del `space-y-*`: la región live de `FormFeedback` sigue en el
          DOM aunque esté vacía y correría un margen muerto. */}
      <div className="mt-5">
        <FormFeedback feedback={feedback} />

        {loading ? (
          <AdvisorListSkeleton />
        ) : loadError ? (
          <RetryableError
            message="No se pudo cargar el equipo de asesoras. Los perfiles guardados siguen intactos."
            onRetry={onRetry}
          />
        ) : cards.length === 0 ? (
          <EmptyState
            title="Aún no hay asesoras en el equipo"
            message="Crea el primer perfil para que el equipo aparezca en la página Nosotros."
            icon={<UsersIcon size={28} aria-hidden="true" />}
            action={{
              label: "Nueva asesora",
              onClick: onCreate,
              icon: <PlusIcon size={16} aria-hidden="true" />,
            }}
            className="rounded-[10px] border border-neutral-border bg-white"
          />
        ) : (
          <div className="space-y-4">
            {cards.map((card) => (
              <AdvisorCard
                key={card.advisor.id}
                model={card}
                busy={busy}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleActive={onToggleActive}
                onMove={onMove}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
