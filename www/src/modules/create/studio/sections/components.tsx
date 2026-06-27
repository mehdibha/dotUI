'use client'

import { useMemo, useState } from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LinkIcon,
  SlidersHorizontalIcon,
} from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import type { RegistryItem } from '@/registry/types'
import { Button } from '@/registry/ui/button'
import { registryUi } from '@/registry/ui/registry'
import { SearchField } from '@/registry/ui/search-field'

import {
  ComponentDetailView,
  getComponentDisplayName,
  getGroupDisplayName,
} from '../../components'
import { useDesignSystem } from '../../preset'
import { useStudio } from '../context'
import { SectionShell } from '../primitives'

function paramCount(item: RegistryItem): number {
  return item.params ? Object.keys(item.params).length : 0
}

// Components with at least one tweakable param, grouped by their synced group.
const GROUPED = (() => {
  const tweakable = registryUi
    .filter((i) => i.group && paramCount(i) >= 1)
    .sort((a, b) => a.name.localeCompare(b.name))
  const groups = new Map<string, RegistryItem[]>()
  for (const item of tweakable) {
    const g = item.group as string
    const existing = groups.get(g)
    if (existing) existing.push(item)
    else groups.set(g, [item])
  }
  return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b))
})()

const COMPONENT_META = new Map(registryUi.map((i) => [i.name, i]))

export function ComponentsSection() {
  const { openComponent, setOpenComponent } = useStudio()

  if (openComponent) {
    return (
      <ComponentInspector
        name={openComponent}
        onBack={() => setOpenComponent(null)}
      />
    )
  }
  return <ComponentBrowser onOpen={setOpenComponent} />
}

function ComponentBrowser({ onOpen }: { onOpen: (name: string) => void }) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()

  const groups = useMemo(() => {
    if (!q) return GROUPED
    return GROUPED.map(
      ([group, items]) =>
        [
          group,
          items.filter(
            (i) =>
              i.name.toLowerCase().includes(q) ||
              group.toLowerCase().includes(q),
          ),
        ] as const,
    ).filter(([, items]) => items.length > 0)
  }, [q])

  return (
    <SectionShell
      title="Components"
      blurb="Every component is an axis. Open one to tweak its style, radius and more — grouped components stay in sync."
    >
      <SearchField
        aria-label="Search components"
        placeholder="Search components…"
        value={query}
        onChange={setQuery}
        className="w-full"
      />

      <div className="flex flex-col gap-5">
        {groups.map(([group, items]) => (
          <div key={group} className="flex flex-col gap-2">
            <span className="px-0.5 text-[10px] font-semibold tracking-[0.12em] text-fg-muted/80 uppercase">
              {getGroupDisplayName(group)}
            </span>
            <div className="flex flex-col gap-1.5">
              {items.map((item) => (
                <ButtonPrimitives.Button
                  key={item.name}
                  onPress={() => onOpen(item.name)}
                  className="group/row flex items-center justify-between gap-2 rounded-lg border bg-neutral/30 px-3 py-2.5 text-left text-[13px] focus-reset transition-[background-color,transform] hover:bg-neutral focus-visible:focus-ring pressed:scale-[0.99]"
                >
                  <span className="font-medium">
                    {getComponentDisplayName(item.name)}
                  </span>
                  <span className="flex items-center gap-2 text-fg-muted">
                    <span className="flex items-center gap-1 text-[11px] text-fg-muted/70">
                      <SlidersHorizontalIcon className="size-3" />
                      {paramCount(item)}
                    </span>
                    <ChevronRightIcon className="size-4 transition-transform group-hover/row:translate-x-0.5" />
                  </span>
                </ButtonPrimitives.Button>
              ))}
            </div>
          </div>
        ))}
        {groups.length === 0 && (
          <p className="px-1 text-sm text-fg-muted">
            No components match "{query}".
          </p>
        )}
      </div>
    </SectionShell>
  )
}

function ComponentInspector({
  name,
  onBack,
}: {
  name: string
  onBack: () => void
}) {
  const { designSystem, setComponentParam } = useDesignSystem()
  const meta = COMPONENT_META.get(name)
  const groupMates =
    meta?.group != null
      ? registryUi.filter(
          (i) =>
            i.group === meta.group && i.name !== name && paramCount(i) >= 1,
        )
      : []

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center gap-1.5 px-3 pt-4 pb-3">
        <Button
          variant="quiet"
          size="sm"
          isIconOnly
          onPress={onBack}
          aria-label="Back to components"
          className="size-7"
        >
          <ChevronLeftIcon />
        </Button>
        <div className="flex min-w-0 flex-col">
          <h2 className="truncate text-base font-semibold tracking-tight">
            {getComponentDisplayName(name)}
          </h2>
          {meta?.group && (
            <span className="text-[11px] text-fg-muted">
              in {getGroupDisplayName(meta.group)}
            </span>
          )}
        </div>
      </div>

      <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6">
        <ComponentDetailView
          componentName={name}
          selectedParams={designSystem.componentParams[name] ?? {}}
          onParamChange={(param, value) =>
            setComponentParam(name, param, value)
          }
        />

        {groupMates.length > 0 && (
          <div className="mt-6 flex flex-col gap-2 rounded-lg border border-dashed bg-neutral/20 p-3">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-fg-muted">
              <LinkIcon className="size-3" />
              Synced with {groupMates.length} more
            </div>
            <p className="text-xs leading-snug text-fg-muted/80">
              These share this component's style so the family stays consistent.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {groupMates.map((m) => (
                <span
                  key={m.name}
                  className={cn(
                    'rounded-md border bg-bg px-2 py-0.5 text-[11px] text-fg-muted',
                  )}
                >
                  {getComponentDisplayName(m.name)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
