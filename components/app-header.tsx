"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Settings, LogOut, Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"
import ApiKeyStatus from "./api-key-status"

interface AppHeaderProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
  apiStatus: {
    isConfigured: boolean
    model?: string
  }
  onApiSetupClick?: () => void
}

export default function AppHeader({ user, apiStatus, onApiSetupClick }: AppHeaderProps) {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <header className="relative border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-10 overflow-hidden rounded-md">
              <Image src="/clair-x-logo.png" alt="Clair X Logo" fill className="object-cover" priority />
            </div>
            <span className="text-xl font-bold gradient-text">Clair-X</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          {apiStatus.isConfigured && apiStatus.model && (
            <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-500">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span>Using {apiStatus.model}</span>
            </div>
          )}

          {!apiStatus.isConfigured && onApiSetupClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={onApiSetupClick}
              className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
            >
              Configure API
            </Button>
          )}

          <Link href="/settings">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>

          {user?.image && (
            <div className="relative h-8 w-8 overflow-hidden rounded-full border border-primary/50">
              <Image src={user.image || "/placeholder.svg"} alt={user.name || "User"} fill className="object-cover" />
            </div>
          )}

          <Button variant="neon" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-16 z-50 border-b border-border bg-background/95 p-4 backdrop-blur-sm md:hidden">
          <div className="flex flex-col gap-2">
            {!apiStatus.isConfigured && (
              <div className="mb-2">
                <ApiKeyStatus onSetupClick={onApiSetupClick} />
              </div>
            )}

            <Link href="/settings">
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>

            <Button variant="neon" size="sm" onClick={handleLogout} className="mt-2">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
