import type { ComponentType } from "react"
import { memo } from "react"

import AiChat from "@/modules/studio/preview/blocks/ai-chat"
import Checkout from "@/modules/studio/preview/blocks/checkout"
import CodeReview from "@/modules/studio/preview/blocks/code-review"
import Customers from "@/modules/studio/preview/blocks/customers"
import FileManager from "@/modules/studio/preview/blocks/file-manager"
import Invoice from "@/modules/studio/preview/blocks/invoice"
import Mail from "@/modules/studio/preview/blocks/mail"
import Messaging from "@/modules/studio/preview/blocks/messaging"
import MusicPlayer from "@/modules/studio/preview/blocks/music-player"
import NotificationsCenter from "@/modules/studio/preview/blocks/notifications-center"
import SearchResults from "@/modules/studio/preview/blocks/search-results"
import Settings from "@/modules/studio/preview/blocks/settings"

import { Theme } from "../../lib/theme"
import type { State } from "../../lib/theme"
import type { Content } from "./tiles"
import { TILE_H, TILE_W } from "./tiles"

const BLOCKS: Record<Exclude<Content, "canvas">, ComponentType> = {
  mail: Mail,
  customers: Customers,
  "music-player": MusicPlayer,
  "code-review": CodeReview,
  checkout: Checkout,
  "ai-chat": AiChat,
  "file-manager": FileManager,
  messaging: Messaging,
  "search-results": SearchResults,
  invoice: Invoice,
  "notifications-center": NotificationsCenter,
  settings: Settings,
}

/* Blocks size themselves to the viewport (h-svh, min-h-screen); inside a
   tile the tile is the viewport. */
export const SCREEN_CSS = `
.pt-screen .h-svh,.pt-screen .h-screen{height:100%!important}
.pt-screen .min-h-svh,.pt-screen .min-h-screen{min-height:100%!important}
`

/** A themed app surface. Memoized on its inputs, so camera frames never re-render the app. */
export const Surface = memo(function Surface({
  content,
  state,
  mode,
  bare = false,
  children,
}: {
  content: Content
  state: State
  mode: "light" | "dark"
  /** No page background (the canvas fades its own in). */
  bare?: boolean
  children?: React.ReactNode
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
            bare ? "relative h-full w-full" : "relative h-full w-full bg-bg"
          }
        >
          {Block ? <Block /> : children}
        </div>
      </Theme>
    </div>
  )
})
