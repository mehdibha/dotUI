"use client"

import { Bubble, BubbleContent, BubbleReactions } from "@/registry/ui/bubble"

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 pb-3">
      <Bubble variant="muted">
        <BubbleContent>We just passed 10k stars!</BubbleContent>
        <BubbleReactions>🎉 3</BubbleReactions>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>Huge. Congrats team!</BubbleContent>
        <BubbleReactions align="start">❤️ 2</BubbleReactions>
      </Bubble>
    </div>
  )
}
