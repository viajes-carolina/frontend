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
    const detail = await apiClient.getBlogPostBySlug(slug);
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
    const detail = await apiClient.getBlogPostBySlug(slug);
    if (!detail?.post) {
      notFound();
    }
    const settings = await apiClient.getSiteSettings();

    return (
      <main className="min-h-screen bg-neutral-50/30">
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
