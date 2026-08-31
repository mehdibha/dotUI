"use client"

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
import { Label } from "@/registry/ui/field"
import {
  ProgressBar,
  ProgressBarControl,
  ProgressBarFill,
} from "@/registry/ui/progress-bar"
import { Separator } from "@/registry/ui/separator"

const models = [
  { label: "Claude Opus 4.5", amount: "712K", value: 36 },
  { label: "Claude Sonnet 4.5", amount: "448K", value: 22 },
  { label: "Claude Haiku 4.5", amount: "196K", value: 10 },
  { label: "Embeddings", amount: "84K", value: 4 },
]

export function UsageCredits({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <CardTitle>Usage</CardTitle>
        <CardDescription>Credits used this billing cycle</CardDescription>
        <CardAction>
          <Badge>Pro</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-2xl font-semibold tabular-nums">
          1.24M{" "}
          <span className="text-sm font-normal text-fg-muted">/ 2M tokens</span>
        </p>
        <div className="space-y-3">
          {models.map((model) => (
            <ProgressBar
              key={model.label}
              aria-label={model.label}
              value={model.value}
              className="w-full"
            >
              <div className="flex items-center justify-between gap-2">
                <Label className="min-w-0 truncate">{model.label}</Label>
                <span className="shrink-0 text-sm text-fg-muted tabular-nums">
                  {model.amount}
                </span>
              </div>
              <ProgressBarControl>
                <ProgressBarFill className="bg-primary" />
              </ProgressBarControl>
            </ProgressBar>
          ))}
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex items-center justify-between gap-2">
        <span className="text-sm text-fg-muted">Resets Sep 1</span>
        <Button variant="quiet" size="sm">
          Manage plan
        </Button>
      </CardFooter>
    </Card>
  )
}
