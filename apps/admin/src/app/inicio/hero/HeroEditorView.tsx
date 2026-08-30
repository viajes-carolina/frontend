"use client";

import type { HomeHeroDTO } from "@vc/api-client";
import { FormFeedback } from "@vc/ui";
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
}

export function HeroEditorView({
  initialHero,
  publication,
  initialLastSavedLabel,
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
    <form
      onSubmit={editor.saveDraft}
      className="mx-auto w-full max-w-[1240px] px-5 py-7 lg:px-10 lg:py-8"
    >
      <ContentEditorHeader
        breadcrumb="Inicio / Hero principal"
        title="Hero principal"
        description="Edita el mensaje principal que recibe a los visitantes."
        pills={pills}
      />

      <div className="mt-5">
        <FormFeedback feedback={hero.feedback} />
      </div>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,690px)_minmax(0,404px)]">
        <HeroEditorForm editor={editor} />

        <EditorPreviewPanel
          device={editor.device}
          onDeviceChange={editor.setDevice}
          footnote="La vista previa se actualiza mientras editas."
        >
          <HeroPreviewCard hero={editor.previewHero} device={editor.device} />
        </EditorPreviewPanel>
      </div>

      <EditorActionBar
        statusLabel={hero.isDirty ? "Cambios sin guardar" : "Sin cambios pendientes"}
        statusPending={hero.isDirty}
        savedAtLabel={editor.lastSavedLabel}
        saving={hero.isSaving}
        publishing={editor.isPublishing}
        dirty={hero.isDirty}
        onCancel={editor.cancel}
        onSaveAndPublish={editor.saveAndPublish}
      />
    </form>
  );
}
