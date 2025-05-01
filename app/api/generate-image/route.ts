import { NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt || prompt.trim() === "") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const response = await fetch(`${process.env.HUGGINGFACE_SPACE_URL}/api/generate-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        negative_prompt: "blurry, bad quality, distorted",
        num_inference_steps: 30,
        guidance_scale: 7.5,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json({ error: `Hugging Face API error: ${error}` }, { status: response.status })
    }

    const imageBlob = await response.blob()
    const imageArrayBuffer = await imageBlob.arrayBuffer()
    const base64Image = Buffer.from(imageArrayBuffer).toString("base64")
    const dataUrl = `data:image/jpeg;base64,${base64Image}`

    return NextResponse.json({ image: dataUrl })
  } catch (error) {
    console.error("Image generation error:", error)
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
  }
}
