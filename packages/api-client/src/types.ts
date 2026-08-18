export interface SiteSettingsDTO {
  id: number;
  siteName: string;
  brandTagline: string;
  contactEmail: string;
  primaryPhone: string;
  whatsappPhone: string;
  whatsappDefaultMessage: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  logoMediaId?: number;
  faviconMediaId?: number;
}

export interface OfficeLocationDTO {
  id: number;
  addressLine: string;
  district: string;
  city: string;
  country: string;
  postalCode?: string;
  referenceLandmark?: string;
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
  embedMapsUrl?: string;
  scheduleWeekdays: string;
  scheduleSaturdays: string;
  active: boolean;
  revision: number;
  updatedAt?: string;
}

export interface PromotionDTO {
  id: number;
  slug: string;
  title: string;
  destination: string;
  summary: string;
  description?: string;
  priceUsd: number;
  pricePen: number;
  durationDays: number;
  durationNights: number;
  departureCity: string;
  validFrom: string;
  validUntil: string;
  isFeatured: boolean;
  coverMediaId?: number;
  inclusions?: string[];
  exclusions?: string[];
}

export interface BlogPostDTO {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  publishedAt: string;
  readingTimeMinutes: number;
  authorName: string;
  coverMediaId?: number;
}

export interface ApiInfoDTO {
  name: string;
  version: string;
  status: string;
  architecture: string;
  timestamp: string;
}
