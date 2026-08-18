import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_OFFICE_LOCATION,
  MOCK_PROMOTIONS,
  MOCK_BLOG_POSTS,
  SiteSettingsDTO,
  OfficeLocationDTO,
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

    if (targetPath.includes("promotions")) {
      return NextResponse.json(MOCK_PROMOTIONS, { status: 200 });
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

export async function DELETE(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyOrFallback(req, context.params);
}
