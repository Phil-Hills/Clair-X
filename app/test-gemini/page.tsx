"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle, ArrowLeft, RefreshCw } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

// List of models to test in order of preference
const MODELS_TO_TEST = [
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", priority: "Primary" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", priority: "Secondary" },
  { id: "gemini-pro", name: "Gemini Pro", priority: "Fallback" },
]

interface ModelTestResult {
  modelId: string
  modelName: string
  success: boolean
  response?: string
  error?: string
  timeTaken?: number
}

export default function TestGeminiPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<ModelTestResult[]>([])
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [testPrompt, setTestPrompt] = useState("Describe a beautiful sunset in 3 sentences.")
  const [logs, setLogs] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("test")
  const [apiStatus, setApiStatus] = useState<"checking" | "valid" | "invalid" | "error">("checking")
  const [apiStatusMessage, setApiStatusMessage] = useState<string | null>(null)

  // Check for API key on component mount
  useEffect(() => {
    checkApiStatus()
  }, [])

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  const checkApiStatus = async () => {
    setApiStatus("checking")
    setApiStatusMessage(null)

    try {
      // Check if there's a client-side API key
      const clientApiKey = localStorage.getItem("GEMINI_API_KEY")

      if (clientApiKey) {
        setApiKey(clientApiKey)
        addLog("Found API key in local storage")

        // Validate the key
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
            setApiStatus("valid")
            setApiStatusMessage(`API key is valid for model: ${validationData.model || "Gemini"}`)
            addLog(`API key validated successfully for model: ${validationData.model || "Gemini"}`)
            return
          } else {
            // If client-side API key is invalid, remove it
            localStorage.removeItem("GEMINI_API_KEY")
            setApiKey(null)
            setApiStatus("invalid")
            setApiStatusMessage(validationData.reason || "Client-side API key is invalid")
            addLog(`API key validation failed: ${validationData.reason || "Unknown error"}`)
          }
        } catch (error) {
          console.error("Error validating client-side API key:", error)
          addLog(`Error validating API key: ${error instanceof Error ? error.message : String(error)}`)
        }
      } else {
        addLog("No API key found in local storage")
      }

      // Check server-side API key
      const response = await fetch("/api/check-api-status")
      if (response.ok) {
        const data = await response.json()

        if (data.geminiAvailable) {
          setApiStatus("valid")
          setApiStatusMessage(`Server-side API key is valid for model: ${data.model || "Gemini"}`)
          addLog(`Server-side API key is valid for model: ${data.model || "Gemini"}`)
        } else {
          setApiStatus("invalid")
          setApiStatusMessage(data.reason || "API key not configured or invalid")
          addLog(`Server-side API key check failed: ${data.reason || "Unknown error"}`)
        }
      } else {
        setApiStatus("error")
        setApiStatusMessage("Error checking API status")
        addLog("Error checking server-side API status")
      }
    } catch (error) {
      console.error("Error checking API status:", error)
      setApiStatus("error")
      setApiStatusMessage("Error connecting to API status endpoint")
      addLog(`Error checking API status: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  const testModel = async (modelId: string, modelName: string) => {
    const clientApiKey = localStorage.getItem("GEMINI_API_KEY")

    addLog(`Testing model: ${modelName} (${modelId})...`)
    const startTime = performance.now()

    try {
      const response = await fetch("/api/test-model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          modelName: modelId,
          prompt: testPrompt,
          clientApiKey,
        }),
      })

      const data = await response.json()
      const timeTaken = Math.round(performance.now() - startTime) / 1000

      if (data.success) {
        addLog(`✅ Model ${modelName} test successful (${timeTaken}s)`)
        return {
          modelId,
          modelName,
          success: true,
          response: data.text,
          timeTaken,
        }
      } else {
        addLog(`❌ Model ${modelName} test failed: ${data.error}`)
        return {
          modelId,
          modelName,
          success: false,
          error: data.error,
          timeTaken,
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      addLog(`❌ Error testing model ${modelName}: ${errorMessage}`)
      return {
        modelId,
        modelName,
        success: false,
        error: errorMessage,
      }
    }
  }

  const runTests = async () => {
    setIsLoading(true)
    setResults([])
    addLog("Starting model tests...")

    const newResults: ModelTestResult[] = []

    for (const model of MODELS_TO_TEST) {
      const result = await testModel(model.id, model.name)
      newResults.push(result)
      setResults([...newResults]) // Update results after each test

      // If we found a working model, we can stop testing
      if (result.success) {
        addLog(`Found working model: ${model.name}. Stopping tests.`)
        break
      }
    }

    if (!newResults.some((result) => result.success)) {
      addLog("⚠️ No working models found. Please check your API key and permissions.")
      toast({
        title: "No working models found",
        description: "Please check your API key and ensure it has access to Gemini models.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
    addLog("All tests completed")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold gradient-text">Gemini Model Verification</h1>
        <p className="text-muted-foreground">
          This page tests if the system can successfully use the gemini-1.5-flash model and other Gemini models.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-secondary">
          <TabsTrigger
            value="test"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Test Models
          </TabsTrigger>
          <TabsTrigger
            value="logs"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Key Status</CardTitle>
              <CardDescription>Verify your Gemini API key is properly configured</CardDescription>
            </CardHeader>
            <CardContent>
              {apiStatus === "checking" ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-muted"></div>
                  <span className="text-sm">Checking API key status...</span>
                </div>
              ) : apiStatus === "valid" ? (
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">{apiStatusMessage}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{apiStatusMessage}</span>
                </div>
              )}

              <Button variant="outline" size="sm" onClick={checkApiStatus} className="mt-4 gap-1">
                <RefreshCw className="h-3 w-3" />
                Refresh Status
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Configuration</CardTitle>
              <CardDescription>Configure your test prompt and run model tests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Test Prompt</h3>
                <Textarea
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  placeholder="Enter a test prompt"
                  className="min-h-[80px]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This prompt will be sent to each model to test its functionality.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Models to Test</h3>
                <div className="space-y-2">
                  {MODELS_TO_TEST.map((model) => (
                    <div key={model.id} className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                      <div>
                        <span className="font-medium">{model.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">({model.id})</span>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          model.priority === "Primary"
                            ? "bg-green-500/20 text-green-500"
                            : model.priority === "Secondary"
                              ? "bg-blue-500/20 text-blue-500"
                              : "bg-yellow-500/20 text-yellow-500"
                        }`}
                      >
                        {model.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={runTests} disabled={isLoading || apiStatus !== "valid"} className="w-full">
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Testing Models...
                  </>
                ) : (
                  "Test Gemini Models"
                )}
              </Button>
            </CardFooter>
          </Card>

          {results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
                <CardDescription>Results from testing each Gemini model</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {results.map((result) => (
                  <div
                    key={result.modelId}
                    className={`p-4 rounded-md border ${
                      result.success ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{result.modelName}</h3>
                      {result.timeTaken && <span className="text-sm">{result.timeTaken}s</span>}
                    </div>
                    {result.success ? (
                      <div>
                        <div className="flex items-center gap-2 text-green-500 mb-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Success</span>
                        </div>
                        <div className="bg-black/10 p-3 rounded-md text-sm">
                          <p>{result.response}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-500">
                        <AlertCircle className="h-4 w-4" />
                        <span>{result.error}</span>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {isLoading && results.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Testing Models</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {MODELS_TO_TEST.map((model, index) => (
                  <div key={model.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{model.name}</h3>
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-24 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Test Logs</CardTitle>
              <CardDescription>Detailed logs of the model testing process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-black/90 text-green-400 font-mono text-sm p-4 rounded-md h-[400px] overflow-y-auto">
                {logs.length > 0 ? (
                  logs.map((log, index) => <div key={index}>{log}</div>)
                ) : (
                  <div className="text-gray-500">No logs yet. Run the test to see logs.</div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setLogs([])} disabled={logs.length === 0}>
                Clear Logs
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const logText = logs.join("\n")
                  navigator.clipboard.writeText(logText)
                  toast({
                    title: "Logs copied",
                    description: "Test logs have been copied to clipboard",
                  })
                }}
                disabled={logs.length === 0}
              >
                Copy Logs
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
