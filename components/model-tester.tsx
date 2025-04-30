"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingButton } from "@/components/ui/loading-button"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle } from "lucide-react"

interface ModelTestResult {
  success: boolean
  model: string
  response?: string
  error?: string
  timeTaken?: number
}

export default function ModelTester() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<ModelTestResult[]>([])
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [testPrompt, setTestPrompt] = useState("Describe a beautiful sunset in 3 sentences.")
  const [logs, setLogs] = useState<string[]>([])

  // Check for API key on component mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem("GEMINI_API_KEY")
    if (storedApiKey) {
      setApiKey(storedApiKey)
      addLog("Found API key in local storage")
    } else {
      addLog("No API key found in local storage")
    }
  }, [])

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  const testModel = async (modelName: string) => {
    if (!apiKey) {
      addLog(`Cannot test model ${modelName}: No API key available`)
      return {
        success: false,
        model: modelName,
        error: "No API key available",
      }
    }

    addLog(`Testing model: ${modelName}...`)
    const startTime = performance.now()

    try {
      const response = await fetch("/api/test-model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          modelName,
          prompt: testPrompt,
          apiKey,
        }),
      })

      const data = await response.json()
      const timeTaken = Math.round(performance.now() - startTime) / 1000

      if (data.success) {
        addLog(`✅ Model ${modelName} test successful (${timeTaken}s)`)
        return {
          success: true,
          model: modelName,
          response: data.text,
          timeTaken,
        }
      } else {
        addLog(`❌ Model ${modelName} test failed: ${data.error}`)
        return {
          success: false,
          model: modelName,
          error: data.error,
          timeTaken,
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      addLog(`❌ Error testing model ${modelName}: ${errorMessage}`)
      return {
        success: false,
        model: modelName,
        error: errorMessage,
      }
    }
  }

  const runTests = async () => {
    setIsLoading(true)
    setResults([])
    addLog("Starting model tests...")

    // Models to test in order of preference
    const modelsToTest = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"]

    const newResults: ModelTestResult[] = []

    for (const model of modelsToTest) {
      const result = await testModel(model)
      newResults.push(result)
      setResults([...newResults]) // Update results after each test

      // If we found a working model, we can stop testing
      if (result.success) {
        addLog(`Found working model: ${model}`)
        break
      }
    }

    setIsLoading(false)
    addLog("All tests completed")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gemini Model Tester</CardTitle>
          <CardDescription>
            Test if the system can successfully use the gemini-1.5-flash model and other Gemini models
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">API Key Status</h3>
            <div className={`p-3 rounded-md ${apiKey ? "bg-green-500/10" : "bg-yellow-500/10"}`}>
              {apiKey ? (
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  <span>API key found in local storage</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-yellow-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>No API key found. Please configure an API key first.</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Test Prompt</h3>
            <Textarea
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              placeholder="Enter a test prompt"
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
        <CardFooter>
          <LoadingButton
            onClick={runTests}
            isLoading={isLoading}
            loadingText="Testing Models..."
            disabled={!apiKey}
            className="w-full"
          >
            Test Gemini Models
          </LoadingButton>
        </CardFooter>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-md border ${
                  result.success ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{result.model}</h3>
                  {result.timeTaken && <span className="text-sm">{result.timeTaken}s</span>}
                </div>
                {result.success ? (
                  <div>
                    <div className="flex items-center gap-2 text-green-500 mb-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Success</span>
                    </div>
                    <div className="bg-black/20 p-3 rounded-md text-sm">
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

      <Card>
        <CardHeader>
          <CardTitle>Test Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-black/90 text-green-400 font-mono text-sm p-4 rounded-md h-[200px] overflow-y-auto">
            {logs.length > 0 ? (
              logs.map((log, index) => <div key={index}>{log}</div>)
            ) : (
              <div className="text-gray-500">No logs yet. Run the test to see logs.</div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => setLogs([])} disabled={logs.length === 0}>
            Clear Logs
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
