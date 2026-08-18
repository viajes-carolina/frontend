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
  getMockMediaPage,
  updateMockMediaFocalPoint,
  MOCK_BLOG_POSTS,
  SiteSettingsDTO,
  OfficeLocationDTO,
  HomeHeroDTO,
  TravelIntentionDTO,
  PromotionDTO,
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
      return NextResponse.json(MOCK_BLOG_POSTS, { status: 200 });
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
