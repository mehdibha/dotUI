"use client"

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
import { TextArea } from "@/registry/ui/input"
import { TextField } from "@/registry/ui/text-field"
import { ToggleButton } from "@/registry/ui/toggle-button"
import { ToggleButtonGroup } from "@/registry/ui/toggle-button-group"

const sentiments = [
  { id: "amazing", label: "Amazing", emoji: "🤩" },
  { id: "good", label: "Good", emoji: "🙂" },
  { id: "meh", label: "Meh", emoji: "😕" },
  { id: "bad", label: "Bad", emoji: "😭" },
]

export function Feedback({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle>Send feedback</CardTitle>
        <CardDescription>
          Help us improve — how was your experience?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ToggleButtonGroup
          aria-label="How was your experience?"
          selectionMode="single"
          defaultSelectedKeys={["good"]}
        >
          {sentiments.map((sentiment) => (
            <ToggleButton
              key={sentiment.id}
              id={sentiment.id}
              isIconOnly
              aria-label={sentiment.label}
            >
              {sentiment.emoji}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <TextField aria-label="Feedback" className="w-full">
          <TextArea
            placeholder="Tell us what happened..."
            rows={2}
            className="min-h-14"
          />
        </TextField>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="quiet">Cancel</Button>
        <Button variant="primary">Send</Button>
      </CardFooter>
    </Card>
  )
}
