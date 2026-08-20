"use client";

import React from "react";
import Image from "next/image";
import { HomeHeroDTO } from "@vc/api-client";
import { useAdminHomeHero } from "../../hooks/useAdminHomeHero";
import { useMediaPicker } from "../../hooks/useMediaPicker";
import { Button, CheckIcon, ImageIcon, MediaPickerModal } from "@vc/ui";

export interface HeroFormProps {
  initialHero: HomeHeroDTO;
}

export function HeroForm({ initialHero }: HeroFormProps) {
  const {
    badgeText, setBadgeText,
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
    featuredCardBadge, setFeaturedCardBadge,
    featuredCardTitle, setFeaturedCardTitle,
    featuredCardSubtitle, setFeaturedCardSubtitle,
    featuredCardPricePen, setFeaturedCardPricePen,
    featuredCardOrigin, setFeaturedCardOrigin,
    featuredCardMediaId, featuredCardMediaUrl,
    secondaryMedia1Id, secondaryMedia1Url, secondaryMedia1FocalX, secondaryMedia1FocalY,
    secondaryMedia2Id, secondaryMedia2Url, secondaryMedia2FocalX, secondaryMedia2FocalY,
    secondaryMedia3Id, secondaryMedia3Url, secondaryMedia3FocalX, secondaryMedia3FocalY,
    secondaryMedia4Id, secondaryMedia4Url, secondaryMedia4FocalX, secondaryMedia4FocalY,
    trustStatText, setTrustStatText,
    isSaving,
    statusMessage,
    isBgModalOpen, setIsBgModalOpen,
    isCardMediaModalOpen, setIsCardMediaModalOpen,
    isSecondary1ModalOpen, setIsSecondary1ModalOpen,
    isSecondary2ModalOpen, setIsSecondary2ModalOpen,
    isSecondary3ModalOpen, setIsSecondary3ModalOpen,
    isSecondary4ModalOpen, setIsSecondary4ModalOpen,
    handleSelectBgMedia,
    handleSelectCardMedia,
    handleSelectSecondary1Media,
    handleSelectSecondary2Media,
    handleSelectSecondary3Media,
    handleSelectSecondary4Media,
    handleSave,
  } = useAdminHomeHero(initialHero);

  const bgMediaPicker = useMediaPicker(isBgModalOpen);
  const secondary1MediaPicker = useMediaPicker(isSecondary1ModalOpen);
  const secondary2MediaPicker = useMediaPicker(isSecondary2ModalOpen);
  const secondary3MediaPicker = useMediaPicker(isSecondary3ModalOpen);
  const secondary4MediaPicker = useMediaPicker(isSecondary4ModalOpen);

  const updateTrustIndicator = (index: number, value: string) => {
    const updated = [...trustIndicators];
    updated[index] = value;
    setTrustIndicators(updated);
  };

  const bgImageSrc = backgroundMediaUrl
    ? (backgroundMediaUrl.startsWith("http") || backgroundMediaUrl.startsWith("/") ? backgroundMediaUrl : `/${backgroundMediaUrl}`)
    : "/media/demo-cartagena-caribe.webp";

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      {/* Notifications */}
      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
          <CheckIcon size={20} className="text-emerald-600 shrink-0" />
          <span className="font-medium text-sm">{statusMessage}</span>
        </div>
      )}

      {/* Vista previa simplificada — el Hero real es marfil con collage de 3 fotos,
          esta tarjeta solo confirma texto/CTA y la foto principal, no replica el collage completo */}
      <div className="rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm border border-neutral-border bg-surface-ivory min-h-[280px] flex flex-col justify-between">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-neutral-border">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-sora text-xs font-bold uppercase tracking-wider text-neutral-muted">
              Vista previa (texto + foto principal)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsBgModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-brand-navy/5 hover:bg-brand-navy/10 border border-neutral-border text-xs font-bold text-brand-navy transition-all"
          >
            🖼️ Cambiar Foto Principal
          </button>
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
          Punto focal de la foto principal: <strong>X {backgroundFocalX || 50}% · Y {backgroundFocalY || 50}%</strong> — las 2 fotos de apoyo se configuran más abajo, en &quot;Collage de fotos de clientes&quot;.
        </div>
      </div>

      {/* Section 1: Headline & Main Copy */}
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
          {/* Badge */}
          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              Insignia Superior (Pill Eyebrow)
            </label>
            <input
              type="text"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              placeholder="Ej: Empieza con una conversación"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
              required
            />
          </div>

          {/* Title and Accent */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
                Título Principal (Blanco)
              </label>
              <input
                type="text"
                value={titleHighlight}
                onChange={(e) => setTitleHighlight(e.target.value)}
                placeholder="Ej: Tu viaje comienza"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                required
              />
            </div>
            <div>
              <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
                Texto de Acento (Naranja Sunset)
              </label>
              <input
                type="text"
                value={titleAccent}
                onChange={(e) => setTitleAccent(e.target.value)}
                placeholder="Ej: antes de despegar"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              Descripción de Acompañamiento
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Desde la primera idea hasta tu regreso, una asesora te acompaña..."
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent resize-none"
              required
            />
          </div>
        </div>
      </div>

      {/* Section 2: Actions & WhatsApp */}
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
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              Texto del Botón WhatsApp
            </label>
            <input
              type="text"
              value={whatsappCtaText}
              onChange={(e) => setWhatsappCtaText(e.target.value)}
              placeholder="Ej: Cuéntame tu viaje"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
              required
            />
          </div>
          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              Mensaje Predefinido para WhatsApp
            </label>
            <input
              type="text"
              value={whatsappMessageOverride}
              onChange={(e) => setWhatsappMessageOverride(e.target.value)}
              placeholder="Ej: Hola Viajes Carolina, quiero empezar a planear mi próximo viaje."
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>
          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              Texto Botón Secundario (Opcional)
            </label>
            <input
              type="text"
              value={secondaryCtaText}
              onChange={(e) => setSecondaryCtaText(e.target.value)}
              placeholder="Ej: Explorar promociones"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>
          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              Enlace Botón Secundario (URL o Ancla)
            </label>
            <input
              type="text"
              value={secondaryCtaUrl}
              onChange={(e) => setSecondaryCtaUrl(e.target.value)}
              placeholder="Ej: #promociones o /promociones"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Trust Indicators */}
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
          <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
            Texto de confianza (con cifra real, no inventada)
          </label>
          <input
            type="text"
            value={trustStatText}
            onChange={(e) => setTrustStatText(e.target.value)}
            placeholder="Ej: Más de 1,000 viajeros han confiado en nosotros para vivir recuerdos inolvidables."
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </div>

        <div className="pt-4 border-t border-neutral-border">
          <p className="font-inter text-xs text-neutral-muted mb-3">
            Los 3 pilares de abajo (Asesoría sin costo, etc.) quedan guardados pero no se muestran en el Hero actual — se usaban en un diseño anterior. Se conservan por si se necesitan en otra sección.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[0, 1, 2].map((idx) => (
              <div key={idx}>
                <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
                  Pilar #{idx + 1}
                </label>
                <input
                  type="text"
                  value={trustIndicators[idx] || ""}
                  onChange={(e) => updateTrustIndicator(idx, e.target.value)}
                  placeholder={`Pilar ${idx + 1}`}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 4: Collage de fotos de clientes */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-border shadow-sm space-y-6">
        <div>
          <h2 className="font-sora font-bold text-lg text-brand-navy">
            4. Collage de fotos de clientes
          </h2>
          <p className="font-inter text-xs text-neutral-muted mt-1">
            1 foto principal + 4 fotos de apoyo, siempre de clientes reales viviendo su viaje — nunca fotos del equipo de la agencia. Sin foto, el Hero muestra un placeholder de color, no una imagen de archivo.
          </p>
        </div>

        <div className="space-y-6">
          {/* Foto principal */}
          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              Foto Principal (grande)
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-36 aspect-video rounded-xl bg-neutral-surface border border-neutral-border overflow-hidden shrink-0 shadow-sm">
                {backgroundMediaUrl ? (
                  <Image
                    src={bgImageSrc}
                    alt="Foto principal del Hero"
                    fill
                    unoptimized
                    style={{
                      objectFit: "cover",
                      objectPosition: `${backgroundFocalX || 50}% ${backgroundFocalY || 50}%`,
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-muted">
                    <ImageIcon size={24} />
                  </div>
                )}
              </div>
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setIsBgModalOpen(true)}
                >
                  🖼️ {backgroundMediaId ? "Cambiar Foto Principal" : "Seleccionar Foto"}
                </Button>
                {backgroundMediaId && (
                  <span className="block font-inter text-xs text-neutral-muted mt-1">
                    ID Activo: #{backgroundMediaId} • Punto Focal: ({backgroundFocalX || 50}%, {backgroundFocalY || 50}%)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Foto de apoyo 1 */}
          <div className="pt-4 border-t border-neutral-border">
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              Foto de Apoyo 1
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-36 aspect-video rounded-xl bg-neutral-surface border border-neutral-border overflow-hidden shrink-0 shadow-sm">
                {secondaryMedia1Url ? (
                  <Image
                    src={secondaryMedia1Url.startsWith("http") || secondaryMedia1Url.startsWith("/") ? secondaryMedia1Url : `/${secondaryMedia1Url}`}
                    alt="Foto de apoyo 1 del Hero"
                    fill
                    unoptimized
                    style={{
                      objectFit: "cover",
                      objectPosition: `${secondaryMedia1FocalX || 50}% ${secondaryMedia1FocalY || 50}%`,
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-muted">
                    <ImageIcon size={24} />
                  </div>
                )}
              </div>
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setIsSecondary1ModalOpen(true)}
                >
                  🖼️ {secondaryMedia1Id ? "Cambiar Foto" : "Seleccionar Foto"}
                </Button>
                {secondaryMedia1Id && (
                  <span className="block font-inter text-xs text-neutral-muted mt-1">
                    ID Activo: #{secondaryMedia1Id} • Punto Focal: ({secondaryMedia1FocalX || 50}%, {secondaryMedia1FocalY || 50}%)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Foto de apoyo 2 */}
          <div className="pt-4 border-t border-neutral-border">
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              Foto de Apoyo 2
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-36 aspect-video rounded-xl bg-neutral-surface border border-neutral-border overflow-hidden shrink-0 shadow-sm">
                {secondaryMedia2Url ? (
                  <Image
                    src={secondaryMedia2Url.startsWith("http") || secondaryMedia2Url.startsWith("/") ? secondaryMedia2Url : `/${secondaryMedia2Url}`}
                    alt="Foto de apoyo 2 del Hero"
                    fill
                    unoptimized
                    style={{
                      objectFit: "cover",
                      objectPosition: `${secondaryMedia2FocalX || 50}% ${secondaryMedia2FocalY || 50}%`,
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-muted">
                    <ImageIcon size={24} />
                  </div>
                )}
              </div>
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setIsSecondary2ModalOpen(true)}
                >
                  🖼️ {secondaryMedia2Id ? "Cambiar Foto" : "Seleccionar Foto"}
                </Button>
                {secondaryMedia2Id && (
                  <span className="block font-inter text-xs text-neutral-muted mt-1">
                    ID Activo: #{secondaryMedia2Id} • Punto Focal: ({secondaryMedia2FocalX || 50}%, {secondaryMedia2FocalY || 50}%)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Foto de apoyo 3 */}
          <div className="pt-4 border-t border-neutral-border">
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              Foto de Apoyo 3
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-36 aspect-video rounded-xl bg-neutral-surface border border-neutral-border overflow-hidden shrink-0 shadow-sm">
                {secondaryMedia3Url ? (
                  <Image
                    src={secondaryMedia3Url.startsWith("http") || secondaryMedia3Url.startsWith("/") ? secondaryMedia3Url : `/${secondaryMedia3Url}`}
                    alt="Foto de apoyo 3 del Hero"
                    fill
                    unoptimized
                    style={{
                      objectFit: "cover",
                      objectPosition: `${secondaryMedia3FocalX || 50}% ${secondaryMedia3FocalY || 50}%`,
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-muted">
                    <ImageIcon size={24} />
                  </div>
                )}
              </div>
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setIsSecondary3ModalOpen(true)}
                >
                  🖼️ {secondaryMedia3Id ? "Cambiar Foto" : "Seleccionar Foto"}
                </Button>
                {secondaryMedia3Id && (
                  <span className="block font-inter text-xs text-neutral-muted mt-1">
                    ID Activo: #{secondaryMedia3Id} • Punto Focal: ({secondaryMedia3FocalX || 50}%, {secondaryMedia3FocalY || 50}%)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Foto de apoyo 4 */}
          <div className="pt-4 border-t border-neutral-border">
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              Foto de Apoyo 4
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-36 aspect-video rounded-xl bg-neutral-surface border border-neutral-border overflow-hidden shrink-0 shadow-sm">
                {secondaryMedia4Url ? (
                  <Image
                    src={secondaryMedia4Url.startsWith("http") || secondaryMedia4Url.startsWith("/") ? secondaryMedia4Url : `/${secondaryMedia4Url}`}
                    alt="Foto de apoyo 4 del Hero"
                    fill
                    unoptimized
                    style={{
                      objectFit: "cover",
                      objectPosition: `${secondaryMedia4FocalX || 50}% ${secondaryMedia4FocalY || 50}%`,
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-muted">
                    <ImageIcon size={24} />
                  </div>
                )}
              </div>
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setIsSecondary4ModalOpen(true)}
                >
                  🖼️ {secondaryMedia4Id ? "Cambiar Foto" : "Seleccionar Foto"}
                </Button>
                {secondaryMedia4Id && (
                  <span className="block font-inter text-xs text-neutral-muted mt-1">
                    ID Activo: #{secondaryMedia4Id} • Punto Focal: ({secondaryMedia4FocalX || 50}%, {secondaryMedia4FocalY || 50}%)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Featured Card Fields — sin uso en el Hero actual, se conservan por compatibilidad */}
          <p className="font-inter text-xs text-neutral-muted pt-4 border-t border-neutral-border">
            Los campos de "tarjeta destacada" de abajo quedan guardados pero no se muestran en el Hero actual — pertenecían a un diseño anterior.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
                Insignia de Tarjeta
              </label>
              <input
                type="text"
                value={featuredCardBadge}
                onChange={(e) => setFeaturedCardBadge(e.target.value)}
                placeholder="Ej: Próxima Parada · Cusco"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>
            <div>
              <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
                Título del Destino
              </label>
              <input
                type="text"
                value={featuredCardTitle}
                onChange={(e) => setFeaturedCardTitle(e.target.value)}
                placeholder="Ej: Machu Picchu & Valle Sagrado"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>
            <div>
              <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
                Subtítulo / Duración
              </label>
              <input
                type="text"
                value={featuredCardSubtitle}
                onChange={(e) => setFeaturedCardSubtitle(e.target.value)}
                placeholder="Ej: Experiencia personalizada de 5 días / 4 noches"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>
            <div>
              <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
                Precio Referencial (S/)
              </label>
              <input
                type="number"
                value={featuredCardPricePen || ""}
                onChange={(e) => setFeaturedCardPricePen(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Ej: 1922"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4 pt-4">
        <Button
          variant="primary"
          size="lg"
          type="submit"
          disabled={isSaving}
        >
          {isSaving ? "Publicando Cambios..." : "Guardar y Publicar Hero"}
        </Button>
      </div>

      {/* Media Picker Modals */}
      <MediaPickerModal
        isOpen={isBgModalOpen}
        onClose={() => setIsBgModalOpen(false)}
        onSelect={handleSelectBgMedia}
        selectedMediaId={backgroundMediaId}
        title="Seleccionar Foto Principal del Hero"
        items={bgMediaPicker.items}
        loading={bgMediaPicker.loading}
        onUploadFile={bgMediaPicker.uploadFile}
        onFocalPointSave={bgMediaPicker.saveFocalPoint}
      />
      <MediaPickerModal
        isOpen={isSecondary1ModalOpen}
        onClose={() => setIsSecondary1ModalOpen(false)}
        onSelect={handleSelectSecondary1Media}
        selectedMediaId={secondaryMedia1Id}
        title="Seleccionar Foto de Apoyo 1"
        items={secondary1MediaPicker.items}
        loading={secondary1MediaPicker.loading}
        onUploadFile={secondary1MediaPicker.uploadFile}
        onFocalPointSave={secondary1MediaPicker.saveFocalPoint}
      />
      <MediaPickerModal
        isOpen={isSecondary2ModalOpen}
        onClose={() => setIsSecondary2ModalOpen(false)}
        onSelect={handleSelectSecondary2Media}
        selectedMediaId={secondaryMedia2Id}
        title="Seleccionar Foto de Apoyo 2"
        items={secondary2MediaPicker.items}
        loading={secondary2MediaPicker.loading}
        onUploadFile={secondary2MediaPicker.uploadFile}
        onFocalPointSave={secondary2MediaPicker.saveFocalPoint}
      />
      <MediaPickerModal
        isOpen={isSecondary3ModalOpen}
        onClose={() => setIsSecondary3ModalOpen(false)}
        onSelect={handleSelectSecondary3Media}
        selectedMediaId={secondaryMedia3Id}
        title="Seleccionar Foto de Apoyo 3"
        items={secondary3MediaPicker.items}
        loading={secondary3MediaPicker.loading}
        onUploadFile={secondary3MediaPicker.uploadFile}
        onFocalPointSave={secondary3MediaPicker.saveFocalPoint}
      />
      <MediaPickerModal
        isOpen={isSecondary4ModalOpen}
        onClose={() => setIsSecondary4ModalOpen(false)}
        onSelect={handleSelectSecondary4Media}
        selectedMediaId={secondaryMedia4Id}
        title="Seleccionar Foto de Apoyo 4"
        items={secondary4MediaPicker.items}
        loading={secondary4MediaPicker.loading}
        onUploadFile={secondary4MediaPicker.uploadFile}
        onFocalPointSave={secondary4MediaPicker.saveFocalPoint}
      />
    </form>
  );
}
