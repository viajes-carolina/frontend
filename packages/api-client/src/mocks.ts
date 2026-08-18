import {
  SiteSettingsDTO,
  OfficeLocationDTO,
  PromotionDTO,
  BlogPostDTO,
  ApiInfoDTO,
  MediaAssetDTO,
  MediaPageResponse,
  UpdateMediaFocalPointRequest,
  HomeHeroDTO,
  UpdateHomeHeroRequest,
} from "./types";

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

export const DEFAULT_HOME_HERO: HomeHeroDTO = {
  id: 1,
  badgeText: "Empieza con una conversación",
  titleHighlight: "Tu viaje comienza",
  titleAccent: "antes de despegar",
  description: "Desde la primera idea hasta tu regreso, una asesora te acompaña con opciones claras, atención humana y respaldo en cada etapa.",
  whatsappCtaText: "Cuéntame tu viaje",
  whatsappMessageOverride: "Hola Viajes Carolina, quiero empezar a planear mi próximo viaje.",
  secondaryCtaText: "Explorar promociones",
  secondaryCtaUrl: "#promociones",
  trustIndicators: ["Asesoría sin costo", "Respuesta rápida", "Acompañamiento real"],
  backgroundMediaId: 1,
  backgroundMediaUrl: "/media/demo-hero-travel.webp",
  backgroundFocalX: 50.0,
  backgroundFocalY: 40.0,
  featuredCardBadge: "Próxima Parada · Cusco",
  featuredCardTitle: "Machu Picchu & Valle Sagrado",
  featuredCardSubtitle: "Experiencia personalizada de 5 días / 4 noches",
  featuredCardPricePen: 1922,
  featuredCardOrigin: "Desde Lima",
  featuredCardMediaId: 3,
  featuredCardMediaUrl: "/media/demo-cusco-machupicchu.webp",
  revision: 1,
  updatedAt: "2026-08-18T00:00:00.000Z",
};

export const DEFAULT_MEDIA_ASSETS: MediaAssetDTO[] = [
  {
    id: 1,
    filename: "demo-hero-travel.webp",
    originalName: "hero-travel-banner.webp",
    mimeType: "image/webp",
    fileSizeBytes: 245800,
    width: 1920,
    height: 1080,
    focalX: 50.0,
    focalY: 40.0,
    altText: "Paisaje de viaje y aventura en los Andes",
    caption: "Vista panorámica de montaña y cielo despejado",
    storagePath: "/media/demo-hero-travel.webp",
    variantsJson: '{"thumb": "/media/demo-hero-travel-thumb.webp", "medium": "/media/demo-hero-travel-med.webp", "large": "/media/demo-hero-travel.webp"}',
    active: true,
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
  {
    id: 2,
    filename: "demo-cartagena-caribe.webp",
    originalName: "cartagena-playa.webp",
    mimeType: "image/webp",
    fileSizeBytes: 184500,
    width: 1200,
    height: 800,
    focalX: 60.0,
    focalY: 50.0,
    altText: "Calles coloniales y mar de Cartagena de Indias",
    caption: "Cartagena de Indias al atardecer",
    storagePath: "/media/demo-cartagena-caribe.webp",
    variantsJson: '{"thumb": "/media/demo-cartagena-thumb.webp", "medium": "/media/demo-cartagena-med.webp"}',
    active: true,
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
  {
    id: 3,
    filename: "demo-cusco-machupicchu.webp",
    originalName: "cusco-valle-sagrado.webp",
    mimeType: "image/webp",
    fileSizeBytes: 210400,
    width: 1200,
    height: 800,
    focalX: 50.0,
    focalY: 35.0,
    altText: "Santuario Histórico de Machu Picchu y Valle Sagrado",
    caption: "Machu Picchu bajo la luz de la mañana",
    storagePath: "/media/demo-cusco-machupicchu.webp",
    variantsJson: '{"thumb": "/media/demo-cusco-thumb.webp", "medium": "/media/demo-cusco-med.webp"}',
    active: true,
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
  {
    id: 4,
    filename: "demo-logo-viajes-carolina.webp",
    originalName: "logo-vc-oficial.webp",
    mimeType: "image/webp",
    fileSizeBytes: 45200,
    width: 600,
    height: 200,
    focalX: 50.0,
    focalY: 50.0,
    altText: "Logo Oficial de Viajes Carolina",
    caption: "Logo corporativo",
    storagePath: "/media/demo-logo-viajes-carolina.webp",
    variantsJson: "{}",
    active: true,
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
];

export let MOCK_SITE_SETTINGS: SiteSettingsDTO = { ...DEFAULT_SITE_SETTINGS };
export let MOCK_OFFICE_LOCATION: OfficeLocationDTO = { ...DEFAULT_OFFICE_LOCATION };
export let MOCK_MEDIA_ASSETS: MediaAssetDTO[] = [...DEFAULT_MEDIA_ASSETS];
export let MOCK_HOME_HERO: HomeHeroDTO = { ...DEFAULT_HOME_HERO };

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

export function getMockHomeHero(): HomeHeroDTO {
  return MOCK_HOME_HERO;
}

export function updateMockHomeHero(updated: Partial<HomeHeroDTO>): HomeHeroDTO {
  MOCK_HOME_HERO = {
    ...MOCK_HOME_HERO,
    ...updated,
    revision: (MOCK_HOME_HERO.revision || 1) + 1,
    updatedAt: new Date().toISOString(),
  };
  return MOCK_HOME_HERO;
}

export function getMockMediaPage(page = 0, size = 24): MediaPageResponse {
  const start = page * size;
  const items = MOCK_MEDIA_ASSETS.slice(start, start + size);
  return {
    items,
    total: MOCK_MEDIA_ASSETS.length,
    page,
    size,
  };
}

export function updateMockMediaFocalPoint(id: number, req: UpdateMediaFocalPointRequest): MediaAssetDTO | null {
  const index = MOCK_MEDIA_ASSETS.findIndex((m) => m.id === id);
  if (index === -1) return null;
  const current = MOCK_MEDIA_ASSETS[index];
  const updated: MediaAssetDTO = {
    ...current,
    focalX: req.focalX,
    focalY: req.focalY,
    altText: req.altText || current.altText,
    caption: req.caption || current.caption,
    updatedAt: new Date().toISOString(),
  };
  MOCK_MEDIA_ASSETS[index] = updated;
  return updated;
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
