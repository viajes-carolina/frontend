import { NextRequest } from "next/server";
import { servePlaceholderMedia } from "@vc/next-proxy";

export async function GET(req: NextRequest, context: { params: Promise<{ filename: string }> }) {
  return servePlaceholderMedia(req, context.params, "admin");
}
