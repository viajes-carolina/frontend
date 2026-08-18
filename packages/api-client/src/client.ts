import {
  SiteSettingsDTO,
  OfficeLocationDTO,
  PromotionDTO,
  CreateOrUpdatePromotionRequest,
  BlogPostDTO,
  ApiInfoDTO,
  MediaAssetDTO,
  MediaPageResponse,
  UpdateMediaFocalPointRequest,
  HomeHeroDTO,
  UpdateHomeHeroRequest,
  TravelIntentionDTO,
  CreateOrUpdateTravelIntentionRequest,
  TestimonialDTO,
  CreateOrUpdateTestimonialRequest,
  FaqItemDTO,
  CreateOrUpdateFaqRequest,
  PublicTrustResponse,
  AboutPageDTO,
  UpdateAboutPageRequest,
  TravelAdvisorDTO,
  CreateOrUpdateAdvisorRequest,
  PublicAboutResponse,
  ContactPageDTO,
  UpdateContactPageRequest,
  SubmitContactInquiryRequest,
  ContactInquiryDTO,
  UpdateInquiryStatusRequest,
  PublicContactResponse,
  BlogCategoryDTO,
  CreateOrUpdateBlogPostRequest,
  CreateOrUpdateBlogCategoryRequest,
  PublicBlogResponse,
  BlogPostDetailResponse,
  GlobalSearchResponse,
  SearchResultType,
  HomeBlogInspirationDTO,
  UpdateHomeBlogInspirationRequest,
  PublicHomeBlogInspirationResponse,
  ClaimRecordDTO,
  SubmitClaimRequest,
  UpdateClaimStatusRequest,
  ContactExploreLinkDTO,
  AdminUserDTO,
  LoginRequest,
  LoginResponse,
  CreateAdminUserRequest,
  UpdateAdminUserRequest,
  AuditLogDTO,
  PublishRequestDTO,
  PublishResponseDTO,
} from "./types";
import {
  MOCK_PROMOTIONS,
  MOCK_BLOG_POSTS,
  MOCK_API_INFO,
  getMockSiteSettings,
  updateMockSiteSettings,
  getMockOfficeLocation,
  updateMockOfficeLocation,
  getMockHomeHero,
  updateMockHomeHero,
  getMockTravelIntentions,
  getMockAdminTravelIntentions,
  createMockTravelIntention,
  updateMockTravelIntention,
  deleteMockTravelIntention,
  getMockFeaturedPromotions,
  getMockPromotions,
  getMockAdminPromotions,
  getMockPromotionBySlug,
  createMockPromotion,
  updateMockPromotion,
  deleteMockPromotion,
  getMockPublicTrust,
  getMockTestimonials,
  createMockTestimonial,
  updateMockTestimonial,
  deleteMockTestimonial,
  getMockFaqs,
  createMockFaq,
  updateMockFaq,
  deleteMockFaq,
  getMockPublicAbout,
  getMockAdminAbout,
  updateMockAdminAbout,
  getMockAdminAdvisors,
  createMockAdvisor,
  updateMockAdvisor,
  deleteMockAdvisor,
  getMockPublicContact,
  getMockAdminContact,
  updateMockAdminContact,
  getMockAdminInquiries,
  submitMockContactInquiry,
  updateMockInquiryStatus,
  getMockPublicBlog,
  getMockBlogCategories,
  getMockBlogPostBySlug,
  getMockAdminBlogPosts,
  createMockBlogPost,
  updateMockBlogPost,
  deleteMockBlogPost,
  createMockBlogCategory,
  updateMockBlogCategory,
  deleteMockBlogCategory,
  getMockMediaPage,
  updateMockMediaFocalPoint,
  DEFAULT_MEDIA_ASSETS,
  getMockGlobalSearch,
  getMockHomeBlogInspiration,
  updateMockHomeBlogInspiration,
  getMockContactExploreLinks,
  getMockAdminClaims,
  getMockClaimByCode,
  submitMockClaim,
  updateMockClaimStatus,
  loginMockAdmin,
  getMockAdminUsers,
  createMockAdminUser,
  updateMockAdminUser,
  getMockAuditLogs,
  getMockPublishingStatus,
  publishMockContent,
} from "./mocks";

