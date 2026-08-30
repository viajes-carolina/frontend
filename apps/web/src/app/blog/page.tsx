import { Metadata } from "next";
import { apiClient } from "@vc/api-client";
import { BlogHeroSection, BlogLibrarySection } from "@vc/ui";

export const metadata: Metadata = {
  title: "Blog de Viajes | Guías, Consejos e Inspiración — Viajes Carolina",
  description:
    "Descubre guías completas de viaje, recomendaciones de playas, circuitos turísticos, requisitos de viaje y los mejores consejos de nuestras asesoras expertas.",
  openGraph: {
    title: "Blog de Viajes | Guías, Consejos e Inspiración — Viajes Carolina",
    description:
      "Descubre guías completas de viaje, recomendaciones de playas, circuitos turísticos y tips de asesoras expertas.",
    images: ["/media/demo-cartagena-caribe.webp"],
  },
};

interface BlogPageProps {
  searchParams: Promise<{ categoria?: string; q?: string; pagina?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { categoria, q, pagina } = await searchParams;
  const parsedPagina = Number.parseInt(pagina ?? "", 10);
  const page = Number.isFinite(parsedPagina) && parsedPagina > 0 ? parsedPagina - 1 : 0;

  const [blogData, blogHero, blogLibrary] = await Promise.all([
    apiClient.getPublicBlog(categoria, q, page, 6, { revalidate: 3600 }),
    apiClient.getPublicBlogHero({ revalidate: 3600 }),
    apiClient.getPublicBlogLibrary({ revalidate: 3600 }),
  ]);

  const heroPost = blogData.featuredPost ?? blogData.items[0];

  return (
    <main className="min-h-screen">
      <BlogHeroSection heroPost={heroPost} config={blogHero} />

      <BlogLibrarySection
        posts={blogData.items}
        categories={blogData.categories}
        selectedCategorySlug={categoria || "all"}
        searchQuery={q || ""}
        total={blogData.total}
        page={blogData.page}
        totalPages={blogData.totalPages}
        config={blogLibrary}
      />
    </main>
  );
}
