'use client'

import { useLocation } from '@tanstack/react-router'
import { SlidersHorizontalIcon } from 'lucide-react'
import type { Key } from 'react-aria-components'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/registry/ui/select'

import {
  setSelectorPlacement,
  useSelectorPlacement,
  type SelectorPlacement,
} from './store'

const PLACEMENT_LABELS: Record<SelectorPlacement, string> = {
  each: 'On each demo',
  page: 'Once per page',
  header: 'In site header',
}

/**
 * Temporary tweaker: a floating control to flip where the preset selector shows
 * (each demo / page header / site header) while we decide the final placement.
 * Once chosen, hardcode the winning placement and delete this.
 */
export function PresetSelectorPlacementTweaker() {
  const placement = useSelectorPlacement()
  const { pathname } = useLocation()

  // Only meaningful where themed previews render (docs demos, the gallery).
  if (!pathname.startsWith('/docs') && !pathname.startsWith('/components')) {
    return null
  }

  return (
    <div className="fixed right-5 bottom-5 z-50 flex h-10 items-center gap-2 rounded-full border bg-card pr-1.5 pl-3.5 text-sm shadow-lg">
      <SlidersHorizontalIcon className="size-4 text-fg-muted" />
      <span className="text-fg-muted max-sm:hidden">Preset selector</span>
      <Select
        aria-label="Preset selector placement"
        selectedKey={placement}
        onSelectionChange={(key: Key | null) => {
          if (key != null) setSelectorPlacement(key as SelectorPlacement)
        }}
      >
        <SelectTrigger size="sm" variant="default" className="gap-1.5" />
        <SelectContent placement="top end">
          {(Object.keys(PLACEMENT_LABELS) as SelectorPlacement[]).map((p) => (
            <SelectItem key={p} id={p}>
              {PLACEMENT_LABELS[p]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
