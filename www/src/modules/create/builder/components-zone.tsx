'use client'

import { useMemo, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { LinkIcon, SlidersHorizontalIcon } from 'lucide-react'
import { motion } from 'motion/react'

import type { RegistryItem } from '@/registry/types'
import { Badge } from '@/registry/ui/badge'
import { Input } from '@/registry/ui/input'
import { registryUi } from '@/registry/ui/registry'
import { SearchField } from '@/registry/ui/search-field'

import { ExamplesIndex } from '../__generated__/examples'
import {
  ComponentDetailView,
  getComponentDisplayName,
  getGroupDisplayName,
  getSyncedGroup,
} from '../components'
import { useDesignSystem } from '../preset'
import { SummaryValue } from './primitives'
import { SpineRow } from './spine-row'

const routeApi = getRouteApi('/_app/create')

function paramCount(item: RegistryItem): number {
  return item.params ? Object.keys(item.params).length : 0
}

interface GroupedComponents {
  group: string
  label: string
  items: RegistryItem[]
}

const GROUPED: GroupedComponents[] = (() => {
  const byGroup = new Map<string, RegistryItem[]>()
  for (const item of registryUi) {
    if (!item.group) continue
    // Only list components that actually expose builder params — the rest have
    // nothing to tune and would be a wall of disabled rows. Synced-group fan-out
    // still targets the full group, including param-less members.
    if (paramCount(item) === 0) continue
    const list = byGroup.get(item.group) ?? []
    list.push(item)
    byGroup.set(item.group, list)
  }
  return Array.from(byGroup.entries())
    .map(([group, items]) => ({
      group,
      label: getGroupDisplayName(group),
      items: items.sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
})()

export function ComponentsZone({
  openIds,
  onToggle,
}: {
  openIds: Set<string>
  onToggle: (id: string) => void
}) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()

  const groups = useMemo(() => {
    if (!q) return GROUPED
    return GROUPED.map((g) => ({
      ...g,
      items: g.items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          g.label.toLowerCase().includes(q),
      ),
    })).filter((g) => g.items.length > 0)
  }, [q])

  return (
    <div className="flex flex-col gap-2">
      <SearchField
        aria-label="Search components"
        value={query}
        onChange={setQuery}
        className="px-1"
      >
        <Input placeholder="Search components…" />
      </SearchField>

      {groups.map((g) => (
        <div key={g.group} className="flex flex-col">
          <div className="px-3 pt-2 pb-1 text-[10px] font-semibold tracking-widest text-fg-muted/70 uppercase">
            {g.label}
          </div>
          {g.items.map((item) => (
            <ComponentRow
              key={item.name}
              item={item}
              isOpen={openIds.has(`c:${item.name}`)}
              onToggle={() => onToggle(`c:${item.name}`)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function ComponentRow({
  item,
  isOpen,
  onToggle,
}: {
  item: RegistryItem
  isOpen: boolean
  onToggle: () => void
}) {
  const navigate = routeApi.useNavigate()
  const count = paramCount(item)
  const synced = getSyncedGroup(item.name)

  function handleToggle() {
    // Opening a component switches the live preview to it so edits are visible.
    if (!isOpen && item.name in ExamplesIndex) {
      navigate({ search: (prev) => ({ ...prev, preview: item.name }) })
    }
    onToggle()
  }

  return (
    <SpineRow
      id={`c:${item.name}`}
      title={getComponentDisplayName(item.name)}
      isOpen={isOpen}
      onToggle={handleToggle}
      disabled={count === 0}
      binding="live"
      summary={
        <>
          {synced && <LinkIcon className="size-3 text-fg-muted/70" />}
          <SummaryValue>
            <span className="inline-flex items-center gap-1">
              <SlidersHorizontalIcon className="size-3" />
              {count}
            </span>
          </SummaryValue>
        </>
      }
    >
      {synced ? (
        <SyncedGroupEditor componentName={item.name} group={synced} />
      ) : (
        <SingleComponentEditor componentName={item.name} />
      )}
    </SpineRow>
  )
}

function SingleComponentEditor({ componentName }: { componentName: string }) {
  const { designSystem, setComponentParam } = useDesignSystem()
  return (
    <ComponentDetailView
      componentName={componentName}
      selectedParams={designSystem.componentParams[componentName] ?? {}}
      onParamChange={(param, value) =>
        setComponentParam(componentName, param, value)
      }
    />
  )
}

function SyncedGroupEditor({
  componentName,
  group,
}: {
  componentName: string
  group: { group: string; members: RegistryItem[] }
}) {
  const { designSystem, setGroupParam } = useDesignSystem()
  const [pulse, setPulse] = useState(0)

  // Edit the component the user actually opened (it's guaranteed to have params),
  // and fan every change out to all members of its synced group.
  const memberNames = group.members.map((m) => m.name)
  const others = group.members
    .filter((m) => m.name !== componentName)
    .map((m) => getComponentDisplayName(m.name))

  return (
    <div className="flex flex-col gap-3">
      <motion.div
        key={pulse}
        animate={{
          backgroundColor: ['var(--color-primary-muted)', 'transparent'],
        }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-2 rounded-md p-1.5"
      >
        <Badge appearance="subtle" variant="accent" size="sm">
          <LinkIcon />
          Synced group
        </Badge>
        <div className="flex -space-x-1.5">
          {group.members.map((m) => (
            <span
              key={m.name}
              title={getComponentDisplayName(m.name)}
              className="grid size-5 place-items-center rounded-full border border-bg bg-neutral text-[9px] font-semibold text-fg-muted"
            >
              {getComponentDisplayName(m.name).slice(0, 1)}
            </span>
          ))}
        </div>
      </motion.div>

      {others.length > 0 && (
        <p className="text-xs text-fg-muted/70">
          Editing {getComponentDisplayName(componentName)} also updates{' '}
          <span className="text-fg-muted">{others.join(', ')}</span>.
        </p>
      )}

      <ComponentDetailView
        componentName={componentName}
        selectedParams={designSystem.componentParams[componentName] ?? {}}
        onParamChange={(param, value) => {
          setGroupParam(memberNames, param, value)
          setPulse((p) => p + 1)
        }}
      />
    </div>
  )
}
