"use client";

import React from "react";
import { useAdminBlog } from "../../hooks/useAdminBlog";
import { BlogFormModal } from "./BlogFormModal";
import { Button, EditIcon, PlusIcon, TrashIcon } from "@vc/ui";

export default function AdminBlogPage() {
  const {
    posts,
    categories,
    advisors,
    loading,
    saving,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    message,
    editingPost,
    isPostModalOpen,
    coverMediaId,
    coverMediaUrl,
    coverFocalX,
    coverFocalY,
    authorAdvisorId,
    setAuthorAdvisorId,
    handleCoverSelect,
    handleOpenCreatePost,
    handleOpenEditPost,
    handleClosePostModal,
    handleSavePost,
    handleDeletePost,
  } = useAdminBlog();

  return (
    <div className="space-y-8">
      {/* Top Actions */}
      <div className="flex items-center justify-end gap-4">
        <div className="flex items-center gap-3">
          <Button variant="primary" onClick={handleOpenCreatePost} icon={<PlusIcon size={18} />}>
            Nuevo Artículo
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold flex items-center justify-between ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <span>{message.text}</span>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-neutral-border shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {[
            { key: "ALL", label: "Todos los artículos" },
            { key: "PUBLISHED", label: "Publicados" },
            { key: "DRAFT", label: "Borradores" },
            { key: "ARCHIVED", label: "Archivados" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                statusFilter === tab.key
                  ? "bg-brand-accent text-white shadow-sm"
                  : "bg-neutral-soft text-neutral-600 hover:bg-neutral-200 border border-neutral-border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título o slug..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-border text-xs sm:text-sm font-medium focus:ring-2 focus:ring-brand-accent"
          />
          <span className="absolute left-3 top-2.5 text-neutral-400 text-xs">🔍</span>
        </div>
      </div>

      {/* Articles Table / List */}
      <div className="bg-white rounded-2xl border border-neutral-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-neutral-400 text-sm">
            Cargando artículos del blog...
          </div>
        ) : posts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/80 border-b border-neutral-border text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Artículo</th>
                  <th className="py-3.5 px-4">Categoría</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4">Autor / Lectura</th>
                  <th className="py-3.5 px-4 text-center">Vistas</th>
                  <th className="py-3.5 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-sm">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-neutral-50/60 transition">
                    {/* Article Title & Cover */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5 max-w-md">
                        <div className="w-14 h-12 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-border">
                          <img
                            src={post.coverMediaUrl || "/media/demo-cartagena-caribe.webp"}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-neutral-900 line-clamp-1">
                              {post.title}
                            </span>
                            {post.isFeatured && (
                              <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full shrink-0">
                                ⭐ Destacado
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-neutral-400 font-mono">
                            /{post.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4">
                      <span className="text-xs font-bold text-brand-accent bg-brand-accent/10 px-2.5 py-1 rounded-md">
                        {post.categoryName || "General"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          post.status === "PUBLISHED"
                            ? "bg-emerald-100 text-emerald-800"
                            : post.status === "DRAFT"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {post.status === "PUBLISHED"
                          ? "Publicado"
                          : post.status === "DRAFT"
                          ? "Borrador"
                          : "Archivado"}
                      </span>
                    </td>

                    {/* Author & Reading Time */}
                    <td className="py-4 px-4 text-xs text-neutral-600 font-medium">
                      <div>✍️ {post.authorName}</div>
                      <div className="text-[11px] text-neutral-400">⏱️ {post.readingTimeMinutes} min</div>
                    </td>

                    {/* Views */}
                    <td className="py-4 px-4 text-center text-xs font-bold text-neutral-700">
                      👁️ {post.viewCount || 0}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<EditIcon size={14} />}
                          onClick={() => handleOpenEditPost(post)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={<TrashIcon size={14} />}
                          onClick={() => handleDeletePost(post.id)}
                        >
                          Archivar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-neutral-500 text-sm">
            <span className="text-3xl mb-3 block">📝</span>
            No se encontraron artículos con los filtros seleccionados.
          </div>
        )}
      </div>

      {/* Post Modal */}
      <BlogFormModal
        isOpen={isPostModalOpen}
        onClose={handleClosePostModal}
        onSave={handleSavePost}
        editingPost={editingPost}
        categories={categories}
        advisors={advisors}
        saving={saving}
        coverMediaId={coverMediaId}
        coverMediaUrl={coverMediaUrl}
        coverFocalX={coverFocalX}
        coverFocalY={coverFocalY}
        authorAdvisorId={authorAdvisorId}
        setAuthorAdvisorId={setAuthorAdvisorId}
        handleCoverSelect={handleCoverSelect}
      />
    </div>
  );
}
