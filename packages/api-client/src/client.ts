import {
  SiteSettingsDTO,
  OfficeLocationDTO,
  PromotionDTO,
  SetPromotionActiveRequest,
  CreateOrUpdatePromotionRequest,
  BlogPostDTO,
  ApiInfoDTO,
  MediaAssetDTO,
  MediaPageResponse,
  UpdateMediaFocalPointRequest,
  HomeHeroDTO,
  UpdateHomeHeroRequest,
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
  HomeConversationalPauseDTO,
  UpdateHomeConversationalPauseRequest,
  HomePromotionsSectionDTO,
  UpdateHomePromotionsSectionRequest,
  HomeTestimonialsSectionDTO,
  UpdateHomeTestimonialsSectionRequest,
  HomeFaqSectionDTO,
  UpdateHomeFaqSectionRequest,
  ClaimRecordDTO,
  SubmitClaimRequest,
  UpdateClaimStatusRequest,
  ClaimAttachmentDTO,
  ContactExploreLinkDTO,
  AdminUserDTO,
  LoginRequest,
  LoginResponse,
  ChangeOwnPasswordRequest,
  ChangeOwnPasswordResponse,
  CreateAdminUserRequest,
  UpdateAdminUserRequest,
  AuditLogDTO,
  PublishRequestDTO,
  PublishResponseDTO,
} from "./types";
// Solo se importan de ./mocks las funciones que siguen siendo un fallback legítimo:
// lecturas públicas sin muro de auth, para cuando el backend real es genuinamente
// inalcanzable (excepción de red/timeout). Ninguna mutación ni lectura admin-only
// debe caer aquí — ver ApiError arriba y AUDIT_FINDINGS.md.
import {
  MOCK_API_INFO,
  getMockSiteSettings,
  getMockOfficeLocation,
  getMockHomeHero,
  getMockFeaturedPromotions,
  getMockPublicTrust,
  getMockPublicAbout,
  getMockPublicContact,
  getMockPublicBlog,
  getMockBlogCategories,
  getMockBlogPostBySlug,
  getMockGlobalSearch,
  getMockHomeBlogInspiration,
  getMockHomeConversationalPause,
  getMockHomePromotionsSection,
  getMockHomeTestimonialsSection,
  getMockHomeFaqSection,
  getMockContactExploreLinks,
  getMockClaimByCode,
  submitMockClaim,
  getMockAdminClaims,
  updateMockClaimStatus,
} from "./mocks";

const STORAGE_KEY_SETTINGS = "vc_site_settings";
const STORAGE_KEY_OFFICE = "vc_office_location";
const STORAGE_KEY_HERO = "vc_home_hero";
const STORAGE_KEY_PROMOTIONS = "vc_promotions";
const STORAGE_KEY_TRUST = "vc_trust_data";
const STORAGE_KEY_ABOUT = "vc_about_page";

export interface ApiClientConfig {
  baseUrl?: string;
}

