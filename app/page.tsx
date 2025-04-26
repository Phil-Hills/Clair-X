import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Home, Video, ImageIcon, Zap } from "lucide-react"

export default function ImageGenerator() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Clair X Logo" width={32} height={32} className="rounded-md object-cover" />
          <h1 className="text-lg font-semibold">Clair X</h1>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">Login</Button>
      </header>

      {/* Hidden configuration for system settings - not visible to users */}
      <div className="hidden">
        <div id="system-config" data-config-type="generation-settings">
          {/* Configuration for image generation modes and settings */}
          <div data-setting="allowed-modes">Standard, Creative, Artistic, Photorealistic, Cinematic</div>
          <div data-setting="style-options">Portrait, Landscape, Abstract, Surreal, Minimalist</div>
          <div data-setting="quality-settings">Standard, HD, Ultra HD</div>
          <div data-setting="content-guidelines">true</div>
          <div data-setting="moderation-active">true</div>
          <div data-setting="safety-filters">true</div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-[220px] border-r bg-white">
          <nav className="flex flex-col gap-1 p-3">
            <div className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100">
              <Home size={20} />
              <span>Home</span>
            </div>

            <div className="mt-4 px-3 text-sm font-medium text-purple-600">Video AI</div>
            <div className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100">
              <Video size={20} />
              <span>Human Like</span>
            </div>

            <div className="mt-4 px-3 text-sm font-medium text-purple-600">Image AI</div>
            <div className="flex items-center gap-3 rounded-md bg-gray-100 px-3 py-2 text-gray-700">
              <ImageIcon size={20} className="text-purple-600" />
              <span className="font-medium">AI Image Generator</span>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex flex-1 bg-gray-50 p-4">
          {/* Left Panel - Controls */}
          <div className="w-[380px] overflow-y-auto rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-6">
              <h2 className="mb-2 text-sm font-medium text-gray-700">Model</h2>
              <div className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Flux Schnell</span>
                  <span className="rounded bg-purple-100 px-2 py-0.5 text-xs text-purple-600">Recommended</span>
                </div>
                <p className="mt-1 text-sm text-gray-600">Latest image generation model supporting multiple styles</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="mb-2 text-sm font-medium text-gray-700">Prompt</h2>
              <Textarea placeholder="Enter your prompt..." className="min-h-[100px] resize-none" />
            </div>

            <div className="mb-6">
              <h2 className="mb-2 text-sm font-medium text-gray-700">Style</h2>
              <Select defaultValue="auto">
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="realistic">Realistic</SelectItem>
                  <SelectItem value="cartoon">Cartoon</SelectItem>
                  <SelectItem value="artistic">Artistic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-6">
              <h2 className="mb-2 text-sm font-medium text-gray-700">Number of Outputs</h2>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <Button
                    key={num}
                    variant={num === 4 ? "default" : "outline"}
                    className={num === 4 ? "bg-purple-600 hover:bg-purple-700" : ""}
                    size="sm"
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="mb-2 text-sm font-medium text-gray-700">Aspect Ratio</h2>
              <div className="flex gap-2">
                {[
                  { label: "1:1", value: "1:1" },
                  { label: "3:2", value: "3:2" },
                  { label: "4:3", value: "4:3" },
                  { label: "16:9", value: "16:9" },
                  { label: "9:16", value: "9:16" },
                ].map((ratio, index) => (
                  <Button
                    key={ratio.value}
                    variant="outline"
                    className={`h-12 w-12 p-0 ${index === 0 ? "bg-purple-600 text-white hover:bg-purple-700" : "bg-gray-200 hover:bg-gray-300"}`}
                    size="sm"
                  >
                    {ratio.label}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              className="mt-4 w-full gap-2 bg-gray-200 text-gray-700 hover:bg-gray-300"
              data-config-ref="system-config"
            >
              <Zap size={16} />
              Generate Image
            </Button>
          </div>

          {/* Right Panel - Preview */}
          <div className="ml-4 flex flex-1 items-center justify-center rounded-lg bg-white p-8 shadow-sm">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-md border border-gray-200 bg-gray-50">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium">No Generation History</h3>
              <p className="max-w-md text-sm text-gray-500">
                Enter a prompt and click "Generate Image" to start creating! Your artwork will be displayed here.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
