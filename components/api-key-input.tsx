"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { LoadingButton } from "@/components/ui/loading-button"
import { useToast } from "@/components/ui/use-toast"
import { Key, Save, Check, AlertCircle, ExternalLink, RefreshCw, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ApiKeyInput() {
  const { toast } = useToast()
  const [apiKey, setApiKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [savedApiKey, setSavedApiKey] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  // Check for existing API key in localStorage on component mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem("GEMINI_API_KEY")
    if (storedApiKey) {
      setSavedApiKey(storedApiKey)
      setApiKey(storedApiKey)

      // Validate the stored API key
      validateStoredApiKey(storedApiKey)
    }
  }, [])

  // Function to validate a stored API key
  const validateStoredApiKey = async (key: string) => {
    setIsVerifying(true)
    setStatus("idle")

    try {
      const response = await fetch("/api/validate-api-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey: key }),
      })

      const data = await response.json()

      if (data.valid) {
        setStatus("success")
        setMessage(`API key is valid and working with model: ${data.model || "Gemini"}`)
      } else {
        setStatus("error")
        setMessage(data.reason || "Stored API key is invalid")

        // Remove invalid API key from localStorage
        localStorage.removeItem("GEMINI_API_KEY")
        setSavedApiKey(null)

        toast({
          title: "Invalid Stored API Key",
          description: data.reason || "The stored API key is invalid. Please enter a new one.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error validating stored API key:", error)
      setStatus("error")
      setMessage("Error validating stored API key")

      // Remove potentially invalid API key
      localStorage.removeItem("GEMINI_API_KEY")
      setSavedApiKey(null)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key",
        variant: "destructive",
      })
      return
    }

    // Basic format validation
    if (!apiKey.startsWith("AIza") || apiKey.length < 20) {
      setStatus("error")
      setMessage(
        "API key format appears invalid. Gemini API keys typically start with 'AIza' and are at least 20 characters long",
      )
      toast({
        title: "Invalid API Key Format",
        description:
          "The API key format appears to be invalid. Gemini API keys typically start with 'AIza' and are at least 20 characters long",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setStatus("idle")
    setMessage("")

    try {
      // Validate the API key
      const response = await fetch("/api/validate-api-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey }),
      })

      const data = await response.json()

      if (data.valid) {
        // Store in localStorage for demo purposes
        localStorage.setItem("GEMINI_API_KEY", apiKey)
        setSavedApiKey(apiKey)

        setStatus("success")
        setMessage(`API key is valid and working with model: ${data.model || "Gemini"}`)

        toast({
          title: "API Key Saved",
          description: `Your Gemini API key has been saved successfully. Using model: ${data.model || "Gemini"}`,
        })

        // Reload the page to apply the new API key
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        setStatus("error")
        setMessage(data.reason || "API key is invalid")

        toast({
          title: "Invalid API Key",
          description: data.reason || "The API key could not be validated. Please check and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving API key:", error)
      setStatus("error")
      setMessage("Error validating API key")

      toast({
        title: "Error Saving API Key",
        description: "There was a problem saving your API key. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearApiKey = () => {
    localStorage.removeItem("GEMINI_API_KEY")
    setSavedApiKey(null)
    setApiKey("")
    setStatus("idle")
    setMessage("")

    toast({
      title: "API Key Cleared",
      description: "Your API key has been removed from local storage.",
    })
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-lg border border-border bg-card shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-medium">Gemini API Key</h2>
        </div>
        {savedApiKey && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => validateStoredApiKey(savedApiKey)}
            disabled={isVerifying}
            className="h-8 gap-1"
          >
            <RefreshCw className={`h-3 w-3 ${isVerifying ? "animate-spin" : ""}`} />
            Verify Key
          </Button>
        )}
      </div>

      {status === "success" && (
        <div className="mb-4 flex items-center gap-2 rounded-md border border-green-500/30 bg-green-500/10 p-3 text-green-500">
          <Check className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{message}</span>
        </div>
      )}

      {status === "error" && (
        <div className="mb-4 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{message}</span>
        </div>
      )}

      <div className="mb-4">
        <p className="mb-2 text-sm text-muted-foreground">
          {savedApiKey
            ? "Your API key is saved. You can update it below if needed."
            : "Enter your Gemini API key to enable AI image generation."}
        </p>
        <div className="flex gap-2">
          <Input
            type="password"
            placeholder="Enter your Gemini API key (starts with AIza...)"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="bg-secondary border-secondary"
          />

          <LoadingButton
            onClick={handleSaveKey}
            isLoading={isLoading}
            loadingText="Saving..."
            className="gap-2 whitespace-nowrap"
          >
            <Save className="h-4 w-4" />
            Save Key
          </LoadingButton>
        </div>
      </div>

      {savedApiKey && (
        <div className="mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearApiKey}
            className="text-destructive border-destructive/30 hover:bg-destructive/10 gap-1"
          >
            <Trash className="h-3 w-3" />
            Clear saved API key
          </Button>
        </div>
      )}

      <div className="text-xs text-muted-foreground space-y-2">
        <p>
          You can get a Gemini API key from the{" "}
          <a
            href="https://makersuite.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            Google AI Studio <ExternalLink className="h-3 w-3" />
          </a>
        </p>
        <p>
          Make sure you have enabled the Gemini API in your Google Cloud project and that the API key has access to the
          Gemini models.
        </p>
        <p className="mt-2 pt-2 border-t border-border">
          <strong>Troubleshooting:</strong> If you're having issues with your API key, try the following:
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Verify that you've copied the entire API key correctly</li>
          <li>Ensure your API key has access to the Gemini models</li>
          <li>Check if you've enabled the Gemini API in your Google Cloud project</li>
          <li>Try creating a new API key if the current one isn't working</li>
        </ul>
      </div>
    </div>
  )
}
