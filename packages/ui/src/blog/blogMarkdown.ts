const WORDS_PER_MINUTE = 200;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export interface MarkdownHeading {
  id: string;
  index: number;
  title: string;
}

/**
 * Extrae los `##` del markdown del artículo para armar el índice "EN ESTA
 * GUÍA" y el tiempo estimado — sin ampliar el parser casero existente, solo
 * lo lee. Cada heading recibe un `id` (slug) para anclar con `BlogArticleBody`.
 */
export function parseMarkdownHeadings(markdown: string): MarkdownHeading[] {
  if (!markdown) return [];
  const lines = markdown.split("\n");
  const headings: MarkdownHeading[] = [];
  let index = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) {
      index += 1;
      const title = trimmed.substring(3).replace(/^\d+\.\s*/, "");
      headings.push({ id: slugify(title), index, title });
    }
  }

  return headings;
}

export function estimateReadingMinutes(markdown: string): number {
  if (!markdown) return 1;
  const words = markdown.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
