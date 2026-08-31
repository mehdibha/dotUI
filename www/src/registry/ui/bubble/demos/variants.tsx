"use client"

import { Bubble, BubbleContent } from "@/registry/ui/bubble"

const variants = [
  "primary",
  "neutral",
  "muted",
  "tinted",
  "outline",
  "ghost",
  "danger",
] as const

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      {variants.map((variant) => (
        <Bubble key={variant} variant={variant}>
          <BubbleContent>This is the {variant} bubble.</BubbleContent>
        </Bubble>
      ))}
    </div>
  )
}
