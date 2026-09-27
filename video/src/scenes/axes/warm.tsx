import { useState } from "react"
import { continueRender, delayRender } from "remotion"

import { HeartIcon, SearchIcon } from "@/registry/icons"
import { IconLibraryContext } from "@/registry/icons/create-icon"
import type { IconLibraryName } from "@/registry/icons/icon-map"

import { loadFonts } from "../../lib/theme"

/* Registry icons in other libraries lazy-load behind their own Suspense,
   showing lucide meanwhile — which a still would catch. Rendering one icon
   per library starts each registry loader on mount, and the frame holds
   until the chunks are in and React has swapped them. Fonts the panel shows
   before any tile themes with them load up front too. */

const LIBRARIES: IconLibraryName[] = ["phosphor", "hugeicons"]

export function Warm({ fonts }: { fonts: string[] }) {
  useState(() => {
    loadFonts(fonts, "axes fonts")
    const handle = delayRender("icon libraries", {
      timeoutInMilliseconds: 60_000,
    })
    void Promise.all([
      import("@/registry/__generated__/__phosphor__"),
      import("@/registry/__generated__/__hugeicons__"),
    ]).then(() => setTimeout(() => continueRender(handle), 120))
    return null
  })
  return (
    <div
      aria-hidden
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      {LIBRARIES.map((library) => (
        <IconLibraryContext.Provider key={library} value={library}>
          <SearchIcon />
          <HeartIcon />
        </IconLibraryContext.Provider>
      ))}
    </div>
  )
}
