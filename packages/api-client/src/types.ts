// ==============================================================================
// Viajes Carolina — Shared Data Transfer Objects (DTOs)
// ==============================================================================

export interface ApiInfoDTO {
  name: string;
  version: string;
  status: string;
  architecture: string;
  timestamp: string;
}

export interface SiteSettingsDTO {
  id?: number;
  siteName: string;
  brandTagline?: string;
  contactEmail: string;
  primaryPhone: string;
  logoMediaId?: number;
  faviconMediaId?: number;
  whatsappPhone?: string;
  whatsappDefaultMessage?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  revision?: number;
  updatedAt?: string;
}

export interface WhatsAppActionDTO {
  actionCode: string;
  label: string;
  defaultMessageTemplate: string;
}

export interface PublicSiteResponse {
  siteName: string;
  brandTagline?: string;
  contactEmail: string;
  primaryPhone: string;
  whatsappPhone?: string;
  whatsappDisplayNumber?: string;
  logoUrl?: string;
  faviconUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  actions: Record<string, string>;
}

export interface OfficeLocationDTO {
  id?: number;
  addressLine: string;
  district: string;
  city: string;
  country: string;
  postalCode?: string;
  referenceLandmark?: string;
  latitude: number;
  longitude: number;
  googleMapsUrl?: string;
  scheduleWeekdays: string;
  scheduleSaturdays: string;
  scheduleSundaysHolidays?: string;
  active: boolean;
  revision?: number;
  updatedAt?: string;
}

export interface PublicOfficeResponse {
  fullAddress: string;
  district: string;
  city: string;
  country: string;
  referenceLandmark?: string;
  latitude: number;
  longitude: number;
  googleMapsUrl?: string;
  scheduleWeekdays: string;
  scheduleSaturdays: string;
  scheduleSundaysHolidays?: string;
  active: boolean;
}

