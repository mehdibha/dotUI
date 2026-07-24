'use client'

import { ChevronRightIcon } from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'

import {
  ComponentDetailView,
  getComponentDisplayName,
  paramComponents,
} from '../components'
import { useDesignSystem } from '../preset'

/**
 * The Components section: every registry component with params, one expanded at
 * a time. Only the expanded component mounts its param editors — 60+ mounted
 * detail views would drag the whole panel.
 */
export function ComponentsSection({
  expanded,
  onToggle,
}: {
  /** Component name currently expanded, if any. */
  expanded: string | undefined
  onToggle: (name: string | undefined) => void
}) {
  const { designSystem, setComponentParam } = useDesignSystem()

  return (
    <div className="flex flex-col">
      {paramComponents.map((comp) => {
        const isExpanded = comp.name === expanded
        const count = comp.params ? Object.keys(comp.params).length : 0
        return (
          <div key={comp.name} className="border-b last:border-b-0">
            <ButtonPrimitives.Button
              onPress={() => onToggle(isExpanded ? undefined : comp.name)}
              className={cn(
                'flex w-full items-center justify-between gap-2 rounded-md px-1 py-2.5 text-sm focus-reset transition-colors hover:bg-neutral focus-visible:focus-ring',
                isExpanded && 'font-medium',
              )}
            >
              <span className="truncate">
                {getComponentDisplayName(comp.name)}
              </span>
              <span className="flex shrink-0 items-center gap-1.5 text-xs text-fg-muted/60">
                {count}
                <ChevronRightIcon
                  className={cn(
                    'size-4 text-fg-muted transition-transform',
                    isExpanded && 'rotate-90',
                  )}
                />
              </span>
            </ButtonPrimitives.Button>
            {isExpanded && (
              <div className="pb-4" data-control={`component-${comp.name}`}>
                <ComponentDetailView
                  componentName={comp.name}
                  selectedParams={designSystem.componentParams[comp.name] ?? {}}
                  onParamChange={(param, value) =>
                    setComponentParam(comp.name, param, value)
                  }
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
