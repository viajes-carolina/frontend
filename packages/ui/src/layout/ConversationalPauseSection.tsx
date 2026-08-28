"use client";

import React from "react";
import { SiteSettingsDTO, HomeConversationalPauseDTO } from "@vc/api-client";
import { Reveal } from "../primitives/Reveal";
import { WhatsAppButton } from "../primitives/WhatsAppButton";
import { BcpMarkIcon, InterbankMarkIcon, ScotiabankMarkIcon, IconProps } from "../icons/icons";

export interface ConversationalPauseSectionProps {
  config?: HomeConversationalPauseDTO;
  settings?: SiteSettingsDTO;
  className?: string;
}

const DEFAULT_CONFIG: HomeConversationalPauseDTO = {
  badgeText: "04 · Antes de seguir",
  title: "¿Ya imaginas cómo podría sentirse tu próximo viaje?",
  subtitle: "No necesitas tener todo decidido. Cuéntanos qué te ilusiona y una asesora te ayuda a darle forma.",
  whatsappCtaText: "Conversarlo por WhatsApp",
  whatsappMessageTemplate: "Hola Viajes Carolina, quiero contarles qué tengo en mente para mi próximo viaje.",
  financingEyebrowText: "VIAJA AHORA, PAGA A TU RITMO",
  financingInstallmentsCount: 12,
  financingDisclaimerText: "Válido con tarjetas participantes. Sujeto a condiciones de cada entidad financiera.",
  financingBanks: ["BCP", "Interbank", "BBVA", "BanBif", "Scotiabank"],
};

// Mapeo banco → estilo/ícono de marca para la fila de "Bancos Participantes"
// del panel de financiamiento. Match case-insensitive por nombre (el admin
// escribe el nombre libremente en `financingBanks`); cualquier nombre no
// reconocido cae al estilo neutro de FALLBACK_BANK_STYLE.
interface BankStyle {
  textClass: string;
  Icon?: React.ComponentType<IconProps>;
}

const FALLBACK_BANK_STYLE: BankStyle = { textClass: "text-neutral-ink" };

const BANK_STYLES: Record<string, BankStyle> = {
  bcp: { textClass: "text-[#0057a8]", Icon: BcpMarkIcon },
  interbank: { textClass: "text-[#009b4d]", Icon: InterbankMarkIcon },
  bbva: { textClass: "text-[#004481]" },
  banbif: { textClass: "text-[#1498e6]" },
  scotiabank: { textClass: "text-[#e31b23]", Icon: ScotiabankMarkIcon },
};

function getBankStyle(bankName: string): BankStyle {
  return BANK_STYLES[bankName.trim().toLowerCase()] ?? FALLBACK_BANK_STYLE;
}

interface FinancingPanelProps {
  eyebrowText: string;
  installmentsCount: number;
  disclaimerText: string;
  banks: string[];
  className?: string;
}

// Tarjeta de financiamiento (cuotas sin intereses + bancos participantes)
// mostrada dentro del CTA de "04 · Antes de seguir". Fondo blanco contra el
// fondo global crema del sitio (la sección ya no pinta el suyo), mismo
// radio/borde/sombra que el resto de tarjetas del Home.
function FinancingPanel({ eyebrowText, installmentsCount, disclaimerText, banks, className = "" }: FinancingPanelProps) {
  return (
    <div
      className={`w-full max-w-md rounded-2xl border border-neutral-border bg-white p-6 text-center shadow-sm sm:p-7 ${className}`}
    >
      <span className="font-sora text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-accent">
        {eyebrowText}
      </span>
      <p className="font-display mt-2 text-2xl font-semibold leading-tight text-brand-navy sm:text-[28px]">
        Hasta <span className="text-brand-accent">{installmentsCount}</span> cuotas sin intereses
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
        {banks.map((bank, index) => {
          const { textClass, Icon } = getBankStyle(bank);
          return (
            <span key={`${bank}-${index}`} className={`inline-flex items-center gap-1.5 font-sora text-sm font-semibold ${textClass}`}>
              {Icon ? <Icon size={14} /> : null}
              {bank}
            </span>
          );
        })}
      </div>

      <p className="font-inter mt-4 text-xs text-neutral-muted">{disclaimerText}</p>
    </div>
  );
}

export function ConversationalPauseSection({ config = DEFAULT_CONFIG, settings, className = "" }: ConversationalPauseSectionProps) {
  return (
    <section
      id="antes-de-seguir"
      className={`relative w-full overflow-hidden py-16 sm:py-20 xl:py-28 text-neutral-ink ${className}`}
    >
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 xl:max-w-[1440px] xl:px-16">
        <Reveal className="flex flex-col items-center gap-6 text-center xl:flex-row xl:items-center xl:justify-between xl:gap-10 xl:text-left">
          <div className="max-w-xl xl:max-w-none xl:flex-1">
            <span className="font-sora text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-accent">
              {config.badgeText}
            </span>
            <h2 className="font-display mt-3 text-[32px] font-semibold leading-[1.15] text-brand-navy sm:text-[42px] xl:text-[46px] xl:leading-[1.13]">
              {config.title}
            </h2>
            <p className="font-inter mt-4 text-base leading-relaxed text-neutral-muted xl:max-w-xl">
              {config.subtitle}
            </p>
          </div>

          <div className="flex flex-col items-center gap-6 xl:shrink-0 xl:items-end">
            <FinancingPanel
              eyebrowText={config.financingEyebrowText}
              installmentsCount={config.financingInstallmentsCount}
              disclaimerText={config.financingDisclaimerText}
              banks={config.financingBanks}
            />

            <WhatsAppButton
              size="lg"
              phone={settings?.whatsappPhone}
              message={config.whatsappMessageTemplate}
              className="shrink-0"
            >
              {config.whatsappCtaText}
            </WhatsAppButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
