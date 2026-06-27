'use client'

import { type ReactNode, useMemo, useState } from 'react'
import {
  BoxSelectIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  LinkIcon,
} from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import type { RegistryItem } from '@/registry/types'
import { Button } from '@/registry/ui/button'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { registryUi } from '@/registry/ui/registry'
import { Select, SelectValue } from '@/registry/ui/select'

import {
  ComponentDetailView,
  getComponentDisplayName,
  getGroupDisplayName,
} from '../components'
import { useDesignSystem } from '../preset'
import { AspectCard, EASE_OUT, Readout } from './atoms'
import { useBuilderUi } from './use-builder-ui'

/* ------------------------------ data helpers ----------------------------- */

function paramCount(item: RegistryItem): number {
  return item.params ? Object.keys(item.params).length : 0
}

interface Group {
  id: string
  members: RegistryItem[]
}

/** Synced groups that actually have something to tweak, in display order. */
function useGroups(): Group[] {
  return useMemo(() => {
    const byGroup = new Map<string, RegistryItem[]>()
    for (const item of registryUi) {
      if (!item.group || paramCount(item) === 0) continue
      const list = byGroup.get(item.group) ?? []
      list.push(item)
      byGroup.set(item.group, list)
    }
    return Array.from(byGroup.entries())
      .map(([id, members]) => ({
        id,
        members: members.sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.id.localeCompare(b.id))
  }, [])
}

/* ------------------------------ Components card --------------------------- */

export function ComponentsCard() {
  const groups = useGroups()
  const { designSystem } = useDesignSystem()
  const { setDrill } = useBuilderUi()

  const editedGroups = groups.filter((g) =>
    g.members.some((m) => {
      const edits = designSystem.componentParams[m.name]
      if (!edits || !m.params) return false
      return Object.entries(edits).some(([k, v]) => {
        const def = m.params?.[k]
        return def != null && v !== def.default
      })
    }),
  ).length

  return (
    <AspectCard
      id="components"
      icon={BoxSelectIcon}
      title="Components"
      readout={
        <Readout
          value={
            editedGroups > 0
              ? `${editedGroups} edited · ${groups.length} groups`
              : `${groups.length} groups`
          }
        />
      }
    >
      <div className="flex flex-col gap-2">
        <p className="px-0.5 text-xs text-fg-muted">
          Components are grouped — members of a group share one style and stay
          in sync. Pick a group to tune it.
        </p>
        <div className="flex flex-col gap-1.5">
          {groups.map((g) => {
            const edited = g.members.some(
              (m) => designSystem.componentParams[m.name],
            )
            return (
              <ButtonPrimitives.Button
                key={g.id}
                onPress={() => setDrill({ kind: 'component', group: g.id })}
                className="group flex items-center gap-2 rounded-lg border bg-neutral/40 px-3 py-2.5 text-left focus-reset transition-[colors,transform] hover:bg-neutral focus-visible:focus-ring active:scale-[0.99]"
              >
                <div className="flex flex-1 flex-col">
                  <span className="text-[13px] font-medium text-fg">
                    {getGroupDisplayName(g.id)}
                  </span>
                  <span className="text-xs text-fg-muted">
                    {g.members.length}{' '}
                    {g.members.length === 1 ? 'component' : 'components'}
                  </span>
                </div>
                {edited && (
                  <span
                    className="size-1.5 rounded-full bg-primary"
                    aria-label="Edited"
                  />
                )}
                <ChevronRightIcon className="size-4 text-fg-muted transition-transform group-hover:translate-x-0.5" />
              </ButtonPrimitives.Button>
            )
          })}
        </div>
      </div>
    </AspectCard>
  )
}

/* --------------------------- Component anatomy drill --------------------- */

/**
 * Enum params shared by ≥2 members of the group — the levers that fan out as one.
 * Fan-out only touches members that actually declare the key, so it never
 * mis-writes a param a component doesn't understand.
 */
function sharedEnumParams(members: RegistryItem[]): string[] {
  if (members.length < 2) return []
  const counts = new Map<string, number>()
  for (const m of members) {
    if (!m.params) continue
    for (const [key, def] of Object.entries(m.params)) {
      if (def.kind === 'enum') counts.set(key, (counts.get(key) ?? 0) + 1)
    }
  }
  return Array.from(counts.entries())
    .filter(([, n]) => n >= 2)
    .map(([key]) => key)
}

export function ComponentAnatomy({ group }: { group: string }) {
  const groups = useGroups()
  const { designSystem, setComponentParam, setDesignSystem } = useDesignSystem()
  const members = groups.find((g) => g.id === group)?.members ?? []
  const shared = useMemo(() => sharedEnumParams(members), [members])
  const firstMember = members[0]
  const [openMember, setOpenMember] = useState<string | null>(
    firstMember?.name ?? null,
  )

  // A shared param writes to every member that declares it, in one transaction
  // (one undo entry) so the group truly moves together.
  function setShared(param: string, value: string) {
    setDesignSystem((prev) => {
      const next = { ...prev.componentParams }
      for (const m of members) {
        if (m.params?.[param]) {
          next[m.name] = { ...(next[m.name] ?? {}), [param]: value }
        }
      }
      return { ...prev, componentParams: next }
    })
  }

  if (members.length === 0) {
    return <p className="text-sm text-fg-muted">No components in this group.</p>
  }

  return (
    <div className="flex flex-col gap-6">
      {shared.length > 0 && (
        <div className="flex flex-col gap-3 rounded-lg border border-primary/30 bg-primary/[0.04] p-3">
          <div className="flex items-center gap-1.5">
            <LinkIcon className="size-3.5 text-primary" />
            <span className="text-[13px] font-medium text-fg">
              Shared style
            </span>
          </div>
          {shared.map((param) => {
            // Only members that declare this enum key participate in the fan-out.
            const targets = members.filter(
              (m) => m.params?.[param]?.kind === 'enum',
            )
            const lead = targets[0]
            const def = lead?.params?.[param]
            if (!lead || !def || def.kind !== 'enum') return null
            // The targets move together — read the value off the first of them.
            const current =
              designSystem.componentParams[lead.name]?.[param] ?? def.default
            return (
              <div key={param} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-fg-muted capitalize">
                    {param}
                  </span>
                  <span className="text-[10px] text-fg-muted/70">
                    applies to {targets.length}
                  </span>
                </div>
                <Select
                  aria-label={`Shared ${param}`}
                  selectedKey={current}
                  onSelectionChange={(key) => setShared(param, key as string)}
                >
                  <Button size="sm" className="w-full">
                    <SelectValue />
                    <ChevronDownIcon data-icon-end="" />
                  </Button>
                  <Popover>
                    <ListBox>
                      {def.values.map((v) => (
                        <ListBoxItem key={v} id={v} className="capitalize">
                          {v.replace(/-/g, ' ')}
                        </ListBoxItem>
                      ))}
                    </ListBox>
                  </Popover>
                </Select>
              </div>
            )
          })}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <span className="px-0.5 text-[11px] font-semibold tracking-wider text-fg-muted uppercase">
          Per component
        </span>
        {members.map((m) => (
          <MemberDisclosure
            key={m.name}
            open={openMember === m.name}
            onToggle={() =>
              setOpenMember((cur) => (cur === m.name ? null : m.name))
            }
            title={getComponentDisplayName(m.name)}
            count={paramCount(m)}
          >
            <ComponentDetailView
              componentName={m.name}
              selectedParams={designSystem.componentParams[m.name] ?? {}}
              onParamChange={(param, value) =>
                setComponentParam(m.name, param, value)
              }
            />
          </MemberDisclosure>
        ))}
      </div>
    </div>
  )
}

function MemberDisclosure({
  open,
  onToggle,
  title,
  count,
  children,
}: {
  open: boolean
  onToggle: () => void
  title: string
  count: number
  children: ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <ButtonPrimitives.Button
        onPress={onToggle}
        aria-expanded={open}
        className={cn(
          'flex w-full items-center gap-2 px-3 py-2.5 text-left focus-reset transition-colors hover:bg-neutral/50 focus-visible:focus-ring',
          open && 'border-b bg-neutral/30',
        )}
      >
        <span className="flex-1 text-[13px] font-medium text-fg">{title}</span>
        <span className="font-mono text-[10px] text-fg-muted tabular-nums">
          {count}
        </span>
        <ChevronDownIcon
          className={cn(
            'size-4 text-fg-muted transition-transform duration-300',
            open && 'rotate-180',
          )}
          style={{ transitionTimingFunction: EASE_OUT }}
        />
      </ButtonPrimitives.Button>
      <div
        className="grid transition-[grid-template-rows] duration-300"
        style={{
          gridTemplateRows: open ? '1fr' : '0fr',
          transitionTimingFunction: EASE_OUT,
        }}
      >
        <div className="overflow-hidden">
          <div className="p-3">{children}</div>
        </div>
      </div>
    </div>
  )
}
