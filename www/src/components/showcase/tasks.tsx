"use client"

import { PlusIcon } from "@/registry/icons"
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
import {
  Checkbox,
  CheckboxControl,
  CheckboxIndicator,
} from "@/registry/ui/checkbox"
import { Label } from "@/registry/ui/field"
import { Separator } from "@/registry/ui/separator"

const tasks = [
  {
    id: "feedback",
    label: "Reply to Amira's design feedback",
    done: true,
    tag: { label: "Design", variant: "info" },
  },
  { id: "email", label: "Ship onboarding email copy", done: true },
  {
    id: "checkout",
    label: "Fix checkout crash on iOS",
    done: false,
    tag: { label: "Urgent", variant: "danger" },
  },
  { id: "roadmap", label: "Prepare Q3 roadmap review", done: false },
  {
    id: "pricing",
    label: "Update pricing page screenshots",
    done: false,
    tag: { label: "Design", variant: "info" },
  },
  { id: "flights", label: "Book flights for the offsite", done: false },
  {
    id: "changelog",
    label: "Draft the April changelog",
    done: false,
    tag: { label: "Writing", variant: "neutral" },
  },
  { id: "interview", label: "Review candidate take-homes", done: false },
] as const

export function Tasks(props: React.ComponentProps<"div">) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Today</CardTitle>
        <CardDescription>2 of 8 done</CardDescription>
        <CardAction>
          <Button variant="quiet" size="sm" isIconOnly aria-label="Add task">
            <PlusIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {tasks.map((task) => (
            <div key={task.id} className="flex min-w-0 items-center gap-2 py-1">
              <Checkbox defaultSelected={task.done} className="min-w-0 flex-1">
                <CheckboxControl>
                  <CheckboxIndicator />
                </CheckboxControl>
                <Label className="min-w-0 truncate font-normal in-data-selected:text-fg-muted in-data-selected:line-through">
                  {task.label}
                </Label>
              </Checkbox>
              {"tag" in task && (
                <Badge appearance="subtle" variant={task.tag.variant} size="sm">
                  {task.tag.label}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <Separator />
      <CardFooter>
        <p className="text-sm text-fg-muted">
          Unfinished tasks roll over to tomorrow.
        </p>
      </CardFooter>
    </Card>
  )
}
