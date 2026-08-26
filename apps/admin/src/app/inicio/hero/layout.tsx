import Image from "next/image";
import { apiClient } from "@vc/api-client";

export const dynamic = "force-dynamic";

export default async function InicioHeroLayout({ children }: { children: React.ReactNode }) {
  const hero = await apiClient.getHomeHero();

  const bgImageSrc = hero.backgroundMediaUrl
    ? hero.backgroundMediaUrl.startsWith("http") || hero.backgroundMediaUrl.startsWith("/")
      ? hero.backgroundMediaUrl
      : `/${hero.backgroundMediaUrl}`
    : "/media/demo-cartagena-caribe.webp";

  return (
    <div className="space-y-8">
      {/* Vista previa simplificada — el Hero real es marfil con collage de 3 fotos,
          esta tarjeta solo confirma texto/CTA y la foto principal, no replica el collage completo */}
      <div className="rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm border border-neutral-border bg-surface-ivory min-h-[280px] flex flex-col justify-between max-w-4xl">
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
                objectPosition: `${hero.backgroundFocalX || 50}% ${hero.backgroundFocalY || 50}%`,
              }}
            />
          </div>

          <div className="space-y-3 max-w-xl">
            <h1 className="font-display font-medium text-xl sm:text-2xl leading-tight text-brand-navy">
              {hero.titleHighlight || "Tu viaje comienza"} {hero.titleAccent || "con una conversación."}
            </h1>

            <p className="font-inter text-xs sm:text-sm text-neutral-muted line-clamp-2">
              {hero.description || "Cuéntanos qué sueñas y diseñamos un viaje a tu medida."}
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-3">
              <div className="px-5 py-2.5 rounded-xl bg-brand-whatsapp text-brand-navy font-sora font-bold text-xs shadow-sm inline-flex items-center gap-2">
                <span>💬 {hero.whatsappCtaText || "Cuéntanos qué imaginas por WhatsApp"}</span>
              </div>
            </div>

            {hero.trustStatText && (
              <p className="font-inter text-xs text-neutral-muted pt-1">♡ {hero.trustStatText}</p>
            )}
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-neutral-border text-[11px] text-neutral-muted font-inter">
          <p className="mb-1">
            Controla qué parte de la foto se ve primero al recortarla — ajústalo abajo, en la sección de fotos.
          </p>
          Punto focal de la foto principal: <strong>X {hero.backgroundFocalX || 50}% · Y{" "}
          {hero.backgroundFocalY || 50}%</strong> — las 3 fotos de apoyo se configuran más abajo, en &quot;Collage
          de fotos de clientes&quot;.
        </div>
      </div>

      {children}
    </div>
  );
}
