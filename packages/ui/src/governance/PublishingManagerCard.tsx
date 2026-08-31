"use client";

import React from "react";
import type { PublishRequestDTO, PublishResponseDTO } from "@vc/api-client";
import { FormCard } from "../forms/FormCard";
import { FormField } from "../forms/FormField";
import { ArrowUpRightIcon, CheckIcon, PlaneIcon } from "../icons/icons";
import { Badge, type BadgeTone } from "../primitives/Badge";
import { FormSkeleton } from "../primitives/Skeleton";
import { usePublishingManager } from "./usePublishingManager";

/**
 * Resultado de la última publicación, en tono semántico y con etiqueta legible.
 * Antes se pintaba el enum crudo (`SUCCESS`, `NEVER_PUBLISHED`) en una única
 * píldora navy, así que una publicación FALLIDA se anunciaba con el mismo color
 * que una correcta.
 */
const PUBLISH_STATUS_BADGES: Record<string, { label: string; tone: BadgeTone }> = {
  SUCCESS: { label: "Publicado", tone: "success" },
  FAILED: { label: "Falló", tone: "danger" },
  NEVER_PUBLISHED: { label: "Nunca publicado", tone: "neutral" },
  UNKNOWN: { label: "Estado desconocido", tone: "neutral" },
};

export interface PublishingManagerCardProps {
  lastPublishStatus: PublishResponseDTO | null;
  onPublish: (req: PublishRequestDTO) => Promise<PublishResponseDTO>;
  loading?: boolean;
  draftUrl: string;
}

