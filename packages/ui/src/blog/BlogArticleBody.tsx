import React from "react";
import { slugify } from "./blogMarkdown";

export interface BlogArticleBodyProps {
  markdown: string;
}

const parseInlineStyles = (text: string): React.ReactNode => {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-brand-navy">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
};

// Mismo parser casero de siempre (sin ampliar sintaxis) — solo se agrega
// `id` a cada `<h2>` (para anclar con BlogArticleTOC) y se reestiliza el
// blockquote como tarjeta navy con atribución, por diseño.
export const BlogArticleBody: React.FC<BlogArticleBodyProps> = ({ markdown }) => {
  if (!markdown) return null;
  const lines = markdown.split("\n");
  const elements: React.ReactNode[] = [];
  let currentParagraph: string[] = [];
  let keyIdx = 0;

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(" ");
      elements.push(
        <p key={`p-${keyIdx++}`} className="font-inter text-base sm:text-lg leading-[1.7] text-brand-navy mb-6">
          {parseInlineStyles(text)}
        </p>
      );
      currentParagraph = [];
    }
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
        <h1
          key={`h1-${keyIdx++}`}
          className="font-display text-3xl sm:text-4xl font-semibold text-brand-navy mt-10 mb-4"
          style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
        >
          {trimmed.substring(2)}
        </h1>
      );
    } else if (trimmed.startsWith("## ")) {
      flushParagraph();
      const title = trimmed.substring(3);
      elements.push(
        <h2
          key={`h2-${keyIdx++}`}
          id={slugify(title.replace(/^\d+\.\s*/, ""))}
          className="font-display text-2xl sm:text-[34px] font-semibold text-brand-navy mt-10 mb-4 scroll-mt-24"
          style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
        >
          {title}
        </h2>
      );
    } else if (trimmed.startsWith("### ")) {
      flushParagraph();
      elements.push(
        <h3 key={`h3-${keyIdx++}`} className="font-display text-lg sm:text-xl font-semibold text-brand-navy mt-6 mb-2">
          {trimmed.substring(4)}
        </h3>
      );
    } else if (trimmed.startsWith("> ")) {
      flushParagraph();
      const [quote, attribution] = trimmed.substring(2).split(" — ");
      elements.push(
        <blockquote
          key={`quote-${keyIdx++}`}
          className="relative rounded-[28px] bg-brand-navy px-9 py-7 my-8 sm:px-12 sm:py-8"
        >
          <span
            className="font-display block text-4xl sm:text-[56px] leading-none text-brand-accent"
            style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
            aria-hidden="true"
          >
            &ldquo;
          </span>
          <p
            className="font-display -mt-4 sm:-mt-8 text-lg sm:text-2xl italic leading-snug text-white"
            style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
          >
            {parseInlineStyles(quote)}
          </p>
          {attribution && (
            <p className="font-inter mt-4 text-xs sm:text-[12px] font-semibold text-brand-whatsapp">
              — {parseInlineStyles(attribution)}
            </p>
          )}
        </blockquote>
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      flushParagraph();
      elements.push(
        <div key={`li-${keyIdx++}`} className="flex items-start gap-2.5 my-2 text-brand-navy text-base sm:text-lg">
          <span className="text-brand-accent font-semibold mt-1">✓</span>
          <span>{parseInlineStyles(trimmed.substring(2))}</span>
        </div>
      );
    } else if (/^\d+\.\s/.test(trimmed)) {
      flushParagraph();
      const num = trimmed.match(/^\d+/)?.[0];
      const content = trimmed.replace(/^\d+\.\s/, "");
      elements.push(
        <div key={`num-${keyIdx++}`} className="flex items-start gap-3 my-2 text-brand-navy text-base sm:text-lg">
          <span className="w-6 h-6 rounded-full bg-brand-navy text-white text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
            {num}
          </span>
          <span>{parseInlineStyles(content)}</span>
        </div>
      );
    } else if (trimmed === "---") {
      flushParagraph();
      elements.push(<hr key={`hr-${keyIdx++}`} className="my-8 border-neutral-border" />);
    } else {
      currentParagraph.push(trimmed);
    }
  });

  flushParagraph();
  return <div className="article-prose">{elements}</div>;
};
