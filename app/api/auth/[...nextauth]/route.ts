import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Add this to ensure the API route runs in Node.js runtime, not Edge
export const runtime = "nodejs"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
