"use client"

import {
  Bubble,
  BubbleContent,
  BubbleReactions,
  type BubbleProps,
} from "@/registry/ui/bubble"

export default function Demo({
  text = "Shipping it this week 🚀",
  variant = "primary",
  align = "start",
  reactions = false,
}: {
  text?: string
  variant?: BubbleProps["variant"]
  align?: BubbleProps["align"]
  reactions?: boolean
} = {}) {
  return (
    <div className="flex w-full max-w-sm flex-col">
      <Bubble data-control-target variant={variant} align={align}>
        <BubbleContent>{text}</BubbleContent>
        {reactions && <BubbleReactions>🎉 3</BubbleReactions>}
      </Bubble>
    </div>
  )
}
