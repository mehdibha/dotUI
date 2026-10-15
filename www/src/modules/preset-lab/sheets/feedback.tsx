import { useEffect } from "react"

import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
} from "@/registry/__generated__/icons"
import { Alert, AlertDescription, AlertTitle } from "@/registry/ui/alert"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Label } from "@/registry/ui/field"
import { Loader } from "@/registry/ui/loader"
import {
  ProgressBar,
  ProgressBarControl,
  ProgressBarOutput,
} from "@/registry/ui/progress-bar"
import { Skeleton } from "@/registry/ui/skeleton"
import { ToastPrimitive, ToastProvider } from "@/registry/ui/toast"

import { Cell, Sheet } from "./layout"

const APPEARANCES = ["solid", "soft", "outline", "soft-outline", "dot"] as const
const TONES = [
  "neutral",
  "accent",
  "success",
  "warning",
  "danger",
  "info",
] as const

const ALERTS = [
  {
    variant: "neutral",
    icon: InfoIcon,
    title: "Heads up",
    body: "You are on the free plan.",
  },
  {
    variant: "info",
    icon: InfoIcon,
    title: "New version",
    body: "v2.4 ships Monday.",
  },
  {
    variant: "success",
    icon: CircleCheckIcon,
    title: "Deployed",
    body: "Production is live.",
  },
  {
    variant: "warning",
    icon: TriangleAlertIcon,
    title: "Storage almost full",
    body: "92% of 10 GB used.",
  },
  {
    variant: "danger",
    icon: CircleAlertIcon,
    title: "Payment failed",
    body: "Update your card to keep access.",
  },
] as const

const toastManager = ToastPrimitive.createToastManager()

export function FeedbackSheet() {
  // The toast never times out, so a capture always finds it.
  useEffect(() => {
    const id = toastManager.add({
      title: "Changes saved",
      description: "Your update is live.",
      type: "success",
    })
    return () => toastManager.close(id)
  }, [])

  return (
    <Sheet className="grid-cols-[1fr_1fr_340px]">
      <ToastProvider toastManager={toastManager} timeout={0} />
      <div className="flex flex-col gap-6">
        {APPEARANCES.map((appearance) => (
          <Cell key={appearance} label={`badge · ${appearance}`}>
            {TONES.map((tone) => (
              <Badge key={tone} appearance={appearance} variant={tone}>
                {tone}
              </Badge>
            ))}
          </Cell>
        ))}
        <Cell label="progress" className="flex-col items-stretch">
          <ProgressBar value={56} className="w-full">
            <div className="flex items-center justify-between gap-2">
              <Label>Uploading</Label>
              <ProgressBarOutput />
            </div>
            <ProgressBarControl />
          </ProgressBar>
        </Cell>
        <Cell label="loader">
          <Loader />
          <Button variant="primary" isPending>
            Saving
          </Button>
        </Cell>
        <Cell label="skeleton" className="flex-col items-stretch">
          <Skeleton isLoading className="space-y-3">
            {[0, 1].map((row) => (
              <div key={row} className="flex items-center gap-3">
                <Skeleton className="size-9 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-2/3" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </Skeleton>
        </Cell>
      </div>
      <Cell label="alert" className="flex-col items-stretch">
        {ALERTS.map(({ variant, icon: Icon, title, body }) => (
          <Alert key={variant} variant={variant}>
            <Icon />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{body}</AlertDescription>
          </Alert>
        ))}
      </Cell>
      <Cell label="toast · at the preset position">
        <span />
      </Cell>
    </Sheet>
  )
}
