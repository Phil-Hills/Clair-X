"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingButton } from "@/components/ui/loading-button"
import { useToast } from "@/components/ui/use-toast"
import { Key, Save, Check, AlertCircle, ExternalLink } from "lucide-react"

export default function ApiKeySetup() {
  const { toast } = useToast()
  const [geminiKey, setGeminiKey] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isConfigured, setIsConfigured] = useState(false)
  const [apiStatus, setApiStatus] = useState<{
    status: "unchecked" | "valid" | "invalid"
    message?: string
  }>({ status: "unchecked" })

  // Check current API status on load
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch("/api/check-api-status")
        if (response.ok) {
          const data = await response.json()
          if (data.geminiAvailable) {
            setApiStatus({ status: "valid", message: "API key is valid and working" })
            setIsConfigured(true)
          } else {
            setApiStatus({
              status: "invalid",
              message: data.reason || "API key is not configured or invalid",
            })
            setIsConfigured(false)
          }
        } else {
          setApiStatus({ status: "invalid", message: "Error checking API status" })
        }
      } catch (error) {
        console.error("Error checking API status:", error)
        setApiStatus({ status: "invalid", message: "Error connecting to API status endpoint" })
      }
    }

    checkApiStatus()
  }, [])

  const handleSaveKey = async () => {
    if (!geminiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    setApiStatus({ status: "unchecked" })

    try {
      // In a real app, this would securely store the API key
      // For now, we'll simulate saving by setting a session storage item
      sessionStorage.setItem("GEMINI_API_KEY", geminiKey)

      // Make a request to validate the API key
      const response = await fetch("/api/validate-api-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey: geminiKey }),
      })

      const data = await response.json()

      if (data.valid) {
        setIsConfigured(true)
        setApiStatus({ status: "valid", message: "API key is valid and working" })
        toast({
          title: "API Key Saved",
          description: "Your Gemini API key has been validated and saved successfully",
        })
      } else {
        setIsConfigured(false)
        setApiStatus({ status: "invalid", message: data.reason || "API key is invalid" })
        toast({
          title: "Invalid API Key",
          description: data.reason || "The API key could not be validated. Please check and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving API key:", error)
      setApiStatus({ status: "invalid", message: "Error validating API key" })
      toast({
        title: "Error Saving API Key",
        description: "There was a problem saving your API key. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-md">
      <div className="mb-4 flex items-center gap-2">
        <Key className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-medium gradient-text">Gemini API Configuration</h2>
      </div>

      {apiStatus.status === "valid" && (
        <div className="mb-4 flex items-center gap-2 rounded-md border border-green-500/30 bg-green-500/10 p-3 text-green-500">
          <Check className="h-4 w-4" />
          <span className="text-sm">{apiStatus.message}</span>
        </div>
      )}

      {apiStatus.status === "invalid" && (
        <div className="mb-4 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{apiStatus.message}</span>
        </div>
      )}

      <div className="mb-6">
        <p className="mb-4 text-sm text-muted-foreground">
          Enter your Gemini API key to enable AI image and video generation. You can get a key from the{" "}
          <a
            href="https://makersuite.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            Google AI Studio <ExternalLink className="h-3 w-3" />
          </a>
        </p>

        <div className="flex gap-2">
          <Input
            type="password"
            placeholder="Enter your Gemini API key"
            value={geminiKey}
            onChange={(e) => setGeminiKey(e.target.value)}
            className="bg-secondary border-secondary"
          />

          {isConfigured && apiStatus.status === "valid" ? (
            <Button variant="outline" className="gap-2 border-green-500 text-green-500" disabled>
              <Check className="h-4 w-4" />
              Configured
            </Button>
          ) : (
            <LoadingButton onClick={handleSaveKey} isLoading={isSaving} loadingText="Validating..." className="gap-2">
              <Save className="h-4 w-4" />
              Save Key
            </LoadingButton>
          )}
        </div>
      </div>

      <div className="rounded-md bg-secondary/50 p-3 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">Important Notes:</p>
        <ul className="mt-1 list-disc pl-4 space-y-1">
          <li>Make sure you have enabled the Gemini API in your Google Cloud project</li>
          <li>The API key should start with "AIza..."</li>
          <li>For this demo, the key is stored in your browser's session storage</li>
          <li>In production, API keys should be stored securely on the server</li>
        </ul>
      </div>
    </div>
  )
}
