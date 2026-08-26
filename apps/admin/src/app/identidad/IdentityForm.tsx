"use client";

import React, { useState } from "react";
import { useAdminSettings } from "../../hooks/useAdminSettings";
import { useUnsavedChangesGuard } from "../../hooks/useUnsavedChangesGuard";
import { SiteSettingsDTO } from "@vc/api-client";
import { CheckIcon, FormField, SaveBar, SectionRail, type SectionRailItem } from "@vc/ui";

export interface IdentityFormProps {
  initialSettings: SiteSettingsDTO;
}

const SECTION_DEFINITIONS: { id: string; label: string }[] = [
  { id: "marca", label: "Identidad de Marca" },
  { id: "legal", label: "Información Legal" },
  { id: "whatsapp", label: "Canal WhatsApp (Fuente Única de Contacto)" },
  { id: "redes", label: "Redes Sociales Oficiales" },
];

export function IdentityForm({ initialSettings }: IdentityFormProps) {
  const { settings, isSaving, saveSuccess, isDirty, discardChanges, updateField, handleSave } =
    useAdminSettings(initialSettings);

  const [activeSection, setActiveSection] = useState("marca");

  useUnsavedChangesGuard(isDirty);

  // No hay una forma barata de saber qué sub-sección específica cambió sin
  // trackear cada campo por separado — como simplificación, el punto de
  // "modificado" se muestra en las 4 secciones mientras exista cualquier
  // cambio pendiente en el formulario completo.
  const sectionItems: SectionRailItem[] = SECTION_DEFINITIONS.map((def) => ({ ...def, modified: isDirty }));

  return (
    <>
      {saveSuccess && (
        <div className="mb-8 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
          <CheckIcon size={20} className="text-emerald-600 shrink-0" />
          <span className="font-medium text-sm">Cambios guardados correctamente y sincronizados con la web pública.</span>
        </div>
      )}

      <div className="flex gap-8 pb-24">
        <SectionRail
          items={sectionItems}
          activeId={activeSection}
          onSelect={setActiveSection}
          className="w-64 shrink-0"
        />

        <div className="flex-1 min-w-0 max-w-4xl">
          {/* 1. Identidad de Marca */}
          {activeSection === "marca" && (
            <div role="tabpanel" id="panel-marca" aria-labelledby="tab-marca">
              <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm space-y-6">
                <h2 className="font-sora font-bold text-lg text-brand-navy border-b border-neutral-border pb-3">
                  Identidad de Marca
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <FormField
                      label="Nombre de la Agencia"
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => updateField("siteName", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <FormField
                      label="Lema / Tagline"
                      type="text"
                      value={settings.brandTagline}
                      onChange={(e) => updateField("brandTagline", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Información Legal */}
          {activeSection === "legal" && (
            <div role="tabpanel" id="panel-legal" aria-labelledby="tab-legal">
              <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm space-y-6">
                <div>
                  <h2 className="font-sora font-bold text-lg text-brand-navy border-b border-neutral-border pb-3">
                    Información Legal
                  </h2>
                  <p className="text-xs text-neutral-muted mt-2">
                    Se muestra en el Libro de Reclamaciones Virtual, exigido por la Ley N° 29571.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <FormField
                      label="Razón Social"
                      type="text"
                      value={settings.legalCompanyName || ""}
                      onChange={(e) => updateField("legalCompanyName", e.target.value)}
                      placeholder="VIAJES CAROLINA S.A.C."
                      required
                    />
                  </div>

                  <div>
                    <FormField
                      label="RUC"
                      type="text"
                      value={settings.taxId || ""}
                      onChange={(e) => updateField("taxId", e.target.value)}
                      placeholder="20601234567"
                      required
                    />
                  </div>
                </div>

                <div>
                  <FormField
                    label="Enlace a Constancia MINCETUR (opcional)"
                    type="url"
                    value={settings.minceturCertificateUrl || ""}
                    onChange={(e) => updateField("minceturCertificateUrl", e.target.value)}
                    placeholder="https://..."
                  />
                  <span className="text-xs text-neutral-muted mt-1 block">
                    Si se configura, el footer del sitio muestra el enlace a la constancia de registro MINCETUR. Si se deja vacío, no se muestra.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 3. Canal WhatsApp */}
          {activeSection === "whatsapp" && (
            <div role="tabpanel" id="panel-whatsapp" aria-labelledby="tab-whatsapp">
              <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm space-y-6">
                <h2 className="font-sora font-bold text-lg text-brand-navy border-b border-neutral-border pb-3">
                  Canal WhatsApp (Fuente Única de Contacto)
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <FormField
                      label="Número E.164 (wa.me)"
                      type="text"
                      value={settings.whatsappPhone}
                      onChange={(e) => updateField("whatsappPhone", e.target.value)}
                      placeholder="+51987654321"
                      required
                    />
                    <span className="text-xs text-neutral-muted mt-1 block">
                      Formato internacional con signo + y código de país, sin espacios (para enlaces wa.me).
                    </span>
                  </div>

                  <div>
                    <FormField
                      label="Número para Mostrar"
                      type="text"
                      value={settings.whatsappDisplayNumber}
                      onChange={(e) => updateField("whatsappDisplayNumber", e.target.value)}
                      placeholder="+51 987 654 321"
                      required
                    />
                    <span className="text-xs text-neutral-muted mt-1 block">
                      Formato legible con espacios, usado en el sitio (footer, header, contacto).
                    </span>
                  </div>
                </div>

                <div>
                  <FormField
                    label="Correo Electrónico Oficial"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => updateField("contactEmail", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <FormField
                    label="Mensaje Predeterminado de WhatsApp"
                    multiline
                    rows={2}
                    value={settings.whatsappDefaultMessage}
                    onChange={(e) => updateField("whatsappDefaultMessage", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. Redes Sociales Oficiales */}
          {activeSection === "redes" && (
            <div role="tabpanel" id="panel-redes" aria-labelledby="tab-redes">
              <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm space-y-6">
                <h2 className="font-sora font-bold text-lg text-brand-navy border-b border-neutral-border pb-3">
                  Redes Sociales Oficiales
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <FormField
                      label="Instagram"
                      type="url"
                      value={settings.instagramUrl || ""}
                      onChange={(e) => updateField("instagramUrl", e.target.value)}
                    />
                  </div>

                  <div>
                    <FormField
                      label="Facebook"
                      type="url"
                      value={settings.facebookUrl || ""}
                      onChange={(e) => updateField("facebookUrl", e.target.value)}
                    />
                  </div>

                  <div>
                    <FormField
                      label="TikTok"
                      type="url"
                      value={settings.tiktokUrl || ""}
                      onChange={(e) => updateField("tiktokUrl", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <SaveBar
        dirty={isDirty}
        saving={isSaving}
        onSave={() => handleSave()}
        onDiscard={discardChanges}
        className="lg:left-64"
      />
    </>
  );
}
