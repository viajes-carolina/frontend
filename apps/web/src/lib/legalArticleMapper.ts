import type { LegalArticleSectionItem } from "@vc/ui";
import type { LegalSectionDTO } from "@vc/api-client";

// El backend guarda `sections` sin número (`{title, body}[]`); las 5 páginas
// legales/institucionales numeran las secciones en la vista según su orden.
// Extraído a `lib/` porque las 5 páginas (`.tsx`) son plantillas puras y no
// deben repetir ni ejecutar este cálculo en su cuerpo.
export function toNumberedSections(sections: LegalSectionDTO[]): LegalArticleSectionItem[] {
  return sections.map((section, idx) => ({
    number: String(idx + 1).padStart(2, "0"),
    title: section.title,
    body: section.body,
  }));
}

interface LegalArticleBaseDTO {
  eyebrow: string;
  title: string;
  introduction: string;
  documentControlLabel: string;
  documentControlText: string;
  sections: LegalSectionDTO[];
  closingTitle: string;
  closingBody: string;
  closingLinkLabel: string;
}

export interface LegalArticleBaseProps {
  eyebrow: string;
  title: string;
  intro: string;
  updatedLabel: string;
  sections: LegalArticleSectionItem[];
  closingTitle: string;
  closingBody: string;
  whatsappCtaLabel: string;
}

// Mapea el DTO común de las 5 páginas legales a las props base de
// `LegalArticleSection` — cada `page.tsx` solo agrega encima lo que le falta
// (whatsappPhone/Message desde site settings, y `declaration`/`verification`
// cuando corresponde).
export function toLegalArticleSectionProps(dto: LegalArticleBaseDTO): LegalArticleBaseProps {
  return {
    eyebrow: dto.eyebrow,
    title: dto.title,
    intro: dto.introduction,
    updatedLabel: `${dto.documentControlLabel}: ${dto.documentControlText}`,
    sections: toNumberedSections(dto.sections),
    closingTitle: dto.closingTitle,
    closingBody: dto.closingBody,
    whatsappCtaLabel: dto.closingLinkLabel,
  };
}
