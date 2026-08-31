"use client";

import React from "react";
import { AuditLogsViewer, RetryableError } from "@vc/ui";
import { useAdminAudit } from "../../hooks/useAdminAudit";

export function AuditLogsClientView() {
  const { logs, loading, loadError, selectedEntityType, setCategory, refreshLogs } =
    useAdminAudit();

  /* Una bitácora vacía por un fallo de red se lee como "no pasó nada", que es
     justo lo contrario de lo que una bitácora debe poder afirmar. */
  if (loadError) {
    return (
      <RetryableError
        message="No se pudo cargar la bitácora de auditoría. El registro sigue completo en el servidor: vuelve a intentarlo."
        onRetry={refreshLogs}
        retrying={loading}
      />
    );
  }

  return (
    <div className="space-y-6">
      <AuditLogsViewer
        logs={logs}
        loading={loading}
        selectedEntityType={selectedEntityType}
        onSelectEntityType={setCategory}
        onRefresh={refreshLogs}
      />
    </div>
  );
}
