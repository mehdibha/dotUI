import { V2_STEPS, type V2Step } from '@dotui/colors/v2'

import { readableFg, toElevenSteps } from './lib'

/**
 * CSS variable overrides that repaint the semantic accent + primary roles from
 * an 11-step ramp. Components read `--color-primary` (→ `--neutral-950` by
 * default) and `--color-accent` (→ `--accent-500`); we point both at the
 * injected ramp so the cluster actually reflects the palette under test.
 */
export function accentVars(
  steps: Record<V2Step, string>,
  onSolid: string,
): React.CSSProperties {
  const vars: Record<string, string> = {}
  for (const step of V2_STEPS) vars[`--accent-${step}`] = steps[step]

  vars['--color-accent'] = steps['500']
  vars['--color-accent-hover'] = steps['600']
  vars['--color-accent-active'] = steps['700']
  vars['--color-accent-muted'] = steps['50']
  vars['--color-accent-muted-hover'] = steps['100']
  vars['--color-fg-on-accent'] = onSolid
  vars['--on-accent-500'] = onSolid

  // Button's `primary` variant maps to primary (neutral by default); repoint it.
  vars['--color-primary'] = steps['500']
  vars['--color-primary-hover'] = steps['600']
  vars['--color-primary-active'] = steps['700']
  vars['--color-primary-muted'] = steps['100']
  vars['--color-fg-on-primary'] = onSolid

  vars['--color-border-focus'] = steps['500']
  vars['--color-border-accent'] = steps['300']

  return vars as React.CSSProperties
}

/** Build accent-var overrides from an arbitrary ordered ramp (resampled to 11 steps). */
export function accentVarsFromColors(colors: string[]): React.CSSProperties {
  const steps = toElevenSteps(colors)
  return accentVars(steps, readableFg(steps['500'] ?? '#000'))
}
