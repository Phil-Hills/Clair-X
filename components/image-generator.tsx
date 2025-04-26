"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageIcon, Zap, Download, Trash2, AlertCircle } from "lucide-react"
import type { AspectRatio, GeneratedImage, ImageStyle } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

interface ImageGeneratorProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
}

export default function ImageGenerator({ user }: ImageGeneratorProps) {
  const { toast } = useToast()
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState<ImageStyle>("auto")
  const [numOutputs, setNumOutputs] = useState(1) // Default to 1 for Gemini
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [history, setHistory] = useState<GeneratedImage[]>([])
  const [activeTab, setActiveTab] = useState("generator")
  const [error, setError] = useState<string | null>(null)

  const [router, setRouter] = useState(null) // Removing useRouter import and usage

  // Fetch user data on component mount
  useEffect(() => {
    // Removing user data fetching logic as user is now a prop
  }, [])

  const handleLogout = async () => {
    // Removing handleLogout function
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          style,
          numberOfOutputs: numOutputs,
          aspectRatio,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate images")
      }

      const data = await response.json()
      setGeneratedImages(data.images)
      setHistory((prev) => [...data.images, ...prev])

      toast({
        title: "Images generated successfully",
        description: `Created ${data.images.length} image${data.images.length > 1 ? "s" : ""} based on your prompt.`,
      })
    } catch (error) {
      console.error("Error generating images:", error)
      setError("Failed to generate images. Please try again.")

      toast({
        title: "Error generating images",
        description: "There was a problem generating your images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
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
    // For real APIs that return URLs, we need to fetch the image first
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
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    )
  }

  return (
    <div className="flex flex-1">
      {/* Main Content */}
      <main className="flex flex-1 bg-gray-50 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col">
          <TabsList className="mb-4 self-center">
            <TabsTrigger value="generator">Generator</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="flex flex-1">
            {/* Left Panel - Controls */}
            <div className="w-[380px] overflow-y-auto rounded-lg bg-white p-4 shadow-sm">
              <div className="mb-6">
                <h2 className="mb-2 text-sm font-medium text-gray-700">Model</h2>
                <div className="rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Gemini Pro Vision</span>
                    <span className="rounded bg-purple-100 px-2 py-0.5 text-xs text-purple-600">Recommended</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">Google's advanced AI model for image generation</p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="mb-2 text-sm font-medium text-gray-700">Prompt</h2>
                <Textarea
                  placeholder="Enter your prompt..."
                  className="min-h-[100px] resize-none"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Be specific and detailed about what you want to see in the image.
                </p>
              </div>

              <div className="mb-6">
                <h2 className="mb-2 text-sm font-medium text-gray-700">Style</h2>
                <Select value={style} onValueChange={(value) => setStyle(value as ImageStyle)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="realistic">Realistic</SelectItem>
                    <SelectItem value="cartoon">Cartoon</SelectItem>
                    <SelectItem value="artistic">Artistic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-6">
                <h2 className="mb-2 text-sm font-medium text-gray-700">Number of Outputs</h2>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <Button
                      key={num}
                      variant={num === numOutputs ? "default" : "outline"}
                      className={num === numOutputs ? "bg-purple-600 hover:bg-purple-700" : ""}
                      size="sm"
                      onClick={() => setNumOutputs(num)}
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="mb-2 text-sm font-medium text-gray-700">Aspect Ratio</h2>
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
                      className={`h-12 w-12 p-0 ${aspectRatio === ratio.value ? "bg-purple-600 text-white hover:bg-purple-700" : "bg-gray-200 hover:bg-gray-300"}`}
                      size="sm"
                      onClick={() => setAspectRatio(ratio.value as AspectRatio)}
                    >
                      {ratio.label}
                    </Button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-md bg-red-50 p-3 text-red-700">
                  <AlertCircle size={16} />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <Button
                className="mt-4 w-full gap-2 bg-purple-600 text-white hover:bg-purple-700"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
              >
                <Zap size={16} />
                {isGenerating ? "Generating..." : "Generate Image"}
              </Button>
            </div>

            {/* Right Panel - Preview */}
            <div className="ml-4 flex flex-1 rounded-lg bg-white p-4 shadow-sm">
              {isGenerating ? (
                <div className="grid w-full grid-cols-2 gap-4">
                  {Array(numOutputs)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex flex-col gap-2">
                        <Skeleton className="h-48 w-full rounded-md" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    ))}
                </div>
              ) : generatedImages.length > 0 ? (
                <div className="grid w-full grid-cols-2 gap-4">
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
                          className="h-8 w-8 text-white"
                          onClick={() => handleDownload(image.url, index)}
                        >
                          <Download size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-md border border-gray-200 bg-gray-50">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">No Generation History</h3>
                  <p className="max-w-md text-sm text-gray-500">
                    Enter a prompt and click "Generate Image" to start creating! Your artwork will be displayed here.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="flex-1">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold">Generation History</h2>
              {history.length > 0 ? (
                <div className="grid grid-cols-3 gap-6">
                  {history.map((image, index) => (
                    <div key={index} className="group relative overflow-hidden rounded-md">
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
                          className="h-8 w-8 text-white"
                          onClick={() => handleDownload(image.url, index)}
                        >
                          <Download size={16} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-white"
                          onClick={() => handleDeleteImage(index)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <p className="line-clamp-1">{image.prompt}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {image.style} • {image.aspectRatio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ImageIcon className="mb-4 h-12 w-12 text-gray-300" />
                  <h3 className="mb-2 text-lg font-medium">No Images Yet</h3>
                  <p className="text-gray-500">Generate some images to see your history here.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
