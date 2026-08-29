"use client"

import { CopyIcon, PlusIcon } from "@/registry/icons"
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
import { Separator } from "@/registry/ui/separator"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

const apiKeys = [
  {
    name: "Production",
    key: "sk-live-••••4f2a",
    created: "Mar 12, 2026",
    revoked: false,
  },
  {
    name: "Staging",
    key: "sk-test-••••9c81",
    created: "May 4, 2026",
    revoked: false,
  },
  {
    name: "CI deploy",
    key: "sk-live-••••b7d3",
    created: "Jan 28, 2026",
    revoked: true,
  },
  {
    name: "Local development",
    key: "sk-test-••••e5c0",
    created: "Jun 17, 2026",
    revoked: false,
  },
  {
    name: "Analytics service",
    key: "sk-live-••••a1f8",
    created: "Jul 9, 2026",
    revoked: false,
  },
]

export function ApiKeys(props: React.ComponentProps<"div">) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>API keys</CardTitle>
        <CardDescription>Manage keys for your applications.</CardDescription>
        <CardAction>
          <Button variant="secondary">
            <PlusIcon />
            Create key
          </Button>
        </CardAction>
      </CardHeader>
      <Separator />
      <CardContent>
        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div
              key={apiKey.name}
              className="flex items-center justify-between gap-2"
            >
              <div className="min-w-0 text-sm">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium">{apiKey.name}</p>
                  {apiKey.revoked && (
                    <Badge variant="danger" size="sm">
                      Revoked
                    </Badge>
                  )}
                </div>
                <p className="mt-0.5 flex items-center gap-2 text-fg-muted">
                  <span className="font-mono text-xs">{apiKey.key}</span>
                  <span className="truncate text-xs">
                    Created {apiKey.created}
                  </span>
                </p>
              </div>
              <Tooltip>
                <Button
                  variant="quiet"
                  size="sm"
                  isIconOnly
                  aria-label={`Copy ${apiKey.name} key`}
                >
                  <CopyIcon />
                </Button>
                <TooltipContent>Copy key</TooltipContent>
              </Tooltip>
            </div>
          ))}
        </div>
      </CardContent>
      <Separator />
      <CardFooter>
        <p className="text-sm text-fg-muted">
          Learn more about{" "}
          <a href="#" className="text-fg-accent underline underline-offset-4">
            API authentication
          </a>
          .
        </p>
      </CardFooter>
    </Card>
  )
}
