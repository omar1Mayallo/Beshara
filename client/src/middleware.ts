import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isTokenValid, getTokenFromRequest } from "@/lib/auth";

// Define protected routes
const protectedRoutes = [
  "/profile",
  "/dashboard",
  "/orders",
  "/wishlist",
  "/cart",
  "/checkout",
  "/account",
];

// Define auth routes
const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = getTokenFromRequest(request);
  const isValidToken = token ? isTokenValid(token) : false;

  // Check if current path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Check if current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If user is authenticated and trying to access auth pages, redirect to home
  if (isValidToken && isAuthRoute) {
    const redirectUrl = new URL("/", request.url);
    redirectUrl.searchParams.set("message", "already-logged-in");
    return NextResponse.redirect(redirectUrl);
  }

  // If user is not authenticated and trying to access protected pages, redirect to login
  if (!isValidToken && isProtectedRoute) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    redirectUrl.searchParams.set("message", "login-required");
    return NextResponse.redirect(redirectUrl);
  }

  // If user is authenticated, set token in response cookies for client-side access
  if (isValidToken && token) {
    const response = NextResponse.next();
    response.cookies.set("auth-token", token, {
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
