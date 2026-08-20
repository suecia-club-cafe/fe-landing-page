import { NextResponse } from "next/server";
import { site } from "@/data/site";

/**
 * Stable public URL for the menu PDF.
 *
 * Today it redirects to the versioned/static file committed in /public.
 * When Sanity is connected, this endpoint can regenerate or redirect to the
 * newest uploaded PDF while every previously printed QR remains valid.
 */
export async function GET(request: Request) {
  return NextResponse.redirect(new URL(site.menuPdfFile, request.url), 307);
}
