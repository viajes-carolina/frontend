import { SiteSettingsDTO, OfficeLocationDTO, PromotionDTO, BlogPostDTO, ApiInfoDTO } from "./types";
import { MOCK_SITE_SETTINGS, MOCK_OFFICE_LOCATION, MOCK_PROMOTIONS, MOCK_BLOG_POSTS, MOCK_API_INFO } from "./mocks";

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

  async getInfo(): Promise<ApiInfoDTO> {
    if (this.useMocks) return MOCK_API_INFO;
    try {
      const res = await fetch(`${this.baseUrl}/api/public/v1/info`, {
        next: { revalidate: 60 },
      });
      if (!res.ok) return MOCK_API_INFO;
      return await res.json();
    } catch {
      return MOCK_API_INFO;
    }
  }

  async getSiteSettings(): Promise<SiteSettingsDTO> {
    if (this.useMocks) return MOCK_SITE_SETTINGS;
    try {
      const res = await fetch(`${this.baseUrl}/api/public/v1/site`, {
        next: { tags: ["site_settings"], revalidate: 3600 },
      });
      if (!res.ok) return MOCK_SITE_SETTINGS;
      return await res.json();
    } catch {
      return MOCK_SITE_SETTINGS;
    }
  }

  async getOfficeLocation(): Promise<OfficeLocationDTO> {
    if (this.useMocks) return MOCK_OFFICE_LOCATION;
    try {
      const res = await fetch(`${this.baseUrl}/api/public/v1/office`, {
        next: { tags: ["office_location"], revalidate: 3600 },
      });
      if (!res.ok) return MOCK_OFFICE_LOCATION;
      return await res.json();
    } catch {
      return MOCK_OFFICE_LOCATION;
    }
  }

  async getPromotions(): Promise<PromotionDTO[]> {
    if (this.useMocks) return MOCK_PROMOTIONS;
    try {
      const res = await fetch(`${this.baseUrl}/api/public/v1/promotions`, {
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
      const res = await fetch(`${this.baseUrl}/api/public/v1/blog`, {
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
