import { apiClient } from "@vc/api-client";
import { BlogLibraryForm } from "./BlogLibraryForm";
import { withAdminAuth } from "../../../lib/withAdminAuth";

export const dynamic = "force-dynamic";

export default async function BlogBibliotecaPage() {
  const blogLibrary = await withAdminAuth(apiClient.getAdminBlogLibrary(), "/blog/biblioteca");
  return <BlogLibraryForm initialConfig={blogLibrary} />;
}
