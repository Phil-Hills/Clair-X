// Create a middleware file to handle authentication
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the user is authenticated by looking for the session token
  const isAuthenticated =
    request.cookies.has("next-auth.session-token") || request.cookies.has("__Secure-next-auth.session-token")

  // If the user is not authenticated and trying to access a protected route
  if (!isAuthenticated && pathname !== "/login") {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // If the user is authenticated and trying to access login
  if (isAuthenticated && pathname === "/login") {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.mp4|.*\\.webm).*)"],
}
