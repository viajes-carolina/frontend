"use client";

import React, { useState } from "react";
import type { AuditLogDTO } from "@vc/api-client";
import { TableSkeletonRows } from "../primitives/Skeleton";

export interface AuditLogsViewerProps {
  logs: AuditLogDTO[];
  loading?: boolean;
  selectedEntityType?: string;
  onSelectEntityType: (entityType: string) => void;
  onRefresh?: () => void;
}

export const AuditLogsViewer: React.FC<AuditLogsViewerProps> = ({
  logs,
  loading = false,
  selectedEntityType = "ALL",
  onSelectEntityType,
  onRefresh,
}) => {
  const [expandedLogId, setExpandedLogId] = useState<number | null>(null);

  const categories = [
    { label: "Todos", value: "ALL" },
    { label: "Autenticación", value: "AUTH" },
    { label: "Usuarios", value: "USER" },
    { label: "Reclamaciones", value: "CLAIM" },
    { label: "Promociones", value: "PROMOTION" },
    { label: "Configuración", value: "SITE_SETTINGS" },
    { label: "Sistema", value: "SYSTEM" },
  ];

  const getActionBadge = (action: string) => {
    if (action.includes("CREATE") || action.includes("PUBLISH")) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          {action}
        </span>
      );
    }
    if (action.includes("UPDATE") || action.includes("PATCH")) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
          {action}
        </span>
      );
    }
    if (action.includes("DELETE") || action.includes("FAILED")) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">
          {action}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
        {action}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Bitácora de Auditoría & Trazabilidad</h2>
          <p className="text-sm text-stone-500 mt-1">
            Registro cronológico inmutable de mutaciones administrativas, inicios de sesión y cambios de gobernanza.
          </p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs transition-colors self-start sm:self-auto"
          >
            <span>🔄 Actualizar Bitácora</span>
          </button>
        )}
      </div>

      {/* Filtros de Entidad */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onSelectEntityType(cat.value)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedEntityType === cat.value
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Lista de Registros */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-600 text-xs font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">Fecha / Hora</th>
                <th className="py-4 px-6">Operador</th>
                <th className="py-4 px-6">Acción</th>
                <th className="py-4 px-6">Entidad</th>
                <th className="py-4 px-6">Hash IP</th>
                <th className="py-4 px-6 text-right">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading && logs.length === 0 ? (
                <TableSkeletonRows columns={6} />
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-500">
                    No se encontraron registros de auditoría para este filtro.
                  </td>
                </tr>
              ) : (
                logs.map((l) => (
                  <React.Fragment key={l.id}>
                    <tr className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-4 px-6 whitespace-nowrap text-xs text-stone-600">
                        {new Date(l.createdAt).toLocaleString("es-PE")}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-stone-900 text-xs font-mono">
                          @{l.username}
                        </span>
                      </td>
                      <td className="py-4 px-6">{getActionBadge(l.action)}</td>
                      <td className="py-4 px-6">
                        <span className="text-xs font-mono bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                          {l.entityType}{l.entityId ? ` #${l.entityId}` : ""}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs text-stone-400 font-mono">
                        {l.ipHash ? `${l.ipHash.slice(0, 10)}...` : "—"}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setExpandedLogId(expandedLogId === l.id ? null : l.id)}
                          className="px-2.5 py-1 text-xs text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors font-mono"
                        >
                          {expandedLogId === l.id ? "Ocultar" : "JSON"}
                        </button>
                      </td>
                    </tr>
                    {expandedLogId === l.id && (
                      <tr className="bg-stone-900 text-amber-200">
                        <td colSpan={6} className="p-4 font-mono text-xs overflow-x-auto">
                          <div className="flex items-center justify-between text-stone-400 text-[10px] mb-2 uppercase tracking-widest border-b border-stone-800 pb-1">
                            <span>Detalle Estructurado (Payload JSON)</span>
                            <span>ID Evento: {l.id}</span>
                          </div>
                          <pre className="whitespace-pre-wrap">{JSON.stringify(JSON.parse(l.detailsJson || "{}"), null, 2)}</pre>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
