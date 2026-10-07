import { parseState } from "@/modules/studio/axes"
import type { PanelSystem } from "@/modules/studio/panel"
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
