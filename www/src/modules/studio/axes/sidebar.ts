/* Sidebar — how the desktop sidebar collapses and expands.

   Engine: the `--studio-sidebar-state-*` vars its gap, panel, group labels
   and rail read. */

import type { Resolved, StudioState } from "./index"
import { ease, resolveStateChange } from "./motion"
import type { StateChange } from "./motion"
import { STATE_CHANGE } from "./schema"
import type { ChapterSchema } from "./schema"

/* shadcn's: 200ms linear. */
const MOTION: StateChange = { duration: 200, ease: ease("linear") }

export const SIDEBAR_DEFAULTS = { sidebarMotion: MOTION }

export const SIDEBAR_SCHEMA: ChapterSchema<typeof SIDEBAR_DEFAULTS> = {
  sidebarMotion: STATE_CHANGE,
}

export function resolveSidebar(state: StudioState): Resolved {
  return {
    tokens: resolveStateChange("sidebar", state.sidebarMotion, MOTION),
  }
}
