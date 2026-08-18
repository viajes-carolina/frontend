import { NextRequest, NextResponse } from "next/server";
import {
  getMockSiteSettings,
  updateMockSiteSettings,
  getMockOfficeLocation,
  updateMockOfficeLocation,
  MOCK_PROMOTIONS,
  MOCK_BLOG_POSTS,
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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 600);

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
    if (method === "PUT" || method === "POST") {
      const updated = updateMockSiteSettings(bodyJson || {});
      return NextResponse.json(updated, { status: 200 });
    }
    return NextResponse.json(getMockSiteSettings(), { status: 200 });
  }

  if (targetPath.includes("office")) {
    if (method === "PUT" || method === "POST") {
      const updated = updateMockOfficeLocation(bodyJson || {});
      return NextResponse.json(updated, { status: 200 });
    }
    return NextResponse.json(getMockOfficeLocation(), { status: 200 });
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
