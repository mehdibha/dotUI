"use client"

import * as ButtonPrimitives from "react-aria-components/Button"

import { cn } from "@/registry/lib/utils"
import { componentDemos } from "@/modules/docs/components-list/demos"

import {
  ComponentDetailView,
  getComponentDisplayName,
  paramComponents,
} from "../components"
import { useDesignSystem } from "../preset"

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
        const Demo = componentDemos[comp.name]
        return (
          <div key={comp.name} className="border-b last:border-b-0">
            {/* `content-visibility` keeps the 60 mounted demos from costing
                layout while scrolled out of view. */}
            <div className="relative overflow-hidden rounded-md [contain-intrinsic-size:auto_48px] [content-visibility:auto]">
              <ButtonPrimitives.Button
                onPress={() => onToggle(isExpanded ? undefined : comp.name)}
                className={cn(
                  "flex h-12 w-full items-center gap-1.5 rounded-md px-1 text-sm focus-reset transition-colors hover:bg-neutral focus-visible:focus-ring",
                  isExpanded && "font-medium",
                )}
              >
                <span className="max-w-[55%] truncate">
                  {getComponentDisplayName(comp.name)}
                </span>
                <span className="shrink-0 text-xs text-fg-muted/60">
                  {count}
                </span>
              </ButtonPrimitives.Button>
              {/* Mini-preview peek — a live render anchored past mid-row and
                  cropped by the wrapper's overflow at the right edge. Inert and
                  non-hit-testable: the whole row stays one click target. */}
              {Demo && (
                <div
                  aria-hidden
                  inert
                  className="pointer-events-none absolute top-1/2 left-[55%] -translate-y-1/2 [zoom:0.4] select-none"
                >
                  <Demo />
                </div>
              )}
            </div>
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
