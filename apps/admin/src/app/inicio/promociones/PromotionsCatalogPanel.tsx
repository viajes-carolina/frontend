"use client";

import React from "react";
import type { AdminPromotionsPageResponse } from "@vc/api-client";
import { ConfirmDialog, FormFeedback, RetryableError } from "@vc/ui";
import { AdminDataTable, type DataTableBulkAction } from "../../../components/table";
import { useAdminPromotionsCatalog } from "../../../hooks/useAdminPromotionsCatalog";
import type { PromotionBulkOperation } from "../../../lib/promotionsCatalog";
import { CreatePromotionModal } from "./CreatePromotionModal";
import { PromotionsMetrics } from "./PromotionsMetrics";
import { buildPromotionColumns } from "./promotionsTable";

export interface PromotionsCatalogPanelProps {
  /** La primera página, ya servida desde el servidor por `page.tsx`. */
  initialPage: AdminPromotionsPageResponse;
}

export function PromotionsCatalogPanel({ initialPage }: PromotionsCatalogPanelProps) {
  const catalog = useAdminPromotionsCatalog(initialPage);
  const table = catalog.table;

  /* Las columnas se declaran en cada render y no con `useMemo`: dependen de
     todos los manejadores del hook, que son funciones nuevas cada vez, así que
     el memo se invalidaría igual. El kit no las usa como dependencia de nada. */
  const columns = buildPromotionColumns({
    onToggleActive: catalog.handleToggleActive,
    onEdit: catalog.openEditModal,
    onDelete: catalog.handleDelete,
    onOpenFacebookPost: catalog.openFacebookPost,
    hideBlockedReason: catalog.hideBlockedReason,
    busy: catalog.isBulkRunning,
  });

  /* Una tanda termina soltando la selección: dejar marcadas las filas que ya se
     aplicaron invita a repetir la acción sobre ellas. */
  const clearSelection = () => table.selection?.clear();
  const bulk = (operation: PromotionBulkOperation) => (ids: readonly string[]) => {
    void catalog.runBulk(ids, operation, clearSelection);
  };

  const bulkActions: DataTableBulkAction[] = [
    {
      id: "show",
      label: "Mostrar en portada",
      disabled: catalog.isBulkRunning,
      onSelect: bulk("show"),
    },
    {
      id: "hide",
      label: "Ocultar",
      disabled: catalog.isBulkRunning,
      onSelect: bulk("hide"),
    },
    {
      id: "delete",
      label: "Eliminar",
      tone: "danger",
      disabled: catalog.isBulkRunning,
      onSelect: (ids) => catalog.confirmBulkDelete(ids, clearSelection),
    },
  ];

  return (
    <div className="font-inter">
      <PromotionsMetrics summary={catalog.summary} />

      {/* Sin `space-y-*` aquí: la región live de `FormFeedback` está siempre en
          el DOM aunque no haya mensaje, y como hermana de un `space-y` correría
          un margen muerto entre el resumen y la tabla. Cada banner aporta su
          propia separación inferior solo cuando se ve. */}
      <div className="mt-6">
        <FormFeedback feedback={catalog.feedback} />

        {catalog.listError && (
          <RetryableError
            message={catalog.listError}
            onRetry={() => void catalog.retryLoad()}
            retrying={catalog.isRefreshing}
            className="mb-6"
          />
        )}

        <AdminDataTable
          controller={table}
          columns={columns}
          caption="Catálogo de promociones"
          searchPlaceholder="Buscar por título o destino…"
          searchLabel="Buscar promociones por título o destino"
          createAction={{ label: "Nueva promoción", onSelect: catalog.openCreateModal }}
          bulkActions={bulkActions}
          getRowLabel={(promo) => `«${promo.title}»`}
          itemNoun="promociones"
          minWidthClassName="min-w-[1040px]"
          /* `busy` y no `loading`: cambiar de página o teclear abre una petición
             y el esqueleto desmontaría el buscador con el cursor dentro. */
          busy={catalog.isStale}
          emptyState={{
            title: "Aún no hay promociones",
            description: "Crea la primera promoción para comenzar a construir el catálogo.",
            action: { label: "Nueva promoción", onSelect: catalog.openCreateModal },
          }}
          noResultsState={{
            title: "Ninguna promoción coincide",
            description:
              "La búsqueda o los filtros activos dejan la tabla vacía. Prueba con otras palabras o vuelve a verlas todas.",
          }}
        />
      </div>

      <CreatePromotionModal
        mode={catalog.modalMode}
        currentSlug={catalog.editingPromotion?.slug}
        legacyImportNotice={
          catalog.modalMode === "edit" && catalog.editingPromotion?.source === "FACEBOOK"
            ? "Esta promoción llegó del importador de Facebook que ya se retiró y puede traer campos vacíos o de relleno. Complétalos antes de guardar: el post original de Facebook no se toca."
            : undefined
        }
        isOpen={catalog.isModalOpen}
        onClose={catalog.closeModal}
        onSubmit={catalog.handleSubmit}
        isSaving={catalog.isSaving}
        form={catalog.form}
        onApplyTemplate={catalog.applyTemplateDraft}
      />

      <ConfirmDialog {...catalog.confirmDialog} />
    </div>
  );
}
