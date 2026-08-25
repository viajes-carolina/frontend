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
  whatsappDisplayNumber?: string;
  whatsappDefaultMessage?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  legalCompanyName?: string;
  taxId?: string;
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
  legalCompanyName?: string;
  taxId?: string;
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
  secondaryMedia1Id?: number;
  secondaryMedia1Url?: string;
  secondaryMedia1FocalX?: number;
  secondaryMedia1FocalY?: number;
  secondaryMedia2Id?: number;
  secondaryMedia2Url?: string;
  secondaryMedia2FocalX?: number;
  secondaryMedia2FocalY?: number;
  secondaryMedia3Id?: number;
  secondaryMedia3Url?: string;
  secondaryMedia3FocalX?: number;
  secondaryMedia3FocalY?: number;
  trustStatText?: string;
  eyebrowText?: string;
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
  secondaryMedia1Id?: number;
  secondaryMedia1Url?: string;
  secondaryMedia1FocalX?: number;
  secondaryMedia1FocalY?: number;
  secondaryMedia2Id?: number;
  secondaryMedia2Url?: string;
  secondaryMedia2FocalX?: number;
  secondaryMedia2FocalY?: number;
  secondaryMedia3Id?: number;
  secondaryMedia3Url?: string;
  secondaryMedia3FocalX?: number;
  secondaryMedia3FocalY?: number;
  trustStatText?: string;
  eyebrowText?: string;
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
  inclusions: string[];
  exclusions: string[];
  whatsappMessageTemplate?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
  source?: "MANUAL" | "FACEBOOK" | string;
  facebookPostId?: string;
  facebookPermalinkUrl?: string;
}

export interface SetPromotionActiveRequest {
  active: boolean;
}

