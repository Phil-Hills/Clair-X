import { NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt || prompt.trim() === "") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    console.log("Generating image with prompt:", prompt)
    console.log("Using Hugging Face URL:", process.env.HUGGINGFACE_SPACE_URL)

    // Use the direct Hugging Face Space URL
    const response = await fetch(`${process.env.HUGGINGFACE_SPACE_URL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        negative_prompt: "", // No censorship/filtering
        num_inference_steps: 30,
        guidance_scale: 7.5,
        width: 768,
        height: 768,
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

    // The response should be the image data
    const imageData = await response.arrayBuffer()
    const base64Image = Buffer.from(imageData).toString("base64")
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
