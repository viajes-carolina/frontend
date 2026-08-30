import { apiClient } from "@vc/api-client";
import { AdminSectionLayout } from "../../../components/AdminSectionLayout";
import { withAdminAuth } from "../../../lib/withAdminAuth";
import { BlogInspirationForm } from "../BlogInspirationForm";

export const dynamic = "force-dynamic";

export default async function InicioInspiracionPage() {
  const inspiration = await withAdminAuth(apiClient.getAdminHomeBlogInspiration(), "/inicio/inspiracion");

  return (
    <AdminSectionLayout
      eyebrow="Inicio"
      title="Blog en Home"
      description="Bloque de inspiración de la portada, que enlaza los artículos del blog."
    >
      <BlogInspirationForm initialConfig={inspiration} />
    </AdminSectionLayout>
  );
}
