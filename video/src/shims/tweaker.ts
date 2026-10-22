/* The dev tweaker reads Vite's `import.meta.env`, which the film's webpack
   build doesn't have: here every tweak is its default. */

import type { TweakConfig, TweakValue } from "@/dev/tweaker/types"

export const useTweak = <const C extends TweakConfig>(
  _label: string,
  config: C,
) => config.default as TweakValue<C>

export const setTweak = (_label: string, _value: unknown, _group?: string) => {}
