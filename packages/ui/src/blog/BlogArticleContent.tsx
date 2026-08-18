"use client";

import React from "react";
import { BlogPostDTO } from "@vc/api-client";
import { ResponsiveImage } from "../primitives/ResponsiveImage";
import { WhatsAppButton } from "../primitives/WhatsAppButton";
import { BlogCard } from "./BlogCard";

export interface BlogArticleContentProps {
  post: BlogPostDTO;
  relatedPosts: BlogPostDTO[];
  whatsappPhone?: string;
}

export const BlogArticleContent: React.FC<BlogArticleContentProps> = ({
  post,
  relatedPosts,
  whatsappPhone = "+51987654321",
}) => {
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("es-PE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  // Simple and safe markdown parser for article body without external heavy libraries
  const renderMarkdown = (markdown: string) => {
    if (!markdown) return null;
    const lines = markdown.split("\n");
    const elements: React.ReactNode[] = [];
    let currentParagraph: string[] = [];
    let keyIdx = 0;

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const text = currentParagraph.join(" ");
        elements.push(
          <p key={`p-${keyIdx++}`} className="text-base sm:text-lg text-neutral-700 leading-relaxed mb-6 font-normal">
            {parseInlineStyles(text)}
          </p>
        );
        currentParagraph = [];
      }
    };

    const parseInlineStyles = (text: string): React.ReactNode => {
      // Handle bold **text** and italic *text*
      const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
      return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-bold text-neutral-900">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={i} className="italic text-neutral-800">{part.slice(1, -1)}</em>;
        }
        return part;
      });
    };

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        flushParagraph();
        return;
      }

      if (trimmed.startsWith("# ")) {
        flushParagraph();
        elements.push(
          <h1 key={`h1-${keyIdx++}`} className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 mt-10 mb-4 tracking-tight">
            {trimmed.substring(2)}
          </h1>
        );
      } else if (trimmed.startsWith("## ")) {
        flushParagraph();
        elements.push(
          <h2 key={`h2-${keyIdx++}`} className="text-xl sm:text-2xl font-bold text-neutral-900 mt-8 mb-3 tracking-tight border-b border-neutral-100 pb-2">
            {trimmed.substring(3)}
          </h2>
        );
      } else if (trimmed.startsWith("### ")) {
        flushParagraph();
        elements.push(
          <h3 key={`h3-${keyIdx++}`} className="text-lg sm:text-xl font-bold text-neutral-800 mt-6 mb-2">
            {trimmed.substring(4)}
          </h3>
        );
      } else if (trimmed.startsWith("> ")) {
        flushParagraph();
        elements.push(
          <blockquote key={`quote-${keyIdx++}`} className="border-l-4 border-brand-primary pl-4 py-2 my-6 bg-brand-primary/5 rounded-r-xl italic text-neutral-800 text-base sm:text-lg">
            {parseInlineStyles(trimmed.substring(2))}
          </blockquote>
        );
      } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        flushParagraph();
        elements.push(
          <div key={`li-${keyIdx++}`} className="flex items-start gap-2.5 my-2 text-neutral-700 text-base sm:text-lg">
            <span className="text-brand-secondary font-bold mt-1">✓</span>
            <span>{parseInlineStyles(trimmed.substring(2))}</span>
          </div>
        );
      } else if (/^\d+\.\s/.test(trimmed)) {
        flushParagraph();
        const num = trimmed.match(/^\d+/)?.[0];
        const content = trimmed.replace(/^\d+\.\s/, "");
        elements.push(
          <div key={`num-${keyIdx++}`} className="flex items-start gap-3 my-2 text-neutral-700 text-base sm:text-lg">
            <span className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              {num}
            </span>
            <span>{parseInlineStyles(content)}</span>
          </div>
        );
      } else if (trimmed === "---") {
        flushParagraph();
        elements.push(<hr key={`hr-${keyIdx++}`} className="my-8 border-neutral-200" />);
      } else {
        currentParagraph.push(trimmed);
      }
    });

    flushParagraph();
    return elements;
  };

  const whatsappMessage = `Hola Viajes Carolina, acabo de leer el artículo "${post.title}" en su blog y deseo cotizar un paquete personalizado.`;

  return (
    <article className="py-8 sm:py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-neutral-500 mb-6 flex-wrap">
          <a href="/" className="hover:text-brand-primary transition">Inicio</a>
          <span>/</span>
          <a href="/blog" className="hover:text-brand-primary transition">Blog</a>
          {post.categoryName && (
            <>
              <span>/</span>
              <span className="text-brand-primary font-medium">{post.categoryName}</span>
            </>
          )}
        </nav>

        {/* Category & Metadata */}
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-neutral-500 font-medium mb-4">
          {post.categoryName && (
            <span className="bg-brand-primary/10 text-brand-primary font-bold px-3 py-1 rounded-full">
              {post.categoryName}
            </span>
          )}
          {formattedDate && <span>📅 {formattedDate}</span>}
          <span>•</span>
          <span>⏱️ {post.readingTimeMinutes} min de lectura</span>
          <span>•</span>
          <span>👁️ {post.viewCount} vistas</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 leading-tight mb-6">
          {post.title}
        </h1>

        {/* Lead / Summary */}
        <p className="text-lg sm:text-xl text-neutral-600 font-normal leading-relaxed mb-8 border-l-4 border-brand-secondary pl-4 py-1">
          {post.summary}
        </p>

        {/* Author Header */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-100 mb-8">
          <div className="w-12 h-12 rounded-full bg-brand-primary text-white font-black text-lg flex items-center justify-center shadow-sm">
            {post.authorName.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-900">{post.authorName}</p>
            <p className="text-xs text-neutral-500">Especialista en Destinos de Viajes Carolina</p>
          </div>
        </div>

        {/* Cover Hero Image */}
        <div className="relative w-full h-72 sm:h-96 lg:h-[450px] rounded-3xl overflow-hidden shadow-xl mb-12 border border-neutral-100">
          <ResponsiveImage
            src={post.coverMediaUrl || "/media/demo-cartagena-caribe.webp"}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Body Content */}
        <div className="article-prose prose-neutral max-w-none mb-12">
          {renderMarkdown(post.contentMarkdown)}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-6 border-t border-neutral-200 mb-10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
              Temas relacionados:
            </h4>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-neutral-100 text-neutral-700 text-xs font-semibold"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Direct CTA Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-brand-primary to-brand-primary/95 text-white shadow-xl mb-16 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6">
          <div className="mb-6 sm:mb-0">
            <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider">
              ¿Listo para vivir esta experiencia?
            </span>
            <h3 className="text-xl sm:text-2xl font-black mt-1 mb-2 text-white">
              Diseñamos tu viaje a medida
            </h3>
            <p className="text-sm text-white/80 max-w-md">
              Escríbenos directamente y una de nuestras asesoras armará una propuesta con vuelos, hoteles e itinerario guiado.
            </p>
          </div>
          <div className="shrink-0">
            <WhatsAppButton
              phone={whatsappPhone}
              message={whatsappMessage}
              size="lg"
            >
              Hablar con una Asesora
            </WhatsAppButton>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="pt-12 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900">
                  Artículos relacionados
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500">
                  Continúa explorando más historias y recomendaciones
                </p>
              </div>
              <a
                href="/blog"
                className="text-xs sm:text-sm font-bold text-brand-primary hover:text-brand-secondary transition"
              >
                Ver todos →
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <BlogCard key={related.id} post={related} />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
