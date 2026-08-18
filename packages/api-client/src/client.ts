import { SiteSettingsDTO, OfficeLocationDTO, PromotionDTO, BlogPostDTO, ApiInfoDTO } from "./types";
import {
  MOCK_SITE_SETTINGS,
  MOCK_OFFICE_LOCATION,
  MOCK_PROMOTIONS,
  MOCK_BLOG_POSTS,
  MOCK_API_INFO,
  updateMockSiteSettings,
  updateMockOfficeLocation,
} from "./mocks";

const STORAGE_KEY_SETTINGS = "vc_site_settings";
const STORAGE_KEY_OFFICE = "vc_office_location";

export interface ApiClientConfig {
  baseUrl?: string;
  useMocks?: boolean;
}

export class ViajesCarolinaApiClient {
  private baseUrl: string;
  private useMocks: boolean;

  constructor(config?: ApiClientConfig) {
    this.baseUrl = config?.baseUrl || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    this.useMocks = config?.useMocks ?? false;
  }

  private getEffectiveUrl(endpointPath: string): string {
    // If running in browser, use the same-origin Next.js proxy route to bypass all CORS limitations
    if (typeof window !== "undefined") {
      return `/api/proxy/${endpointPath.replace(/^\//, "")}`;
    }
    // If running in Node.js server (SSR / SSG), connect directly to backend
    return `${this.baseUrl}/api/${endpointPath.replace(/^\//, "")}`;
  }

  async getInfo(): Promise<ApiInfoDTO> {
    if (this.useMocks) return MOCK_API_INFO;
    try {
      const res = await fetch(this.getEffectiveUrl("public/v1/info"), {
        next: { revalidate: 60 },
      });
      if (!res.ok) return MOCK_API_INFO;
      return await res.json();
    } catch {
      return MOCK_API_INFO;
    }
  }

  async getSiteSettings(): Promise<SiteSettingsDTO> {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // fallback
        }
      }
    }

    try {
      const res = await fetch(this.getEffectiveUrl("public/v1/site"), {
        next: { tags: ["site_settings"], revalidate: 3600 },
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(data));
        }
        return data;
      }
    } catch {
      // Backend not running
    }
    return MOCK_SITE_SETTINGS;
  }

  async updateSiteSettings(payload: Partial<SiteSettingsDTO>): Promise<SiteSettingsDTO> {
    const updated = updateMockSiteSettings(payload);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
    }

    try {
      const res = await fetch(this.getEffectiveUrl("admin/v1/settings"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
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
    return updated;
  }

  async getOfficeLocation(): Promise<OfficeLocationDTO> {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY_OFFICE);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // fallback
        }
      }
    }

    try {
      const res = await fetch(this.getEffectiveUrl("public/v1/office"), {
        next: { tags: ["office_location"], revalidate: 3600 },
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY_OFFICE, JSON.stringify(data));
        }
        return data;
      }
    } catch {
      // Backend not running
    }
    return MOCK_OFFICE_LOCATION;
  }

  async updateOfficeLocation(payload: Partial<OfficeLocationDTO>): Promise<OfficeLocationDTO> {
    const updated = updateMockOfficeLocation(payload);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_OFFICE, JSON.stringify(updated));
    }

    try {
      const res = await fetch(this.getEffectiveUrl("admin/v1/office"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
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
    return updated;
  }

  async getPromotions(): Promise<PromotionDTO[]> {
    if (this.useMocks) return MOCK_PROMOTIONS;
    try {
      const res = await fetch(this.getEffectiveUrl("public/v1/promotions"), {
        next: { tags: ["promotions"], revalidate: 3600 },
      });
      if (!res.ok) return MOCK_PROMOTIONS;
      return await res.json();
    } catch {
      return MOCK_PROMOTIONS;
    }
  }

  async getBlogPosts(): Promise<BlogPostDTO[]> {
    if (this.useMocks) return MOCK_BLOG_POSTS;
    try {
      const res = await fetch(this.getEffectiveUrl("public/v1/blog"), {
        next: { tags: ["blog"], revalidate: 3600 },
      });
      if (!res.ok) return MOCK_BLOG_POSTS;
      return await res.json();
    } catch {
      return MOCK_BLOG_POSTS;
    }
  }
}

export const apiClient = new ViajesCarolinaApiClient();
