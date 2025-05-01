"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

type AuditLogEntry = {
  timestamp: string
  prompt: string
  userId: string
  success: boolean
}

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([])
  const [selectedRecord, setSelectedRecord] = useState("opportunity")
  const [recordId, setRecordId] = useState("OPP-00123")
  const imageRef = useRef<HTMLImageElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!prompt.trim()) {
      setError("Please enter a prompt")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to generate image")
      }

      const data = await response.json()
      setImage(data.image)

      // Add to audit logs
      if (data.auditLog) {
        setAuditLogs((prev) => [data.auditLog, ...prev])
      }
    } catch (err) {
      console.error("Error generating image:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveToSalesforce = () => {
    // Simulate saving to Salesforce
    const newLog = {
      timestamp: new Date().toISOString(),
      prompt: prompt,
      userId: "demo-user",
      success: true,
    }
    setAuditLogs((prev) => [newLog, ...prev])

    // Show success message
    setError(`Image saved to ${selectedRecord} ${recordId} in Salesforce`)
    setTimeout(() => setError(null), 3000)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-700">
          <TabsTrigger value="generator" className="data-[state=active]:bg-pink-600">
            Generator
          </TabsTrigger>
          <TabsTrigger value="salesforce" className="data-[state=active]:bg-pink-600">
            Salesforce
          </TabsTrigger>
          <TabsTrigger value="audit" className="data-[state=active]:bg-pink-600">
            Audit Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="mt-4">
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex gap-2">
              <Input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate..."
                className="flex-1 bg-gray-700 border-gray-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <Button type="submit" disabled={loading} className="bg-pink-600 hover:bg-pink-700 text-white">
                {loading ? "Generating..." : "Generate"}
              </Button>
            </div>
          </form>

          {error && (
            <Alert
              className={`mb-6 ${error.includes("saved to") ? "bg-green-900/30 border-green-800 text-green-300" : "bg-red-900/30 border-red-800 text-red-300"}`}
            >
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center">
            {loading ? (
              <div className="h-96 w-96 flex items-center justify-center bg-gray-700 rounded-lg">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mb-4"></div>
                  <p className="text-gray-300">Generating your image...</p>
                  <p className="text-gray-400 text-sm mt-2">This may take up to 30 seconds</p>
                </div>
              </div>
            ) : image ? (
              <Card className="overflow-hidden bg-gray-700 border-gray-600">
                <CardContent className="p-0">
                  <div className="relative h-96 w-96">
                    <img
                      ref={imageRef}
                      src={image || "/placeholder.svg"}
                      alt="Generated image"
                      className="object-cover rounded-lg"
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="h-96 w-96 flex items-center justify-center bg-gray-700 rounded-lg">
                <div className="text-center px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mx-auto mb-4 text-gray-500"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <p className="text-gray-400">Enter a prompt above to generate an image</p>
                  <p className="text-gray-500 text-sm mt-2">Uncensored FLUX.1-dev model</p>
                </div>
              </div>
            )}
          </div>

          {image && (
            <div className="mt-4 flex justify-center gap-2">
              <Button
                onClick={() => {
                  const link = document.createElement("a")
                  link.href = image
                  link.download = `clair-x-${Date.now()}.jpg`
                  link.click()
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white"
              >
                Download
              </Button>
              <Button onClick={handleSaveToSalesforce} className="bg-blue-600 hover:bg-blue-700 text-white">
                Save to Salesforce
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="salesforce" className="mt-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="record-type">Record Type</Label>
                  <Select value={selectedRecord} onValueChange={setSelectedRecord}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select record type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600 text-white">
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="opportunity">Opportunity</SelectItem>
                      <SelectItem value="campaign">Campaign</SelectItem>
                      <SelectItem value="account">Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="record-id">Record ID</Label>
                  <Input
                    id="record-id"
                    value={recordId}
                    onChange={(e) => setRecordId(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    onClick={handleSaveToSalesforce}
                    disabled={!image}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Attach Image to Salesforce Record
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-white mb-4">How It Works</h3>
            <div className="bg-gray-800 rounded-lg p-4 text-gray-300">
              <ol className="list-decimal list-inside space-y-2">
                <li>Generate an image using the Generator tab</li>
                <li>Select a Salesforce record type and ID</li>
                <li>Click "Attach Image to Salesforce Record"</li>
                <li>The image is stored in Salesforce Files and linked to your record</li>
                <li>All actions are logged for compliance and automation</li>
              </ol>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="mt-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium text-white mb-4">Image Generation Audit Log</h3>

              {auditLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No audit logs yet. Generate some images to see the audit trail.
                </div>
              ) : (
                <div className="space-y-4">
                  {auditLogs.map((log, index) => (
                    <div key={index} className="bg-gray-700 p-3 rounded-md">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">{new Date(log.timestamp).toLocaleString()}</span>
                        <span className={log.success ? "text-green-400" : "text-red-400"}>
                          {log.success ? "Success" : "Failed"}
                        </span>
                      </div>
                      <div className="mt-1 text-white">
                        <strong>Prompt:</strong> {log.prompt}
                      </div>
                      <div className="mt-1 text-gray-400 text-sm">
                        <strong>User:</strong> {log.userId}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
