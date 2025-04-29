"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { LoadingButton } from "@/components/ui/loading-button"
import { FaGoogle } from "react-icons/fa"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setIsLoading(true)

    try {
      // In a real app, this would redirect to Google OAuth
      // For now, we'll simulate a successful login by setting a cookie
      document.cookie = "next-auth.session-token=mock-session-token; path=/; max-age=86400"

      // Redirect to home page
      router.push("/")
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-lg">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-6 relative h-32 w-32">
            <Image src="/clair-x-logo.png" alt="Clair X Logo" fill className="object-cover rounded-xl" priority />
          </div>
          <h1 className="text-3xl font-bold gradient-text">Clair-X</h1>
          <p className="mt-2 text-center text-muted-foreground">Advanced AI Image & Video Generation</p>
        </div>

        <div className="space-y-4">
          <LoadingButton
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-2 bg-secondary text-foreground hover:bg-secondary/80"
            variant="outline"
            isLoading={isLoading}
            loadingText="Signing in..."
          >
            {!isLoading && <FaGoogle className="h-4 w-4" />}
            Sign in with Google
          </LoadingButton>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue as guest</span>
            </div>
          </div>

          <LoadingButton onClick={() => router.push("/")} className="w-full" variant="neon">
            Try Demo
          </LoadingButton>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
