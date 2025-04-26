"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Video, Zap, Download, Trash2, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Slider } from "@/components/ui/slider"
import VideoPlayer from "./video-player"

interface VideoStyle {
  id: string
  name: string
  description: string
}

interface VideoResolution {
  id: string
  label: string
  width: number
  height: number
}

interface GeneratedVideo {
  id: string
  url: string
  prompt: string
  style: string
  duration: number
  thumbnail: string
}

export default function VideoGenerator() {
  const { toast } = useToast()
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState<string>("realistic")
  const [duration, setDuration] = useState(15)
  const [resolution, setResolution] = useState<string>("hd")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([])
  const [history, setHistory] = useState<GeneratedVideo[]>([])
  const [activeTab, setActiveTab] = useState("generator")
  const [error, setError] = useState<string | null>(null)

  // Video style options
  const videoStyles: VideoStyle[] = [
    { id: "realistic", name: "Realistic", description: "Photorealistic video generation" },
    { id: "cinematic", name: "Cinematic", description: "Movie-like quality with dramatic lighting" },
    { id: "animation", name: "Animation", description: "Animated style videos" },
    { id: "stylized", name: "Stylized", description: "Artistic stylized videos" },
  ]

  // Video resolution options
  const videoResolutions: VideoResolution[] = [
    { id: "sd", label: "SD (480p)", width: 854, height: 480 },
    { id: "hd", label: "HD (720p)", width: 1280, height: 720 },
    { id: "fullhd", label: "Full HD (1080p)", width: 1920, height: 1080 },
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          style,
          duration,
          resolution,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate video")
      }

      const data = await response.json()
      setGeneratedVideos(data.videos)
      setHistory((prev) => [...data.videos, ...prev])

      toast({
        title: "Video generated successfully",
        description: `Created a ${duration}-second video based on your prompt.`,
      })
    } catch (error) {
      console.error("Error generating video:", error)
      setError("Failed to generate video. Please try again.")

      toast({
        title: "Error generating video",
        description: "There was a problem generating your video. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDeleteVideo = (id: string) => {
    setHistory((prev) => prev.filter((video) => video.id !== id))
    toast({
      title: "Video deleted",
      description: "The video has been removed from your history.",
    })
  }

  const handleDownload = (videoUrl: string, index: number) => {
    fetch(videoUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `clair-x-video-${index}.mp4`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)

        toast({
          title: "Video downloaded",
          description: "The video has been saved to your device.",
        })
      })
      .catch((error) => {
        console.error("Error downloading video:", error)
        toast({
          title: "Download failed",
          description: "There was a problem downloading the video.",
          variant: "destructive",
        })
      })
  }

  return (
    <div className="flex flex-1">
      <main className="flex flex-1 bg-gray-50 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col">
          <TabsList className="mb-4 self-center">
            <TabsTrigger value="generator">Generator</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="flex flex-1">
            {/* Left Panel - Controls */}
            <div className="w-[380px] overflow-y-auto rounded-lg bg-white p-4 shadow-sm">
              <div className="mb-6">
                <h2 className="mb-2 text-sm font-medium text-gray-700">Model</h2>
                <div className="rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Human Like Video</span>
                    <span className="rounded bg-purple-100 px-2 py-0.5 text-xs text-purple-600">Premium</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">Generate realistic human-like videos</p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="mb-2 text-sm font-medium text-gray-700">Prompt</h2>
                <Textarea
                  placeholder="Describe the video you want to create..."
                  className="min-h-[100px] resize-none"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Be specific about the scene, actions, and any specific details you want in the video.
                </p>
              </div>

              <div className="mb-6">
                <h2 className="mb-2 text-sm font-medium text-gray-700">Style</h2>
                <Select value={style} onValueChange={(value) => setStyle(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {videoStyles.map((style) => (
                      <SelectItem key={style.id} value={style.id}>
                        <div className="flex flex-col">
                          <span>{style.name}</span>
                          <span className="text-xs text-gray-500">{style.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-6">
                <h2 className="mb-2 text-sm font-medium text-gray-700">Duration (seconds)</h2>
                <div className="space-y-2">
                  <Slider
                    value={[duration]}
                    min={5}
                    max={30}
                    step={5}
                    onValueChange={(value) => setDuration(value[0])}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>5s</span>
                    <span>15s</span>
                    <span>30s</span>
                  </div>
                  <div className="text-center text-sm font-medium">{duration} seconds</div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="mb-2 text-sm font-medium text-gray-700">Resolution</h2>
                <Select value={resolution} onValueChange={(value) => setResolution(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select resolution" />
                  </SelectTrigger>
                  <SelectContent>
                    {videoResolutions.map((res) => (
                      <SelectItem key={res.id} value={res.id}>
                        {res.label} ({res.width}x{res.height})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-md bg-red-50 p-3 text-red-700">
                  <AlertCircle size={16} />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <Button
                className="mt-4 w-full gap-2 bg-purple-600 text-white hover:bg-purple-700"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
              >
                <Zap size={16} />
                {isGenerating ? "Generating..." : "Generate Video"}
              </Button>
            </div>

            {/* Right Panel - Preview */}
            <div className="ml-4 flex flex-1 rounded-lg bg-white p-4 shadow-sm">
              {isGenerating ? (
                <div className="flex w-full flex-col items-center justify-center gap-4">
                  <Skeleton className="h-[360px] w-full max-w-[640px] rounded-md" />
                  <div className="flex w-full max-w-[640px] flex-col gap-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ) : generatedVideos.length > 0 ? (
                <div className="flex w-full flex-col items-center gap-6">
                  {generatedVideos.map((video, index) => (
                    <div key={video.id} className="w-full max-w-[640px]">
                      <div className="group relative overflow-hidden rounded-md">
                        <VideoPlayer
                          src={video.url}
                          poster={video.thumbnail}
                          id={video.id}
                          onError={(error) => {
                            console.error("Video playback error:", error)
                            setError("Error playing video. Please try again.")
                          }}
                        />
                        <div className="mt-2 flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-800">Generated Video {index + 1}</h3>
                            <p className="text-sm text-gray-600">
                              {video.duration}s • {videoStyles.find((s) => s.id === video.style)?.name}
                            </p>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleDownload(video.url, index)}
                          >
                            <Download size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-md border border-gray-200 bg-gray-50">
                    <Video className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">No Videos Generated</h3>
                  <p className="max-w-md text-sm text-gray-500">
                    Enter a prompt and click "Generate Video" to start creating! Your videos will be displayed here.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="flex-1">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold">Video History</h2>
              {history.length > 0 ? (
                <div className="grid grid-cols-2 gap-6">
                  {history.map((video, index) => (
                    <div key={video.id} className="overflow-hidden rounded-md">
                      <VideoPlayer
                        src={video.url}
                        poster={video.thumbnail}
                        id={`history-${video.id}`}
                        onError={(error) => {
                          console.error("Video playback error:", error)
                          setError("Error playing video. Please try again.")
                        }}
                      />
                      <div className="mt-2 flex items-center justify-between">
                        <div>
                          <p className="line-clamp-1 font-medium">{video.prompt}</p>
                          <p className="text-xs text-gray-500">
                            {video.duration}s • {videoStyles.find((s) => s.id === video.style)?.name}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleDownload(video.url, index)}
                          >
                            <Download size={16} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleDeleteVideo(video.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Video className="mb-4 h-12 w-12 text-gray-300" />
                  <h3 className="mb-2 text-lg font-medium">No Videos Yet</h3>
                  <p className="text-gray-500">Generate some videos to see your history here.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
