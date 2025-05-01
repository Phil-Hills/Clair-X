"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Download, Save, ImageIcon, Search, Sliders, Crop } from "lucide-react"

type AuditLogEntry = {
  timestamp: string
  prompt: string
  userId: string
  success: boolean
}

type EnhancementSettings = {
  brightness: number
  contrast: number
  saturation: number
  blur: number
  rotation: number
}

const DEFAULT_ENHANCEMENT_SETTINGS: EnhancementSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  rotation: 0,
}

const PROMPT_ENHANCERS = [
  "high resolution",
  "detailed",
  "professional photography",
  "studio lighting",
  "sharp focus",
  "cinematic",
  "dramatic lighting",
  "8k",
  "photorealistic",
  "vibrant colors",
]

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("")
  const [enhancedPrompt, setEnhancedPrompt] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([])
  const [enhancementSettings, setEnhancementSettings] = useState<EnhancementSettings>(DEFAULT_ENHANCEMENT_SETTINGS)
  const [selectedEnhancers, setSelectedEnhancers] = useState<string[]>([])
  const [cropMode, setCropMode] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Update enhanced prompt when prompt or enhancers change
  useEffect(() => {
    if (selectedEnhancers.length > 0) {
      setEnhancedPrompt(`${prompt}, ${selectedEnhancers.join(", ")}`)
    } else {
      setEnhancedPrompt(prompt)
    }
  }, [prompt, selectedEnhancers])

  // Apply image enhancements
  useEffect(() => {
    if (image && canvasRef.current && imageRef.current) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const canvas = canvasRef.current!
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        canvas.width = img.width
        canvas.height = img.height

        // Apply transformations
        ctx.filter = `brightness(${enhancementSettings.brightness}%) contrast(${enhancementSettings.contrast}%) saturate(${enhancementSettings.saturation}%) blur(${enhancementSettings.blur}px)`

        // Apply rotation if needed
        if (enhancementSettings.rotation !== 0) {
          ctx.save()
          ctx.translate(canvas.width / 2, canvas.height / 2)
          ctx.rotate((enhancementSettings.rotation * Math.PI) / 180)
          ctx.drawImage(img, -img.width / 2, -img.height / 2)
          ctx.restore()
        } else {
          ctx.drawImage(img, 0, 0)
        }
      }
      img.src = image
    }
  }, [image, enhancementSettings])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!enhancedPrompt.trim()) {
      setError("Please enter a prompt")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: enhancedPrompt }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || `Failed to generate image: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setImage(data.image)

      // Add to audit logs
      if (data.auditLog) {
        setAuditLogs((prev) => [data.auditLog, ...prev])
      } else {
        // Create a default audit log if none was returned
        setAuditLogs((prev) => [
          {
            timestamp: new Date().toISOString(),
            prompt: enhancedPrompt,
            userId: "demo-user",
            success: true,
          },
          ...prev,
        ])
      }
    } catch (err) {
      console.error("Error generating image:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")

      // Add failed attempt to audit logs
      setAuditLogs((prev) => [
        {
          timestamp: new Date().toISOString(),
          prompt: enhancedPrompt,
          userId: "demo-user",
          success: false,
        },
        ...prev,
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleEnhancerToggle = (enhancer: string) => {
    setSelectedEnhancers((prev) => (prev.includes(enhancer) ? prev.filter((e) => e !== enhancer) : [...prev, enhancer]))
  }

  const handleResetEnhancements = () => {
    setEnhancementSettings(DEFAULT_ENHANCEMENT_SETTINGS)
  }

  const handleSaveToGallery = () => {
    // Simulate saving to gallery
    const newLog = {
      timestamp: new Date().toISOString(),
      prompt: enhancedPrompt,
      userId: "demo-user",
      success: true,
    }
    setAuditLogs((prev) => [newLog, ...prev])

    // Show success message
    setError(`Image saved to your gallery`)
    setTimeout(() => setError(null), 3000)
  }

  const getEnhancedImage = () => {
    if (canvasRef.current) {
      return canvasRef.current.toDataURL("image/jpeg")
    }
    return image
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-700">
          <TabsTrigger value="generator" className="data-[state=active]:bg-pink-600">
            Generator
          </TabsTrigger>
          <TabsTrigger value="enhance" className="data-[state=active]:bg-pink-600">
            Enhance
          </TabsTrigger>
          <TabsTrigger value="gallery" className="data-[state=active]:bg-pink-600">
            Gallery
          </TabsTrigger>
          <TabsTrigger value="audit" className="data-[state=active]:bg-pink-600">
            Audit Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="mt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <form onSubmit={handleSubmit} className="mb-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="prompt" className="text-white mb-2 block">
                      Image Prompt
                    </Label>
                    <Textarea
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe the image you want to generate..."
                      className="h-32 bg-gray-700 border-gray-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">Prompt Enhancers</Label>
                    <div className="flex flex-wrap gap-2">
                      {PROMPT_ENHANCERS.map((enhancer) => (
                        <Button
                          key={enhancer}
                          type="button"
                          size="sm"
                          variant={selectedEnhancers.includes(enhancer) ? "default" : "outline"}
                          className={selectedEnhancers.includes(enhancer) ? "bg-pink-600 hover:bg-pink-700" : ""}
                          onClick={() => handleEnhancerToggle(enhancer)}
                        >
                          {enhancer}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {selectedEnhancers.length > 0 && (
                    <div className="bg-gray-700 p-3 rounded-md">
                      <Label className="text-white mb-2 block">Enhanced Prompt:</Label>
                      <p className="text-gray-300">{enhancedPrompt}</p>
                    </div>
                  )}

                  <Button type="submit" disabled={loading} className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                    {loading ? "Generating..." : "Generate Image"}
                  </Button>
                </div>
              </form>

              {error && (
                <Alert
                  className={`mb-6 ${error.includes("saved to") ? "bg-green-900/30 border-green-800 text-green-300" : "bg-red-900/30 border-red-800 text-red-300"}`}
                >
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex justify-center">
              {loading ? (
                <div className="h-96 w-full flex items-center justify-center bg-gray-700 rounded-lg">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mb-4"></div>
                    <p className="text-gray-300">Generating your image...</p>
                    <p className="text-gray-400 text-sm mt-2">This may take up to 30 seconds</p>
                  </div>
                </div>
              ) : image ? (
                <Card className="overflow-hidden bg-gray-700 border-gray-600 w-full">
                  <CardContent className="p-0">
                    <div className="relative w-full aspect-square">
                      <img
                        ref={imageRef}
                        src={image || "/placeholder.svg"}
                        alt="Generated image"
                        className="object-contain rounded-lg"
                        style={{ width: "100%", height: "100%" }}
                      />
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-96 w-full flex items-center justify-center bg-gray-700 rounded-lg">
                  <div className="text-center px-4">
                    <ImageIcon className="mx-auto mb-4 text-gray-500 h-12 w-12" />
                    <p className="text-gray-400">Enter a prompt above to generate an image</p>
                    <p className="text-gray-500 text-sm mt-2">Try using prompt enhancers for better results</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {image && (
            <div className="mt-4 flex justify-center gap-2">
              <Button
                onClick={() => {
                  const link = document.createElement("a")
                  link.href = getEnhancedImage() || image
                  link.download = `gallery-image-${Date.now()}.jpg`
                  link.click()
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={handleSaveToGallery} className="bg-pink-600 hover:bg-pink-700 text-white">
                <Save className="w-4 h-4 mr-2" />
                Save to Gallery
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="enhance" className="mt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="brightness" className="text-white">
                          Brightness
                        </Label>
                        <span className="text-gray-400">{enhancementSettings.brightness}%</span>
                      </div>
                      <Slider
                        id="brightness"
                        min={0}
                        max={200}
                        step={1}
                        value={[enhancementSettings.brightness]}
                        onValueChange={(value) =>
                          setEnhancementSettings({ ...enhancementSettings, brightness: value[0] })
                        }
                        className="[&>span:first-child]:bg-gray-600 [&_[role=slider]]:bg-pink-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="contrast" className="text-white">
                          Contrast
                        </Label>
                        <span className="text-gray-400">{enhancementSettings.contrast}%</span>
                      </div>
                      <Slider
                        id="contrast"
                        min={0}
                        max={200}
                        step={1}
                        value={[enhancementSettings.contrast]}
                        onValueChange={(value) =>
                          setEnhancementSettings({ ...enhancementSettings, contrast: value[0] })
                        }
                        className="[&>span:first-child]:bg-gray-600 [&_[role=slider]]:bg-pink-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="saturation" className="text-white">
                          Saturation
                        </Label>
                        <span className="text-gray-400">{enhancementSettings.saturation}%</span>
                      </div>
                      <Slider
                        id="saturation"
                        min={0}
                        max={200}
                        step={1}
                        value={[enhancementSettings.saturation]}
                        onValueChange={(value) =>
                          setEnhancementSettings({ ...enhancementSettings, saturation: value[0] })
                        }
                        className="[&>span:first-child]:bg-gray-600 [&_[role=slider]]:bg-pink-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="blur" className="text-white">
                          Blur
                        </Label>
                        <span className="text-gray-400">{enhancementSettings.blur}px</span>
                      </div>
                      <Slider
                        id="blur"
                        min={0}
                        max={10}
                        step={0.1}
                        value={[enhancementSettings.blur]}
                        onValueChange={(value) => setEnhancementSettings({ ...enhancementSettings, blur: value[0] })}
                        className="[&>span:first-child]:bg-gray-600 [&_[role=slider]]:bg-pink-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="rotation" className="text-white">
                          Rotation
                        </Label>
                        <span className="text-gray-400">{enhancementSettings.rotation}°</span>
                      </div>
                      <Slider
                        id="rotation"
                        min={-180}
                        max={180}
                        step={1}
                        value={[enhancementSettings.rotation]}
                        onValueChange={(value) =>
                          setEnhancementSettings({ ...enhancementSettings, rotation: value[0] })
                        }
                        className="[&>span:first-child]:bg-gray-600 [&_[role=slider]]:bg-pink-500"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleResetEnhancements} variant="outline" className="flex-1">
                        Reset
                      </Button>
                      <Button
                        onClick={() => setCropMode(!cropMode)}
                        variant={cropMode ? "default" : "outline"}
                        className={`flex-1 ${cropMode ? "bg-pink-600 hover:bg-pink-700" : ""}`}
                      >
                        <Crop className="w-4 h-4 mr-2" />
                        Crop
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              {image ? (
                <Card className="overflow-hidden bg-gray-700 border-gray-600 w-full">
                  <CardContent className="p-0">
                    <div className="relative w-full aspect-square">
                      <canvas ref={canvasRef} className="w-full h-full object-contain rounded-lg" />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-96 w-full flex items-center justify-center bg-gray-700 rounded-lg">
                  <div className="text-center px-4">
                    <Sliders className="mx-auto mb-4 text-gray-500 h-12 w-12" />
                    <p className="text-gray-400">Generate an image first to enhance it</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {image && (
            <div className="mt-4 flex justify-center gap-2">
              <Button
                onClick={() => {
                  const link = document.createElement("a")
                  link.href = getEnhancedImage() || image
                  link.download = `enhanced-image-${Date.now()}.jpg`
                  link.click()
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Enhanced
              </Button>
              <Button onClick={handleSaveToGallery} className="bg-pink-600 hover:bg-pink-700 text-white">
                <Save className="w-4 h-4 mr-2" />
                Save to Gallery
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="gallery" className="mt-4">
          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              <Input type="text" placeholder="Search gallery..." className="bg-gray-700 border-gray-600 text-white" />
              <Button className="bg-gray-700 hover:bg-gray-600">
                <Search className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Sample gallery items */}
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <Card
                  key={item}
                  className="overflow-hidden bg-gray-700 border-gray-600 hover:border-pink-500 transition-colors cursor-pointer"
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-square">
                      <img
                        src={`/abstract-composition.png?key=6miac&key=9eum2&height=300&width=300&query=abstract art ${item}`}
                        alt={`Gallery image ${item}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-2">
                      <p className="text-sm text-gray-300 truncate">Generated Image #{item}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="mt-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium text-white mb-4">Image Generation Audit Log</h3>

              {auditLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No audit logs yet. Generate some images to see the audit trail.
                </div>
              ) : (
                <div className="space-y-4">
                  {auditLogs.map((log, index) => (
                    <div key={index} className="bg-gray-700 p-3 rounded-md">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">{new Date(log.timestamp).toLocaleString()}</span>
                        <span className={log.success ? "text-green-400" : "text-red-400"}>
                          {log.success ? "Success" : "Failed"}
                        </span>
                      </div>
                      <div className="mt-1 text-white">
                        <strong>Prompt:</strong> {log.prompt}
                      </div>
                      <div className="mt-1 text-gray-400 text-sm">
                        <strong>User:</strong> {log.userId}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
