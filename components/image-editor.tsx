"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
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
} from "lucide-react"

export function ImageEditor() {
  const [image, setImage] = useState<string | null>(null)
  const [filter, setFilter] = useState("none")
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
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

    setHistory([...history, imageData])
    setHistoryIndex(history.length)
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

  const handleDownload = () => {
    if (!image) return

    const link = document.createElement("a")
    link.download = `edited-image-${Date.now()}.jpg`
    link.href = image
    link.click()
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

              <Tabs defaultValue="adjustments" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-700">
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
