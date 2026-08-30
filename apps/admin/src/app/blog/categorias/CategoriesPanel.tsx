"use client";

import React from "react";
import type { BlogCategoryDTO } from "@vc/api-client";
import { Button, FormFeedback, FormField, Toggle } from "@vc/ui";
import { useAdminBlogCategories } from "../../../hooks/useAdminBlogCategories";

export interface CategoriesPanelProps {
  initialCategories: BlogCategoryDTO[];
}

export function CategoriesPanel({ initialCategories }: CategoriesPanelProps) {
  const {
    categories,
    saving,
    feedback,
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
    <div className="font-inter">
      <FormFeedback feedback={feedback} />

      <div className="space-y-8">
        {/* Alta / edición */}
        <form
          onSubmit={handleSaveCategory}
          className="space-y-4 rounded-[12px] border border-neutral-border bg-white p-6 shadow-[0_8px_24px_rgba(17,34,48,0.06)]"
        >
          <h3 className="font-inter text-[11px] font-bold uppercase tracking-[0.55px] text-admin-label">
            {editingCategoryId ? "Editar Categoría" : "Agregar Nueva Categoría"}
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Nombre"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Guías de Destinos"
            />
            <FormField
              label="Slug URL"
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="guias-de-destinos"
              className="font-mono"
            />
          </div>

          <FormField
            label="Descripción"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Breve descripción del propósito de la categoría..."
          />

          <div className="flex flex-wrap items-end justify-between gap-4 border-t border-admin-divider pt-5">
            <div className="flex flex-wrap items-center gap-6">
              <FormField
                label="Orden"
                type="number"
                min="1"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                wrapperClassName="w-24"
              />
              <Toggle
                checked={active}
                onChange={setActive}
                label={active ? "Activa" : "Inactiva"}
                aria-label="Categoría activa"
              />
            </div>

            <div className="flex items-center gap-2">
              {editingCategoryId && (
                <Button variant="ghost" size="sm" type="button" onClick={resetForm}>
                  Cancelar
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                type="submit"
                disabled={saving || !name.trim() || !slug.trim()}
              >
                {saving ? "Guardando..." : editingCategoryId ? "Actualizar Categoría" : "Crear Categoría"}
              </Button>
            </div>
          </div>
        </form>

        {/* Categorías existentes */}
        <div className="overflow-hidden rounded-[12px] border border-neutral-border bg-white shadow-[0_8px_24px_rgba(17,34,48,0.06)]">
          <div className="border-b border-admin-divider bg-neutral-soft px-6 py-4">
            <h3 className="font-inter text-[11px] font-bold uppercase tracking-[0.55px] text-admin-label">
              Categorías registradas ({categories.length})
            </h3>
          </div>

          {categories.length > 0 ? (
            <div className="divide-y divide-admin-divider">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-neutral-soft"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-admin-value">{cat.name}</span>
                      <span className="rounded-[6px] bg-neutral-soft px-1.5 py-0.5 font-mono text-[11px] text-neutral-muted">
                        /{cat.slug}
                      </span>
                      <span
                        className={`rounded-[6px] border px-1.5 py-0.5 text-[10px] font-bold ${
                          cat.active
                            ? "border-brand-navy/20 bg-brand-navy/10 text-brand-navy"
                            : "border-neutral-border bg-neutral-soft text-neutral-muted"
                        }`}
                      >
                        {cat.active ? "Activa" : "Inactiva"}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-neutral-muted">{cat.description}</p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
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
            <div className="p-12 text-center text-sm text-neutral-muted">
              Aún no hay categorías registradas.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
