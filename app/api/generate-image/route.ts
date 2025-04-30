import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { GoogleGenerativeAI } from "@google/generative-ai"
import type { GeneratedImage } from "@/lib/types"

// Set Node.js runtime to ensure compatibility with the Google Generative AI SDK
export const runtime = "nodejs"

// Basic validation for API key format
function isValidApiKeyFormat(apiKey: string | null | undefined): boolean {
  if (!apiKey) return false
  // Basic format validation - Google API keys typically start with "AIza"
  return typeof apiKey === "string" && apiKey.trim().startsWith("AIza")
}

// Updated list of available models to try in order of preference
// Removed deprecated gemini-pro-vision and prioritized gemini-1.5-flash
const AVAILABLE_MODELS = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"]

// Function to find a working model
async function findWorkingModel(genAI: GoogleGenerativeAI): Promise<string | null> {
  // Try each model directly
  for (const modelName of AVAILABLE_MODELS) {
    try {
      console.log(`Testing model: ${modelName}`)
      const model = genAI.getGenerativeModel({ model: modelName })
      // Test if the model works with a simple prompt
      await model.generateContent("test")
      console.log(`Model ${modelName} is working`)
      return modelName
    } catch (error) {
      console.error(`Error testing model ${modelName}:`, error)
    }
  }

  return null
}

export async function POST(request: Request) {
  // Check authentication
  const cookieStore = cookies()
  const sessionCookie =
    cookieStore.get("next-auth.session-token") || cookieStore.get("__Secure-next-auth.session-token")

  if (!sessionCookie) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const data = await request.json()
    const { prompt, style, aspectRatio, numberOfOutputs, clientApiKey } = data

    // Validate inputs
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Get API key (try client key first, then environment variable)
    const apiKey = clientApiKey || process.env.GEMINI_API_KEY || process.env.gemeni

    // Check if API key has valid format before attempting to use it
    if (!isValidApiKeyFormat(apiKey)) {
      console.log("Invalid API key format or no API key available, using placeholder images")
      return NextResponse.json({
        success: true,
        images: generatePlaceholderImages(prompt, style, aspectRatio, numberOfOutputs),
        mode: "fallback",
        reason: "Invalid API key format or no API key available",
      })
    }

    try {
      // Initialize the Google Generative AI client
      const genAI = new GoogleGenerativeAI(apiKey as string)

      // Find a working model
      const workingModelName = await findWorkingModel(genAI)

      if (!workingModelName) {
        console.error("No working models found")
        return NextResponse.json({
          success: true,
          images: generatePlaceholderImages(prompt, style, aspectRatio, numberOfOutputs),
          mode: "fallback",
          reason: "No working Gemini models found",
        })
      }

      console.log(`Using model: ${workingModelName}`)
      const model = genAI.getGenerativeModel({ model: workingModelName })

      // Enhance the prompt with style information if not set to "auto"
      let enhancedPrompt = prompt
      if (style !== "auto") {
        enhancedPrompt = `${prompt} in ${style} style`
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

      // Generate images using Gemini
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
              model: workingModelName,
            }
          }),
      )

      return NextResponse.json({
        success: true,
        images: results,
        mode: "gemini",
        model: workingModelName,
      })
    } catch (apiError) {
      console.error("Gemini API error:", apiError)

      // Fall back to placeholder images
      return NextResponse.json({
        success: true,
        images: generatePlaceholderImages(prompt, style, aspectRatio, numberOfOutputs),
        mode: "fallback",
        reason: "API error during generation",
        error: String(apiError),
      })
    }
  } catch (error) {
    console.error("Error generating image:", error)
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
  }
}

// Helper function to generate placeholder images
function generatePlaceholderImages(
  prompt: string,
  style: string,
  aspectRatio: string,
  numberOfOutputs: number,
): GeneratedImage[] {
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
