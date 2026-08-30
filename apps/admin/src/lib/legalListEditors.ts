import type { LegalSectionDTO, CookieCategoryDTO } from "@vc/api-client";

// Helpers puros compartidos por los 5 hooks `useAdminLegalX` — evitan repetir
// la misma lógica de "lista repetible" (agregar/quitar/editar ítem) en cada
// uno. Sin drag-and-drop, tal como pide el alcance: solo agregar al final y
// quitar por índice.

export function addEmptySection<T extends { sections: LegalSectionDTO[] }>(data: T): T {
  return { ...data, sections: [...data.sections, { title: "", body: "" }] };
}

export function removeSectionAt<T extends { sections: LegalSectionDTO[] }>(data: T, index: number): T {
  return { ...data, sections: data.sections.filter((_, i) => i !== index) };
}

export function updateSectionField<T extends { sections: LegalSectionDTO[] }>(
  data: T,
  index: number,
  field: keyof LegalSectionDTO,
  value: string
): T {
  const sections = [...data.sections];
  sections[index] = { ...sections[index], [field]: value };
  return { ...data, sections };
}

export function addEmptyCookieCategory<T extends { cookieCategories: CookieCategoryDTO[] }>(data: T): T {
  return { ...data, cookieCategories: [...data.cookieCategories, { key: "", name: "", description: "", required: false }] };
}

export function removeCookieCategoryAt<T extends { cookieCategories: CookieCategoryDTO[] }>(data: T, index: number): T {
  return { ...data, cookieCategories: data.cookieCategories.filter((_, i) => i !== index) };
}

export function updateCookieCategoryField<T extends { cookieCategories: CookieCategoryDTO[] }>(
  data: T,
  index: number,
  field: keyof CookieCategoryDTO,
  value: string | boolean
): T {
  const cookieCategories = [...data.cookieCategories];
  cookieCategories[index] = { ...cookieCategories[index], [field]: value } as CookieCategoryDTO;
  return { ...data, cookieCategories };
}
