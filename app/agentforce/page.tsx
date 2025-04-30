import AgentforceInteraction from "@/components/agentforce-interaction"

export default function AgentforcePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 gradient-text">Clair-X + Salesforce Agentforce</h1>
      <p className="text-muted-foreground mb-8">
        Generate AI images enhanced with Salesforce CRM data using Agentforce
      </p>

      <AgentforceInteraction />
    </div>
  )
}
