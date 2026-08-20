"use client";

import React from "react";
import Image from "next/image";
import { useAdminMedia } from "../../hooks/useAdminMedia";
import { Button, CheckIcon, ImageIcon } from "@vc/ui";
import { MediaUploadModal } from "./MediaUploadModal";
import { MediaDetailModal } from "./MediaDetailModal";

export function MediaGallery() {
  const {
    items,
    total,
    isLoading,
    isUploading,
    selectedMedia,
    isUploadModalOpen,
    setIsUploadModalOpen,
    isDetailModalOpen,
    statusMessage,
    handleUpload,
    handleUpdateFocalPoint,
    handleDelete,
    openDetail,
    closeDetail,
  } = useAdminMedia();

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Notifications */}
      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
          <CheckIcon size={20} className="text-emerald-600 shrink-0" />
          <span className="font-medium text-sm">{statusMessage}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sora font-bold text-lg text-brand-navy">
            Biblioteca de Medios & Activos
          </h2>
          <p className="font-inter text-xs text-neutral-muted mt-0.5">
            {total} activos registrados • Optimización automática WebP y control de punto focal
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsUploadModalOpen(true)}
        >
          ➕ Subir Nueva Imagen
        </Button>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="aspect-video rounded-2xl bg-neutral-surface animate-pulse border border-neutral-border"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-neutral-border text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent mx-auto">
            <ImageIcon size={32} />
          </div>
          <h3 className="font-sora font-bold text-lg text-brand-navy">
            No hay imágenes en la biblioteca
          </h3>
          <p className="font-inter text-sm text-neutral-muted max-w-md mx-auto">
            Sube fotografías de destinos, banners de promociones o recursos de marca con soporte de punto focal inteligente.
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsUploadModalOpen(true)}
          >
            Subir la Primera Imagen
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => {
            const safeUrl = item.storagePath.startsWith("http") || item.storagePath.startsWith("/")
              ? item.storagePath
              : `/${item.storagePath}`;

            const formattedSize =
              item.fileSizeBytes > 1024 * 1024
                ? `${(item.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB`
                : `${(item.fileSizeBytes / 1024).toFixed(0)} KB`;

            return (
              <div
                key={item.id}
                onClick={() => openDetail(item)}
                className="group bg-white rounded-2xl border border-neutral-border hover:border-brand-accent hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
              >
                {/* Image Container with Focal Position Preview */}
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-surface">
                  <Image
                    src={safeUrl}
                    alt={item.altText || item.originalName}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    style={{
                      objectFit: "cover",
                      objectPosition: `${item.focalX}% ${item.focalY}%`,
                    }}
                    className="transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Focal point badge */}
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[10px] font-mono text-white">
                    🎯 {item.focalX}% , {item.focalY}%
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h4 className="font-sora font-bold text-xs text-brand-navy truncate group-hover:text-brand-accent transition-colors">
                      {item.originalName}
                    </h4>
                    <p className="font-inter text-[11px] text-neutral-muted mt-0.5">
                      {item.width} × {item.height} px • {formattedSize}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-neutral-border flex justify-between items-center text-[11px] font-inter text-neutral-muted">
                    <span className="truncate max-w-[120px]">{item.altText || "Sin alt text"}</span>
                    <span className="text-brand-accent font-semibold">Editar ✏️</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      <MediaUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
        isUploading={isUploading}
      />

      {/* Detail / Focal Point Modal */}
      <MediaDetailModal
        isOpen={isDetailModalOpen}
        onClose={closeDetail}
        media={selectedMedia}
        onUpdateFocalPoint={handleUpdateFocalPoint}
        onDelete={handleDelete}
      />
    </div>
  );
}
