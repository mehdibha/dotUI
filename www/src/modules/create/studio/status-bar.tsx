'use client'

import { useMemo } from 'react'
import { DicesIcon } from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { DEFAULT_COLOR_CONFIG, resolveColorConfig } from '@/registry/theme'

import { solidContrastReport } from '../colors/contrast'
import { RADIUS_FACTOR_VAR } from '../layout'
import { useDesignSystem } from '../preset'
import { useStudio } from './store'

/* ----------------------------------------------------------------------------
 * The status bar — an always-visible read on the system's health: live binding,
 * WCAG pass rate on the real generated palette, the headline scalars, and a
 * count of how far the system has drifted from the defaults. "Surprise me"
 * lives here as the lowest-commitment way to explore.
 * -------------------------------------------------------------------------- */

export function StatusBar() {
  const { designSystem } = useDesignSystem()
  const { runPrompt, thinking } = useStudio()

  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const report = useMemo(
    () => solidContrastReport(resolveColorConfig(config)),
    [config],
  )
  const passing = report.filter((r) => r.level !== 'fail').length

  const radius =
    Number.parseFloat(designSystem.tokens[RADIUS_FACTOR_VAR] ?? '1') || 1
  const customizations =
    Object.keys(designSystem.tokens).length +
    Object.values(designSystem.componentParams).reduce(
      (sum, params) => sum + Object.keys(params).length,
      0,
    ) +
    (designSystem.color ? 1 : 0)

  return (
    <footer className="flex h-8 shrink-0 items-center gap-3 border-t bg-card px-4 text-xs text-fg-muted">
      <span className="flex items-center gap-1.5">
        <span className="size-1.5 animate-pulse rounded-full bg-success" />
        Live
      </span>

      <Divider />

      <span className="tabular-nums">
        WCAG AA{' '}
        <span
          className={
            passing === report.length ? 'text-success' : 'text-warning'
          }
        >
          {passing}/{report.length}
        </span>
      </span>

      <Divider />

      <span className="tabular-nums">radius {radius.toFixed(2)}×</span>

      <Divider />

      <span className="capitalize">{designSystem.density} density</span>

      <Divider />

      <span className="tabular-nums">
        {customizations} customization{customizations === 1 ? '' : 's'}
      </span>

      <ButtonPrimitives.Button
        isDisabled={thinking}
        onPress={() => runPrompt('surprise me')}
        className="ml-auto flex items-center gap-1.5 rounded-md px-2 py-1 focus-reset transition-colors hover:bg-neutral hover:text-fg focus-visible:focus-ring disabled:opacity-50"
      >
        <DicesIcon className="size-3.5" />
        Surprise me
      </ButtonPrimitives.Button>
    </footer>
  )
}

function Divider() {
  return <span className="h-3 w-px bg-border" aria-hidden />
}
