"use client";

import React, { useState } from "react";
import type { AuditLogDTO } from "@vc/api-client";
import { Badge, type BadgeTone } from "../primitives/Badge";
import { Button } from "../primitives/Button";
import { ClipboardListIcon, RefreshCwIcon } from "../icons/icons";
import { TableSkeletonRows } from "../primitives/Skeleton";
import { EmptyState } from "../states/EmptyState";

export interface AuditLogsViewerProps {
  logs: AuditLogDTO[];
  loading?: boolean;
  selectedEntityType?: string;
  onSelectEntityType: (entityType: string) => void;
  onRefresh?: () => void;
}

const CATEGORIES = [
  { label: "Todos", value: "ALL" },
  { label: "Autenticación", value: "AUTH" },
  { label: "Usuarios", value: "USER" },
  { label: "Reclamaciones", value: "CLAIM" },
  { label: "Promociones", value: "PROMOTION" },
  { label: "Configuración", value: "SITE_SETTINGS" },
  { label: "Sistema", value: "SYSTEM" },
];

/**
 * Tono SEMÁNTICO de la acción registrada. La bitácora se lee buscando lo que
 * salió mal, así que el tono clasifica por CONSECUENCIA y no por color previo:
 *
 *   CREATE / PUBLISH   success  algo entró en producción y salió bien.
 *   UPDATE / PATCH     info     cambio ordinario sobre algo que ya existía.
 *   DELETE / FAILED    danger   se destruyó algo o el intento falló.
 *   resto              neutral  lecturas, inicios de sesión, eventos de sistema.
 *
 * El código de la acción (`USER_DELETE`, `AUTH_LOGIN_FAILED`…) va escrito
 * dentro del badge: el tono acompaña, nunca sustituye al texto.
 */
function actionBadgeTone(action: string): BadgeTone {
  if (action.includes("DELETE") || action.includes("FAILED")) return "danger";
  if (action.includes("CREATE") || action.includes("PUBLISH")) return "success";
  if (action.includes("UPDATE") || action.includes("PATCH")) return "info";
  return "neutral";
}

export const AuditLogsViewer: React.FC<AuditLogsViewerProps> = ({
  logs,
  loading = false,
  selectedEntityType = "ALL",
  onSelectEntityType,
  onRefresh,
}) => {
  const [expandedLogId, setExpandedLogId] = useState<number | null>(null);
  const isFiltered = selectedEntityType !== "ALL";

  return (
    <div className="space-y-6 font-inter">
      {/* Encabezado */}
      <div className="flex flex-col justify-between gap-4 rounded-[12px] border border-neutral-border bg-white p-6 shadow-[0_8px_24px_rgba(17,34,48,0.06)] sm:flex-row sm:items-center">
        <div>
          <h2 className="font-inter text-[18px] font-bold leading-tight text-neutral-ink">
            Bitácora de Auditoría &amp; Trazabilidad
          </h2>
          <p className="mt-1.5 max-w-3xl font-inter text-[13px] leading-[1.55] text-neutral-muted">
            Registro cronológico inmutable de mutaciones administrativas, inicios de sesión y cambios de gobernanza.
          </p>
        </div>
        {onRefresh && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={<RefreshCwIcon size={15} aria-hidden="true" />}
            iconPosition="left"
            onClick={onRefresh}
            className="self-start sm:self-auto"
          >
            Actualizar bitácora
          </Button>
        )}
      </div>

      {/* Filtros de Entidad */}
      <div className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => onSelectEntityType(cat.value)}
            aria-pressed={selectedEntityType === cat.value}
            className={`whitespace-nowrap rounded-[7px] px-4 py-2 text-xs font-semibold transition-colors ${
              selectedEntityType === cat.value
                ? "bg-brand-accent text-on-accent shadow-sm"
                : "border border-neutral-border bg-white text-neutral-muted hover:border-admin-checkbox hover:text-neutral-ink"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Lista de Registros */}
      <div className="overflow-hidden rounded-[12px] border border-neutral-border bg-white shadow-[0_8px_24px_rgba(17,34,48,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-admin-divider bg-neutral-soft text-[11px] font-bold uppercase tracking-[0.55px] text-admin-label">
                <th className="px-6 py-4">Fecha / Hora</th>
                <th className="px-6 py-4">Operador</th>
                <th className="px-6 py-4">Acción</th>
                <th className="px-6 py-4">Entidad</th>
                <th className="px-6 py-4">Hash IP</th>
                <th className="px-6 py-4 text-right">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-divider">
              {loading && logs.length === 0 ? (
                <TableSkeletonRows columns={6} />
              ) : logs.length === 0 ? (
                <tr>
                  {/* Dos vacíos distintos, y la diferencia importa en una
                      bitácora: "todavía no hay nada registrado" es una
                      afirmación sobre el sistema; "ningún registro pasa este
                      filtro" es una afirmación sobre el filtro. Confundirlos
                      hace creer que no ocurrió nada cuando sí ocurrió. */}
                  <td colSpan={6} className="p-0">
                    {isFiltered ? (
                      <EmptyState
                        title="Ningún registro coincide"
                        message="No hay eventos de esta categoría en los últimos registros. Los demás siguen guardados."
                        icon={<ClipboardListIcon size={28} aria-hidden="true" />}
                        action={{
                          label: "Ver todas las categorías",
                          onClick: () => onSelectEntityType("ALL"),
                        }}
                      />
                    ) : (
                      <EmptyState
                        title="Aún no hay registros de auditoría"
                        message="En cuanto alguien inicie sesión o modifique contenido, el evento quedará anotado aquí."
                        icon={<ClipboardListIcon size={28} aria-hidden="true" />}
                      />
                    )}
                  </td>
                </tr>
              ) : (
                logs.map((l) => (
                  <React.Fragment key={l.id}>
                    <tr className="transition-colors hover:bg-neutral-soft">
                      <td className="whitespace-nowrap px-6 py-4 text-xs text-neutral-muted">
                        {new Date(l.createdAt).toLocaleString("es-PE")}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-semibold text-admin-value">@{l.username}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge tone={actionBadgeTone(l.action)}>{l.action}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-[6px] bg-neutral-soft px-2 py-0.5 font-mono text-xs text-admin-label">
                          {l.entityType}
                          {l.entityId ? ` #${l.entityId}` : ""}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-admin-footnote">
                        {l.ipHash ? `${l.ipHash.slice(0, 10)}...` : "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setExpandedLogId(expandedLogId === l.id ? null : l.id)}
                          aria-expanded={expandedLogId === l.id}
                          className="rounded-[6px] bg-neutral-soft px-2.5 py-1 font-mono text-xs text-neutral-muted transition-colors hover:bg-neutral-surface hover:text-neutral-ink"
                        >
                          {expandedLogId === l.id ? "Ocultar" : "JSON"}
                        </button>
                      </td>
                    </tr>
                    {expandedLogId === l.id && (
                      <tr className="bg-brand-navy text-admin-on-navy">
                        <td colSpan={6} className="overflow-x-auto p-4 font-mono text-xs">
                          <div className="mb-2 flex items-center justify-between border-b border-white/15 pb-1 text-[10px] uppercase tracking-widest text-admin-on-navy/80">
                            <span>Detalle Estructurado (Payload JSON)</span>
                            <span>ID Evento: {l.id}</span>
                          </div>
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(JSON.parse(l.detailsJson || "{}"), null, 2)}
                          </pre>
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