export const PublishingManagerCard: React.FC<PublishingManagerCardProps> = ({
  lastPublishStatus,
  onPublish,
  loading = false,
  draftUrl,
}) => {
  const manager = usePublishingManager({ lastPublishStatus, onPublish });
  const statusBadge = manager.publishResult
    ? (PUBLISH_STATUS_BADGES[manager.publishResult.status] ?? {
        label: manager.publishResult.status,
        tone: "neutral" as BadgeTone,
      })
    : null;

  // Solo mostramos el esqueleto mientras se resuelve la carga inicial (aún sin
  // `publishResult`) — si `loading` vuelve a activarse con datos ya cargados
  // (ej. un futuro refresh), no ocultamos el panel ya renderizado.
  if (loading && !manager.publishResult) {
    return <FormSkeleton fields={2} className="max-w-4xl" />;
  }

  return (
    <div className="space-y-6 font-inter">
      {/* Encabezado */}
      <div className="flex max-w-4xl flex-col justify-between gap-4 rounded-[12px] border border-neutral-border bg-white p-6 shadow-[0_8px_24px_rgba(17,34,48,0.06)] sm:flex-row sm:items-center">
        <div>
          {/* El icono sustituye al emoji 🚀 que llevaba antes el `h2`: los
              emojis dependen de la fuente del sistema y los lectores de
              pantalla los leen en voz alta ("cohete"). */}
          <h2 className="flex items-center gap-2 font-inter text-[18px] font-bold leading-tight text-neutral-ink">
            <PlaneIcon size={18} aria-hidden="true" className="shrink-0 text-brand-accent" />
            <span>Publicación On-Demand ISR &amp; Control de Caché</span>
          </h2>
          <p className="mt-1.5 max-w-2xl font-inter text-[13px] leading-[1.55] text-neutral-muted">
            Invalida instantáneamente la caché estática de Next.js App Router mediante webhooks de revalidación
            atómica.
          </p>
        </div>
        <a
          href={draftUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-[7px] border border-neutral-border bg-white px-4 py-2.5 text-xs font-semibold text-brand-navy transition-colors hover:border-admin-checkbox hover:bg-neutral-soft sm:self-auto"
        >
          <span>Modo Borrador (Draft)</span>
          <ArrowUpRightIcon size={14} aria-hidden="true" />
        </a>
      </div>

      <FormCard
        title="1. Selecciona el ámbito de revalidación"
        description="El motivo queda registrado en la bitácora de auditoría junto al operador que dispara la publicación."
        feedback={manager.feedback}
        onSubmit={manager.handleSubmit}
        submitLabel="Publicar cambios en vivo (On-Demand ISR)"
        savingLabel="Revalidando caché en Next.js..."
        saving={manager.submitting}
        submitDisabled={loading}
        footerAside={
          <span className="mr-auto flex items-center gap-2 text-xs text-neutral-muted">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand-accent" />
            <span>Caché estática lista para revalidación tag-based</span>
          </span>
        }
      >
        <fieldset className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <legend className="sr-only">Ámbito de revalidación</legend>
          {manager.targets.map((t) => (
            <label
              key={t.value}
              className={`flex cursor-pointer flex-col justify-between rounded-[10px] border p-4 transition-colors ${
                manager.selectedTarget === t.value
                  ? "border-brand-accent bg-brand-accent/[0.06]"
                  : "border-neutral-border bg-admin-field hover:border-admin-checkbox"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-admin-value">{t.label}</div>
                  <div className="mt-1 text-xs leading-relaxed text-neutral-muted">{t.description}</div>
                </div>
                <input
                  type="radio"
                  name="publishTarget"
                  value={t.value}
                  checked={manager.selectedTarget === t.value}
                  onChange={(e) => manager.setSelectedTarget(e.target.value)}
                  className="mt-1 h-4 w-4 shrink-0 accent-brand-accent"
                />
              </div>
            </label>
          ))}
        </fieldset>

        <FormField
          label="Motivo / nota de publicación (para la bitácora de auditoría)"
          type="text"
          value={manager.reason}
          onChange={(e) => manager.setReason(e.target.value)}
          placeholder="Ej. Actualización de paquetes de temporada de verano y ajustes en portada"
        />
      </FormCard>

      {/* Estado y Resultado de Publicación */}
      {manager.publishResult && (
        <div className="max-w-4xl space-y-4 rounded-[12px] border border-neutral-border bg-white p-6 shadow-[0_8px_24px_rgba(17,34,48,0.06)]">
          <div className="flex items-center justify-between gap-4">
            <h3 className="flex items-center gap-2 font-inter text-[15px] font-bold text-neutral-ink">
              <CheckIcon size={16} aria-hidden="true" className="shrink-0 text-brand-accent" />
              <span>Estado de la última publicación</span>
            </h3>
            {statusBadge && <Badge tone={statusBadge.tone}>{statusBadge.label}</Badge>}
          </div>

          <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-3">
            <div className="rounded-[10px] border border-neutral-border bg-neutral-soft p-3">
              <span className="block text-neutral-muted">Fecha y hora</span>
              <span className="mt-0.5 block font-semibold text-admin-value">
                {manager.publishResult.publishedAt
                  ? new Date(manager.publishResult.publishedAt).toLocaleString("es-PE")
                  : "Nunca publicado"}
              </span>
            </div>
            <div className="rounded-[10px] border border-neutral-border bg-neutral-soft p-3">
              <span className="block text-neutral-muted">Operador / disparador</span>
              <span className="mt-0.5 block font-mono font-semibold text-admin-value">
                {manager.publishResult.triggeredBy ? `@${manager.publishResult.triggeredBy}` : "—"}
              </span>
            </div>
            <div className="rounded-[10px] border border-neutral-border bg-neutral-soft p-3">
              <span className="block text-neutral-muted">Rutas revalidadas</span>
              <span className="mt-0.5 block font-semibold text-admin-value">
                {manager.publishResult.revalidatedTags.length} rutas actualizadas
              </span>
            </div>
          </div>

          <div>
            <span className="mb-1.5 block text-xs text-neutral-muted">Tags y rutas invalidadas:</span>
            <div className="flex flex-wrap gap-1.5">
              {manager.publishResult.revalidatedTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-[6px] border border-neutral-border bg-neutral-soft px-2 py-0.5 font-mono text-[11px] text-admin-label"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <p className="rounded-[10px] border border-admin-divider bg-admin-field p-3 text-xs text-neutral-muted">
            {manager.publishResult.message}
          </p>
        </div>
      )}
    </div>
  );
};
