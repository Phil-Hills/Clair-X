import type { GenerateImageParams, GeneratedImage } from "./types"
import { generateImage, generateImageFallback } from "./actions"

export async function generateImages(params: GenerateImageParams): Promise<GeneratedImage[]> {
  try {
    // Check if we have a Gemini API key
    if (!process.env.GEMINI_API_KEY) {
      console.warn("No Gemini API key found. Using fallback image generation.")
      return generateImageFallback(params)
    }

    // Try to use the real API
    return await generateImage(params)
  } catch (error) {
    console.error("Error in image generation, falling back to placeholders:", error)
    return generateImageFallback(params)
  }
}
