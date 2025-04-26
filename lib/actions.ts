"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import type { GenerateImageParams, GeneratedImage } from "./types"

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function generateImage(params: GenerateImageParams): Promise<GeneratedImage[]> {
  const { prompt, style, numberOfOutputs, aspectRatio } = params

  try {
    // Enhance the prompt with style information if not set to "auto"
    let enhancedPrompt = prompt
    if (style !== "auto") {
      enhancedPrompt = `${prompt} in ${style} style`
    }

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" })

    // Determine dimensions based on aspect ratio
    let width = 1024
    let height = 1024

    switch (aspectRatio) {
      case "3:2":
        width = 1200
        height = 800
        break
      case "4:3":
        width = 1200
        height = 900
        break
      case "16:9":
        width = 1600
        height = 900
        break
      case "9:16":
        height = 1600
        width = 900
        break
    }

    // Generate images using Gemini
    const results = await Promise.all(
      Array(numberOfOutputs)
        .fill(0)
        .map(async (_, i) => {
          // For Gemini, we need to use the text generation capabilities
          // and then convert the result to an image
          const result = await model.generateContent(enhancedPrompt)
          const response = await result.response
          const text = response.text()

          // Since Gemini doesn't directly generate images via API yet,
          // we'll use a placeholder with the prompt for demonstration
          // In a real implementation, you would use the Gemini response to guide image generation

          // Create a unique seed for each image
          const seed = Math.floor(Math.random() * 1000000)

          // Create a placeholder image URL with the prompt and style
          const imageUrl = `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(
            enhancedPrompt + " " + seed,
          )}`

          return {
            url: imageUrl,
            prompt,
            style,
            aspectRatio,
          }
        }),
    )

    return results
  } catch (error) {
    console.error("Error generating images with Gemini:", error)
    throw new Error("Failed to generate images. Please try again.")
  }
}

// Fallback function that uses placeholders if the API key is not available
export async function generateImageFallback(params: GenerateImageParams): Promise<GeneratedImage[]> {
  const { prompt, style, numberOfOutputs, aspectRatio } = params

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Generate placeholder images
  const images: GeneratedImage[] = []

  for (let i = 0; i < numberOfOutputs; i++) {
    // Create a unique seed for each image
    const seed = Math.floor(Math.random() * 1000000)

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

    // Create a placeholder image URL with the prompt and style
    const styleParam = style !== "auto" ? `&style=${style}` : ""
    const imageUrl = `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(
      prompt + " " + style + " style " + seed,
    )}${styleParam}`

    images.push({
      url: imageUrl,
      prompt,
      style,
      aspectRatio,
    })
  }

  return images
}
