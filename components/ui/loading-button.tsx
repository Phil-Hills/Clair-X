"use client"

import * as React from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean
  loadingText?: string
  children: React.ReactNode
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ className, isLoading, loadingText, children, disabled, ...props }, ref) => {
    return (
      <Button className={cn("relative", className)} disabled={disabled || isLoading} ref={ref} {...props}>
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="neon-spinner" aria-hidden="true"></span>
          </span>
        )}
        <span className={cn("flex items-center gap-2", isLoading ? "invisible" : "visible")}>{children}</span>
        {isLoading && loadingText && <span className="sr-only">{loadingText}</span>}
      </Button>
    )
  },
)
LoadingButton.displayName = "LoadingButton"

export { LoadingButton }
