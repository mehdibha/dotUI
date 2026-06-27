'use client'

/**
 * Components — the per-component override tier. The lowest altitude: styles that
 * apply to one component (or a synced group) rather than the whole system.
 * Master-detail; selecting a component also switches the live preview to it.
 */

import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { registryUi } from '@/registry/ui/registry'

import { ExamplesIndex } from '../__generated__/examples'
import { ComponentDetailView, getComponentDisplayName } from '../components'
import { useDesignSystem } from '../preset'
import { SectionIntro } from './widgets'

const routeApi = getRouteApi('/_app/create')

const tweakableComponents = registryUi
  .filter(
    (item) => item.group && item.params && Object.keys(item.params).length,
  )
  .sort((a, b) => a.name.localeCompare(b.name))

export function ComponentsSection() {
  const navigate = routeApi.useNavigate()
  const { designSystem, setComponentParam } = useDesignSystem()
  const [selected, setSelected] = useState<string | null>(null)

  function open(name: string) {
    setSelected(name)
    if (name in ExamplesIndex) {
      navigate({ search: (prev) => ({ ...prev, preview: name }) })
    }
  }

  if (selected) {
    const meta = tweakableComponents.find((c) => c.name === selected)
    return (
      <div className="flex flex-col gap-4">
        <div className="-ml-1 flex items-center gap-2">
          <Button
            variant="quiet"
            size="sm"
            isIconOnly
            onPress={() => setSelected(null)}
            aria-label="Back to components"
            className="size-6"
          >
            <ChevronLeftIcon />
          </Button>
          <h2 className="text-base font-semibold tracking-tight">
            {getComponentDisplayName(selected)}
          </h2>
        </div>
        {meta?.group && (
          <p className="rounded-lg border border-dashed px-3 py-2 text-[11px] leading-snug text-fg-muted">
            Part of the{' '}
            <span className="font-medium text-fg">{meta.group}</span> group —
            these styles stay in sync across the group on export.
          </p>
        )}
        <ComponentDetailView
          componentName={selected}
          selectedParams={designSystem.componentParams[selected] ?? {}}
          onParamChange={(param, value) =>
            setComponentParam(selected, param, value)
          }
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <SectionIntro title="Components">
        Curated, per-component styles — the 20% of options that cover most
        design systems. Synced groups change together.
      </SectionIntro>
      <div className="flex flex-col gap-2">
        {tweakableComponents.map((comp) => {
          const count = comp.params ? Object.keys(comp.params).length : 0
          return (
            <button
              key={comp.name}
              type="button"
              onClick={() => open(comp.name)}
              className="flex items-center justify-between gap-2 rounded-lg border bg-neutral p-3 text-sm focus-reset transition-colors hover:bg-neutral-hover focus-visible:focus-ring"
            >
              <span>{getComponentDisplayName(comp.name)}</span>
              <span className="flex items-center gap-2 text-xs text-fg-muted">
                {count} {count === 1 ? 'param' : 'params'}
                <ChevronRightIcon className="size-4" />
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
