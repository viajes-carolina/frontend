"use client";

import React from "react";
import type { TravelAdvisorDTO } from "@vc/api-client";
import { Badge, Button, ChevronDownIcon, Toggle } from "@vc/ui";
import { MediaThumb } from "../../../components/MediaThumb";
import type { AdvisorCardModel } from "./advisorTeamModel";

export interface AdvisorCardProps {
  model: AdvisorCardModel;
  /** Hay una escritura en curso en la lista: los controles directos se bloquean. */
  busy: boolean;
  onEdit: (advisor: TravelAdvisorDTO) => void;
  onDelete: (advisor: TravelAdvisorDTO) => void;
  onToggleActive: (advisor: TravelAdvisorDTO, active: boolean) => void;
  onMove: (advisor: TravelAdvisorDTO, direction: -1 | 1) => void;
}

const SECTION_LABEL = "font-inter text-[9px] font-bold uppercase tracking-[0.45px] text-admin-label";

/**
 * Ficha de una asesora del equipo.
 *
 * El switch de visibilidad y las flechas de orden NO son decorativos: escriben
 * contra el mismo `PUT /admin/v1/advisors/{id}` que usa el modal (ver
 * `useAdminAdvisors`). La píldora de al lado no duplica al switch: dice el
 * estado con TEXTO — "Selección, visibilidad y estado sin depender únicamente
 * del color" —, mientras que el switch es el control que lo cambia.
 */
export function AdvisorCard({ model, busy, onEdit, onDelete, onToggleActive, onMove }: AdvisorCardProps) {
  const { advisor } = model;

  return (
    <article className="rounded-[10px] border border-neutral-border bg-white p-5 font-inter">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <MediaThumb
              url={advisor.photoMediaUrl}
              alt={`Foto de ${advisor.fullName}`}
              sizes="88px"
              className="h-[88px] w-[88px] shrink-0 rounded-full border border-divider-soft"
              empty={
                <span className="font-inter text-[20px] font-bold text-neutral-quiet-ink">
                  {model.initials}
                </span>
              }
            />
            <div className="min-w-0">
              <h3 className="truncate font-inter text-[18px] font-bold leading-tight text-admin-heading">
                {advisor.fullName}
              </h3>
              <p className="mt-1 font-inter text-[12px] font-semibold text-brand-accent">
                {advisor.roleTitle}
              </p>
              <p className="mt-1 font-inter text-[11px] leading-[1.5] text-neutral-quiet-ink">
                {advisor.specialty}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
            <div className="flex items-center gap-2">
              <Toggle
                checked={advisor.active}
                onChange={(active) => onToggleActive(advisor, active)}
                disabled={busy}
                aria-label={model.visibilityActionLabel}
              />
              <Badge
                tone={model.visibilityTone}
                icon={<span className="block h-[5px] w-[5px] rounded-full bg-current" />}
              >
                {model.visibilityLabel}
              </Badge>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-inter text-[10px] text-neutral-quiet-ink">{model.positionLabel}</span>
              {/* Con una sola asesora no hay orden que cambiar: las flechas no
                  se dibujan apagadas para siempre, desaparecen. Con dos o más,
                  las de los extremos SÍ se muestran deshabilitadas — ahí el
                  bloqueo informa de dónde termina la lista. */}
              {(model.canMoveUp || model.canMoveDown) && (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    size="xs"
                    disabled={busy || !model.canMoveUp}
                    onClick={() => onMove(advisor, -1)}
                    icon={<ChevronDownIcon size={14} className="rotate-180" aria-hidden="true" />}
                    iconPosition="left"
                  >
                    <span className="sr-only">{model.moveUpLabel}</span>
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="xs"
                    disabled={busy || !model.canMoveDown}
                    onClick={() => onMove(advisor, 1)}
                    icon={<ChevronDownIcon size={14} aria-hidden="true" />}
                    iconPosition="left"
                  >
                    <span className="sr-only">{model.moveDownLabel}</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="h-px bg-divider-soft" />

        <div className="grid gap-5 sm:grid-cols-[430fr_238fr]">
          <div className="min-w-0 space-y-2">
            <p className={SECTION_LABEL}>Biografía</p>
            <p className="font-inter text-[11px] leading-[1.6] text-admin-value">{advisor.bio}</p>
            {model.quoteLabel && (
              <p className="font-inter text-[10px] leading-[1.6] text-neutral-quiet-ink">
                {model.quoteLabel}
              </p>
            )}
          </div>

          <div className="min-w-0 space-y-2">
            <p className={SECTION_LABEL}>Canal directo</p>
            {model.phoneLabel ? (
              <p className="font-inter text-[12px] font-semibold text-state-published">
                {model.phoneLabel}
              </p>
            ) : (
              <p className="font-inter text-[11px] text-neutral-quiet-ink">Sin WhatsApp asignado</p>
            )}
            {model.updatedAtLabel && (
              <p className="font-inter text-[10px] text-neutral-quiet-ink">{model.updatedAtLabel}</p>
            )}

            <div className="flex flex-wrap gap-2 pt-1">
              <Button type="button" variant="secondary" size="sm" onClick={() => onEdit(advisor)}>
                Editar
              </Button>
              <Button type="button" variant="danger" size="sm" onClick={() => onDelete(advisor)}>
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
