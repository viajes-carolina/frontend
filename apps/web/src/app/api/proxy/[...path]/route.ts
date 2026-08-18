import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_OFFICE_LOCATION,
  DEFAULT_MEDIA_ASSETS,
  DEFAULT_HOME_HERO,
  DEFAULT_TRAVEL_INTENTIONS,
  DEFAULT_PROMOTIONS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_FAQS,
  DEFAULT_ABOUT_PAGE,
  DEFAULT_ADVISORS,
  DEFAULT_CONTACT_PAGE,
  DEFAULT_INQUIRIES,
  getMockMediaPage,
  updateMockMediaFocalPoint,
  MOCK_BLOG_POSTS,
  SiteSettingsDTO,
  OfficeLocationDTO,
  HomeHeroDTO,
  TravelIntentionDTO,
  PromotionDTO,
  TestimonialDTO,
  FaqItemDTO,
  PublicTrustResponse,
  AboutPageDTO,
  TravelAdvisorDTO,
  PublicAboutResponse,
  ContactPageDTO,
  ContactInquiryDTO,
  PublicContactResponse,
  DEFAULT_BLOG_CATEGORIES,
  DEFAULT_BLOG_POSTS,
  BlogCategoryDTO,
  BlogPostDTO,
  PublicBlogResponse,
  BlogPostDetailResponse,
  SearchResultType,
  getMockGlobalSearch,
  DEFAULT_HOME_BLOG_INSPIRATION,
  HomeBlogInspirationDTO,
  PublicHomeBlogInspirationResponse,
  DEFAULT_CLAIM_RECORDS,
  ClaimRecordDTO,
  DEFAULT_CONTACT_EXPLORE_LINKS,
  ContactExploreLinkDTO,
  DEFAULT_ADMIN_USERS,
  DEFAULT_AUDIT_LOGS,
  AdminUserDTO,
  AuditLogDTO,
  LoginResponse,
  DEFAULT_PUBLISH_RESPONSE,
  PublishRequestDTO,
  PublishResponseDTO,
} from "@vc/api-client";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:8080";

function getDataDir(): string {
  let curr = process.cwd();
  for (let i = 0; i < 4; i++) {
    const candidate = path.join(curr, ".data");
    if (fs.existsSync(candidate)) {
      return candidate;
    }
    const pkgJson = path.join(curr, "package.json");
    if (fs.existsSync(pkgJson)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgJson, "utf-8"));
        if (pkg.name === "viajes-carolina-monorepo") {
          const target = path.join(curr, ".data");
          if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });
          return target;
        }
      } catch {
        // ignore
      }
    }
    const parent = path.dirname(curr);
    if (parent === curr) break;
    curr = parent;
  }
  return path.resolve(process.cwd(), ".data");
}

function readStoredJson<T>(filename: string, fallback: T): T {
  try {
    const dataDir = getDataDir();
    const filePath = path.join(dataDir, filename);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content) as T;
    }
  } catch {
    // fallback
  }
  return fallback;
}

function writeStoredJson<T>(filename: string, data: T): void {
  try {
    const dataDir = getDataDir();
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // ignore
  }
}

