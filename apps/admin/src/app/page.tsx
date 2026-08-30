import Link from "next/link";
import { AdminPageHeader } from "../components/AdminPageHeader";
import { DashboardKpiCard } from "../components/dashboard/DashboardKpiCard";
import { DashboardTopbar } from "../components/dashboard/DashboardTopbar";
import { PublishingStatusPanel } from "../components/dashboard/PublishingStatusPanel";
import { RecentActivityPanel } from "../components/dashboard/RecentActivityPanel";
import { loadDashboardData } from "../lib/dashboardData";

export const dynamic = "force-dynamic";

/**
 * Tablero operativo del panel: en qué estado está el sitio publicado, qué
 * queda por atender y qué se tocó últimamente.
 *
 * Solo se pintan bloques con dato real detrás. El diseño incluía además un KPI
 * de cambios pendientes, una cola de tareas y un estado de publicación por
 * módulo; el backend no tiene ninguno de los tres, así que no se dibujan.
 * Composición resultante: una fila de tres KPIs y, debajo, dos paneles que
 * comparten el mismo ritmo de tres columnas (1 + 2) para que los bordes
 * queden alineados y no aparezcan huecos.
 */
export default async function AdminDashboardPage() {
  const data = await loadDashboardData();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <div className="flex min-h-full flex-col">
      <DashboardTopbar
        statusLabel={data.publication.badge}
        statusTone={data.publication.tone}
        siteUrl={siteUrl}
      />

      {/* El tope de 1240px no muerde en el ancho de referencia del diseño
          (1440 menos el sidebar): ahí el respiro lateral queda simétrico en los
          40px del diseño y solo entra a limitar en pantallas más anchas. */}
      {/* `mx-auto` no altera el diseño a 1440 (ahí el contenido no llega al
          tope de 1240px), pero por encima evita que el dashboard quede pegado
          a la izquierda mientras el resto del panel va centrado. */}
      <div className="mx-auto w-full max-w-[1240px] px-5 py-7 lg:px-10 lg:py-8">
        <AdminPageHeader
          title="Dashboard"
          description="Resumen operativo del sitio y tareas que requieren atención."
          divider={false}
          action={
            // Enlace y no <Button>: lleva a la pantalla donde se revisa y se
            // lanza la publicación, no dispara una mutación desde aquí.
            <Link
              href="/publicacion"
              className="inline-flex items-center rounded-[6px] bg-brand-accent px-3.5 py-2.5 font-inter text-[12px] font-semibold text-on-accent transition-colors hover:bg-brand-accent/90"
            >
              Publicar cambios
            </Link>
          }
        />

        <section aria-labelledby="estado-general" className="mt-7">
          <h2
            id="estado-general"
            className="font-inter text-[12px] font-semibold text-neutral-muted"
          >
            Estado general
          </h2>

          <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <DashboardKpiCard
              label="Sitio público"
              value={data.publication.kpiValue}
              detail={data.publication.kpiDetail}
              tone={data.publication.tone}
            />
            <DashboardKpiCard
              label="Borradores"
              value={data.drafts.value}
              detail={data.drafts.detail}
              tone={data.drafts.tone}
            />
            <DashboardKpiCard
              label="Reclamaciones"
              value={data.pendingClaims.value}
              detail={data.pendingClaims.detail}
              tone={data.pendingClaims.tone}
            />
          </div>
        </section>

        <div className="mt-5 grid grid-cols-1 items-start gap-5 lg:grid-cols-3">
          <PublishingStatusPanel publication={data.publication} />
          <div className="lg:col-span-2">
            <RecentActivityPanel items={data.activity} available={data.activityAvailable} />
          </div>
        </div>
      </div>
    </div>
  );
}