const STORAGE_KEY_SETTINGS = "vc_site_settings";
const STORAGE_KEY_OFFICE = "vc_office_location";
const STORAGE_KEY_HERO = "vc_home_hero";
const STORAGE_KEY_INTENTIONS = "vc_travel_intentions";
const STORAGE_KEY_PROMOTIONS = "vc_promotions";
const STORAGE_KEY_TRUST = "vc_trust_data";
const STORAGE_KEY_ABOUT = "vc_about_page";

export interface ApiClientConfig {
  baseUrl?: string;
  useMocks?: boolean;
}

export class ViajesCarolinaApiClient {
  private baseUrl: string;
  private useMocks: boolean;

  constructor(config?: ApiClientConfig) {
    this.baseUrl = config?.baseUrl || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
    this.useMocks = config?.useMocks ?? false;
  }

  private getEffectiveUrl(endpointPath: string): string {
    if (typeof window !== "undefined") {
      return `/api/proxy/${endpointPath.replace(/^\//, "")}`;
    }
    return `${this.baseUrl}/api/${endpointPath.replace(/^\//, "")}`;
  }

  async getInfo(): Promise<ApiInfoDTO> {
    if (this.useMocks) return MOCK_API_INFO;
    try {
      const res = await fetch(this.getEffectiveUrl("public/v1/info"), {
        cache: "no-store",
      });
      if (!res.ok) return MOCK_API_INFO;
      return await res.json();
    } catch {
      return MOCK_API_INFO;
    }
  }