// El slug se autogenera en el backend a partir del título — no se envía aquí.
// Sin campos de galería adicional, destacado, orden de visualización ni
// activo/inactivo: esos conceptos ya no existen para Promotions (ver
// PromotionDTO arriba). Al crear, el backend publica automáticamente un post
// en la Página de Facebook usando estos mismos campos.
export interface CreateOrUpdatePromotionRequest {
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
  inclusions: string[];
  exclusions: string[];
  whatsappMessageTemplate?: string;
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
export interface JourneyStepDTO {
  label: string;
}

export interface AccompanyStepDTO {
  title: string;
  body: string;
}

export interface AboutMomentDTO {
  title: string;
  body: string;
}

export interface AboutPageDTO {
  id?: number;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroMediaId?: number;
  heroMediaUrl?: string;
  heroFocalX?: number;
  heroFocalY?: number;
  heroCardBadge?: string;
  heroCardTitle?: string;
  heroNoteText?: string;
  storyTitle: string;
  storyBody: string;
  storyMediaId?: number;
  storyMediaUrl?: string;
  storyFocalX?: number;
  storyFocalY?: number;
  missionTitle: string;
  missionBody: string;
  missionQuote?: string;
  journeySteps: JourneyStepDTO[];
  values: string[];
  accompanyBadge?: string;
  accompanyTitle?: string;
  accompanySubtitle?: string;
  accompanySteps: AccompanyStepDTO[];
  accompanyQuote?: string;
  accompanyQuoteAttribution?: string;
  momentsBadge?: string;
  momentsTitle?: string;
  momentsSubtitle?: string;
  momentsMediaId?: number;
  momentsMediaUrl?: string;
  momentsFocalX?: number;
  momentsFocalY?: number;
  moments: AboutMomentDTO[];
  humanBadge?: string;
  humanTitle?: string;
  humanSubtitle?: string;
  humanTagline?: string;
  revision?: number;
  updatedAt?: string;
}

export interface UpdateAboutPageRequest {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroMediaId?: number;
  heroFocalX?: number;
  heroFocalY?: number;
  heroCardBadge?: string;
  heroCardTitle?: string;
  heroNoteText?: string;
  storyTitle: string;
  storyBody: string;
  storyMediaId?: number;
  storyFocalX?: number;
  storyFocalY?: number;
  missionTitle: string;
  missionBody: string;
  missionQuote?: string;
  journeySteps: JourneyStepDTO[];
  values: string[];
  accompanyBadge?: string;
  accompanyTitle?: string;
  accompanySubtitle?: string;
  accompanySteps: AccompanyStepDTO[];
  accompanyQuote?: string;
  accompanyQuoteAttribution?: string;
  momentsBadge?: string;
  momentsTitle?: string;
  momentsSubtitle?: string;
  momentsMediaId?: number;
  momentsFocalX?: number;
  momentsFocalY?: number;
  moments: AboutMomentDTO[];
  humanBadge?: string;
  humanTitle?: string;
  humanSubtitle?: string;
  humanTagline?: string;
}

export interface TravelAdvisorDTO {
  id: number;
  fullName: string;
  roleTitle: string;
  specialty: string;
  bio: string;
  quote?: string;
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
  quote?: string;
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
  coverFocalX?: number;
  coverFocalY?: number;
  authorName: string;
  authorAvatarMediaId?: number;
  authorAvatarUrl?: string;
  authorAvatarFocalX?: number;
  authorAvatarFocalY?: number;
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
  coverFocalX?: number;
  coverFocalY?: number;
  authorName?: string;
  authorAvatarMediaId?: number;
  authorAvatarFocalX?: number;
  authorAvatarFocalY?: number;
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
  heroCtaText: string;
  heroNoteText: string;
  heroCtaMessage: string;
  heroInfoTitle: string;
  heroInfoWhatsappLabel: string;
  heroInfoWhatsappValue: string;
  heroInfoEmailLabel: string;
  heroInfoScheduleLabel: string;
  heroInfoOfficeLabel: string;
  officeSectionBadge: string;
  officeSectionTitle: string;
  officeMapTitle: string;
  officeVisitNote: string;
  officeMapEyebrow: string;
  officeMapPinTitle: string;
  officeMapPinSubtitle: string;
  officeMapsLinkText: string;
  officeVisitLabel: string;
  revision?: number;
  updatedAt?: string;
}

export interface UpdateContactPageRequest {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroNoteText: string;
  heroCtaMessage: string;
  heroInfoTitle: string;
  heroInfoWhatsappLabel: string;
  heroInfoWhatsappValue: string;
  heroInfoEmailLabel: string;
  heroInfoScheduleLabel: string;
  heroInfoOfficeLabel: string;
  officeSectionBadge: string;
  officeSectionTitle: string;
  officeMapTitle: string;
  officeVisitNote: string;
  officeMapEyebrow: string;
  officeMapPinTitle: string;
  officeMapPinSubtitle: string;
  officeMapsLinkText: string;
  officeVisitLabel: string;
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
  officeScheduleSaturdays?: string;
  officeGoogleMapsUrl?: string;
  officeLatitude?: number;
  officeLongitude?: number;
}

// Search DTOs (Corte 11)
export type SearchResultType = "ALL" | "PROMOTION" | "BLOG_POST" | "INTENTION";

export interface SearchResultItemDTO {
  entityType: "PROMOTION" | "BLOG_POST" | "INTENTION" | string;
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

// Home Conversational Pause DTOs — sección "04 · Antes de seguir"
export interface HomeConversationalPauseDTO {
  id?: number;
  badgeText: string;
  title: string;
  subtitle: string;
  whatsappCtaText: string;
  whatsappMessageTemplate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateHomeConversationalPauseRequest {
  badgeText: string;
  title: string;
  subtitle: string;
  whatsappCtaText: string;
  whatsappMessageTemplate?: string;
}

// Home Promotions Section DTOs — copy de "02 · Promociones" + CTA de cierre
export interface HomePromotionsSectionDTO {
  id?: number;
  badgeText: string;
  title: string;
  subtitle: string;
  bottomCtaQuestion: string;
  bottomCtaWhatsappText: string;
  bottomCtaWhatsappMessage?: string;
  mediaId?: number;
  mediaUrl?: string;
  mediaFocalX?: number;
  mediaFocalY?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateHomePromotionsSectionRequest {
  badgeText: string;
  title: string;
  subtitle: string;
  bottomCtaQuestion: string;
  bottomCtaWhatsappText: string;
  bottomCtaWhatsappMessage?: string;
  mediaId?: number;
  mediaUrl?: string;
  mediaFocalX?: number;
  mediaFocalY?: number;
}

// Home Testimonials Section DTOs — copy de "05 · Historias reales"
export interface HomeTestimonialsSectionDTO {
  id?: number;
  badgeText: string;
  title: string;
  subtitle: string;
  blobMediaId?: number;
  blobMediaUrl?: string;
  blobFocalX?: number;
  blobFocalY?: number;
  polaroidMediaId?: number;
  polaroidMediaUrl?: string;
  polaroidFocalX?: number;
  polaroidFocalY?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateHomeTestimonialsSectionRequest {
  badgeText: string;
  title: string;
  subtitle: string;
  blobMediaId?: number;
  blobMediaUrl?: string;
  blobFocalX?: number;
  blobFocalY?: number;
  polaroidMediaId?: number;
  polaroidMediaUrl?: string;
  polaroidFocalX?: number;
  polaroidFocalY?: number;
}

// Home FAQ Section DTOs — copy de "06 · Antes de continuar"
export interface HomeFaqSectionDTO {
  id?: number;
  badgeText: string;
  title: string;
  subtitle: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateHomeFaqSectionRequest {
  badgeText: string;
  title: string;
  subtitle: string;
}

// Claims & Contact Explore Links DTOs (Corte 13)
export interface ClaimRecordDTO {
  id: number;
  claimCode: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  email: string;
  phone: string;
  address: string;
  isMinor: boolean;
  parentName?: string;
  parentDocument?: string;
  contractedType: string;
  claimedAmount?: number;
  currency?: string;
  description: string;
  claimType: string;
  consumerDetail: string;
  consumerRequest: string;
  status: string;
  responseNotes?: string;
  responseAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubmitClaimRequest {
  fullName: string;
  documentType: string;
  documentNumber: string;
  email: string;
  phone: string;
  address: string;
  isMinor?: boolean;
  parentName?: string;
  parentDocument?: string;
  contractedType: string;
  claimedAmount?: number;
  currency?: string;
  description: string;
  claimType: string;
  consumerDetail: string;
  consumerRequest: string;
  turnstileToken?: string;
}

export interface UpdateClaimStatusRequest {
  status: string;
  responseNotes?: string;
}

export interface ContactExploreLinkDTO {
  id: number;
  title: string;
  description: string;
  iconName: string;
  targetUrl: string;
  buttonText: string;
  displayOrder: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrUpdateContactExploreLinkRequest {
  title: string;
  description: string;
  iconName: string;
  targetUrl: string;
  buttonText: string;
  displayOrder?: number;
  active?: boolean;
}

// Auth, RBAC & Governance DTOs (Corte 14)
export interface AdminUserDTO {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: "SUPER_ADMIN" | "CONTENT_EDITOR" | "ADVISOR" | string;
  active: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresInSeconds: number;
  user: AdminUserDTO;
}

export interface ChangeOwnPasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangeOwnPasswordResponse {
  status: string;
}

export interface CreateAdminUserRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role?: string;
  active?: boolean;
}

export interface UpdateAdminUserRequest {
  username: string;
  email: string;
  password?: string;
  fullName: string;
  role?: string;
  active?: boolean;
}

export interface AuditLogDTO {
  id: number;
  userId?: number;
  username: string;
  action: string;
  entityType: string;
  entityId?: string;
  ipHash?: string;
  detailsJson: string;
  createdAt: string;
}

// Publishing & ISR DTOs (Corte 15)
export interface PublishRequestDTO {
  target?: "ALL" | "HOME" | "PROMOTIONS" | "BLOG" | "ABOUT" | "CONTACT" | string;
  customTags?: string[];
  reason?: string;
}

export interface PublishResponseDTO {
  status: "SUCCESS" | "READY" | "ERROR" | string;
  revalidatedTags: string[];
  publishedAt: string;
  triggeredBy: string;
  message: string;
}





