"use client";

import React, { useState } from "react";
import type { ClaimRecordDTO, SubmitClaimRequest } from "@vc/api-client";

export interface ClaimFormSectionProps {
  onSubmitClaim: (payload: SubmitClaimRequest) => Promise<ClaimRecordDTO>;
}

export const ClaimFormSection: React.FC<ClaimFormSectionProps> = ({ onSubmitClaim }) => {
  const [formData, setFormData] = useState<SubmitClaimRequest>({
    fullName: "",
    documentType: "DNI",
    documentNumber: "",
    email: "",
    phone: "",
    address: "",
    isMinor: false,
    parentName: "",
    parentDocument: "",
    contractedType: "SERVICIO",
    claimedAmount: undefined,
    currency: "PEN",
    description: "",
    claimType: "RECLAMO",
    consumerDetail: "",
    consumerRequest: "",
    turnstileToken: "turnstile-verified-token",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedClaim, setSubmittedClaim] = useState<ClaimRecordDTO | null>(null);
  const [declaredTruth, setDeclaredTruth] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!declaredTruth) {
      setError("Debes aceptar la declaración jurada para registrar la hoja de reclamación.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await onSubmitClaim(formData);
      setSubmittedClaim(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al enviar la reclamación";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (submittedClaim) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl max-w-3xl mx-auto my-12 text-center animate-fadeIn">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          ✓
        </div>
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3">
          Registro Exitoso conforme a Ley
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          Hoja de Reclamación Registrada
        </h2>
        <p className="text-slate-600 text-sm mb-6 max-w-lg mx-auto">
          Hemos recibido tu solicitud formal. Se ha enviado una copia íntegra de esta constancia al correo proporcionado: <strong className="text-slate-900">{submittedClaim.email}</strong>.
        </p>

        {/* Claim Code Box */}
        <div className="bg-slate-50 border-2 border-dashed border-brand-navy/30 rounded-2xl p-6 mb-8 max-w-md mx-auto">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Código de Reclamación
          </div>
          <div className="text-2xl sm:text-3xl font-black text-brand-navy font-mono tracking-widest">
            {submittedClaim.claimCode}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Plazo máximo legal de respuesta: <strong>15 días hábiles</strong>.
          </p>
        </div>

        {/* Summary Card */}
        <div className="text-left bg-slate-50/80 rounded-2xl p-6 border border-slate-200 text-xs text-slate-700 space-y-2 mb-8">
          <div><strong className="text-slate-900">Consumidor:</strong> {submittedClaim.fullName} ({submittedClaim.documentType}: {submittedClaim.documentNumber})</div>
          <div><strong className="text-slate-900">Tipo:</strong> {submittedClaim.claimType} de {submittedClaim.contractedType}</div>
          <div><strong className="text-slate-900">Fecha y Hora:</strong> {new Date(submittedClaim.createdAt || "").toLocaleString("es-PE")}</div>
          <div><strong className="text-slate-900">Detalle:</strong> {submittedClaim.consumerDetail}</div>
          <div><strong className="text-slate-900">Pedido Concreto:</strong> {submittedClaim.consumerRequest}</div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-all shadow-sm"
          >
            🖨️ Imprimir / Guardar en PDF
          </button>
          <a
            href="/"
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all"
          >
            Volver al Inicio
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl max-w-4xl mx-auto my-12 space-y-10">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
          {error}
        </div>
      )}

      {/* 1. Datos del Consumidor Reclamante */}
      <div>
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-brand-navy text-white font-bold flex items-center justify-center text-sm shadow">
            1
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Identificación del Consumidor Reclamante
            </h2>
            <p className="text-xs text-slate-500">
              Ingresa tus datos personales tal como figuran en tu documento de identidad oficial.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Nombres y Apellidos Completos *
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Ej. Juan Carlos Pérez Alarcón"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Tipo de Documento *
            </label>
            <select
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-accent focus:outline-none"
            >
              <option value="DNI">DNI (Documento Nacional de Identidad)</option>
              <option value="CE">CE (Carné de Extranjería)</option>
              <option value="PASAPORTE">Pasaporte</option>
              <option value="RUC">RUC</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Número de Documento *
            </label>
            <input
              type="text"
              name="documentNumber"
              required
              value={formData.documentNumber}
              onChange={handleChange}
              placeholder="Ej. 45892314"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Correo Electrónico *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Teléfono Celular / Contacto *
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+51 987 654 321"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-accent focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Domicilio Legal (Dirección, Distrito y Ciudad) *
            </label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              placeholder="Ej. Calle Las Flores 230, Dpto 402, Miraflores, Lima"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-accent focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer py-1">
              <input
                type="checkbox"
                name="isMinor"
                checked={formData.isMinor}
                onChange={handleChange}
                className="w-4 h-4 rounded text-brand-accent focus:ring-brand-accent"
              />
              <span className="text-xs font-semibold text-slate-700">
                El reclamante es menor de edad (se requiere consignar datos de padre, madre o apoderado legal)
              </span>
            </label>
          </div>

          {formData.isMinor && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Nombre de Padre/Madre/Apoderado *
                </label>
                <input
                  type="text"
                  name="parentName"
                  required={formData.isMinor}
                  value={formData.parentName || ""}
                  onChange={handleChange}
                  placeholder="Nombre del apoderado"
                  className="w-full px-4 py-3 bg-amber-50/50 border border-amber-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  DNI/Doc. del Apoderado *
                </label>
                <input
                  type="text"
                  name="parentDocument"
                  required={formData.isMinor}
                  value={formData.parentDocument || ""}
                  onChange={handleChange}
                  placeholder="Doc. del apoderado"
                  className="w-full px-4 py-3 bg-amber-50/50 border border-amber-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-accent focus:outline-none"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. Identificación del Bien Contratado */}
      <div>
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-brand-navy text-white font-bold flex items-center justify-center text-sm shadow">
            2
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Identificación del Bien Contratado
            </h2>
            <p className="text-xs text-slate-500">
              Detalla el producto o servicio turístico contratado objeto del reclamo.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Tipo de Bien *
            </label>
            <select
              name="contractedType"
              value={formData.contractedType}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-accent focus:outline-none"
            >
              <option value="SERVICIO">Servicio Turístico / Paquete de Viaje</option>
              <option value="PRODUCTO">Producto / Bien Físico</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Monto Reclamado (Opcional)
            </label>
            <input
              type="number"
              step="0.01"
              name="claimedAmount"
              value={formData.claimedAmount || ""}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Moneda
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-accent focus:outline-none"
            >
              <option value="PEN">Soles (PEN - S/)</option>
              <option value="USD">Dólares Americanos (USD - $)</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Descripción del Bien o Servicio Contratado *
            </label>
            <input
              type="text"
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Ej. Paquete turístico a Punta Cana con salida el 15/07/2026, reserva #48291"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-accent focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. Detalle de la Reclamación */}
      <div>
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-brand-navy text-white font-bold flex items-center justify-center text-sm shadow">
            3
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Detalle de la Reclamación y Pedido del Consumidor
            </h2>
            <p className="text-xs text-slate-500">
              Selecciona si es un Reclamo o una Queja según las definiciones legales de Indecopi.
            </p>
          </div>
        </div>

        {/* Legal Explanatory Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <label
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              formData.claimType === "RECLAMO"
                ? "border-brand-accent bg-brand-accent/5 shadow-sm"
                : "border-slate-200 bg-slate-50 hover:bg-slate-100/70"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <input
                type="radio"
                name="claimType"
                value="RECLAMO"
                checked={formData.claimType === "RECLAMO"}
                onChange={handleChange}
                className="text-brand-accent focus:ring-brand-accent"
              />
              <span className="font-extrabold text-sm text-slate-900">RECLAMO</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Disconformidad relacionada a los bienes o servicios turísticos contratados.
            </p>
          </label>

          <label
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              formData.claimType === "QUEJA"
                ? "border-brand-accent bg-brand-accent/5 shadow-sm"
                : "border-slate-200 bg-slate-50 hover:bg-slate-100/70"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <input
                type="radio"
                name="claimType"
                value="QUEJA"
                checked={formData.claimType === "QUEJA"}
                onChange={handleChange}
                className="text-brand-accent focus:ring-brand-accent"
              />
              <span className="font-extrabold text-sm text-slate-900">QUEJA</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Disconformidad no relacionada a los servicios, o malestar respecto a la atención recibida.
            </p>
          </label>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Detalle de los Hechos (Explicación clara y circunstanciada) *
            </label>
            <textarea
              name="consumerDetail"
              required
              rows={4}
              value={formData.consumerDetail}
              onChange={handleChange}
              placeholder="Describe lo ocurrido indicando fechas, personas involucradas y motivos de tu disconformidad..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Pedido Concreto del Consumidor *
            </label>
            <textarea
              name="consumerRequest"
              required
              rows={3}
              value={formData.consumerRequest}
              onChange={handleChange}
              placeholder="Indica la solución o pretensión que solicitas a la agencia (ej. reprogramación, compensación, etc.)..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-accent focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 4. Declaración Jurada y Envío */}
      <div className="pt-6 border-t border-slate-200 space-y-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={declaredTruth}
            onChange={(e) => setDeclaredTruth(e.target.checked)}
            className="w-5 h-5 rounded text-brand-accent focus:ring-brand-accent mt-0.5"
          />
          <span className="text-xs text-slate-600 leading-relaxed">
            Declaro bajo juramento que los datos e información consignados en la presente Hoja de Reclamación son verdaderos y fidedignos, de conformidad con la Ley N° 29571.
          </span>
        </label>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span>🔒 Formulario protegido con verificación anti-bot</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-4 bg-brand-accent hover:bg-brand-sunset text-white font-extrabold text-sm rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Registrando Reclamación...</span>
              </>
            ) : (
              <span>Enviar Hoja de Reclamación</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
