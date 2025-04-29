// Centralized API key management
import { GoogleGenerativeAI } from "@google/generative-ai"

// Define available Gemini models in order of preference
export const GEMINI_MODELS = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"]

// Function to validate API key format
export function isValidApiKeyFormat(apiKey: string): boolean {
  // Basic format validation - Google API keys typically start with "AIza"
  return typeof apiKey === "string" && apiKey.trim().startsWith("AIza")
}

// Function to get API key from various sources
export function getApiKey(): string | null {
  // Check environment variable first
  if (process.env.GEMINI_API_KEY && isValidApiKeyFormat(process.env.GEMINI_API_KEY)) {
    return process.env.GEMINI_API_KEY
  }

  // For client-side, we'll return null (client-side code should check localStorage)
  return null
}

// Function to test API key with a specific model
export async function testApiKeyWithModel(
  apiKey: string,
  modelName: string,
): Promise<{
  valid: boolean
  model?: string
  error?: string
}> {
  try {
    if (!isValidApiKeyFormat(apiKey)) {
      return {
        valid: false,
        error: "API key format is invalid. Google API keys typically start with 'AIza'",
      }
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: modelName })

    // Use a minimal prompt to test the API key
    const result = await model.generateContent("Test")

    if (result && result.response) {
      return { valid: true, model: modelName }
    }

    return { valid: false, error: "API key validation failed" }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    // Check for specific API key errors
    if (errorMessage.includes("API_KEY_INVALID") || errorMessage.includes("API key not valid")) {
      return {
        valid: false,
        error: "The API key is invalid. Please check your API key and try again.",
      }
    }

    return { valid: false, error: errorMessage }
  }
}

// Function to test API key with all available models
export async function validateApiKey(apiKey: string): Promise<{
  valid: boolean
  model?: string
  error?: string
}> {
  // First check the format
  if (!isValidApiKeyFormat(apiKey)) {
    return {
      valid: false,
      error: "API key format is invalid. Google API keys typically start with 'AIza'",
    }
  }

  // Try each model in order until one works
  for (const modelName of GEMINI_MODELS) {
    try {
      const result = await testApiKeyWithModel(apiKey, modelName)
      if (result.valid) {
        return result
      }

      // If it's specifically an API key error, no need to try other models
      if (
        result.error &&
        (result.error.includes("API key is invalid") ||
          result.error.includes("API_KEY_INVALID") ||
          result.error.includes("API key not valid"))
      ) {
        return result
      }
    } catch (error) {
      console.error(`Error testing model ${modelName}:`, error)
      // Continue to the next model
    }
  }

  return {
    valid: false,
    error: "No available Gemini models found with the provided API key",
  }
}
