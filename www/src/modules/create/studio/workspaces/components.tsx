'use client'

import { useMemo, useState } from 'react'
import {
  BoxesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LinkIcon,
  RotateCcwIcon,
  SlidersHorizontalIcon,
} from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import type { RegistryItem } from '@/registry/types'
import { Button } from '@/registry/ui/button'
import { Input } from '@/registry/ui/input'
import { registryUi } from '@/registry/ui/registry'
import { SearchField } from '@/registry/ui/search-field'

import { ComponentDetailView, getComponentDisplayName } from '../../components'
import { useDesignSystem } from '../../preset'
import { useStudio } from '../context'
import { WorkspaceHeader } from '../ui'

const tweakable = registryUi
  .filter((item) => item.params && Object.keys(item.params).length > 0)
  .sort((a, b) => a.name.localeCompare(b.name))

function paramCount(item: RegistryItem) {
  return item.params ? Object.keys(item.params).length : 0
}

function siblings(item: RegistryItem): RegistryItem[] {
  if (!item.group) return []
  return tweakable.filter(
    (other) => other.group === item.group && other.name !== item.name,
  )
}

export function ComponentsWorkspace() {
  const { focus } = useStudio()
  const [selected, setSelected] = useState<string | null>(focus ?? null)

  if (selected) {
    return (
      <ComponentDetail
        name={selected}
        onBack={() => setSelected(null)}
        onOpen={setSelected}
      />
    )
  }
  return <ComponentList onSelect={setSelected} />
}

function ComponentList({ onSelect }: { onSelect: (name: string) => void }) {
  const [query, setQuery] = useState('')
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return tweakable
    return tweakable.filter(
      (item) => item.name.includes(q) || (item.group?.includes(q) ?? false),
    )
  }, [query])

  return (
    <div className="flex flex-col gap-4">
      <WorkspaceHeader
        icon={BoxesIcon}
        title="Components"
        description="Tune individual components. Related ones share a synced style, so a change to one updates the whole group."
      />
      <SearchField
        aria-label="Search components"
        value={query}
        onChange={setQuery}
        className="w-full"
      >
        <Input placeholder="Search components…" />
      </SearchField>
      {results.length === 0 ? (
        <p className="py-10 text-center text-sm text-fg-muted">
          No component matches “{query}”.
        </p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {results.map((item) => {
            const synced = siblings(item).length > 0
            return (
              <ButtonPrimitives.Button
                key={item.name}
                onPress={() => onSelect(item.name)}
                className="flex items-center justify-between gap-2 rounded-lg border p-3 text-sm focus-reset transition-colors hover:bg-neutral focus-visible:focus-ring"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="truncate font-medium">
                    {getComponentDisplayName(item.name)}
                  </span>
                  {synced && (
                    <LinkIcon className="size-3 shrink-0 text-fg-muted/70" />
                  )}
                </span>
                <span className="flex shrink-0 items-center gap-2 text-xs text-fg-muted/70">
                  <SlidersHorizontalIcon className="size-3" />
                  {paramCount(item)}
                  <ChevronRightIcon className="size-4 text-fg-muted" />
                </span>
              </ButtonPrimitives.Button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ComponentDetail({
  name,
  onBack,
  onOpen,
}: {
  name: string
  onBack: () => void
  onOpen: (name: string) => void
}) {
  const { designSystem, setComponentParam, setDesignSystem } = useDesignSystem()
  const item = registryUi.find((i) => i.name === name)
  const group = item ? siblings(item) : []

  function reset() {
    if (!item?.params) return
    const defaults: Record<string, string> = {}
    for (const [param, def] of Object.entries(item.params)) {
      defaults[param] = def.default
    }
    setDesignSystem((prev) => ({
      ...prev,
      componentParams: { ...prev.componentParams, [name]: defaults },
    }))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="-ml-1 flex items-center gap-1 rounded-md px-1 py-0.5 text-sm font-medium focus-reset transition-colors hover:bg-neutral focus-visible:focus-ring"
        >
          <ChevronLeftIcon className="size-4 text-fg-muted" />
          {getComponentDisplayName(name)}
        </button>
        <Button
          size="sm"
          variant="quiet"
          onPress={reset}
          className="h-7 gap-1.5 px-2 text-xs text-fg-muted"
        >
          <RotateCcwIcon className="size-3.5" />
          Reset
        </Button>
      </div>

      {group.length > 0 && (
        <div className="flex flex-col gap-1.5 rounded-lg border bg-neutral/30 p-2.5">
          <span className="flex items-center gap-1.5 text-[11px] text-fg-muted">
            <LinkIcon className="size-3" />
            Synced style — also applies to
          </span>
          <div className="flex flex-wrap gap-1.5">
            {group.map((sib) => (
              <ButtonPrimitives.Button
                key={sib.name}
                onPress={() => onOpen(sib.name)}
                className="rounded-full border px-2 py-0.5 text-xs focus-reset transition-colors hover:bg-neutral focus-visible:focus-ring"
              >
                {getComponentDisplayName(sib.name)}
              </ButtonPrimitives.Button>
            ))}
          </div>
        </div>
      )}

      <ComponentDetailView
        componentName={name}
        selectedParams={designSystem.componentParams[name] ?? {}}
        onParamChange={(param, value) => setComponentParam(name, param, value)}
      />
    </div>
  )
}
