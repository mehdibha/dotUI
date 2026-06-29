'use client'

import { useState } from 'react'
import { HeartIcon } from 'lucide-react'

import { ToggleButton } from '@/registry/ui/toggle-button'

export default function Demo() {
  const [isFavorite, setFavorite] = useState(false)
  return (
    <div className="w-full max-w-xs overflow-hidden rounded-lg border">
      <div className="bg-bg-muted flex aspect-video items-center justify-center">
        <span className="text-sm text-fg-muted">Wireless Headphones</span>
      </div>
      <div className="flex items-center justify-between gap-2 p-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">Wireless Headphones</p>
          <p className="text-sm text-fg-muted">$129.00</p>
        </div>
        <ToggleButton
          variant="quiet"
          isIconOnly
          isSelected={isFavorite}
          onChange={setFavorite}
          aria-label="Add to favorites"
        >
          <HeartIcon
            className={isFavorite ? 'fill-current text-danger' : undefined}
          />
        </ToggleButton>
      </div>
    </div>
  )
}
