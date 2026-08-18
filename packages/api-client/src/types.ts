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

// Blog DTOs (Corte 10)
export interface BlogCategoryDTO {
  id: number;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrUpdateBlogCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  displayOrder?: number;
  active?: boolean;
}

export interface BlogPostDTO {
  id: number;
  slug: string;
  title: string;
  summary: string;
  contentMarkdown: string;
  categoryId: number;
  categoryName?: string;
  categorySlug?: string;
  coverMediaId?: number;
  coverMediaUrl?: string;
  authorName: string;
  readingTimeMinutes: number;
  tags: string[];
  status: string; // 'DRAFT', 'PUBLISHED', 'ARCHIVED'
  publishedAt?: string;
  viewCount: number;
  isFeatured: boolean;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrUpdateBlogPostRequest {
  slug: string;
  title: string;
  summary: string;
  contentMarkdown: string;
  categoryId: number;
  coverMediaId?: number;
  authorName?: string;
  readingTimeMinutes?: number;
  tags?: string[];
  status?: string;
  isFeatured?: boolean;
  active?: boolean;
}

export interface PublicBlogResponse {
  items: BlogPostDTO[];
  categories: BlogCategoryDTO[];
  featuredPost?: BlogPostDTO;
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface BlogPostDetailResponse {
  post: BlogPostDTO;
  relatedPosts: BlogPostDTO[];
}

// Contact Page & Inquiry DTOs (Corte 9)
export interface ContactPageDTO {
  id?: number;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  whatsappBoxTitle: string;
  whatsappBoxSubtitle: string;
  formTitle: string;
  formSubtitle: string;
  revision?: number;
  updatedAt?: string;
}

export interface UpdateContactPageRequest {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  whatsappBoxTitle: string;
  whatsappBoxSubtitle: string;
  formTitle: string;
  formSubtitle: string;
}

export interface ContactInquiryDTO {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  destinationOfInterest?: string;
  travelDateApprox?: string;
  travelersCount: number;
  message: string;
  preferredContactChannel: string; // 'WHATSAPP', 'EMAIL', 'PHONE'
  status: string; // 'NEW', 'IN_PROGRESS', 'CONTACTED', 'ARCHIVED'
  turnstileVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubmitContactInquiryRequest {
  fullName: string;
  email: string;
  phone?: string;
  destinationOfInterest?: string;
  travelDateApprox?: string;
  travelersCount?: number;
  message: string;
  preferredContactChannel?: string;
  turnstileToken?: string;
}

export interface UpdateInquiryStatusRequest {
  status: string;
}

export interface PublicContactResponse {
  page: ContactPageDTO;
  primaryPhone: string;
  whatsappPhone: string;
  contactEmail: string;
  officeAddress: string;
  officeHours: string;
}

// Search DTOs (Corte 11)
export type SearchResultType = "ALL" | "PROMOTION" | "BLOG_POST" | "INTENTION" | "DESTINATION";

export interface SearchResultItemDTO {
  entityType: "PROMOTION" | "BLOG_POST" | "INTENTION" | "DESTINATION" | string;
  entityId: number;
  entitySlug: string;
  title: string;
  subtitle: string;
  metadataInfo?: string;
  imageUrl?: string;
  targetUrl: string;
  badgeText?: string;
  score?: number;
}

export interface GlobalSearchResponse {
  query: string;
  filterType: string;
  total: number;
  results: SearchResultItemDTO[];
  suggestedQueries: string[];
}

// Home Blog Inspiration DTOs (Corte 12)
export interface HomeBlogInspirationDTO {
  id?: number;
  badgeText: string;
  titleHighlight: string;
  titleAccent: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  postsLimit: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateHomeBlogInspirationRequest {
  badgeText: string;
  titleHighlight: string;
  titleAccent: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  postsLimit?: number;
  active?: boolean;
}

export interface PublicHomeBlogInspirationResponse {
  config: HomeBlogInspirationDTO;
  posts: BlogPostDTO[];
}


