import fs from "fs";
import path from "path";
import { SiteSettingsDTO, OfficeLocationDTO, PromotionDTO, BlogPostDTO, ApiInfoDTO } from "./types";

const DATA_DIR = path.resolve(process.cwd(), "..", "..", ".data");

function getFilePath(filename: string): string {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {
    // In browser or restricted env
  }
  return path.join(DATA_DIR, filename);
}

function readJsonFile<T>(filename: string, fallback: T): T {
  try {
    const filePath = getFilePath(filename);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(raw) as T;
    }
  } catch {
    // Fallback to in-memory
  }
  return fallback;
}

function writeJsonFile<T>(filename: string, data: T): void {
  try {
    const filePath = getFilePath(filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // Fallback in non-node env
  }
}

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
  updatedAt: new Date().toISOString(),
};

export function getMockSiteSettings(): SiteSettingsDTO {
  return readJsonFile<SiteSettingsDTO>("site_settings.json", DEFAULT_SITE_SETTINGS);
}

export function updateMockSiteSettings(updated: Partial<SiteSettingsDTO>): SiteSettingsDTO {
  const current = getMockSiteSettings();
  const merged = {
    ...current,
    ...updated,
  };
  writeJsonFile("site_settings.json", merged);
  return merged;
}

export function getMockOfficeLocation(): OfficeLocationDTO {
  return readJsonFile<OfficeLocationDTO>("office_location.json", DEFAULT_OFFICE_LOCATION);
}

export function updateMockOfficeLocation(updated: Partial<OfficeLocationDTO>): OfficeLocationDTO {
  const current = getMockOfficeLocation();
  const merged = {
    ...current,
    ...updated,
    revision: (current.revision || 1) + 1,
    updatedAt: new Date().toISOString(),
  };
  writeJsonFile("office_location.json", merged);
  return merged;
}

export const MOCK_SITE_SETTINGS = DEFAULT_SITE_SETTINGS;
export const MOCK_OFFICE_LOCATION = DEFAULT_OFFICE_LOCATION;

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
  timestamp: new Date().toISOString(),
};
