import { GoogleGenerativeAI } from "@google/generative-ai"

// Updated list of available models in order of preference
export const GEMINI_MODELS = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"]

// Function to validate API key format
export function isValidApiKeyFormat(apiKey: string | null | undefined): boolean {
  if (!apiKey) return false
  // Basic format validation - Google API keys typically start with "AIza"
  return typeof apiKey === "string" && apiKey.trim().startsWith("AIza") && apiKey.length > 20
}

// Function to get the best available API key
export function getBestApiKey(): string | null {
  // First check environment variable
  if (isValidApiKeyFormat(process.env.GEMINI_API_KEY)) {
    return process.env.GEMINI_API_KEY
  }

  // For client-side, we'll return null (client-side code should check localStorage)
  if (typeof window !== "undefined") {
    const clientKey = localStorage.getItem("GEMINI_API_KEY")
    if (isValidApiKeyFormat(clientKey)) {
      return clientKey
    }
  }

  // If we have the gemeni environment variable, use that
  if (isValidApiKeyFormat(process.env.gemeni)) {
    return process.env.gemeni
  }

  return null
}

// Initialize Google Generative AI with the best available API key
export function initializeGoogleAI(): GoogleGenerativeAI | null {
  const apiKey = getBestApiKey()
  if (!apiKey) return null

  try {
    return new GoogleGenerativeAI(apiKey)
  } catch (error) {
    console.error("Failed to initialize Google Generative AI:", error)
    return null
  }
}

// Test if an API key works with a specific model
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

// Validate an API key with all available models
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

// Get the best available model with the current API key
export async function getBestAvailableModel(): Promise<{
  available: boolean
  model?: string
  error?: string
}> {
  const apiKey = getBestApiKey()
  if (!apiKey) {
    return {
      available: false,
      error: "No API key available",
    }
  }

  const result = await validateApiKey(apiKey)
  return {
    available: result.valid,
    model: result.model,
    error: result.error,
  }
}

// Add a function to test if an API key is valid
export async function testApiKey(apiKey: string): Promise<boolean> {
  if (!isValidApiKeyFormat(apiKey)) {
    return false
  }

  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai")
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Make a minimal request to test the API key
    const result = await model.generateContent("test")
    return !!result.response
  } catch (error) {
    console.error("API key test failed:", error)
    return false
  }
}
