'use client'

import { PinIcon } from 'lucide-react'

import { ToggleButton } from '@/registry/ui/toggle-button'

import { DemoPress, useToggleAutoplay } from '../autoplay'

export function ToggleButtonDemo() {
  const { selected, pressing } = useToggleAutoplay({ initial: true })
  return (
    <DemoPress pressing={pressing}>
      <ToggleButton
        isIconOnly
        aria-label="Toggle pin"
        isSelected={selected}
        onChange={() => {}}
      >
        <PinIcon className="rotate-45" />
      </ToggleButton>
    </DemoPress>
  )
}
