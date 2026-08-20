"use client";

import React, { useState } from "react";
import { BlogCategoryDTO, CreateOrUpdateBlogCategoryRequest } from "@vc/api-client";

export interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: BlogCategoryDTO[];
  onSaveCategory: (id: number | null, req: CreateOrUpdateBlogCategoryRequest) => Promise<void>;
  onDeleteCategory: (id: number) => Promise<void>;
  saving: boolean;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSaveCategory,
  onDeleteCategory,
  saving,
}) => {
  const [editingCatId, setEditingCatId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);

  if (!isOpen) return null;

  const handleStartEdit = (cat: BlogCategoryDTO) => {
    setEditingCatId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setDisplayOrder(cat.displayOrder);
  };

  const handleCancelEdit = () => {
    setEditingCatId(null);
    setName("");
    setSlug("");
    setDescription("");
    setDisplayOrder(categories.length + 1);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCatId) {
      const generatedSlug = val
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveCategory(editingCatId, {
      name,
      slug,
      description,
      displayOrder,
      active: true,
    });
    handleCancelEdit();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-neutral-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Gestión de Categorías del Blog</h3>
            <p className="text-xs text-neutral-400">
              Crea y organiza las categorías de contenido para los artículos.
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Create / Edit Form */}
          <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
              {editingCatId ? "Editar Categoría" : "Agregar Nueva Categoría"}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1">Nombre *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ej. Guías de Destinos"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm font-medium focus:ring-2 focus:ring-brand-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1">Slug URL *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="guias-de-destinos"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm font-mono text-neutral-700 focus:ring-2 focus:ring-brand-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-600 mb-1">Descripción</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve descripción del propósito de la categoría..."
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-brand-accent"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-neutral-600">Orden:</label>
                <input
                  type="number"
                  min="1"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-20 px-2 py-1 rounded-lg border border-neutral-300 text-xs font-bold text-center"
                />
              </div>

              <div className="flex items-center gap-2">
                {editingCatId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-bold text-neutral-600 hover:bg-neutral-100"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving || !name.trim() || !slug.trim()}
                  className="px-4 py-1.5 rounded-xl bg-brand-accent text-white text-xs font-bold hover:bg-brand-sunset transition shadow-sm disabled:opacity-50"
                >
                  {saving ? "Guardando..." : editingCatId ? "Actualizar" : "Crear Categoría"}
                </button>
              </div>
            </div>
          </form>

          {/* Existing Categories List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
              Categorías registradas ({categories.length})
            </h4>

            <div className="space-y-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-900">{cat.name}</span>
                      <span className="text-[11px] font-mono text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
                        /{cat.slug}
                      </span>
                      {!cat.active && (
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                          Inactivo
                        </span>
                      )}
                    </div>
                    {cat.description && (
                      <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                        {cat.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(cat)}
                      className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600 text-xs font-semibold"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCategory(cat.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 text-xs font-semibold"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
