import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_SITE_SETTINGS,
  MOCK_OFFICE_LOCATION,
  MOCK_PROMOTIONS,
  MOCK_BLOG_POSTS,
  updateMockSiteSettings,
  updateMockOfficeLocation,
} from "@vc/api-client";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://localhost:8080";

async function proxyOrFallback(
  req: NextRequest,
  params: Promise<{ path: string[] }>
) {
  const { path } = await params;
  const targetPath = path.join("/");
  const targetUrl = `${BACKEND_URL}/api/${targetPath}`;
  const method = req.method;

  // Try real Quarkus backend first
  try {
    const headers = new Headers();
    req.headers.forEach((val, key) => {
      if (!["host", "connection", "content-length"].includes(key.toLowerCase())) {
        headers.set(key, val);
      }
    });

    const body = ["POST", "PUT", "PATCH"].includes(method)
      ? await req.text()
      : undefined;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }
  } catch {
    // Backend offline / connection refused -> Fallback to mock store
  }

  // Graceful Offline / Dev Fallback
  if (targetPath.includes("settings") || targetPath.includes("site")) {
    if (method === "PUT" || method === "POST") {
      try {
        const body = await req.json();
        const updated = updateMockSiteSettings(body);
        return NextResponse.json(updated, { status: 200 });
      } catch {
        return NextResponse.json(MOCK_SITE_SETTINGS, { status: 200 });
      }
    }
    return NextResponse.json(MOCK_SITE_SETTINGS, { status: 200 });
  }

  if (targetPath.includes("office")) {
    if (method === "PUT" || method === "POST") {
      try {
        const body = await req.json();
        const updated = updateMockOfficeLocation(body);
        return NextResponse.json(updated, { status: 200 });
      } catch {
        return NextResponse.json(MOCK_OFFICE_LOCATION, { status: 200 });
      }
    }
    return NextResponse.json(MOCK_OFFICE_LOCATION, { status: 200 });
  }

  if (targetPath.includes("promotions")) {
    return NextResponse.json(MOCK_PROMOTIONS, { status: 200 });
  }

  if (targetPath.includes("blog")) {
    return NextResponse.json(MOCK_BLOG_POSTS, { status: 200 });
  }

  return NextResponse.json({ status: "UP", mock: true }, { status: 200 });
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
