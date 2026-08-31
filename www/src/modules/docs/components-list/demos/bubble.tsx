"use client"

import { Bubble, BubbleContent, BubbleGroup } from "@/registry/ui/bubble"

export function BubbleDemo() {
  return (
    <div className="flex w-full max-w-3xs flex-col gap-2">
      <BubbleGroup>
        <Bubble variant="muted">
          <BubbleContent>Did you try the studio?</BubbleContent>
        </Bubble>
      </BubbleGroup>
      <Bubble align="end">
        <BubbleContent>Shipping it this week 🚀</BubbleContent>
      </Bubble>
    </div>
  )
}
