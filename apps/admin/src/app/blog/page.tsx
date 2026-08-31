"use client";

import React from "react";
import type { BlogPostDTO } from "@vc/api-client";
import { ConfirmDialog, FormFeedback, RetryableError } from "@vc/ui";
import {
  AdminDataTable,
  useDataTable,
  type DataTableBulkAction,
} from "../../components/table";
import { useAdminBlog } from "../../hooks/useAdminBlog";
import { BlogFormModal } from "./BlogFormModal";
import { BLOG_POST_FILTERS, buildBlogPostColumns, searchInPost } from "./blogPostsTable";

export default function AdminBlogPage() {
  const {
    posts,
    categories,
    advisors,
    loading,
    loadError,
    saving,
    feedback,
    archiveConfirmation,
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
    handleArchiveSelection,
    loadData,
  } = useAdminBlog();

  const table = useDataTable<BlogPostDTO>({
    rows: posts,
    getRowId: (post) => String(post.id),
    searchIn: searchInPost,
    filters: BLOG_POST_FILTERS,
    selectable: true,
  });

  const columns = React.useMemo(
    () => buildBlogPostColumns({ onEdit: handleOpenEditPost, onArchive: handleDeletePost }),
    [handleOpenEditPost, handleDeletePost]
  );

  const bulkActions = React.useMemo<readonly DataTableBulkAction[]>(
    () => [
      {
        id: "archive",
        label: "Archivar",
        tone: "danger",
        onSelect: (selectedIds) => {
          /* La barra entrega ids; la confirmación necesita los artículos para
             poder contarlos y nombrarlos. */
          handleArchiveSelection(posts.filter((post) => selectedIds.includes(String(post.id))));
          table.selection?.clear();
        },
      },
    ],
    [posts, handleArchiveSelection, table.selection]
  );

  return (
    <div className="font-inter">
      <FormFeedback feedback={feedback} />

      <div className="space-y-6">
        {loadError ? (
          <RetryableError
            message="No se pudieron cargar los artículos del blog. Nada se ha perdido: vuelve a intentarlo y el listado se recupera."
            onRetry={loadData}
            retrying={loading}
          />
        ) : (
          <AdminDataTable
            controller={table}
            columns={columns}
            caption="Artículos del blog"
            loading={loading}
            searchPlaceholder="Buscar por título, slug, categoría o autor…"
            searchLabel="Buscar entre los artículos del blog"
            createAction={{ label: "Nuevo artículo", onSelect: handleOpenCreatePost }}
            bulkActions={bulkActions}
            itemNoun="artículos"
            minWidthClassName="min-w-[1000px]"
            getRowLabel={(post) => `«${post.title}»`}
            emptyState={{
              title: "Aún no hay artículos",
              description:
                "Publica el primer artículo para empezar a construir el blog y atraer viajeros desde el buscador.",
              action: { label: "Nuevo artículo", onSelect: handleOpenCreatePost },
            }}
            noResultsState={{
              title: "Ningún artículo coincide",
              description:
                "No hay artículos para esta búsqueda o filtro. Los demás siguen guardados: quítalo para volver a verlos.",
            }}
          />
        )}

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

      <ConfirmDialog {...archiveConfirmation} />
    </div>
  );
}
