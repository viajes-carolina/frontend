"use client";

import { useState, useEffect, useCallback } from "react";
import { MediaAssetDTO, UpdateMediaFocalPointRequest, apiClient } from "@vc/api-client";

export function useAdminMedia() {
  const [items, setItems] = useState<MediaAssetDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [size] = useState(24);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaAssetDTO | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.getMediaList(page, size);
      setItems(res.items || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error("Error cargando biblioteca de medios:", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleUpload = async (file: File, altText?: string, caption?: string) => {
    setIsUploading(true);
    setStatusMessage(null);
    try {
      const saved = await apiClient.uploadMedia(file, altText, caption);
      setItems((prev) => [saved, ...prev]);
      setTotal((prev) => prev + 1);
      setStatusMessage("Imagen subida y procesada correctamente.");
      setIsUploadModalOpen(false);
    } catch (err) {
      setStatusMessage("Error al subir la imagen. Verifica el formato WebP/PNG/JPG.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateFocalPoint = async (id: number, payload: UpdateMediaFocalPointRequest) => {
    try {
      const updated = await apiClient.updateMediaFocalPoint(id, payload);
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      if (selectedMedia?.id === id) setSelectedMedia(updated);
      setStatusMessage("Punto focal guardado correctamente.");
    } catch (err) {
      console.error(err);
      setStatusMessage("Error al guardar punto focal.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta imagen de la biblioteca?")) return;
    try {
      await apiClient.deleteMedia(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      setIsDetailModalOpen(false);
      setSelectedMedia(null);
      setStatusMessage("Imagen eliminada de la biblioteca.");
    } catch (err) {
      console.error(err);
      setStatusMessage("Error al eliminar la imagen.");
    }
  };

  const openDetail = (media: MediaAssetDTO) => {
    setSelectedMedia(media);
    setIsDetailModalOpen(true);
  };

  const closeDetail = () => {
    setSelectedMedia(null);
    setIsDetailModalOpen(false);
  };

  return {
    items,
    total,
    page,
    setPage,
    isLoading,
    isUploading,
    selectedMedia,
    isUploadModalOpen,
    setIsUploadModalOpen,
    isDetailModalOpen,
    statusMessage,
    setStatusMessage,
    handleUpload,
    handleUpdateFocalPoint,
    handleDelete,
    openDetail,
    closeDetail,
    refresh: fetchMedia,
  };
}
