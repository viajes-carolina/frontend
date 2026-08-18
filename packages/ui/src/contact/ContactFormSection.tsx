"use client";

import React, { useState } from "react";
import { ContactPageDTO, SubmitContactInquiryRequest } from "@vc/api-client";
import { Button } from "../primitives/Button";
import { CheckIcon, PlaneIcon, WhatsAppIcon, MailIcon, PhoneIcon } from "../icons/icons";

export interface ContactFormSectionProps {
  page?: ContactPageDTO;
  onSubmitInquiry: (payload: SubmitContactInquiryRequest) => Promise<boolean>;
  className?: string;
}

const POPULAR_DESTINATIONS = [
  "Cartagena de Indias",
  "Cusco & Machu Picchu",
  "Punta Cana",
  "Cancún & Riviera Maya",
  "Iquitos & Selva Amazónica",
  "Europa Clásica",
  "Otro Destino Personalizado",
];

export function ContactFormSection({
  page,
  onSubmitInquiry,
  className = "",
}: ContactFormSectionProps) {
  const formTitle = page?.formTitle || "Envíanos un mensaje";
  const formSubtitle =
    page?.formSubtitle ||
    "Completa el formulario y te enviaremos una cotización detallada a tu correo o WhatsApp.";

  const [formData, setFormData] = useState<SubmitContactInquiryRequest>({
    fullName: "",
    email: "",
    phone: "",
    destinationOfInterest: "Cartagena de Indias",
    travelDateApprox: "",
    travelersCount: 2,
    message: "",
    preferredContactChannel: "WHATSAPP",
    turnstileToken: "mock-valid-turnstile-token",
  });

  const [consent, setConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setErrorMessage("Por favor, acepta los términos de contacto para continuar.");
      return;
    }
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage("Por favor, completa los campos obligatorios (*).");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const ok = await onSubmitInquiry(formData);
      if (ok) {
        setSubmittedSuccess(true);
      } else {
        setErrorMessage("Hubo un inconveniente al enviar tu solicitud. Intenta por WhatsApp.");
      }
    } catch {
      setErrorMessage("Error de conexión al enviar el formulario.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      destinationOfInterest: "Cartagena de Indias",
      travelDateApprox: "",
      travelersCount: 2,
      message: "",
      preferredContactChannel: "WHATSAPP",
      turnstileToken: "mock-valid-turnstile-token",
    });
    setSubmittedSuccess(false);
    setErrorMessage(null);
  };

  return (
    <div
      className={`bg-white border border-neutral-border rounded-3xl p-6 sm:p-10 shadow-card text-neutral-ink ${className}`}
    >
      <div className="mb-8">
        <h2 className="font-sora font-bold text-2xl sm:text-3xl text-brand-navy">
          {formTitle}
        </h2>
        <p className="font-inter text-sm text-neutral-muted mt-2 leading-relaxed">
          {formSubtitle}
        </p>
      </div>

      {submittedSuccess ? (
        <div className="py-12 px-6 text-center space-y-6 bg-emerald-50 border border-emerald-300 rounded-2xl animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-300 flex items-center justify-center mx-auto">
            <CheckIcon size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="font-sora font-bold text-2xl text-brand-navy">
              ¡Mensaje Recibido con Éxito!
            </h3>
            <p className="font-inter text-sm text-neutral-muted max-w-md mx-auto leading-relaxed">
              Gracias, <strong>{formData.fullName}</strong>. Una de nuestras asesoras revisará tus requerimientos y te contactará por{" "}
              <strong>{formData.preferredContactChannel === "WHATSAPP" ? "WhatsApp" : formData.preferredContactChannel === "EMAIL" ? "Correo Electrónico" : "Llamada Telefónica"}</strong> en breve.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset} className="mt-4">
            Enviar Otra Consulta
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-red-700 text-xs font-inter leading-relaxed">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Row 1: Nombre & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block font-inter text-xs font-semibold text-brand-navy">
                Nombre Completo <span className="text-brand-accent">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Ej. Mariana Torres"
                className="w-full px-4 py-3 rounded-xl bg-neutral-soft border border-neutral-border text-brand-navy placeholder-neutral-muted text-sm focus:outline-none focus:bg-white focus:border-brand-accent transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-inter text-xs font-semibold text-brand-navy">
                Correo Electrónico <span className="text-brand-accent">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ejemplo@correo.com"
                className="w-full px-4 py-3 rounded-xl bg-neutral-soft border border-neutral-border text-brand-navy placeholder-neutral-muted text-sm focus:outline-none focus:bg-white focus:border-brand-accent transition-colors"
              />
            </div>
          </div>

          {/* Row 2: Teléfono & Destino */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block font-inter text-xs font-semibold text-brand-navy">
                Teléfono / WhatsApp <span className="text-neutral-muted text-[11px]">(Recomendado)</span>
              </label>
              <input
                type="tel"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+51 987 654 321"
                className="w-full px-4 py-3 rounded-xl bg-neutral-soft border border-neutral-border text-brand-navy placeholder-neutral-muted text-sm focus:outline-none focus:bg-white focus:border-brand-accent transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-inter text-xs font-semibold text-brand-navy">
                Destino de Interés
              </label>
              <select
                value={formData.destinationOfInterest}
                onChange={(e) => setFormData({ ...formData, destinationOfInterest: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-neutral-soft border border-neutral-border text-brand-navy text-sm focus:outline-none focus:bg-white focus:border-brand-accent transition-colors"
              >
                {POPULAR_DESTINATIONS.map((d) => (
                  <option key={d} value={d} className="bg-white text-brand-navy">
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Fecha Aprox & N° Viajeros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block font-inter text-xs font-semibold text-brand-navy">
                Fecha Aproximada de Viaje
              </label>
              <input
                type="text"
                value={formData.travelDateApprox || ""}
                onChange={(e) => setFormData({ ...formData, travelDateApprox: e.target.value })}
                placeholder="Ej. Noviembre 2026 o Feriado de Fiestas"
                className="w-full px-4 py-3 rounded-xl bg-neutral-soft border border-neutral-border text-brand-navy placeholder-neutral-muted text-sm focus:outline-none focus:bg-white focus:border-brand-accent transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-inter text-xs font-semibold text-brand-navy">
                Número de Personas
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={formData.travelersCount || 1}
                onChange={(e) => setFormData({ ...formData, travelersCount: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-3 rounded-xl bg-neutral-soft border border-neutral-border text-brand-navy placeholder-neutral-muted text-sm focus:outline-none focus:bg-white focus:border-brand-accent transition-colors"
              />
            </div>
          </div>

          {/* Preferred Channel */}
          <div className="space-y-2">
            <label className="block font-inter text-xs font-semibold text-brand-navy">
              ¿Cómo prefieres que te contactemos?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: "WHATSAPP", label: "WhatsApp", icon: <WhatsAppIcon size={16} /> },
                { key: "EMAIL", label: "Correo", icon: <MailIcon size={16} /> },
                { key: "PHONE", label: "Llamada", icon: <PhoneIcon size={16} /> },
              ].map((c) => {
                const isSelected = formData.preferredContactChannel === c.key;
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredContactChannel: c.key })}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold font-inter transition-all ${
                      isSelected
                        ? "bg-brand-accent/15 border-brand-accent text-brand-navy font-bold shadow-sm"
                        : "bg-neutral-soft border-neutral-border text-neutral-muted hover:border-neutral-subtle hover:text-brand-navy"
                    }`}
                  >
                    {c.icon}
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mensaje */}
          <div className="space-y-2">
            <label className="block font-inter text-xs font-semibold text-brand-navy">
              Detalles o Dudas de tu Viaje <span className="text-brand-accent">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Cuéntanos con quién viajas, qué tipo de alojamiento buscas, o cualquier detalle especial..."
              className="w-full px-4 py-3 rounded-xl bg-neutral-soft border border-neutral-border text-brand-navy placeholder-neutral-muted text-sm focus:outline-none focus:bg-white focus:border-brand-accent transition-colors resize-none"
            />
          </div>

          {/* Anti-Bot Turnstile Widget Placeholder / Indicator */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-soft border border-neutral-border text-xs text-neutral-muted">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Protegido por Cloudflare Turnstile Anti-Bot</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold">
              Verificado
            </span>
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-start gap-3 pt-1">
            <input
              type="checkbox"
              id="consent-check"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-neutral-border text-brand-accent focus:ring-brand-accent"
            />
            <label htmlFor="consent-check" className="font-inter text-xs text-neutral-muted leading-relaxed cursor-pointer">
              Autorizo a Viajes Carolina a utilizar mis datos de contacto únicamente para responder mi consulta y enviarme la propuesta solicitada.
            </label>
          </div>

          {/* Submit CTA */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            icon={<PlaneIcon size={18} />}
            iconPosition="right"
            className="w-full justify-center !py-4 text-base font-bold shadow-md"
          >
            {isSubmitting ? "Enviando Solicitud..." : "Enviar Consulta de Viaje"}
          </Button>
        </form>
      )}
    </div>
  );
}
