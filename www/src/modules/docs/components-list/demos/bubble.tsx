"use client"

import { Bubble, BubbleContent, BubbleGroup } from "@/registry/ui/bubble"

export function BubbleDemo() {
  return (
    <div className="flex w-full max-w-[14.5rem] flex-col gap-2">
      <BubbleGroup>
        <Bubble variant="muted">
          <BubbleContent>Have you tried the new studio yet?</BubbleContent>
        </Bubble>
      </BubbleGroup>
      <Bubble align="end">
        <BubbleContent>Shipping this week 🚀</BubbleContent>
      </Bubble>
    </div>
  )
}
