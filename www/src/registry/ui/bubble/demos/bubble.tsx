"use client"

import { Bubble, BubbleContent, BubbleGroup } from "@/registry/ui/bubble"

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <BubbleGroup>
        <Bubble variant="muted">
          <BubbleContent>Did you see the new studio panel?</BubbleContent>
        </Bubble>
        <Bubble variant="muted">
          <BubbleContent>The drill-in animation is so smooth.</BubbleContent>
        </Bubble>
      </BubbleGroup>
      <Bubble align="end">
        <BubbleContent>Shipping it this week 🚀</BubbleContent>
      </Bubble>
    </div>
  )
}
