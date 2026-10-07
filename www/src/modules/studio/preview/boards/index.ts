import type { ComponentType } from "react"

import { BOARD_SLUG_PREFIX } from "@/modules/studio/preset/iframe-sync"

type Load = () => Promise<{ default: ComponentType }>

/* One board per panel chapter and family page, under the same id and label.
   Iframe-only: each loader carries its chunk's whole dependency map. */
export const BoardsIndex: Record<string, { title: string; load: Load }> = {
  color: { title: "Color", load: () => import("./color") },
  typography: { title: "Typography", load: () => import("./typography") },
  icons: { title: "Icons", load: () => import("./icons") },
  shape: { title: "Shape", load: () => import("./shape") },
  space: { title: "Density", load: () => import("./space") },
  states: { title: "States", load: () => import("./states") },
  motion: { title: "Motion", load: () => import("./motion") },
  buttons: { title: "Buttons", load: () => import("./buttons") },
  inputs: { title: "Inputs", load: () => import("./inputs") },
  selection: { title: "Selection", load: () => import("./selection") },
  menus: { title: "Menus & popovers", load: () => import("./menus") },
  dialogs: { title: "Dialogs", load: () => import("./dialogs") },
  nav: { title: "Navigation", load: () => import("./nav") },
  dates: { title: "Date & time", load: () => import("./dates") },
  display: { title: "Data display", load: () => import("./display") },
  feedback: { title: "Feedback", load: () => import("./feedback") },
  charts: { title: "Charts", load: () => import("./charts") },
}

/** The board a preview slug names, if any. */
export const boardOf = (slug: string) =>
  slug.startsWith(BOARD_SLUG_PREFIX)
    ? BoardsIndex[slug.slice(BOARD_SLUG_PREFIX.length)]
    : undefined
