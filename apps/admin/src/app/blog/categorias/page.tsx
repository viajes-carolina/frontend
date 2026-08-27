import { apiClient } from "@vc/api-client";
import { CategoriesPanel } from "./CategoriesPanel";
import { withAdminAuth } from "../../../lib/withAdminAuth";

export const dynamic = "force-dynamic";

export default async function BlogCategoriasPage() {
  const categories = await withAdminAuth(apiClient.getBlogCategories(true), "/blog/categorias");
  return (
    <div className="space-y-8">
      <CategoriesPanel initialCategories={categories} />
    </div>
  );
}
