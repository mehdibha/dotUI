"use client"

/* The resolved color theme in the panel's own mode. */

import { useMemo } from "react"
import { useTheme } from "starter-themes"

import type { Mode } from "@dotui/colors"

import { resolveColorConfigCached } from "@/lib/resolve-color"

import { effective } from "./axes"
import type { Effective } from "./axes"
import { buildColorConfig, COLOR_DEFAULTS } from "./axes/color"
import { useCurrent } from "./selection"

const COLOR_KEYS = Object.keys(COLOR_DEFAULTS) as (keyof Effective)[]

/** Re-solves only when a color key changes. */
export function usePanelMode(state?: Effective) {
  const { state: saved } = useCurrent()
  const values = state ?? effective(saved).values
  const key = JSON.stringify(COLOR_KEYS.map((k) => values[k]))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const config = useMemo(() => buildColorConfig(values), [key])
  const theme = resolveColorConfigCached(config)
  const { resolvedTheme } = useTheme()
  const mode: Mode = resolvedTheme === "dark" ? "dark" : "light"
  return { theme, mode, m: theme[mode] }
}
