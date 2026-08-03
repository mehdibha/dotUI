import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from 'lucide-react'

import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'

export function ToggleButtonGroupDemo() {
  return (
    <ToggleButtonGroup
      orientation="horizontal"
      selectionMode="single"
      defaultSelectedKeys={['left']}
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
