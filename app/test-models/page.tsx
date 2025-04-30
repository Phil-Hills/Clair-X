import ModelTester from "@/components/model-tester"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TestModelsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold gradient-text">Gemini Model Verification</h1>
        <p className="text-muted-foreground">
          This page tests if the system can successfully use the gemini-1.5-flash model and other Gemini models.
        </p>
      </div>

      <ModelTester />
    </div>
  )
}
