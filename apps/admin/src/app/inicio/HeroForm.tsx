"use client";

import React, { useState } from "react";
import Image from "next/image";
import { HomeHeroDTO } from "@vc/api-client";
import { useAdminHomeHero } from "../../hooks/useAdminHomeHero";
import { useUnsavedChangesGuard } from "../../hooks/useUnsavedChangesGuard";
import { CheckIcon, Disclosure, FormField, SaveBar, SectionRail, type SectionRailItem } from "@vc/ui";
import { HeroPhotoSlot } from "../../components/HeroPhotoSlot";

export interface HeroFormProps {
  initialHero: HomeHeroDTO;
}

const SECTION_DEFINITIONS: { id: string; label: string }[] = [
  { id: "titulares", label: "Titulares & Mensaje Principal" },
  { id: "botones", label: "Botones de Acción & Conversación" },
  { id: "confianza", label: "Línea de Confianza" },
  { id: "fotos", label: "Collage de fotos de clientes" },
];

export function HeroForm({ initialHero }: HeroFormProps) {
  const {
    eyebrowText, setEyebrowText,
    titleHighlight, setTitleHighlight,
    titleAccent, setTitleAccent,
    description, setDescription,
    whatsappCtaText, setWhatsappCtaText,
    whatsappMessageOverride, setWhatsappMessageOverride,
    secondaryCtaText, setSecondaryCtaText,
    secondaryCtaUrl, setSecondaryCtaUrl,
    trustIndicators, setTrustIndicators,
    backgroundMediaId, backgroundMediaUrl,
    backgroundFocalX, backgroundFocalY,
    secondaryMedia1Id, secondaryMedia1Url, secondaryMedia1FocalX, secondaryMedia1FocalY,
    secondaryMedia2Id, secondaryMedia2Url, secondaryMedia2FocalX, secondaryMedia2FocalY,
    secondaryMedia3Id, secondaryMedia3Url, secondaryMedia3FocalX, secondaryMedia3FocalY,
    trustStatText, setTrustStatText,
    isSaving,
    statusMessage,
    isDirty,
    discardChanges,
    handleSelectBgMedia,
    handleSelectSecondary1Media,
    handleSelectSecondary2Media,
    handleSelectSecondary3Media,
    handleSave,
  } = useAdminHomeHero(initialHero);

  const [activeSection, setActiveSection] = useState("titulares");

  useUnsavedChangesGuard(isDirty);

  // No hay una forma barata de saber qué sub-sección específica cambió sin
  // trackear cada campo por separado — como simplificación, el punto de
  // "modificado" se muestra en las 4 secciones mientras exista cualquier
  // cambio pendiente en el formulario completo.
  const sectionItems: SectionRailItem[] = SECTION_DEFINITIONS.map((def) => ({ ...def, modified: isDirty }));

  const updateTrustIndicator = (index: number, value: string) => {
    const updated = [...trustIndicators];
    updated[index] = value;
    setTrustIndicators(updated);
  };

  const bgImageSrc = backgroundMediaUrl
    ? (backgroundMediaUrl.startsWith("http") || backgroundMediaUrl.startsWith("/") ? backgroundMediaUrl : `/${backgroundMediaUrl}`)
    : "/media/demo-cartagena-caribe.webp";

  return (
    <>
      {/* Notifications */}
      {statusMessage && (
        <div className="mb-8 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
          <CheckIcon size={20} className="text-emerald-600 shrink-0" />
          <span className="font-medium text-sm">{statusMessage}</span>
        </div>
      )}

      {/* Vista previa simplificada — el Hero real es marfil con collage de 3 fotos,
          esta tarjeta solo confirma texto/CTA y la foto principal, no replica el collage completo */}
      <div className="mb-8 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm border border-neutral-border bg-surface-ivory min-h-[280px] flex flex-col justify-between max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-neutral-border">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-sora text-xs font-bold uppercase tracking-wider text-neutral-muted">
              Vista previa (texto + foto principal)
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="relative w-full sm:w-48 aspect-4/3 rounded-2xl overflow-hidden shrink-0 bg-neutral-soft border border-neutral-border">
            <Image
              src={bgImageSrc}
              alt="Vista previa de la foto principal"
              fill
              unoptimized
              priority
              style={{
                objectFit: "cover",
                objectPosition: `${backgroundFocalX || 50}% ${backgroundFocalY || 50}%`,
              }}
            />
          </div>

          <div className="space-y-3 max-w-xl">
            <h1 className="font-display font-medium text-xl sm:text-2xl leading-tight text-brand-navy">
              {titleHighlight || "Tu viaje comienza"}{" "}
              {titleAccent || "con una conversación."}
            </h1>

            <p className="font-inter text-xs sm:text-sm text-neutral-muted line-clamp-2">
              {description || "Cuéntanos qué sueñas y diseñamos un viaje a tu medida."}
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-3">
              <div className="px-5 py-2.5 rounded-xl bg-brand-whatsapp text-brand-navy font-sora font-bold text-xs shadow-sm inline-flex items-center gap-2">
                <span>💬 {whatsappCtaText || "Cuéntanos qué imaginas por WhatsApp"}</span>
              </div>
            </div>

            {trustStatText && (
              <p className="font-inter text-xs text-neutral-muted pt-1">♡ {trustStatText}</p>
            )}
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-neutral-border text-[11px] text-neutral-muted font-inter">
          <p className="mb-1">
            Controla qué parte de la foto se ve primero al recortarla — ajústalo abajo, en la sección de fotos.
          </p>
          Punto focal de la foto principal: <strong>X {backgroundFocalX || 50}% · Y {backgroundFocalY || 50}%</strong> — las 3 fotos de apoyo se configuran más abajo, en &quot;Collage de fotos de clientes&quot;.
        </div>
      </div>

      <div className="flex gap-8 pb-24">
        <SectionRail
          items={sectionItems}
          activeId={activeSection}
          onSelect={setActiveSection}
          className="w-64 shrink-0"
        />

        <div className="flex-1 min-w-0 max-w-4xl">
          {/* 1. Titulares & Mensaje Principal */}
          {activeSection === "titulares" && (
            <div role="tabpanel" id="panel-titulares" aria-labelledby="tab-titulares">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-border shadow-sm space-y-6">
                <div>
                  <h2 className="font-sora font-bold text-lg text-brand-navy">
                    1. Titulares & Mensaje Principal (Hero Display)
                  </h2>
                  <p className="font-inter text-xs text-neutral-muted mt-1">
                    Configura la primera impresión que recibirán los viajeros al ingresar a la web.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <FormField
                      label="Insignia Superior (Pill Eyebrow)"
                      type="text"
                      value={eyebrowText}
                      onChange={(e) => setEyebrowText(e.target.value)}
                      placeholder="Ej: Empieza con una conversación"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <FormField
                        label="Título Principal (Blanco)"
                        type="text"
                        value={titleHighlight}
                        onChange={(e) => setTitleHighlight(e.target.value)}
                        placeholder="Ej: Tu viaje comienza"
                        required
                      />
                    </div>
                    <div>
                      <FormField
                        label="Texto de Acento (Naranja Sunset)"
                        type="text"
                        value={titleAccent}
                        onChange={(e) => setTitleAccent(e.target.value)}
                        placeholder="Ej: antes de despegar"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <FormField
                      label="Descripción de Acompañamiento"
                      multiline
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Desde la primera idea hasta tu regreso, una asesora te acompaña..."
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Botones de Acción & Conversación */}
          {activeSection === "botones" && (
            <div role="tabpanel" id="panel-botones" aria-labelledby="tab-botones">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-border shadow-sm space-y-6">
                <div>
                  <h2 className="font-sora font-bold text-lg text-brand-navy">
                    2. Botones de Acción & Conversación
                  </h2>
                  <p className="font-inter text-xs text-neutral-muted mt-1">
                    Personaliza el texto del botón principal de WhatsApp y el botón secundario de exploración.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FormField
                      label="Texto del Botón WhatsApp"
                      type="text"
                      value={whatsappCtaText}
                      onChange={(e) => setWhatsappCtaText(e.target.value)}
                      placeholder="Ej: Cuéntame tu viaje"
                      required
                    />
                  </div>
                  <div>
                    <FormField
                      label="Mensaje Predefinido para WhatsApp"
                      type="text"
                      value={whatsappMessageOverride}
                      onChange={(e) => setWhatsappMessageOverride(e.target.value)}
                      placeholder="Ej: Hola Viajes Carolina, quiero empezar a planear mi próximo viaje."
                    />
                  </div>
                  <div>
                    <FormField
                      label="Texto Botón Secundario (Opcional)"
                      type="text"
                      value={secondaryCtaText}
                      onChange={(e) => setSecondaryCtaText(e.target.value)}
                      placeholder="Ej: Explorar promociones"
                    />
                  </div>
                  <div>
                    <FormField
                      label="Enlace Botón Secundario (URL o Ancla)"
                      type="text"
                      value={secondaryCtaUrl}
                      onChange={(e) => setSecondaryCtaUrl(e.target.value)}
                      placeholder="Ej: #promociones o /promociones"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Línea de Confianza */}
          {activeSection === "confianza" && (
            <div role="tabpanel" id="panel-confianza" aria-labelledby="tab-confianza">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-border shadow-sm space-y-6">
                <div>
                  <h2 className="font-sora font-bold text-lg text-brand-navy">
                    3. Línea de Confianza
                  </h2>
                  <p className="font-inter text-xs text-neutral-muted mt-1">
                    Frase con ícono de corazón mostrada bajo el botón de WhatsApp del Hero.
                  </p>
                </div>

                <div>
                  <FormField
                    label="Texto de confianza (con cifra real, no inventada)"
                    type="text"
                    value={trustStatText}
                    onChange={(e) => setTrustStatText(e.target.value)}
                    placeholder="Ej: Más de 1,000 viajeros han confiado en nosotros para vivir recuerdos inolvidables."
                  />
                </div>

                <Disclosure summary="Campos heredados (sin uso actual en el Hero)">
                  <p className="font-inter text-xs text-neutral-muted mb-3">
                    Los 3 pilares de abajo (Asesoría sin costo, etc.) quedan guardados pero no se muestran en el Hero actual — se usaban en un diseño anterior. Se conservan por si se necesitan en otra sección.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[0, 1, 2].map((idx) => (
                      <div key={idx}>
                        <FormField
                          label={`Pilar #${idx + 1}`}
                          type="text"
                          value={trustIndicators[idx] || ""}
                          onChange={(e) => updateTrustIndicator(idx, e.target.value)}
                          placeholder={`Pilar ${idx + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </Disclosure>
              </div>
            </div>
          )}

          {/* 4. Collage de fotos de clientes */}
          {activeSection === "fotos" && (
            <div role="tabpanel" id="panel-fotos" aria-labelledby="tab-fotos">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-border shadow-sm space-y-6">
                <div>
                  <h2 className="font-sora font-bold text-lg text-brand-navy">
                    4. Collage de fotos de clientes
                  </h2>
                  <p className="font-inter text-xs text-neutral-muted mt-1">
                    1 foto principal + 3 fotos de apoyo, siempre de clientes reales viviendo su viaje — nunca fotos del equipo de la agencia. Sin foto, el Hero muestra un placeholder de color, no una imagen de archivo.
                  </p>
                </div>

                <HeroPhotoSlot
                  variant="main"
                  label="Foto Principal (grande)"
                  mediaId={backgroundMediaId}
                  mediaUrl={backgroundMediaUrl}
                  focalX={backgroundFocalX}
                  focalY={backgroundFocalY}
                  onSelect={handleSelectBgMedia}
                  modalTitle="Seleccionar Foto Principal del Hero"
                />

                <div className="pt-2 border-t border-neutral-border grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <HeroPhotoSlot
                    label="Foto de Apoyo 1 (arriba)"
                    mediaId={secondaryMedia1Id}
                    mediaUrl={secondaryMedia1Url}
                    focalX={secondaryMedia1FocalX}
                    focalY={secondaryMedia1FocalY}
                    onSelect={handleSelectSecondary1Media}
                    modalTitle="Seleccionar Foto de Apoyo 1"
                  />
                  <HeroPhotoSlot
                    label="Foto de Apoyo 2 (lateral)"
                    helperText="Solo visible en pantallas de escritorio."
                    mediaId={secondaryMedia2Id}
                    mediaUrl={secondaryMedia2Url}
                    focalX={secondaryMedia2FocalX}
                    focalY={secondaryMedia2FocalY}
                    onSelect={handleSelectSecondary2Media}
                    modalTitle="Seleccionar Foto de Apoyo 2"
                  />
                  <HeroPhotoSlot
                    label="Foto de Apoyo 3 (abajo)"
                    mediaId={secondaryMedia3Id}
                    mediaUrl={secondaryMedia3Url}
                    focalX={secondaryMedia3FocalX}
                    focalY={secondaryMedia3FocalY}
                    onSelect={handleSelectSecondary3Media}
                    modalTitle="Seleccionar Foto de Apoyo 3"
                  />
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
