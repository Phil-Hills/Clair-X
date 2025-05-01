/**
 * Utility functions for image processing and prompt enhancement
 */

export type PromptEnhancement = {
  category: string
  name: string
  description: string
  value: string
  selected?: boolean
}

export type PromptCategory = {
  name: string
  description: string
  enhancements: PromptEnhancement[]
}

/**
 * Applies a visual effect to an image based on a prompt
 * This is a client-side fallback when the API is not available
 */
export async function applyVisualEffect(sourceImage: string, prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        reject(new Error("Failed to get canvas context"))
        return
      }

      const img = new Image()
      img.crossOrigin = "anonymous"

      // Handle image loading errors
      img.onerror = () => {
        reject(new Error("Failed to load source image"))
      }

      img.onload = () => {
        try {
          canvas.width = img.width
          canvas.height = img.height

          // Draw the original image
          ctx.drawImage(img, 0, 0)

          // Apply visual changes based on the prompt
          const lowerPrompt = prompt.toLowerCase()

          // Apply different effects based on the prompt keywords
          if (lowerPrompt.includes("background")) {
            // Simulate background change with a gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
            gradient.addColorStop(0, "rgba(255, 100, 100, 0.5)")
            gradient.addColorStop(1, "rgba(100, 100, 255, 0.5)")
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.globalCompositeOperation = "source-over"
            ctx.drawImage(img, 0, 0)
          } else if (lowerPrompt.includes("style") || lowerPrompt.includes("artistic")) {
            // Simulate style change
            ctx.filter = "saturate(120%) contrast(110%) brightness(110%)"
            ctx.drawImage(img, 0, 0)
            ctx.filter = "none"
          } else if (lowerPrompt.includes("weather") || lowerPrompt.includes("rain")) {
            // Simulate rain effect
            ctx.fillStyle = "rgba(200, 200, 255, 0.2)"
            for (let i = 0; i < 100; i++) {
              const x = Math.random() * canvas.width
              const y = Math.random() * canvas.height
              const height = 5 + Math.random() * 15
              ctx.fillRect(x, y, 1, height)
            }
          } else if (lowerPrompt.includes("frame")) {
            // Simulate adding a frame
            const frameWidth = 20
            ctx.strokeStyle = "#8B4513"
            ctx.lineWidth = frameWidth
            ctx.strokeRect(0, 0, canvas.width, canvas.height)

            // Inner frame detail
            ctx.strokeStyle = "#D2B48C"
            ctx.lineWidth = frameWidth / 2
            ctx.strokeRect(frameWidth / 2, frameWidth / 2, canvas.width - frameWidth, canvas.height - frameWidth)
          } else if (lowerPrompt.includes("vintage") || lowerPrompt.includes("retro")) {
            // Vintage effect
            ctx.filter = "sepia(60%) contrast(90%) brightness(90%)"
            ctx.drawImage(img, 0, 0)
            ctx.filter = "none"
          } else if (lowerPrompt.includes("neon") || lowerPrompt.includes("glow")) {
            // Neon glow effect
            ctx.filter = "brightness(110%) contrast(120%) saturate(150%)"
            ctx.drawImage(img, 0, 0)
            ctx.shadowColor = "#00ffff"
            ctx.shadowBlur = 20
            ctx.lineWidth = 2
            ctx.strokeStyle = "#00ffff"
            ctx.strokeRect(0, 0, canvas.width, canvas.height)
            ctx.filter = "none"
          } else {
            // Default effect for other prompts - make a more visible change
            // Apply a color overlay
            ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // And add some contrast
            ctx.filter = "contrast(115%)"
            ctx.globalAlpha = 0.8
            ctx.drawImage(img, 0, 0)
            ctx.globalAlpha = 1.0
            ctx.filter = "none"
          }

          const result = canvas.toDataURL("image/jpeg")
          resolve(result)
        } catch (err) {
          reject(new Error(`Canvas processing error: ${err instanceof Error ? err.message : "Unknown error"}`))
        }
      }

      img.src = sourceImage
    } catch (err) {
      reject(new Error(`Image processing error: ${err instanceof Error ? err.message : "Unknown error"}`))
    }
  })
}

/**
 * Validates if a string is a valid image data URL
 */
export function isValidImageDataUrl(url: string): boolean {
  return url.startsWith("data:image/") && url.includes("base64,")
}

/**
 * Logs image processing debug information
 */
export function logImageProcessing(action: string, details: Record<string, any>): void {
  console.log(`[Image Processing] ${action}:`, details)
}

/**
 * Get prompt enhancement categories
 */
