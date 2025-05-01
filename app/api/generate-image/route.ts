import { NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt || prompt.trim() === "") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Use the Hugging Face Inference API instead of a custom endpoint
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
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
      },
    )

    if (!response.ok) {
      const error = await response.text()
      console.error("Hugging Face API error details:", error)
      return NextResponse.json({ error: `Hugging Face API error: ${error}` }, { status: response.status })
    }

    // The response is the image blob directly
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
