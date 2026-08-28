import { Metadata } from "next";
import { notFound } from "next/navigation";
import { apiClient } from "@vc/api-client";
import { DEFAULT_WHATSAPP_PHONE } from "@vc/config";
import { BlogArticleContent } from "@vc/ui";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const detail = await apiClient.getBlogPostBySlug(slug, { revalidate: 3600 });
    if (!detail?.post) {
      return { title: "Artículo no encontrado — Viajes Carolina" };
    }
    return {
      title: `${detail.post.title} | Blog Viajes Carolina`,
      description: detail.post.summary,
      openGraph: {
        title: `${detail.post.title} | Blog Viajes Carolina`,
        description: detail.post.summary,
        images: [detail.post.coverMediaUrl || "/media/demo-cartagena-caribe.webp"],
        type: "article",
        publishedTime: detail.post.publishedAt,
        authors: [detail.post.authorName],
        tags: detail.post.tags,
      },
    };
  } catch {
    return { title: "Blog — Viajes Carolina" };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  try {
    const [detail, settings] = await Promise.all([
      apiClient.getBlogPostBySlug(slug, { revalidate: 3600 }),
      apiClient.getSiteSettings({ revalidate: 3600 }),
    ]);
    if (!detail?.post) {
      notFound();
    }

    return (
      <main className="min-h-screen">
        <BlogArticleContent
          post={detail.post}
          relatedPosts={detail.relatedPosts || []}
          whatsappPhone={settings.whatsappPhone || DEFAULT_WHATSAPP_PHONE}
        />
      </main>
    );
  } catch {
    notFound();
  }
}
