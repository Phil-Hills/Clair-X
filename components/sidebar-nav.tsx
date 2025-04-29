"use client"

import { Home, Video, ImageIcon, Settings, MessageCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface SidebarNavProps {
  className?: string
}

export default function SidebarNav({ className }: SidebarNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      section: "home",
    },
    {
      name: "Chat Assistant",
      href: "/chat",
      icon: MessageCircle,
      section: "chat",
    },
    {
      name: "Video Generation",
      href: "/video",
      icon: Video,
      section: "video",
    },
    {
      name: "Image Generation",
      href: "/image",
      icon: ImageIcon,
      section: "image",
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      section: "settings",
    },
  ]

  return (
    <nav className={cn("flex flex-col gap-1 p-3", className)}>
      {navItems.map((item) => {
        const isActive = pathname === item.href || (pathname.startsWith(`/${item.section}`) && item.section !== "home")

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-secondary transition-colors",
              isActive && "bg-secondary text-foreground",
            )}
          >
            <item.icon size={20} className={isActive ? "text-primary" : ""} />
            <span className={isActive ? "font-medium" : ""}>{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
