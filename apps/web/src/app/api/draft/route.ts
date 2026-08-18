import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";

const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET || "vc-secret-isr-key-2026";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const redirectPath = searchParams.get("path") || "/";

  if (secret !== REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Secreto de borrador no válido." }, { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  return NextResponse.redirect(new URL(redirectPath, req.url));
}
