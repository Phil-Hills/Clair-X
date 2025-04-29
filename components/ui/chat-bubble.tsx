"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string
  sender: "user" | "ai"
  timestamp?: string
  isNew?: boolean
}

export function ChatBubble({ message, sender, timestamp, isNew = false, className, ...props }: ChatBubbleProps) {
  return (
    <div className={cn("flex w-full", sender === "user" ? "justify-end" : "justify-start", className)} {...props}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          sender === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
          isNew && sender === "ai" && "chat-bubble-new",
        )}
      >
        <p className="text-sm">{message}</p>
        {timestamp && <p className="mt-1 text-right text-xs opacity-70">{timestamp}</p>}
      </div>
    </div>
  )
}
