import { Skeleton } from "@vc/ui";

/**
 * Esqueleto del editor del Hero: reproduce el encabezado, las dos columnas
 * (formulario y vista previa) y la barra de acciones, para que no haya salto
 * de maquetación cuando llegan los datos.
 */
export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-[1240px] px-5 py-7 lg:px-10 lg:py-8">
      <span className="sr-only" role="status" aria-live="polite">
        Cargando…
      </span>

      <div className="space-y-2">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-3 w-80" />
      </div>

      <div className="mt-5 grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,690px)_minmax(0,404px)]">
        <div className="space-y-4 rounded-[8px] border border-neutral-border bg-white p-5">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-9 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
          <Skeleton className="h-[66px] w-full" />
          <Skeleton className="h-[88px] w-full" />
          <Skeleton className="h-[88px] w-full" />
        </div>

        <div className="space-y-4 rounded-[8px] border border-neutral-border bg-white p-5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>

      <Skeleton className="mt-5 h-14 w-full rounded-[8px]" />
    </div>
  );
}
