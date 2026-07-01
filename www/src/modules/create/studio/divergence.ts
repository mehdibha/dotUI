'use client'

import { useCallback } from 'react'

import { CURSOR_DISABLED_VAR, CURSOR_INTERACTIVE_VAR } from '../cursor'
import { RADIUS_FACTOR_VAR } from '../layout'
import { DEFAULTS, useDesignSystem } from '../preset'
import type { DesignSystem } from '../preset'
import type { WorkspaceId } from './context'
import {
  BACKDROP_BLUR_VAR,
  BORDER_WIDTH_VAR,
  DEFAULT_MODE_VAR,
  FOCUS_RING_WIDTH_VAR,
  FONT_BODY_VAR,
  FONT_HEADING_VAR,
  ICON_LIBRARY_VAR,
  ICON_STROKE_VAR,
  LETTER_SPACING_VAR,
  MOTION_DURATION_VAR,
  MOTION_ENABLED_VAR,
  PALETTES_FOUNDATION_VAR,
  REDUCED_MOTION_VAR,
  SHADOW_INTENSITY_VAR,
  SPACING_SCALE_VAR,
  STYLE_FAMILY_VAR,
  TRANSLUCENT_VAR,
  TYPE_BASE_VAR,
  TYPE_SCALE_VAR,
} from './tokens'

/* ----------------------------------------------------------------------------
 * Per-workspace divergence — which token keys each workspace owns, so the rail
 * can flag "modified" workspaces and each can reset just its own axes.
 * -------------------------------------------------------------------------- */

const CHART_TOKENS = [
  '--chart-1',
  '--chart-2',
  '--chart-3',
  '--chart-4',
  '--chart-5',
]

/** Token keys owned by each workspace (color/spacing also track non-token state). */
const WORKSPACE_TOKENS: Record<WorkspaceId, string[]> = {
  start: [],
  color: [...CHART_TOKENS, PALETTES_FOUNDATION_VAR],
  typography: [
    FONT_HEADING_VAR,
    FONT_BODY_VAR,
    TYPE_SCALE_VAR,
    TYPE_BASE_VAR,
    LETTER_SPACING_VAR,
  ],
  shape: [RADIUS_FACTOR_VAR, BORDER_WIDTH_VAR],
  spacing: [SPACING_SCALE_VAR],
  surface: [
    STYLE_FAMILY_VAR,
    SHADOW_INTENSITY_VAR,
    BACKDROP_BLUR_VAR,
    TRANSLUCENT_VAR,
  ],
  motion: [MOTION_DURATION_VAR, MOTION_ENABLED_VAR, REDUCED_MOTION_VAR],
  icons: [ICON_LIBRARY_VAR, ICON_STROKE_VAR],
  interaction: [
    CURSOR_INTERACTIVE_VAR,
    CURSOR_DISABLED_VAR,
    FOCUS_RING_WIDTH_VAR,
    DEFAULT_MODE_VAR,
  ],
  components: [],
}

/** Whether a workspace has any change from the default system. */
export function isWorkspaceDirty(ds: DesignSystem, id: WorkspaceId): boolean {
  if (id === 'color') {
    if (ds.color !== undefined) return true
  }
  if (id === 'spacing') {
    if (ds.density !== DEFAULTS.density) return true
  }
  if (id === 'components') {
    // DEFAULTS.componentParams is fully populated with every default, so emptiness
    // isn't the signal — divergence is any param whose value differs from default.
    return Object.entries(ds.componentParams).some(([comp, params]) =>
      Object.entries(params).some(
        ([key, value]) => DEFAULTS.componentParams[comp]?.[key] !== value,
      ),
    )
  }
  return WORKSPACE_TOKENS[id].some((key) => ds.tokens[key] !== undefined)
}

/** Reset just one workspace's axes back to the default system. */
export function useResetWorkspace() {
  const { setDesignSystem } = useDesignSystem()
  return useCallback(
    (id: WorkspaceId) => {
      setDesignSystem((prev) => {
        const next = { ...prev, tokens: { ...prev.tokens } }
        for (const key of WORKSPACE_TOKENS[id]) delete next.tokens[key]
        if (id === 'color') next.color = undefined
        if (id === 'spacing') next.density = DEFAULTS.density
        if (id === 'components') next.componentParams = {}
        return next
      })
    },
    [setDesignSystem],
  )
}
