"use client";

import React, { useState } from "react";
import type { ClaimRecordDTO } from "@vc/api-client";

export interface ClaimLookupSectionProps {
  onLookup: (claimCode: string) => Promise<ClaimRecordDTO>;
}

export const ClaimLookupSection: React.FC<ClaimLookupSectionProps> = ({ onLookup }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [claim, setClaim] = useState<ClaimRecordDTO | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setClaim(null);
      const res = await onLookup(code.trim().toUpperCase());
      setClaim(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "No se encontró el reclamo con el código indicado";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">Atendido / Resuelto</span>;
      case "IN_PROGRESS":
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800">En Evaluación Legal</span>;
      case "REJECTED":
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-800">Improcedente / Rechazado</span>;
      case "PENDING":
      default:
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800">Pendiente de Revisión</span>;
    }
  };

  return (
    <section className="bg-slate-100/70 rounded-3xl p-6 sm:p-10 border border-slate-200/80 max-w-4xl mx-auto my-10">
      <div className="text-center max-w-xl mx-auto mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          ¿Ya tienes una reclamación en curso?
        </h2>
        <p className="text-xs text-slate-600">
          Ingresa tu código único (ej. <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono text-brand-navy font-bold">REC-2026-0001</code>) para consultar el estado del trámite y las respuestas emitidas.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="REC-2026-XXXX"
          className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm font-mono uppercase focus:ring-2 focus:ring-brand-accent focus:outline-none"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all disabled:opacity-50"
        >
          {loading ? "Buscando..." : "Consultar Estado"}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs max-w-md mx-auto text-center">
          {error}
        </div>
      )}

      {claim && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 max-w-2xl mx-auto animate-fadeIn shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs text-slate-400 font-medium">Código:</span>{" "}
              <strong className="font-mono text-brand-navy">{claim.claimCode}</strong>
            </div>
            <div>{getStatusBadge(claim.status)}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
            <div><strong className="text-slate-900">Consumidor:</strong> {claim.fullName}</div>
            <div><strong className="text-slate-900">Fecha de Registro:</strong> {new Date(claim.createdAt || "").toLocaleDateString("es-PE")}</div>
            <div><strong className="text-slate-900">Tipo:</strong> {claim.claimType}</div>
            <div><strong className="text-slate-900">Bien:</strong> {claim.contractedType} ({claim.description})</div>
          </div>

          {claim.responseNotes && (
            <div className="bg-brand-navy/5 border border-brand-navy/10 rounded-xl p-4 text-xs text-slate-800 space-y-1">
              <div className="font-bold text-brand-navy">Respuesta Oficial de la Agencia:</div>
              <p className="leading-relaxed">{claim.responseNotes}</p>
              {claim.responseAt && (
                <div className="text-[11px] text-brand-navy/70 pt-1">
                  Respondido el {new Date(claim.responseAt).toLocaleString("es-PE")}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
