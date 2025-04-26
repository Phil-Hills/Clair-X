"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Home, Video, ImageIcon, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import ImageGenerator from "@/components/image-generator"
import VideoGenerator from "@/components/video-generator"

export default function AppPage() {
  const router = useRouter()
  const [user, setUser] = useState<{
    name?: string | null
    email?: string | null
    image?: string | null
  } | null>(null)
  const [activeSection, setActiveSection] = useState<"image" | "video">("image")
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user")
        if (res.ok) {
          const userData = await res.json()
          setUser(userData)
        } else {
          // If we can't get user data, redirect to login
          router.push("/login")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Clair X Logo" width={32} height={32} className="rounded-md object-cover" />
          <h1 className="text-lg font-semibold">Clair X</h1>
        </div>
        <div className="flex items-center gap-3">
          {user?.image && (
            <Image
              src={user.image || "/placeholder.svg"}
              alt={user.name || "User"}
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-[220px] border-r bg-white">
          <nav className="flex flex-col gap-1 p-3">
            <div className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100">
              <Home size={20} />
              <span>Home</span>
            </div>

            <div className="mt-4 px-3 text-sm font-medium text-purple-600">Video AI</div>
            <button
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 ${
                activeSection === "video" ? "bg-gray-100" : ""
              }`}
              onClick={() => setActiveSection("video")}
            >
              <Video size={20} className={activeSection === "video" ? "text-purple-600" : ""} />
              <span className={activeSection === "video" ? "font-medium" : ""}>Human Like</span>
            </button>

            <div className="mt-4 px-3 text-sm font-medium text-purple-600">Image AI</div>
            <button
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 ${
                activeSection === "image" ? "bg-gray-100" : ""
              }`}
              onClick={() => setActiveSection("image")}
            >
              <ImageIcon size={20} className={activeSection === "image" ? "text-purple-600" : ""} />
              <span className={activeSection === "image" ? "font-medium" : ""}>AI Image Generator</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        {activeSection === "image" ? <ImageGenerator user={user} /> : <VideoGenerator />}
      </div>
    </div>
  )
}
