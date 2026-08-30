"use client"

import { CircleCheckIcon, GitBranchIcon, PlusIcon } from "@/registry/icons"
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
import { Loader } from "@/registry/ui/loader"
import { Separator } from "@/registry/ui/separator"

const tasks = [
  {
    title: "Fix flaky checkout e2e test",
    branch: "agent/checkout-e2e",
    meta: "running · 4m 32s",
    status: "running",
  },
  {
    title: "Migrate icons to lucide",
    branch: "agent/lucide-icons",
    meta: "opened #517",
    status: "review",
  },
  {
    title: "Bump React Aria to 1.20",
    branch: "agent/rac-1.20",
    meta: "merged · 26m ago",
    status: "done",
  },
  {
    title: "Triage #482 · duplicate report",
    branch: "main",
    meta: "closed · 1h ago",
    status: "done",
  },
  {
    title: "Write docs for the new CLI flags",
    branch: "agent/cli-docs",
    meta: "merged · 2h ago",
    status: "done",
  },
] as const

export function AgentTasks({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <CardTitle>Agents</CardTitle>
        <CardDescription>
          Background tasks running in your workspace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li key={task.title} className="flex items-center gap-2.5">
              {task.status === "running" ? (
                <Loader aria-label={`${task.title} in progress`} />
              ) : task.status === "done" ? (
                <CircleCheckIcon className="size-4 shrink-0 text-fg-muted" />
              ) : (
                <CircleCheckIcon className="size-4 shrink-0 text-fg-success" />
              )}
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "truncate text-sm font-medium",
                    task.status === "done" && "text-fg-muted",
                  )}
                >
                  {task.title}
                </p>
                <p className="flex items-center gap-1 text-xs text-fg-muted">
                  <GitBranchIcon className="size-3 shrink-0" />
                  <span className="min-w-0 truncate font-mono">
                    {task.branch}
                  </span>
                  <span className="shrink-0">· {task.meta}</span>
                </p>
              </div>
              {task.status === "review" && (
                <Button variant="secondary" size="sm" className="shrink-0">
                  Review
                </Button>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
      <Separator />
      <CardFooter className="flex items-center justify-between gap-2">
        <p className="min-w-0 truncate text-sm text-fg-muted">
          1 running · 1 awaiting review
        </p>
        <Button variant="quiet" size="sm" className="shrink-0">
          <PlusIcon />
          New task
        </Button>
      </CardFooter>
    </Card>
  )
}
