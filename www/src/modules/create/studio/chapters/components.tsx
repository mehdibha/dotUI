'use client'

import { useMemo, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LinkIcon,
  SlidersHorizontalIcon,
} from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import type { RegistryItem } from '@/registry/types'
import { Input } from '@/registry/ui/input'
import { registryUi } from '@/registry/ui/registry'
import { SearchField } from '@/registry/ui/search-field'

import { ExamplesIndex } from '../../__generated__/examples'
import {
  ComponentDetailView,
  getComponentDisplayName,
  getGroupDisplayName,
} from '../../components'
import { useDesignSystem } from '../../preset'
import { ChapterIntro, Section, SwitchField } from '../controls'
import { useStudio } from '../store'

const routeApi = getRouteApi('/_app/create')

function titleCase(slug: string) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const paramCount = (item: RegistryItem) =>
  item.params ? Object.keys(item.params).length : 0

/** registryUi grouped by `item.group`, only components with params. */
function useGroupedComponents(query: string) {
  return useMemo(() => {
    const q = query.trim().toLowerCase()
    const items = registryUi.filter((i) => paramCount(i) >= 1)
    const groups = new Map<string, RegistryItem[]>()
    const loose: RegistryItem[] = []
    for (const item of items) {
      if (q && !item.name.toLowerCase().includes(q)) continue
      if (item.group) {
        const arr = groups.get(item.group) ?? []
        arr.push(item)
        groups.set(item.group, arr)
      } else {
        loose.push(item)
      }
    }
    const sorted = [...groups.entries()]
      .map(([name, members]) => ({
        name,
        members: members.sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
    return {
      groups: sorted,
      loose: loose.sort((a, b) => a.name.localeCompare(b.name)),
    }
  }, [query])
}

export function ComponentsChapter() {
  const { activeComponent, setActiveComponent } = useStudio()
  const { designSystem, setDesignSystem } = useDesignSystem()
  const navigate = routeApi.useNavigate()
  const [query, setQuery] = useState('')
  const [syncGroup, setSyncGroup] = useState(true)

  const meta = activeComponent
    ? registryUi.find((i) => i.name === activeComponent)
    : null

  // Switch the live preview to the component being edited (the missing link
  // today — editing Button while viewing Cards showed nothing).
  function openComponent(name: string) {
    setActiveComponent(name)
    if (name in ExamplesIndex) {
      navigate({ search: (prev) => ({ ...prev, preview: name }) })
    }
  }

  // Synced groups: write a param across every member that defines it, in one
  // update so it lands as a single undo step and the group can never drift.
  function changeParam(paramName: string, value: string) {
    if (!meta) return
    const members =
      syncGroup && meta.group
        ? registryUi.filter(
            (i) => i.group === meta.group && i.params && paramName in i.params,
          )
        : [meta]
    setDesignSystem((prev) => {
      const next = { ...prev.componentParams }
      for (const m of members) {
        next[m.name] = { ...(next[m.name] ?? {}), [paramName]: value }
      }
      return { ...prev, componentParams: next }
    })
  }

  if (meta) {
    const groupMembers = meta.group
      ? registryUi.filter((i) => i.group === meta.group && paramCount(i) >= 1)
      : []
    return (
      <div className="flex flex-col gap-5">
        <button
          type="button"
          onClick={() => setActiveComponent(null)}
          className="-ml-1 flex items-center gap-1 self-start text-xs text-fg-muted focus-reset transition-colors hover:text-fg focus-visible:focus-ring"
        >
          <ChevronLeftIcon className="size-3.5" />
          All components
        </button>

        <ChapterIntro
          title={getComponentDisplayName(meta.name)}
          blurb={
            meta.group
              ? `Part of the ${getGroupDisplayName(meta.group)} group.`
              : 'Standalone component.'
          }
        />

        {meta.group && groupMembers.length > 1 && (
          <div className="rounded-lg border bg-neutral/40 p-3">
            <SwitchField
              label="Sync across group"
              value={syncGroup}
              onChange={setSyncGroup}
              hint={`Edits apply to all ${groupMembers.length} components in ${getGroupDisplayName(
                meta.group,
              )} — so ${groupMembers
                .slice(0, 3)
                .map((m) => getComponentDisplayName(m.name))
                .join(', ')}${groupMembers.length > 3 ? '…' : ''} never drift.`}
            />
          </div>
        )}

        <ComponentDetailView
          componentName={meta.name}
          selectedParams={designSystem.componentParams[meta.name] ?? {}}
          onParamChange={changeParam}
        />
      </div>
    )
  }

  return (
    <ComponentIndex query={query} setQuery={setQuery} onOpen={openComponent} />
  )
}

function ComponentIndex({
  query,
  setQuery,
  onOpen,
}: {
  query: string
  setQuery: (v: string) => void
  onOpen: (name: string) => void
}) {
  const { groups, loose } = useGroupedComponents(query)

  return (
    <div className="flex flex-col gap-6">
      <ChapterIntro
        title="Components"
        blurb="Curated styles per component. Related components are grouped and stay in sync."
      />

      <SearchField
        aria-label="Search components"
        value={query}
        onChange={setQuery}
        className="w-full"
      >
        <Input placeholder="Search components…" className="w-full" />
      </SearchField>

      {groups.length === 0 && loose.length === 0 && (
        <p className="py-8 text-center text-sm text-fg-muted">
          No component matches “{query}”.
        </p>
      )}

      {groups.map((group) => (
        <Section
          key={group.name}
          label={
            <span className="flex items-center gap-1.5">
              <LinkIcon className="size-3 text-fg-muted" />
              {getGroupDisplayName(group.name)}
            </span>
          }
          hint={
            <span className="text-[10px] text-fg-muted">
              {group.members.length} synced
            </span>
          }
        >
          <div className="flex flex-col gap-1.5">
            {group.members.map((item) => (
              <ComponentRow key={item.name} item={item} onOpen={onOpen} />
            ))}
          </div>
        </Section>
      ))}

      {loose.length > 0 && (
        <Section label="Standalone">
          <div className="flex flex-col gap-1.5">
            {loose.map((item) => (
              <ComponentRow key={item.name} item={item} onOpen={onOpen} />
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

function ComponentRow({
  item,
  onOpen,
}: {
  item: RegistryItem
  onOpen: (name: string) => void
}) {
  const count = paramCount(item)
  return (
    <ButtonPrimitives.Button
      onPress={() => onOpen(item.name)}
      className={cn(
        'flex items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2.5 text-left text-[13px] focus-reset transition-colors hover:border-border-hover hover:bg-neutral/50 focus-visible:focus-ring',
      )}
    >
      <span className="font-medium">{titleCase(item.name)}</span>
      <span className="flex items-center gap-2 text-xs text-fg-muted/70">
        <span className="flex items-center gap-1">
          <SlidersHorizontalIcon className="size-3" />
          {count}
        </span>
        <ChevronRightIcon className="size-4 text-fg-muted" />
      </span>
    </ButtonPrimitives.Button>
  )
}