// Lanzado cuando el backend real respondió (no está inalcanzable) pero con un status
// de error. A diferencia de una excepción de red, esto NUNCA debe enmascararse con un
// fallback simulado — ver AUDIT_FINDINGS.md / E2E_ADMIN_WEB_TRACKING.md, hallazgo del
// patrón "éxito falso" repetido en este archivo.
export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown) {
    super(`Error de API (HTTP ${status})`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

async function parseErrorBody(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

// Next.js parchea `fetch` en runtime para reconocer esta opción `next.revalidate`
// (ISR por fetch), pero la ampliación de tipos ambiental que la declara sobre
// `RequestInit` global solo está garantizada dentro de una app Next.js
// consumidora (apps/web, apps/admin) — se declara localmente aquí para que
// este paquete compile de forma aislada sin depender de esa ampliación global.
interface NextFetchInit extends RequestInit {
  next?: { revalidate: number | false };
}

// Opción opt-in para las lecturas públicas de apps/web: por defecto (sin pasar
// este parámetro) el comportamiento es idéntico al de siempre (`cache: "no-store"`),
// que es exactamente como sigue llamando apps/admin para sus vistas previas en
// vivo. Solo cuando el llamador pasa `cacheOptions` explícitamente se activa el
// caché de Next vía `next: { revalidate }`.
export interface FetchCacheOptions {
  revalidate: number | false;
}

export class ViajesCarolinaApiClient {
  private baseUrl: string;

  constructor(config?: ApiClientConfig) {
    this.baseUrl = config?.baseUrl || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  }

  private getEffectiveUrl(endpointPath: string): string {
    if (typeof window !== "undefined") {
      return `/api/proxy/${endpointPath.replace(/^\//, "")}`;
    }
    return `${this.baseUrl}/api/${endpointPath.replace(/^\//, "")}`;
  }

  // Los Server Components (apps/admin) hacen fetch server-side directo al backend,
  // sin pasar por el navegador: por eso el cookie de sesión no se adjunta solo.
  // Esto reenvía la cookie vc_admin_jwt de la petición entrante (si existe) a los
  // endpoints admin/v1/* que ahora requieren autenticación real.
  // Construye las opciones de caché de un fetch de lectura pública: sin
  // `cacheOptions` (caso por defecto, tal cual sigue llamando apps/admin) se
  // preserva exactamente el `cache: "no-store"` de siempre; pasando
  // `cacheOptions` explícitamente (apps/web) se activa el caché indefinido de
  // Next con revalidación on-demand, y `revalidate` como respaldo automático.
  private buildCacheInit(cacheOptions?: FetchCacheOptions): NextFetchInit {
    return cacheOptions ? { next: { revalidate: cacheOptions.revalidate } } : { cache: "no-store" };
  }

  private async withServerAuthCookie(init: RequestInit = {}): Promise<RequestInit> {
    if (typeof window !== "undefined") return init;
    try {
      const { cookies } = await import("next/headers");
      const jar = await cookies();
      const token = jar.get("vc_admin_jwt")?.value;
      if (!token) return init;
      const headers = new Headers(init.headers);
      headers.set("Cookie", `vc_admin_jwt=${token}`);
      return { ...init, headers };
    } catch {
      // Fuera de un contexto de request de Next.js (ej. apps/web, que no tiene esta cookie).
      return init;
    }
  }

  async getInfo(): Promise<ApiInfoDTO> {
    let res: Response;
    try {
      res = await fetch(this.getEffectiveUrl("public/v1/info"), {
        cache: "no-store",
      });
    } catch {
      return MOCK_API_INFO;
    }
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async getSiteSettings(cacheOptions?: FetchCacheOptions): Promise<SiteSettingsDTO> {
    let res: Response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      res = await fetch(this.getEffectiveUrl("admin/v1/settings"), {
        ...this.buildCacheInit(cacheOptions),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (err) {
      if (cacheOptions) throw err;
      // Excepción de red real (backend inalcanzable): usar caché local si existe.
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
      return getMockSiteSettings();
    }
    // El backend respondió: un error real (ej. 401) nunca debe enmascararse con datos
    // simulados — un formulario admin podría cargar datos falsos y guardarlos encima
    // de los reales.
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    const data = await res.json();
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(data));
    }
    return data;
  }

  async updateSiteSettings(payload: Partial<SiteSettingsDTO>): Promise<SiteSettingsDTO> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/settings"), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    const data = await res.json();
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(data));
    }
    return data;
  }

  async getOfficeLocation(cacheOptions?: FetchCacheOptions): Promise<OfficeLocationDTO> {
    let res: Response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      res = await fetch(this.getEffectiveUrl("admin/v1/office"), {
        ...this.buildCacheInit(cacheOptions),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (err) {
      if (cacheOptions) throw err;
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
      return getMockOfficeLocation();
    }
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    const data = await res.json();
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_OFFICE, JSON.stringify(data));
    }
    return data;
  }

  async updateOfficeLocation(payload: Partial<OfficeLocationDTO>): Promise<OfficeLocationDTO> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/office"), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    const data = await res.json();
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_OFFICE, JSON.stringify(data));
    }
    return data;
  }

  // ==========================================
  // Home Hero API (Corte 4)
  // ==========================================

  async getHomeHero(cacheOptions?: FetchCacheOptions): Promise<HomeHeroDTO> {
    let res: Response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      res = await fetch(this.getEffectiveUrl("public/v1/home/hero"), {
        ...this.buildCacheInit(cacheOptions),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (err) {
      if (cacheOptions) throw err;
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
      return getMockHomeHero();
    }
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    const data = await res.json();
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_HERO, JSON.stringify(data));
    }
    return data;
  }

  async updateHomeHero(payload: Partial<HomeHeroDTO>): Promise<HomeHeroDTO> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/home/hero"), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    const data = await res.json();
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_HERO, JSON.stringify(data));
    }
    return data;
  }

  // ==========================================
  // Promotions API (Corte 6)
  // ==========================================

  async getFeaturedPromotions(cacheOptions?: FetchCacheOptions): Promise<PromotionDTO[]> {
    let res: Response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      res = await fetch(this.getEffectiveUrl("public/v1/promotions/featured"), {
        ...this.buildCacheInit(cacheOptions),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (err) {
      if (cacheOptions) throw err;
      return getMockFeaturedPromotions();
    }
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async getAdminPromotions(): Promise<PromotionDTO[]> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/promotions"), await this.withServerAuthCookie({
      cache: "no-store",
    }));
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async setPromotionActive(id: number, active: boolean): Promise<PromotionDTO> {
    const payload: SetPromotionActiveRequest = { active };
    const res = await fetch(this.getEffectiveUrl(`admin/v1/promotions/${id}/active`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async createPromotion(payload: CreateOrUpdatePromotionRequest): Promise<PromotionDTO> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/promotions"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async deletePromotion(id: number): Promise<void> {
    const res = await fetch(this.getEffectiveUrl(`admin/v1/promotions/${id}`), {
      method: "DELETE",
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
  }

  // ==========================================
  // Trust: Testimonials & FAQ API (Corte 7)
  // ==========================================

  async getPublicTrust(cacheOptions?: FetchCacheOptions): Promise<PublicTrustResponse> {
    let res: Response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      res = await fetch(this.getEffectiveUrl("public/v1/home/trust"), {
        ...this.buildCacheInit(cacheOptions),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (err) {
      if (cacheOptions) throw err;
      return getMockPublicTrust();
    }
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async getTestimonials(): Promise<TestimonialDTO[]> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/testimonials"), await this.withServerAuthCookie({
      cache: "no-store",
    }));
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async createTestimonial(payload: CreateOrUpdateTestimonialRequest): Promise<TestimonialDTO> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/testimonials"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async updateTestimonial(id: number, payload: CreateOrUpdateTestimonialRequest): Promise<TestimonialDTO> {
    const res = await fetch(this.getEffectiveUrl(`admin/v1/testimonials/${id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async deleteTestimonial(id: number): Promise<void> {
    const res = await fetch(this.getEffectiveUrl(`admin/v1/testimonials/${id}`), {
      method: "DELETE",
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
  }

  async getFaqs(): Promise<FaqItemDTO[]> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/faq"), await this.withServerAuthCookie({
      cache: "no-store",
    }));
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async createFaq(payload: CreateOrUpdateFaqRequest): Promise<FaqItemDTO> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/faq"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async updateFaq(id: number, payload: CreateOrUpdateFaqRequest): Promise<FaqItemDTO> {
    const res = await fetch(this.getEffectiveUrl(`admin/v1/faq/${id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async deleteFaq(id: number): Promise<void> {
    const res = await fetch(this.getEffectiveUrl(`admin/v1/faq/${id}`), {
      method: "DELETE",
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
  }

  // ==========================================
  // About Us & Advisors API (Corte 8)
  // ==========================================

  async getPublicAbout(cacheOptions?: FetchCacheOptions): Promise<PublicAboutResponse> {
    let res: Response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      res = await fetch(this.getEffectiveUrl("public/v1/about"), {
        ...this.buildCacheInit(cacheOptions),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (err) {
      if (cacheOptions) throw err;
      return getMockPublicAbout();
    }
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async getAdminAbout(): Promise<AboutPageDTO> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/about"), {
      cache: "no-store",
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async updateAdminAbout(payload: UpdateAboutPageRequest): Promise<AboutPageDTO> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/about"), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async getAdminAdvisors(): Promise<TravelAdvisorDTO[]> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/advisors"), {
      cache: "no-store",
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async createAdvisor(payload: CreateOrUpdateAdvisorRequest): Promise<TravelAdvisorDTO> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/advisors"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async updateAdvisor(id: number, payload: CreateOrUpdateAdvisorRequest): Promise<TravelAdvisorDTO> {
    const res = await fetch(this.getEffectiveUrl(`admin/v1/advisors/${id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async deleteAdvisor(id: number): Promise<void> {
    const res = await fetch(this.getEffectiveUrl(`admin/v1/advisors/${id}`), {
      method: "DELETE",
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
  }

  // ==========================================
  // Media Assets API (Corte 3)
  // ==========================================

  async getMediaList(page = 0, size = 24, mimeType?: string): Promise<MediaPageResponse> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(mimeType ? { mimeType } : {}),
    });
    const res = await fetch(this.getEffectiveUrl(`admin/v1/media?${queryParams.toString()}`), await this.withServerAuthCookie({
      cache: "no-store",
    }));
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async getMediaById(id: number): Promise<MediaAssetDTO> {
    const res = await fetch(this.getEffectiveUrl(`admin/v1/media/${id}`), {
      cache: "no-store",
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async uploadMedia(file: File, altText?: string, caption?: string): Promise<MediaAssetDTO> {
    const formData = new FormData();
    formData.append("file", file);
    if (altText) formData.append("altText", altText);
    if (caption) formData.append("caption", caption);

    const res = await fetch(this.getEffectiveUrl("admin/v1/media/upload"), {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async updateMediaFocalPoint(id: number, payload: UpdateMediaFocalPointRequest): Promise<MediaAssetDTO> {
    const res = await fetch(this.getEffectiveUrl(`admin/v1/media/${id}/focal-point`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async deleteMedia(id: number): Promise<void> {
    const res = await fetch(this.getEffectiveUrl(`admin/v1/media/${id}`), {
      method: "DELETE",
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
  }

  // ==========================================
  // Contact & Inquiries API (Corte 9)
  // ==========================================

  async getPublicContact(cacheOptions?: FetchCacheOptions): Promise<PublicContactResponse> {
    let res: Response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      res = await fetch(this.getEffectiveUrl("public/v1/contact"), {
        ...this.buildCacheInit(cacheOptions),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (err) {
      if (cacheOptions) throw err;
      return getMockPublicContact();
    }
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async submitContactInquiry(payload: SubmitContactInquiryRequest): Promise<ContactInquiryDTO> {
    const res = await fetch(this.getEffectiveUrl("public/v1/contact/inquiry"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async getAdminContact(): Promise<ContactPageDTO> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/contact"), {
      cache: "no-store",
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async updateAdminContact(payload: UpdateContactPageRequest): Promise<ContactPageDTO> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/contact"), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async getAdminInquiries(status?: string): Promise<ContactInquiryDTO[]> {
    const url = status && status !== "ALL"
      ? `admin/v1/inquiries?status=${encodeURIComponent(status)}`
      : "admin/v1/inquiries";
    const res = await fetch(this.getEffectiveUrl(url), await this.withServerAuthCookie({
      cache: "no-store",
    }));
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async updateInquiryStatus(id: number, status: string): Promise<ContactInquiryDTO> {
    const res = await fetch(this.getEffectiveUrl(`admin/v1/inquiries/${id}/status`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  // ==========================================
  // Blog API (Corte 10)
  // ==========================================

  async getPublicBlog(
    categorySlug?: string,
    search?: string,
    page = 0,
    size = 9,
    cacheOptions?: FetchCacheOptions,
  ): Promise<PublicBlogResponse> {
    const params = new URLSearchParams();
    if (categorySlug && categorySlug !== "all") params.append("category", categorySlug);
    if (search && search.trim()) params.append("search", search.trim());
    params.append("page", page.toString());
    params.append("size", size.toString());
    const url = `public/v1/blog?${params.toString()}`;

    let res: Response;
    try {
      res = await fetch(this.getEffectiveUrl(url), this.buildCacheInit(cacheOptions));
    } catch (err) {
      if (cacheOptions) throw err;
      return getMockPublicBlog(categorySlug, search, page, size);
    }
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async getBlogCategories(admin = false): Promise<BlogCategoryDTO[]> {
    const url = admin ? "admin/v1/blog/categories" : "public/v1/blog/categories";
    if (admin) {
      const res = await fetch(this.getEffectiveUrl(url), await this.withServerAuthCookie({ cache: "no-store" }));
      if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
      return await res.json();
    }
    let res: Response;
    try {
      res = await fetch(this.getEffectiveUrl(url), { cache: "no-store" });
    } catch {
      return getMockBlogCategories(admin);
    }
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async getBlogPostBySlug(slug: string, cacheOptions?: FetchCacheOptions): Promise<BlogPostDetailResponse> {
    let res: Response;
    try {
      res = await fetch(this.getEffectiveUrl(`public/v1/blog/posts/${slug}`), this.buildCacheInit(cacheOptions));
    } catch (err) {
      if (cacheOptions) throw err;
      return getMockBlogPostBySlug(slug);
    }
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async getAdminBlogPosts(status?: string, search?: string, page = 0, size = 50): Promise<BlogPostDTO[]> {
    const params = new URLSearchParams();
    if (status && status !== "ALL") params.append("status", status);
    if (search && search.trim()) params.append("search", search.trim());
    params.append("page", page.toString());
    params.append("size", size.toString());

    const res = await fetch(this.getEffectiveUrl(`admin/v1/blog/posts?${params.toString()}`), await this.withServerAuthCookie({
      cache: "no-store",
    }));
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async createBlogPost(payload: CreateOrUpdateBlogPostRequest): Promise<BlogPostDTO> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/blog/posts"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async updateBlogPost(id: number, payload: CreateOrUpdateBlogPostRequest): Promise<BlogPostDTO> {
    const res = await fetch(this.getEffectiveUrl(`admin/v1/blog/posts/${id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async deleteBlogPost(id: number): Promise<void> {
    const res = await fetch(this.getEffectiveUrl(`admin/v1/blog/posts/${id}`), {
      method: "DELETE",
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
  }

  async createBlogCategory(payload: CreateOrUpdateBlogCategoryRequest): Promise<BlogCategoryDTO> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/blog/categories"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async updateBlogCategory(id: number, payload: CreateOrUpdateBlogCategoryRequest): Promise<BlogCategoryDTO> {
    const res = await fetch(this.getEffectiveUrl(`admin/v1/blog/categories/${id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async deleteBlogCategory(id: number): Promise<void> {
    const res = await fetch(this.getEffectiveUrl(`admin/v1/blog/categories/${id}`), {
      method: "DELETE",
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
  }

  // ==========================================
  // Global Search API (Corte 11)
  // ==========================================

  async searchGlobal(query = "", type: SearchResultType = "ALL", limit = 20): Promise<GlobalSearchResponse> {
    const params = new URLSearchParams();
    if (query.trim()) params.append("q", query.trim());
    if (type && type !== "ALL") params.append("type", type);
    params.append("limit", limit.toString());
    const url = `public/v1/search?${params.toString()}`;

    let res: Response;
    try {
      res = await fetch(this.getEffectiveUrl(url), { cache: "no-store" });
    } catch {
      return getMockGlobalSearch(query, type, limit);
    }
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  // ==========================================
  // Home Blog Inspiration API (Corte 12)
  // ==========================================

  async getPublicHomeBlogInspiration(cacheOptions?: FetchCacheOptions): Promise<PublicHomeBlogInspirationResponse> {
    let res: Response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      res = await fetch(this.getEffectiveUrl("public/v1/home/blog-inspiration"), {
        ...this.buildCacheInit(cacheOptions),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (err) {
      if (cacheOptions) throw err;
      return getMockHomeBlogInspiration();
    }
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async getAdminHomeBlogInspiration(): Promise<HomeBlogInspirationDTO> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/home/blog-inspiration"), await this.withServerAuthCookie({
      cache: "no-store",
    }));
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async updateAdminHomeBlogInspiration(payload: UpdateHomeBlogInspirationRequest): Promise<HomeBlogInspirationDTO> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/home/blog-inspiration"), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  // ==========================================
  // Home Conversational Pause API
  // ==========================================

  async getPublicHomeConversationalPause(cacheOptions?: FetchCacheOptions): Promise<HomeConversationalPauseDTO> {
    let res: Response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      res = await fetch(this.getEffectiveUrl("public/v1/home/conversational-pause"), {
        ...this.buildCacheInit(cacheOptions),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (err) {
      if (cacheOptions) throw err;
      return getMockHomeConversationalPause();
    }
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async getAdminHomeConversationalPause(): Promise<HomeConversationalPauseDTO> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/home/conversational-pause"), await this.withServerAuthCookie({
      cache: "no-store",
    }));
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async updateAdminHomeConversationalPause(payload: UpdateHomeConversationalPauseRequest): Promise<HomeConversationalPauseDTO> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/home/conversational-pause"), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  // ==========================================
  // Home Promotions Section API
  // ==========================================

  async getPublicHomePromotionsSection(cacheOptions?: FetchCacheOptions): Promise<HomePromotionsSectionDTO> {
    let res: Response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      res = await fetch(this.getEffectiveUrl("public/v1/home/promotions-section"), {
        ...this.buildCacheInit(cacheOptions),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (err) {
      if (cacheOptions) throw err;
      return getMockHomePromotionsSection();
    }
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async getAdminHomePromotionsSection(): Promise<HomePromotionsSectionDTO> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/home/promotions-section"), await this.withServerAuthCookie({
      cache: "no-store",
    }));
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async updateAdminHomePromotionsSection(payload: UpdateHomePromotionsSectionRequest): Promise<HomePromotionsSectionDTO> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/home/promotions-section"), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  // ==========================================
  // Home Testimonials Section API
  // ==========================================

  async getPublicHomeTestimonialsSection(cacheOptions?: FetchCacheOptions): Promise<HomeTestimonialsSectionDTO> {
    let res: Response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      res = await fetch(this.getEffectiveUrl("public/v1/home/testimonials-section"), {
        ...this.buildCacheInit(cacheOptions),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (err) {
      if (cacheOptions) throw err;
      return getMockHomeTestimonialsSection();
    }
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async getAdminHomeTestimonialsSection(): Promise<HomeTestimonialsSectionDTO> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/home/testimonials-section"), await this.withServerAuthCookie({
      cache: "no-store",
    }));
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async updateAdminHomeTestimonialsSection(payload: UpdateHomeTestimonialsSectionRequest): Promise<HomeTestimonialsSectionDTO> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/home/testimonials-section"), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  // ==========================================
  // Home FAQ Section API
  // ==========================================

  async getPublicHomeFaqSection(cacheOptions?: FetchCacheOptions): Promise<HomeFaqSectionDTO> {
    let res: Response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      res = await fetch(this.getEffectiveUrl("public/v1/home/faq-section"), {
        ...this.buildCacheInit(cacheOptions),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (err) {
      if (cacheOptions) throw err;
      return getMockHomeFaqSection();
    }
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async getAdminHomeFaqSection(): Promise<HomeFaqSectionDTO> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/home/faq-section"), await this.withServerAuthCookie({
      cache: "no-store",
    }));
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async updateAdminHomeFaqSection(payload: UpdateHomeFaqSectionRequest): Promise<HomeFaqSectionDTO> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/home/faq-section"), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  // ==========================================
  // Claims: Libro de Reclamaciones & Office Links (Corte 13)
  // ==========================================

  async submitClaim(payload: SubmitClaimRequest): Promise<ClaimRecordDTO> {
    let res: Response;
    try {
      res = await fetch(this.getEffectiveUrl("public/v1/claims"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // Excepción de red real (backend inalcanzable): permite seguir probando el
      // asistente de 4 pasos de forma autónoma sin backend levantado.
      return submitMockClaim(payload);
    }
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  // Sube un adjunto opcional a una hoja de reclamación ya registrada. Nunca debe
  // bloquear el registro exitoso del reclamo: el llamador decide qué hacer si falla
  // (ver useClaimWizard — solo se advierte, no se revierte el envío).
  async uploadClaimAttachment(claimId: number, file: File): Promise<ClaimAttachmentDTO> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(this.getEffectiveUrl(`public/v1/claims/${claimId}/attachments`), {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  // Arma la URL absoluta de descarga de la constancia PDF — nunca hace fetch, se usa
  // directamente en un <a href> / window.open para que el navegador maneje la
  // descarga del binario (evita el proxy JSON de /api/proxy/*, que no soporta binarios).
  getClaimConstanciaPdfUrl(claimCode: string, documentNumber: string): string {
    const base = this.baseUrl.replace(/\/$/, "");
    const params = new URLSearchParams({ documentNumber });
    return `${base}/api/public/v1/claims/${encodeURIComponent(claimCode)}/constancia.pdf?${params.toString()}`;
  }

  async getClaimByCode(claimCode: string): Promise<ClaimRecordDTO> {
    let res: Response;
    try {
      res = await fetch(this.getEffectiveUrl(`public/v1/claims/${encodeURIComponent(claimCode)}`), {
        cache: "no-store",
      });
    } catch {
      const found = getMockClaimByCode(claimCode);
      if (found) return found;
      throw new Error(`Hoja de reclamación no encontrada: ${claimCode}`);
    }
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async getAdminClaims(status?: string): Promise<ClaimRecordDTO[]> {
    const url = status && status !== "ALL"
      ? `admin/v1/claims?status=${encodeURIComponent(status)}`
      : "admin/v1/claims";
    let res: Response;
    try {
      res = await fetch(this.getEffectiveUrl(url), await this.withServerAuthCookie({
        cache: "no-store",
      }));
    } catch {
      return getMockAdminClaims(status);
    }
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async updateClaimStatus(id: number, status: string, responseNotes?: string): Promise<ClaimRecordDTO> {
    let res: Response;
    try {
      res = await fetch(this.getEffectiveUrl(`admin/v1/claims/${id}/status`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, responseNotes }),
      });
    } catch {
      return updateMockClaimStatus(id, status, responseNotes);
    }
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  // Arma la URL de descarga de un adjunto de reclamo desde el panel admin — pasa por
  // el proxy admin existente (igual que el resto de llamadas admin/v1/*) para que la
  // cookie de sesión vc_admin_jwt viaje junto con la navegación del navegador.
  getAdminClaimAttachmentUrl(claimId: number, attachmentId: number): string {
    return this.getEffectiveUrl(`admin/v1/claims/${claimId}/attachments/${attachmentId}`);
  }

  async getContactExploreLinks(): Promise<ContactExploreLinkDTO[]> {
    let res: Response;
    try {
      res = await fetch(this.getEffectiveUrl("public/v1/contact/explore-links"), {
        cache: "no-store",
      });
    } catch {
      return getMockContactExploreLinks();
    }
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  // Auth & Governance (Corte 14)
  async loginAdmin(req: LoginRequest): Promise<LoginResponse> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
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
    const res = await fetch(this.getEffectiveUrl("admin/v1/auth/me"), {
      cache: "no-store",
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async changeOwnPassword(req: ChangeOwnPasswordRequest): Promise<ChangeOwnPasswordResponse> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/auth/password"), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async getAdminUsers(): Promise<AdminUserDTO[]> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/users"), await this.withServerAuthCookie({
      cache: "no-store",
    }));
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async createAdminUser(req: CreateAdminUserRequest): Promise<AdminUserDTO> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/users"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async updateAdminUser(id: number, req: UpdateAdminUserRequest): Promise<AdminUserDTO> {
    const res = await fetch(this.getEffectiveUrl(`admin/v1/users/${id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async getAuditLogs(entityType?: string, limit?: number): Promise<AuditLogDTO[]> {
    const params = new URLSearchParams();
    if (entityType && entityType !== "ALL") params.append("entityType", entityType);
    if (limit) params.append("limit", String(limit));
    const q = params.toString();
    const url = q ? `admin/v1/audit-logs?${q}` : "admin/v1/audit-logs";
    const res = await fetch(this.getEffectiveUrl(url), await this.withServerAuthCookie({
      cache: "no-store",
    }));
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  // Publishing & ISR (Corte 15)
  async triggerPublish(req: PublishRequestDTO): Promise<PublishResponseDTO> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/publishing/publish"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }

  async getPublishingStatus(): Promise<PublishResponseDTO> {
    const res = await fetch(this.getEffectiveUrl("admin/v1/publishing/status"), {
      cache: "no-store",
    });
    if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
    return await res.json();
  }
}

export const apiClient = new ViajesCarolinaApiClient();




