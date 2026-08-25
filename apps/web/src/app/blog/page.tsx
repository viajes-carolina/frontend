import { Metadata } from "next";
import { apiClient } from "@vc/api-client";
import { BlogHeroSection, BlogEditorialIndexSection, BlogQuestionsPauseSection } from "@vc/ui";

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
  searchParams: Promise<{ categoria?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { categoria } = await searchParams;
  const [blogData, trust] = await Promise.all([
    apiClient.getPublicBlog(categoria, undefined, 0, 6),
    apiClient.getPublicTrust(),
  ]);

  const heroPost = blogData.featuredPost ?? blogData.items[0];
  const secondaryStories = blogData.items.filter((p) => p.id !== heroPost?.id);
  const [mainStory, ...restStories] = secondaryStories;
  const faqs = trust.faqs.filter((f) => f.active).slice(0, 4);

  return (
    <main className="min-h-screen bg-surface-ivory">
      <BlogHeroSection categories={blogData.categories} selectedCategorySlug={categoria || "all"} heroPost={heroPost} />

      {mainStory && (
        <BlogEditorialIndexSection mainStory={mainStory} secondaryStories={restStories.slice(0, 2)} />
      )}

      <BlogQuestionsPauseSection faqs={faqs} />
    </main>
  );
}
