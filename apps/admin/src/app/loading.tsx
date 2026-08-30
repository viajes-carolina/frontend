import { Skeleton } from "@vc/ui";

/** Bloque hueco con la misma caja que una tarjeta o panel del dashboard. */
function PanelSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-[8px] border border-neutral-border bg-white p-[18px] shadow-[0_2px_8px_rgba(13,20,28,0.06)] ${className}`}
    />
  );
}

// Mismo contenedor, ritmo y geometría que el dashboard real (barra superior,
// encabezado, fila de 3 KPIs y dos paneles 1+2), para que no salte el layout
// cuando llegan los datos.
export default function Loading() {
  return (
    <div className="flex min-h-full flex-col">
      <span className="sr-only" role="status" aria-live="polite">
        Cargando…
      </span>

      <div className="flex h-[72px] shrink-0 items-center justify-between gap-4 border-b border-neutral-border bg-white px-5 lg:px-10">
        <Skeleton className="h-3 w-36" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-28 rounded-[99px]" />
          <Skeleton className="h-9 w-32 rounded-[6px]" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1240px] px-5 py-7 lg:px-10 lg:py-8">
        <div className="flex items-start justify-between gap-5">
          <div className="w-full space-y-3">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-3 w-full max-w-[420px]" />
          </div>
          <Skeleton className="h-9 w-36 shrink-0 rounded-[6px]" />
        </div>

        <Skeleton className="mt-7 h-3 w-28" />
        <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <PanelSkeleton key={index} className="h-[132px]" />
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 items-start gap-5 lg:grid-cols-3">
          <PanelSkeleton className="h-[176px]" />
          <PanelSkeleton className="h-[300px] lg:col-span-2" />
        </div>
      </div>
    </div>
  );
}
