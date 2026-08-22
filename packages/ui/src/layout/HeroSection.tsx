"use client";

import React from "react";
import { HomeHeroDTO, SiteSettingsDTO } from "@vc/api-client";
import { WhatsAppButton } from "../primitives/WhatsAppButton";
import { TravelMemoriesCollage, TravelMemory } from "./TravelMemoriesCollage";
import { HeartIcon } from "../icons/icons";

export interface HeroSectionProps {
  hero: HomeHeroDTO;
  settings?: SiteSettingsDTO;
  className?: string;
}

// Corrección de color común (cálida, luminosa, natural — sin negros muy
// cerrados, sin filtro naranja evidente) más un ajuste puntual por foto para
// que el azul saturado de Jacó y el gris apagado de Panamá se sientan del
// mismo viaje. Se aplica por Tailwind arbitrary values sobre el <img>.
const GRADE_MAIN_JACO = "saturate-[0.9] contrast-[1.03] brightness-[1.02] hue-rotate-[-2deg]";
const GRADE_NEUTRAL = "saturate-[0.96] contrast-[1.03] brightness-[1.02]";
const GRADE_PANAMA = "saturate-[1.05] contrast-[1.05] brightness-[1.08] sepia-[6%]";

// Trazos reales exportados desde Figma ("Guía · Comportamiento responsive",
// node 288:100, y sus 4 referencias de breakpoint). Se reutilizan estirados
// por breakpoint en vez de descargar una variante por tamaño — el matiz
// entre ellas es imperceptible en formas orgánicas como estas.
const UNDERLINE_PATH = "M4 10C72 3 145 8 214 5C253 3 282 5 308 8";
const WAVE_BLUE_PATH = "M0 90C190 28 360 112 535 82C740 46 895 18 1080 75C1220 118 1326 68 1440 28V230H0V90Z";
const WAVE_SAND_PATH = "M0 70C160 28 320 92 482 54C672 10 850 86 1010 45C1194 0 1308 55 1440 18V180H0V70Z";

function buildMemories(hero: HomeHeroDTO): TravelMemory[] {
  return [
    {
      id: "main",
      src: hero.backgroundMediaUrl,
      alt: "Grupo de viajeros de Viajes Carolina en las letras de Jacó, Costa Rica",
      focalPoint: { x: hero.backgroundFocalX ?? 50, y: hero.backgroundFocalY ?? 50 },
      placement: "main",
      colorGrade: GRADE_MAIN_JACO,
    },
    {
      id: "top",
      src: hero.secondaryMedia1Url,
      alt: "Cena grupal de viajeros durante una excursión con Viajes Carolina",
      focalPoint: { x: hero.secondaryMedia1FocalX ?? 50, y: hero.secondaryMedia1FocalY ?? 50 },
      placement: "top",
      colorGrade: GRADE_NEUTRAL,
    },
    {
      id: "side",
      src: hero.secondaryMedia2Url,
      alt: "Viajeros cruzando un puente colgante durante su viaje",
      focalPoint: { x: hero.secondaryMedia2FocalX ?? 50, y: hero.secondaryMedia2FocalY ?? 50 },
      placement: "side",
      colorGrade: GRADE_NEUTRAL,
    },
    {
      id: "bottom",
      src: hero.secondaryMedia3Url,
      alt: "Grupo de viajeros frente al letrero de Panamá",
      focalPoint: { x: hero.secondaryMedia3FocalX ?? 50, y: hero.secondaryMedia3FocalY ?? 50 },
      placement: "bottom",
      colorGrade: GRADE_PANAMA,
    },
  ];
}

