'use client'

import { useState } from 'react'
import { LayoutGridIcon, ListIcon } from 'lucide-react'

import { ToggleButton } from '@/registry/ui/toggle-button'

type View = 'list' | 'grid'

export default function Demo() {
  const [view, setView] = useState<View>('grid')
  return (
    <div className="flex items-center gap-1 rounded-lg border p-1">
      <ToggleButton
        variant="quiet"
        isIconOnly
        isSelected={view === 'list'}
        onChange={() => setView('list')}
        aria-label="List view"
      >
        <ListIcon />
      </ToggleButton>
      <ToggleButton
        variant="quiet"
        isIconOnly
        isSelected={view === 'grid'}
        onChange={() => setView('grid')}
        aria-label="Grid view"
      >
        <LayoutGridIcon />
      </ToggleButton>
    </div>
  )
}
