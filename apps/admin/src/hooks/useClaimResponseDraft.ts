"use client";

import { useState } from "react";
import type { ClaimRecordDTO } from "@vc/api-client";

/**
 * Borrador de la respuesta oficial a un reclamo.
 *
 * Vive fuera del `.tsx` como cualquier otro estado de formulario, y se
 * sincroniza con el reclamo abierto SIN `useEffect`: se compara el id guardado
 * con el que llega y, si cambió, se ajusta el estado durante el render (el
 * patrón "derivar estado de props" que React documenta). Con un efecto habría
 * un render intermedio en el que el modal ya muestra el reclamo nuevo pero el
 * textarea todavía tiene el texto del anterior — y ese texto es una respuesta
 * legal que se envía a un consumidor.
 */
export function useClaimResponseDraft(claim: ClaimRecordDTO | null) {
  const [responseNotes, setResponseNotes] = useState(claim?.responseNotes ?? "");
  const [syncedClaimId, setSyncedClaimId] = useState<number | null>(claim?.id ?? null);

  if (claim && claim.id !== syncedClaimId) {
    setSyncedClaimId(claim.id);
    setResponseNotes(claim.responseNotes ?? "");
  }

  return { responseNotes, setResponseNotes };
}
