import Link from "next/link";
import { StatusPill } from "./DashboardStatus";
import type { PublicationSummary } from "../../lib/dashboardPublishing";

export interface PublishingStatusPanelProps {
  publication: PublicationSummary;
}

/**
 * Panel "Estado de publicación": qué está viendo el visitante ahora mismo y
 * un camino directo a la pantalla que lo cambia.
 *
 * El diseño incluía además el número de versión, su autora y el recuento de
 * cambios listos para publicar. No se implementan: el backend no versiona
 * publicaciones ni conoce la noción de cambio guardado sin publicar, y
 * escribir esas cifras a mano en un panel de gestión sería inventarlas.
 */
export function PublishingStatusPanel({ publication }: PublishingStatusPanelProps) {
  return (
    <section
      aria-labelledby="estado-publicacion"
      className="flex flex-col rounded-[8px] border border-neutral-border bg-white p-[18px] shadow-[0_2px_8px_rgba(13,20,28,0.06)]"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 id="estado-publicacion" className="font-inter text-[16px] font-semibold text-neutral-ink">
          Estado de publicación
        </h2>
        <StatusPill
          tone={publication.tone}
          label={publication.badge}
          textClassName="text-[10px] font-semibold"
        />
      </div>

      {/* La fecha de la última publicación no se repite aquí: la lleva el KPI
          "Sitio público", en la misma pantalla y a un palmo de distancia. */}
      <p className="mt-5 font-inter text-[18px] font-semibold leading-snug text-neutral-ink">
        {publication.message}
      </p>

      <div aria-hidden="true" className="mt-5 h-px bg-neutral-border" />

      <Link
        href="/publicacion"
        className="mt-5 inline-flex items-center self-start rounded-[6px] bg-brand-navy px-3 py-[9px] font-inter text-[11px] font-semibold text-white transition-colors hover:bg-brand-navy/90"
      >
        Revisar y publicar
      </Link>
    </section>
  );
}
