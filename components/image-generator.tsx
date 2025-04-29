"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageIcon, Zap, Download, Trash2, AlertCircle, Info, Settings } from "lucide-react"
import type { AspectRatio, GeneratedImage, ImageStyle } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/ui/loading-button"
import { ChatBubble } from "@/components/ui/chat-bubble"
import { generateImages } from "@/lib/image-service"
import Link from "next/link"
import ApiKeyManagement from "./api-key-management"
// Add the import for ApiKeyStatus
import ApiKeyStatus from "./api-key-status"

interface ImageGeneratorProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
}

interface ChatMessage {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: string
  isNew: boolean
}

export default function ImageGenerator({ user }: ImageGeneratorProps) {
  const { toast } = useToast()
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState<ImageStyle>("auto")
  const [numOutputs, setNumOutputs] = useState(1)
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [history, setHistory] = useState<GeneratedImage[]>([])
  const [activeTab, setActiveTab] = useState("generator")
  const [error, setError] = useState<string | null>(null)
  const [apiStatus, setApiStatus] = useState<{
    isConfigured: boolean
    model?: string
  }>({ isConfigured: false })
  const [showApiKeySetup, setShowApiKeySetup] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content: "Hello! I'm Clair. How can I help you create images today?",
      sender: "ai",
      timestamp: new Date().toLocaleTimeString(),
      isNew: false,
    },
  ])

  // Check if Gemini API key is configured
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch("/api/check-api-status")
        if (response.ok) {
          const data = await response.json()
          setApiStatus({
            isConfigured: data.geminiAvailable,
            model: data.model,
          })

          // If API is not configured, show a toast notification
          if (!data.geminiAvailable) {
            toast({
              title: "API Key Not Configured",
              description: "Gemini API key is not configured. Using placeholder images instead.",
              duration: 5000,
            })
          }
        } else {
          setApiStatus({ isConfigured: false })
        }
      } catch (error) {
        console.error("Error checking API status:", error)
        setApiStatus({ isConfigured: false })
      }
    }

    checkApiStatus()
  }, [toast])

  const handleApiStatusChange = (status: { isConfigured: boolean; model?: string }) => {
    setApiStatus(status)
    setShowApiKeySetup(false)

    if (status.isConfigured) {
      toast({
        title: "API Key Configured",
        description: `Gemini API is now configured and ready to use with model: ${status.model || "Gemini"}`,
      })
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setError(null)

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: prompt,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
      isNew: false,
    }
    setChatMessages((prev) => [...prev, userMessage])

    try {
      // Call the image generation service
      const images = await generateImages({
        prompt,
        style,
        numberOfOutputs: numOutputs,
        aspectRatio,
      })

      console.log("Generated images:", images)

      if (images && images.length > 0) {
        setGeneratedImages(images)
        setHistory((prev) => [...images, ...prev])

        // Check if we're using fallback images
        const isFallback = images.some((img) => img.model === "fallback")

        // Add AI response to chat
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: isFallback
            ? `I've created ${images.length} placeholder image${images.length > 1 ? "s" : ""} based on your prompt. Note: Using fallback mode as the API key is invalid or not configured.`
            : `I've created ${images.length} image${images.length > 1 ? "s" : ""} based on your prompt.`,
          sender: "ai",
          timestamp: new Date().toLocaleTimeString(),
          isNew: true,
        }
        setChatMessages((prev) => [...prev, aiMessage])

        // If we're using fallback images due to API key issues, show a toast
        if (isFallback) {
          // Check if there was a stored API key that's now invalid
          const hadStoredKey = localStorage.getItem("GEMINI_API_KEY")
          if (hadStoredKey) {
            // The key was removed by the image service because it was invalid
            toast({
              title: "API Key Issue",
              description:
                "Your API key appears to be invalid and has been removed. Please configure a valid API key in settings.",
              variant: "destructive",
              duration: 8000,
            })
            // Update API status
            setApiStatus({ isConfigured: false })
          } else {
            toast({
              title: "Using Placeholder Images",
              description: "No valid API key configured. Using placeholder images instead.",
              duration: 5000,
            })
          }
        } else {
          toast({
            title: "Images generated successfully",
            description: `Created ${images.length} image${images.length > 1 ? "s" : ""} based on your prompt.`,
          })
        }
      } else {
        throw new Error("No images were generated")
      }
    } catch (error) {
      console.error("Error generating images:", error)
      setError(`Failed to generate images: ${error instanceof Error ? error.message : String(error)}`)

      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I couldn't generate those images. Please try again.",
        sender: "ai",
        timestamp: new Date().toLocaleTimeString(),
        isNew: true,
      }
      setChatMessages((prev) => [...prev, errorMessage])

      toast({
        title: "Error generating images",
        description: "There was a problem generating your images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)

      // After 3 seconds, mark all messages as not new
      setTimeout(() => {
        setChatMessages((prev) => prev.map((msg) => ({ ...msg, isNew: false })))
      }, 3000)
    }
  }

  const handleDeleteImage = (index: number) => {
    setHistory((prev) => prev.filter((_, i) => i !== index))
    toast({
      title: "Image deleted",
      description: "The image has been removed from your history.",
    })
  }

  const handleDownload = (imageUrl: string, index: number) => {
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `clair-x-image-${index}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)

        toast({
          title: "Image downloaded",
          description: "The image has been saved to your device.",
        })
      })
      .catch((error) => {
        console.error("Error downloading image:", error)
        toast({
          title: "Download failed",
          description: "There was a problem downloading the image.",
          variant: "destructive",
        })
      })
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="neon-spinner"></div>
      </div>
    )
  }

  // Get the display name for the model
  const getModelDisplayName = () => {
    if (!apiStatus.isConfigured || !apiStatus.model) {
      return "Placeholder Images"
    }

    switch (apiStatus.model) {
      case "gemini-1.5-flash":
        return "Gemini 1.5 Flash"
      case "gemini-1.5-pro":
        return "Gemini 1.5 Pro"
      case "gemini-pro":
        return "Gemini Pro"
      default:
        return apiStatus.model
    }
  }

  return (
    <div className="flex flex-1">
      <main className="flex flex-1 bg-background p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col">
          <TabsList className="mb-4 self-center bg-secondary">
            <TabsTrigger
              value="generator"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Generator
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              History
            </TabsTrigger>
            <TabsTrigger
              value="chat"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Chat
            </TabsTrigger>
            {showApiKeySetup && (
              <TabsTrigger
                value="api-setup"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                API Setup
              </TabsTrigger>
            )}
          </TabsList>

          {!apiStatus.isConfigured && !showApiKeySetup && (
            <div className="mb-4 flex items-center justify-between gap-2 rounded-md border border-yellow-500/30 bg-yellow-500/10 p-3 text-yellow-500">
              <div className="flex items-start gap-2">
                <Info size={16} className="flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p>Gemini API key not configured. Using placeholder images instead.</p>
                  <p className="text-xs mt-1">Configure your API key to enable AI-powered image generation.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
                  onClick={() => setShowApiKeySetup(true)}
                >
                  Configure API Key
                </Button>
                <Link href="/settings">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
                  >
                    <Settings size={14} />
                    Settings
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {!apiStatus.isConfigured && !showApiKeySetup && (
            <div className="mb-4">
              <ApiKeyStatus onSetupClick={() => setShowApiKeySetup(true)} />
            </div>
          )}

          {showApiKeySetup && (
            <TabsContent value="api-setup" className="flex-1">
              <ApiKeyManagement onStatusChange={handleApiStatusChange} />
            </TabsContent>
          )}

          <TabsContent value="generator" className="flex flex-1 flex-col md:flex-row">
            {/* Left Panel - Controls */}
            <div className="mb-4 w-full rounded-lg bg-card p-4 shadow-md md:mb-0 md:w-[380px] md:mr-4">
              <div className="mb-6">
                <h2 className="mb-2 text-sm font-medium text-foreground">Model</h2>
                <div className="rounded-md border border-border p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium gradient-text">{getModelDisplayName()}</span>
                    <span
                      className={`rounded px-2 py-0.5 text-xs ${
                        apiStatus.isConfigured ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500"
                      }`}
                    >
                      {apiStatus.isConfigured ? "Active" : "Fallback Mode"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {apiStatus.isConfigured
                      ? "Google's AI model for image description generation"
                      : "Using placeholder images until API key is configured"}
                  </p>

                  {!apiStatus.isConfigured && (
                    <Button
                      variant="link"
                      size="sm"
                      className="mt-2 h-auto p-0 text-primary"
                      onClick={() => setShowApiKeySetup(true)}
                    >
                      Configure API Key
                    </Button>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="mb-2 text-sm font-medium text-foreground">Prompt</h2>
                <Textarea
                  placeholder="Enter your prompt..."
                  className="min-h-[100px] resize-none bg-secondary border-secondary"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Be specific and detailed about what you want to see in the image.
                </p>
              </div>

              <div className="mb-6">
                <h2 className="mb-2 text-sm font-medium text-foreground">Style</h2>
                <Select value={style} onValueChange={(value) => setStyle(value as ImageStyle)}>
                  <SelectTrigger className="bg-secondary border-secondary">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="realistic">Realistic</SelectItem>
                    <SelectItem value="cartoon">Cartoon</SelectItem>
                    <SelectItem value="artistic">Artistic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-6">
                <h2 className="mb-2 text-sm font-medium text-foreground">Number of Outputs</h2>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <Button
                      key={num}
                      variant={num === numOutputs ? "default" : "outline"}
                      className={num === numOutputs ? "" : "border-border bg-secondary text-foreground"}
                      size="sm"
                      onClick={() => setNumOutputs(num)}
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="mb-2 text-sm font-medium text-foreground">Aspect Ratio</h2>
                <div className="flex gap-2">
                  {[
                    { label: "1:1", value: "1:1" },
                    { label: "3:2", value: "3:2" },
                    { label: "4:3", value: "4:3" },
                    { label: "16:9", value: "16:9" },
                    { label: "9:16", value: "9:16" },
                  ].map((ratio) => (
                    <Button
                      key={ratio.value}
                      variant="outline"
                      className={`h-12 w-12 p-0 ${
                        aspectRatio === ratio.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-secondary text-foreground border-border"
                      }`}
                      size="sm"
                      onClick={() => setAspectRatio(ratio.value as AspectRatio)}
                    >
                      {ratio.label}
                    </Button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-md bg-destructive/20 p-3 text-destructive-foreground">
                  <AlertCircle size={16} />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <LoadingButton
                className="mt-4 w-full gap-2"
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                isLoading={isGenerating}
                loadingText="Generating images..."
              >
                <Zap size={16} />
                Generate Image
              </LoadingButton>
            </div>

            {/* Right Panel - Preview */}
            <div className="flex flex-1 flex-col rounded-lg bg-card p-4 shadow-md">
              {isGenerating ? (
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  {Array(numOutputs)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex flex-col gap-2">
                        <Skeleton className="h-48 w-full rounded-md bg-secondary" />
                        <Skeleton className="h-4 w-3/4 bg-secondary" />
                      </div>
                    ))}
                </div>
              ) : generatedImages.length > 0 ? (
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  {generatedImages.map((image, index) => (
                    <div key={index} className="group relative overflow-hidden rounded-md">
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={`Generated image ${index + 1}`}
                        width={400}
                        height={400}
                        className="h-auto w-full rounded-md object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 flex justify-between bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-white hover:bg-white/20"
                          onClick={() => handleDownload(image.url, index)}
                        >
                          <Download size={16} />
                        </Button>
                      </div>
                      {image.description && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          <p className="line-clamp-2">{image.description}</p>
                          {image.model && <p className="mt-1 text-xs opacity-70">Generated with: {image.model}</p>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-md border border-border bg-secondary">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-foreground">No Generation History</h3>
                  <p className="max-w-md text-sm text-muted-foreground">
                    Enter a prompt and click "Generate Image" to start creating! Your artwork will be displayed here.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="flex-1">
            <div className="rounded-lg bg-card p-6 shadow-md">
              <h2 className="mb-6 text-xl font-semibold gradient-text">Generation History</h2>
              {history.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {history.map((image, index) => (
                    <div key={index} className="group relative overflow-hidden rounded-md bg-secondary/20 p-3">
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={`History image ${index + 1}`}
                        width={300}
                        height={300}
                        className="h-auto w-full rounded-md object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 flex justify-between bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-white hover:bg-white/20"
                          onClick={() => handleDownload(image.url, index)}
                        >
                          <Download size={16} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-white hover:bg-white/20"
                          onClick={() => handleDeleteImage(index)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                      <div className="mt-2 text-sm text-foreground">
                        <p className="line-clamp-1">{image.prompt}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {image.style} • {image.aspectRatio}
                        </p>
                        {image.model && <p className="mt-1 text-xs opacity-70">Generated with: {image.model}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ImageIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-medium text-foreground">No Images Yet</h3>
                  <p className="text-muted-foreground">Generate some images to see your history here.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="chat" className="flex-1">
            <div className="rounded-lg bg-card p-6 shadow-md h-full flex flex-col">
              <h2 className="mb-6 text-xl font-semibold gradient-text">Chat with Clair</h2>

              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {chatMessages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    message={message.content}
                    sender={message.sender}
                    timestamp={message.timestamp}
                    isNew={message.isNew}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <Textarea
                  placeholder="Ask Clair about image generation..."
                  className="resize-none bg-secondary border-secondary"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleGenerate()
                    }
                  }}
                />
                <LoadingButton
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleGenerate}
                  disabled={!prompt.trim()}
                  isLoading={isGenerating}
                >
                  <Zap size={16} />
                </LoadingButton>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
