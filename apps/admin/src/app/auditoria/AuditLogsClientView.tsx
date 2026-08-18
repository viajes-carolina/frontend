"use client";

import React from "react";
import { AuditLogsViewer } from "@vc/ui";
import { useAdminAudit } from "../../hooks/useAdminAudit";

export function AuditLogsClientView() {
  const { logs, loading, selectedEntityType, setCategory, refreshLogs } = useAdminAudit();

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
