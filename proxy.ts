import { NextResponse, type NextRequest } from "next/server";
import { decrypt, SESSION_COOKIE } from "@/lib/session";

/**
 * Next.js 16 renamed Middleware to Proxy. It runs on the Node.js runtime and
 * the filename/export must be `proxy`.
 *
 * This is an *optimistic* gate only: it reads the signed cookie and redirects,
 * with no database call, because it runs on every request including prefetches.
 * Real authorisation lives in the DAL (`lib/dal.ts`), close to the data.
 */

const PROTECTED_PREFIXES = ["/dashboard", "/profile", "/bookmarks", "/submit", "/admin"];
const AUTH_PAGES = ["/login", "/register", "/forgot-password", "/reset-password"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await decrypt(request.cookies.get(SESSION_COOKIE)?.value);
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const isAuthPage = AUTH_PAGES.includes(pathname);

  // Unauthenticated user reaching for a gated page → login, remembering where
  // they were headed so we can return them after sign-in.
  if (isProtected && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin area is admin-only.
  if (pathname.startsWith("/admin") && session?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard?denied=admin", request.url));
  }

  // A session whose user no longer exists verifies here but fails in the DAL,
  // which would bounce /login → /dashboard → /login forever. The DAL flags
  // that case; clear the dead cookie and let the login page render.
  if (isAuthPage && request.nextUrl.searchParams.get("session") === "expired") {
    const response = NextResponse.next();
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  // Already signed in? The login/register pages have nothing to offer.
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Skip API routes, static assets and image optimisation.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
