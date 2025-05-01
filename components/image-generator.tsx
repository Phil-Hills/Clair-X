"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!prompt.trim()) {
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
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to generate image")
      }

      const data = await response.json()
      setImage(data.image)
    } catch (err) {
      console.error("Error generating image:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <Input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="flex-1 bg-gray-700 border-gray-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <Button type="submit" disabled={loading} className="bg-pink-600 hover:bg-pink-700 text-white">
            {loading ? "Generating..." : "Generate"}
          </Button>
        </div>
      </form>

      {error && (
        <Alert className="mb-6 bg-red-900/30 border-red-800 text-red-300">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-center">
        {loading ? (
          <div className="h-64 w-64 sm:h-96 sm:w-96 flex items-center justify-center bg-gray-700 rounded-lg">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mb-4"></div>
              <p className="text-gray-300">Generating your image...</p>
              <p className="text-gray-400 text-sm mt-2">This may take up to 30 seconds</p>
            </div>
          </div>
        ) : image ? (
          <Card className="overflow-hidden bg-gray-700 border-gray-600">
            <CardContent className="p-0">
              <div className="relative h-64 w-64 sm:h-96 sm:w-96">
                <img
                  src={image || "/placeholder.svg"}
                  alt="Generated image"
                  className="object-cover rounded-lg"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="h-64 w-64 sm:h-96 sm:w-96 flex items-center justify-center bg-gray-700 rounded-lg">
            <div className="text-center px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto mb-4 text-gray-500"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <p className="text-gray-400">Enter a prompt above to generate an image</p>
            </div>
          </div>
        )}
      </div>

      {image && (
        <div className="mt-4 flex justify-center">
          <Button
            onClick={() => {
              const link = document.createElement("a")
              link.href = image
              link.download = `clair-x-${Date.now()}.jpg`
              link.click()
            }}
            className="bg-gray-700 hover:bg-gray-600 text-white"
          >
            Download Image
          </Button>
        </div>
      )}
    </div>
  )
}
