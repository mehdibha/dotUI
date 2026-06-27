'use client'

import { useMemo, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LinkIcon,
  SearchIcon,
  SlidersHorizontalIcon,
} from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import type { RegistryItem } from '@/registry/types'
import { Button } from '@/registry/ui/button'
import { registryUi } from '@/registry/ui/registry'

import { ExamplesIndex } from '../../__generated__/examples'
import { ComponentDetailView, getComponentDisplayName } from '../../components'
import { useDesignSystem } from '../../preset'
import { Section } from '../primitives'
import { useStudio } from '../store'

const routeApi = getRouteApi('/_app/create')

function titleCase(slug: string) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const TWEAKABLE = registryUi
  .filter((i) => i.params && Object.keys(i.params).length > 0)
  .sort((a, b) => a.name.localeCompare(b.name))

const BY_GROUP = (() => {
  const map = new Map<string, RegistryItem[]>()
  for (const item of TWEAKABLE) {
    const key = item.group ?? 'other'
    const list = map.get(key) ?? []
    list.push(item)
    map.set(key, list)
  }
  return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
})()

export function ComponentsInspector() {
  const { selectedComponent, setSelectedComponent } = useStudio()
  if (selectedComponent) {
    return (
      <ComponentDetail
        name={selectedComponent}
        onBack={() => setSelectedComponent(null)}
      />
    )
  }
  return <ComponentList onSelect={setSelectedComponent} />
}

function ComponentList({ onSelect }: { onSelect: (name: string) => void }) {
  const navigate = routeApi.useNavigate()
  const [query, setQuery] = useState('')

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return BY_GROUP
    return BY_GROUP.map(
      ([group, items]) =>
        [group, items.filter((i) => i.name.toLowerCase().includes(q))] as const,
    ).filter(([, items]) => items.length > 0)
  }, [query])

  function select(name: string) {
    onSelect(name)
    // Switch the canvas to the component being tuned, like the old panel did.
    if (name in ExamplesIndex) {
      navigate({ search: (prev) => ({ ...prev, preview: name }) })
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2 rounded-md border bg-bg px-2.5 focus-within:focus-ring">
        <SearchIcon className="size-4 shrink-0 text-fg-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search components…"
          className="h-8 w-full bg-transparent text-[13px] outline-none placeholder:text-fg-muted"
        />
      </div>

      {groups.length === 0 && (
        <p className="px-1 text-xs text-fg-muted">No components match.</p>
      )}

      {groups.map(([group, items]) => (
        <Section key={group} title={titleCase(group)}>
          <div className="flex flex-col gap-1">
            {items.map((item) => {
              const count = item.params ? Object.keys(item.params).length : 0
              return (
                <ButtonPrimitives.Button
                  key={item.name}
                  onPress={() => select(item.name)}
                  className="group/row flex items-center justify-between gap-2 rounded-md border bg-card px-3 py-2 text-left focus-reset transition-colors hover:border-fg-muted/30 hover:bg-neutral focus-visible:focus-ring"
                >
                  <span className="text-[13px] font-medium">
                    {titleCase(item.name)}
                  </span>
                  <span className="flex items-center gap-2 text-[11px] text-fg-muted">
                    <span className="flex items-center gap-1">
                      <SlidersHorizontalIcon className="size-3" />
                      {count}
                    </span>
                    <ChevronRightIcon className="size-4 text-fg-muted/60 transition-transform group-hover/row:translate-x-0.5" />
                  </span>
                </ButtonPrimitives.Button>
              )
            })}
          </div>
        </Section>
      ))}
    </div>
  )
}

function ComponentDetail({
  name,
  onBack,
}: {
  name: string
  onBack: () => void
}) {
  const { designSystem, setComponentParam } = useDesignSystem()
  const meta = registryUi.find((i) => i.name === name)
  const siblings = meta?.group
    ? TWEAKABLE.filter((i) => i.group === meta.group && i.name !== name)
    : []

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Button
          variant="quiet"
          size="sm"
          isIconOnly
          onPress={onBack}
          aria-label="Back to components"
          className="-ml-1 size-7"
        >
          <ChevronLeftIcon />
        </Button>
        <h3 className="text-sm font-semibold">
          {getComponentDisplayName(name)}
        </h3>
      </div>

      {siblings.length > 0 && (
        <div className="flex items-start gap-2 rounded-md border border-primary/30 bg-primary/8 p-2.5 text-[11px] leading-snug text-fg-muted">
          <LinkIcon className="mt-0.5 size-3.5 shrink-0 text-primary" />
          <span>
            Style is <span className="font-medium text-fg">synced</span> with{' '}
            {siblings.map((s, i) => (
              <span key={s.name}>
                {i > 0 && ', '}
                <button
                  type="button"
                  onClick={onBack}
                  className="font-medium text-fg underline-offset-2 hover:underline"
                >
                  {titleCase(s.name)}
                </button>
              </span>
            ))}
            . Changes apply to the whole group.
          </span>
        </div>
      )}

      <div
        className={cn('**:data-label:text-fg-muted', '[&_[data-label]]:pl-0')}
      >
        <ComponentDetailView
          componentName={name}
          selectedParams={designSystem.componentParams[name] ?? {}}
          onParamChange={(param, value) =>
            setComponentParam(name, param, value)
          }
        />
      </div>
    </div>
  )
}
