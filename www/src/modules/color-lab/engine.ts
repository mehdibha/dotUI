/* The seat fills: adapt the rewritten engine's output (@dotui/colors,
   PR #449) into the lab's ColorSystem shape so it flows through the exact
   same views as the reference systems. The mapping is 1:1 by design — the
   engine's 12-job ladder (SPEC D1) IS the lab's 12-role frame. */

import { createTheme, STEPS, type Theme } from '@dotui/colors'

import {
  buildColorSystem,
  type ColorSystem,
  type ScaleRole,
  type UiRole,
} from './data'

/** The builder's default brand accent (registry/theme DEFAULT_COLOR_CONFIG). */
export const DEFAULT_SEED = '#438cd6'

// Engine job ladder ↔ lab role frame, index for index.
const JOB_ROLES: UiRole[] = [
  'appBg',
  'subtleBg',
  'uiBg',
  'uiBgHover',
  'uiBgActive',
  'borderSubtle',
  'border',
  'borderStrong',
  'solid',
  'solidHover',
  'textSubtle',
  'text',
]

const FAMILIES: { id: string; name: string; role: ScaleRole }[] = [
  { id: 'neutral', name: 'Neutral', role: 'neutral' },
  { id: 'accent', name: 'Accent', role: 'accent' },
  { id: 'danger', name: 'Danger', role: 'danger' },
  { id: 'success', name: 'Success', role: 'success' },
  { id: 'warning', name: 'Warning', role: 'warning' },
]

export interface EngineResult {
  system: ColorSystem
  report: Theme['report']
}

export function buildEngineSystem(seed: string): EngineResult {
  const theme = createTheme(seed)
  const roleMapping = Object.fromEntries(
    JOB_ROLES.map((role, index) => [role, index]),
  ) as Record<UiRole, number>

  const system = buildColorSystem({
    id: 'dotui',
    name: 'dotUI Engine',
    website: 'https://dotui.org',
    sources: ['packages/colors — createTheme() output, live'],
    description: `Generated live from seed ${seed}. One engine, no algorithm menu: both modes, solved solids and on-labels, every guarantee enforced in-loop.`,
    philosophy:
      'CIELAB-anchored lightness skeletons per mode, Radix-fitted chroma arcs, hue-banded text chroma, solids and text solved against dual WCAG/APCA bars rather than sampled. Dark mode is a second generation pass, not a reversed ramp.',
    stepCount: STEPS.length,
    stepNames: [...STEPS],
    scales: FAMILIES.flatMap((family) => {
      const light = theme.light.scales[family.id]
      const dark = theme.dark.scales[family.id]
      const on = theme.light.on[family.id]
      const onDark = theme.dark.on[family.id]
      if (!light || !dark) return []
      return [
        {
          id: family.id,
          name: family.name,
          role: family.role,
          steps: STEPS.map((step) => ({
            name: step,
            light: light[step],
            dark: dark[step],
          })),
          on:
            on && onDark
              ? { light: on['700'], dark: onDark['700'] }
              : undefined,
        },
      ]
    }),
    roleMapping,
    solidForeground: 'solved per hue per mode (engine on-labels)',
    notes: theme.report.warnings.join(' · '),
  })
  return { system, report: theme.report }
}
