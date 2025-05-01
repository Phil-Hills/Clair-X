"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SearchIcon, Users, ImageIcon, Tag, ArrowRight } from "lucide-react"

type SearchResult = {
  id: string
  type: "user" | "image" | "tag"
  title: string
  subtitle?: string
  imageUrl?: string
  username?: string
  tagCount?: number
}

export function Search() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isSearching, setIsSearching] = useState(false)

  // Sample search results
  const allResults: SearchResult[] = [
    {
      id: "user1",
      type: "user",
      title: "Creative Artist",
      subtitle: "@artcreator",
      imageUrl: "/placeholder.svg?key=zu7fp",
      username: "artcreator",
    },
    {
      id: "user2",
      type: "user",
      title: "Portrait Master",
      subtitle: "@portraitmaster",
      imageUrl: "/placeholder.svg?key=0g8e8",
      username: "portraitmaster",
    },
    {
      id: "image1",
      type: "image",
      title: "Abstract Landscape",
      subtitle: "by @artcreator",
      imageUrl: "/placeholder.svg?key=8g406",
    },
    {
      id: "image2",
      type: "image",
      title: "Digital Portrait",
      subtitle: "by @portraitmaster",
      imageUrl: "/placeholder.svg?key=0g8e8",
    },
    {
      id: "image3",
      type: "image",
      title: "Futuristic City",
      subtitle: "by @cityscaper",
      imageUrl: "/placeholder.svg?key=vp4n1",
    },
    {
      id: "tag1",
      type: "tag",
      title: "landscape",
      tagCount: 42,
    },
    {
      id: "tag2",
      type: "tag",
      title: "portrait",
      tagCount: 38,
    },
    {
      id: "tag3",
      type: "tag",
      title: "abstract",
      tagCount: 27,
    },
  ]

  const filteredResults = allResults.filter((result) => {
    // Filter by search query
    if (
      searchQuery &&
      !result.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !result.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Filter by tab
    if (activeTab !== "all" && result.type !== activeTab) {
      return false
    }

    return true
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    // In a real app, this would trigger an API call
    // For demo purposes, we'll just use the filtered results
    setTimeout(() => {
      setIsSearching(false)
    }, 500)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for users, images, or tags..."
                className="flex-1 bg-gray-700 border-gray-600 text-white"
              />
              <Button type="submit" disabled={isSearching} className="bg-pink-600 hover:bg-pink-700">
                {isSearching ? (
                  "Searching..."
                ) : (
                  <>
                    <SearchIcon className="w-4 h-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </form>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-700">
              <TabsTrigger value="all" className="data-[state=active]:bg-pink-600">
                All
              </TabsTrigger>
              <TabsTrigger value="user" className="data-[state=active]:bg-pink-600">
                <Users className="w-4 h-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="image" className="data-[state=active]:bg-pink-600">
                <ImageIcon className="w-4 h-4 mr-2" />
                Images
              </TabsTrigger>
              <TabsTrigger value="tag" className="data-[state=active]:bg-pink-600">
                <Tag className="w-4 h-4 mr-2" />
                Tags
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              {filteredResults.length === 0 ? (
                <div className="text-center py-12">
                  <SearchIcon className="w-12 h-12 mx-auto text-gray-500 mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">No results found</h3>
                  <p className="text-gray-400">Try adjusting your search or filter to find what you're looking for.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredResults.map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center gap-4 p-3 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                      {result.type === "user" && (
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={result.imageUrl || "/placeholder.svg"} alt={result.title} />
                          <AvatarFallback>{result.title.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                      )}

                      {result.type === "image" && (
                        <div className="w-12 h-12 rounded-md overflow-hidden">
                          <img
                            src={result.imageUrl || "/placeholder.svg"}
                            alt={result.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {result.type === "tag" && (
                        <div className="w-12 h-12 rounded-md bg-gray-600 flex items-center justify-center">
                          <Tag className="w-6 h-6 text-gray-300" />
                        </div>
                      )}

                      <div className="flex-1">
                        <h3 className="text-white font-medium">{result.title}</h3>
                        {result.subtitle && <p className="text-gray-400 text-sm">{result.subtitle}</p>}
                        {result.type === "tag" && <p className="text-gray-400 text-sm">{result.tagCount} posts</p>}
                      </div>

                      <div>
                        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
