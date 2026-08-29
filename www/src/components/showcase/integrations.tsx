"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Separator } from "@/registry/ui/separator"
import { Switch } from "@/registry/ui/switch"

const integrations = [
  {
    name: "Slack",
    description: "Send alerts to your channels.",
    connected: true,
  },
  {
    name: "GitHub",
    description: "Link commits and pull requests.",
    connected: true,
  },
  {
    name: "Linear",
    description: "Sync issues with your backlog.",
    connected: false,
  },
  {
    name: "Figma",
    description: "Preview design files inline.",
    connected: false,
  },
  {
    name: "Notion",
    description: "Embed docs next to your work.",
    connected: true,
  },
]

export function Integrations(props: React.ComponentProps<"div">) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
        <CardDescription>
          Connect the tools your team already uses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {integrations.map((integration, index) => (
          <div key={integration.name}>
            {index > 0 && <Separator className="my-3" />}
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-neutral text-sm font-medium">
                {integration.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1 text-sm">
                <p className="truncate">{integration.name}</p>
                <p className="truncate text-fg-muted">
                  {integration.description}
                </p>
              </div>
              <Switch
                aria-label={`Enable ${integration.name}`}
                defaultSelected={integration.connected}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
