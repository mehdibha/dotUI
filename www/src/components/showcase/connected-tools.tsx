"use client"

import {
  GitBranchIcon,
  LayersIcon,
  MessageSquareIcon,
  PlusIcon,
  ServerIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Description, FieldContent, Label } from "@/registry/ui/field"
import { Separator } from "@/registry/ui/separator"
import { Switch, SwitchControl } from "@/registry/ui/switch"

const servers = [
  {
    name: "GitHub",
    description: "Repos, issues and pull requests",
    icon: GitBranchIcon,
    enabled: true,
  },
  {
    name: "Linear",
    description: "Projects and issue tracking",
    icon: LayersIcon,
    enabled: true,
  },
  {
    name: "Postgres",
    description: "Read-only production replica",
    icon: ServerIcon,
    enabled: true,
  },
  {
    name: "Slack",
    description: "Post updates to #shipping",
    icon: MessageSquareIcon,
    enabled: false,
  },
]

export function ConnectedTools({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <CardTitle>Connected tools</CardTitle>
        <CardDescription>MCP servers available to your agents</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {servers.map((server) => (
            <li key={server.name}>
              <Switch
                defaultSelected={server.enabled}
                className="w-full justify-between gap-3 has-data-description:items-center"
              >
                <FieldContent className="min-w-0 flex-row items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-(--studio-radius-item) bg-neutral">
                    <server.icon className="size-4 text-fg-muted" />
                  </div>
                  <span className="flex min-w-0 flex-col">
                    <Label>{server.name}</Label>
                    <Description className="truncate">
                      {server.description}
                    </Description>
                  </span>
                </FieldContent>
                <SwitchControl />
              </Switch>
            </li>
          ))}
        </ul>
      </CardContent>
      <Separator />
      <CardFooter className="flex items-center justify-between gap-2">
        <Button variant="quiet">
          <PlusIcon />
          Add server
        </Button>
        <span className="shrink-0 text-xs text-fg-muted">3 of 4 enabled</span>
      </CardFooter>
    </Card>
  )
}
