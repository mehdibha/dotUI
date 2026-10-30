import "./tab-storage"

import { useLayoutEffect } from "react"

import { effective, parseState } from "@/modules/studio/axes"
import { ALL_ROWS, CHAPTERS } from "@/modules/studio/chapters"
import { PanelPage } from "@/modules/studio/page"
import type { PanelSystem } from "@/modules/studio/panel"
import { RowsContext } from "@/modules/studio/row-host"
import { select, useCurrent } from "@/modules/studio/selection"
import { useStudio } from "@/modules/studio/use-studio"
import type { Studio } from "@/modules/studio/use-studio"

import type { State } from "./theme"

/* The real /studio panel takes a `Studio` and a `PanelSystem`; here they're
   built from a frame's state with inert setters, so the panel renders exactly
   as the state dictates — sliders, selects and specimens all follow the frame. */
export function studioAt(partial: State): Studio {
  const state = parseState(partial)
  const noop = () => {}
  return {
    state,
    effective: effective(state).values,
    set: () => noop,
    setState: noop,
  }
}

/** The panel header: a design system's name and dot, no switcher or buttons. */
export function panelSystem(name: string, swatch: string): PanelSystem {
  return {
    name,
    swatch,
    buttons: null,
    renderSwitcher: (trigger) => trigger,
  }
}

/** The real /studio panel on a preset, as the site shows it: its rows read
 *  the site's current design system, so the preset is made current. */
export function StudioPanel({ id }: { id: string }) {
  useLayoutEffect(() => select({ kind: "preset", id }), [id])
  const studio = useStudio()
  const { name, swatch } = useCurrent()
  return (
    <RowsContext.Provider value={ALL_ROWS}>
      <PanelPage
        chapters={CHAPTERS}
        studio={studio}
        system={panelSystem(name, swatch)}
      />
    </RowsContext.Provider>
  )
}
