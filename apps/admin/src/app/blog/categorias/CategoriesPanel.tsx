"use client";

import React from "react";
import { BlogCategoryDTO } from "@vc/api-client";
import { useAdminBlogCategories } from "../../../hooks/useAdminBlogCategories";

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
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
          Categorías del Blog
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Crea y organiza las categorías de contenido usadas por los artículos del blog.
        </p>
      </div>

      {/* Notifications */}
      {statusMessage && (
        <div className="p-4 rounded-2xl text-sm font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-between">
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Create / Edit Form */}
      <form
        onSubmit={handleSaveCategory}
        className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4"
      >
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
          {editingCategoryId ? "Editar Categoría" : "Agregar Nueva Categoría"}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-neutral-600 mb-1">Nombre *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
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

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-5">
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
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-brand-accent"></div>
              </label>
              <span className="text-xs font-bold text-neutral-700">
                {active ? "Activa" : "Inactiva"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {editingCategoryId && (
              <button
                type="button"
                onClick={resetForm}
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
              {saving ? "Guardando..." : editingCategoryId ? "Actualizar" : "Crear Categoría"}
            </button>
          </div>
        </div>
      </form>

      {/* Existing Categories List */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
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
                    <span className="text-sm font-bold text-neutral-900">{cat.name}</span>
                    <span className="text-[11px] font-mono text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
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
                    <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startEditCategory(cat)}
                    className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600 text-xs font-semibold"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 text-xs font-semibold"
                  >
                    Desactivar
                  </button>
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
