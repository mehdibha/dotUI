"use client"

import { BotIcon, FolderIcon, TriangleAlertIcon } from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Checkbox } from "@/registry/ui/checkbox"
import { Separator } from "@/registry/ui/separator"

const context = [
  { icon: BotIcon, label: "Agent", value: "deploy-agent" },
  { icon: FolderIcon, label: "Directory", value: "~/acme/api" },
  { icon: TriangleAlertIcon, label: "Affects the production database" },
]

export function ApprovalPrompt({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <CardTitle>Approval required</CardTitle>
        <CardDescription>
          The deploy agent wants to run a command.
        </CardDescription>
        <CardAction>
          <Badge variant="warning">Waiting</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md bg-neutral p-3 font-mono text-xs">
          <span className="text-fg-muted select-none">$ </span>
          pnpm db:migrate --env production
        </div>
        <ul className="space-y-2.5">
          {context.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-2.5 text-sm text-fg-muted"
            >
              <item.icon className="size-4 shrink-0" />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {"value" in item && (
                <span className="shrink-0 font-mono text-xs">{item.value}</span>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
      <Separator />
      <CardFooter className="flex items-center justify-between gap-2">
        <Checkbox className="min-w-0 shrink">Always allow</Checkbox>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="quiet">Deny</Button>
          <Button variant="primary">Allow once</Button>
        </div>
      </CardFooter>
    </Card>
  )
}
