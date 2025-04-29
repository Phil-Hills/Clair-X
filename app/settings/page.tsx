"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Key, User, Palette, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import ApiKeyInput from "@/components/api-key-input"
import ApiKeyStatus from "@/components/api-key-status"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("api-keys")
  const [apiStatus, setApiStatus] = useState<{
    isConfigured: boolean
    model?: string
  }>({ isConfigured: false })

  // Check API status on component mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch("/api/check-api-status")
        if (response.ok) {
          const data = await response.json()
          setApiStatus({
            isConfigured: data.geminiAvailable,
            model: data.model,
          })
        }
      } catch (error) {
        console.error("Error checking API status:", error)
      }
    }

    checkApiStatus()
  }, [])

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="mb-8 flex items-center gap-3">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold gradient-text">Settings</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-secondary">
          <TabsTrigger
            value="api-keys"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger
            value="account"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <User className="h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="gradient-text">API Key Status</CardTitle>
              <CardDescription>Check the current status of your API keys</CardDescription>
            </CardHeader>
            <CardContent>
              <ApiKeyStatus />
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="gradient-text">Gemini API Key</CardTitle>
              <CardDescription>Configure your Gemini API key for AI image and video generation</CardDescription>
            </CardHeader>
            <CardContent>
              <ApiKeyInput />
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="gradient-text">Environment Variables Setup</CardTitle>
              <CardDescription>
                For production use, you should set up the Gemini API key as an environment variable
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 rounded-md bg-secondary/50 p-3 font-mono text-xs">
                <p className="mb-2">GEMINI_API_KEY=your_api_key_here</p>
              </div>

              <p className="text-sm text-muted-foreground">
                You can add this to your Vercel project's environment variables in the{" "}
                <a
                  href="https://vercel.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  Vercel Dashboard <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Profile Information</h3>
                  <div className="rounded-md bg-secondary/50 p-4">
                    <p className="text-muted-foreground">Account settings will be available in a future update.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Authentication</h3>
                  <div className="rounded-md bg-secondary/50 p-4">
                    <p className="text-muted-foreground">
                      Authentication settings will be available in a future update.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of the application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Theme</h3>
                  <div className="rounded-md bg-secondary/50 p-4">
                    <p className="text-muted-foreground">Theme settings will be available in a future update.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Layout</h3>
                  <div className="rounded-md bg-secondary/50 p-4">
                    <p className="text-muted-foreground">Layout settings will be available in a future update.</p>
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
