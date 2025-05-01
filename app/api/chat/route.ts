import { StreamingTextResponse } from "ai"

export const runtime = "edge"

export async function POST(req: Request) {
  const { prompt } = await req.json()

  // Create a text generation stream using Hugging Face
  const response = await fetch(`${process.env.HUGGINGFACE_SPACE_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.1,
        do_sample: true,
      },
    }),
  })

  // Check if the response is OK
  if (!response.ok) {
    throw new Error(`Hugging Face API error: ${response.statusText}`)
  }

  // Return a streaming response
  return new StreamingTextResponse(response.body)
}
