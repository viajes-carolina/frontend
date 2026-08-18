"use client";

import React from "react";
import Image from "next/image";
import { PromotionDTO } from "@vc/api-client";
import { useAdminPromotions } from "../../hooks/useAdminPromotions";
import { Button, PlusIcon, EditIcon, TrashIcon, CheckIcon, ImageIcon, MapPinIcon } from "@vc/ui";
import { PromotionFormModal } from "./PromotionFormModal";

export interface PromotionListProps {
  initialPromotions: PromotionDTO[];
}

export function PromotionList({ initialPromotions }: PromotionListProps) {
  const {
    promotions,
    isModalOpen,
    setIsModalOpen,
    editingPromotion,
    statusMessage,
    slug, setSlug,
    title, setTitle,
    destination, setDestination,
    summary, setSummary,
    priceUsd, setPriceUsd,
    pricePen, setPricePen,
    durationDays, setDurationDays,
    durationNights, setDurationNights,
    departureCity, setDepartureCity,
    validFrom, setValidFrom,
    validUntil, setValidUntil,
    featuredMediaId, featuredMediaUrl,
    isFeatured, setIsFeatured,
    inclusionsInput, setInclusionsInput,
    exclusionsInput, setExclusionsInput,
    whatsappTemplate, setWhatsappTemplate,
    displayOrder, setDisplayOrder,
    active, setActive,
    isMediaPickerOpen, setIsMediaPickerOpen,
    openCreateModal,
    openEditModal,
    handleSelectMedia,
    handleSave,
    handleDelete,
  } = useAdminPromotions(initialPromotions);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Notifications */}
      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
          <CheckIcon size={20} className="text-emerald-600 shrink-0" />
          <span className="font-medium text-sm">{statusMessage}</span>
        </div>
      )}

      {/* Top Bar Action */}
      <div className="flex items-center justify-between">
        <div>
          <span className="font-inter text-xs font-semibold text-neutral-muted uppercase tracking-wider">
            Total Paquetes: {promotions.length} ofertas
          </span>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<PlusIcon size={18} />}
          onClick={openCreateModal}
        >
          Nueva Promoción
        </Button>
      </div>

      {/* Promotions Table */}
      <div className="bg-white rounded-3xl border border-neutral-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-border bg-neutral-surface/50 text-[11px] font-sora font-bold text-neutral-muted uppercase tracking-wider">
                <th className="py-4 px-6">Foto</th>
                <th className="py-4 px-6">Paquete & Destino</th>
                <th className="py-4 px-6">Duración</th>
                <th className="py-4 px-6">Precio (USD / PEN)</th>
                <th className="py-4 px-6">Destacado</th>
                <th className="py-4 px-6">Estado</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-border">
              {promotions.map((item) => (
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
                    <span className="font-sora font-bold text-sm text-brand-navy block line-clamp-1">
                      {item.title}
                    </span>
                    <span className="font-inter text-xs text-brand-accent flex items-center gap-1 mt-0.5">
                      <MapPinIcon size={12} />
                      {item.destination}
                    </span>
                    <span className="font-mono text-[10px] text-neutral-muted">
                      /{item.slug}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-inter text-xs text-brand-navy">
                    {item.durationDays}D / {item.durationNights}N
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-sora font-bold text-sm text-brand-navy block">
                      USD {Number(item.priceUsd).toLocaleString()}
                    </span>
                    {item.pricePen && (
                      <span className="font-inter text-[11px] text-brand-sunset font-medium">
                        S/ {Number(item.pricePen).toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {item.isFeatured ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
                        ★ Portada
                      </span>
                    ) : (
                      <span className="font-inter text-xs text-neutral-muted">No</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.active
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-neutral-surface text-neutral-muted border border-neutral-border"
                      }`}
                    >
                      {item.active ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<EditIcon size={14} />}
                        onClick={() => openEditModal(item)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={<TrashIcon size={14} />}
                        onClick={() => handleDelete(item.id)}
                      >
                        Desactivar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <PromotionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        isEditing={!!editingPromotion}
        slug={slug}
        setSlug={setSlug}
        title={title}
        setTitle={setTitle}
        destination={destination}
        setDestination={setDestination}
        summary={summary}
        setSummary={setSummary}
        priceUsd={priceUsd}
        setPriceUsd={setPriceUsd}
        pricePen={pricePen}
        setPricePen={setPricePen}
        durationDays={durationDays}
        setDurationDays={setDurationDays}
        durationNights={durationNights}
        setDurationNights={setDurationNights}
        departureCity={departureCity}
        setDepartureCity={setDepartureCity}
        validFrom={validFrom}
        setValidFrom={setValidFrom}
        validUntil={validUntil}
        setValidUntil={setValidUntil}
        featuredMediaId={featuredMediaId}
        featuredMediaUrl={featuredMediaUrl}
        isFeatured={isFeatured}
        setIsFeatured={setIsFeatured}
        inclusionsInput={inclusionsInput}
        setInclusionsInput={setInclusionsInput}
        exclusionsInput={exclusionsInput}
        setExclusionsInput={setExclusionsInput}
        whatsappTemplate={whatsappTemplate}
        setWhatsappTemplate={setWhatsappTemplate}
        displayOrder={displayOrder}
        setDisplayOrder={setDisplayOrder}
        active={active}
        setActive={setActive}
        isMediaPickerOpen={isMediaPickerOpen}
        setIsMediaPickerOpen={setIsMediaPickerOpen}
        onSelectMedia={handleSelectMedia}
      />
    </div>
  );
}
