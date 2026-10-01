import { DEFAULT_CODE_OPTIONS } from "@/publisher/code-options"
import { DEFAULTS } from "@/modules/studio/axes"
import type { StudioState } from "@/modules/studio/axes"
import type { Studio } from "@/modules/studio/state"

import { designSystem } from "./theme"
import type { State } from "./theme"

/* The real /studio panel takes a `Studio` object; here it's built from a
   frame's state with inert setters, so the panel renders exactly as the
   state dictates — sliders, selects and specimens all follow the frame. */
export function studioAt(partial: State): Studio {
  const state: StudioState = { ...DEFAULTS, ...partial }
  const noop = () => {}
  return {
    state,
    preset: { state, codeOptions: DEFAULT_CODE_OPTIONS },
    encoded: undefined,
    designSystem: designSystem(partial),
    set: () => noop,
    setState: noop,
    setPreset: noop,
    codeOptions: DEFAULT_CODE_OPTIONS,
    setCodeOption: noop,
    section: (defaults) => ({
      modified: Object.entries(defaults).some(
        ([key, value]) =>
          JSON.stringify(state[key as keyof StudioState]) !==
          JSON.stringify(value),
      ),
      onReset: noop,
    }),
  }
}
