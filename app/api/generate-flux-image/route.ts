import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Get API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY || process.env.gemeni

    if (!apiKey) {
      console.log("Using fallback image generation (no API key)")
      return generateFallbackImage(prompt)
    }

    try {
      // Try to use Gemini for image description
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      // Generate a detailed description for the image
      const result = await model.generateContent(`Create a detailed description for an image of: ${prompt}`)
      const response = await result.response
      const description = response.text()

      // Use the description to create a placeholder image
      const imageUrl = `/placeholder.svg?height=512&width=512&query=${encodeURIComponent(description || prompt)}`

      return NextResponse.json({
        success: true,
        imageUrl,
        description,
      })
    } catch (error) {
      console.error("Error with Gemini:", error)
      return generateFallbackImage(prompt)
    }
  } catch (error) {
    console.error("Error generating image:", error)
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
  }
}

// Fallback function to generate a placeholder image
async function generateFallbackImage(prompt: string) {
  const imageUrl = `/placeholder.svg?height=512&width=512&query=${encodeURIComponent(prompt)}`

  return NextResponse.json({
    success: true,
    imageUrl,
    description: prompt,
    mode: "fallback",
  })
}
