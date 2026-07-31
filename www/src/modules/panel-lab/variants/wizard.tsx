'use client'

/* Wizard — guided steps: the schema linearized into six steps (Color →
   Components), one step on screen at a time, prior decisions collecting as
   chips. Question: does a linear path help a first-time builder, or does it
   just slow everyone down? */

import { useState } from 'react'
import { Button as RacButton } from 'react-aria-components'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'

import {
  DENSITY_OPTIONS,
  ICON_LIBRARY_OPTIONS,
  labelOf,
  SHADOW_OPTIONS,
} from '../data'
import type { Lab, LabState } from '../data'
import {
  ColorSection,
  ComponentsSection,
  EffectsSection,
  IconsSection,
  ShapeSection,
  TypographySection,
} from '../sections'

interface Step {
  id: string
  label: string
  render: (lab: Lab) => React.ReactNode
  /** Chip content once the step is behind you. */
  summary?: (state: LabState) => React.ReactNode
}

const STEPS: Step[] = [
  {
    id: 'color',
    label: 'Color',
    render: (lab) => <ColorSection lab={lab} />,
    summary: (state) => (
      <>
        <span
          className="size-2.5 shrink-0 rounded-full ring-1 ring-fg/10"
          style={{ backgroundColor: state.brand }}
        />
        <span className="font-mono uppercase">{state.brand}</span>
      </>
    ),
  },
  {
    id: 'typography',
    label: 'Typography',
    render: (lab) => <TypographySection lab={lab} />,
    summary: (state) => state.headingFont,
  },
  {
    id: 'icons',
    label: 'Icons',
    render: (lab) => <IconsSection lab={lab} />,
    summary: (state) => labelOf(ICON_LIBRARY_OPTIONS, state.iconLibrary),
  },
  {
    id: 'shape',
    label: 'Shape',
    render: (lab) => <ShapeSection lab={lab} />,
    summary: (state) => (
      <>
        {state.radius.toFixed(2)}× · {labelOf(DENSITY_OPTIONS, state.density)}
      </>
    ),
  },
  {
    id: 'effects',
    label: 'Effects',
    render: (lab) => <EffectsSection lab={lab} />,
    summary: (state) =>
      SHADOW_OPTIONS.find((o) => o.id === state.shadows)?.label,
  },
  {
    id: 'components',
    label: 'Components',
    render: (lab) => <ComponentsSection lab={lab} />,
  },
]

export function WizardFrame({ lab }: { lab: Lab }) {
  const [stepIndex, setStepIndex] = useState(0)
  const last = stepIndex === STEPS.length - 1
  const done = STEPS.slice(0, stepIndex)

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex shrink-0 flex-col gap-2 border-b border-border/40 px-4 pt-3 pb-2.5">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] font-medium text-fg-muted">
            Step {stepIndex + 1} of {STEPS.length}
          </span>
          {!last && (
            <span className="text-[11px] text-fg-muted/70">
              Next: {STEPS[stepIndex + 1]?.label}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {STEPS.map((s, i) => (
            <span
              key={s.id}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors',
                i <= stepIndex ? 'bg-accent' : 'bg-highlight',
              )}
            />
          ))}
        </div>
      </header>

      {done.length > 0 && (
        <div className="flex shrink-0 flex-wrap items-center gap-1.5 px-3 pt-2.5">
          {done.map((s, i) => (
            <RacButton
              key={s.id}
              aria-label={`Edit ${s.label.toLowerCase()}`}
              onPress={() => setStepIndex(i)}
              className="flex h-6 cursor-interactive items-center gap-1.5 rounded-full bg-muted px-2.5 text-[11px] text-fg-muted focus-reset transition-colors hover:bg-highlight hover:text-fg focus-visible:focus-ring"
            >
              {s.summary?.(lab.state) ?? s.label}
            </RacButton>
          ))}
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto p-3 *:shrink-0">
        {STEPS[stepIndex]?.render(lab)}
      </div>

      <footer className="flex shrink-0 gap-2 border-t border-border/40 p-3">
        <Button
          size="sm"
          isDisabled={stepIndex === 0}
          onPress={() => setStepIndex((i) => Math.max(i - 1, 0))}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          variant="primary"
          size="sm"
          onPress={() =>
            !last && setStepIndex((i) => Math.min(i + 1, STEPS.length - 1))
          }
          className="flex-1"
        >
          {last ? 'Export' : 'Continue'}
        </Button>
      </footer>
    </div>
  )
}
