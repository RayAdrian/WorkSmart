import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Define routes that require authentication
const protectedRoutes = ["/dashboard", "/checkin", "/documents", "/genai"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isLogin = pathname === "/login";
  const isApi = pathname.startsWith("/api");
  const isStatic =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/public");

  // Read JWT from cookies
  const token = request.cookies.get("auth")?.value;
  let isAuthenticated = false;
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  // Redirect unauthenticated users from protected routes
  if (isProtected && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from /login
  if (isLogin && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Allow API and static files
  if (isApi || isStatic) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Specify the matcher for middleware
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/checkin/:path*",
    "/documents/:path*",
    "/genai/:path*",
    "/login",
  ],
};
