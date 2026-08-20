"use client";

import React from "react";
import Image from "next/image";
import { TravelIntentionDTO } from "@vc/api-client";
import { useAdminIntentions } from "../../hooks/useAdminIntentions";
import { useMediaPicker } from "../../hooks/useMediaPicker";
import { Button, PlusIcon, EditIcon, TrashIcon, CheckIcon, ImageIcon } from "@vc/ui";
import { IntentionFormModal } from "./IntentionFormModal";

export interface IntentionListProps {
  initialIntentions: TravelIntentionDTO[];
}

export function IntentionList({ initialIntentions }: IntentionListProps) {
  const {
    intentions,
    isModalOpen,
    setIsModalOpen,
    editingIntention,
    statusMessage,
    slug, setSlug,
    title, setTitle,
    tagline, setTagline,
    iconName, setIconName,
    destinationsInput, setDestinationsInput,
    whatsappTemplate, setWhatsappTemplate,
    coverMediaId, coverMediaUrl,
    displayOrder, setDisplayOrder,
    active, setActive,
    isMediaPickerOpen, setIsMediaPickerOpen,
    openCreateModal,
    openEditModal,
    handleSelectMedia,
    handleSave,
    handleDelete,
  } = useAdminIntentions(initialIntentions);

  const mediaPicker = useMediaPicker(isMediaPickerOpen);

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
            Total Registradas: {intentions.length} intenciones
          </span>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<PlusIcon size={18} />}
          onClick={openCreateModal}
        >
          Nueva Intención de Viaje
        </Button>
      </div>

      {/* Intentions Table */}
      <div className="bg-white rounded-3xl border border-neutral-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-border bg-neutral-surface/50 text-[11px] font-sora font-bold text-neutral-muted uppercase tracking-wider">
                <th className="py-4 px-6">Orden</th>
                <th className="py-4 px-6">Portada</th>
                <th className="py-4 px-6">Intención & Tagline</th>
                <th className="py-4 px-6">Destinos</th>
                <th className="py-4 px-6">Estado</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-border">
              {intentions.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-surface/30 transition-colors">
                  <td className="py-4 px-6 font-sora font-bold text-sm text-brand-navy">
                    #{item.displayOrder}
                  </td>
                  <td className="py-4 px-6">
                    <div className="relative w-16 aspect-video rounded-lg bg-neutral-surface border border-neutral-border overflow-hidden">
                      {item.coverMediaUrl ? (
                        <Image
                          src={item.coverMediaUrl.startsWith("http") || item.coverMediaUrl.startsWith("/") ? item.coverMediaUrl : `/${item.coverMediaUrl}`}
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
                    <span className="font-sora font-bold text-sm text-brand-navy block">
                      {item.title}
                    </span>
                    <span className="font-inter text-xs text-neutral-muted line-clamp-1">
                      {item.tagline}
                    </span>
                    <span className="font-mono text-[10px] text-brand-accent">
                      /{item.slug}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {(item.featuredDestinations || []).slice(0, 3).map((d, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-neutral-surface text-brand-navy font-inter text-[11px]"
                        >
                          {d}
                        </span>
                      ))}
                      {(item.featuredDestinations || []).length > 3 && (
                        <span className="px-2 py-0.5 rounded-md bg-neutral-surface text-neutral-muted font-inter text-[11px]">
                          +{(item.featuredDestinations || []).length - 3}
                        </span>
                      )}
                    </div>
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
      <IntentionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        isEditing={!!editingIntention}
        slug={slug}
        setSlug={setSlug}
        title={title}
        setTitle={setTitle}
        tagline={tagline}
        setTagline={setTagline}
        iconName={iconName}
        setIconName={setIconName}
        destinationsInput={destinationsInput}
        setDestinationsInput={setDestinationsInput}
        whatsappTemplate={whatsappTemplate}
        setWhatsappTemplate={setWhatsappTemplate}
        coverMediaId={coverMediaId}
        coverMediaUrl={coverMediaUrl}
        displayOrder={displayOrder}
        setDisplayOrder={setDisplayOrder}
        active={active}
        setActive={setActive}
        isMediaPickerOpen={isMediaPickerOpen}
        setIsMediaPickerOpen={setIsMediaPickerOpen}
        onSelectMedia={handleSelectMedia}
        mediaPickerItems={mediaPicker.items}
        mediaPickerLoading={mediaPicker.loading}
        onUploadMediaFile={mediaPicker.uploadFile}
        onMediaFocalPointSave={mediaPicker.saveFocalPoint}
      />
    </div>
  );
}
