"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { BlogPostDTO, BlogCategoryDTO, CreateOrUpdateBlogPostRequest, MediaAssetDTO, TravelAdvisorDTO } from "@vc/api-client";
import { Button, FormField, FormSelect, ImageIcon, MediaPickerModal, Modal, ResponsiveImage, Toggle } from "@vc/ui";
import { HeroPhotoSlot } from "../../components/HeroPhotoSlot";
import { useMediaPicker } from "../../hooks/useMediaPicker";

export interface BlogFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (req: CreateOrUpdateBlogPostRequest) => Promise<void>;
  editingPost: BlogPostDTO | null;
  categories: BlogCategoryDTO[];
  advisors: TravelAdvisorDTO[];
  saving: boolean;
  coverMediaId?: number;
  coverMediaUrl?: string;
  coverFocalX?: number;
  coverFocalY?: number;
  authorAdvisorId?: number;
  setAuthorAdvisorId: React.Dispatch<React.SetStateAction<number | undefined>>;
  handleCoverSelect: (media: MediaAssetDTO) => void;
}

export const BlogFormModal: React.FC<BlogFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPost,
  categories,
  advisors,
  saving,
  coverMediaId,
  coverMediaUrl,
  coverFocalX,
  coverFocalY,
  authorAdvisorId,
  setAuthorAdvisorId,
  handleCoverSelect,
}) => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState<number>(1);
  const [summary, setSummary] = useState("");
  const [contentMarkdown, setContentMarkdown] = useState("");
  const [readingTimeMinutes, setReadingTimeMinutes] = useState(5);
  const [tagsInput, setTagsInput] = useState("");
  const [status, setStatus] = useState("PUBLISHED");
  const [isFeatured, setIsFeatured] = useState(false);
  const [active, setActive] = useState(true);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const picker = useMediaPicker(isImagePickerOpen);

  // El autor del artículo es siempre una asesora real del equipo (lista
  // provista por useAdminBlog.ts, mismo patrón que categories). Memoizado para
  // que el useEffect de preselección más abajo no se dispare en cada render
  // por una referencia de array nueva.
  const activeAdvisors = useMemo(() => advisors.filter((a) => a.active), [advisors]);
  const selectedAdvisor = useMemo(
    () => advisors.find((a) => a.id === authorAdvisorId),
    [advisors, authorAdvisorId]
  );
  // Si el post fue creado con una asesora que luego se desactivó, el <select>
  // debe seguir mostrándola como opción (unión de "activas" + "la actualmente
  // elegida si no está en esa lista") — mismo criterio que el <select> de
  // Categoría, que no filtra por estado.
  const selectableAdvisors = useMemo(() => {
    if (selectedAdvisor && !selectedAdvisor.active) {
      return [...activeAdvisors, selectedAdvisor];
    }
    return activeAdvisors;
  }, [activeAdvisors, selectedAdvisor]);

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title || "");
      setSlug(editingPost.slug || "");
      setCategoryId(editingPost.categoryId || (categories[0]?.id ?? 1));
      setSummary(editingPost.summary || "");
      setContentMarkdown(editingPost.contentMarkdown || "");
      setReadingTimeMinutes(editingPost.readingTimeMinutes || 5);
      setTagsInput(editingPost.tags ? editingPost.tags.join(", ") : "");
      setStatus(editingPost.status || "PUBLISHED");
      setIsFeatured(editingPost.isFeatured ?? false);
      setActive(editingPost.active ?? true);
    } else {
      setTitle("");
      setSlug("");
      setCategoryId(categories[0]?.id ?? 1);
      setSummary("");
      setContentMarkdown("# Título Principal del Artículo 🌴\n\nEscribe aquí la introducción...\n\n---\n\n## 1. Primer Subtítulo\nDetalles y recomendaciones prácticas...");
      setReadingTimeMinutes(5);
      setTagsInput("Destinos, Consejos, Playas");
      setStatus("PUBLISHED");
      setIsFeatured(false);
      setActive(true);
    }
  }, [editingPost, categories, isOpen]);

  // Al crear un artículo nuevo, preselecciona la primera asesora activa en
  // cuanto esté disponible (mismo comportamiento que ya tiene Categoría).
  useEffect(() => {
    if (!editingPost && authorAdvisorId === undefined && activeAdvisors.length > 0) {
      setAuthorAdvisorId(activeAdvisors[0].id);
    }
  }, [editingPost, authorAdvisorId, activeAdvisors, setAuthorAdvisorId]);

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

  const handleInsertImage = (media: MediaAssetDTO) => {
    const url = media.storagePath.startsWith("http") || media.storagePath.startsWith("/")
      ? media.storagePath
      : `/${media.storagePath}`;
    const snippet = `![](${url})`;
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? contentMarkdown.length;
    const end = textarea?.selectionEnd ?? contentMarkdown.length;
    const before = contentMarkdown.slice(0, start);
    const after = contentMarkdown.slice(end);
    const newValue = `${before}${snippet}${after}`;
    setContentMarkdown(newValue);
    setIsImagePickerOpen(false);
    // Reposiciona el cursor dentro de los corchetes [] para que el usuario
    // pueda escribir el alt/caption inmediatamente si quiere.
    requestAnimationFrame(() => {
      if (!textarea) return;
      textarea.focus();
      const cursorPos = start + 2; // después de "!["
      textarea.setSelectionRange(cursorPos, cursorPos);
    });
  };

  // Inserta formato Markdown en la posición del cursor (o envuelve la
  // selección actual) sin exigir que el personal que redacta artículos
  // memorice la sintaxis. Mismo patrón que handleInsertImage: actualiza el
  // estado y reposiciona el cursor/selección con requestAnimationFrame.
  const insertMarkdown = (before: string, after: string = "", placeholder: string = "") => {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? contentMarkdown.length;
    const end = textarea?.selectionEnd ?? contentMarkdown.length;
    const selected = contentMarkdown.slice(start, end);
    const textToInsert = selected || placeholder;
    const newValue = contentMarkdown.slice(0, start) + before + textToInsert + after + contentMarkdown.slice(end);
    setContentMarkdown(newValue);
    requestAnimationFrame(() => {
      if (!textarea) return;
      textarea.focus();
      const selStart = start + before.length;
      textarea.setSelectionRange(selStart, selStart + textToInsert.length);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorAdvisorId) return;

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
      authorAdvisorId,
      readingTimeMinutes,
      tags,
      coverMediaId,
      coverFocalX,
      coverFocalY,
      status,
      isFeatured,
      active,
    });
  };

  return (
    <>
      <Modal
        title={editingPost ? "Editar Artículo del Blog" : "Nuevo Artículo para el Blog"}
        description="Redacta y publica guías, consejos o historias para los viajeros."
        onClose={onClose}
        maxWidth="3xl"
        closeLabel="Cerrar formulario de artículo del blog"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormField
                label="Título del Artículo *"
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ej. Guía Completa para viajar a Cartagena 2026"
              />
            </div>

            <div>
              <FormField
                label="Slug URL (Único) *"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="guia-completa-para-viajar-a-cartagena-2026"
                className="font-mono"
              />
            </div>
          </div>

          {/* Category & Status & Featured & Active */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <FormSelect
                label="Categoría *"
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </FormSelect>
            </div>

            <div>
              <FormSelect
                label="Estado de Publicación"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="PUBLISHED">🟢 Publicado</option>
                <option value="DRAFT">🟡 Borrador</option>
                <option value="ARCHIVED">⚪ Archivado</option>
              </FormSelect>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Destacado en Portada
              </label>
              <div className="flex items-center gap-3 pt-2">
                <Toggle checked={isFeatured} onChange={setIsFeatured} />
                <span className="text-xs font-bold text-neutral-700">
                  {isFeatured ? "⭐ Destacado" : "Normal"}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Publicado en el Sitio
              </label>
              <div className="flex items-center gap-3 pt-2">
                <Toggle checked={active} onChange={setActive} />
                <span className="text-xs font-bold text-neutral-700">
                  {active ? "Publicado" : "Oculto"}
                </span>
              </div>
            </div>
          </div>

          {/* Author, Reading Time & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <FormSelect
                label="Autor(a) *"
                required
                value={authorAdvisorId ?? ""}
                onChange={(e) => setAuthorAdvisorId(Number(e.target.value))}
              >
                <option value="" disabled>
                  Selecciona una asesora
                </option>
                {selectableAdvisors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.fullName}
                    {!a.active ? " (inactiva)" : ""}
                  </option>
                ))}
              </FormSelect>
              {selectedAdvisor && (
                <div className="flex items-center gap-2 mt-2">
                  {selectedAdvisor.photoMediaUrl ? (
                    <div className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden border border-neutral-border">
                      <ResponsiveImage
                        src={selectedAdvisor.photoMediaUrl}
                        alt={selectedAdvisor.fullName}
                        fill
                        className="rounded-full"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-neutral-100 border border-neutral-border flex items-center justify-center text-xs font-bold text-neutral-500">
                      {selectedAdvisor.fullName.charAt(0)}
                    </div>
                  )}
                  <span className="text-[11px] text-neutral-400">
                    Foto publicada junto al artículo
                  </span>
                </div>
              )}
            </div>

            <div>
              <FormField
                label="Minutos de Lectura"
                type="number"
                min="1"
                max="60"
                value={readingTimeMinutes}
                onChange={(e) => setReadingTimeMinutes(Number(e.target.value))}
              />
            </div>

            <div>
              <FormField
                label="Etiquetas (separadas por coma)"
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Cartagena, Caribe, Playas"
              />
            </div>
          </div>

          {/* Cover Image Selector */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
            <HeroPhotoSlot
              variant="main"
              label="Imagen de Portada"
              mediaId={coverMediaId}
              mediaUrl={coverMediaUrl}
              focalX={coverFocalX}
              focalY={coverFocalY}
              onSelect={handleCoverSelect}
              modalTitle="Seleccionar Portada del Artículo"
            />
          </div>

          {/* Summary / Lead */}
          <div>
            <FormField
              label="Resumen / Extracto (Lead) *"
              multiline
              required
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Breve introducción que atraiga al lector en las tarjetas y redes sociales..."
            />
          </div>

          {/* Markdown Body Editor */}
          <div>
            <FormField
              ref={textareaRef}
              label="Cuerpo del Artículo (Formato Markdown) *"
              multiline
              required
              rows={12}
              value={contentMarkdown}
              onChange={(e) => setContentMarkdown(e.target.value)}
              placeholder="# Título del Artículo..."
              className="font-mono"
            />
            <div className="flex flex-wrap gap-2 mt-1.5">
              <Button variant="outline" size="sm" type="button" onClick={() => insertMarkdown("## ", "", "Subtítulo")}>
                Subtítulo
              </Button>
              <Button variant="outline" size="sm" type="button" onClick={() => insertMarkdown("> ", "", "Cita del cliente — Nombre")}>
                Cita
              </Button>
              <Button variant="outline" size="sm" type="button" onClick={() => insertMarkdown("- ", "", "Elemento de la lista")}>
                Lista
              </Button>
              <Button variant="outline" size="sm" type="button" onClick={() => insertMarkdown("1. ", "", "Elemento")}>
                Lista numerada
              </Button>
              <Button variant="outline" size="sm" type="button" onClick={() => insertMarkdown("**", "**", "texto en negrita")}>
                Negrita
              </Button>
              <Button variant="outline" size="sm" type="button" onClick={() => insertMarkdown("*", "*", "texto en cursiva")}>
                Cursiva
              </Button>
              <Button variant="outline" size="sm" type="button" onClick={() => insertMarkdown("\n---\n", "", "")}>
                Separador
              </Button>
            </div>
            <div className="flex items-center justify-between gap-3 mt-1.5">
              <span className="block text-[11px] text-neutral-400">
                Usa los botones para dar formato mientras escribes
              </span>
              <Button
                variant="outline"
                size="sm"
                type="button"
                icon={<ImageIcon size={14} />}
                onClick={() => setIsImagePickerOpen(true)}
              >
                Insertar Imagen
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-border">
            <Button variant="outline" type="button" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              type="button"
              onClick={handleSubmit}
              disabled={saving || !title.trim() || !slug.trim() || !authorAdvisorId}
            >
              {saving ? "Guardando..." : editingPost ? "Guardar Cambios" : "Publicar Artículo"}
            </Button>
          </div>
        </form>
      </Modal>

      <MediaPickerModal
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        onSelect={handleInsertImage}
        title="Insertar Imagen en el Artículo"
        items={picker.items}
        loading={picker.loading}
        onUploadFile={picker.uploadFile}
        onFocalPointSave={picker.saveFocalPoint}
      />
    </>
  );
};
