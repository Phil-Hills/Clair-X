export type ImageStyle = "auto" | "realistic" | "cartoon" | "artistic"
export type AspectRatio = "1:1" | "3:2" | "4:3" | "16:9" | "9:16"

export interface GenerateImageParams {
  prompt: string
  style: ImageStyle
  numberOfOutputs: number
  aspectRatio: AspectRatio
}

export interface GeneratedImage {
  url: string
  prompt: string
  style: ImageStyle
  aspectRatio: AspectRatio
  description?: string
  model?: string
}
