import { SiteSettingsDTO, OfficeLocationDTO, PromotionDTO, BlogPostDTO, ApiInfoDTO } from "./types";

export const DEFAULT_SITE_SETTINGS: SiteSettingsDTO = {
  id: 1,
  siteName: "Viajes Carolina",
  brandTagline: "El viaje comienza aquí",
  contactEmail: "contacto@viajescarolina.com",
  primaryPhone: "+51 987 654 321",
  whatsappPhone: "+51987654321",
  whatsappDefaultMessage: "Hola Viajes Carolina, deseo asesoría personalizada para mi próximo viaje.",
  facebookUrl: "https://facebook.com/viajescarolina",
  instagramUrl: "https://instagram.com/viajescarolina",
  tiktokUrl: "https://tiktok.com/@viajescarolina",
};

export const DEFAULT_OFFICE_LOCATION: OfficeLocationDTO = {
  id: 1,
  addressLine: "Av. Larco 101, Oficina 502",
  district: "Miraflores",
  city: "Lima",
  country: "Perú",
  postalCode: "15074",
  referenceLandmark: "A media cuadra del Parque Kennedy",
  latitude: -12.1215430,
  longitude: -77.0298760,
  googleMapsUrl: "https://maps.google.com/?q=Miraflores,Lima,Peru",
  scheduleWeekdays: "Lunes a Viernes: 9:00 AM – 7:00 PM",
  scheduleSaturdays: "Sábados: 9:00 AM – 2:00 PM",
  active: true,
  revision: 1,
  updatedAt: "2026-08-18T00:00:00.000Z",
};

// Global isomorphic in-memory state
export let MOCK_SITE_SETTINGS: SiteSettingsDTO = { ...DEFAULT_SITE_SETTINGS };
export let MOCK_OFFICE_LOCATION: OfficeLocationDTO = { ...DEFAULT_OFFICE_LOCATION };

export function getMockSiteSettings(): SiteSettingsDTO {
  return MOCK_SITE_SETTINGS;
}

export function updateMockSiteSettings(updated: Partial<SiteSettingsDTO>): SiteSettingsDTO {
  MOCK_SITE_SETTINGS = {
    ...MOCK_SITE_SETTINGS,
    ...updated,
  };
  return MOCK_SITE_SETTINGS;
}

export function getMockOfficeLocation(): OfficeLocationDTO {
  return MOCK_OFFICE_LOCATION;
}

export function updateMockOfficeLocation(updated: Partial<OfficeLocationDTO>): OfficeLocationDTO {
  MOCK_OFFICE_LOCATION = {
    ...MOCK_OFFICE_LOCATION,
    ...updated,
    revision: (MOCK_OFFICE_LOCATION.revision || 1) + 1,
    updatedAt: new Date().toISOString(),
  };
  return MOCK_OFFICE_LOCATION;
}

export const MOCK_PROMOTIONS: PromotionDTO[] = [
  {
    id: 1,
    slug: "cartagena-donde-el-mar-te-espera",
    title: "Cartagena, donde el mar te espera",
    destination: "Cartagena de Indias, Colombia",
    summary: "Descubre la magia del Caribe, sus calles coloniales y atardeceres inolvidables.",
    priceUsd: 890,
    pricePen: 3250,
    durationDays: 5,
    durationNights: 4,
    departureCity: "Lima",
    validFrom: "2026-01-01",
    validUntil: "2026-12-31",
    isFeatured: true,
    inclusions: ["Vuelos ida y vuelta", "Hotel 4 estrellas", "Desayunos incluidos", "Tour Islas del Rosario"],
    exclusions: ["Gastos personales", "Seguro médico opcional"],
  },
  {
    id: 2,
    slug: "cusco-magico-y-valle-sagrado",
    title: "Cusco Mágico y Valle Sagrado",
    destination: "Cusco, Perú",
    summary: "Conecta con la historia incaica y la maravilla del mundo en una experiencia completa.",
    priceUsd: 520,
    pricePen: 1922,
    durationDays: 4,
    durationNights: 3,
    departureCity: "Lima",
    validFrom: "2026-01-01",
    validUntil: "2026-12-31",
    isFeatured: true,
    inclusions: ["Tren Expedition", "Entradas a Machu Picchu", "Guía profesional", "Traslados privados"],
    exclusions: ["Almuerzos no especificados"],
  },
];

export const MOCK_BLOG_POSTS: BlogPostDTO[] = [
  {
    id: 1,
    slug: "guia-completa-para-viajar-al-caribe",
    title: "Guía completa para tu primer viaje al Caribe",
    excerpt: "Todo lo que necesitas saber sobre pasaportes, temporadas ideales y qué empacar.",
    content: "Viajar al Caribe es una de las experiencias más revitalizantes...",
    category: "Consejos de Viaje",
    publishedAt: "2026-08-10",
    readingTimeMinutes: 5,
    authorName: "Carolina Zúñiga",
  },
];

export const MOCK_API_INFO: ApiInfoDTO = {
  name: "Viajes Carolina API (Mock)",
  version: "1.0.0",
  status: "UP",
  architecture: "Hexagonal Architecture with Quarkus 3.x & Java 25 LTS",
  timestamp: "2026-08-18T00:00:00.000Z",
};
