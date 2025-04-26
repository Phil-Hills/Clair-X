import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// Simple API to get user data from cookies
export async function GET() {
  const cookieStore = cookies()
  const sessionCookie =
    cookieStore.get("next-auth.session-token") || cookieStore.get("__Secure-next-auth.session-token")

  if (!sessionCookie) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  // In a real app, you would decode the session token and get user data
  // For now, we'll return a mock user
  return NextResponse.json({
    name: "Demo User",
    email: "user@example.com",
    image: "/vibrant-street-market.png",
  })
}
