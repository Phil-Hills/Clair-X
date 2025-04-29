"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Home, Video, ImageIcon, Key } from "lucide-react"
import ImageGenerator from "@/components/image-generator"
import VideoGenerator from "@/components/video-generator"
import HomeDashboard from "@/components/home-dashboard"
import { ThemeProvider } from "@/components/theme-provider"
import ApiKeyInput from "@/components/api-key-input"
import { useToast } from "@/components/ui/use-toast"
import AppHeader from "@/components/app-header"

export default function AppPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<{
    name?: string | null
    email?: string | null
    image?: string | null
  } | null>(null)
  const [activeSection, setActiveSection] = useState<"home" | "image" | "video" | "api-setup">("home")
  const [isLoading, setIsLoading] = useState(true)
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false)
  const [apiCheckError, setApiCheckError] = useState<string | null>(null)
  const [apiModel, setApiModel] = useState<string | null>(null)

  // Check if API key is configured
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        // Check if there's a client-side API key
        const clientApiKey = localStorage.getItem("GEMINI_API_KEY")

        // If there's a client-side API key, we'll validate it
        if (clientApiKey) {
          try {
            const validationResponse = await fetch("/api/validate-api-key", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ apiKey: clientApiKey }),
            })

            const validationData = await validationResponse.json()

            if (validationData.valid) {
              setApiKeyConfigured(true)
              setApiModel(validationData.model || "Gemini")
              setApiCheckError(null)
              return
            } else {
              // If client-side API key is invalid, remove it
              localStorage.removeItem("GEMINI_API_KEY")
              setApiCheckError(validationData.reason || "Client-side API key is invalid")

              toast({
                title: "Invalid API Key",
                description: validationData.reason || "Your saved API key is invalid. Please provide a new one.",
                variant: "destructive",
                duration: 6000,
              })
            }
          } catch (error) {
            console.error("Error validating client-side API key:", error)
            // Continue to check server-side API key
          }
        }

        // Check server-side API key
        const response = await fetch("/api/check-api-status")
        if (response.ok) {
          const data = await response.json()
          setApiKeyConfigured(data.geminiAvailable)

          if (data.geminiAvailable) {
            setApiModel(data.model || "Gemini")
            setApiCheckError(null)
          } else {
            setApiCheckError(data.reason || "API key not configured or invalid")

            // Don't automatically navigate to API setup, just show a toast
            toast({
              title: "API Key Issue",
              description: data.details || "Please configure a valid Gemini API key for full functionality",
              variant: "destructive",
              duration: 6000,
            })
          }
        } else {
          setApiKeyConfigured(false)
          setApiCheckError("Error checking API status")
        }
      } catch (error) {
        console.error("Error checking API status:", error)
        setApiKeyConfigured(false)
        setApiCheckError("Error connecting to API status endpoint")
      }
    }

    checkApiStatus()
  }, [toast])

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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="neon-spinner"></div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader
          user={user}
          apiStatus={{
            isConfigured: apiKeyConfigured,
            model: apiModel || undefined,
          }}
          onApiSetupClick={() => setActiveSection("api-setup")}
        />

        <div className="flex flex-1">
          {/* Sidebar */}
          <aside className="hidden w-[220px] border-r border-border bg-card md:block">
            <nav className="flex flex-col gap-1 p-3">
              <button
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-foreground hover:bg-secondary ${
                  activeSection === "home" ? "bg-secondary" : ""
                }`}
                onClick={() => setActiveSection("home")}
              >
                <Home size={20} className={activeSection === "home" ? "text-primary" : ""} />
                <span className={activeSection === "home" ? "font-medium" : ""}>Home</span>
              </button>

              <div className="mt-4 px-3 text-sm font-medium text-primary">Video AI</div>
              <button
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-foreground hover:bg-secondary ${
                  activeSection === "video" ? "bg-secondary" : ""
                }`}
                onClick={() => setActiveSection("video")}
              >
                <Video size={20} className={activeSection === "video" ? "text-primary" : ""} />
                <span className={activeSection === "video" ? "font-medium" : ""}>Human Like</span>
              </button>

              <div className="mt-4 px-3 text-sm font-medium text-primary">Image AI</div>
              <button
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-foreground hover:bg-secondary ${
                  activeSection === "image" ? "bg-secondary" : ""
                }`}
                onClick={() => setActiveSection("image")}
              >
                <ImageIcon size={20} className={activeSection === "image" ? "text-primary" : ""} />
                <span className={activeSection === "image" ? "font-medium" : ""}>AI Image Generator</span>
              </button>

              <button
                className={`mt-4 flex items-center gap-3 rounded-md px-3 py-2 text-foreground hover:bg-secondary ${
                  activeSection === "api-setup" ? "bg-secondary" : ""
                }`}
                onClick={() => setActiveSection("api-setup")}
              >
                <Key size={20} className={activeSection === "api-setup" ? "text-primary" : ""} />
                <span className={activeSection === "api-setup" ? "font-medium" : ""}>API Setup</span>
              </button>

              <div className="mt-4">
                <div className={`px-3 py-2 rounded-md ${apiKeyConfigured ? "bg-green-500/10" : "bg-yellow-500/10"}`}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${apiKeyConfigured ? "bg-green-500" : "bg-yellow-500"}`}
                    ></div>
                    <span className={`text-xs ${apiKeyConfigured ? "text-green-500" : "text-yellow-500"}`}>
                      {apiKeyConfigured ? `API: ${apiModel || "Configured"}` : "API Key Required"}
                    </span>
                  </div>
                </div>
              </div>
            </nav>
          </aside>

          {/* Mobile Navigation */}
          <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-border bg-card p-2 md:hidden">
            <div className="flex items-center justify-around">
              <button
                className={`flex flex-col items-center gap-1 rounded-md p-2 ${
                  activeSection === "home" ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setActiveSection("home")}
              >
                <Home size={20} />
                <span className="text-xs">Home</span>
              </button>

              <button
                className={`flex flex-col items-center gap-1 rounded-md p-2 ${
                  activeSection === "image" ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setActiveSection("image")}
              >
                <ImageIcon size={20} />
                <span className="text-xs">Images</span>
              </button>

              <button
                className={`flex flex-col items-center gap-1 rounded-md p-2 ${
                  activeSection === "video" ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setActiveSection("video")}
              >
                <Video size={20} />
                <span className="text-xs">Videos</span>
              </button>

              <button
                className={`flex flex-col items-center gap-1 rounded-md p-2 ${
                  activeSection === "api-setup" ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setActiveSection("api-setup")}
              >
                <Key size={20} />
                <span className="text-xs">API</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 pb-16 md:pb-0">
            {activeSection === "home" && (
              <HomeDashboard
                onNavigate={setActiveSection}
                apiStatus={{
                  isConfigured: apiKeyConfigured,
                  model: apiModel || undefined,
                }}
              />
            )}

            {activeSection === "api-setup" && (
              <div className="flex flex-col items-center justify-center h-full p-4">
                {apiCheckError && (
                  <div className="mb-4 w-full max-w-md rounded-md border border-destructive/30 bg-destructive/10 p-3 text-destructive">
                    <p className="font-medium">API Key Error:</p>
                    <p className="text-sm">{apiCheckError}</p>
                  </div>
                )}
                <ApiKeyInput />
              </div>
            )}

            {activeSection === "image" && <ImageGenerator user={user} />}

            {activeSection === "video" && <VideoGenerator />}
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
