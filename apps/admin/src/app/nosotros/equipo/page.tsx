"use client";

import React from "react";
import { ConfirmDialog } from "@vc/ui";
import { EditorActionBar } from "../../../components/editor/EditorActionBar";
import { buildLastSavedLabel } from "../../../lib/editorSaveState";
import { useAdminAbout } from "../../../hooks/useAdminAbout";
import { useAdminAdvisors } from "../../../hooks/useAdminAdvisors";
import { AdvisorList } from "./AdvisorList";
import { AdvisorFormModal } from "./AdvisorFormModal";
import { AdvisorsHighlightsCard } from "./AdvisorsHighlightsCard";
import { buildAdvisorCards, buildTeamHeaderActionBar, buildTeamSummaryLabel } from "./advisorTeamModel";

export default function AdminAdvisorsPage() {
  const about = useAdminAbout();
  const team = useAdminAdvisors();

  /* Instante de referencia de las fechas relativas de la pantalla ("hoy,
     10:18"). Se recalcula cuando llegan datos nuevos y no en cada render, para
     que las etiquetas no cambien solas mientras se escribe en el encabezado. */
  /* Las dos deps son claves de invalidación, no valores leídos dentro del
     callback: `exhaustive-deps` las ve "innecesarias" porque no aparecen en el
     cuerpo, pero son justo lo que hace que `now` se recalcule. Ambas son estado
     (`useState` en useAdminAbout / useAdminAdvisors), así que su identidad solo
     cambia cuando llegan datos nuevos; escribir en el encabezado toca
     `formData`, no `aboutPage`, y las etiquetas relativas se quedan quietas.
     Quitarlas dejaría `now` congelado en el primer render. */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const now = React.useMemo(() => new Date(), [about.aboutPage, team.advisors]);

  const cards = React.useMemo(() => buildAdvisorCards(team.advisors, now), [team.advisors, now]);

  const actionBar = buildTeamHeaderActionBar({
    dirty: about.isDirty,
    saving: about.saving,
    savedAtLabel: buildLastSavedLabel(about.aboutPage?.updatedAt, now),
    onDiscard: about.discardChanges,
  });

  return (
    <div>
      {/* 500 / 752 del diseño, en fracciones: la proporción se conserva aunque
          el contenedor de la sección sea más estrecho que el lienzo de Figma. */}
      <div className="grid items-start gap-6 lg:grid-cols-[500fr_752fr]">
        <AdvisorsHighlightsCard
          badge={about.formData.advisorsBadge || ""}
          highlights={about.formData.advisorsHighlights}
          loading={about.loading}
          saving={about.saving}
          feedback={about.feedback}
          onChangeBadge={(value) => about.updateField("advisorsBadge", value)}
          onChangeHighlight={about.updateAdvisorsHighlight}
          onSubmit={about.handleSave}
        />

        <AdvisorList
          cards={cards}
          summaryLabel={buildTeamSummaryLabel(team.advisors, {
            loading: team.loading,
            loadError: team.loadError,
          })}
          loading={team.loading}
          loadError={team.loadError}
          feedback={team.feedback}
          busy={team.listBusy || team.saving}
          onCreate={team.openCreateAdvisor}
          onEdit={team.openEditAdvisor}
          onDelete={team.handleDeleteAdvisor}
          onToggleActive={team.setAdvisorActive}
          onMove={team.moveAdvisor}
          onRetry={team.reload}
        />
      </div>

      <EditorActionBar {...actionBar} />

      <AdvisorFormModal
        isOpen={team.isModalOpen}
        advisor={team.editingAdvisor}
        saving={team.saving}
        photoMediaId={team.photoMediaId}
        photoMediaUrl={team.photoMediaUrl}
        onSelectPhoto={team.handleSelectPhoto}
        onClose={team.closeAdvisorModal}
        onSave={team.handleSaveAdvisor}
      />

      <ConfirmDialog {...team.deleteConfirmation} />
    </div>
  );
}
