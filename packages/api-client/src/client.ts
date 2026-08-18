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
  getMockMediaPage,
  updateMockMediaFocalPoint,
  DEFAULT_MEDIA_ASSETS,
} from "./mocks";

const STORAGE_KEY_SETTINGS = "vc_site_settings";
const STORAGE_KEY_OFFICE = "vc_office_location";
const STORAGE_KEY_HERO = "vc_home_hero";
const STORAGE_KEY_INTENTIONS = "vc_travel_intentions";
const STORAGE_KEY_PROMOTIONS = "vc_promotions";

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

  async getBlogPosts(): Promise<BlogPostDTO[]> {
    if (this.useMocks) return MOCK_BLOG_POSTS;
    try {
      const res = await fetch(this.getEffectiveUrl("public/v1/blog"), {
        cache: "no-store",
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return MOCK_BLOG_POSTS;
  }
}

export const apiClient = new ViajesCarolinaApiClient();
