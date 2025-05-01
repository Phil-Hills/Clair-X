import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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
                <Link href="#about" className="text-gray-300 hover:text-pink-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#chat" className="text-gray-300 hover:text-pink-400 transition-colors">
                  AI Chat
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
            <h2 className="text-5xl font-bold text-pink-500 mb-6">Welcome to Clair-X</h2>
            <p className="text-xl text-gray-300 max-w-2xl mb-8">
              The next generation AI platform powered by Hugging Face technology
            </p>
            <Button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-6 text-lg rounded-md">
              Start Exploring
            </Button>
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
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Advanced AI Chat</h3>
                <p className="text-gray-300">
                  Engage with our state-of-the-art AI models powered by Hugging Face technology.
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
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Multi-Model Support</h3>
                <p className="text-gray-300">
                  Access a variety of specialized AI models for different tasks and requirements.
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
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Enhanced Security</h3>
                <p className="text-gray-300">Enterprise-grade security with data encryption and privacy controls.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Chat Section */}
        <section id="chat" className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-pink-400">Try Clair-X AI</h2>
            <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg p-6">
              <div className="bg-gray-700 rounded-lg p-4 mb-4 h-64 overflow-y-auto">
                <div className="flex items-start mb-4">
                  <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xs font-bold">CX</span>
                  </div>
                  <div className="bg-gray-600 rounded-lg p-3 max-w-[80%]">
                    <p className="text-white">Hello! I'm Clair-X, your AI assistant. How can I help you today?</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-700 border-gray-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <Button className="bg-pink-600 hover:bg-pink-700 text-white">Send</Button>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 bg-gray-800 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-pink-400">About Clair-X</h2>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-gray-300 mb-6">
                Clair-X is a cutting-edge AI platform designed to push the boundaries of what's possible with artificial
                intelligence. Built on Hugging Face's powerful models, Clair-X delivers exceptional performance and
                versatility.
              </p>
              <p className="text-gray-300">
                Our mission is to make advanced AI technology accessible and useful for everyone, from developers and
                researchers to businesses and individuals.
              </p>
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
            <div className="text-gray-400 text-sm">© 2023 Clair-X. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
