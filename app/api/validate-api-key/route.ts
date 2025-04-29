import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export const runtime = "nodejs"

// Available models to try in order of preference
const AVAILABLE_MODELS = ["gemini-pro-vision", "gemini-pro", "gemini-1.5-pro", "gemini-1.0-pro"]

// Function to validate API key format
function isValidApiKeyFormat(apiKey: string | null | undefined): boolean {
  if (!apiKey) return false
  // Basic format validation - Google API keys typically start with "AIza"
  return typeof apiKey === "string" && apiKey.trim().startsWith("AIza")
}

// Function to find a working model
async function findWorkingModel(genAI: GoogleGenerativeAI): Promise<string | null> {
  // First try to list available models
  try {
    const modelList = await genAI.listModels()
    console.log("Available models:", modelList)

    // Find the first model from our preference list that's available
    for (const modelName of AVAILABLE_MODELS) {
      if (modelList.models.some((m) => m.name.includes(modelName))) {
        return modelName
      }
    }
  } catch (error) {
    console.error("Error listing models:", error)
  }

  // If listing models fails, try each model directly
  for (const modelName of AVAILABLE_MODELS) {
    try {
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
  try {
    const { apiKey } = await request.json()

    if (!apiKey || apiKey.trim() === "") {
      return NextResponse.json({
        valid: false,
        reason: "API key is empty",
        details: "Please provide a valid Gemini API key",
      })
    }

    // Validate the API key format first
    if (!isValidApiKeyFormat(apiKey)) {
      return NextResponse.json({
        valid: false,
        reason: "API key format is invalid",
        details: "The API key format appears to be invalid. Google API keys typically start with 'AIza'",
      })
    }

    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(apiKey)

    // Find a working model
    const workingModelName = await findWorkingModel(genAI)

    if (!workingModelName) {
      return NextResponse.json({
        valid: false,
        reason: "No working Gemini models found",
        details: "The API key appears valid, but no working Gemini models were found for this key",
      })
    }

    return NextResponse.json({
      valid: true,
      model: workingModelName,
      details: `API key is valid for model: ${workingModelName}`,
    })
  } catch (error) {
    console.error("Error validating API key:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)

    return NextResponse.json({
      valid: false,
      reason: "Error validating API key",
      details: errorMessage,
      error: errorMessage,
    })
  }
}
