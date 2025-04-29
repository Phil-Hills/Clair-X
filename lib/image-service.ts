"use client"

import type { GenerateImageParams, GeneratedImage } from "./types"

export async function generateImages(params: GenerateImageParams): Promise<GeneratedImage[]> {
  try {
    // Get the client-side API key if available
    const clientApiKey = typeof window !== "undefined" ? localStorage.getItem("GEMINI_API_KEY") : null

    // Make the API request
    const response = await fetch("/api/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...params,
        clientApiKey, // Pass the client API key to the server
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("API error:", response.status, errorData)
      throw new Error(`API error: ${response.status} ${errorData.error || ""}`)
    }

    const data = await response.json()
    console.log("Image generation response:", data)

    // If the API returned an error but still provided fallback images
    if (data.mode === "fallback") {
      console.log("Using fallback images. Reason:", data.reason)

      // If the reason is related to an invalid API key, remove it from localStorage
      if (
        clientApiKey &&
        (data.reason === "API key validation failed" ||
          data.reason === "Invalid API key format or no API key available" ||
          data.reason === "No working Gemini models found" ||
          (data.error &&
            (data.error.includes("API_KEY_INVALID") ||
              data.error.includes("not found") ||
              data.error.includes("not supported"))))
      ) {
        console.log("Removing invalid API key from localStorage")
        localStorage.removeItem("GEMINI_API_KEY")

        // Show a message to the user (you could use toast here)
        if (typeof window !== "undefined") {
          console.warn(
            "Your API key appears to be invalid or doesn't have access to required models. Please provide a new API key in settings.",
          )
        }
      }
    }

    // Return the generated images (or fallback images)
    return data.images || []
  } catch (error) {
    console.error("Error in image generation:", error)

    // Return placeholder images as fallback
    return generatePlaceholderImages(params)
  }
}

// Fallback function to generate placeholder images
function generatePlaceholderImages(params: GenerateImageParams): GeneratedImage[] {
  const { prompt, style, numberOfOutputs, aspectRatio } = params
  const images: GeneratedImage[] = []

  // Determine dimensions based on aspect ratio
  let width = 512
  let height = 512

  switch (aspectRatio) {
    case "3:2":
      width = 600
      height = 400
      break
    case "4:3":
      width = 640
      height = 480
      break
    case "16:9":
      width = 640
      height = 360
      break
    case "9:16":
      width = 360
      height = 640
      break
  }

  for (let i = 0; i < numberOfOutputs; i++) {
    // Create a unique seed for each image
    const seed = Math.floor(Math.random() * 1000000)

    // Create a placeholder image URL with the prompt and style
    const imageUrl = `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(
      prompt + " " + style + " style " + seed,
    )}`

    images.push({
      url: imageUrl,
      prompt,
      style,
      aspectRatio,
      description: `Placeholder image for: ${prompt} in ${style} style`,
      model: "fallback",
    })
  }

  return images
}
