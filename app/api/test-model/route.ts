import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { modelName, prompt, clientApiKey } = await request.json()

    if (!modelName) {
      return NextResponse.json({ success: false, error: "Model name is required" }, { status: 400 })
    }

    if (!prompt) {
      return NextResponse.json({ success: false, error: "Prompt is required" }, { status: 400 })
    }

    // Get API key (try client key first, then environment variable)
    const apiKey = clientApiKey || process.env.GEMINI_API_KEY || process.env.gemeni

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "No API key available. Please configure your Gemini API key.",
        },
        { status: 400 },
      )
    }

    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(apiKey)

    try {
      // Get the model
      const model = genAI.getGenerativeModel({ model: modelName })

      // Generate content
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      return NextResponse.json({
        success: true,
        text,
        model: modelName,
      })
    } catch (modelError) {
      console.error(`Error with model ${modelName}:`, modelError)
      const errorMessage = modelError instanceof Error ? modelError.message : String(modelError)

      // Check for specific API key errors
      if (errorMessage.includes("API_KEY_INVALID") || errorMessage.includes("API key not valid")) {
        return NextResponse.json({
          success: false,
          error: "The API key is invalid. Please check your API key and try again.",
        })
      }

      // Check for model not found errors
      if (errorMessage.includes("not found") || errorMessage.includes("not supported")) {
        return NextResponse.json({
          success: false,
          error: `Model ${modelName} is not available or not supported with this API key.`,
        })
      }

      return NextResponse.json({
        success: false,
        error: errorMessage,
      })
    }
  } catch (error) {
    console.error("Error testing model:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 },
    )
  }
}
