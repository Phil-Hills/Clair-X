import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type SalesforceRecord = {
  id: string
  name: string
  type: "Lead" | "Opportunity" | "Campaign" | "Account"
  status: string
  owner: string
  createdDate: string
  attachedImages: number
}

export function SalesforcePanel({ selectedImage }: { selectedImage: string | null }) {
  const records: SalesforceRecord[] = [
    {
      id: "OPP-00123",
      name: "Acme Corp - Enterprise Deal",
      type: "Opportunity",
      status: "Negotiation",
      owner: "Phil Hills",
      createdDate: "2023-11-15",
      attachedImages: 3,
    },
    {
      id: "LEAD-00456",
      name: "Jane Smith - Marketing Director",
      type: "Lead",
      status: "Qualified",
      owner: "Phil Hills",
      createdDate: "2023-12-01",
      attachedImages: 1,
    },
    {
      id: "CAMP-00789",
      name: "Q1 Product Launch",
      type: "Campaign",
      status: "In Progress",
      owner: "Marketing Team",
      createdDate: "2024-01-10",
      attachedImages: 5,
    },
  ]

  return (
    <Card className="w-full bg-gray-800 border-gray-700">
      <CardHeader className="bg-blue-900/30 border-b border-blue-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
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
              className="text-blue-400"
            >
              <path d="M20 7h-3a2 2 0 0 1-2-2V2"></path>
              <path d="M16 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
              <path d="M12 13V7"></path>
              <path d="M9 10h6"></path>
            </svg>
            <CardTitle className="text-white text-lg">Salesforce Records</CardTitle>
          </div>
          <Badge className="bg-blue-600 text-white">Agentforce Connected</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="records" className="w-full">
          <TabsList className="w-full bg-gray-700 rounded-none">
            <TabsTrigger value="records" className="data-[state=active]:bg-blue-600">
              Records
            </TabsTrigger>
            <TabsTrigger value="files" className="data-[state=active]:bg-blue-600">
              Files
            </TabsTrigger>
            <TabsTrigger value="automation" className="data-[state=active]:bg-blue-600">
              Automation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="records" className="p-4 space-y-4">
            {records.map((record) => (
              <div key={record.id} className="bg-gray-700 p-3 rounded-md border border-gray-600">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-white">{record.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-600">
                        {record.id}
                      </Badge>
                      <Badge
                        className={
                          record.type === "Opportunity"
                            ? "bg-green-900/30 text-green-300 border-green-800"
                            : record.type === "Lead"
                              ? "bg-yellow-900/30 text-yellow-300 border-yellow-800"
                              : "bg-purple-900/30 text-purple-300 border-purple-800"
                        }
                      >
                        {record.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-300">Status: {record.status}</div>
                    <div className="text-xs text-gray-400 mt-1">Owner: {record.owner}</div>
                  </div>
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <div className="text-xs text-gray-400">Created: {record.createdDate}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-300">{record.attachedImages} images</span>
                    <Button
                      size="sm"
                      disabled={!selectedImage}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7 px-2"
                    >
                      Attach Image
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="files" className="p-4">
            <div className="bg-gray-700 p-4 rounded-md border border-gray-600">
              <h3 className="font-medium text-white mb-3">Recent Image Files</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-800 rounded">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-400"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <span className="text-gray-300">product_showcase.jpg</span>
                  </div>
                  <Badge className="bg-green-900/30 text-green-300 border-green-800">OPP-00123</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-800 rounded">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-400"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <span className="text-gray-300">campaign_banner.jpg</span>
                  </div>
                  <Badge className="bg-purple-900/30 text-purple-300 border-purple-800">CAMP-00789</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-800 rounded">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-400"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <span className="text-gray-300">profile_headshot.jpg</span>
                  </div>
                  <Badge className="bg-yellow-900/30 text-yellow-300 border-yellow-800">LEAD-00456</Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="automation" className="p-4">
            <div className="bg-gray-700 p-4 rounded-md border border-gray-600">
              <h3 className="font-medium text-white mb-3">Automation Flows</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-800 rounded-md">
                  <div className="flex justify-between items-center">
                    <h4 className="text-blue-300 font-medium">Image Generation Flow</h4>
                    <Badge className="bg-green-600 text-white">Active</Badge>
                  </div>
                  <p className="text-gray-300 text-sm mt-2">
                    When an image is generated and attached to an Opportunity, notify the opportunity owner and add a
                    task to review the image.
                  </p>
                </div>
                <div className="p-3 bg-gray-800 rounded-md">
                  <div className="flex justify-between items-center">
                    <h4 className="text-blue-300 font-medium">Campaign Asset Creator</h4>
                    <Badge className="bg-green-600 text-white">Active</Badge>
                  </div>
                  <p className="text-gray-300 text-sm mt-2">
                    When an image is attached to a Campaign, create a Campaign Asset record and notify the marketing
                    team.
                  </p>
                </div>
                <div className="p-3 bg-gray-800 rounded-md">
                  <div className="flex justify-between items-center">
                    <h4 className="text-blue-300 font-medium">Lead Enrichment</h4>
                    <Badge className="bg-yellow-600 text-white">Paused</Badge>
                  </div>
                  <p className="text-gray-300 text-sm mt-2">
                    When a new Lead is created, generate a personalized image based on the Lead's industry and
                    interests.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
