import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

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
    const { prompt, style, aspectRatio, numberOfOutputs } = data

    // Validate inputs
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Content safety check
    const isSafe = await performContentSafetyCheck(prompt)
    if (!isSafe) {
      return NextResponse.json(
        {
          error: "Your prompt contains content that violates our guidelines. Please revise and try again.",
        },
        { status: 400 },
      )
    }

    // Enhance the prompt with style information if not set to "auto"
    let enhancedPrompt = prompt
    if (style !== "auto") {
      enhancedPrompt = `${prompt} in ${style} style`
    }

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

    // Generate images
    const images = []
    for (let i = 0; i < numberOfOutputs; i++) {
      // Create a unique seed for each image
      const seed = Math.floor(Math.random() * 1000000)

      // In a real implementation, this would call the Gemini API
      // For now, we'll use placeholder images
      const imageUrl = `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(
        enhancedPrompt + " " + seed,
      )}`

      images.push({
        url: imageUrl,
        prompt,
        style,
        aspectRatio,
      })
    }

    return NextResponse.json({
      success: true,
      images,
    })
  } catch (error) {
    console.error("Error generating image:", error)
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
  }
}

// Content safety check function
async function performContentSafetyCheck(prompt: string): Promise<boolean> {
  // This would be replaced with a real content moderation API
  // For demonstration purposes, we'll implement a simple check
  const prohibitedTerms = [
    // List of terms that would violate content policies
  ]

  const lowerPrompt = prompt.toLowerCase()
  return !prohibitedTerms.some((term) => lowerPrompt.includes(term))
}
