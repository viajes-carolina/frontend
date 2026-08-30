import { apiClient } from "@vc/api-client";
import { BlogHeroConfigForm } from "./BlogHeroConfigForm";
import { withAdminAuth } from "../../../lib/withAdminAuth";

export const dynamic = "force-dynamic";

export default async function BlogPortadaPage() {
  const blogHero = await withAdminAuth(apiClient.getAdminBlogHero(), "/blog/portada");
  return <BlogHeroConfigForm initialConfig={blogHero} />;
}
