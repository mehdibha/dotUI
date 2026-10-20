"use client"

import {
  BellIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
} from "@/registry/icons"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/registry/ui/alert"
import { Button } from "@/registry/ui/button"

import { Board, BoardSection } from "./board"

const ALERTS = [
  {
    variant: "neutral",
    Icon: BellIcon,
    title: "Scheduled maintenance",
    text: "The dashboard is read-only on Sunday, 02:00–04:00 UTC.",
    action: "Details",
  },
  {
    variant: "info",
    Icon: InfoIcon,
    title: "A new version is out",
    text: "Version 4.2 adds SSO and audit logs.",
    action: "Update",
  },
  {
    variant: "success",
    Icon: CircleCheckIcon,
    title: "Domain verified",
    text: "acme.com now serves over HTTPS.",
    action: "View",
  },
  {
    variant: "warning",
    Icon: TriangleAlertIcon,
    title: "Usage at 85%",
    text: "You'll run out of build minutes in 3 days.",
    action: "Upgrade",
  },
  {
    variant: "danger",
    Icon: CircleAlertIcon,
    title: "Payment failed",
    text: "We couldn't charge the card ending in 4242.",
    action: "Retry",
  },
] as const

export default function AlertBoard() {
  return (
    <Board id="alert">
      <BoardSection title="Variants">
        <div className="flex w-full max-w-2xl flex-col gap-3">
          {ALERTS.map(({ variant, Icon, title, text, action }) => (
            <Alert key={variant} variant={variant}>
              <Icon />
              <AlertTitle>{title}</AlertTitle>
              <AlertDescription>{text}</AlertDescription>
              <AlertAction>
                <Button size="sm">{action}</Button>
              </AlertAction>
            </Alert>
          ))}
        </div>
      </BoardSection>
    </Board>
  )
}
