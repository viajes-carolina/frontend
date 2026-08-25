import React from "react";
import { MarkdownHeading } from "./blogMarkdown";

export interface BlogArticleTOCProps {
  headings: MarkdownHeading[];
  readingTimeMinutes: number;
}

export const BlogArticleTOC: React.FC<BlogArticleTOCProps> = ({ headings, readingTimeMinutes }) => {
  if (headings.length === 0) return null;

  return (
    <aside className="rounded-[24px] bg-[rgba(219,237,245,0.62)] p-6 lg:sticky lg:top-24">
      <p className="font-sora text-[10px] font-semibold uppercase tracking-wider text-brand-accent">
        En esta guía
      </p>
      <nav className="mt-6 flex flex-col gap-4">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className="font-inter text-[13px] font-semibold text-brand-navy hover:text-brand-accent transition-colors"
          >
            {String(heading.index).padStart(2, "0")}&nbsp;&nbsp;{heading.title}
          </a>
        ))}
      </nav>
      <div className="mt-6 border-t border-brand-navy/[0.18] pt-4">
        <p className="font-inter text-xs text-brand-navy">
          Tiempo estimado: {readingTimeMinutes} minuto{readingTimeMinutes === 1 ? "" : "s"}
        </p>
      </div>
    </aside>
  );
};
