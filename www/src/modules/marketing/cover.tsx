"use client"

import { useEffect, useRef, useState } from "react"
import type { RefObject } from "react"

// The studio renders at a desktop size; its panel and preview are cropped
// out of it and scaled into a 1080px wide window.
const STUDIO = { width: 1536, height: 960 }
const WIDTH = 1080
// Around the crop, in studio pixels: the studio's own gutter.
const GUTTER = 24

/* The social cover: the GitHub social preview and the site's share image.
   `scripts/capture-cover.mts` screenshots it at each size it ships in. */
export function Cover() {
  const studio = useRef<HTMLIFrameElement>(null)
  const crop = useCrop(studio)
  const zoom = WIDTH / (crop ? crop.width + 2 * GUTTER : STUDIO.width)
  return (
    <div className="flex h-svh w-svw flex-col items-center overflow-hidden bg-[#1a100f] pt-16">
      <img src="/brand/dotui-wordmark-white.svg" alt="dotUI" className="h-24" />
      {/* Taller than the canvas: the bottom edge crops it. */}
      <div
        className="mt-14 shrink-0 overflow-hidden rounded-2xl border border-white/15"
        style={{ background: crop?.background, padding: crop && GUTTER * zoom }}
      >
        <div
          className="overflow-hidden"
          style={
            crop && { width: crop.width * zoom, height: crop.height * zoom }
          }
        >
          <iframe
            ref={studio}
            src="/studio?preset=origin&mode=dark"
            title="dotUI Studio"
            style={{
              ...STUDIO,
              zoom,
              marginLeft: crop && -crop.x,
              marginTop: crop && -crop.y,
            }}
            className="block"
          />
        </div>
      </div>
    </div>
  )
}

type Crop = {
  x: number
  y: number
  width: number
  height: number
  background: string
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** Every document on the page: the studio and its preview are frames. */
const documents = (win: Window): Document[] => [
  win.document,
  ...Array.from(win.frames, documents).flat(),
]

/** Once the studio's preview is in, crops the studio to the row holding the
 *  panel and the preview, then marks the page ready to screenshot. */
function useCrop(studio: RefObject<HTMLIFrameElement | null>) {
  const [crop, setCrop] = useState<Crop>()
  useEffect(() => {
    let cancelled = false
    void (async () => {
      let row: HTMLElement | null | undefined
      while (
        !(row = studio.current?.contentDocument?.querySelector(
          "[data-preview-loaded]",
        )?.parentElement)
      ) {
        if (cancelled) return
        await sleep(100)
      }
      const { x, y, width, height } = row.getBoundingClientRect()
      const { backgroundColor } = getComputedStyle(row.ownerDocument.body)
      setCrop({ x, y, width, height, background: backgroundColor })
      await Promise.all(documents(window).map((doc) => doc.fonts.ready))
      // The preview's spinner fades out.
      await sleep(1000)
      if (!cancelled) document.documentElement.dataset.coverReady = ""
    })()
    return () => {
      cancelled = true
      delete document.documentElement.dataset.coverReady
    }
  }, [studio])
  return crop
}
