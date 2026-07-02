'use client'

import { useState } from 'react'
import { ChevronLeftIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'

import { ChartColorsConfig } from '../chart-colors'
import { CodeOptionsDialog } from '../code-options'
import { ColorsConfig } from '../colors'
import {
  AllComponentsView,
  ComponentDetailView,
  GroupDetailView,
  getComponentDisplayName,
  getGroupDisplayName,
  isGroupId,
} from '../components'
import {
  CURSOR_DISABLED_VAR,
  CURSOR_INTERACTIVE_VAR,
  CursorConfig,
  DEFAULT_CURSOR_DISABLED,
  DEFAULT_CURSOR_INTERACTIVE,
} from '../cursor'
import { ExportFooter } from '../export'
import { IconographyConfig } from '../iconography'
import {
  DEFAULT_RADIUS_FACTOR,
  DensityConfig,
  RADIUS_FACTOR_VAR,
  RadiusConfig,
} from '../layout'
import { useDesignSystem } from '../preset'
import { TypographyConfig } from '../typography'
import {
  ElevationPanel,
  FocusPanel,
  MotionPanel,
  ShapeExtras,
  SpacingExtras,
  StatesPanel,
  SurfacePanel,
} from './axis-panels'
import { DOMAIN_LABELS, type DomainId } from './rail'
import { StylePanel } from './style-panel'

export function Inspector({
  domain,
  className,
}: {
  domain: DomainId
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex w-[320px] shrink-0 flex-col rounded-xl border bg-card max-lg:w-[280px]',
        className,
      )}
    >
      {/* Header — re-roll + undo live in the top bar so they act on the whole
          system, not per-axis; this just labels the active axis. */}
      <div className="flex items-center gap-2 border-b p-2.5 pl-3">
        <span className="text-sm font-medium">{DOMAIN_LABELS[domain]}</span>
      </div>

      {/* Body */}
      <div className="scrollbar-none flex-1 overflow-y-auto px-3 pt-4 pb-4">
        <InspectorBody domain={domain} />
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-2 border-t p-3">
        <CodeOptionsDialog />
        <ExportFooter />
      </div>
    </div>
  )
}

function InspectorBody({ domain }: { domain: DomainId }) {
  const { designSystem, setDensity, setToken } = useDesignSystem()

  const radiusFactor =
    designSystem.tokens[RADIUS_FACTOR_VAR] ?? DEFAULT_RADIUS_FACTOR
  const cursorInteractive =
    designSystem.tokens[CURSOR_INTERACTIVE_VAR] ?? DEFAULT_CURSOR_INTERACTIVE
  const cursorDisabled =
    designSystem.tokens[CURSOR_DISABLED_VAR] ?? DEFAULT_CURSOR_DISABLED

  switch (domain) {
    case 'style':
      return <StylePanel />
    case 'color':
      return <ColorsConfig />
    case 'typography':
      return <TypographyConfig />
    case 'icons':
      return <IconographyConfig />
    case 'shape':
      return (
        <div className="flex flex-col gap-5">
          <RadiusConfig
            value={radiusFactor}
            onChange={(v) => setToken(RADIUS_FACTOR_VAR, v)}
          />
          <ShapeExtras />
        </div>
      )
    case 'spacing':
      return (
        <div className="flex flex-col gap-5">
          <DensityConfig value={designSystem.density} onChange={setDensity} />
          <SpacingExtras />
        </div>
      )
    case 'elevation':
      return <ElevationPanel />
    case 'motion':
      return <MotionPanel />
    case 'surface':
      return <SurfacePanel />
    case 'focus':
      return <FocusPanel />
    case 'states':
      return <StatesPanel />
    case 'cursor':
      return (
        <CursorConfig
          interactive={cursorInteractive}
          disabled={cursorDisabled}
          onChange={setToken}
        />
      )
    case 'components':
      return <ComponentsPanel />
    case 'charts':
      return <ChartColorsConfig />
    default:
      return null
  }
}

function ComponentsPanel() {
  const { designSystem, setComponentParam } = useDesignSystem()
  const [stack, setStack] = useState<string[]>([])
  const top = stack[stack.length - 1]

  if (!top) {
    return <AllComponentsView onSelect={(comp) => setStack([comp])} />
  }

  return (
    <div className="flex flex-col">
      <div className="mb-1 -ml-1 flex items-center gap-2">
        <Button
          variant="quiet"
          size="sm"
          isIconOnly
          aria-label="Back"
          onPress={() => setStack((s) => s.slice(0, -1))}
          className="size-6"
        >
          <ChevronLeftIcon />
        </Button>
        <h3 className="text-sm font-medium">
          {isGroupId(top)
            ? getGroupDisplayName(top)
            : getComponentDisplayName(top)}
        </h3>
      </div>
      {isGroupId(top) ? (
        <GroupDetailView
          groupName={top}
          onSelectComponent={(comp) => setStack((s) => [...s, comp])}
        />
      ) : (
        <ComponentDetailView
          componentName={top}
          selectedParams={designSystem.componentParams[top] ?? {}}
          onParamChange={(paramName, value) =>
            setComponentParam(top, paramName, value)
          }
        />
      )}
    </div>
  )
}