async function proxyOrFallback(
  req: NextRequest,
  params: Promise<{ path: string[] }>
) {
  try {
    const resolvedParams = params ? await params : { path: [] };
    const routeParams = Array.isArray(resolvedParams?.path) ? resolvedParams.path : [];
    const targetPath = routeParams.join("/");
    const targetUrl = `${BACKEND_URL}/api/${targetPath}`;
    const method = req.method;

    // Read request body safely once
    let bodyText: string | undefined = undefined;
    let bodyJson: Record<string, unknown> | undefined = undefined;

    if (["POST", "PUT", "PATCH"].includes(method)) {
      try {
        bodyText = await req.text();
        if (bodyText) {
          bodyJson = JSON.parse(bodyText);
        }
      } catch {
        // ignore
      }
    }

    // Try real Quarkus backend first if online
    try {
      const headers = new Headers();
      req.headers.forEach((val, key) => {
        if (!["host", "connection", "content-length"].includes(key.toLowerCase())) {
          headers.set(key, val);
        }
      });
      if (bodyText && !headers.has("content-type")) {
        headers.set("content-type", "application/json");
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch(targetUrl, {
        method,
        headers,
        body: bodyText,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      }
    } catch {
      // Backend offline / dev fallback
    }

    // Graceful Offline / Dev Fallback with Disk Persistence
    if (targetPath.includes("explore-links")) {
      const current = readStoredJson<ContactExploreLinkDTO[]>("contact_explore_links.json", DEFAULT_CONTACT_EXPLORE_LINKS);
      return NextResponse.json(current.filter((l) => l.active), { status: 200 });
    }

    if (targetPath === "public/v1/contact" || (targetPath.includes("contact") && targetPath.includes("public") && !targetPath.includes("inquiry") && !targetPath.includes("explore-links"))) {
      const p = readStoredJson<ContactPageDTO>("contact_page.json", DEFAULT_CONTACT_PAGE);
      const settings = readStoredJson<SiteSettingsDTO>("site_settings.json", DEFAULT_SITE_SETTINGS);
      const office = readStoredJson<OfficeLocationDTO>("office_location.json", DEFAULT_OFFICE_LOCATION);
      const res: PublicContactResponse = {
        page: p,
        primaryPhone: settings.primaryPhone,
        whatsappPhone: settings.whatsappPhone || "+51987654321",
        contactEmail: settings.contactEmail,
        officeAddress: `${office.addressLine}, ${office.district}, ${office.city}`,
        officeHours: office.scheduleWeekdays,
      };
      return NextResponse.json(res, { status: 200 });
    }

    if (targetPath.includes("inquir") || targetPath.includes("inquiry")) {
      const current = readStoredJson<ContactInquiryDTO[]>("inquiries.json", DEFAULT_INQUIRIES);
      if (method === "POST") {
        const newInq: ContactInquiryDTO = {
          id: Date.now(),
          fullName: String(bodyJson?.fullName || "Lead"),
          email: String(bodyJson?.email || "correo@ejemplo.com"),
          phone: bodyJson?.phone ? String(bodyJson.phone) : undefined,
          destinationOfInterest: bodyJson?.destinationOfInterest ? String(bodyJson.destinationOfInterest) : undefined,
          travelDateApprox: bodyJson?.travelDateApprox ? String(bodyJson.travelDateApprox) : undefined,
          travelersCount: bodyJson?.travelersCount ? Number(bodyJson.travelersCount) : 1,
          message: String(bodyJson?.message || ""),
          preferredContactChannel: String(bodyJson?.preferredContactChannel || "WHATSAPP"),
          status: "NEW",
          turnstileVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updated = [newInq, ...current];
        writeStoredJson("inquiries.json", updated);
        return NextResponse.json(newInq, { status: 201 });
      }
      if (method === "PATCH") {
        const idMatch = targetPath.match(/inquiries\/(\d+)/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 1;
        const index = current.findIndex((i) => i.id === id);
        if (index !== -1) {
          const updatedItem = {
            ...current[index],
            status: String(bodyJson?.status || current[index].status),
            updatedAt: new Date().toISOString(),
          };
          current[index] = updatedItem as ContactInquiryDTO;
          writeStoredJson("inquiries.json", current);
          return NextResponse.json(updatedItem, { status: 200 });
        }
      }
      return NextResponse.json(current, { status: 200 });
    }

    if (targetPath.includes("contact")) {
      const current = readStoredJson<ContactPageDTO>("contact_page.json", DEFAULT_CONTACT_PAGE);
      if (method === "PUT" || method === "POST") {
        const updated = {
          ...current,
          ...(bodyJson || {}),
          revision: (current.revision || 1) + 1,
          updatedAt: new Date().toISOString(),
        };
        writeStoredJson("contact_page.json", updated);
        return NextResponse.json(updated, { status: 200 });
      }
      return NextResponse.json(current, { status: 200 });
    }

    if (targetPath === "public/v1/about" || (targetPath.includes("about") && targetPath.includes("public"))) {
      const p = readStoredJson<AboutPageDTO>("about_page.json", DEFAULT_ABOUT_PAGE);
      const adv = readStoredJson<TravelAdvisorDTO[]>("advisors.json", DEFAULT_ADVISORS);
      const res: PublicAboutResponse = {
        page: p,
        advisors: adv.filter((a) => a.active),
      };
      return NextResponse.json(res, { status: 200 });
    }

    if (targetPath.includes("advisors")) {
      const current = readStoredJson<TravelAdvisorDTO[]>("advisors.json", DEFAULT_ADVISORS);
      if (method === "POST") {
        const newA: TravelAdvisorDTO = {
          id: Date.now(),
          fullName: String(bodyJson?.fullName || "Nueva Asesora"),
          roleTitle: String(bodyJson?.roleTitle || "Asesora"),
          specialty: String(bodyJson?.specialty || "Destinos"),
          bio: String(bodyJson?.bio || ""),
          photoMediaId: bodyJson?.photoMediaId ? Number(bodyJson.photoMediaId) : undefined,
          photoMediaUrl: "/media/demo-cartagena-caribe.webp",
          whatsappPhone: String(bodyJson?.whatsappPhone || "+51987654321"),
          whatsappMessageTemplate: String(bodyJson?.whatsappMessageTemplate || ""),
          displayOrder: bodyJson?.displayOrder ? Number(bodyJson.displayOrder) : current.length + 1,
          active: bodyJson?.active !== undefined ? Boolean(bodyJson.active) : true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updated = [...current, newA];
        writeStoredJson("advisors.json", updated);
        return NextResponse.json(newA, { status: 201 });
      }
      if (method === "PUT") {
        const idMatch = targetPath.match(/advisors\/(\d+)/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 1;
        const index = current.findIndex((a) => a.id === id);
        if (index !== -1) {
          const updatedItem = {
            ...current[index],
            ...(bodyJson || {}),
            updatedAt: new Date().toISOString(),
          };
          current[index] = updatedItem as TravelAdvisorDTO;
          writeStoredJson("advisors.json", current);
          return NextResponse.json(updatedItem, { status: 200 });
        }
      }
      if (method === "DELETE") {
        const idMatch = targetPath.match(/advisors\/(\d+)/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 1;
        const index = current.findIndex((a) => a.id === id);
        if (index !== -1) {
          current[index].active = false;
          writeStoredJson("advisors.json", current);
        }
        return new NextResponse(null, { status: 204 });
      }
      return NextResponse.json(current, { status: 200 });
    }

    if (targetPath.includes("about")) {
      const current = readStoredJson<AboutPageDTO>("about_page.json", DEFAULT_ABOUT_PAGE);
      if (method === "PUT" || method === "POST") {
        const updated = {
          ...current,
          ...(bodyJson || {}),
          revision: (current.revision || 1) + 1,
          updatedAt: new Date().toISOString(),
        };
        writeStoredJson("about_page.json", updated);
        return NextResponse.json(updated, { status: 200 });
      }
      return NextResponse.json(current, { status: 200 });
    }

    if (targetPath.includes("trust")) {
      const tList = readStoredJson<TestimonialDTO[]>("testimonials.json", DEFAULT_TESTIMONIALS);
      const fList = readStoredJson<FaqItemDTO[]>("faqs.json", DEFAULT_FAQS);
      const res: PublicTrustResponse = {
        testimonials: tList.filter((t) => t.active),
        faqs: fList.filter((f) => f.active),
      };
      return NextResponse.json(res, { status: 200 });
    }

    if (targetPath.includes("testimonials")) {
      const current = readStoredJson<TestimonialDTO[]>("testimonials.json", DEFAULT_TESTIMONIALS);
      if (method === "POST") {
        const newT: TestimonialDTO = {
          id: Date.now(),
          clientName: String(bodyJson?.clientName || "Cliente"),
          clientLocation: bodyJson?.clientLocation ? String(bodyJson.clientLocation) : undefined,
          tripDestination: String(bodyJson?.tripDestination || "Destino"),
          comment: String(bodyJson?.comment || ""),
          rating: Number(bodyJson?.rating || 5),
          avatarMediaId: bodyJson?.avatarMediaId ? Number(bodyJson.avatarMediaId) : undefined,
          avatarMediaUrl: "/media/demo-cartagena-caribe.webp",
          consentConfirmed: bodyJson?.consentConfirmed !== undefined ? Boolean(bodyJson.consentConfirmed) : true,
          displayOrder: bodyJson?.displayOrder ? Number(bodyJson.displayOrder) : current.length + 1,
          active: bodyJson?.active !== undefined ? Boolean(bodyJson.active) : true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updated = [...current, newT];
        writeStoredJson("testimonials.json", updated);
        return NextResponse.json(newT, { status: 201 });
      }
      if (method === "PUT") {
        const idMatch = targetPath.match(/testimonials\/(\d+)/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 1;
        const index = current.findIndex((t) => t.id === id);
        if (index !== -1) {
          const updatedItem = {
            ...current[index],
            ...(bodyJson || {}),
            updatedAt: new Date().toISOString(),
          };
          current[index] = updatedItem as TestimonialDTO;
          writeStoredJson("testimonials.json", current);
          return NextResponse.json(updatedItem, { status: 200 });
        }
      }
      if (method === "DELETE") {
        const idMatch = targetPath.match(/testimonials\/(\d+)/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 1;
        const index = current.findIndex((t) => t.id === id);
        if (index !== -1) {
          current[index].active = false;
          writeStoredJson("testimonials.json", current);
        }
        return new NextResponse(null, { status: 204 });
      }
      return NextResponse.json(current, { status: 200 });
    }

    if (targetPath.includes("faq")) {
      const current = readStoredJson<FaqItemDTO[]>("faqs.json", DEFAULT_FAQS);
      if (method === "POST") {
        const newF: FaqItemDTO = {
          id: Date.now(),
          question: String(bodyJson?.question || "¿Pregunta?"),
          answer: String(bodyJson?.answer || "Respuesta"),
          category: String(bodyJson?.category || "General"),
          displayOrder: bodyJson?.displayOrder ? Number(bodyJson.displayOrder) : current.length + 1,
          active: bodyJson?.active !== undefined ? Boolean(bodyJson.active) : true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updated = [...current, newF];
        writeStoredJson("faqs.json", updated);
        return NextResponse.json(newF, { status: 201 });
      }
      if (method === "PUT") {
        const idMatch = targetPath.match(/faq\/(\d+)/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 1;
        const index = current.findIndex((f) => f.id === id);
        if (index !== -1) {
          const updatedItem = {
            ...current[index],
            ...(bodyJson || {}),
            updatedAt: new Date().toISOString(),
          };
          current[index] = updatedItem as FaqItemDTO;
          writeStoredJson("faqs.json", current);
          return NextResponse.json(updatedItem, { status: 200 });
        }
      }
      if (method === "DELETE") {
        const idMatch = targetPath.match(/faq\/(\d+)/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 1;
        const index = current.findIndex((f) => f.id === id);
        if (index !== -1) {
          current[index].active = false;
          writeStoredJson("faqs.json", current);
        }
        return new NextResponse(null, { status: 204 });
      }
      return NextResponse.json(current, { status: 200 });
    }

    if (targetPath.includes("promotions")) {
      const current = readStoredJson<PromotionDTO[]>("promotions.json", DEFAULT_PROMOTIONS);
      if (method === "POST") {
        const newPromo: PromotionDTO = {
          id: Date.now(),
          slug: String(bodyJson?.slug || `promo-${Date.now()}`),
          title: String(bodyJson?.title || "Nueva Promoción"),
          destination: String(bodyJson?.destination || "Destino"),
          summary: String(bodyJson?.summary || ""),
          priceUsd: Number(bodyJson?.priceUsd || 499),
          pricePen: bodyJson?.pricePen ? Number(bodyJson.pricePen) : Number(bodyJson?.priceUsd || 499) * 3.7,
          durationDays: Number(bodyJson?.durationDays || 4),
          durationNights: Number(bodyJson?.durationNights || 3),
          departureCity: String(bodyJson?.departureCity || "Lima"),
          validFrom: String(bodyJson?.validFrom || new Date().toISOString().split("T")[0]),
          validUntil: String(bodyJson?.validUntil || new Date(Date.now() + 180 * 86400000).toISOString().split("T")[0]),
          featuredMediaId: bodyJson?.featuredMediaId ? Number(bodyJson.featuredMediaId) : undefined,
          featuredMediaUrl: "/media/demo-cartagena-caribe.webp",
          featuredMediaFocalX: 50.0,
          featuredMediaFocalY: 50.0,
          isFeatured: bodyJson?.isFeatured !== undefined ? Boolean(bodyJson.isFeatured) : true,
          inclusions: Array.isArray(bodyJson?.inclusions) ? (bodyJson?.inclusions as string[]) : [],
          exclusions: Array.isArray(bodyJson?.exclusions) ? (bodyJson?.exclusions as string[]) : [],
          whatsappMessageTemplate: String(bodyJson?.whatsappMessageTemplate || ""),
          displayOrder: bodyJson?.displayOrder ? Number(bodyJson.displayOrder) : current.length + 1,
          active: bodyJson?.active !== undefined ? Boolean(bodyJson.active) : true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updated = [...current, newPromo];
        writeStoredJson("promotions.json", updated);
        return NextResponse.json(newPromo, { status: 201 });
      }
      if (method === "PUT") {
        const idMatch = targetPath.match(/promotions\/(\d+)/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 1;
        const index = current.findIndex((p) => p.id === id);
        if (index !== -1) {
          const updatedItem = {
            ...current[index],
            ...(bodyJson || {}),
            updatedAt: new Date().toISOString(),
          };
          current[index] = updatedItem as PromotionDTO;
          writeStoredJson("promotions.json", current);
          return NextResponse.json(updatedItem, { status: 200 });
        }
      }
      if (method === "DELETE") {
        const idMatch = targetPath.match(/promotions\/(\d+)/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 1;
        const index = current.findIndex((p) => p.id === id);
        if (index !== -1) {
          current[index].active = false;
          writeStoredJson("promotions.json", current);
        }
        return new NextResponse(null, { status: 204 });
      }
      if (targetPath.includes("featured")) {
        return NextResponse.json(current.filter((p) => p.isFeatured && p.active), { status: 200 });
      }
      return NextResponse.json(current, { status: 200 });
    }

    if (targetPath.includes("intentions")) {
      const current = readStoredJson<TravelIntentionDTO[]>("travel_intentions.json", DEFAULT_TRAVEL_INTENTIONS);
      if (method === "POST") {
        const newIntention: TravelIntentionDTO = {
          id: Date.now(),
          slug: String(bodyJson?.slug || `intent-${Date.now()}`),
          title: String(bodyJson?.title || "Nueva Intención"),
          tagline: String(bodyJson?.tagline || ""),
          iconName: String(bodyJson?.iconName || "SunIcon"),
          featuredDestinations: Array.isArray(bodyJson?.featuredDestinations) ? (bodyJson?.featuredDestinations as string[]) : [],
          whatsappMessageTemplate: String(bodyJson?.whatsappMessageTemplate || ""),
          coverMediaId: bodyJson?.coverMediaId ? Number(bodyJson.coverMediaId) : undefined,
          coverMediaUrl: "/media/demo-cartagena-caribe.webp",
          coverFocalX: 50.0,
          coverFocalY: 50.0,
          displayOrder: bodyJson?.displayOrder ? Number(bodyJson.displayOrder) : current.length + 1,
          active: bodyJson?.active !== undefined ? Boolean(bodyJson.active) : true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updated = [...current, newIntention];
        writeStoredJson("travel_intentions.json", updated);
        return NextResponse.json(newIntention, { status: 201 });
      }
      if (method === "PUT") {
        const idMatch = targetPath.match(/intentions\/(\d+)/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 1;
        const index = current.findIndex((i) => i.id === id);
        if (index !== -1) {
          const updatedItem = {
            ...current[index],
            ...(bodyJson || {}),
            updatedAt: new Date().toISOString(),
          };
          current[index] = updatedItem as TravelIntentionDTO;
          writeStoredJson("travel_intentions.json", current);
          return NextResponse.json(updatedItem, { status: 200 });
        }
      }
      if (method === "DELETE") {
        const idMatch = targetPath.match(/intentions\/(\d+)/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 1;
        const index = current.findIndex((i) => i.id === id);
        if (index !== -1) {
          current[index].active = false;
          writeStoredJson("travel_intentions.json", current);
        }
        return new NextResponse(null, { status: 204 });
      }
      return NextResponse.json(current, { status: 200 });
    }

    if (targetPath.includes("blog-inspiration")) {
      const config = readStoredJson<HomeBlogInspirationDTO>("home_blog_inspiration.json", DEFAULT_HOME_BLOG_INSPIRATION);
      if (method === "PUT" || method === "POST") {
        const updated = {
          ...config,
          ...(bodyJson || {}),
          updatedAt: new Date().toISOString(),
        };
        writeStoredJson("home_blog_inspiration.json", updated);
        return NextResponse.json(updated, { status: 200 });
      }
      if (targetPath.includes("public")) {
        const posts = readStoredJson<BlogPostDTO[]>("blog_posts.json", DEFAULT_BLOG_POSTS);
        const activePosts = posts.filter((p) => p.active && p.status === "PUBLISHED").slice(0, config.postsLimit || 3);
        const res: PublicHomeBlogInspirationResponse = {
          config,
          posts: activePosts,
        };
        return NextResponse.json(res, { status: 200 });
      }
      return NextResponse.json(config, { status: 200 });
    }

    if (targetPath.includes("hero")) {
      const current = readStoredJson<HomeHeroDTO>("home_hero.json", DEFAULT_HOME_HERO);
      if (method === "PUT" || method === "POST") {
        const updated = {
          ...current,
          ...(bodyJson || {}),
          revision: (current.revision || 1) + 1,
          updatedAt: new Date().toISOString(),
        };
        writeStoredJson("home_hero.json", updated);
        return NextResponse.json(updated, { status: 200 });
      }
      return NextResponse.json(current, { status: 200 });
    }

    if (targetPath.includes("settings") || targetPath.includes("site")) {
      const current = readStoredJson<SiteSettingsDTO>("site_settings.json", DEFAULT_SITE_SETTINGS);
      if (method === "PUT" || method === "POST") {
        const updated = { ...current, ...(bodyJson || {}) };
        writeStoredJson("site_settings.json", updated);
        return NextResponse.json(updated, { status: 200 });
      }
      return NextResponse.json(current, { status: 200 });
    }

    if (targetPath.includes("office")) {
      const current = readStoredJson<OfficeLocationDTO>("office_location.json", DEFAULT_OFFICE_LOCATION);
      if (method === "PUT" || method === "POST") {
        const updated = {
          ...current,
          ...(bodyJson || {}),
          revision: (current.revision || 1) + 1,
          updatedAt: new Date().toISOString(),
        };
        writeStoredJson("office_location.json", updated);
        return NextResponse.json(updated, { status: 200 });
      }
      return NextResponse.json(current, { status: 200 });
    }

    if (targetPath.includes("media")) {
      if (method === "PATCH") {
        const idMatch = targetPath.match(/media\/(\d+)/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 1;
        const updated = updateMockMediaFocalPoint(id, (bodyJson as any) || { focalX: 50, focalY: 50 });
        return NextResponse.json(updated || DEFAULT_MEDIA_ASSETS[0], { status: 200 });
      }
      return NextResponse.json(getMockMediaPage(), { status: 200 });
    }

    if (targetPath.includes("blog")) {
      const posts = readStoredJson<BlogPostDTO[]>("blog_posts.json", DEFAULT_BLOG_POSTS);
      const categories = readStoredJson<BlogCategoryDTO[]>("blog_categories.json", DEFAULT_BLOG_CATEGORIES);

      if (targetPath.includes("categories")) {
        if (method === "POST") {
          const newCat: BlogCategoryDTO = {
            id: Date.now(),
            name: String(bodyJson?.name || "Nueva Categoría"),
            slug: String(bodyJson?.slug || `cat-${Date.now()}`),
            description: bodyJson?.description ? String(bodyJson.description) : undefined,
            displayOrder: bodyJson?.displayOrder ? Number(bodyJson.displayOrder) : categories.length + 1,
            active: bodyJson?.active !== undefined ? Boolean(bodyJson.active) : true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          const updated = [...categories, newCat];
          writeStoredJson("blog_categories.json", updated);
          return NextResponse.json(newCat, { status: 201 });
        }
        if (method === "PUT") {
          const idMatch = targetPath.match(/categories\/(\d+)/);
          const id = idMatch ? parseInt(idMatch[1], 10) : 1;
          const idx = categories.findIndex((c) => c.id === id);
          if (idx !== -1) {
            const updatedItem = { ...categories[idx], ...(bodyJson || {}), updatedAt: new Date().toISOString() };
            categories[idx] = updatedItem as BlogCategoryDTO;
            writeStoredJson("blog_categories.json", categories);
            return NextResponse.json(updatedItem, { status: 200 });
          }
        }
        if (method === "DELETE") {
          const idMatch = targetPath.match(/categories\/(\d+)/);
          const id = idMatch ? parseInt(idMatch[1], 10) : 1;
          const idx = categories.findIndex((c) => c.id === id);
          if (idx !== -1) {
            categories[idx].active = false;
            writeStoredJson("blog_categories.json", categories);
          }
          return new NextResponse(null, { status: 204 });
        }
        return NextResponse.json(categories.filter((c) => c.active), { status: 200 });
      }

      if (targetPath.includes("posts/") && method === "GET") {
        const slug = targetPath.split("posts/")[1]?.split("?")[0];
        const post = posts.find((p) => p.slug === slug && p.active);
        if (post) {
          post.viewCount = (post.viewCount || 0) + 1;
          writeStoredJson("blog_posts.json", posts);
          const related = posts.filter((p) => p.categoryId === post.categoryId && p.id !== post.id && p.active && p.status === "PUBLISHED").slice(0, 3);
          const res: BlogPostDetailResponse = { post, relatedPosts: related };
          return NextResponse.json(res, { status: 200 });
        }
      }

      if (method === "POST") {
        const cat = categories.find((c) => c.id === bodyJson?.categoryId) || categories[0];
        const newPost: BlogPostDTO = {
          id: Date.now(),
          slug: String(bodyJson?.slug || `post-${Date.now()}`),
          title: String(bodyJson?.title || "Nuevo Artículo"),
          summary: String(bodyJson?.summary || ""),
          contentMarkdown: String(bodyJson?.contentMarkdown || ""),
          categoryId: Number(bodyJson?.categoryId || cat.id),
          categoryName: cat.name,
          categorySlug: cat.slug,
          coverMediaId: bodyJson?.coverMediaId ? Number(bodyJson.coverMediaId) : undefined,
          coverMediaUrl: "/media/demo-cartagena-caribe.webp",
          authorName: String(bodyJson?.authorName || "Equipo Viajes Carolina"),
          readingTimeMinutes: Number(bodyJson?.readingTimeMinutes || 5),
          tags: Array.isArray(bodyJson?.tags) ? (bodyJson?.tags as string[]) : [],
          status: String(bodyJson?.status || "PUBLISHED"),
          publishedAt: String(bodyJson?.status || "PUBLISHED") === "PUBLISHED" ? new Date().toISOString() : undefined,
          viewCount: 0,
          isFeatured: bodyJson?.isFeatured !== undefined ? Boolean(bodyJson.isFeatured) : false,
          active: bodyJson?.active !== undefined ? Boolean(bodyJson.active) : true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updated = [newPost, ...posts];
        writeStoredJson("blog_posts.json", updated);
        return NextResponse.json(newPost, { status: 201 });
      }

      if (method === "PUT") {
        const idMatch = targetPath.match(/posts\/(\d+)/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 1;
        const idx = posts.findIndex((p) => p.id === id);
        if (idx !== -1) {
          const cat = bodyJson?.categoryId ? categories.find((c) => c.id === bodyJson?.categoryId) || categories[0] : null;
          const updatedItem = {
            ...posts[idx],
            ...(bodyJson || {}),
            ...(cat ? { categoryName: cat.name, categorySlug: cat.slug } : {}),
            updatedAt: new Date().toISOString(),
          };
          posts[idx] = updatedItem as BlogPostDTO;
          writeStoredJson("blog_posts.json", posts);
          return NextResponse.json(updatedItem, { status: 200 });
        }
      }

      if (method === "DELETE") {
        const idMatch = targetPath.match(/posts\/(\d+)/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 1;
        const idx = posts.findIndex((p) => p.id === id);
        if (idx !== -1) {
          posts[idx].active = false;
          posts[idx].status = "ARCHIVED";
          writeStoredJson("blog_posts.json", posts);
        }
        return new NextResponse(null, { status: 204 });
      }

      // Public Blog List Response
      const url = new URL(req.url);
      const catSlug = url.searchParams.get("category");
      const search = url.searchParams.get("search");
      let filtered = posts.filter((p) => p.active && p.status === "PUBLISHED");
      if (catSlug && catSlug !== "all") {
        filtered = filtered.filter((p) => p.categorySlug === catSlug);
      }
      if (search && search.trim()) {
        const q = search.toLowerCase();
        filtered = filtered.filter((p) => p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)));
      }
      const featured = (!catSlug || catSlug === "all") && (!search || !search.trim()) ? posts.find((p) => p.isFeatured && p.active && p.status === "PUBLISHED") : undefined;
      const res: PublicBlogResponse = {
        items: filtered,
        categories: categories.filter((c) => c.active),
        featuredPost: featured,
        total: filtered.length,
        page: 0,
        size: 9,
        totalPages: Math.ceil(filtered.length / 9),
      };
      return NextResponse.json(res, { status: 200 });
    }

    if (targetPath.includes("claims")) {
      const claims = readStoredJson<ClaimRecordDTO[]>("claims.json", DEFAULT_CLAIM_RECORDS);
      if (method === "POST") {
        const year = new Date().getFullYear();
        const nextNum = claims.length + 1;
        const claimCode = `REC-${year}-${String(nextNum).padStart(4, "0")}`;
        const newClaim: ClaimRecordDTO = {
          id: Date.now(),
          claimCode,
          fullName: String(bodyJson?.fullName || ""),
          documentType: String(bodyJson?.documentType || "DNI"),
          documentNumber: String(bodyJson?.documentNumber || ""),
          email: String(bodyJson?.email || ""),
          phone: String(bodyJson?.phone || ""),
          address: String(bodyJson?.address || ""),
          isMinor: Boolean(bodyJson?.isMinor),
          parentName: bodyJson?.parentName ? String(bodyJson.parentName) : undefined,
          parentDocument: bodyJson?.parentDocument ? String(bodyJson.parentDocument) : undefined,
          contractedType: String(bodyJson?.contractedType || "SERVICIO"),
          claimedAmount: bodyJson?.claimedAmount ? Number(bodyJson.claimedAmount) : undefined,
          currency: String(bodyJson?.currency || "PEN"),
          description: String(bodyJson?.description || ""),
          claimType: String(bodyJson?.claimType || "RECLAMO"),
          consumerDetail: String(bodyJson?.consumerDetail || ""),
          consumerRequest: String(bodyJson?.consumerRequest || ""),
          status: "PENDING",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updated = [newClaim, ...claims];
        writeStoredJson("claims.json", updated);
        return NextResponse.json(newClaim, { status: 201 });
      }

      if (method === "PATCH") {
        const idMatch = targetPath.match(/claims\/(\d+)/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 1;
        const idx = claims.findIndex((c) => c.id === id);
        if (idx !== -1) {
          const updatedItem = {
            ...claims[idx],
            status: String(bodyJson?.status || claims[idx].status),
            responseNotes: bodyJson?.responseNotes !== undefined ? String(bodyJson.responseNotes) : claims[idx].responseNotes,
            responseAt: bodyJson?.responseNotes ? new Date().toISOString() : claims[idx].responseAt,
            updatedAt: new Date().toISOString(),
          };
          claims[idx] = updatedItem as ClaimRecordDTO;
          writeStoredJson("claims.json", claims);
          return NextResponse.json(updatedItem, { status: 200 });
        }
      }

      if (targetPath.includes("public/v1/claims/")) {
        const code = decodeURIComponent(targetPath.split("public/v1/claims/")[1]?.split("?")[0] || "");
        const found = claims.find((c) => c.claimCode === code);
        if (found) {
          return NextResponse.json(found, { status: 200 });
        }
        return NextResponse.json({ message: "Not found" }, { status: 404 });
      }

      const url = new URL(req.url);
      const statusParam = url.searchParams.get("status");
      if (statusParam && statusParam !== "ALL") {
        return NextResponse.json(claims.filter((c) => c.status === statusParam), { status: 200 });
      }
      return NextResponse.json(claims, { status: 200 });
    }

    if (targetPath.includes("explore-links")) {
      const current = readStoredJson<ContactExploreLinkDTO[]>("contact_explore_links.json", DEFAULT_CONTACT_EXPLORE_LINKS);
      return NextResponse.json(current.filter((l) => l.active), { status: 200 });
    }

    // Auth & Session (Corte 14)
    if (targetPath.includes("auth/login")) {
      const users = readStoredJson<AdminUserDTO[]>("admin_users.json", DEFAULT_ADMIN_USERS);
      const ident = String(bodyJson?.usernameOrEmail || "").trim().toLowerCase();
      const user = users.find((u) => u.username.toLowerCase() === ident || u.email.toLowerCase() === ident);

      if (!user || !user.active) {
        return NextResponse.json({ message: "Credenciales inválidas o cuenta de usuario inactiva." }, { status: 401 });
      }

      user.lastLoginAt = new Date().toISOString();
      writeStoredJson("admin_users.json", users);

      // Audit Log
      const auditLogs = readStoredJson<AuditLogDTO[]>("audit_logs.json", DEFAULT_AUDIT_LOGS);
      const newLog: AuditLogDTO = {
        id: Date.now(),
        userId: user.id,
        username: user.username,
        action: "LOGIN_SUCCESS",
        entityType: "AUTH",
        entityId: String(user.id),
        ipHash: "a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0",
        detailsJson: JSON.stringify({ username: user.username }),
        createdAt: new Date().toISOString(),
      };
      writeStoredJson("audit_logs.json", [newLog, ...auditLogs]);

      const loginRes: LoginResponse = {
        token: `jwt-mock-${user.username}-${Date.now()}`,
        tokenType: "Bearer",
        expiresInSeconds: 86400,
        user,
      };

      const res = NextResponse.json(loginRes, { status: 200 });
      res.cookies.set("vc_admin_jwt", loginRes.token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 86400,
        path: "/",
      });
      return res;
    }

    if (targetPath.includes("auth/logout")) {
      const res = NextResponse.json({ status: "LOGGED_OUT" }, { status: 200 });
      res.cookies.delete("vc_admin_jwt");
      return res;
    }

    if (targetPath.includes("auth/me")) {
      const users = readStoredJson<AdminUserDTO[]>("admin_users.json", DEFAULT_ADMIN_USERS);
      return NextResponse.json(users[0], { status: 200 });
    }

    // Users & RBAC (Corte 14)
    if (targetPath.includes("users")) {
      const users = readStoredJson<AdminUserDTO[]>("admin_users.json", DEFAULT_ADMIN_USERS);
      if (method === "POST") {
        const username = String(bodyJson?.username || "").trim().toLowerCase();
        const email = String(bodyJson?.email || "").trim().toLowerCase();
        const exists = users.some((u) => u.username.toLowerCase() === username || u.email.toLowerCase() === email);
        if (exists) {
          return NextResponse.json({ message: "El usuario o correo electrónico ya existe." }, { status: 409 });
        }

        const newUser: AdminUserDTO = {
          id: Date.now(),
          username,
          email,
          fullName: String(bodyJson?.fullName || "").trim(),
          role: String(bodyJson?.role || "CONTENT_EDITOR"),
          active: bodyJson?.active !== undefined ? Boolean(bodyJson.active) : true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const updated = [...users, newUser];
        writeStoredJson("admin_users.json", updated);

        // Audit Log
        const auditLogs = readStoredJson<AuditLogDTO[]>("audit_logs.json", DEFAULT_AUDIT_LOGS);
        const newLog: AuditLogDTO = {
          id: Date.now(),
          username: "admin",
          action: "CREATE_ADMIN_USER",
          entityType: "USER",
          entityId: String(newUser.id),
          ipHash: "a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0",
          detailsJson: JSON.stringify({ username: newUser.username, role: newUser.role }),
          createdAt: new Date().toISOString(),
        };
        writeStoredJson("audit_logs.json", [newLog, ...auditLogs]);

        return NextResponse.json(newUser, { status: 201 });
      }

      if (method === "PUT") {
        const idMatch = targetPath.match(/users\/(\d+)/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 1;
        const idx = users.findIndex((u) => u.id === id);
        if (idx !== -1) {
          const updatedItem = {
            ...users[idx],
            username: bodyJson?.username ? String(bodyJson.username).trim().toLowerCase() : users[idx].username,
            email: bodyJson?.email ? String(bodyJson.email).trim().toLowerCase() : users[idx].email,
            fullName: bodyJson?.fullName ? String(bodyJson.fullName).trim() : users[idx].fullName,
            role: bodyJson?.role ? String(bodyJson.role) : users[idx].role,
            active: bodyJson?.active !== undefined ? Boolean(bodyJson.active) : users[idx].active,
            updatedAt: new Date().toISOString(),
          };
          users[idx] = updatedItem as AdminUserDTO;
          writeStoredJson("admin_users.json", users);

          // Audit Log
          const auditLogs = readStoredJson<AuditLogDTO[]>("audit_logs.json", DEFAULT_AUDIT_LOGS);
          const newLog: AuditLogDTO = {
            id: Date.now(),
            username: "admin",
            action: "UPDATE_ADMIN_USER",
            entityType: "USER",
            entityId: String(id),
            ipHash: "a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0",
            detailsJson: JSON.stringify({ username: updatedItem.username, role: updatedItem.role }),
            createdAt: new Date().toISOString(),
          };
          writeStoredJson("audit_logs.json", [newLog, ...auditLogs]);

          return NextResponse.json(updatedItem, { status: 200 });
        }
      }

      return NextResponse.json(users, { status: 200 });
    }

    // Audit Logs (Corte 14)
    if (targetPath.includes("audit-logs")) {
      const logs = readStoredJson<AuditLogDTO[]>("audit_logs.json", DEFAULT_AUDIT_LOGS);
      const url = new URL(req.url);
      const entityType = url.searchParams.get("entityType");
      const limit = parseInt(url.searchParams.get("limit") || "50", 10);
      let list = logs;
      if (entityType && entityType !== "ALL") {
        list = list.filter((l) => l.entityType.toUpperCase() === entityType.toUpperCase());
      }
      return NextResponse.json(list.slice(0, limit), { status: 200 });
    }

    // Publishing & ISR (Corte 15)
    if (targetPath.includes("publishing/publish")) {
      const target = bodyJson?.target || "ALL";
      let tags: string[] = [];
      if (Array.isArray(bodyJson?.customTags) && bodyJson.customTags.length > 0) {
        tags = bodyJson.customTags as string[];
      } else {
        switch (String(target).toUpperCase()) {
          case "HOME":
            tags = ["home", "/"];
            break;
          case "PROMOTIONS":
            tags = ["promotions", "/promociones"];
            break;
          case "BLOG":
            tags = ["blog", "/blog"];
            break;
          case "ABOUT":
            tags = ["about", "/nosotros"];
            break;
          case "CONTACT":
            tags = ["contact", "/contacto"];
            break;
          default:
            tags = ["all", "/", "/promociones", "/blog", "/nosotros", "/contacto", "/reclamaciones"];
            break;
        }
      }

      const publishRes: PublishResponseDTO = {
        status: "SUCCESS",
        revalidatedTags: tags,
        publishedAt: new Date().toISOString(),
        triggeredBy: "admin",
        message: `Publicación completada exitosamente. Se revalidaron ${tags.length} tags/rutas en Next.js ISR.`,
      };

      writeStoredJson("last_publish_status.json", publishRes);

      // Audit Log
      const auditLogs = readStoredJson<AuditLogDTO[]>("audit_logs.json", DEFAULT_AUDIT_LOGS);
      const newLog: AuditLogDTO = {
        id: Date.now(),
        username: "admin",
        action: "PUBLISH_ON_DEMAND_ISR",
        entityType: "PUBLISHING",
        entityId: String(target),
        ipHash: "a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0",
        detailsJson: JSON.stringify({ target, tags, reason: bodyJson?.reason }),
        createdAt: new Date().toISOString(),
      };
      writeStoredJson("audit_logs.json", [newLog, ...auditLogs]);

      return NextResponse.json(publishRes, { status: 200 });
    }

    if (targetPath.includes("publishing/status")) {
      const current = readStoredJson<PublishResponseDTO>("last_publish_status.json", DEFAULT_PUBLISH_RESPONSE);
      return NextResponse.json(current, { status: 200 });
    }

    if (targetPath.includes("search")) {
      const url = new URL(req.url);
      const query = url.searchParams.get("q") || "";
      const type = (url.searchParams.get("type") || "ALL") as SearchResultType;
      const limit = parseInt(url.searchParams.get("limit") || "20", 10);
      const searchRes = getMockGlobalSearch(query, type, limit);
      return NextResponse.json(searchRes, { status: 200 });
    }

    return NextResponse.json({ status: "UP", mock: true }, { status: 200 });
  } catch (error) {
    console.error("API proxy error:", error);
    return NextResponse.json(DEFAULT_SITE_SETTINGS, { status: 200 });
  }
}

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyOrFallback(req, context.params);
}

export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyOrFallback(req, context.params);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyOrFallback(req, context.params);
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyOrFallback(req, context.params);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyOrFallback(req, context.params);
}
