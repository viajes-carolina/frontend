import { Skeleton, TableSkeleton } from "@vc/ui";
import { AdminSectionLoading } from "../../../components/AdminSectionLoading";

/**
 * El esqueleto refleja lo que se va a pintar: cuatro tarjetas de métrica y la
 * tabla. El formulario del encabezado de sección llega plegado, así que no
 * tiene esqueleto — reservarle sitio dejaría un hueco que nunca se llena.
 */
export default function Loading() {
  return (
    <AdminSectionLoading>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((index) => (
            <Skeleton key={index} className="h-[92px] rounded-[10px]" />
          ))}
        </div>
        <TableSkeleton />
      </div>
    </AdminSectionLoading>
  );
}
