"use client";

import React, { useState } from "react";
import type { PublishRequestDTO, PublishResponseDTO } from "@vc/api-client";

export interface PublishingManagerCardProps {
  lastPublishStatus: PublishResponseDTO | null;
  onPublish: (req: PublishRequestDTO) => Promise<PublishResponseDTO>;
  loading?: boolean;
  draftUrl: string;
}

export const PublishingManagerCard: React.FC<PublishingManagerCardProps> = ({
  lastPublishStatus,
  onPublish,
  loading = false,
  draftUrl,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<string>("ALL");
  const [reason, setReason] = useState<string>("");
  const [publishResult, setPublishResult] = useState<PublishResponseDTO | null>(lastPublishStatus);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const targets = [
    { value: "ALL", label: "Todo el Sitio", desc: "Revalida todas las páginas públicas (Home, Promociones, Blog, Nosotros, Contacto, Reclamaciones)" },
    { value: "HOME", label: "Portada & Hero", desc: "Revalida Hero, Intenciones de viaje, Promociones destacadas y Testimonios" },
    { value: "PROMOTIONS", label: "Catálogo de Promociones", desc: "Revalida el listado de paquetes y detalles de oferta" },
    { value: "BLOG", label: "Blog & Contenidos", desc: "Revalida artículos, categorías e inspiración del blog" },
    { value: "ABOUT", label: "Nosotros & Asesoras", desc: "Revalida historia institucional y perfiles de asesoras" },
    { value: "CONTACT", label: "Contacto & Soporte", desc: "Revalida canales directos y enlaces de oficina" },
  ];

  const handlePublish = async () => {
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const res = await onPublish({
        target: selectedTarget,
        reason: reason.trim() || "Actualización de contenidos desde panel de gobernanza",
      });
      setPublishResult(res);
      setReason("");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error al disparar la publicación ISR.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <span>🚀</span>
            <span>Publicación On-Demand ISR & Control de Caché</span>
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Invalida instantáneamente la caché estática de Next.js App Router mediante webhooks de revalidación atómica.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={draftUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors flex items-center gap-1.5"
          >
            <span>👁️</span>
            <span>Modo Borrador (Draft)</span>
          </a>
        </div>
      </div>

      {/* Selector de Ámbito */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-stone-900">1. Selecciona el Ámbito de Revalidación</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {targets.map((t) => (
            <label
              key={t.value}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                selectedTarget === t.value
                  ? "border-amber-600 bg-amber-50/50 ring-2 ring-amber-500/20"
                  : "border-stone-200 hover:border-stone-300 bg-stone-50/30"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-stone-900 text-sm">{t.label}</div>
                  <div className="text-xs text-stone-500 mt-1 leading-relaxed">{t.desc}</div>
                </div>
                <input
                  type="radio"
                  name="publishTarget"
                  value={t.value}
                  checked={selectedTarget === t.value}
                  onChange={(e) => setSelectedTarget(e.target.value)}
                  className="mt-1 text-amber-600 focus:ring-amber-500"
                />
              </div>
            </label>
          ))}
        </div>

        {/* Motivo de Publicación */}
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
            Motivo / Nota de Publicación (para Bitácora de Auditoría)
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ej. Actualización de paquetes de temporada de verano y ajustes en portada"
            className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 bg-stone-50/50"
          />
        </div>

        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-xl">
            {errorMsg}
          </div>
        )}

        {/* Botón de Publicación */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-100">
          <div className="text-xs text-stone-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Caché estática lista para revalidación tag-based</span>
          </div>

          <button
            onClick={handlePublish}
            disabled={submitting || loading}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Revalidando Caché en Next.js...</span>
              </>
            ) : (
              <>
                <span>⚡</span>
                <span>Publicar Cambios en Vivo (On-Demand ISR)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Estado y Resultado de Publicación */}
      {publishResult && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <span>✅</span>
              <span>Estado de la Última Publicación</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {publishResult.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
              <span className="text-stone-500 block">Fecha y Hora</span>
              <span className="font-semibold text-stone-900 mt-0.5 block">
                {new Date(publishResult.publishedAt).toLocaleString("es-PE")}
              </span>
            </div>
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
              <span className="text-stone-500 block">Operador / Disparador</span>
              <span className="font-semibold text-stone-900 mt-0.5 block font-mono">
                @{publishResult.triggeredBy}
              </span>
            </div>
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
              <span className="text-stone-500 block">Rutas Revalidadas</span>
              <span className="font-semibold text-stone-900 mt-0.5 block">
                {publishResult.revalidatedTags.length} rutas actualizadas
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs text-stone-500 block mb-1.5">Tags y rutas invalidadas:</span>
            <div className="flex flex-wrap gap-1.5">
              {publishResult.revalidatedTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-stone-100 text-stone-700 border border-stone-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <p className="text-xs text-stone-600 bg-amber-50/50 p-3 rounded-xl border border-amber-200/50">
            {publishResult.message}
          </p>
        </div>
      )}
    </div>
  );
};
