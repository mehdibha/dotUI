'use client'

import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from 'lucide-react'

import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'

import { useStepAutoplay } from '../autoplay'

const KEYS = ['left', 'center', 'right']

export function ToggleButtonGroupDemo() {
  const { index } = useStepAutoplay(KEYS.length, { dwell: 1100 })
  return (
    <ToggleButtonGroup
      orientation="horizontal"
      selectionMode="single"
      selectedKeys={[KEYS[index]]}
      onSelectionChange={() => {}}
    >
      <ToggleButton id="left" isIconOnly aria-label="Align left">
        <AlignLeftIcon />
      </ToggleButton>
      <ToggleButton id="center" isIconOnly aria-label="Align center">
        <AlignCenterIcon />
      </ToggleButton>
      <ToggleButton id="right" isIconOnly aria-label="Align right">
        <AlignRightIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  )
}
