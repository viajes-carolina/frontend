import { apiClient } from "@vc/api-client";
import { CategoriesPanel } from "./CategoriesPanel";

export const dynamic = "force-dynamic";

export default async function BlogCategoriasPage() {
  const categories = await apiClient.getBlogCategories(true);
  return (
    <div className="space-y-8">
      <CategoriesPanel initialCategories={categories} />
    </div>
  );
}
