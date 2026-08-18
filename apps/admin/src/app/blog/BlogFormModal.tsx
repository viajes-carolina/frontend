"use client";

import React, { useState, useEffect } from "react";
import { BlogPostDTO, BlogCategoryDTO, CreateOrUpdateBlogPostRequest, MediaAssetDTO } from "@vc/api-client";
import { MediaPickerModal } from "@vc/ui";

export interface BlogFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (req: CreateOrUpdateBlogPostRequest) => Promise<void>;
  editingPost: BlogPostDTO | null;
  categories: BlogCategoryDTO[];
  saving: boolean;
}

export const BlogFormModal: React.FC<BlogFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPost,
  categories,
  saving,
}) => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState<number>(1);
  const [summary, setSummary] = useState("");
  const [contentMarkdown, setContentMarkdown] = useState("");
  const [authorName, setAuthorName] = useState("Carolina Zúñiga");
  const [readingTimeMinutes, setReadingTimeMinutes] = useState(5);
  const [tagsInput, setTagsInput] = useState("");
  const [coverMediaId, setCoverMediaId] = useState<number | undefined>(undefined);
  const [coverMediaUrl, setCoverMediaUrl] = useState<string>("");
  const [status, setStatus] = useState("PUBLISHED");
  const [isFeatured, setIsFeatured] = useState(false);
  const [active, setActive] = useState(true);

  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title || "");
      setSlug(editingPost.slug || "");
      setCategoryId(editingPost.categoryId || (categories[0]?.id ?? 1));
      setSummary(editingPost.summary || "");
      setContentMarkdown(editingPost.contentMarkdown || "");
      setAuthorName(editingPost.authorName || "Carolina Zúñiga");
      setReadingTimeMinutes(editingPost.readingTimeMinutes || 5);
      setTagsInput(editingPost.tags ? editingPost.tags.join(", ") : "");
      setCoverMediaId(editingPost.coverMediaId);
      setCoverMediaUrl(editingPost.coverMediaUrl || "");
      setStatus(editingPost.status || "PUBLISHED");
      setIsFeatured(editingPost.isFeatured ?? false);
      setActive(editingPost.active ?? true);
    } else {
      setTitle("");
      setSlug("");
      setCategoryId(categories[0]?.id ?? 1);
      setSummary("");
      setContentMarkdown("# Título Principal del Artículo 🌴\n\nEscribe aquí la introducción...\n\n---\n\n## 1. Primer Subtítulo\nDetalles y recomendaciones prácticas...");
      setAuthorName("Carolina Zúñiga");
      setReadingTimeMinutes(5);
      setTagsInput("Destinos, Consejos, Playas");
      setCoverMediaId(undefined);
      setCoverMediaUrl("/media/demo-cartagena-caribe.webp");
      setStatus("PUBLISHED");
      setIsFeatured(false);
      setActive(true);
    }
  }, [editingPost, categories, isOpen]);

  if (!isOpen) return null;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPost) {
      const generatedSlug = val
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
  };

  const handleMediaSelect = (asset: MediaAssetDTO) => {
    setCoverMediaId(asset.id);
    setCoverMediaUrl(asset.storagePath || `/media/${asset.filename}`);
    setIsMediaPickerOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onSave({
      title,
      slug,
      categoryId,
      summary,
      contentMarkdown,
      authorName,
      readingTimeMinutes,
      tags,
      coverMediaId,
      status,
      isFeatured,
      active,
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="px-6 py-5 bg-neutral-900 text-white flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">
                {editingPost ? "Editar Artículo del Blog" : "Nuevo Artículo para el Blog"}
              </h3>
              <p className="text-xs text-neutral-400">
                Redacta y publica guías, consejos o historias para los viajeros.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full text-neutral-400 hover:text-white transition"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Título del Artículo *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Ej. Guía Completa para viajar a Cartagena 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Slug URL (Único) *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="guia-completa-para-viajar-a-cartagena-2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-mono text-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>

            {/* Category & Status & Featured */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Categoría *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Estado de Publicación
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
                >
                  <option value="PUBLISHED">🟢 Publicado</option>
                  <option value="DRAFT">🟡 Borrador</option>
                  <option value="ARCHIVED">⚪ Archivado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Destacado en Portada
                </label>
                <div className="flex items-center gap-3 pt-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-brand-primary"></div>
                  </label>
                  <span className="text-xs font-bold text-neutral-700">
                    {isFeatured ? "⭐ Destacado" : "Normal"}
                  </span>
                </div>
              </div>
            </div>

            {/* Author, Reading Time & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Autor(a)
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Carolina Zúñiga"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Minutos de Lectura
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={readingTimeMinutes}
                  onChange={(e) => setReadingTimeMinutes(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Etiquetas (separadas por coma)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Cartagena, Caribe, Playas"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>

            {/* Cover Image Selector */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Imagen de Portada
              </label>
              <div className="flex items-center gap-4">
                <div className="w-32 h-20 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 shrink-0">
                  {coverMediaUrl ? (
                    <img src={coverMediaUrl} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs font-bold">
                      Sin imagen
                    </div>
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => setIsMediaPickerOpen(true)}
                    className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition shadow-sm"
                  >
                    🖼️ Seleccionar de la Galería
                  </button>
                  {coverMediaId && (
                    <span className="block text-[11px] text-neutral-500 mt-1">
                      ID Activo: #{coverMediaId}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Summary / Lead */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Resumen / Extracto (Lead) *
              </label>
              <textarea
                required
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Breve introducción que atraiga al lector en las tarjetas y redes sociales..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
              />
            </div>

            {/* Markdown Body Editor */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Cuerpo del Artículo (Formato Markdown) *
                </label>
                <span className="text-[11px] text-neutral-400">
                  Soporta # Títulos, ## Subtítulos, &gt; Citas, - Listas y **Negrita**
                </span>
              </div>
              <textarea
                required
                rows={12}
                value={contentMarkdown}
                onChange={(e) => setContentMarkdown(e.target.value)}
                placeholder="# Título del Artículo..."
                className="w-full p-4 rounded-xl border border-neutral-300 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
          </form>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 text-sm font-bold hover:bg-neutral-100 transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving || !title.trim() || !slug.trim()}
              className="px-6 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-bold hover:bg-brand-primary/90 transition shadow-md disabled:opacity-50"
            >
              {saving ? "Guardando..." : editingPost ? "Guardar Cambios" : "Publicar Artículo"}
            </button>
          </div>
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
      />
    </>
  );
};
