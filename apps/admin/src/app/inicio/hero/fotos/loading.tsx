import { Skeleton } from "@vc/ui";

// Forma real de FotosForm (1 foto grande `aspect-4/3` + 3 fotos de apoyo
// `aspect-video`), no un formulario de texto — un `FormSkeleton` genérico
// (barras de texto) no se parece en nada al contenido real. Composición
// local con el átomo `Skeleton`, sin agregar un componente compartido nuevo
// para una forma que hoy solo usa esta única página.
export default function Loading() {
  return (
    <div className="max-w-4xl space-y-6 rounded-2xl border border-neutral-border bg-white p-6 shadow-sm sm:p-8">
      <div className="space-y-2">
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
      <Skeleton className="aspect-4/3 w-full rounded-xl sm:w-56" />
      <div className="grid grid-cols-1 gap-4 border-t border-neutral-border pt-2 sm:grid-cols-3">
        <Skeleton className="aspect-video w-full rounded-xl" />
        <Skeleton className="aspect-video w-full rounded-xl" />
        <Skeleton className="aspect-video w-full rounded-xl" />
      </div>
    </div>
  );
}
