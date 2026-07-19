/**
 * Guarantee verification (D2): every promise the spec makes, measured on the
 * built theme with both meters. The solver enforces these in-loop; verify is
 * the audit trail (and the CI gate — emitting a failing scale is a build
 * error unless the failure was explicitly bought with `preserveSeed`).
 */

import { BARS, STEPS, type StepName } from './data'
import { apca, cappedLcBar, wcag2 } from './meters'
import type { Mode, ScaleColors } from './scale'
import type { Oklch } from './space'

export interface GuaranteeResult {
  scale: string
  mode: Mode
  name: string
  fg: StepName | 'on-700' | 'on-800'
  bg: StepName
  wcag: number
  wcagTarget: number
  lc: number
  lcTarget: number
  passes: boolean
}

export function verifyScale(
  name: string,
  mode: Mode,
  scale: ScaleColors,
  strictOnSolid: boolean,
): GuaranteeResult[] {
  const results: GuaranteeResult[] = []
  const step = (s: StepName) => scale.steps[s]

  const check = (
    label: string,
    fg: GuaranteeResult['fg'],
    fgColor: Oklch,
    bg: StepName,
    wcagTarget: number,
    lcTarget: number,
  ) => {
    const bgColor = step(bg)
    const wcag = wcag2(fgColor, bgColor)
    const lc = Math.abs(apca(fgColor, bgColor))
    // Lc bars are capped by the black/white-pole ceiling of the actual
    // background (mirrors the solver): dim canvases top out below Lc 90.
    const effectiveLc = cappedLcBar(lcTarget, bgColor)
    results.push({
      scale: name,
      mode,
      name: label,
      fg,
      bg,
      wcag,
      wcagTarget,
      lc,
      lcTarget: effectiveLc,
      passes: wcag >= wcagTarget - 1e-9 && lc >= effectiveLc - 1e-9,
    })
  }

  for (const bg of ['25', '50', '100'] as const)
    check(
      'text-900',
      '900',
      step('900'),
      bg,
      BARS.text900.wcag,
      BARS.text900.lc,
    )
  for (const bg of ['25', '50'] as const)
    check(
      'text-950',
      '950',
      step('950'),
      bg,
      BARS.text950.wcag,
      BARS.text950.lc,
    )
  check('text-950', '950', step('950'), '100', BARS.text950.wcag, 0)

  const onBars = strictOnSolid ? BARS.onSolidStrict : BARS.onSolid
  check('on-solid', 'on-700', scale.on['700'], '700', onBars.wcag, onBars.lc)
  check('on-solid', 'on-800', scale.on['800'], '800', onBars.wcag, onBars.lc)

  for (const [border, bar] of [
    ['400', BARS.border400],
    ['500', BARS.border500],
    ['600', BARS.border600],
  ] as const)
    for (const bg of ['25', '50'] as const)
      check(`border-${border}`, border, step(border), bg, bar, 0)

  return results
}

/** Job-order monotonicity for jobs 1–8 (D1) — L strictly ordered per mode. */
export function verifyLadder(
  name: string,
  mode: Mode,
  scale: ScaleColors,
): string[] {
  const problems: string[] = []
  const skeletonSteps = STEPS.slice(0, 8)
  for (let i = 1; i < skeletonSteps.length; i++) {
    const prev = scale.steps[skeletonSteps[i - 1]!]!
    const curr = scale.steps[skeletonSteps[i]!]!
    const ordered = mode === 'light' ? curr.l < prev.l : curr.l > prev.l
    if (!ordered)
      problems.push(
        `${name}/${mode}: steps ${skeletonSteps[i - 1]}→${skeletonSteps[i]} not monotonic`,
      )
  }
  return problems
}
