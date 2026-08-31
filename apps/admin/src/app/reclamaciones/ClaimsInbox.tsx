"use client";

import React from "react";
import type { ClaimRecordDTO } from "@vc/api-client";
import { Button, FormFeedback, RefreshCwIcon, RetryableError } from "@vc/ui";
import { AdminDataTable, useDataTable } from "../../components/table";
import { useAdminClaims } from "../../hooks/useAdminClaims";
import { ClaimDetailModal } from "./ClaimDetailModal";
import { buildClaimColumns, CLAIM_FILTERS, searchInClaim } from "./claimsTable";

export interface ClaimsInboxProps {
  initialClaims: ClaimRecordDTO[];
}

export const ClaimsInbox: React.FC<ClaimsInboxProps> = ({ initialClaims }) => {
  const {
    claims,
    loading,
    loadError,
    selectedClaim,
    setSelectedClaim,
    updating,
    feedback,
    updateStatus,
    reload,
  } = useAdminClaims(initialClaims);

  const table = useDataTable<ClaimRecordDTO>({
    rows: claims,
    getRowId: (claim) => String(claim.id),
    searchIn: searchInClaim,
    filters: CLAIM_FILTERS,
  });

  const columns = React.useMemo(() => buildClaimColumns(setSelectedClaim), [setSelectedClaim]);

  return (
    <div className="font-inter">
      <FormFeedback feedback={feedback} />

      {/* La bandeja se llena sola desde el sitio público: sin un refresco a
          mano, la única forma de ver un reclamo nuevo era recargar la página. */}
      <div className="mb-4 flex justify-end">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          icon={<RefreshCwIcon size={14} aria-hidden="true" />}
          iconPosition="left"
          disabled={loading}
          onClick={reload}
        >
          {loading ? "Actualizando…" : "Actualizar bandeja"}
        </Button>
      </div>

      {loadError ? (
        <RetryableError
          message="No se pudo cargar el libro de reclamaciones. Ningún reclamo se ha perdido: vuelve a intentarlo y la bandeja se recupera."
          onRetry={reload}
          retrying={loading}
        />
      ) : (
        <AdminDataTable
          controller={table}
          columns={columns}
          caption="Hojas de reclamación recibidas"
          loading={loading && claims.length === 0}
          searchPlaceholder="Buscar por código, nombre o documento…"
          searchLabel="Buscar entre las hojas de reclamación"
          itemNoun="reclamos"
          minWidthClassName="min-w-[980px]"
          emptyState={{
            title: "Aún no hay hojas de reclamación",
            /* Sin acción: los reclamos los abre el consumidor desde el sitio
               público. Un botón aquí sería una promesa falsa. */
            description:
              "Cuando un consumidor registre una queja o reclamo desde el sitio público, aparecerá en esta bandeja.",
          }}
          noResultsState={{
            title: "Ningún reclamo coincide",
            description:
              "No hay reclamos para esta búsqueda o estado. Los demás siguen en la bandeja: quita el filtro para volver a verlos.",
          }}
        />
      )}

      {selectedClaim && (
        <ClaimDetailModal
          claim={selectedClaim}
          updating={updating}
          onClose={() => setSelectedClaim(null)}
          onUpdateStatus={updateStatus}
        />
      )}
    </div>
  );
};
