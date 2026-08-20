import { NextRequest } from "next/server";
import { handleProxyRequest } from "@vc/next-proxy";

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxyRequest(req, context.params, "web");
}

export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxyRequest(req, context.params, "web");
}

export async function PUT(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxyRequest(req, context.params, "web");
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxyRequest(req, context.params, "web");
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxyRequest(req, context.params, "web");
}
