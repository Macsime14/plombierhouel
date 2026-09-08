import { NextResponse, type NextRequest } from "next/server";

import { dechiffrerToken, COOKIE_SESSION } from "@/lib/auth/token";

/**
 * Contrôle optimiste : on lit seulement le cookie (pas de requête base ici).
 * La vérification réelle contre la base se fait dans la DAL (`verifierSession`).
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const estLogin = pathname === "/admin/login";
  const estAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  if (!estAdmin) return NextResponse.next();

  const session = await dechiffrerToken(req.cookies.get(COOKIE_SESSION)?.value);

  if (!session && !estLogin) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }
  if (session && estLogin) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
