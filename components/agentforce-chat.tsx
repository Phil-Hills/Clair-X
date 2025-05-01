"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

type Message = {
  id: string
  content: string
  sender: "user" | "agent"
  timestamp: Date
  isGeneratingImage?: boolean
  imageUrl?: string
}

export function AgentforceChat({ onGenerateImage }: { onGenerateImage: (prompt: string) => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your Agentforce assistant. You can ask me to generate images for your Salesforce records.",
      sender: "agent",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Check if message contains image generation request
    const isImageRequest =
      input.toLowerCase().includes("generate") ||
      input.toLowerCase().includes("create image") ||
      input.toLowerCase().includes("make an image") ||
      input.toLowerCase().includes("image of")

    // Simulate agent thinking
    setTimeout(() => {
      setIsTyping(false)

      if (isImageRequest) {
        // Extract the prompt - everything after "generate" or similar keywords
        let prompt = input
        const keywords = ["generate", "create image", "make an image", "image of"]
        for (const keyword of keywords) {
          if (input.toLowerCase().includes(keyword)) {
            prompt = input.substring(input.toLowerCase().indexOf(keyword) + keyword.length).trim()
            break
          }
        }

        // Add agent response
        const agentMessage: Message = {
          id: Date.now().toString(),
          content: `I'll generate an image based on: "${prompt}"`,
          sender: "agent",
          timestamp: new Date(),
          isGeneratingImage: true,
        }
        setMessages((prev) => [...prev, agentMessage])

        // Trigger image generation
        onGenerateImage(prompt)
      } else {
        // Regular response
        const responses = [
          "I can help you generate images for your Salesforce records. Just ask me to generate an image of something.",
          "Would you like me to create an image for a specific Salesforce record?",
          "I can generate images and attach them to leads, opportunities, or campaigns in Salesforce.",
          "Try asking me to 'generate an image of a mountain landscape' or something similar.",
        ]
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]

        const agentMessage: Message = {
          id: Date.now().toString(),
          content: randomResponse,
          sender: "agent",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, agentMessage])
      }
    }, 1000)
  }

  return (
    <Card className="w-full bg-gray-800 border-gray-700">
      <CardHeader className="bg-gray-700 border-b border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 bg-pink-600">
              <span className="text-xs font-bold">AF</span>
            </Avatar>
            <CardTitle className="text-white text-lg">Agentforce Chat</CardTitle>
          </div>
          <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-800">
            Salesforce Connected
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user" ? "bg-pink-600 text-white" : "bg-gray-700 text-white border border-gray-600"
                }`}
              >
                <p>{message.content}</p>
                {message.isGeneratingImage && (
                  <div className="mt-2 text-sm text-gray-300 flex items-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white mr-2"></div>
                    Generating image...
                  </div>
                )}
                {message.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={message.imageUrl || "/placeholder.svg"}
                      alt="Generated"
                      className="rounded-md max-w-full"
                      style={{ maxHeight: "200px" }}
                    />
                  </div>
                )}
                <div className="mt-1 text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-700 text-white rounded-lg p-3 max-w-[80%] border border-gray-600">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
          <div className="flex gap-2">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Agentforce to generate an image..."
              className="flex-1 bg-gray-700 border-gray-600 text-white"
            />
            <Button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white">
              Send
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
