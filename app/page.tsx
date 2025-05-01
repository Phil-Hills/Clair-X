import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ImageGenerator } from "@/components/image-generator"

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
                <Link href="#generator" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Generator
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-gray-300 hover:text-pink-400 transition-colors">
                  About
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
              AI image generation for Salesforce users, powered by Agentforce, with built-in audit trails and automation
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#generator">
                <Button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-6 text-lg rounded-md">
                  Try Agentforce Demo
                </Button>
              </a>
              <a href="#features">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-md">
                  Salesforce Features
                </Button>
              </a>
            </div>
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
                  Create high-quality images using the powerful Stable Diffusion XL model, all through natural language
                  prompts in Agentforce.
                </p>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
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
                    <path d="M20 7h-3a2 2 0 0 1-2-2V2"></path>
                    <path d="M16 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                    <path d="M12 13V7"></path>
                    <path d="M9 10h6"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Salesforce Integration</h3>
                <p className="text-gray-300">
                  Attach generated images directly to leads, opportunities, and campaigns in Salesforce with a single
                  click.
                </p>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
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
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Agentforce Automation</h3>
                <p className="text-gray-300">
                  Trigger Salesforce flows and processes automatically when images are generated and attached to
                  records.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Integration Diagram */}
        <section className="py-16 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-center mb-12 text-pink-400">How It Works</h2>
            <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Agentforce Chat</h3>
                  <p className="text-gray-300 text-sm">
                    User requests an image through natural language in the Agentforce chat interface
                  </p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">AI Generation</h3>
                  <p className="text-gray-300 text-sm">
                    Agentforce processes the request and generates the image using Hugging Face's Stable Diffusion XL
                  </p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Salesforce Integration</h3>
                  <p className="text-gray-300 text-sm">
                    Image is automatically attached to the relevant Salesforce record and triggers automation
                  </p>
                </div>
              </div>
              <div className="mt-8 flex justify-center">
                <svg width="600" height="80" viewBox="0 0 600 80" className="max-w-full">
                  <path
                    d="M100,40 C150,10 250,10 300,40 C350,70 450,70 500,40"
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="3"
                    strokeDasharray="8 4"
                  />
                  <circle cx="100" cy="40" r="8" fill="#ec4899" />
                  <circle cx="300" cy="40" r="8" fill="#ec4899" />
                  <circle cx="500" cy="40" r="8" fill="#ec4899" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Generator Section */}
        <section id="generator" className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-pink-400">Agentforce + Salesforce Demo</h2>
            <p className="text-center text-gray-300 max-w-2xl mx-auto mb-8">
              Experience how Clair-X integrates with Agentforce and Salesforce to create a seamless image generation
              workflow.
            </p>
            <ImageGenerator />
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 bg-gray-800 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-pink-400">About Clair-X</h2>
            <div className="max-w-3xl mx-auto bg-gray-700 p-8 rounded-lg">
              <h3 className="text-2xl font-semibold mb-6 text-white text-center">Unleash Your Creative Potential</h3>
              <p className="text-gray-300 text-lg mb-6">
                Clair-X is the ultimate AI image generation solution built specifically for Salesforce users. Unlike
                other image generation tools, Clair-X gives you complete creative freedom with no content filters or
                restrictions.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-800 p-5 rounded-lg">
                  <h4 className="text-xl font-medium text-pink-400 mb-3">Complete Creative Freedom</h4>
                  <p className="text-gray-300">
                    Generate any image you can imagine without the frustrating content restrictions that limit your
                    creativity on other platforms.
                  </p>
                </div>
                <div className="bg-gray-800 p-5 rounded-lg">
                  <h4 className="text-xl font-medium text-blue-400 mb-3">Seamless Salesforce Storage</h4>
                  <p className="text-gray-300">
                    Every image is automatically saved and organized in your Salesforce instance, making them instantly
                    available across your entire organization.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-5 rounded-lg">
                  <h4 className="text-xl font-medium text-pink-400 mb-3">Natural Language Interface</h4>
                  <p className="text-gray-300">
                    Simply describe what you want in plain English through the Agentforce chat interface - no complex
                    prompting required.
                  </p>
                </div>
                <div className="bg-gray-800 p-5 rounded-lg">
                  <h4 className="text-xl font-medium text-blue-400 mb-3">Enterprise-Ready</h4>
                  <p className="text-gray-300">
                    Built with business users in mind, with comprehensive audit trails, permissions, and the security
                    you expect from Salesforce.
                  </p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button className="bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700 text-white px-8 py-3 text-lg rounded-md">
                  Start Creating Without Limits
                </Button>
              </div>
            </div>
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
            <div className="flex flex-wrap gap-4 justify-center">
              <span className="text-gray-400 text-sm">Built with:</span>
              <span className="text-blue-400 text-sm">Salesforce</span>
              <span className="text-pink-400 text-sm">Agentforce</span>
              <span className="text-gray-400 text-sm">Hugging Face</span>
              <span className="text-gray-400 text-sm">Vercel v0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
