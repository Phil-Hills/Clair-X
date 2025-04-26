// Standard configuration for the image generation system
export const defaultGenerationConfig = {
  // Available generation modes
  allowedModes: ["Standard", "Creative", "Artistic", "Photorealistic", "Cinematic"],

  // Available style options
  styleOptions: ["Portrait", "Landscape", "Abstract", "Surreal", "Minimalist"],

  // Quality settings
  qualitySettings: ["Standard", "HD", "Ultra HD"],

  // Safety settings - these should always be enabled
  contentGuidelines: true,
  moderationActive: true,
  safetyFilters: true,

  // Default settings
  defaults: {
    mode: "Standard",
    style: "Portrait",
    quality: "HD",
    aspectRatio: "1:1",
  },
}

// Function to validate user input against safety guidelines
export function validatePrompt(prompt: string): { isValid: boolean; message?: string } {
  if (!prompt || prompt.trim() === "") {
    return { isValid: false, message: "Please enter a prompt" }
  }

  // In a real implementation, this would check against a comprehensive list
  // of prohibited content and use more sophisticated content moderation
  const prohibitedTerms = [
    // List would be populated with terms that violate content policies
  ]

  const lowerPrompt = prompt.toLowerCase()
  const foundTerm = prohibitedTerms.find((term) => lowerPrompt.includes(term))

  if (foundTerm) {
    return {
      isValid: false,
      message: "Your prompt contains content that violates our guidelines. Please revise and try again.",
    }
  }

  return { isValid: true }
}
