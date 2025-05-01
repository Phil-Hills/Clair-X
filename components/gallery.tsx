"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Grid, List, Filter, Heart, Download, Share2, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type GalleryItem = {
  id: string
  title: string
  imageUrl: string
  creator: string
  likes: number
  createdAt: string
  tags: string[]
}

export function Gallery() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("newest")
  const [filterTag, setFilterTag] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Sample gallery data
  const galleryItems: GalleryItem[] = [
    {
      id: "1",
      title: "Abstract Landscape",
      imageUrl: "/placeholder.svg?key=8g406",
      creator: "artcreator",
      likes: 42,
      createdAt: "2023-04-15",
      tags: ["landscape", "abstract", "colorful"],
    },
    {
      id: "2",
      title: "Digital Portrait",
      imageUrl: "/placeholder.svg?key=0g8e8",
      creator: "portraitmaster",
      likes: 38,
      createdAt: "2023-04-12",
      tags: ["portrait", "digital", "realistic"],
    },
    {
      id: "3",
      title: "Futuristic City",
      imageUrl: "/placeholder.svg?key=vp4n1",
      creator: "cityscaper",
      likes: 56,
      createdAt: "2023-04-10",
      tags: ["city", "futuristic", "scifi"],
    },
    {
      id: "4",
      title: "Fantasy Character",
      imageUrl: "/placeholder.svg?key=dlx7b",
      creator: "characterdesigner",
      likes: 29,
      createdAt: "2023-04-08",
      tags: ["character", "fantasy", "illustration"],
    },
    {
      id: "5",
      title: "Neon Dreams",
      imageUrl: "/placeholder.svg?key=fo9zq",
      creator: "neonartist",
      likes: 67,
      createdAt: "2023-04-05",
      tags: ["neon", "cyberpunk", "night"],
    },
    {
      id: "6",
      title: "Serene Nature",
      imageUrl: "/placeholder.svg?key=xb3ag",
      creator: "naturelover",
      likes: 45,
      createdAt: "2023-04-03",
      tags: ["nature", "peaceful", "landscape"],
    },
    {
      id: "7",
      title: "Urban Photography",
      imageUrl: "/placeholder.svg?key=qoxl7",
      creator: "streetphotographer",
      likes: 33,
      createdAt: "2023-04-01",
      tags: ["urban", "photography", "street"],
    },
    {
      id: "8",
      title: "Cosmic Wonder",
      imageUrl: "/placeholder.svg?key=xpmd7",
      creator: "spacefan",
      likes: 72,
      createdAt: "2023-03-28",
      tags: ["space", "cosmic", "stars"],
    },
  ]

  // Filter and sort gallery items
  const filteredItems = galleryItems
    .filter((item) => {
      // Filter by tag
      if (filterTag !== "all" && !item.tags.includes(filterTag)) {
        return false
      }

      // Filter by search query
      if (
        searchQuery &&
        !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.creator.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      ) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      // Sort by selected option
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "popular":
          return b.likes - a.likes
        default:
          return 0
      }
    })

  // Get all unique tags
  const allTags = Array.from(new Set(galleryItems.flatMap((item) => item.tags)))

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 flex gap-2">
            <Input
              type="text"
              placeholder="Search gallery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Button className="bg-gray-700 hover:bg-gray-600">
              <Search className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-white">
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-white">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border border-gray-600 rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-r-none ${viewMode === "grid" ? "bg-gray-600" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-l-none ${viewMode === "list" ? "bg-gray-600" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <Search className="w-12 h-12 mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No results found</h3>
            <p className="text-gray-400">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden bg-gray-700 border-gray-600 hover:border-pink-500 transition-colors"
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-3">
                      <div className="w-full">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="text-white font-medium truncate">{item.title}</h3>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                              <DropdownMenuItem className="hover:bg-gray-700">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-gray-700">
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-gray-700">
                                <Heart className="w-4 h-4 mr-2" />
                                Like
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 text-sm">@{item.creator}</span>
                          <span className="text-gray-300 text-sm flex items-center">
                            <Heart className="w-3 h-3 mr-1 fill-pink-500 text-pink-500" />
                            {item.likes}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden bg-gray-700 border-gray-600 hover:border-pink-500 transition-colors"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-48 h-48">
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-white font-medium text-lg">{item.title}</h3>
                          <span className="text-gray-300 text-sm">{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-300 mb-2">
                          Created by <span className="text-pink-400">@{item.creator}</span>
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.tags.map((tag) => (
                            <span key={tag} className="bg-gray-600 text-gray-300 px-2 py-1 rounded-md text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                            <Heart className="w-4 h-4 mr-1" />
                            {item.likes}
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                            <Share2 className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
