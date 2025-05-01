"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { User, Settings, ImageIcon, Lock, Bell, Shield, Save } from "lucide-react"

export function UserProfile() {
  const [profileData, setProfileData] = useState({
    username: "artcreator",
    displayName: "Creative Artist",
    bio: "Digital artist specializing in creative imagery and visual storytelling.",
    email: "artist@example.com",
    avatarUrl: "/placeholder.svg?key=zu7fp",
    website: "https://myportfolio.com",
  })

  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    showEmail: false,
    allowComments: true,
    contentModeration: "moderate",
    allowDownloads: true,
    showInSearch: true,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    newComments: true,
    newFollowers: true,
    featuredContent: true,
    directMessages: true,
    emailDigest: false,
  })

  const [isEditing, setIsEditing] = useState(false)

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)
    // In a real app, this would save to the backend
  }

  const handlePrivacyToggle = (setting: keyof typeof privacySettings) => {
    setPrivacySettings({
      ...privacySettings,
      [setting]: !privacySettings[setting],
    })
  }

  const handleNotificationToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-700">
          <TabsTrigger value="profile" className="data-[state=active]:bg-pink-600">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="privacy" className="data-[state=active]:bg-pink-600">
            <Lock className="w-4 h-4 mr-2" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-pink-600">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>Profile Information</span>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)} variant="outline" className="text-sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center gap-2">
                      <Avatar className="w-32 h-32">
                        <AvatarImage src={profileData.avatarUrl || "/placeholder.svg"} alt={profileData.displayName} />
                        <AvatarFallback>{profileData.displayName.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm" className="text-sm">
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Change Avatar
                      </Button>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="username" className="text-white">
                            Username
                          </Label>
                          <Input
                            id="username"
                            value={profileData.username}
                            onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="displayName" className="text-white">
                            Display Name
                          </Label>
                          <Input
                            id="displayName"
                            value={profileData.displayName}
                            onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website" className="text-white">
                          Website
                        </Label>
                        <Input
                          id="website"
                          type="url"
                          value={profileData.website}
                          onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-white">
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white h-24"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={profileData.avatarUrl || "/placeholder.svg"} alt={profileData.displayName} />
                      <AvatarFallback>{profileData.displayName.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{profileData.displayName}</h3>
                      <p className="text-gray-400">@{profileData.username}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-400">Bio</h4>
                      <p className="text-white">{profileData.bio}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400">Email</h4>
                        <p className="text-white">{profileData.email}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-400">Website</h4>
                        <a
                          href={profileData.website}
                          className="text-pink-400 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {profileData.website}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="mt-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Public Profile</h3>
                    <p className="text-gray-400 text-sm">Allow others to view your profile</p>
                  </div>
                  <Switch
                    checked={privacySettings.publicProfile}
                    onCheckedChange={() => handlePrivacyToggle("publicProfile")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Show Email</h3>
                    <p className="text-gray-400 text-sm">Display your email on your public profile</p>
                  </div>
                  <Switch
                    checked={privacySettings.showEmail}
                    onCheckedChange={() => handlePrivacyToggle("showEmail")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Allow Comments</h3>
                    <p className="text-gray-400 text-sm">Let others comment on your content</p>
                  </div>
                  <Switch
                    checked={privacySettings.allowComments}
                    onCheckedChange={() => handlePrivacyToggle("allowComments")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Allow Downloads</h3>
                    <p className="text-gray-400 text-sm">Let others download your images</p>
                  </div>
                  <Switch
                    checked={privacySettings.allowDownloads}
                    onCheckedChange={() => handlePrivacyToggle("allowDownloads")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Show in Search</h3>
                    <p className="text-gray-400 text-sm">Allow your profile to appear in search results</p>
                  </div>
                  <Switch
                    checked={privacySettings.showInSearch}
                    onCheckedChange={() => handlePrivacyToggle("showInSearch")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">New Comments</h3>
                    <p className="text-gray-400 text-sm">Notify when someone comments on your content</p>
                  </div>
                  <Switch
                    checked={notificationSettings.newComments}
                    onCheckedChange={() => handleNotificationToggle("newComments")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">New Followers</h3>
                    <p className="text-gray-400 text-sm">Notify when someone follows you</p>
                  </div>
                  <Switch
                    checked={notificationSettings.newFollowers}
                    onCheckedChange={() => handleNotificationToggle("newFollowers")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Featured Content</h3>
                    <p className="text-gray-400 text-sm">Notify when your content is featured</p>
                  </div>
                  <Switch
                    checked={notificationSettings.featuredContent}
                    onCheckedChange={() => handleNotificationToggle("featuredContent")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Direct Messages</h3>
                    <p className="text-gray-400 text-sm">Notify when you receive a direct message</p>
                  </div>
                  <Switch
                    checked={notificationSettings.directMessages}
                    onCheckedChange={() => handleNotificationToggle("directMessages")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Email Digest</h3>
                    <p className="text-gray-400 text-sm">Receive weekly email summaries</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailDigest}
                    onCheckedChange={() => handleNotificationToggle("emailDigest")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