  async getSiteSettings(): Promise<SiteSettingsDTO> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(this.getEffectiveUrl("admin/v1/settings"), {
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(data));
        }
        return data;
      }
    } catch {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
        if (stored) {
          try {
            return JSON.parse(stored);
          } catch {
            // ignore
          }
        }
      }
    }
    return getMockSiteSettings();
  }

  async updateSiteSettings(payload: Partial<SiteSettingsDTO>): Promise<SiteSettingsDTO> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      const res = await fetch(this.getEffectiveUrl("admin/v1/settings"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(data));
        }
        return data;
      }
    } catch {
      // Offline fallback
    }

    const updated = updateMockSiteSettings(payload);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
    }
    return updated;
  }

  async getOfficeLocation(): Promise<OfficeLocationDTO> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(this.getEffectiveUrl("admin/v1/office"), {
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY_OFFICE, JSON.stringify(data));
        }
        return data;
      }
    } catch {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY_OFFICE);
        if (stored) {
          try {
            return JSON.parse(stored);
          } catch {
            // ignore
          }
        }
      }
    }
    return getMockOfficeLocation();
  }

  async updateOfficeLocation(payload: Partial<OfficeLocationDTO>): Promise<OfficeLocationDTO> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      const res = await fetch(this.getEffectiveUrl("admin/v1/office"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY_OFFICE, JSON.stringify(data));
        }
        return data;
      }
    } catch {
      // Offline fallback
    }

    const updated = updateMockOfficeLocation(payload);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_OFFICE, JSON.stringify(updated));
    }
    return updated;
  }

  // ==========================================
  // Home Hero API (Corte 4)
  // ==========================================

  async getHomeHero(): Promise<HomeHeroDTO> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(this.getEffectiveUrl("public/v1/home/hero"), {
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY_HERO, JSON.stringify(data));
        }
        return data;
      }
    } catch {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY_HERO);
        if (stored) {
          try {
            return JSON.parse(stored);
          } catch {
            // ignore
          }
        }
      }
    }
    return getMockHomeHero();
  }

  async updateHomeHero(payload: Partial<HomeHeroDTO>): Promise<HomeHeroDTO> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      const res = await fetch(this.getEffectiveUrl("admin/v1/home/hero"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY_HERO, JSON.stringify(data));
        }
        return data;
      }
    } catch {
      // Offline fallback
    }

    const updated = updateMockHomeHero(payload);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_HERO, JSON.stringify(updated));
    }
    return updated;
  }

  // ==========================================
  // Travel Intentions API (Corte 5)
  // ==========================================

  async getTravelIntentions(): Promise<TravelIntentionDTO[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(this.getEffectiveUrl("public/v1/home/intentions"), {
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY_INTENTIONS, JSON.stringify(data));
        }
        return data;
      }
    } catch {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY_INTENTIONS);
        if (stored) {
          try {
            return JSON.parse(stored);
          } catch {
            // ignore
          }
        }
      }
    }
    return getMockTravelIntentions();
  }

  async getAdminTravelIntentions(): Promise<TravelIntentionDTO[]> {
    try {
      const res = await fetch(this.getEffectiveUrl("admin/v1/intentions"), {
        cache: "no-store",
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    return getMockAdminTravelIntentions();
  }

  async createTravelIntention(payload: CreateOrUpdateTravelIntentionRequest): Promise<TravelIntentionDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl("admin/v1/intentions"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    return createMockTravelIntention(payload);
  }

  async updateTravelIntention(id: number, payload: CreateOrUpdateTravelIntentionRequest): Promise<TravelIntentionDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl(`admin/v1/intentions/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    return updateMockTravelIntention(id, payload);
  }

  async deleteTravelIntention(id: number): Promise<void> {
    try {
      await fetch(this.getEffectiveUrl(`admin/v1/intentions/${id}`), {
        method: "DELETE",
      });
    } catch {
      // fallback
    }
    deleteMockTravelIntention(id);
  }

  // ==========================================
  // Promotions API (Corte 6)
  // ==========================================

  async getFeaturedPromotions(): Promise<PromotionDTO[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(this.getEffectiveUrl("public/v1/promotions/featured"), {
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    return getMockFeaturedPromotions();
  }

  async getPromotions(): Promise<PromotionDTO[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(this.getEffectiveUrl("public/v1/promotions"), {
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    return getMockPromotions();
  }

  async getAdminPromotions(): Promise<PromotionDTO[]> {
    try {
      const res = await fetch(this.getEffectiveUrl("admin/v1/promotions"), {
        cache: "no-store",
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    return getMockAdminPromotions();
  }

  async getPromotionBySlug(slug: string): Promise<PromotionDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl(`public/v1/promotions/${slug}`), {
        cache: "no-store",
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    const found = getMockPromotionBySlug(slug);
    if (found) return found;
    throw new Error(`Promoción no encontrada: ${slug}`);
  }

  async createPromotion(payload: CreateOrUpdatePromotionRequest): Promise<PromotionDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl("admin/v1/promotions"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    return createMockPromotion(payload);
  }

  async updatePromotion(id: number, payload: CreateOrUpdatePromotionRequest): Promise<PromotionDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl(`admin/v1/promotions/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    return updateMockPromotion(id, payload);
  }

  async deletePromotion(id: number): Promise<void> {
    try {
      await fetch(this.getEffectiveUrl(`admin/v1/promotions/${id}`), {
        method: "DELETE",
      });
    } catch {
      // fallback
    }
    deleteMockPromotion(id);
  }

  // ==========================================
  // Trust: Testimonials & FAQ API (Corte 7)
  // ==========================================

  async getPublicTrust(): Promise<PublicTrustResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(this.getEffectiveUrl("public/v1/home/trust"), {
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    return getMockPublicTrust();
  }

  async getTestimonials(): Promise<TestimonialDTO[]> {
    try {
      const res = await fetch(this.getEffectiveUrl("admin/v1/testimonials"), {
        cache: "no-store",
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return getMockTestimonials();
  }

  async createTestimonial(payload: CreateOrUpdateTestimonialRequest): Promise<TestimonialDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl("admin/v1/testimonials"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return createMockTestimonial(payload);
  }

  async updateTestimonial(id: number, payload: CreateOrUpdateTestimonialRequest): Promise<TestimonialDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl(`admin/v1/testimonials/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return updateMockTestimonial(id, payload);
  }

  async deleteTestimonial(id: number): Promise<void> {
    try {
      await fetch(this.getEffectiveUrl(`admin/v1/testimonials/${id}`), {
        method: "DELETE",
      });
    } catch {
      // fallback
    }
    deleteMockTestimonial(id);
  }

  async getFaqs(): Promise<FaqItemDTO[]> {
    try {
      const res = await fetch(this.getEffectiveUrl("admin/v1/faq"), {
        cache: "no-store",
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return getMockFaqs();
  }

  async createFaq(payload: CreateOrUpdateFaqRequest): Promise<FaqItemDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl("admin/v1/faq"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return createMockFaq(payload);
  }

  async updateFaq(id: number, payload: CreateOrUpdateFaqRequest): Promise<FaqItemDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl(`admin/v1/faq/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return updateMockFaq(id, payload);
  }

  async deleteFaq(id: number): Promise<void> {
    try {
      await fetch(this.getEffectiveUrl(`admin/v1/faq/${id}`), {
        method: "DELETE",
      });
    } catch {
      // fallback
    }
    deleteMockFaq(id);
  }

  // ==========================================
  // About Us & Advisors API (Corte 8)
  // ==========================================

  async getPublicAbout(): Promise<PublicAboutResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(this.getEffectiveUrl("public/v1/about"), {
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    return getMockPublicAbout();
  }

  async getAdminAbout(): Promise<AboutPageDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl("admin/v1/about"), {
        cache: "no-store",
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return getMockAdminAbout();
  }

  async updateAdminAbout(payload: UpdateAboutPageRequest): Promise<AboutPageDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl("admin/v1/about"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return updateMockAdminAbout(payload);
  }

  async getAdminAdvisors(): Promise<TravelAdvisorDTO[]> {
    try {
      const res = await fetch(this.getEffectiveUrl("admin/v1/advisors"), {
        cache: "no-store",
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return getMockAdminAdvisors();
  }

  async createAdvisor(payload: CreateOrUpdateAdvisorRequest): Promise<TravelAdvisorDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl("admin/v1/advisors"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return createMockAdvisor(payload);
  }

  async updateAdvisor(id: number, payload: CreateOrUpdateAdvisorRequest): Promise<TravelAdvisorDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl(`admin/v1/advisors/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return updateMockAdvisor(id, payload);
  }

  async deleteAdvisor(id: number): Promise<void> {
    try {
      await fetch(this.getEffectiveUrl(`admin/v1/advisors/${id}`), {
        method: "DELETE",
      });
    } catch {
      // fallback
    }
    deleteMockAdvisor(id);
  }

  // ==========================================
  // Media Assets API (Corte 3)
  // ==========================================

  async getMediaList(page = 0, size = 24, mimeType?: string): Promise<MediaPageResponse> {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...(mimeType ? { mimeType } : {}),
      });
      const res = await fetch(this.getEffectiveUrl(`admin/v1/media?${queryParams.toString()}`), {
        cache: "no-store",
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    return getMockMediaPage(page, size);
  }

  async getMediaById(id: number): Promise<MediaAssetDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl(`admin/v1/media/${id}`), {
        cache: "no-store",
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    const found = DEFAULT_MEDIA_ASSETS.find((m) => m.id === id);
    if (found) return found;
    throw new Error(`Activo multimedia no encontrado con ID: ${id}`);
  }

  async uploadMedia(file: File, altText?: string, caption?: string): Promise<MediaAssetDTO> {
    const formData = new FormData();
    formData.append("file", file);
    if (altText) formData.append("altText", altText);
    if (caption) formData.append("caption", caption);

    try {
      const res = await fetch(this.getEffectiveUrl("admin/v1/media/upload"), {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const mockAsset: MediaAssetDTO = {
      id: Date.now(),
      filename: `mock-${file.name}`,
      originalName: file.name,
      mimeType: file.type || "image/webp",
      fileSizeBytes: file.size,
      width: 1200,
      height: 800,
      focalX: 50.0,
      focalY: 50.0,
      altText: altText || file.name,
      caption: caption || "",
      storagePath: `/media/mock-${file.name}`,
      variantsJson: "{}",
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return mockAsset;
  }

  async updateMediaFocalPoint(id: number, payload: UpdateMediaFocalPointRequest): Promise<MediaAssetDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl(`admin/v1/media/${id}/focal-point`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    const mock = updateMockMediaFocalPoint(id, payload);
    if (mock) return mock;
    throw new Error(`Error al actualizar punto focal en activo: ${id}`);
  }

  async deleteMedia(id: number): Promise<void> {
    try {
      await fetch(this.getEffectiveUrl(`admin/v1/media/${id}`), {
        method: "DELETE",
      });
    } catch {
      // ignore
    }
  }

  // ==========================================
  // Contact & Inquiries API (Corte 9)
  // ==========================================

  async getPublicContact(): Promise<PublicContactResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(this.getEffectiveUrl("public/v1/contact"), {
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    return getMockPublicContact();
  }

  async submitContactInquiry(payload: SubmitContactInquiryRequest): Promise<ContactInquiryDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl("public/v1/contact/inquiry"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    return submitMockContactInquiry(payload);
  }

  async getAdminContact(): Promise<ContactPageDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl("admin/v1/contact"), {
        cache: "no-store",
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return getMockAdminContact();
  }

  async updateAdminContact(payload: UpdateContactPageRequest): Promise<ContactPageDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl("admin/v1/contact"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return updateMockAdminContact(payload);
  }

  async getAdminInquiries(status?: string): Promise<ContactInquiryDTO[]> {
    try {
      const url = status && status !== "ALL"
        ? `admin/v1/inquiries?status=${encodeURIComponent(status)}`
        : "admin/v1/inquiries";
      const res = await fetch(this.getEffectiveUrl(url), {
        cache: "no-store",
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return getMockAdminInquiries(status);
  }

  async updateInquiryStatus(id: number, status: string): Promise<ContactInquiryDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl(`admin/v1/inquiries/${id}/status`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return updateMockInquiryStatus(id, status);
  }

  // ==========================================
  // Blog API (Corte 10)
  // ==========================================

  async getPublicBlog(categorySlug?: string, search?: string, page = 0, size = 9): Promise<PublicBlogResponse> {
    try {
      const params = new URLSearchParams();
      if (categorySlug && categorySlug !== "all") params.append("category", categorySlug);
      if (search && search.trim()) params.append("search", search.trim());
      params.append("page", page.toString());
      params.append("size", size.toString());

      const url = `public/v1/blog?${params.toString()}`;
      const res = await fetch(this.getEffectiveUrl(url), {
        cache: "no-store",
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return getMockPublicBlog(categorySlug, search, page, size);
  }

  async getBlogCategories(admin = false): Promise<BlogCategoryDTO[]> {
    try {
      const url = admin ? "admin/v1/blog/categories" : "public/v1/blog/categories";
      const res = await fetch(this.getEffectiveUrl(url), {
        cache: "no-store",
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return getMockBlogCategories(admin);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPostDetailResponse> {
    try {
      const res = await fetch(this.getEffectiveUrl(`public/v1/blog/posts/${slug}`), {
        cache: "no-store",
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return getMockBlogPostBySlug(slug);
  }

  async getAdminBlogPosts(status?: string, search?: string, page = 0, size = 50): Promise<BlogPostDTO[]> {
    try {
      const params = new URLSearchParams();
      if (status && status !== "ALL") params.append("status", status);
      if (search && search.trim()) params.append("search", search.trim());
      params.append("page", page.toString());
      params.append("size", size.toString());

      const res = await fetch(this.getEffectiveUrl(`admin/v1/blog/posts?${params.toString()}`), {
        cache: "no-store",
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return getMockAdminBlogPosts(status, search);
  }

  async createBlogPost(payload: CreateOrUpdateBlogPostRequest): Promise<BlogPostDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl("admin/v1/blog/posts"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return createMockBlogPost(payload);
  }

  async updateBlogPost(id: number, payload: CreateOrUpdateBlogPostRequest): Promise<BlogPostDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl(`admin/v1/blog/posts/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return updateMockBlogPost(id, payload);
  }

  async deleteBlogPost(id: number): Promise<void> {
    try {
      await fetch(this.getEffectiveUrl(`admin/v1/blog/posts/${id}`), {
        method: "DELETE",
      });
    } catch {
      // fallback
    }
    deleteMockBlogPost(id);
  }

  async createBlogCategory(payload: CreateOrUpdateBlogCategoryRequest): Promise<BlogCategoryDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl("admin/v1/blog/categories"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return createMockBlogCategory(payload);
  }

  async updateBlogCategory(id: number, payload: CreateOrUpdateBlogCategoryRequest): Promise<BlogCategoryDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl(`admin/v1/blog/categories/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return updateMockBlogCategory(id, payload);
  }

  async deleteBlogCategory(id: number): Promise<void> {
    try {
      await fetch(this.getEffectiveUrl(`admin/v1/blog/categories/${id}`), {
        method: "DELETE",
      });
    } catch {
      // fallback
    }
    deleteMockBlogCategory(id);
  }

  // ==========================================
  // Global Search API (Corte 11)
  // ==========================================

  async searchGlobal(query = "", type: SearchResultType = "ALL", limit = 20): Promise<GlobalSearchResponse> {
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.append("q", query.trim());
      if (type && type !== "ALL") params.append("type", type);
      params.append("limit", limit.toString());

      const url = `public/v1/search?${params.toString()}`;
      const res = await fetch(this.getEffectiveUrl(url), {
        cache: "no-store",
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return getMockGlobalSearch(query, type, limit);
  }

  // ==========================================
  // Home Blog Inspiration API (Corte 12)
  // ==========================================

  async getPublicHomeBlogInspiration(): Promise<PublicHomeBlogInspirationResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(this.getEffectiveUrl("public/v1/home/blog-inspiration"), {
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return getMockHomeBlogInspiration();
  }

  async getAdminHomeBlogInspiration(): Promise<HomeBlogInspirationDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl("admin/v1/home/blog-inspiration"), {
        cache: "no-store",
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return getMockHomeBlogInspiration().config;
  }

  async updateAdminHomeBlogInspiration(payload: UpdateHomeBlogInspirationRequest): Promise<HomeBlogInspirationDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl("admin/v1/home/blog-inspiration"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return updateMockHomeBlogInspiration(payload);
  }

  // ==========================================
  // Claims: Libro de Reclamaciones & Office Links (Corte 13)
  // ==========================================

  async submitClaim(payload: SubmitClaimRequest): Promise<ClaimRecordDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl("public/v1/claims"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return submitMockClaim(payload);
  }

  async getClaimByCode(claimCode: string): Promise<ClaimRecordDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl(`public/v1/claims/${encodeURIComponent(claimCode)}`), {
        cache: "no-store",
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    const found = getMockClaimByCode(claimCode);
    if (found) return found;
    throw new Error(`Hoja de reclamación no encontrada: ${claimCode}`);
  }

  async getAdminClaims(status?: string): Promise<ClaimRecordDTO[]> {
    try {
      const url = status && status !== "ALL"
        ? `admin/v1/claims?status=${encodeURIComponent(status)}`
        : "admin/v1/claims";
      const res = await fetch(this.getEffectiveUrl(url), {
        cache: "no-store",
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return getMockAdminClaims(status);
  }

  async updateClaimStatus(id: number, status: string, responseNotes?: string): Promise<ClaimRecordDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl(`admin/v1/claims/${id}/status`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, responseNotes }),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return updateMockClaimStatus(id, status, responseNotes);
  }

  async getContactExploreLinks(): Promise<ContactExploreLinkDTO[]> {
    try {
      const res = await fetch(this.getEffectiveUrl("public/v1/contact/explore-links"), {
        cache: "no-store",
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return getMockContactExploreLinks();
  }

  // Auth & Governance (Corte 14)
  async loginAdmin(req: LoginRequest): Promise<LoginResponse> {
    try {
      const res = await fetch(this.getEffectiveUrl("admin/v1/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return loginMockAdmin(req);
  }

  async logoutAdmin(): Promise<{ status: string }> {
    try {
      const res = await fetch(this.getEffectiveUrl("admin/v1/auth/logout"), {
        method: "POST",
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return { status: "LOGGED_OUT" };
  }

  async getCurrentAdminUser(): Promise<AdminUserDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl("admin/v1/auth/me"), {
        cache: "no-store",
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return getMockAdminUsers()[0];
  }

  async getAdminUsers(): Promise<AdminUserDTO[]> {
    try {
      const res = await fetch(this.getEffectiveUrl("admin/v1/users"), {
        cache: "no-store",
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return getMockAdminUsers();
  }

  async createAdminUser(req: CreateAdminUserRequest): Promise<AdminUserDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl("admin/v1/users"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return createMockAdminUser(req);
  }

  async updateAdminUser(id: number, req: UpdateAdminUserRequest): Promise<AdminUserDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl(`admin/v1/users/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return updateMockAdminUser(id, req);
  }

  async getAuditLogs(entityType?: string, limit?: number): Promise<AuditLogDTO[]> {
    try {
      const params = new URLSearchParams();
      if (entityType && entityType !== "ALL") params.append("entityType", entityType);
      if (limit) params.append("limit", String(limit));
      const q = params.toString();
      const url = q ? `admin/v1/audit-logs?${q}` : "admin/v1/audit-logs";
      const res = await fetch(this.getEffectiveUrl(url), {
        cache: "no-store",
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return getMockAuditLogs(entityType, limit);
  }

  // Publishing & ISR (Corte 15)
  async triggerPublish(req: PublishRequestDTO): Promise<PublishResponseDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl("admin/v1/publishing/publish"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return publishMockContent(req);
  }

  async getPublishingStatus(): Promise<PublishResponseDTO> {
    try {
      const res = await fetch(this.getEffectiveUrl("admin/v1/publishing/status"), {
        cache: "no-store",
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return getMockPublishingStatus();
  }
}

export const apiClient = new ViajesCarolinaApiClient();




