import { NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(req: Request) {
  try {
    const { content, contentType } = await req.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // In a real application, this would call a content moderation API
    // For demo purposes, we'll simulate a moderation check
    const moderationResult = simulateContentModeration(content, contentType)

    return NextResponse.json({
      safe: moderationResult.safe,
      categories: moderationResult.categories,
      score: moderationResult.score,
      message: moderationResult.message,
    })
  } catch (error) {
    console.error("Content moderation error:", error)
    return NextResponse.json({ error: "Failed to moderate content" }, { status: 500 })
  }
}

// Simulate content moderation
function simulateContentModeration(content: string, contentType: string) {
  // This is a simplified simulation
  // In a real app, you would use a proper content moderation API

  const lowercaseContent = content.toLowerCase()
  const flaggedTerms = ["explicit", "offensive", "harmful", "illegal", "violence"]

  const hasFlag = flaggedTerms.some((term) => lowercaseContent.includes(term))

  if (hasFlag) {
    return {
      safe: false,
      categories: {
        harmful: true,
        offensive: true,
      },
      score: 0.85,
      message: "Content may violate community guidelines",
    }
  }

  return {
    safe: true,
    categories: {
      harmful: false,
      offensive: false,
    },
    score: 0.05,
    message: "Content appears to be safe",
  }
}
