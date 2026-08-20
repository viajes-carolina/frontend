"use client";

import React from "react";
import { PromotionDTO, SiteSettingsDTO } from "@vc/api-client";
import { EditorialFeature, EditorialFeatureItem } from "../compositions/EditorialFeature";
import { WhatsAppButton } from "../primitives/WhatsAppButton";
import { Button } from "../primitives/Button";
import { ArrowUpRightIcon } from "../icons/icons";

export interface PromotionsSectionProps {
  promotions: PromotionDTO[];
  settings?: SiteSettingsDTO;
  className?: string;
  showViewAllButton?: boolean;
}

function toEditorialItem(promo: PromotionDTO): EditorialFeatureItem {
  return {
    key: promo.id || promo.slug,
    imageUrl: promo.featuredMediaUrl,
    imageAlt: promo.title,
    focalX: promo.featuredMediaFocalX,
    focalY: promo.featuredMediaFocalY,
    eyebrow: promo.destination,
    title: promo.title,
    summary: promo.summary,
    meta: `USD ${Number(promo.priceUsd).toLocaleString()} · ${promo.durationDays}D/${promo.durationNights}N`,
  };
}

export function PromotionsSection({
  promotions,
  settings,
  className = "",
  showViewAllButton = true,
}: PromotionsSectionProps) {
  if (!promotions || promotions.length === 0) {
    return null;
  }

  const ordered = [...promotions].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  const [featuredPromo, ...rest] = ordered;
  const secondaryPromos = rest.slice(0, 2);
  const promoByKey = new Map(promotions.map((p) => [p.id || p.slug, p]));

  const renderCta = (item: EditorialFeatureItem, isFeatured: boolean) => {
    const promo = promoByKey.get(item.key);
    const message =
      promo?.whatsappMessageTemplate ||
      `Hola Viajes Carolina, me interesa la promoción "${item.title}". ¿Tienen fechas disponibles?`;
    return (
      <WhatsAppButton
        variant="link"
        size={isFeatured ? "md" : "sm"}
        phone={settings?.whatsappPhone}
        message={message}
      >
        Cotizar {isFeatured ? "este paquete" : "paquete"}
      </WhatsAppButton>
    );
  };

  return (
    <section
      id="promociones"
      className={`relative w-full overflow-hidden bg-atmosphere-cloud py-16 sm:py-24 border-b border-neutral-border text-neutral-ink ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl text-left">
            <span className="font-sora text-xs font-bold uppercase tracking-[0.08em] text-brand-accent border-b-2 border-brand-accent pb-1">
              Ofertas y Temporada 2026
            </span>

            <h2 className="font-display font-medium text-3xl sm:text-4xl lg:text-[40px] leading-tight text-brand-navy mt-3 mb-3">
              Promociones que <span className="text-brand-accent">inspiran a viajar</span>
            </h2>

            <p className="font-sora text-neutral-muted text-base sm:text-lg leading-relaxed">
              Paquetes diseñados por nuestras asesoras expertas con vuelos, hoteles seleccionados y experiencias completas.
            </p>
          </div>

          {showViewAllButton && (
            <a href="/promociones">
              <Button
                variant="outline"
                size="md"
                icon={<ArrowUpRightIcon size={18} />}
                className="shrink-0 bg-white border-neutral-border text-brand-navy hover:bg-neutral-soft shadow-sm"
              >
                Ver todas las promociones
              </Button>
            </a>
          )}
        </div>

        <EditorialFeature
          featured={{ ...toEditorialItem(featuredPromo), panelColor: "sand" }}
          secondary={secondaryPromos.map((p) => ({ ...toEditorialItem(p), panelColor: "sky" }))}
          featuredBadge={featuredPromo.isFeatured ? "Destacado" : undefined}
          renderCta={renderCta}
        />

      </div>
    </section>
  );
}
