import type { ComponentType, ReactNode } from "react"
import { memo, useEffect } from "react"

import Checkout from "@/modules/studio/preview/blocks/checkout"
import CodeReview from "@/modules/studio/preview/blocks/code-review"
import Customers from "@/modules/studio/preview/blocks/customers"
import FileManager from "@/modules/studio/preview/blocks/file-manager"
import Invoice from "@/modules/studio/preview/blocks/invoice"
import Mail from "@/modules/studio/preview/blocks/mail"
import Messaging from "@/modules/studio/preview/blocks/messaging"
import MusicPlayer from "@/modules/studio/preview/blocks/music-player"

import { Theme } from "../../lib/theme"
import type { State } from "../../lib/theme"
import type { Content } from "./tiles"
import { TILE_H, TILE_W } from "./tiles"

const BLOCKS: Record<Exclude<Content, "canvas">, ComponentType> = {
  mail: Mail,
  customers: Customers,
  "file-manager": FileManager,
  "code-review": CodeReview,
  checkout: Checkout,
  invoice: Invoice,
  messaging: Messaging,
  "music-player": MusicPlayer,
}

/* Blocks size themselves to the viewport (h-svh, min-h-screen); inside a
   tile the tile is the viewport. */
export const SCREEN_CSS = `
.pt-screen .h-svh,.pt-screen .h-screen{height:100%!important}
.pt-screen .min-h-svh,.pt-screen .min-h-screen{min-height:100%!important}
`

/* A block may run a wall-clock timer (the music player ticks its progress
   every second), which would make a frame depend on how long the tab has been
   rendering. Mount effects run children first, siblings in order, so a stub
   placed before the block and a restore placed after bracket exactly its
   effects: its interval never starts. */
let realSetInterval: typeof window.setInterval | null = null

function StopClock() {
  useEffect(() => {
    realSetInterval ??= window.setInterval
    window.setInterval = (() => 0) as unknown as typeof window.setInterval
  }, [])
  return null
}

function StartClock() {
  useEffect(() => {
    if (realSetInterval) window.setInterval = realSetInterval
  }, [])
  return null
}

/** A themed app surface. Memoized, so camera frames never re-render the app. */
export const Surface = memo(function Surface({
  content,
  state,
  mode,
  children,
}: {
  content: Content
  state: State
  mode: "light" | "dark"
  /** The canvas tile's content (it paints its own background). */
  children?: ReactNode
}) {
  const Block = content === "canvas" ? null : BLOCKS[content]
  return (
    <div
      className="pt-screen"
      style={{
        position: "absolute",
        inset: 0,
        width: TILE_W,
        height: TILE_H,
        overflow: "hidden",
        contain: "strict",
      }}
    >
      <Theme state={state} mode={mode}>
        <div
          className={
            Block ? "relative h-full w-full bg-bg" : "relative h-full w-full"
          }
        >
          {Block ? (
            <>
              <StopClock />
              <Block />
              <StartClock />
            </>
          ) : (
            children
          )}
        </div>
      </Theme>
    </div>
  )
})
