"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Crop,
  Sliders,
  ImageIcon,
  Download,
  RotateCcw,
  Undo,
  Redo,
  Save,
  Contrast,
  Sun,
  Palette,
  Layers,
  Wand2,
  Loader2,
  Info,
  X,
  CheckCircle2,
} from "lucide-react"
import {
  applyVisualEffect,
  isValidImageDataUrl,
  logImageProcessing,
  getPromptEnhancementCategories,
  buildEnhancedPrompt,
  type PromptEnhancement,
} from "@/utils/image-processing"

export function ImageEditor() {
  const [image, setImage] = useState<string | null>(null)
  const [filter, setFilter] = useState("none")
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [basePrompt, setBasePrompt] = useState("")
  const [enhancedPrompt, setEnhancedPrompt] = useState("")
  const [selectedEnhancements, setSelectedEnhancements] = useState<PromptEnhancement[]>([])
  const [isProcessingPrompt, setIsProcessingPrompt] = useState(false)
  const [promptError, setPromptError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [promptHistory, setPromptHistory] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState("style")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filters = [
    { name: "None", value: "none" },
    { name: "Grayscale", value: "grayscale" },
    { name: "Sepia", value: "sepia" },
    { name: "Vintage", value: "vintage" },
    { name: "Cool", value: "cool" },
    { name: "Warm", value: "warm" },
    { name: "High Contrast", value: "high-contrast" },
  ]

  const enhancementCategories = getPromptEnhancementCategories()

  // Update enhanced prompt when base prompt or selected enhancements change
  useEffect(() => {
    const newEnhancedPrompt = buildEnhancedPrompt(basePrompt, selectedEnhancements)
    setEnhancedPrompt(newEnhancedPrompt)
  }, [basePrompt, selectedEnhancements])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setImage(result)
        addToHistory(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const addToHistory = (imageData: string) => {
    // If we're not at the end of the history, remove everything after current index
    if (historyIndex < history.length - 1) {
      setHistory(history.slice(0, historyIndex + 1))
    }

    setHistory((prev) => [...prev, imageData])
    setHistoryIndex((prev) => prev + 1)
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setImage(history[historyIndex - 1])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setImage(history[historyIndex + 1])
    }
  }

  const handleReset = () => {
    if (history.length > 0) {
      setImage(history[0])
      setBrightness(100)
      setContrast(100)
      setSaturation(100)
      setFilter("none")
    }
  }

  const applyFilter = () => {
    if (!image || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = image

    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width
      canvas.height = img.height

      // Draw original image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Apply filters
      let filterString = ""

      // Apply brightness, contrast, saturation
      filterString += `brightness(${brightness}%) `
      filterString += `contrast(${contrast}%) `
      filterString += `saturate(${saturation}%) `

      // Apply named filters
      switch (filter) {
        case "grayscale":
          filterString += "grayscale(100%) "
          break
        case "sepia":
          filterString += "sepia(100%) "
          break
        case "vintage":
          filterString += "sepia(50%) contrast(85%) brightness(90%) "
          break
        case "cool":
          filterString += "hue-rotate(180deg) saturate(70%) "
          break
        case "warm":
          filterString += "hue-rotate(-30deg) saturate(140%) "
          break
        case "high-contrast":
          filterString += "contrast(150%) "
          break
      }

      ctx.filter = filterString.trim()
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Reset filter
      ctx.filter = "none"

      // Update image with filtered version
      const newImageData = canvas.toDataURL("image/jpeg")
      setImage(newImageData)
      addToHistory(newImageData)
    }
  }

  const handlePromptEdit = async () => {
    if (!image || !enhancedPrompt.trim()) {
      setPromptError("Please enter a prompt or select enhancements to describe the edit you want to make")
      return
    }

    setIsProcessingPrompt(true)
    setPromptError(null)
    setDebugInfo(null)

    try {
      // Log what we're about to do
      logImageProcessing("Starting prompt edit", { prompt: enhancedPrompt })

      // Try to use the API first
      let editedImageUrl: string | null = null

      try {
        // Convert base64 to blob for the API call
        const response = await fetch(image)
        const blob = await response.blob()

        // Create form data
        const formData = new FormData()
        formData.append("image", blob, "image.jpg")
        formData.append("prompt", enhancedPrompt)

        // Call the API
        const apiResponse = await fetch("/api/edit-image", {
          method: "POST",
          body: formData,
        })

        if (!apiResponse.ok) {
          throw new Error(`API error: ${apiResponse.status}`)
        }

        const data = await apiResponse.json()
        editedImageUrl = data.imageUrl

        logImageProcessing("API edit successful", { success: true })
      } catch (apiError) {
        // If API fails, fall back to client-side processing
        logImageProcessing("API edit failed, falling back to client-side", {
          error: apiError instanceof Error ? apiError.message : "Unknown error",
        })

        // Use our utility function for client-side processing
        editedImageUrl = await applyVisualEffect(image, enhancedPrompt)
      }

      if (!editedImageUrl) {
        throw new Error("Failed to generate edited image")
      }

      // Validate the image data
      if (!isValidImageDataUrl(editedImageUrl)) {
        throw new Error("Invalid image data returned")
      }

      // Update the image with the edited version
      setImage(editedImageUrl)
      addToHistory(editedImageUrl)
      setDebugInfo("Edit applied successfully!")

      // Add to prompt history if not already there
      if (!promptHistory.includes(enhancedPrompt)) {
        setPromptHistory((prev) => [enhancedPrompt, ...prev].slice(0, 10))
      }
    } catch (error) {
      console.error("Error processing prompt edit:", error)
      setPromptError(error instanceof Error ? error.message : "Failed to process the edit. Please try again.")
      setDebugInfo(`Error details: ${error instanceof Error ? error.toString() : "Unknown error"}`)
    } finally {
      setIsProcessingPrompt(false)
    }
  }

  const handleDownload = () => {
    if (!image) return

    const link = document.createElement("a")
    link.download = `edited-image-${Date.now()}.jpg`
    link.href = image
    link.click()
  }

  const handleEnhancementToggle = (enhancement: PromptEnhancement) => {
    setSelectedEnhancements((prev) => {
      const exists = prev.some((e) => e.category === enhancement.category && e.name === enhancement.name)
      if (exists) {
        return prev.filter((e) => !(e.category === enhancement.category && e.name === enhancement.name))
      } else {
        return [...prev, enhancement]
      }
    })
  }

  const handleLoadFromHistory = (prompt: string) => {
    setBasePrompt(prompt)
    setSelectedEnhancements([])
  }

  const isEnhancementSelected = (enhancement: PromptEnhancement) => {
    return selectedEnhancements.some((e) => e.category === enhancement.category && e.name === enhancement.name)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <ImageIcon className="w-5 h-5 mr-2" />
              Image Editor
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-white border-gray-600 hover:bg-gray-700"
              >
                Upload Image
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!image ? (
            <div className="flex flex-col items-center justify-center h-80 bg-gray-700 rounded-md border border-dashed border-gray-600">
              <ImageIcon className="w-16 h-16 text-gray-500 mb-4" />
              <p className="text-gray-400 mb-4">Upload an image to start editing</p>
              <Button onClick={() => fileInputRef.current?.click()} className="bg-pink-600 hover:bg-pink-700">
                Select Image
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="relative max-w-full max-h-[400px] overflow-hidden rounded-md">
                  <img
                    src={image || "/placeholder.svg"}
                    alt="Editing preview"
                    className="max-w-full max-h-[400px] object-contain"
                  />
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleUndo}
                    disabled={historyIndex <= 0}
                    className="text-white border-gray-600 hover:bg-gray-700"
                  >
                    <Undo className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRedo}
                    disabled={historyIndex >= history.length - 1}
                    className="text-white border-gray-600 hover:bg-gray-700"
                  >
                    <Redo className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleReset}
                    className="text-white border-gray-600 hover:bg-gray-700"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button onClick={applyFilter} className="bg-pink-600 hover:bg-pink-700">
                    <Save className="w-4 h-4 mr-2" />
                    Apply Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDownload}
                    className="text-white border-gray-600 hover:bg-gray-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="prompt" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-gray-700">
                  <TabsTrigger value="prompt" className="data-[state=active]:bg-pink-600">
                    <Wand2 className="w-4 h-4 mr-2" />
                    Prompt Edit
                  </TabsTrigger>
                  <TabsTrigger value="adjustments" className="data-[state=active]:bg-pink-600">
                    <Sliders className="w-4 h-4 mr-2" />
                    Adjustments
                  </TabsTrigger>
                  <TabsTrigger value="filters" className="data-[state=active]:bg-pink-600">
                    <Palette className="w-4 h-4 mr-2" />
                    Filters
                  </TabsTrigger>
                  <TabsTrigger value="crop" className="data-[state=active]:bg-pink-600">
                    <Crop className="w-4 h-4 mr-2" />
                    Crop
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="prompt" className="mt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="base-prompt" className="text-white">
                        Base Prompt
                      </Label>
                      <Textarea
                        id="base-prompt"
                        value={basePrompt}
                        onChange={(e) => setBasePrompt(e.target.value)}
                        placeholder="Describe what you want to change about the image..."
                        className="bg-gray-700 border-gray-600 text-white h-20"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-white">Prompt Enhancements</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Info className="h-4 w-4 text-gray-400" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-800 text-white border-gray-700 max-w-xs">
                              <p>Select enhancements to improve your prompt. Multiple selections will be combined.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      <div className="bg-gray-700 rounded-md border border-gray-600 overflow-hidden">
                        <div className="grid grid-cols-4 bg-gray-800">
                          {enhancementCategories.map((category) => (
                            <button
                              key={category.name.toLowerCase()}
                              className={`py-2 px-4 text-sm font-medium ${
                                activeCategory === category.name.toLowerCase()
                                  ? "bg-pink-600 text-white"
                                  : "bg-transparent text-gray-300 hover:bg-gray-700"
                              }`}
                              onClick={() => setActiveCategory(category.name.toLowerCase())}
                            >
                              {category.name}
                            </button>
                          ))}
                        </div>

                        <div className="p-4">
                          <p className="text-gray-400 text-sm mb-3">
                            {enhancementCategories.find((c) => c.name.toLowerCase() === activeCategory)?.description}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {enhancementCategories
                              .find((c) => c.name.toLowerCase() === activeCategory)
                              ?.enhancements.map((enhancement) => (
                                <TooltipProvider key={enhancement.name}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant={isEnhancementSelected(enhancement) ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleEnhancementToggle(enhancement)}
                                        className={`justify-start text-left ${
                                          isEnhancementSelected(enhancement)
                                            ? "bg-pink-600 hover:bg-pink-700 text-white"
                                            : "text-gray-300 border-gray-600 hover:bg-gray-700"
                                        }`}
                                      >
                                        {isEnhancementSelected(enhancement) && (
                                          <CheckCircle2 className="w-4 h-4 mr-2 text-white" />
                                        )}
                                        {enhancement.name}
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gray-800 text-white border-gray-700">
                                      <p>{enhancement.description}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedEnhancements.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedEnhancements.map((enhancement) => (
                          <Badge
                            key={`${enhancement.category}-${enhancement.name}`}
                            className="bg-pink-600 hover:bg-pink-700 text-white px-2 py-1 flex items-center gap-1"
                          >
                            {enhancement.name}
                            <button
                              onClick={() => handleEnhancementToggle(enhancement)}
                              className="ml-1 hover:bg-pink-800 rounded-full"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    {enhancedPrompt && (
                      <div className="bg-gray-700 p-3 rounded-md border border-gray-600">
                        <Label className="text-white text-sm mb-1 block">Enhanced Prompt:</Label>
                        <p className="text-gray-300 text-sm">{enhancedPrompt}</p>
                      </div>
                    )}

                    {promptError && (
                      <Alert className="bg-red-900/30 border-red-800 text-red-300">
                        <AlertDescription>{promptError}</AlertDescription>
                      </Alert>
                    )}

                    {debugInfo && (
                      <Alert className="bg-green-900/30 border-green-800 text-green-300">
                        <AlertDescription>{debugInfo}</AlertDescription>
                      </Alert>
                    )}

                    <Button
                      onClick={handlePromptEdit}
                      disabled={isProcessingPrompt || !enhancedPrompt.trim()}
                      className="w-full bg-pink-600 hover:bg-pink-700"
                    >
                      {isProcessingPrompt ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4 mr-2" />
                          Apply Prompt Edit
                        </>
                      )}
                    </Button>

                    {promptHistory.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-white">Prompt History</Label>
                        <ScrollArea className="h-32">
                          <div className="space-y-2 pr-4">
                            {promptHistory.map((prompt, index) => (
                              <div
                                key={index}
                                className="bg-gray-700 border border-gray-600 rounded-md p-2 text-sm text-gray-300 cursor-pointer hover:border-pink-500"
                                onClick={() => handleLoadFromHistory(prompt)}
                              >
                                <p className="truncate">{prompt}</p>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="adjustments" className="mt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-white flex items-center">
                          <Sun className="w-4 h-4 mr-2" />
                          Brightness
                        </Label>
                        <span className="text-gray-400 text-sm">{brightness}%</span>
                      </div>
                      <Slider
                        value={[brightness]}
                        min={0}
                        max={200}
                        step={1}
                        onValueChange={(value) => setBrightness(value[0])}
                        className="[&>span:first-child]:bg-gray-600 [&>span:first-child_span]:bg-pink-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-white flex items-center">
                          <Contrast className="w-4 h-4 mr-2" />
                          Contrast
                        </Label>
                        <span className="text-gray-400 text-sm">{contrast}%</span>
                      </div>
                      <Slider
                        value={[contrast]}
                        min={0}
                        max={200}
                        step={1}
                        onValueChange={(value) => setContrast(value[0])}
                        className="[&>span:first-child]:bg-gray-600 [&>span:first-child_span]:bg-pink-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-white flex items-center">
                          <Layers className="w-4 h-4 mr-2" />
                          Saturation
                        </Label>
                        <span className="text-gray-400 text-sm">{saturation}%</span>
                      </div>
                      <Slider
                        value={[saturation]}
                        min={0}
                        max={200}
                        step={1}
                        onValueChange={(value) => setSaturation(value[0])}
                        className="[&>span:first-child]:bg-gray-600 [&>span:first-child_span]:bg-pink-500"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="filters" className="mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {filters.map((f) => (
                      <div
                        key={f.value}
                        className={`cursor-pointer rounded-md overflow-hidden border-2 ${filter === f.value ? "border-pink-500" : "border-transparent"}`}
                        onClick={() => setFilter(f.value)}
                      >
                        <div
                          className={`aspect-square bg-gray-700 flex items-center justify-center ${f.value !== "none" ? `filter-${f.value}` : ""}`}
                        >
                          <div className="text-center">
                            <div className="w-full h-12 bg-gradient-to-r from-gray-500 to-gray-300 mb-2"></div>
                            <span className="text-sm text-white">{f.name}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="crop" className="mt-4">
                  <div className="text-center py-8 text-gray-400">
                    <Crop className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                    <p>Crop functionality coming soon</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
