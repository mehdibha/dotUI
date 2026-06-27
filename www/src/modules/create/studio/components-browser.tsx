'use client'

import { useMemo, useState } from 'react'
import { ChevronRightIcon, LinkIcon } from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import type { RegistryItem } from '@/registry/types'
import { registryUi } from '@/registry/ui/registry'
import { SearchField } from '@/registry/ui/search-field'

import {
  ComponentDetailView,
  getComponentDisplayName,
  getGroupDisplayName,
} from '../components'
import { useDesignSystem } from '../preset'
import { GroupLabel } from './primitives'
import { useStudio } from './store'

/* ------------------------------ Data helpers ----------------------------- */

function paramCount(item: RegistryItem): number {
  return item.params ? Object.keys(item.params).length : 0
}

const tweakable = registryUi
  .filter((item) => item.group && paramCount(item) >= 1)
  .sort((a, b) => a.name.localeCompare(b.name))

/** Group → its tweakable members, so we can flag synced families. */
const groupMembers = new Map<string, RegistryItem[]>()
for (const item of tweakable) {
  const g = item.group as string
  groupMembers.set(g, [...(groupMembers.get(g) ?? []), item])
}

const groupsOrdered = Array.from(groupMembers.keys()).sort((a, b) =>
  getGroupDisplayName(a).localeCompare(getGroupDisplayName(b)),
)

/* ------------------------------- Browser -------------------------------- */

export function ComponentsBrowser() {
  const { navigate } = useStudio()
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const groups = useMemo(() => {
    return groupsOrdered
      .map((group) => ({
        group,
        items: (groupMembers.get(group) ?? []).filter((item) =>
          q
            ? getComponentDisplayName(item.name).toLowerCase().includes(q)
            : true,
        ),
      }))
      .filter((g) => g.items.length > 0)
  }, [q])

  return (
    <div className="flex flex-col gap-4">
      <SearchField
        aria-label="Search components"
        value={query}
        onChange={setQuery}
        placeholder="Search components…"
        className="w-full"
      />

      {groups.length === 0 ? (
        <p className="px-1 py-8 text-center text-sm text-fg-muted">
          No component matches “{query}”.
        </p>
      ) : (
        groups.map(({ group, items }) => {
          const synced = (groupMembers.get(group)?.length ?? 0) > 1
          return (
            <section key={group} className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <GroupLabel>{getGroupDisplayName(group)}</GroupLabel>
                {synced && (
                  <span
                    className="flex items-center gap-0.5 text-[10px] text-fg-muted/70"
                    title="Members of this group share one style and stay in sync"
                  >
                    <LinkIcon className="size-2.5" />
                    synced
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {items.map((item) => (
                  <ComponentRow
                    key={item.name}
                    name={item.name}
                    count={paramCount(item)}
                    onPress={() => navigate(`component:${item.name}`)}
                  />
                ))}
              </div>
            </section>
          )
        })
      )}
    </div>
  )
}

function ComponentRow({
  name,
  count,
  onPress,
}: {
  name: string
  count: number
  onPress: () => void
}) {
  return (
    <ButtonPrimitives.Button
      onPress={onPress}
      className="group flex items-center gap-2 rounded-lg border bg-card px-3 py-2.5 text-left text-sm focus-reset transition-colors hover:border-border-field hover:bg-neutral/50 focus-visible:focus-ring"
    >
      <span className="flex-1 truncate font-medium">
        {getComponentDisplayName(name)}
      </span>
      <span className="font-mono text-[10px] text-fg-muted/70 tabular-nums">
        {count}
      </span>
      <ChevronRightIcon className="size-4 shrink-0 text-fg-muted/60 transition-transform group-hover:translate-x-0.5" />
    </ButtonPrimitives.Button>
  )
}

/* ----------------------------- Single editor ----------------------------- */

export function ComponentEditor({ name }: { name: string }) {
  const { navigate } = useStudio()
  const { designSystem, setComponentParam } = useDesignSystem()

  const item = registryUi.find((i) => i.name === name)
  const group = item?.group as string | undefined
  const siblings = (group ? (groupMembers.get(group) ?? []) : []).filter(
    (i) => i.name !== name,
  )

  return (
    <div className="flex flex-col gap-4">
      {siblings.length > 0 && group && (
        <div className="flex flex-col gap-1.5 rounded-lg border border-primary/20 bg-primary/5 p-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
            <LinkIcon className="size-3.5" />
            Synced with {getGroupDisplayName(group)}
          </div>
          <p className="text-xs text-fg-muted">
            Style changes here also apply to{' '}
            {siblings.map((s, i) => (
              <span key={s.name}>
                {i > 0 && ', '}
                <ButtonPrimitives.Button
                  onPress={() => navigate(`component:${s.name}`)}
                  className="font-medium text-fg underline-offset-2 focus-reset hover:underline"
                >
                  {getComponentDisplayName(s.name)}
                </ButtonPrimitives.Button>
              </span>
            ))}
            .
          </p>
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

export { tweakable as TWEAKABLE_COMPONENTS }
