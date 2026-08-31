"use client";

import React from "react";
import type { BlogPostDTO } from "@vc/api-client";
import { Badge, StarIcon, type BadgeTone } from "@vc/ui";
import {
  TableRowActions,
  TableText,
  TableThumbnail,
  TableTitle,
  type DataTableColumn,
  type DataTableFilterDefinition,
} from "../../components/table";

/* ==========================================================================
   Declaración de la tabla de Artículos del blog: qué columnas tiene y por qué
   se puede filtrar. El motor (buscar, paginar, seleccionar) lo pone el kit.
   ========================================================================== */

/**
 * Estado del artículo en tonos semánticos del kit.
 *
 *   PUBLISHED  info     el ejemplo literal de la guía para "Publicado".
 *   DRAFT      neutral  el ejemplo literal de la guía para "Borrador".
 *   ARCHIVED   neutral  también retirado del sitio; comparte tono con el
 *                       borrador a propósito — ninguno está publicado — y es
 *                       la ETIQUETA la que los distingue, que es justo lo que
 *                       pide "estado sin depender únicamente del color".
 */
const POST_STATUS_BADGES: Record<string, { label: string; tone: BadgeTone }> = {
  PUBLISHED: { label: "Publicado", tone: "info" },
  DRAFT: { label: "Borrador", tone: "neutral" },
  ARCHIVED: { label: "Archivado", tone: "neutral" },
};

/** Campos donde busca el buscador de la barra de herramientas. */
export const searchInPost = (post: BlogPostDTO) => [
  post.title,
  post.slug,
  post.categoryName,
  post.authorName,
];

const STATUS_FILTER: DataTableFilterDefinition<BlogPostDTO> = {
  id: "status",
  label: "Estado",
  options: [
    { value: "ALL", label: "Todos" },
    { value: "PUBLISHED", label: "Publicados" },
    { value: "DRAFT", label: "Borradores" },
    { value: "ARCHIVED", label: "Archivados" },
  ],
  match: (post, value) => post.status === value,
};

const FEATURED_FILTER: DataTableFilterDefinition<BlogPostDTO> = {
  id: "featured",
  label: "Portada",
  options: [
    { value: "ALL", label: "Todos" },
    { value: "FEATURED", label: "Destacados" },
    { value: "PLAIN", label: "Sin destacar" },
  ],
  match: (post, value) => (value === "FEATURED" ? !!post.isFeatured : !post.isFeatured),
};

/**
 * Referencia estable: el motor memoiza sobre `filters`, y un array nuevo en
 * cada render invalidaría ese caché.
 */
export const BLOG_POST_FILTERS = [STATUS_FILTER, FEATURED_FILTER];

export interface BlogPostColumnHandlers {
  onEdit: (post: BlogPostDTO) => void;
  onArchive: (post: BlogPostDTO) => void;
}

export function buildBlogPostColumns({
  onEdit,
  onArchive,
}: BlogPostColumnHandlers): readonly DataTableColumn<BlogPostDTO>[] {
  return [
    {
      id: "article",
      header: "Artículo",
      width: "min-w-[280px]",
      cell: (post) => (
        <div className="flex items-center gap-3">
          <TableThumbnail url={post.coverMediaUrl} alt={`Portada de ${post.title}`} />
          <div className="flex min-w-0 flex-col gap-1">
            <TableTitle title={post.title} meta={`/${post.slug}`} clamp={1} />
            {post.isFeatured && (
              <Badge tone="accent" icon={<StarIcon size={10} />} className="self-start">
                Destacado
              </Badge>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "category",
      header: "Categoría",
      width: "w-[150px]",
      /* La categoría clasifica, no alerta: tono informativo. */
      cell: (post) => <Badge tone="info">{post.categoryName || "General"}</Badge>,
    },
    {
      id: "status",
      header: "Estado",
      width: "w-[110px]",
      cell: (post) => {
        const badge = POST_STATUS_BADGES[post.status] ?? POST_STATUS_BADGES.DRAFT;
        return <Badge tone={badge.tone}>{badge.label}</Badge>;
      },
    },
    {
      id: "author",
      header: "Autor / lectura",
      width: "w-[170px]",
      cell: (post) => (
        <TableTitle
          title={post.authorName}
          meta={`${post.readingTimeMinutes} min de lectura`}
          clamp={1}
        />
      ),
    },
    {
      id: "views",
      header: "Vistas",
      align: "center",
      width: "w-[90px]",
      cell: (post) => <TableText>{post.viewCount || 0}</TableText>,
    },
    {
      id: "actions",
      header: "Acciones",
      headerHidden: true,
      align: "end",
      width: "w-[64px]",
      cell: (post) => (
        <TableRowActions
          label={`Acciones de "${post.title}"`}
          actions={[
            { id: "edit", label: "Editar", onSelect: () => onEdit(post) },
            {
              id: "archive",
              label: "Archivar",
              tone: "danger",
              /* Un artículo ya archivado no se puede archivar otra vez: la
                 acción sigue visible pero apagada, para que la fila no cambie
                 de forma según su estado. */
              disabled: post.status === "ARCHIVED",
              onSelect: () => onArchive(post),
            },
          ]}
        />
      ),
    },
  ];
}
