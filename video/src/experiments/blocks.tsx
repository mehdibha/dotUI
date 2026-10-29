import type { ComponentType } from "react"
import { AbsoluteFill, useCurrentFrame } from "remotion"

import { getPreset } from "@/modules/presets"
import { BrandContext } from "@/modules/studio/assets/brand"
import AiChat from "@/modules/studio/preview/blocks/ai-chat"
import Banking from "@/modules/studio/preview/blocks/banking"
import Checkout from "@/modules/studio/preview/blocks/checkout"
import CodeReview from "@/modules/studio/preview/blocks/code-review"
import Customers from "@/modules/studio/preview/blocks/customers"
import Dashboard from "@/modules/studio/preview/blocks/dashboard"
import FileManager from "@/modules/studio/preview/blocks/file-manager"
import Invoice from "@/modules/studio/preview/blocks/invoice"
import Logs from "@/modules/studio/preview/blocks/logs"
import Mail from "@/modules/studio/preview/blocks/mail"
import Messaging from "@/modules/studio/preview/blocks/messaging"
import MusicPlayer from "@/modules/studio/preview/blocks/music-player"
import Notifications from "@/modules/studio/preview/blocks/notifications-center"
import SearchResults from "@/modules/studio/preview/blocks/search-results"
import Settings from "@/modules/studio/preview/blocks/settings"

import { StudioPanel } from "../lib/studio"
import { designSystem, Theme, WarmIcons } from "../lib/theme"
import { BEAT } from "../lib/timing"
import { SCREEN, STUDIO, ZOOM_TO } from "./grid"

/* The studio as Create leaves it, its preview cutting on the beat through
   every block, each in its own preset, the panel on that preset. */

const BLOCKS: [Block: ComponentType, preset: string][] = [
  [Dashboard, "vercel"],
  [MusicPlayer, "spotify"],
  [Checkout, "stripe"],
  [AiChat, "claude"],
  [CodeReview, "github"],
  [Banking, "wise"],
  [SearchResults, "pinterest"],
  [Settings, "linear"],
  [Messaging, "bluesky"],
  [Logs, "supabase"],
  [FileManager, "material3"],
  [Notifications, "headspace"],
  [Customers, "polaris"],
  [Mail, "notion"],
  [Invoice, "untitled"],
]

export const BLOCKS_FRAMES = BLOCKS.length * BEAT

const { panel, preview } = STUDIO
const place = ({ x, y, width, height }: typeof panel) => ({
  left: x,
  top: y,
  width,
  height,
})

// The preview is an iframe on the site, so blocks size to its viewport.
const VIEWPORT_CSS = `
[data-viewport] .h-screen, [data-viewport] .h-svh { height: ${preview.height}px }
[data-viewport] .min-h-screen, [data-viewport] .min-h-svh { min-height: ${preview.height}px }
`

export function BlocksScene() {
  const frame = useCurrentFrame()
  const [Block, id] =
    BLOCKS[Math.min(Math.floor(frame / BEAT), BLOCKS.length - 1)]!
  const { state } = getPreset(id)!
  return (
    <AbsoluteFill>
      <WarmIcons />
      <style>{VIEWPORT_CSS}</style>
      <div
        style={{
          position: "absolute",
          width: SCREEN.width,
          height: SCREEN.height,
          transform: `scale(${ZOOM_TO})`,
          transformOrigin: "0 0",
        }}
      >
        <Theme mode="dark">
          <div className="absolute inset-0 bg-bg text-fg">
            <div className="absolute flex flex-col" style={place(panel)}>
              <StudioPanel id={id} />
            </div>
            <div
              className="absolute overflow-hidden border border-border/45"
              style={{ ...place(preview), borderRadius: STUDIO.radius }}
            >
              <Theme state={state}>
                <BrandContext.Provider value={designSystem(state).assets}>
                  <div
                    data-viewport
                    className="absolute inset-0 overflow-hidden bg-bg text-fg"
                    // Fixed bars pin to the preview, as to the iframe.
                    style={{ transform: "translate(0)" }}
                  >
                    <Block />
                  </div>
                </BrandContext.Provider>
              </Theme>
            </div>
          </div>
        </Theme>
      </div>
    </AbsoluteFill>
  )
}