export function getPromptEnhancementCategories(): PromptCategory[] {
  return [
    {
      name: "Style",
      description: "Apply artistic styles to your image",
      enhancements: [
        {
          category: "style",
          name: "Photorealistic",
          description: "Ultra-realistic photographic style",
          value: "make this image photorealistic with perfect details",
        },
        {
          category: "style",
          name: "Watercolor",
          description: "Soft watercolor painting style",
          value: "convert to watercolor painting style",
        },
        {
          category: "style",
          name: "Oil Painting",
          description: "Classic oil painting texture",
          value: "convert to oil painting style with visible brush strokes",
        },
        {
          category: "style",
          name: "Sketch",
          description: "Hand-drawn sketch appearance",
          value: "convert to a detailed pencil sketch",
        },
        {
          category: "style",
          name: "Anime",
          description: "Japanese anime style",
          value: "convert to anime style illustration",
        },
        {
          category: "style",
          name: "Cinematic",
          description: "Movie-like composition",
          value: "make this image look cinematic with dramatic lighting",
        },
        {
          category: "style",
          name: "Vintage",
          description: "Retro film look",
          value: "apply vintage film effect with grain and faded colors",
        },
        {
          category: "style",
          name: "Neon",
          description: "Vibrant neon glow",
          value: "add neon glow effects with vibrant colors",
        },
      ],
    },
    {
      name: "Background",
      description: "Modify or replace the background",
      enhancements: [
        {
          category: "background",
          name: "Blur",
          description: "Blur the background",
          value: "blur the background to focus on the subject",
        },
        {
          category: "background",
          name: "Sunset",
          description: "Warm sunset backdrop",
          value: "change the background to a beautiful sunset",
        },
        {
          category: "background",
          name: "Nature",
          description: "Natural landscape",
          value: "change the background to a lush forest",
        },
        {
          category: "background",
          name: "Urban",
          description: "City environment",
          value: "change the background to an urban cityscape",
        },
        {
          category: "background",
          name: "Studio",
          description: "Clean studio backdrop",
          value: "change to a professional studio background",
        },
        {
          category: "background",
          name: "Beach",
          description: "Tropical beach scene",
          value: "change the background to a tropical beach",
        },
        {
          category: "background",
          name: "Mountains",
          description: "Mountain landscape",
          value: "change the background to majestic mountains",
        },
        {
          category: "background",
          name: "Remove",
          description: "Clean white background",
          value: "remove the background completely and make it white",
        },
      ],
    },
    {
      name: "Effects",
      description: "Add special effects to your image",
      enhancements: [
        {
          category: "effects",
          name: "Dramatic Light",
          description: "Enhanced lighting",
          value: "add dramatic lighting and shadows",
        },
        {
          category: "effects",
          name: "Weather",
          description: "Add weather elements",
          value: "add light rain effect to the scene",
        },
        {
          category: "effects",
          name: "Seasonal",
          description: "Change the season",
          value: "change the scene to winter with snow",
        },
        {
          category: "effects",
          name: "Frame",
          description: "Add decorative frame",
          value: "add an ornate vintage frame around the image",
        },
        {
          category: "effects",
          name: "Bokeh",
          description: "Soft background blur",
          value: "add bokeh light effects in the background",
        },
        {
          category: "effects",
          name: "Double Exposure",
          description: "Blend with another image",
          value: "create a double exposure effect with nature elements",
        },
        {
          category: "effects",
          name: "Glitch",
          description: "Digital glitch effect",
          value: "add digital glitch effects",
        },
        {
          category: "effects",
          name: "Duotone",
          description: "Two-color effect",
          value: "convert to duotone effect with contrasting colors",
        },
      ],
    },
    {
      name: "Adjustments",
      description: "Fine-tune image qualities",
      enhancements: [
        {
          category: "adjustments",
          name: "Enhance Details",
          description: "Sharpen and clarify",
          value: "enhance details and clarity throughout the image",
        },
        {
          category: "adjustments",
          name: "Fix Lighting",
          description: "Balance exposure",
          value: "fix lighting and exposure issues",
        },
        {
          category: "adjustments",
          name: "Vibrant Colors",
          description: "Boost color saturation",
          value: "make colors more vibrant and saturated",
        },
        {
          category: "adjustments",
          name: "Muted Tones",
          description: "Soften color palette",
          value: "create a muted color palette with soft tones",
        },
        {
          category: "adjustments",
          name: "High Contrast",
          description: "Increase contrast",
          value: "increase contrast for a more dramatic look",
        },
        {
          category: "adjustments",
          name: "Warm Tones",
          description: "Add warm color cast",
          value: "add warm color tones throughout the image",
        },
        {
          category: "adjustments",
          name: "Cool Tones",
          description: "Add cool color cast",
          value: "add cool color tones throughout the image",
        },
        {
          category: "adjustments",
          name: "Film Grain",
          description: "Add subtle texture",
          value: "add subtle film grain texture",
        },
      ],
    },
  ]
}

/**
 * Build a prompt from selected enhancements and base prompt
 */
export function buildEnhancedPrompt(basePrompt: string, selectedEnhancements: PromptEnhancement[]): string {
  if (!selectedEnhancements.length) return basePrompt

  const enhancementValues = selectedEnhancements.map((e) => e.value)
  return `${basePrompt}${basePrompt ? ". " : ""}${enhancementValues.join(". ")}`
}
