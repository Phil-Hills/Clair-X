"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Sparkles, Zap, RefreshCw, ImageIcon, Database, Bot } from "lucide-react"
import Image from "next/image"

// Define the form schema
const formSchema = z.object({
  prompt: z.string().min(5, "Prompt must be at least 5 characters"),
  style: z.string().optional(),
  aspectRatio: z.string().default("1:1"),
  enhanceWithCRM: z.boolean().default(true),
})

type FormValues = z.infer<typeof formSchema>

// Define the CRM data type
interface CRMData {
  customerId: string
  name: string
  preferences: string[]
  recentPurchases: string[]
  marketingSegment: string
}

// Define the generated image type
interface GeneratedImage {
  url: string
  prompt: string
  enhancedPrompt?: string
  timestamp: string
}

export default function AgentforceInteraction() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("generate")
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [crmData, setCrmData] = useState<CRMData | null>(null)
  const [isFetchingCRM, setIsFetchingCRM] = useState(false)
  const [agentResponse, setAgentResponse] = useState<string | null>(null)

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      style: "realistic",
      aspectRatio: "1:1",
      enhanceWithCRM: true,
    },
  })

  // Mock function to fetch CRM data
  const fetchCRMData = async () => {
    setIsFetchingCRM(true)
    try {
      // In a real implementation, this would call your Salesforce API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock CRM data
      const mockData: CRMData = {
        customerId: "SF-10042",
        name: "Alex Johnson",
        preferences: ["Modern design", "Vibrant colors", "Technology"],
        recentPurchases: ["Cloud Services", "AI Development Tools"],
        marketingSegment: "Tech Professional",
      }

      setCrmData(mockData)
      toast({
        title: "CRM Data Retrieved",
        description: `Successfully loaded data for ${mockData.name}`,
      })
    } catch (error) {
      toast({
        title: "Error Fetching CRM Data",
        description: "Could not retrieve customer data from Salesforce",
        variant: "destructive",
      })
    } finally {
      setIsFetchingCRM(false)
    }
  }

  // Function to generate image
  const generateImage = async (values: FormValues) => {
    setIsLoading(true)
    setAgentResponse(null)

    try {
      // Step 1: Get enhanced prompt from Agentforce if enabled
      let enhancedPrompt = values.prompt

      if (values.enhanceWithCRM && crmData) {
        // In a real implementation, this would call your Salesforce Agentforce API
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock Agentforce response
        const preferences = crmData.preferences.join(", ")
        enhancedPrompt = `${values.prompt} with ${preferences} style, tailored for a ${crmData.marketingSegment}`

        setAgentResponse(
          `I've enhanced your prompt based on ${crmData.name}'s preferences (${preferences}) and their segment (${crmData.marketingSegment}).`,
        )
      }

      // Step 2: Generate image using FLUX.1-dev or Gemini
      // In a real implementation, this would call your AI image generation API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock image generation
      const imageUrl = `/placeholder.svg?height=512&width=512&query=${encodeURIComponent(enhancedPrompt)}`

      // Add to generated images
      const newImage: GeneratedImage = {
        url: imageUrl,
        prompt: values.prompt,
        enhancedPrompt: values.enhanceWithCRM ? enhancedPrompt : undefined,
        timestamp: new Date().toLocaleString(),
      }

      setGeneratedImages((prev) => [newImage, ...prev])

      toast({
        title: "Image Generated",
        description: "Your AI image has been successfully created",
      })

      // Switch to results tab
      setActiveTab("results")
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your image",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold gradient-text flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Clair-X + Salesforce Agentforce
          </CardTitle>
          <CardDescription>Generate AI images enhanced with Salesforce CRM data using Agentforce</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-secondary">
              <TabsTrigger
                value="generate"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Generate
              </TabsTrigger>
              <TabsTrigger
                value="results"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Results
              </TabsTrigger>
              <TabsTrigger
                value="crm"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                CRM Data
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Image Prompt</label>
                    <Textarea
                      placeholder="Describe the image you want to generate..."
                      {...form.register("prompt")}
                      className="min-h-[120px] resize-none"
                    />
                    {form.formState.errors.prompt && (
                      <p className="text-sm text-destructive">{form.formState.errors.prompt.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Style</label>
                    <Select
                      defaultValue={form.getValues("style")}
                      onValueChange={(value) => form.setValue("style", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realistic">Realistic</SelectItem>
                        <SelectItem value="artistic">Artistic</SelectItem>
                        <SelectItem value="cartoon">Cartoon</SelectItem>
                        <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Aspect Ratio</label>
                    <Select
                      defaultValue={form.getValues("aspectRatio")}
                      onValueChange={(value) => form.setValue("aspectRatio", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select aspect ratio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1:1">Square (1:1)</SelectItem>
                        <SelectItem value="4:3">Standard (4:3)</SelectItem>
                        <SelectItem value="16:9">Widescreen (16:9)</SelectItem>
                        <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="enhanceWithCRM"
                      className="rounded border-gray-300"
                      checked={form.getValues("enhanceWithCRM")}
                      onChange={(e) => form.setValue("enhanceWithCRM", e.target.checked)}
                    />
                    <label htmlFor="enhanceWithCRM" className="text-sm font-medium">
                      Enhance with Salesforce CRM data
                    </label>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={() => generateImage(form.getValues())}
                      disabled={isLoading || !form.getValues("prompt")}
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-4 w-4" />
                          Generate Image
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Salesforce CRM Data</h3>
                      <Button variant="outline" size="sm" onClick={fetchCRMData} disabled={isFetchingCRM}>
                        {isFetchingCRM ? (
                          <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="mr-2 h-3 w-3" />
                            Fetch Data
                          </>
                        )}
                      </Button>
                    </div>

                    {crmData ? (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Customer:</span>
                          <span className="text-sm">{crmData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">ID:</span>
                          <span className="text-sm">{crmData.customerId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Segment:</span>
                          <span className="text-sm">{crmData.marketingSegment}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Preferences:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {crmData.preferences.map((pref) => (
                              <span key={pref} className="text-xs bg-secondary px-2 py-1 rounded-full">
                                {pref}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6">
                        <Database className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          No CRM data loaded. Click "Fetch Data" to load customer information.
                        </p>
                      </div>
                    )}
                  </div>

                  {agentResponse && (
                    <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">Agentforce Response</h3>
                      </div>
                      <p className="text-sm">{agentResponse}</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="results">
              {generatedImages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {generatedImages.map((image, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="aspect-square relative">
                        <Image src={image.url || "/placeholder.svg"} alt={image.prompt} fill className="object-cover" />
                      </div>
                      <CardContent className="p-4">
                        <p className="font-medium mb-1">Original Prompt:</p>
                        <p className="text-sm text-muted-foreground mb-2">{image.prompt}</p>

                        {image.enhancedPrompt && (
                          <>
                            <p className="font-medium mb-1">Enhanced with Agentforce:</p>
                            <p className="text-sm text-muted-foreground mb-2">{image.enhancedPrompt}</p>
                          </>
                        )}

                        <p className="text-xs text-muted-foreground">{image.timestamp}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Images Generated Yet</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Go to the Generate tab and create your first AI image enhanced with Salesforce CRM data.
                  </p>
                  <Button variant="outline" className="mt-4" onClick={() => setActiveTab("generate")}>
                    Start Generating
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="crm">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Salesforce CRM Integration</h3>
                  <Button variant="outline" size="sm" onClick={fetchCRMData} disabled={isFetchingCRM}>
                    {isFetchingCRM ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-3 w-3" />
                        Refresh Data
                      </>
                    )}
                  </Button>
                </div>

                {crmData ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Customer Profile</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm font-medium">Name:</div>
                          <div className="text-sm">{crmData.name}</div>

                          <div className="text-sm font-medium">Customer ID:</div>
                          <div className="text-sm">{crmData.customerId}</div>

                          <div className="text-sm font-medium">Segment:</div>
                          <div className="text-sm">{crmData.marketingSegment}</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Customer Preferences</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Design Preferences:</h4>
                            <div className="flex flex-wrap gap-1">
                              {crmData.preferences.map((pref) => (
                                <span key={pref} className="text-xs bg-secondary px-2 py-1 rounded-full">
                                  {pref}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">Recent Purchases:</h4>
                            <div className="flex flex-wrap gap-1">
                              {crmData.recentPurchases.map((purchase) => (
                                <span
                                  key={purchase}
                                  className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                                >
                                  {purchase}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle>How Agentforce Uses This Data</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Salesforce Agentforce analyzes customer data to enhance your image prompts in the following
                          ways:
                        </p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">
                              <Sparkles className="h-3 w-3" />
                            </span>
                            <span>
                              <strong>Preference Matching:</strong> Incorporates customer design preferences into image
                              style
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">
                              <Sparkles className="h-3 w-3" />
                            </span>
                            <span>
                              <strong>Segment Targeting:</strong> Tailors imagery to match customer segment expectations
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">
                              <Sparkles className="h-3 w-3" />
                            </span>
                            <span>
                              <strong>Purchase History:</strong> Incorporates elements related to recent purchases
                            </span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 border border-dashed rounded-lg">
                    <Database className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No CRM Data Available</h3>
                    <p className="text-muted-foreground text-center max-w-md mb-4">
                      Connect to Salesforce to load customer data and enhance your AI image generation.
                    </p>
                    <Button onClick={fetchCRMData} disabled={isFetchingCRM}>
                      {isFetchingCRM ? "Loading Data..." : "Connect to Salesforce"}
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
