"use client";

import type { HomeHeroDTO } from "@vc/api-client";
import { HeartIcon } from "@vc/ui";
import type { PreviewDevice } from "../../../components/editor/EditorDeviceSwitch";
import { PreviewNavbar, PreviewPhoto } from "./HeroPreviewParts";

/**
 * Mock de la portada dentro del editor: navbar, contenido, collage y línea de
 * confianza (Figma 958:459, punto 5).
 *
 * Antes era un Server Component que hacía su propio `getHomeHero()`, así que
 * solo podía mostrar lo ya guardado. Ahora recibe el Hero por props: el editor
 * le pasa el estado del formulario y la miniatura cambia mientras se escribe.
 *
 * Reproduce la anatomía del `HeroSection` real (marfil, antetítulo naranja,
 * titular con subrayado, descripción, botón de WhatsApp, línea de confianza y
 * collage de cuatro fotos), no su maquetación exacta: a 432px de ancho el
 * layout absoluto del sitio no es legible.
 */

const UNDERLINE_PATH = "M4 10C72 3 145 8 214 5C253 3 282 5 308 8";

export interface HeroPreviewCardProps {
  hero: HomeHeroDTO;
  device: PreviewDevice;
}

export function HeroPreviewCard({ hero, device }: HeroPreviewCardProps) {
  const mobile = device === "mobile";

  return (
    // En móvil el mock entero (navbar incluida) se estrecha a 220px y se centra
    // sobre el fondo del panel; en escritorio ocupa todo el ancho disponible.
    <div className={mobile ? "flex justify-center rounded-[8px] bg-neutral-soft p-3" : ""}>
      <div
        className={`overflow-hidden rounded-[8px] border border-neutral-border bg-surface-ivory ${
          mobile ? "w-[220px]" : "w-full"
        }`}
      >
        <PreviewNavbar mobile={mobile} />

        <div className={mobile ? "px-3 py-4" : "px-4 py-5"}>
          <div className={mobile ? "flex flex-col gap-3" : "flex items-start gap-3.5"}>
            <div className={mobile ? "" : "min-w-0 flex-1"}>
              {hero.eyebrowText && (
                <p className="font-sora text-[8px] font-bold uppercase tracking-[0.08em] text-brand-accent">
                  {hero.eyebrowText}
                </p>
              )}

              <h3
                className={`mt-1 font-display font-semibold leading-[1.08] tracking-[-0.02em] text-brand-navy ${
                  mobile ? "text-[15px]" : "text-[18px]"
                }`}
              >
                {hero.titleHighlight} {hero.titleAccent}
              </h3>

              <svg
                viewBox="0 0 312 14"
                className="mt-0.5 h-2 w-[58%]"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d={UNDERLINE_PATH}
                  stroke="var(--color-brand-accent)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              <p className="mt-2 font-inter text-[9px] leading-[1.55] text-brand-navy">
                {hero.description}
              </p>

              <span className="mt-2.5 inline-flex max-w-full items-center gap-1 rounded-[8px] bg-brand-whatsapp px-2.5 py-1.5 font-sora text-[9px] font-bold text-brand-navy">
                <span className="truncate">{hero.whatsappCtaText}</span>
              </span>

              {hero.trustStatText && (
                <p className="mt-2 flex items-start gap-1 font-inter text-[8px] leading-[1.5] text-brand-navy">
                  <HeartIcon size={10} className="mt-px shrink-0 text-brand-accent" aria-hidden="true" />
                  {hero.trustStatText}
                </p>
              )}
            </div>

            {/* Collage: foto principal y las tres de apoyo, en la misma relación
                de tamaño que el sitio público. */}
            <div className={mobile ? "flex gap-1.5" : "w-[150px] shrink-0 space-y-1.5"}>
              <PreviewPhoto
                url={hero.backgroundMediaUrl}
                focalX={hero.backgroundFocalX}
                focalY={hero.backgroundFocalY}
                className={mobile ? "h-16 flex-[2] rounded-[6px]" : "h-[100px] w-full rounded-[8px]"}
              />
              <div className={mobile ? "flex flex-[1] flex-col gap-1.5" : "flex gap-1.5"}>
                <PreviewPhoto
                  url={hero.secondaryMedia1Url}
                  focalX={hero.secondaryMedia1FocalX}
                  focalY={hero.secondaryMedia1FocalY}
                  className="h-8 flex-1 rounded-[5px]"
                />
                <PreviewPhoto
                  url={hero.secondaryMedia2Url}
                  focalX={hero.secondaryMedia2FocalX}
                  focalY={hero.secondaryMedia2FocalY}
                  className="h-8 flex-1 rounded-[5px]"
                />
                <PreviewPhoto
                  url={hero.secondaryMedia3Url}
                  focalX={hero.secondaryMedia3FocalX}
                  focalY={hero.secondaryMedia3FocalY}
                  className="h-8 flex-1 rounded-[5px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
