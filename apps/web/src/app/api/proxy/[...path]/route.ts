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
    if (targetPath === "public/v1/contact" || (targetPath.includes("contact") && targetPath.includes("public") && !targetPath.includes("inquiry"))) {
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
