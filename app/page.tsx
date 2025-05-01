import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageGenerator } from "@/components/image-generator"
import { Gallery } from "@/components/gallery"
import { UserProfile } from "@/components/user-profile"
import { PromptEnhancer } from "@/components/prompt-enhancer"
import { ImageEditor } from "@/components/image-editor"
import { Search } from "@/components/search"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-700 bg-gray-800 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/clair-x-logo.jpeg" alt="Clair-X Logo" width={40} height={40} className="rounded" />
            <h1 className="text-xl font-bold text-pink-500">Clair-X</h1>
          </div>
          <nav>
            <ul className="flex gap-6">
              <li>
                <Link href="#features" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#gallery" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="#tools" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Tools
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto flex flex-col items-center text-center">
            <Image
              src="/clair-x-logo.jpeg"
              alt="Clair-X Logo"
              width={300}
              height={180}
              priority
              className="rounded-md mb-8"
            />
            <h2 className="text-5xl font-bold text-pink-500 mb-6">Clair-X</h2>
            <p className="text-xl text-gray-300 max-w-2xl mb-8">
              Advanced media creation and management platform with powerful image generation, enhancement, and sharing
              capabilities
            </p>
            <a href="#tools">
              <Button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-6 text-lg rounded-md">
                Try the Tools
              </Button>
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-gray-800 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-pink-400">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-700 p-6 rounded-lg">
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Advanced Image Generation</h3>
                <p className="text-gray-300">
                  Create high-quality images using the powerful Stable Diffusion XL model with enhanced prompting
                  capabilities.
                </p>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg">
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                    <path d="M19 3v4"></path>
                    <path d="M21 5h-4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Image Enhancement</h3>
                <p className="text-gray-300">
                  Powerful editing tools to adjust, filter, and enhance your images with professional-grade controls.
                </p>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg">
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                    <path d="m15 5 4 4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Prompt Engineering</h3>
                <p className="text-gray-300">
                  Craft the perfect prompts with our intelligent prompt enhancer to get exactly the images you want.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-pink-400">Gallery</h2>
            <p className="text-center text-gray-300 max-w-2xl mx-auto mb-8">
              Explore a curated collection of AI-generated images from our community of creators.
            </p>
            <Gallery />
          </div>
        </section>

        {/* Tools Section */}
        <section id="tools" className="py-16 bg-gray-800 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-pink-400">Creative Tools</h2>
            <p className="text-center text-gray-300 max-w-2xl mx-auto mb-8">
              Powerful tools to create, enhance, and share your visual content.
            </p>

            <Tabs defaultValue="generator" className="w-full">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 bg-gray-700 mb-8">
                <TabsTrigger value="generator" className="data-[state=active]:bg-pink-600">
                  Generator
                </TabsTrigger>
                <TabsTrigger value="enhancer" className="data-[state=active]:bg-pink-600">
                  Prompt Enhancer
                </TabsTrigger>
                <TabsTrigger value="editor" className="data-[state=active]:bg-pink-600">
                  Image Editor
                </TabsTrigger>
                <TabsTrigger value="search" className="data-[state=active]:bg-pink-600">
                  Search
                </TabsTrigger>
              </TabsList>

              <TabsContent value="generator">
                <ImageGenerator />
              </TabsContent>

              <TabsContent value="enhancer">
                <PromptEnhancer />
              </TabsContent>

              <TabsContent value="editor">
                <ImageEditor />
              </TabsContent>

              <TabsContent value="search">
                <Search />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Profile Section */}
        <section id="profile" className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-pink-400">User Profile</h2>
            <p className="text-center text-gray-300 max-w-2xl mx-auto mb-8">
              Customize your profile, manage privacy settings, and control your preferences.
            </p>
            <UserProfile />
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 border-t border-gray-700 py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Image src="/clair-x-logo.jpeg" alt="Clair-X Logo" width={30} height={30} className="rounded mr-2" />
              <span className="text-pink-500 font-bold">Clair-X</span>
            </div>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                Help
              </Link>
              <Link href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-4 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Clair-X. All rights reserved.</p>
            <p className="mt-1">This platform includes robust content moderation and privacy controls.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
