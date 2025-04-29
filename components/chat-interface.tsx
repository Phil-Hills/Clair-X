"use client"

import { useState, useRef, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Send, Bot } from "lucide-react"
import { ChatBubble } from "@/components/ui/chat-bubble"
import { LoadingButton } from "@/components/ui/loading-button"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: string
  isNew?: boolean
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! How can I help you today?",
      sender: "ai",
      timestamp: new Date().toLocaleTimeString(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Mark new messages as read after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => ({
          ...msg,
          isNew: false,
        })),
      )
    }, 3000)

    return () => clearTimeout(timer)
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "This is a simulated response from Clair X. In a real implementation, this would be a response from the AI.",
        sender: "ai",
        timestamp: new Date().toLocaleTimeString(),
        isNew: true,
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="flex h-full flex-col rounded-lg bg-background border border-border">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <h2 className="font-medium">Clair X Assistant</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message.content}
            sender={message.sender}
            timestamp={message.timestamp}
            isNew={message.isNew}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />
          <LoadingButton onClick={handleSendMessage} isLoading={isLoading} loadingText="Sending..." className="h-auto">
            <Send className="h-4 w-4" />
          </LoadingButton>
        </div>
      </div>
    </div>
  )
}
