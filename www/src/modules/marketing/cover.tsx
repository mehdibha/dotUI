"use client"

import { useEffect, useRef } from "react"
import type { RefObject } from "react"

// The studio renders at a desktop size, scaled into a 1080px wide window.
const STUDIO = { width: 1536, height: 960 }
const ZOOM = 1080 / STUDIO.width

/* The social cover: the GitHub social preview and the site's share image.
   `scripts/capture-cover.mts` screenshots it at each size it ships in. */
export function Cover() {
  const studio = useRef<HTMLIFrameElement>(null)
  useReadySignal(studio)
  return (
    <div className="flex h-svh w-svw flex-col items-center overflow-hidden bg-[#1a100f] pt-16">
      <img src="/brand/dotui-wordmark-white.svg" alt="dotUI" className="h-24" />
      {/* Taller than the canvas: the bottom edge crops it. */}
      <div className="mt-14 shrink-0 overflow-hidden rounded-2xl border border-white/15">
        <iframe
          ref={studio}
          src="/studio?preset=origin&mode=dark"
          title="dotUI Studio"
          style={{ ...STUDIO, zoom: ZOOM }}
          className="block"
        />
      </div>
    </div>
  )
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** Every document on the page: the studio and its preview are frames. */
const documents = (win: Window): Document[] => [
  win.document,
  ...Array.from(win.frames, documents).flat(),
]

/** Marks the page ready to screenshot once the studio's preview is in. */
function useReadySignal(studio: RefObject<HTMLIFrameElement | null>) {
  useEffect(() => {
    let cancelled = false
    void (async () => {
      while (
        !studio.current?.contentDocument?.querySelector("[data-preview-loaded]")
      ) {
        if (cancelled) return
        await sleep(100)
      }
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
}
