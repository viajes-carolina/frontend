"use client";

import React from "react";
import Image from "next/image";
import { HomeHeroDTO } from "@vc/api-client";
import { useAdminHomeHero } from "../../hooks/useAdminHomeHero";
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
    isSaving,
    statusMessage,
    isBgModalOpen, setIsBgModalOpen,
    isCardMediaModalOpen, setIsCardMediaModalOpen,
    handleSelectBgMedia,
    handleSelectCardMedia,
    handleSave,
  } = useAdminHomeHero(initialHero);

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

      {/* Interactive Live Preview of the Hero Header */}
      <div className="rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-white/20 bg-slate-900 min-h-[320px] flex flex-col justify-between">
        {/* Background Image with Live Focal Point */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src={bgImageSrc}
            alt="Vista Previa de Fondo"
            fill
            unoptimized
            priority
            style={{
              objectFit: "cover",
              objectPosition: `${backgroundFocalX || 50}% ${backgroundFocalY || 50}%`,
            }}
            className="scale-105 transition-all duration-700 ease-out"
          />
          {/* Subtle contrast gradient - keeps photo crystal clear */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30" />
        </div>

        {/* Top Header of Live Preview */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-white/20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-sora text-xs font-bold uppercase tracking-wider text-atmosphere-sky">
              Vista Previa en Vivo del Hero
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsBgModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-xs font-bold text-white transition-all shadow-sm"
          >
            🖼️ Cambiar Imagen de Fondo
          </button>
        </div>

        {/* Hero Content Live Simulation */}
        <div className="relative z-10 space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-brand-sunset text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
            {badgeText || "Una nueva forma de viajar"}
          </div>

          <h1 className="font-sora font-extrabold text-2xl sm:text-3xl leading-tight drop-shadow-md">
            {titleHighlight || "Tu viaje comienza"}{" "}
            <span className="text-brand-accent">{titleAccent || "antes de despegar"}</span>
          </h1>

          <p className="font-inter text-xs sm:text-sm text-atmosphere-sky line-clamp-2 drop-shadow">
            {description || "Desde la primera idea hasta tu regreso, una asesora te acompaña con opciones claras, atención humana y respaldo en cada etapa."}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="px-5 py-2.5 rounded-xl bg-brand-whatsapp text-white font-sora font-bold text-xs shadow-lg inline-flex items-center gap-2">
              <span>💬 {whatsappCtaText || "Cuéntame tu viaje"}</span>
            </div>
            {secondaryCtaText && (
              <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white font-sora text-xs">
                {secondaryCtaText}
              </div>
            )}
          </div>
        </div>

        {/* Live Focal Point coordinates indicator */}
        <div className="relative z-10 mt-6 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-white/80 font-inter">
          <span>Punto focal activo: <strong>X: {backgroundFocalX || 50}% | Y: {backgroundFocalY || 50}%</strong></span>
          <span className="text-brand-sunset font-semibold">Se actualiza en tiempo real</span>
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
            3. Indicadores de Confianza (Trust Line)
          </h2>
          <p className="font-inter text-xs text-neutral-muted mt-1">
            Tres pilares de propuesta de valor mostrados debajo del llamado a la acción.
          </p>
        </div>

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

      {/* Section 4: Media & Destination Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-border shadow-sm space-y-6">
        <div>
          <h2 className="font-sora font-bold text-lg text-brand-navy">
            4. Imagen de Fondo & Tarjeta Destacada
          </h2>
          <p className="font-inter text-xs text-neutral-muted mt-1">
            Vincula una imagen de la biblioteca de medios y define la oferta destacada de la postal.
          </p>
        </div>

        <div className="space-y-6">
          {/* Background Media Picker */}
          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              Imagen Principal del Hero (Biblioteca de Medios)
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-36 aspect-video rounded-xl bg-neutral-surface border border-neutral-border overflow-hidden shrink-0 shadow-sm">
                {backgroundMediaUrl ? (
                  <Image
                    src={bgImageSrc}
                    alt="Fondo Hero"
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
                  🖼️ {backgroundMediaId ? "Cambiar Imagen de Fondo" : "Seleccionar Imagen"}
                </Button>
                {backgroundMediaId && (
                  <span className="block font-inter text-xs text-neutral-muted mt-1">
                    ID Activo: #{backgroundMediaId} • Punto Focal: ({backgroundFocalX || 50}%, {backgroundFocalY || 50}%)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Featured Card Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-border">
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

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isBgModalOpen}
        onClose={() => setIsBgModalOpen(false)}
        onSelect={handleSelectBgMedia}
        selectedMediaId={backgroundMediaId}
        title="Seleccionar Imagen de Fondo del Hero"
      />
    </form>
  );
}
