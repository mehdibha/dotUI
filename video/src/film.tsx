import type { ReactNode } from "react"
import { useLayoutEffect, useState } from "react"
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  useCurrentFrame,
} from "remotion"

import { loadFonts, PRESET_FONTS } from "./lib/theme"
import { FPS } from "./lib/timing"

/* Wraps every composition: scrubs CSS animations to the frame (see
   styles.css) and holds the first frame until the film's faces are in. */
export function Film({ children }: { children: ReactNode }) {
  const frame = useCurrentFrame()
  useLayoutEffect(() => {
    document.documentElement.style.setProperty(
      "--video-time",
      String(frame / FPS),
    )
  }, [frame])
  useState(() => {
    loadFonts(PRESET_FONTS, "preset fonts")
    const handle = delayRender("webfonts")
    void document.fonts.ready.then(() => continueRender(handle))
    return null
  })
  return <AbsoluteFill style={{ background: "#000" }}>{children}</AbsoluteFill>
}
