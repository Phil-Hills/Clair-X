"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, RefreshCw, ExternalLink } from "lucide-react"
import Link from "next/link"

interface ApiKeyStatusProps {
  onSetupClick?: () => void
}

export default function ApiKeyStatus({ onSetupClick }: ApiKeyStatusProps) {
  const [status, setStatus] = useState<"checking" | "valid" | "invalid" | "error">("checking")
  const [model, setModel] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const checkApiStatus = async () => {
    setStatus("checking")
    setIsRefreshing(true)

    try {
      // Check if there's a client-side API key
      const clientApiKey = localStorage.getItem("GEMINI_API_KEY")

      // If there's a client-side API key, we'll validate it
      if (clientApiKey) {
        try {
          const validationResponse = await fetch("/api/validate-api-key", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ apiKey: clientApiKey }),
          })

          const validationData = await validationResponse.json()

          if (validationData.valid) {
            setStatus("valid")
            setModel(validationData.model || "Gemini")
            setErrorMessage(null)
            setIsRefreshing(false)
            return
          } else {
            // If client-side API key is invalid, remove it
            localStorage.removeItem("GEMINI_API_KEY")
            setStatus("invalid")
            setErrorMessage(validationData.reason || "Client-side API key is invalid")
          }
        } catch (error) {
          console.error("Error validating client-side API key:", error)
          // Continue to check server-side API key
        }
      }

      // Check server-side API key
      const response = await fetch("/api/check-api-status")
      if (response.ok) {
        const data = await response.json()

        if (data.geminiAvailable) {
          setStatus("valid")
          setModel(data.model || "Gemini")
          setErrorMessage(null)
        } else {
          setStatus("invalid")
          setErrorMessage(data.reason || "API key not configured or invalid")
        }
      } else {
        setStatus("error")
        setErrorMessage("Error checking API status")
      }
    } catch (error) {
      console.error("Error checking API status:", error)
      setStatus("error")
      setErrorMessage("Error connecting to API status endpoint")
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    checkApiStatus()
  }, [])

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">API Key Status</h3>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={checkApiStatus} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </div>

      <div className="mt-2">
        {status === "checking" && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-2 w-2 animate-pulse rounded-full bg-muted"></div>
            <span className="text-sm">Checking API key status...</span>
          </div>
        )}

        {status === "valid" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">API key is valid ({model})</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Your API key is properly configured and working with the {model} model.
            </p>
          </div>
        )}

        {status === "invalid" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">API key is invalid or not configured</span>
            </div>
            {errorMessage && <p className="text-xs text-muted-foreground">{errorMessage}</p>}
            <div className="flex gap-2 mt-2">
              {onSetupClick ? (
                <Button size="sm" onClick={onSetupClick} className="h-8">
                  Configure API Key
                </Button>
              ) : (
                <Link href="/settings">
                  <Button size="sm" className="h-8">
                    Go to Settings
                  </Button>
                </Link>
              )}
              <a
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center gap-1 rounded-md bg-secondary px-3 text-xs hover:bg-secondary/80"
              >
                Get API Key <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Error checking API status</span>
            </div>
            {errorMessage && <p className="text-xs text-muted-foreground">{errorMessage}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
