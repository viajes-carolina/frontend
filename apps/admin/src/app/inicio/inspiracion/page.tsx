import { apiClient } from "@vc/api-client";
import { BlogInspirationForm } from "../BlogInspirationForm";
import { withAdminAuth } from "../../../lib/withAdminAuth";

export const dynamic = "force-dynamic";

export default async function InicioInspiracionPage() {
  const inspiration = await withAdminAuth(apiClient.getAdminHomeBlogInspiration(), "/inicio/inspiracion");
  return <BlogInspirationForm initialConfig={inspiration} />;
}
