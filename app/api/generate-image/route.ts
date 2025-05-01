import { NextResponse } from "next/server"

export const runtime = "edge"

// Use a standard stable diffusion model from Hugging Face
const MODEL_ID = "stabilityai/stable-diffusion-xl-base-1.0"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt || prompt.trim() === "") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    console.log("Generating image with prompt:", prompt)

    // First, moderate the prompt
    const moderationResponse = await fetch(`${new URL(req.url).origin}/api/moderate-content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: prompt,
        contentType: "prompt",
      }),
    })

    const moderationResult = await moderationResponse.json()

    // If content is flagged as unsafe, return an error
    if (!moderationResult.safe) {
      return NextResponse.json(
        {
          error: "Prompt contains content that violates our guidelines",
          moderationResult,
        },
        { status: 400 },
      )
    }

    // Use the standard Hugging Face Inference API
    const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL_ID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          negative_prompt: "blurry, bad quality, distorted, disfigured",
          num_inference_steps: 30,
          guidance_scale: 7.5,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Hugging Face API error response:", errorText)
      return NextResponse.json(
        { error: `Image generation failed: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    // The response is the image blob directly
    const imageBlob = await response.blob()
    const imageArrayBuffer = await imageBlob.arrayBuffer()
    const base64Image = Buffer.from(imageArrayBuffer).toString("base64")
    const dataUrl = `data:image/jpeg;base64,${base64Image}`

    // Log success
    console.log("Image generated successfully")

    // Create an audit log entry
    const auditLog = {
      timestamp: new Date().toISOString(),
      prompt: prompt,
      userId: "demo-user", // In a real app, this would be the actual user ID
      success: true,
    }

    console.log("Audit log:", auditLog)

    return NextResponse.json({
      image: dataUrl,
      auditLog: auditLog,
    })
  } catch (error) {
    console.error("Image generation error:", error)
    return NextResponse.json({ error: "Failed to generate image. Please try again." }, { status: 500 })
  }
}
