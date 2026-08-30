"use client";

import React from "react";
import type { PromotionDTO } from "@vc/api-client";
import { ArrowUpRightIcon, Button, FormFeedback, PlusIcon, StarIcon, TrashIcon } from "@vc/ui";
import { MediaThumb } from "../../../components/MediaThumb";
import { useAdminPromotionsCatalog } from "../../../hooks/useAdminPromotionsCatalog";
import { CreatePromotionModal } from "./CreatePromotionModal";

export interface PromotionsCatalogPanelProps {
  initialPromotions: PromotionDTO[];
}

export function PromotionsCatalogPanel({ initialPromotions }: PromotionsCatalogPanelProps) {
  const {
    promotions,
    feedback,
    topThreeIds,
    canHide,
    handleToggleActive,
    handleDelete,
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
    isSaving,
    title,
    setTitle,
    destination,
    setDestination,
    departureCity,
    setDepartureCity,
    priceUsd,
    setPriceUsd,
    pricePen,
    setPricePen,
    durationDays,
    setDurationDays,
    durationNights,
    setDurationNights,
    validFrom,
    setValidFrom,
    validUntil,
    setValidUntil,
    summary,
    setSummary,
    inclusionsInput,
    setInclusionsInput,
    exclusionsInput,
    setExclusionsInput,
    whatsappTemplate,
    setWhatsappTemplate,
    featuredMediaId,
    featuredMediaUrl,
    featuredMediaFocalX,
    featuredMediaFocalY,
    handleSelectFeaturedMedia,
    handleCreate,
  } = useAdminPromotionsCatalog(initialPromotions);

  return (
    <div className="font-inter">
      <FormFeedback feedback={feedback} />

      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-inter text-[18px] font-bold leading-tight text-neutral-ink">
              Catálogo de Promociones
            </h2>
            <p className="mt-1.5 font-inter text-[13px] text-neutral-muted">
              {promotions.length} promociones en catálogo · elige cuáles mostrar u ocultar en Inicio.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={<PlusIcon size={16} />}
            iconPosition="left"
            onClick={openCreateModal}
          >
            Nueva Promoción
          </Button>
        </div>

        <div className="overflow-hidden rounded-[12px] border border-neutral-border bg-white shadow-[0_8px_24px_rgba(17,34,48,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-admin-divider bg-neutral-soft text-[11px] font-bold uppercase tracking-[0.55px] text-admin-label">
                  <th className="px-6 py-4">Foto</th>
                  <th className="px-6 py-4">Título</th>
                  <th className="px-6 py-4">Fuente</th>
                  <th className="px-6 py-4">Portada</th>
                  <th className="px-6 py-4">Publicado en Facebook</th>
                  <th className="px-6 py-4 text-right">Mostrar / Ocultar</th>
                  <th className="px-6 py-4 text-right">Borrar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-divider">
                {promotions.map((item) => {
                  const willHide = item.active;
                  const disabled = willHide && !canHide(item);
                  const toggleTitle = disabled
                    ? "No se puede ocultar: el Home necesita al menos 3 promociones activas."
                    : willHide
                      ? "Ocultar esta promoción del Home"
                      : "Mostrar esta promoción en el Home";

                  return (
                    <tr key={item.id} className="transition-colors hover:bg-neutral-soft">
                      <td className="px-6 py-4">
                        <MediaThumb
                          url={item.featuredMediaUrl}
                          alt={item.title}
                          sizes="64px"
                          iconSize={16}
                          className="aspect-video w-16 rounded-[6px] border border-neutral-border"
                        />
                      </td>
                      <td className="max-w-xs px-6 py-4">
                        <span className="line-clamp-2 block text-sm font-bold text-admin-value">
                          {item.title}
                        </span>
                        <span className="font-mono text-[10px] text-neutral-muted">/{item.slug}</span>
                      </td>
                      <td className="px-6 py-4">
                        {item.source === "FACEBOOK" ? (
                          <span className="inline-flex items-center rounded-[6px] border border-brand-blue/25 bg-brand-blue/10 px-2 py-0.5 text-xs font-semibold text-brand-blue">
                            Facebook
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-[6px] border border-neutral-border bg-neutral-soft px-2 py-0.5 text-xs font-semibold text-neutral-muted">
                            Manual
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {topThreeIds.has(item.id) ? (
                          <span className="inline-flex items-center gap-1 rounded-[6px] border border-brand-accent/30 bg-brand-accent/10 px-2 py-0.5 text-xs font-semibold text-brand-accent">
                            <StarIcon size={12} aria-hidden="true" />
                            En portada ahora
                          </span>
                        ) : (
                          <span className="text-xs text-neutral-muted">
                            {item.active ? "Activa" : "Oculta"}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {item.facebookPermalinkUrl ? (
                          <a
                            href={item.facebookPermalinkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-navy hover:underline"
                          >
                            Ver post
                            <ArrowUpRightIcon size={12} aria-hidden="true" />
                          </a>
                        ) : (
                          <span className="text-xs text-neutral-muted">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <span className="text-xs text-neutral-muted">
                            {item.active ? "Visible" : "Oculta"}
                          </span>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={item.active}
                            aria-label={`${item.active ? "Ocultar" : "Mostrar"} "${item.title}" en Inicio`}
                            title={toggleTitle}
                            disabled={disabled}
                            onClick={() => handleToggleActive(item)}
                            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                              item.active ? "bg-brand-accent" : "bg-admin-checkbox"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                item.active ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          aria-label={`Borrar "${item.title}" definitivamente`}
                          title={
                            item.active && !canHide(item)
                              ? "No se puede borrar: el Home necesita al menos 3 promociones activas."
                              : "Borrar esta promoción definitivamente"
                          }
                          disabled={item.active && !canHide(item)}
                          onClick={() => handleDelete(item)}
                          className="rounded-[6px] p-2 text-brand-accent transition-colors hover:bg-brand-accent/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                        >
                          <TrashIcon size={16} aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CreatePromotionModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSubmit={handleCreate}
        isSaving={isSaving}
        title={title}
        setTitle={setTitle}
        destination={destination}
        setDestination={setDestination}
        departureCity={departureCity}
        setDepartureCity={setDepartureCity}
        priceUsd={priceUsd}
        setPriceUsd={setPriceUsd}
        pricePen={pricePen}
        setPricePen={setPricePen}
        durationDays={durationDays}
        setDurationDays={setDurationDays}
        durationNights={durationNights}
        setDurationNights={setDurationNights}
        validFrom={validFrom}
        setValidFrom={setValidFrom}
        validUntil={validUntil}
        setValidUntil={setValidUntil}
        summary={summary}
        setSummary={setSummary}
        inclusionsInput={inclusionsInput}
        setInclusionsInput={setInclusionsInput}
        exclusionsInput={exclusionsInput}
        setExclusionsInput={setExclusionsInput}
        whatsappTemplate={whatsappTemplate}
        setWhatsappTemplate={setWhatsappTemplate}
        featuredMediaId={featuredMediaId}
        featuredMediaUrl={featuredMediaUrl}
        featuredMediaFocalX={featuredMediaFocalX}
        featuredMediaFocalY={featuredMediaFocalY}
        onSelectFeaturedMedia={handleSelectFeaturedMedia}
      />
    </div>
  );
}
