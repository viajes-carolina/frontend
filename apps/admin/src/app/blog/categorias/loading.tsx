import { Skeleton, TableSkeleton } from "@vc/ui";

// CategoriesPanel real tiene 2 bloques apilados: la tarjeta de alta/edición
// arriba (`bg-neutral-soft`, 3 campos) y la lista abajo (`TableSkeleton` ya
// representa bien esa segunda parte) — un `TableSkeleton` solo no mostraba
// la tarjeta de arriba.
export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="space-y-4 rounded-2xl border border-neutral-border bg-neutral-soft p-4">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
      <TableSkeleton />
    </div>
  );
}
