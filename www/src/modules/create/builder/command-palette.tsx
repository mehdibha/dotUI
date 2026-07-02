'use client'

import { useEffect, useMemo } from 'react'
import type { Key } from 'react-aria-components/Menu'

import {
  Command,
  CommandContent,
  CommandInput,
  CommandItem,
  CommandSection,
  CommandSectionHeader,
} from '@/registry/ui/command'
import { DialogContent } from '@/registry/ui/dialog'
import { Input } from '@/registry/ui/input'
import { Modal } from '@/registry/ui/modal'
import { registryUi } from '@/registry/ui/registry'

import { getGroupDisplayName } from '../components'
import type { Drill } from './use-builder-ui'
import { useBuilderUi } from './use-builder-ui'

interface Entry {
  id: string
  label: string
  keywords: string
  card: string
  drill?: Drill
}

const CARD_ENTRIES: Entry[] = [
  {
    id: 'brand',
    label: 'Brand color',
    keywords: 'accent primary hue seed brand',
    card: 'brand',
  },
  {
    id: 'color',
    label: 'Color system',
    keywords: 'palette ramp swatch base neutral status',
    card: 'color',
  },
  {
    id: 'color-lab',
    label: 'Color lab — ramps, contrast & tuning',
    keywords: 'algorithm oklch tailwind material wcag apca knobs chroma',
    card: 'color',
    drill: { kind: 'color' },
  },
  {
    id: 'foundation',
    label: 'Foundation — palettes or flat',
    keywords: 'tonal flat semantic foundation',
    card: 'color',
  },
  {
    id: 'typography',
    label: 'Typography — fonts & scale',
    keywords: 'font heading body size ratio type',
    card: 'typography',
  },
  {
    id: 'shape',
    label: 'Shape — radius & corners',
    keywords: 'rounding corner radius border',
    card: 'shape',
  },
  {
    id: 'density',
    label: 'Density & spacing',
    keywords: 'compact comfortable cozy padding gap scale',
    card: 'density',
  },
  {
    id: 'elevation',
    label: 'Elevation & shadows',
    keywords: 'shadow glass depth flat blur translucent',
    card: 'elevation',
  },
  {
    id: 'motion',
    label: 'Motion & animation',
    keywords: 'duration transition speed reduced animation',
    card: 'motion',
  },
  {
    id: 'interaction',
    label: 'Interaction — cursors & focus',
    keywords: 'cursor pointer focus ring',
    card: 'interaction',
  },
  {
    id: 'icons',
    label: 'Icons — library & stroke',
    keywords: 'lucide icon stroke',
    card: 'icons',
  },
  {
    id: 'modes',
    label: 'Default mode',
    keywords: 'dark light auto theme',
    card: 'modes',
  },
]

export function CommandPalette() {
  const { cmdkOpen, setCmdkOpen, flashCard, setDrill } = useBuilderUi()

  // ⌘K / Ctrl+K to open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCmdkOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setCmdkOpen])

  const groupEntries = useMemo<Entry[]>(() => {
    const groups = new Set<string>()
    for (const item of registryUi) {
      if (item.group && item.params && Object.keys(item.params).length > 0) {
        groups.add(item.group)
      }
    }
    return Array.from(groups)
      .sort()
      .map((g) => ({
        id: `component:${g}`,
        label: getGroupDisplayName(g),
        keywords: `component ${g}`,
        card: 'components',
        drill: { kind: 'component', group: g } as Drill,
      }))
  }, [])

  const byId = useMemo(() => {
    const map = new Map<string, Entry>()
    for (const e of [...CARD_ENTRIES, ...groupEntries]) map.set(e.id, e)
    return map
  }, [groupEntries])

  function run(key: Key) {
    const entry = byId.get(String(key))
    if (!entry) return
    setCmdkOpen(false)
    if (entry.drill) setDrill(entry.drill)
    flashCard(entry.card)
  }

  return (
    <Modal
      isOpen={cmdkOpen}
      onOpenChange={setCmdkOpen}
      className="w-[min(34rem,92vw)] overflow-hidden p-0"
    >
      <DialogContent aria-label="Search controls" className="gap-0 p-0">
        <Command>
          <div className="border-b p-2">
            <CommandInput
              autoFocus
              aria-label="Search every control"
              className="w-full"
            >
              <Input placeholder="Search every control…" className="w-full" />
            </CommandInput>
          </div>
          <CommandContent
            onAction={run}
            className="max-h-[min(24rem,60vh)] overflow-y-auto p-1.5"
          >
            <CommandSection>
              <CommandSectionHeader>Foundations</CommandSectionHeader>
              {CARD_ENTRIES.map((e) => (
                <CommandItem
                  key={e.id}
                  id={e.id}
                  textValue={`${e.label} ${e.keywords}`}
                >
                  <span className="truncate">{e.label}</span>
                </CommandItem>
              ))}
            </CommandSection>
            <CommandSection>
              <CommandSectionHeader>Components</CommandSectionHeader>
              {groupEntries.map((e) => (
                <CommandItem
                  key={e.id}
                  id={e.id}
                  textValue={`${e.label} ${e.keywords}`}
                >
                  <span className="truncate">{e.label}</span>
                </CommandItem>
              ))}
            </CommandSection>
          </CommandContent>
        </Command>
      </DialogContent>
    </Modal>
  )
}
