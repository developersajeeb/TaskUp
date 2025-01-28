import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Allow public access to specific routes
  const publicRoutes = ["/login", "/signup", "/forgot-password"];
  if (publicRoutes.includes(pathname)) {
    if (token) {
      // Redirect authenticated users away from public routes to a protected page
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Allow access to Next.js internal routes, APIs, and static assets
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.startsWith("/static")) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login page
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Allow access to other routes for authenticated users
  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
