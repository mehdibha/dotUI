"use client"

import {
  CircleCheckIcon,
  CircleDashedIcon,
  GitBranchIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Badge } from "@/registry/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Loader } from "@/registry/ui/loader"
import { Separator } from "@/registry/ui/separator"
import { Skeleton } from "@/registry/ui/skeleton"

const steps = [
  { label: "Install dependencies", duration: "12s", status: "done" },
  { label: "Build application", duration: "48s", status: "done" },
  { label: "Deploy to edge network", status: "running" },
  { label: "Invalidate CDN cache", status: "pending" },
] as const

const logLines = [
  "▲ Detected Next.js 15.3.1",
  "Creating an optimized production build...",
]

export function DeployStatus({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <CardTitle className="min-w-0 truncate">
          Deploying to production
        </CardTitle>
        <CardDescription>Triggered by push to main · 1m ago</CardDescription>
        <CardAction>
          <Badge variant="info">Building</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2.5">
          {steps.map((step) => (
            <li
              key={step.label}
              className={cn(
                "flex items-center gap-2.5 text-sm",
                step.status === "pending" && "text-fg-muted",
              )}
            >
              {step.status === "done" ? (
                <CircleCheckIcon className="size-4 shrink-0 text-fg-success" />
              ) : step.status === "running" ? (
                <Loader aria-label={`${step.label} in progress`} />
              ) : (
                <CircleDashedIcon className="size-4 shrink-0" />
              )}
              <span className="min-w-0 flex-1 truncate">{step.label}</span>
              {"duration" in step && (
                <span className="shrink-0 text-xs text-fg-muted">
                  {step.duration}
                </span>
              )}
            </li>
          ))}
        </ul>
        <div className="space-y-1.5 rounded-md bg-neutral p-3 font-mono text-xs text-fg-muted">
          {logLines.map((line) => (
            <p key={line} className="truncate">
              {line}
            </p>
          ))}
          <Skeleton isLoading className="space-y-1.5">
            <Skeleton className="h-3 w-4/5 rounded-sm" />
            <Skeleton className="h-3 w-2/5 rounded-sm" />
          </Skeleton>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex items-center gap-2 text-sm text-fg-muted">
        <GitBranchIcon className="size-4 shrink-0" />
        <span className="shrink-0 font-mono text-xs">e4a1f9c</span>
        <span className="min-w-0 truncate">
          fix: debounce search input on the docs page
        </span>
      </CardFooter>
    </Card>
  )
}
