import { apiClient } from "@vc/api-client";
import { AdminSectionLayout } from "../../../components/AdminSectionLayout";
import { withAdminAuth } from "../../../lib/withAdminAuth";
import { FaqSectionForm } from "../FaqSectionForm";
import { FaqItemsPanel } from "./FaqItemsPanel";

export const dynamic = "force-dynamic";

/**
 * Preguntas frecuentes de la portada: encabezado de la sección y listado de
 * preguntas, fusionados en una sola pantalla.
 */
export default async function InicioPreguntasFrecuentesPage() {
  const [section, faqs] = await Promise.all([
    withAdminAuth(apiClient.getAdminHomeFaqSection(), "/inicio/preguntas-frecuentes"),
    withAdminAuth(apiClient.getFaqs(), "/inicio/preguntas-frecuentes"),
  ]);

  return (
    <AdminSectionLayout
      eyebrow="Inicio"
      title="Preguntas frecuentes"
      description="Encabezado de la sección y preguntas que responden las dudas más habituales antes de escribir."
    >
      <div className="space-y-8">
        <FaqSectionForm initialConfig={section} />
        <FaqItemsPanel initialFaqs={faqs} />
      </div>
    </AdminSectionLayout>
  );
}
