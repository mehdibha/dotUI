'use client'

import * as React from 'react'

import { MapPicker } from '@/registry/ui/map-picker'
import type { LatLng } from '@/registry/ui/map-picker'

// San Francisco
const INITIAL: LatLng = { lat: 37.7749, lng: -122.4194 }

export default function Demo() {
  const [location, setLocation] = React.useState<LatLng>(INITIAL)

  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <MapPicker defaultValue={INITIAL} zoom={12} onChange={setLocation} />
      <p className="text-sm text-fg-muted">
        Selected: <span className="font-mono">{location.lat.toFixed(4)}</span>,{' '}
        <span className="font-mono">{location.lng.toFixed(4)}</span>
      </p>
    </div>
  )
}
