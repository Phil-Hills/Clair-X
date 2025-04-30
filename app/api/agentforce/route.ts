import { NextResponse } from "next/server"

// Mock CRM data
const mockCustomers = {
  "SF-10042": {
    name: "Alex Johnson",
    preferences: ["Modern design", "Vibrant colors", "Technology"],
    recentPurchases: ["Cloud Services", "AI Development Tools"],
    marketingSegment: "Tech Professional",
  },
  "SF-10043": {
    name: "Sarah Williams",
    preferences: ["Minimalist", "Pastel colors", "Nature"],
    recentPurchases: ["Marketing Analytics", "CRM Premium"],
    marketingSegment: "Marketing Executive",
  },
}

export async function POST(request: Request) {
  try {
    const { customerId, prompt } = await request.json()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Get customer data
    const customer = mockCustomers[customerId as keyof typeof mockCustomers] || {
      name: "Unknown Customer",
      preferences: ["Default style"],
      recentPurchases: [],
      marketingSegment: "General",
    }

    // Enhance prompt with CRM data
    const preferences = customer.preferences.join(", ")
    const enhancedPrompt = `${prompt} with ${preferences} style, tailored for a ${customer.marketingSegment}`

    // Generate agent response
    const agentResponse = `I've enhanced your prompt based on ${customer.name}'s preferences (${preferences}) and their segment (${customer.marketingSegment}).`

    return NextResponse.json({
      enhancedPrompt,
      agentResponse,
      customerData: customer,
    })
  } catch (error) {
    console.error("Error in Agentforce API:", error)
    return NextResponse.json({ error: "Failed to process Agentforce request" }, { status: 500 })
  }
}