// Media Assets DTOs (Corte 3)
export interface MediaAssetDTO {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  fileSizeBytes: number;
  width: number;
  height: number;
  focalX: number;
  focalY: number;
  altText?: string;
  caption?: string;
  storagePath: string;
  variantsJson?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MediaPageResponse {
  items: MediaAssetDTO[];
  total: number;
  page: number;
  size: number;
}

export interface UpdateMediaFocalPointRequest {
  focalX: number;
  focalY: number;
  altText?: string;
  caption?: string;
}

// Home Hero DTOs (Corte 4)
export interface HomeHeroDTO {
  id?: number;
  badgeText: string;
  titleHighlight: string;
  titleAccent: string;
  description: string;
  whatsappCtaText: string;
  whatsappMessageOverride?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  trustIndicators: string[];
  backgroundMediaId?: number;
  backgroundMediaUrl?: string;
  backgroundFocalX?: number;
  backgroundFocalY?: number;
  featuredCardBadge?: string;
  featuredCardTitle?: string;
  featuredCardSubtitle?: string;
  featuredCardPricePen?: number;
  featuredCardOrigin?: string;
  featuredCardMediaId?: number;
  featuredCardMediaUrl?: string;
  revision?: number;
  updatedAt?: string;
}

export interface UpdateHomeHeroRequest {
  badgeText: string;
  titleHighlight: string;
  titleAccent: string;
  description: string;
  whatsappCtaText: string;
  whatsappMessageOverride?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  trustIndicators: string[];
  backgroundMediaId?: number;
  featuredCardBadge?: string;
  featuredCardTitle?: string;
  featuredCardSubtitle?: string;
  featuredCardPricePen?: number;
  featuredCardOrigin?: string;
  featuredCardMediaId?: number;
}

// Travel Intentions DTOs (Corte 5)
export interface TravelIntentionDTO {
  id: number;
  slug: string;
  title: string;
  tagline: string;
  iconName: string;
  featuredDestinations: string[];
  whatsappMessageTemplate: string;
  coverMediaId?: number;
  coverMediaUrl?: string;
  coverFocalX?: number;
  coverFocalY?: number;
  displayOrder: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrUpdateTravelIntentionRequest {
  slug: string;
  title: string;
  tagline: string;
  iconName?: string;
  featuredDestinations: string[];
  whatsappMessageTemplate: string;
  coverMediaId?: number;
  displayOrder?: number;
  active?: boolean;
}

// Promotions DTOs (Corte 6)
export interface PromotionDTO {
  id: number;
  slug: string;
  title: string;
  destination: string;
  summary: string;
  priceUsd: number;
  pricePen?: number;
  durationDays: number;
  durationNights: number;
  departureCity: string;
  validFrom: string;
  validUntil: string;
  featuredMediaId?: number;
  featuredMediaUrl?: string;
  featuredMediaFocalX?: number;
  featuredMediaFocalY?: number;
  isFeatured: boolean;
  inclusions: string[];
  exclusions: string[];
  whatsappMessageTemplate?: string;
  displayOrder?: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrUpdatePromotionRequest {
  slug: string;
  title: string;
  destination: string;
  summary: string;
  priceUsd: number;
  pricePen?: number;
  durationDays: number;
  durationNights: number;
  departureCity?: string;
  validFrom?: string;
  validUntil?: string;
  featuredMediaId?: number;
  isFeatured?: boolean;
  inclusions: string[];
  exclusions: string[];
  whatsappMessageTemplate?: string;
  displayOrder?: number;
  active?: boolean;
}

// Trust: Testimonials & FAQ DTOs (Corte 7)
export interface TestimonialDTO {
  id: number;
  clientName: string;
  clientLocation?: string;
  tripDestination: string;
  comment: string;
  rating: number;
  avatarMediaId?: number;
  avatarMediaUrl?: string;
  consentConfirmed: boolean;
  displayOrder: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrUpdateTestimonialRequest {
  clientName: string;
  clientLocation?: string;
  tripDestination: string;
  comment: string;
  rating: number;
  avatarMediaId?: number;
  consentConfirmed?: boolean;
  displayOrder?: number;
  active?: boolean;
}

export interface FaqItemDTO {
  id: number;
  question: string;
  answer: string;
  category?: string;
  displayOrder: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrUpdateFaqRequest {
  question: string;
  answer: string;
  category?: string;
  displayOrder?: number;
  active?: boolean;
}

export interface PublicTrustResponse {
  testimonials: TestimonialDTO[];
  faqs: FaqItemDTO[];
}

// About Us & Advisors DTOs (Corte 8)
export interface AboutPageDTO {
  id?: number;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroMediaId?: number;
  heroMediaUrl?: string;
  storyTitle: string;
  storyBody: string;
  storyMediaId?: number;
  storyMediaUrl?: string;
  missionTitle: string;
  missionBody: string;
  visionTitle: string;
  visionBody: string;
  values: string[];
  experienceYears: number;
  happyTravelers: number;
  destinationsCount: number;
  satisfactionRatePercent: number;
  revision?: number;
  updatedAt?: string;
}

export interface UpdateAboutPageRequest {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroMediaId?: number;
  storyTitle: string;
  storyBody: string;
  storyMediaId?: number;
  missionTitle: string;
  missionBody: string;
  visionTitle: string;
  visionBody: string;
  values: string[];
  experienceYears: number;
  happyTravelers: number;
  destinationsCount: number;
  satisfactionRatePercent: number;
}

export interface TravelAdvisorDTO {
  id: number;
  fullName: string;
  roleTitle: string;
  specialty: string;
  bio: string;
  photoMediaId?: number;
  photoMediaUrl?: string;
  whatsappPhone?: string;
  whatsappMessageTemplate?: string;
  displayOrder: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrUpdateAdvisorRequest {
  fullName: string;
  roleTitle: string;
  specialty: string;
  bio: string;
  photoMediaId?: number;
  whatsappPhone?: string;
  whatsappMessageTemplate?: string;
  displayOrder?: number;
  active?: boolean;
}

export interface PublicAboutResponse {
  page: AboutPageDTO;
  advisors: TravelAdvisorDTO[];
}

export interface BlogPostDTO {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  featuredMediaId?: number;
  publishedAt: string;
  readingTimeMinutes: number;
  authorName: string;
}
