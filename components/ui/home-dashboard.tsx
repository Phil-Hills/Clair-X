"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageIcon, Video, MessageCircle, Zap, Settings, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface HomeDashboardProps {
  onNavigate: (section: "home" | "image" | "video" | "api-setup") => void
  apiStatus: {
    isConfigured: boolean
    model?: string
  }
}

export default function HomeDashboard({ onNavigate, apiStatus }: HomeDashboardProps) {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text">Welcome to Clair-X</h1>
        <p className="text-muted-foreground mt-2">Your AI-powered platform for image and video generation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              <span>AI Image Generator</span>
            </CardTitle>
            <CardDescription>Create stunning images from text descriptions</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="aspect-video relative rounded-md overflow-hidden mb-4">
              <Image src="/digital-dreams.png" alt="AI Generated Image" fill className="object-cover" />
            </div>
            <p className="text-sm text-muted-foreground">
              Transform your ideas into beautiful images with our AI-powered image generator.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => onNavigate("image")}>
              Generate Images
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              <span>AI Video Generator</span>
            </CardTitle>
            <CardDescription>Create engaging videos from text prompts</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="aspect-video relative rounded-md overflow-hidden mb-4">
              <Image src="/ai-video-generation-examples.png" alt="AI Generated Video" fill className="object-cover" />
            </div>
            <p className="text-sm text-muted-foreground">
              Bring your stories to life with AI-generated videos that captivate your audience.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => onNavigate("video")}>
              Generate Videos
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <span>AI Chat Assistant</span>
            </CardTitle>
            <CardDescription>Chat with our AI assistant for creative help</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="aspect-video relative rounded-md overflow-hidden mb-4 bg-secondary/50 flex items-center justify-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Get creative assistance, generate ideas, and refine your prompts with our AI chat assistant.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline">
              Coming Soon
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span>Model Testing</span>
            </CardTitle>
            <CardDescription>Test Gemini model compatibility and performance</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className={`p-4 rounded-md ${apiStatus.isConfigured ? "bg-green-500/10" : "bg-yellow-500/10"} mb-4`}>
              {apiStatus.isConfigured ? (
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Using {apiStatus.model || "Gemini"}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-yellow-500">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">API key not configured</span>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Verify model compatibility, test response times, and troubleshoot API issues.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/test-gemini" className="w-full">
              <Button className="w-full">Test Models</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <span>API Configuration</span>
            </CardTitle>
            <CardDescription>Configure your Gemini API key</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className={`p-4 rounded-md ${apiStatus.isConfigured ? "bg-green-500/10" : "bg-yellow-500/10"} mb-4`}>
              {apiStatus.isConfigured ? (
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">API key configured</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-yellow-500">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">API key not configured</span>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Set up your Gemini API key to enable AI-powered image and video generation.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => onNavigate("api-setup")}>
              Configure API
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
