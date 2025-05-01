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
              Uncensored AI image generation for Salesforce users, with built-in audit trails and automation
            </p>
            <a href="#generator">
              <Button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-6 text-lg rounded-md">
                Try the Generator
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
                <h3 className="text-xl font-semibold mb-2 text-white">Uncensored Generation</h3>
                <p className="text-gray-300">
                  Create images without creative limitations using the powerful FLUX.1-dev model.
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
                    <path d="M20 7h-3a2 2 0 0 1-2-2V2"></path>
                    <path d="M16 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                    <path d="M12 13V7"></path>
                    <path d="M9 10h6"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Salesforce Integration</h3>
                <p className="text-gray-300">
                  Attach generated images directly to leads, opportunities, and campaigns in Salesforce.
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
                <h3 className="text-xl font-semibold mb-2 text-white">Complete Audit Trail</h3>
                <p className="text-gray-300">
                  Every generation is logged for compliance and can trigger Salesforce automation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Generator Section */}
        <section id="generator" className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-pink-400">AI Image Generator</h2>
            <p className="text-center text-gray-300 max-w-2xl mx-auto mb-8">
              Create uncensored AI images on demand, with every output instantly stored, audited, and ready for
              automation in Salesforce.
            </p>
            <ImageGenerator />
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 bg-gray-800 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-pink-400">About Clair-X</h2>
            <div className="max-w-3xl mx-auto">
              <div className="bg-gray-700 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-semibold mb-4 text-white">Inspiration</h3>
                <p className="text-gray-300">
                  Most commercial AI services censor creative output. I wanted full artistic control without leaving the
                  Salesforce environment I already use to run my business.
                </p>
              </div>

              <div className="bg-gray-700 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-semibold mb-4 text-white">Technical Build</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Agent built with Salesforce Agent Builder</li>
                  <li>Secure HTTPS call from Salesforce Apex → Python FastAPI relay → FLUX.1-dev</li>
                  <li>Signed URLs ensure images upload directly to Salesforce Files</li>
                  <li>Optional Vercel v0 front-end mirrors the agent for public demos</li>
                </ul>
              </div>

              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-white">Next Steps</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Package for AppExchange so other solo builders can install in minutes</li>
                  <li>Add text-and-audio generation via Hugging Face multi-modal endpoints</li>
                  <li>Introduce voice prompts inside Agentforce</li>
                </ul>
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
            <div className="flex gap-4">
              <span className="text-gray-400 text-sm">Built with:</span>
              <span className="text-gray-400 text-sm">Agentforce</span>
              <span className="text-gray-400 text-sm">Salesforce</span>
              <span className="text-gray-400 text-sm">Hugging Face</span>
              <span className="text-gray-400 text-sm">Vercel v0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
