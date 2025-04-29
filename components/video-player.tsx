"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause } from "lucide-react"

interface VideoPlayerProps {
  src: string
  poster: string
  id: string
  onError?: (error: Error) => void
}

export default function VideoPlayer({ src, poster, id, onError }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => {
      setIsLoaded(true)
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    const handleError = (e: Event) => {
      console.error("Video error:", e)
      setIsPlaying(false)
      if (onError) {
        onError(new Error("Failed to load video"))
      }
    }

    video.addEventListener("canplay", handleCanPlay)
    video.addEventListener("ended", handleEnded)
    video.addEventListener("error", handleError)

    return () => {
      video.removeEventListener("canplay", handleCanPlay)
      video.removeEventListener("ended", handleEnded)
      video.removeEventListener("error", handleError)
    }
  }, [onError])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
      setIsPlaying(false)
    } else {
      try {
        const playPromise = video.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true)
            })
            .catch((error) => {
              console.error("Error playing video:", error)
              setIsPlaying(false)
              if (onError) {
                onError(error)
              }
            })
        }
      } catch (error) {
        console.error("Error playing video:", error)
        setIsPlaying(false)
        if (onError) {
          onError(error instanceof Error ? error : new Error(String(error)))
        }
      }
    }
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-md bg-black">
      <video
        ref={videoRef}
        id={`video-${id}`}
        className="h-full w-full object-contain"
        poster={poster}
        preload="metadata"
        playsInline
      >
        <source src={src} type="video/mp4" />
        <source src={src} type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {!isPlaying && (
        <div
          className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/30"
          onClick={togglePlay}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 backdrop-blur-sm">
            <Play className="h-8 w-8 text-white" />
          </div>
        </div>
      )}

      {isPlaying && (
        <button
          className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white"
          onClick={togglePlay}
        >
          <Pause className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
