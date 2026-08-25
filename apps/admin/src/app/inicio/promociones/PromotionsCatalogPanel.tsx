"use client";

import React from "react";
import Image from "next/image";
import { PromotionDTO } from "@vc/api-client";
import { Button, CheckIcon, ImageIcon, TrashIcon } from "@vc/ui";
import { useAdminPromotionsCatalog } from "../../../hooks/useAdminPromotionsCatalog";
import { CreatePromotionModal } from "./CreatePromotionModal";

export interface PromotionsCatalogPanelProps {
  initialPromotions: PromotionDTO[];
}

export function PromotionsCatalogPanel({ initialPromotions }: PromotionsCatalogPanelProps) {
  const {
    promotions,
    statusMessage,
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
    <div className="space-y-6">
      {/* Notifications */}
      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
          <CheckIcon size={20} className="text-emerald-600 shrink-0" />
          <span className="font-medium text-sm">{statusMessage}</span>
        </div>
      )}

      {/* Header + Create Action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-navy">Catálogo de Promociones</h2>
          <p className="font-inter text-xs text-neutral-muted mt-1">
            {promotions.length} promociones en catálogo · elige cuáles mostrar u ocultar en Inicio.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreateModal}>
          + Nueva Promoción
        </Button>
      </div>

      {/* Promotions Table */}
      <div className="bg-white rounded-3xl border border-neutral-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-border bg-neutral-surface/50 text-[11px] font-sora font-bold text-neutral-muted uppercase tracking-wider">
                <th className="py-4 px-6">Foto</th>
                <th className="py-4 px-6">Título</th>
                <th className="py-4 px-6">Fuente</th>
                <th className="py-4 px-6">Portada</th>
                <th className="py-4 px-6">Publicado en Facebook</th>
                <th className="py-4 px-6 text-right">Mostrar / Ocultar</th>
                <th className="py-4 px-6 text-right">Borrar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-border">
              {promotions.map((item) => {
                const willHide = item.active;
                const disabled = willHide && !canHide(item);
                const toggleTitle = disabled
                  ? "No se puede ocultar: el Home necesita al menos 3 promociones activas."
                  : willHide
                  ? "Ocultar esta promoción del Home"
                  : "Mostrar esta promoción en el Home";

                return (
                  <tr key={item.id} className="hover:bg-neutral-surface/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="relative w-16 aspect-video rounded-lg bg-neutral-surface border border-neutral-border overflow-hidden">
                        {item.featuredMediaUrl ? (
                          <Image
                            src={item.featuredMediaUrl.startsWith("http") || item.featuredMediaUrl.startsWith("/") ? item.featuredMediaUrl : `/${item.featuredMediaUrl}`}
                            alt={item.title}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-muted">
                            <ImageIcon size={16} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <span className="font-sora font-bold text-sm text-brand-navy block line-clamp-2">
                        {item.title}
                      </span>
                      <span className="font-mono text-[10px] text-neutral-muted">/{item.slug}</span>
                    </td>
                    <td className="py-4 px-6">
                      {item.source === "FACEBOOK" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                          📘 Facebook
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-neutral-surface text-neutral-muted border border-neutral-border text-xs font-semibold">
                          Manual
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {topThreeIds.has(item.id) ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
                          ★ En portada ahora
                        </span>
                      ) : (
                        <span className="font-inter text-xs text-neutral-muted">
                          {item.active ? "Activa" : "Oculta"}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {item.facebookPermalinkUrl ? (
                        <a
                          href={item.facebookPermalinkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline"
                        >
                          ✅ Ver post ↗
                        </a>
                      ) : (
                        <span className="font-inter text-xs text-neutral-muted">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-3">
                        <span className="font-inter text-xs text-neutral-muted">
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
                            item.active ? "bg-emerald-500" : "bg-neutral-border"
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
                    <td className="py-4 px-6 text-right">
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
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