export function HeroSection({ hero, settings, className = "" }: HeroSectionProps) {
  const whatsappPhone = settings?.whatsappPhone;
  const message =
    hero.whatsappMessageOverride ||
    settings?.whatsappDefaultMessage ||
    "Hola Viajes Carolina, quiero empezar a planear mi próximo viaje.";
  const memories = buildMemories(hero);

  return (
    <section className={`relative isolate w-full overflow-hidden bg-surface-ivory ${className}`}>
      {/* Papel continuo: a todo el ancho real de la pantalla — regla madre de
          la guía de Figma ("el papel, las ondas y la atmósfera nunca
          terminan en el borde del contenedor"). Vive FUERA del canvas
          capado a 1440px para no cortarse en un rectángulo visible en
          pantallas anchas; su alto sigue las mismas proporciones porque la
          sección hereda su alto del canvas de abajo. */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
          className="absolute left-0 top-[86.56%] w-full h-[13.44%] md:top-[79.07%] md:h-[20.93%] xl:top-[72.22%] xl:h-[27.78%]"
          viewBox="0 0 1440 230"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d={WAVE_BLUE_PATH} className="fill-atmosphere-sea" />
        </svg>
        <svg
          className="absolute left-0 top-[91.63%] w-full h-[8.37%] md:top-[84.36%] md:h-[15.64%] xl:top-[78.26%] xl:h-[21.74%]"
          viewBox="0 0 1440 180"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d={WAVE_SAND_PATH} className="fill-surface-sand" />
        </svg>
      </div>

      {/* Canvas capado: todo lo que sí debe alinearse con el texto (foto
          principal, polaroids, velo, atmósfera, texto) comparte este mismo
          sistema de coordenadas — se achica un poco pero nunca se corta. */}
      <div className="relative w-full h-[calc(100vh-5rem)] min-h-[600px] max-h-[900px] xl:max-w-[1440px] xl:mx-auto">
        {/* Atmósfera: misma elipse a escala, posición/tamaño por breakpoint */}
        <svg
          className="absolute z-0 pointer-events-none left-[18.46%] top-[47.69%] w-full h-[46.26%] md:left-[38.09%] md:top-[3.52%] md:w-[60.55%] md:h-[71.59%] xl:left-[45.14%] xl:top-[1.45%] xl:w-[52.78%] xl:h-[78.5%]"
          viewBox="0 0 760 650"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <ellipse cx="380" cy="325" rx="380" ry="325" className="fill-atmosphere-sky" opacity="0.42" />
        </svg>

        <TravelMemoriesCollage memories={memories} className="absolute inset-0" />

        {/* Columna de texto: mismo canvas, se reacomoda por breakpoint */}
        <div className="absolute z-20 flex flex-col animate-hero-fade-up left-[6.15%] top-[3.52%] w-[87.69%] gap-3 md:left-[4.69%] md:top-[6.61%] md:w-[42.97%] md:gap-4 xl:left-[6.39%] xl:top-[10.14%] xl:w-[39.58%] xl:gap-5">
          {hero.eyebrowText && (
            <p className="font-sora font-bold uppercase text-brand-accent text-[11px] tracking-[0.08em] md:text-[12px] xl:text-[13px]">
              {hero.eyebrowText}
            </p>
          )}
          <div className="flex flex-col gap-2">
            <h1
              className="font-display font-semibold text-brand-navy leading-[1.07] tracking-[-0.02em] text-[42px] md:text-[54px] xl:text-[62px]"
              style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
            >
              {hero.titleHighlight} {hero.titleAccent}
            </h1>
            <svg
              viewBox="0 0 312 14"
              className="h-3.5 w-[56%] md:w-[62%] xl:w-[58%]"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d={UNDERLINE_PATH} stroke="var(--color-brand-accent)" strokeWidth="5" strokeLinecap="round" fill="none" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          <p className="font-inter text-brand-navy leading-[1.6] text-[15px] md:text-[16px] xl:text-[17px]">
            {hero.description}
          </p>
          <div className="w-full md:w-auto">
            <WhatsAppButton size="lg" phone={whatsappPhone} message={message} className="w-full justify-center md:w-auto">
              {hero.whatsappCtaText}
            </WhatsAppButton>
          </div>
          {hero.trustStatText && (
            <div className="flex items-center gap-2.5">
              <HeartIcon size={20} className="text-brand-accent shrink-0" />
              <p className="font-inter text-brand-navy text-xs md:text-[13px] xl:text-sm">{hero.trustStatText}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
