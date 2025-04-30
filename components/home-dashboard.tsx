"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageIcon, Video, Zap, Settings, Info, CheckCircle, Sparkles, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import ApiKeyStatus from "./api-key-status"
import Link from "next/link"

interface HomeDashboardProps {
  onNavigate: (section: string) => void
  apiStatus: {
    isConfigured: boolean
    model?: string
  }
}

export default function HomeDashboard({ onNavigate, apiStatus }: HomeDashboardProps) {
  const { toast } = useToast()
  const [recentImages, setRecentImages] = useState<any[]>([])
  const [recentVideos, setRecentVideos] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("overview")

  // Simulate fetching recent items
  useEffect(() => {
    // This would be replaced with actual API calls in a real implementation
    setRecentImages([
      {
        id: "img1",
        url: "/chromatic-explosion.png",
        prompt: "Abstract art with vibrant colors",
        date: "2 hours ago",
      },
      {
        id: "img2",
        url: "/sunset-peaks.png",
        prompt: "Mountain landscape at sunset",
        date: "Yesterday",
      },
    ])

    setRecentVideos([
      {
        id: "vid1",
        thumbnail: "/city-drone-overview.png",
        prompt: "Drone flying over city",
        date: "3 hours ago",
      },
    ])
  }, [])

  return (
    <div className="flex flex-1 flex-col gap-6 p-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold gradient-text">Welcome to Clair-X</h1>
          <Sparkles className="h-6 w-6 text-primary animate-pulse" />
        </div>
        <p className="text-muted-foreground">Your AI-powered image and video generation platform</p>
      </div>

      <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0 md:max-w-[60%]">
            <h2 className="mb-2 text-2xl font-bold gradient-text">Unleash Your Creative Vision</h2>
            <p className="text-muted-foreground">
              Generate stunning images and videos with the power of AI. Just describe what you want to see, and Clair-X
              will bring it to life.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => onNavigate("image")} className="gap-2">
                <Zap className="h-4 w-4" />
                Try Image Generation
              </Button>
              <Button onClick={() => onNavigate("video")} variant="outline" className="gap-2">
                <Video className="h-4 w-4" />
                Try Video Generation
              </Button>
            </div>
          </div>
          <div className="relative h-40 w-40 md:h-48 md:w-48 overflow-hidden rounded-xl">
            <Image src="/clair-x-logo.png" alt="Clair X" fill className="object-cover" priority />
          </div>
        </div>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-secondary">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="status">System Status</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  <span>Image Generation</span>
                </CardTitle>
                <CardDescription>Create stunning AI-generated images from text descriptions</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="aspect-video relative overflow-hidden rounded-md bg-secondary">
                  <Image src="/digital-dreams.png" alt="AI Image Generation" fill className="object-cover" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full gap-2" onClick={() => onNavigate("image")}>
                  <Zap className="h-4 w-4" />
                  Generate Images
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  <span>Video Generation</span>
                </CardTitle>
                <CardDescription>Create AI-powered videos from text prompts</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="aspect-video relative overflow-hidden rounded-md bg-secondary">
                  <Image
                    src="/ai-video-generation-examples.png"
                    alt="AI Video Generation"
                    fill
                    className="object-cover"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full gap-2" onClick={() => onNavigate("video")}>
                  <Zap className="h-4 w-4" />
                  Generate Videos
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <span>API Configuration</span>
                </CardTitle>
                <CardDescription>Manage your API keys and settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">API Status:</span>
                    <div className="flex items-center gap-2">
                      {apiStatus.isConfigured ? (
                        <>
                          <span className="h-2 w-2 rounded-full bg-green-500"></span>
                          <span className="text-xs text-green-500">Active</span>
                        </>
                      ) : (
                        <>
                          <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                          <span className="text-xs text-yellow-500">Not Configured</span>
                        </>
                      )}
                    </div>
                  </div>
                  {apiStatus.isConfigured && apiStatus.model && (
                    <div className="mt-2 text-xs text-muted-foreground">Using model: {apiStatus.model}</div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full gap-2" variant="outline" onClick={() => onNavigate("api-setup")}>
                  <Settings className="h-4 w-4" />
                  Configure API
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-primary" />
                  <span>Model Testing</span>
                </CardTitle>
                <CardDescription>Test and verify Gemini model compatibility</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Verify Models:</span>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                      <span className="text-xs text-primary">gemini-1.5-flash</span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Test if your API key works with the latest Gemini models
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/test-models" className="w-full">
                  <Button className="w-full gap-2" variant="outline">
                    <RefreshCw className="h-4 w-4" />
                    Test Models
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          {!apiStatus.isConfigured && (
            <div className="rounded-md border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-500">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">API Key Not Configured</h3>
                  <p className="mt-1 text-sm">
                    To use AI-powered image and video generation, you need to configure your Gemini API key. Without an
                    API key, the application will use placeholder images instead.
                  </p>
                  <Button
                    className="mt-3 gap-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate("api-setup")}
                  >
                    <Settings className="h-4 w-4" />
                    Configure API Key
                  </Button>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  <span>Recent Images</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentImages.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {recentImages.map((image) => (
                      <div key={image.id} className="overflow-hidden rounded-md border border-border">
                        <div className="relative aspect-square">
                          <Image
                            src={image.url || "/placeholder.svg"}
                            alt={image.prompt}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-2">
                          <p className="line-clamp-1 text-sm font-medium">{image.prompt}</p>
                          <p className="text-xs text-muted-foreground">{image.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <ImageIcon className="mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No recent images</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" onClick={() => onNavigate("image")}>
                  View All Images
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  <span>Recent Videos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentVideos.length > 0 ? (
                  <div className="grid gap-4">
                    {recentVideos.map((video) => (
                      <div key={video.id} className="overflow-hidden rounded-md border border-border">
                        <div className="relative aspect-video">
                          <Image
                            src={video.thumbnail || "/placeholder.svg"}
                            alt={video.prompt}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="rounded-full bg-black/50 p-2">
                              <Video className="h-6 w-6 text-white" />
                            </div>
                          </div>
                        </div>
                        <div className="p-2">
                          <p className="line-clamp-1 text-sm font-medium">{video.prompt}</p>
                          <p className="text-xs text-muted-foreground">{video.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <Video className="mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No recent videos</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" onClick={() => onNavigate("video")}>
                  View All Videos
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Check the status of various components of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ApiKeyStatus onSetupClick={() => onNavigate("api-setup")} />

              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md border border-border p-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Image Generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-500">Operational</span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-md border border-border p-3">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Video Generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-500">Operational</span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-md border border-border p-3">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">User Settings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-500">Operational</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
