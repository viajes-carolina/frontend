"use client";

import React from "react";
import { BlogCategoryDTO } from "@vc/api-client";
import { useAdminBlogCategories } from "../../../hooks/useAdminBlogCategories";
import { Button, FormField, Toggle } from "@vc/ui";

export interface CategoriesPanelProps {
  initialCategories: BlogCategoryDTO[];
}

export function CategoriesPanel({ initialCategories }: CategoriesPanelProps) {
  const {
    categories,
    saving,
    statusMessage,
    editingCategoryId,
    name,
    setName,
    slug,
    setSlug,
    description,
    setDescription,
    displayOrder,
    setDisplayOrder,
    active,
    setActive,
    startEditCategory,
    resetForm,
    handleSaveCategory,
    handleDeleteCategory,
  } = useAdminBlogCategories(initialCategories);

  return (
    <div className="space-y-8">
      {/* Notifications */}
      {statusMessage && (
        <div className="p-4 rounded-2xl text-sm font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-between">
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Create / Edit Form */}
      <form
        onSubmit={handleSaveCategory}
        className="p-4 rounded-2xl bg-neutral-soft border border-neutral-border space-y-4"
      >
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
          {editingCategoryId ? "Editar Categoría" : "Agregar Nueva Categoría"}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <FormField
              label="Nombre *"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Guías de Destinos"
            />
          </div>

          <div>
            <FormField
              label="Slug URL *"
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="guias-de-destinos"
              className="font-mono"
            />
          </div>
        </div>

        <div>
          <FormField
            label="Descripción"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Breve descripción del propósito de la categoría..."
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-neutral-muted">Orden:</label>
              <input
                type="number"
                min="1"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-20 px-2 py-1 rounded-lg border border-neutral-border text-xs font-bold text-center"
              />
            </div>

            <div className="flex items-center gap-2">
              <Toggle checked={active} onChange={setActive} />
              <span className="text-xs font-bold text-neutral-700">
                {active ? "Activa" : "Inactiva"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {editingCategoryId && (
              <Button variant="outline" size="sm" type="button" onClick={resetForm}>
                Cancelar
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={saving || !name.trim() || !slug.trim()}
            >
              {saving ? "Guardando..." : editingCategoryId ? "Actualizar" : "Crear Categoría"}
            </Button>
          </div>
        </div>
      </form>

      {/* Existing Categories List */}
      <div className="bg-white rounded-2xl border border-neutral-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-border">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-muted">
            Categorías registradas ({categories.length})
          </h4>
        </div>

        {categories.length > 0 ? (
          <div className="divide-y divide-neutral-100">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-4 hover:bg-neutral-50/60 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-brand-navy">{cat.name}</span>
                    <span className="text-[11px] font-mono text-neutral-muted bg-neutral-100 px-1.5 py-0.5 rounded">
                      /{cat.slug}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        cat.active
                          ? "text-emerald-700 bg-emerald-50"
                          : "text-red-600 bg-red-50"
                      }`}
                    >
                      {cat.active ? "Activa" : "Inactiva"}
                    </span>
                  </div>
                  {cat.description && (
                    <p className="text-xs text-neutral-muted mt-0.5 line-clamp-1">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => startEditCategory(cat)}>
                    Editar
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteCategory(cat.id)}>
                    Desactivar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-neutral-500 text-sm">
            Aún no hay categorías registradas.
          </div>
        )}
      </div>
    </div>
  );
}
