import { apiClient } from "@vc/api-client";
import { BlogInspirationForm } from "../BlogInspirationForm";

export const dynamic = "force-dynamic";

export default async function InicioInspiracionPage() {
  const inspiration = await apiClient.getAdminHomeBlogInspiration();
  return <BlogInspirationForm initialConfig={inspiration} />;
}
