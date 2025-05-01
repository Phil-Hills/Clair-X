"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Wand2, Copy, Sparkles, History } from "lucide-react"

type EnhancerCategory = {
  name: string
  items: string[]
}

export function PromptEnhancer() {
  const [basePrompt, setBasePrompt] = useState("")
  const [enhancedPrompt, setEnhancedPrompt] = useState("")
  const [selectedEnhancers, setSelectedEnhancers] = useState<string[]>([])
  const [promptHistory, setPromptHistory] = useState<string[]>([])

  const enhancerCategories: EnhancerCategory[] = [
    {
      name: "Style",
      items: [
        "photorealistic",
        "digital art",
        "oil painting",
        "watercolor",
        "sketch",
        "anime",
        "cartoon",
        "3D render",
        "concept art",
        "cinematic",
      ],
    },
    {
      name: "Quality",
      items: [
        "high resolution",
        "detailed",
        "sharp focus",
        "studio lighting",
        "professional photography",
        "8K",
        "HDR",
        "award-winning",
        "masterpiece",
        "trending on artstation",
      ],
    },
    {
      name: "Mood",
      items: [
        "dramatic",
        "vibrant",
        "moody",
        "atmospheric",
        "serene",
        "dark",
        "bright",
        "colorful",
        "mysterious",
        "ethereal",
      ],
    },
    {
      name: "Composition",
      items: [
        "portrait",
        "landscape",
        "close-up",
        "wide angle",
        "aerial view",
        "symmetrical",
        "rule of thirds",
        "bokeh",
        "depth of field",
        "panoramic",
      ],
    },
  ]

  const handleEnhancerToggle = (enhancer: string) => {
    setSelectedEnhancers((prev) => (prev.includes(enhancer) ? prev.filter((e) => e !== enhancer) : [...prev, enhancer]))
  }

  const handleEnhancePrompt = () => {
    if (!basePrompt.trim()) return

    const enhancers = selectedEnhancers.join(", ")
    const newEnhancedPrompt = enhancers ? `${basePrompt}, ${enhancers}` : basePrompt

    setEnhancedPrompt(newEnhancedPrompt)

    // Add to history if it's not already there
    if (!promptHistory.includes(newEnhancedPrompt)) {
      setPromptHistory((prev) => [newEnhancedPrompt, ...prev].slice(0, 10))
    }
  }

  const handleCopyPrompt = () => {
    if (enhancedPrompt) {
      navigator.clipboard.writeText(enhancedPrompt)
    }
  }

  const handleLoadFromHistory = (prompt: string) => {
    setEnhancedPrompt(prompt)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Wand2 className="w-5 h-5 mr-2" />
            Prompt Enhancer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="base-prompt" className="text-white">
                Base Prompt
              </Label>
              <Textarea
                id="base-prompt"
                value={basePrompt}
                onChange={(e) => setBasePrompt(e.target.value)}
                placeholder="Enter your base prompt here..."
                className="bg-gray-700 border-gray-600 text-white h-24"
              />
            </div>

            <Tabs defaultValue="style" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-700">
                {enhancerCategories.map((category) => (
                  <TabsTrigger
                    key={category.name}
                    value={category.name.toLowerCase()}
                    className="data-[state=active]:bg-pink-600"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {enhancerCategories.map((category) => (
                <TabsContent key={category.name} value={category.name.toLowerCase()} className="mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {category.items.map((item) => (
                      <div key={item} className="flex items-center space-x-2">
                        <Checkbox
                          id={item}
                          checked={selectedEnhancers.includes(item)}
                          onCheckedChange={() => handleEnhancerToggle(item)}
                          className="data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                        />
                        <Label htmlFor={item} className="text-white cursor-pointer">
                          {item}
                        </Label>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="flex gap-2">
              <Button
                onClick={handleEnhancePrompt}
                className="bg-pink-600 hover:bg-pink-700 flex-1"
                disabled={!basePrompt.trim()}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Enhance Prompt
              </Button>
            </div>

            {enhancedPrompt && (
              <div className="space-y-2">
                <Label className="text-white">Enhanced Prompt</Label>
                <div className="bg-gray-700 border border-gray-600 rounded-md p-3 text-white relative">
                  <p className="pr-10">{enhancedPrompt}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                    onClick={handleCopyPrompt}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {promptHistory.length > 0 && (
              <div className="space-y-2">
                <Label className="text-white flex items-center">
                  <History className="w-4 h-4 mr-2" />
                  Prompt History
                </Label>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {promptHistory.map((prompt, index) => (
                    <div
                      key={index}
                      className="bg-gray-700 border border-gray-600 rounded-md p-2 text-sm text-gray-300 cursor-pointer hover:border-pink-500 flex justify-between items-center"
                      onClick={() => handleLoadFromHistory(prompt)}
                    >
                      <span className="truncate">{prompt}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-400 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigator.clipboard.writeText(prompt)
                        }}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
