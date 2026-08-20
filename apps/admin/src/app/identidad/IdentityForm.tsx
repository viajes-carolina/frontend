"use client";

import { useAdminSettings } from "../../hooks/useAdminSettings";
import { SiteSettingsDTO } from "@vc/api-client";
import { Button, CheckIcon } from "@vc/ui";

export interface IdentityFormProps {
  initialSettings: SiteSettingsDTO;
}

export function IdentityForm({ initialSettings }: IdentityFormProps) {
  const { settings, isSaving, saveSuccess, updateField, handleSave } = useAdminSettings(initialSettings);

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
          <CheckIcon size={20} className="text-emerald-600 shrink-0" />
          <span className="font-medium text-sm">Cambios guardados correctamente y sincronizados con la web pública.</span>
        </div>
      )}

      {/* Sección Marca & General */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm space-y-6">
        <h2 className="font-sora font-bold text-lg text-brand-navy border-b border-neutral-border pb-3">
          Identidad de Marca
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              Nombre de la Agencia
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => updateField("siteName", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
              required
            />
          </div>

          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              Lema / Tagline
            </label>
            <input
              type="text"
              value={settings.brandTagline}
              onChange={(e) => updateField("brandTagline", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>
        </div>
      </div>

      {/* Información Legal (Libro de Reclamaciones — Ley N° 29571) */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm space-y-6">
        <h2 className="font-sora font-bold text-lg text-brand-navy border-b border-neutral-border pb-3">
          Información Legal
        </h2>
        <p className="text-xs text-neutral-muted -mt-4">
          Se muestra en el Libro de Reclamaciones Virtual, exigido por la Ley N° 29571.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              Razón Social
            </label>
            <input
              type="text"
              value={settings.legalCompanyName || ""}
              onChange={(e) => updateField("legalCompanyName", e.target.value)}
              placeholder="VIAJES CAROLINA S.A.C."
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
              required
            />
          </div>

          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              RUC
            </label>
            <input
              type="text"
              value={settings.taxId || ""}
              onChange={(e) => updateField("taxId", e.target.value)}
              placeholder="20601234567"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
              required
            />
          </div>
        </div>
      </div>

      {/* Sección WhatsApp & Contacto */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm space-y-6">
        <h2 className="font-sora font-bold text-lg text-brand-navy border-b border-neutral-border pb-3">
          Canal WhatsApp (Fuente Única de Contacto)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              Número E.164 (wa.me)
            </label>
            <input
              type="text"
              value={settings.whatsappPhone}
              onChange={(e) => updateField("whatsappPhone", e.target.value)}
              placeholder="+51987654321"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-whatsapp"
              required
            />
            <span className="text-xs text-neutral-muted mt-1 block">
              Formato internacional con signo + y código de país, sin espacios (para enlaces wa.me).
            </span>
          </div>

          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              Número para Mostrar
            </label>
            <input
              type="text"
              value={settings.whatsappDisplayNumber}
              onChange={(e) => updateField("whatsappDisplayNumber", e.target.value)}
              placeholder="+51 987 654 321"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-whatsapp"
              required
            />
            <span className="text-xs text-neutral-muted mt-1 block">
              Formato legible con espacios, usado en el sitio (footer, header, contacto).
            </span>
          </div>
        </div>

        <div>
          <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
            Correo Electrónico Oficial
          </label>
          <input
            type="email"
            value={settings.contactEmail}
            onChange={(e) => updateField("contactEmail", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
            required
          />
        </div>

        <div>
          <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
            Mensaje Predeterminado de WhatsApp
          </label>
          <textarea
            rows={2}
            value={settings.whatsappDefaultMessage}
            onChange={(e) => updateField("whatsappDefaultMessage", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </div>
      </div>

      {/* Redes Sociales */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm space-y-6">
        <h2 className="font-sora font-bold text-lg text-brand-navy border-b border-neutral-border pb-3">
          Redes Sociales Oficiales
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              Instagram
            </label>
            <input
              type="url"
              value={settings.instagramUrl || ""}
              onChange={(e) => updateField("instagramUrl", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>

          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              Facebook
            </label>
            <input
              type="url"
              value={settings.facebookUrl || ""}
              onChange={(e) => updateField("facebookUrl", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>

          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              TikTok
            </label>
            <input
              type="url"
              value={settings.tiktokUrl || ""}
              onChange={(e) => updateField("tiktokUrl", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="primary" size="md" disabled={isSaving} type="submit">
          {isSaving ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>
    </form>
  );
}
