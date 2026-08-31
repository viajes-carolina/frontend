import { apiClient } from "@vc/api-client";
import { ADMIN_SECTION_CONTAINER } from "../../../components/AdminSectionLayout";
import { DEFAULT_PAGE_SIZE } from "../../../components/table";
import { withAdminAuth } from "../../../lib/withAdminAuth";
import { PromotionsScreen } from "./PromotionsScreen";

export const dynamic = "force-dynamic";

/**
 * Promociones de la portada: el encabezado de la sección y el catálogo de
 * ofertas destacadas, que antes vivían en dos rutas distintas. Se editan
 * juntos porque se ven juntos en el sitio.
 *
 * La cabecera no usa `AdminSectionLayout` sino su contenedor y su
 * `AdminPageHeader` por separado: el diseño lleva una acción a la derecha del
 * título ("Editar encabezado") que abre y cierra el formulario de la sección, y
 * eso necesita estado de cliente.
 */
export default async function InicioPromocionesPage() {
  /* Solo la PRIMERA página, sin filtros: 15 filas y los contadores del catálogo.
     El resto de páginas las pide el navegador conforme se piden, así que abrir
     esta pantalla ya no descarga las 32 promociones enteras. */
  const [section, promotionsPage] = await Promise.all([
    withAdminAuth(apiClient.getAdminHomePromotionsSection(), "/inicio/promociones"),
    withAdminAuth(
      apiClient.getAdminPromotionsPage({ page: 0, size: DEFAULT_PAGE_SIZE }),
      "/inicio/promociones"
    ),
  ]);

  return (
    <div className={ADMIN_SECTION_CONTAINER}>
      <PromotionsScreen initialSection={section} initialPromotionsPage={promotionsPage} />
    </div>
  );
}
