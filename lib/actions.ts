"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import type { GenerateImageParams, GeneratedImage } from "./types"

// Define available Gemini models in order of preference
const GEMINI_MODELS = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"]

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

    // Try each model in order until one works
    let model = null
    let usedModel = ""

    for (const modelName of GEMINI_MODELS) {
      try {
        console.log(`Trying to use Gemini model: ${modelName}`)
        model = genAI.getGenerativeModel({ model: modelName })
        // Test if the model works
        await model.generateContent("Test")
        usedModel = modelName
        console.log(`Successfully using Gemini model: ${modelName}`)
        break
      } catch (error) {
        console.error(`Error with model ${modelName}:`, error)
        // Continue to the next model
      }
    }

    if (!model) {
      throw new Error("No available Gemini models found")
    }

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

    // Generate images using the available Gemini model
    const results = await Promise.all(
      Array(numberOfOutputs)
        .fill(0)
        .map(async (_, i) => {
          // Create a unique seed for each image
          const seed = Math.floor(Math.random() * 1000000)

          // For Gemini, we need to use the text generation capabilities
          // with a prompt that describes the image we want
          const generationPrompt = `Create a detailed description for an image of: ${enhancedPrompt}. Seed: ${seed}.`

          const result = await model.generateContent(generationPrompt)
          const response = await result.response
          const description = response.text()

          // Use the description to create a placeholder image
          const imageUrl = `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(
            description || enhancedPrompt,
          )}`

          return {
            url: imageUrl,
            prompt,
            style,
            aspectRatio,
            description: description || enhancedPrompt,
            model: usedModel,
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
      description: `Placeholder image for: ${prompt} in ${style} style`,
      model: "fallback",
    })
  }

  return images
}
