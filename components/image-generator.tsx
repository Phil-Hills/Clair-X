"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

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
        {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
      </form>

      <div className="flex justify-center">
        {loading ? (
          <div className="h-64 w-64 flex items-center justify-center bg-gray-700 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
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
          <div className="h-64 w-64 flex items-center justify-center bg-gray-700 rounded-lg">
            <p className="text-gray-400 text-center px-4">Your generated image will appear here</p>
          </div>
        )}
      </div>
    </div>
  )
}
