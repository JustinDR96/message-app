import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Récupérer le token depuis la session
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");

  console.log(`[Middleware] Is auth page: ${isAuthPage}`);

  // Si l'utilisateur est sur une page d'auth et est déjà connecté
  if (isAuthPage && token) {
    console.log(
      "[Middleware] Redirecting authenticated user from auth page to home"
    );
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Si l'utilisateur n'est pas sur une page d'auth et n'est pas connecté
  if (!isAuthPage && !token) {
    console.log("[Middleware] Redirecting unauthenticated user to login");
    return NextResponse.redirect(new URL("/login", request.url));
  }
  console.log("[Middleware] Allowing request to continue");
  return NextResponse.next();
}

// Définir sur quels chemins le middleware doit s'exécuter
export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/conversations/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/users/:path*",
    "/",
  ],
};
