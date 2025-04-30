import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { modelName, prompt, apiKey } = await request.json()

    if (!modelName || !prompt || !apiKey) {
      return NextResponse.json({
        success: false,
        error: "Missing required parameters: modelName, prompt, or apiKey",
      })
    }

    console.log(`Testing model: ${modelName} with prompt: ${prompt.substring(0, 30)}...`)

    try {
      // Initialize the Google Generative AI client
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: modelName })

      // Generate content with the provided prompt
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      return NextResponse.json({
        success: true,
        model: modelName,
        text,
      })
    } catch (error) {
      console.error(`Error testing model ${modelName}:`, error)
      const errorMessage = error instanceof Error ? error.message : String(error)

      return NextResponse.json({
        success: false,
        model: modelName,
        error: errorMessage,
      })
    }
  } catch (error) {
    console.error("Error in test-model API route:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
