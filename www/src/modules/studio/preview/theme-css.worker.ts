import { themeCss } from "@/lib/theme-css"
import type { ColorConfig } from "@/registry/theme"

self.addEventListener("message", (event: MessageEvent<ColorConfig>) => {
  self.postMessage(themeCss(event.data))
})
