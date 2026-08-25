import React from "react";
import { BlogPostDTO } from "@vc/api-client";
import { DEFAULT_WHATSAPP_PHONE } from "@vc/config";
import { parseMarkdownHeadings } from "./blogMarkdown";
import { BlogArticleCover } from "./BlogArticleCover";
import { BlogArticleTOC } from "./BlogArticleTOC";
import { BlogArticleBody } from "./BlogArticleBody";
import { BlogArticleClosingCta } from "./BlogArticleClosingCta";
import { BlogRelatedStoriesSection } from "./BlogRelatedStoriesSection";

export interface BlogArticleContentProps {
  post: BlogPostDTO;
  relatedPosts: BlogPostDTO[];
  whatsappPhone?: string;
}

export const BlogArticleContent: React.FC<BlogArticleContentProps> = ({
  post,
  relatedPosts,
  whatsappPhone = DEFAULT_WHATSAPP_PHONE,
}) => {
  const headings = parseMarkdownHeadings(post.contentMarkdown);

  return (
    <>
      <BlogArticleCover post={post} />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[250px_1fr] lg:gap-16">
            <BlogArticleTOC headings={headings} readingTimeMinutes={post.readingTimeMinutes} />
            <div className="min-w-0">
              <BlogArticleBody markdown={post.contentMarkdown} />
              <BlogArticleClosingCta postTitle={post.title} whatsappPhone={whatsappPhone} />
            </div>
          </div>
        </div>
      </section>

      <BlogRelatedStoriesSection posts={relatedPosts} />
    </>
  );
};
