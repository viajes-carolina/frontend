"use client";

import type { HomeHeroDTO } from "@vc/api-client";
import { ArrowUpRightIcon, FormFeedback } from "@vc/ui";
import { ContentEditorHeader, type EditorHeaderPill } from "../../../components/editor/ContentEditorHeader";
import { EditorActionBar } from "../../../components/editor/EditorActionBar";
import { EditorPreviewPanel } from "../../../components/editor/EditorPreviewPanel";
import { useHeroEditor } from "../../../hooks/useHeroEditor";
import type { DashboardTone } from "../../../lib/dashboardActivity";
import { HeroEditorForm } from "./HeroEditorForm";
import { HeroPreviewCard } from "./HeroPreviewCard";

export interface HeroEditorViewProps {
  initialHero: HomeHeroDTO;
  /** Estado real de publicación del sitio, leído en el servidor. */
  publication: { label: string; tone: DashboardTone };
  initialLastSavedLabel: string;
  /**
   * Sitio público (`NEXT_PUBLIC_SITE_URL`). Puede faltar: si no está
   * configurado no se pinta el botón, en vez de enlazar a una URL inventada.
   */
  publicSiteUrl?: string;
}

/* Mismo recetario que `Button variant="secondary"` de `@vc/ui` (blanco, borde
   neutro, 44px de alto, radio y tipografía del panel), pero sobre un `<a>`:
   "Ver web pública" navega a otro sitio, así que tiene que ser un enlace real
   — abrible en otra pestaña, copiable, anunciado como enlace. El kit no ofrece
   todavía una variante de enlace del botón. */
const PUBLIC_SITE_LINK_CLASSES = [
  "vc-control inline-flex h-11 items-center justify-center gap-2",
  "rounded-[var(--vc-control-radius)] border border-neutral-border bg-white",
  "px-4 font-sora text-[12px] font-semibold text-brand-navy shadow-sm",
  "transition-colors hover:bg-neutral-soft",
  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--vc-focus-ring,var(--color-brand-blue))]",
].join(" ");

/* El editor mide 780px y la vista previa 472px (Figma 958:459, punto 5), con
   20px de calle: 1272px de contenido que, más el padding de 40px por lado,
   dan los 1352px que quedan a la derecha del sidebar de 248px en el lienzo de
   1600px del diseño.

   Las columnas se declaran en `fr` con esos mismos números, no en píxeles: a
   1352px de contenedor reparten exactamente 780/472, y por debajo se encogen
   LAS DOS en proporción. Con `minmax(0, 472px)` la previa se quedaba clavada
   en su ancho máximo y todo el recorte se lo comía el editor (620px en una
   pantalla de 1440), que es justo la columna donde se trabaja. `minmax(0, …)`
   fija el mínimo en 0 para que un texto largo no desborde la rejilla. */
const EDITOR_CANVAS = "mx-auto w-full max-w-[1352px] px-5 py-7 lg:px-10 lg:py-8";
const EDITOR_GRID =
  "grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,780fr)_minmax(0,472fr)]";

export function HeroEditorView({
  initialHero,
  publication,
  initialLastSavedLabel,
  publicSiteUrl,
}: HeroEditorViewProps) {
  const editor = useHeroEditor({ initialHero, initialLastSavedLabel });
  const { hero } = editor;

  // La segunda píldora solo aparece cuando el formulario difiere de verdad de
  // lo cargado — no basta con haber tocado un campo y haberlo dejado igual.
  const pills: EditorHeaderPill[] = [
    { label: publication.label, tone: publication.tone },
    ...(hero.isDirty
      ? [{ label: "Cambios sin guardar", tone: "pending" as const } satisfies EditorHeaderPill]
      : []),
  ];

  return (
    <form onSubmit={editor.saveDraft} className={EDITOR_CANVAS}>
      <ContentEditorHeader
        breadcrumb="Inicio / Hero principal"
        title="Hero principal"
        description="Edita el mensaje principal que recibe a los visitantes."
        pills={pills}
        action={
          publicSiteUrl ? (
            <a
              href={publicSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ver web pública (se abre en una pestaña nueva)"
              className={PUBLIC_SITE_LINK_CLASSES}
            >
              Ver web pública
              <ArrowUpRightIcon size={14} aria-hidden="true" />
            </a>
          ) : undefined
        }
      />

      <div className="mt-5">
        <FormFeedback feedback={hero.feedback} />
      </div>

      <div className={EDITOR_GRID}>
        <HeroEditorForm editor={editor} />

        {/* La vista previa acompaña al scroll del formulario. `sticky` sobre el
            propio elemento de la rejilla funciona porque su área de rejilla
            ocupa toda la fila (la marca el formulario, más alto) mientras que
            el elemento, con `items-start`, solo mide lo que su contenido. */}
        <div className="xl:sticky xl:top-6">
          <EditorPreviewPanel
            device={editor.device}
            onDeviceChange={editor.setDevice}
            footnote="La vista previa se actualiza mientras editas."
          >
            <HeroPreviewCard hero={editor.previewHero} device={editor.device} />
          </EditorPreviewPanel>
        </div>
      </div>

      <EditorActionBar {...editor.actionBar} />
    </form>
  );
}
