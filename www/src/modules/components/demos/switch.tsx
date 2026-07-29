'use client'

import { Label } from '@/registry/ui/field'
import { Switch, SwitchControl } from '@/registry/ui/switch'

import { DemoPress, useToggleAutoplay } from '../autoplay'

export function SwitchDemo() {
  const { selected, pressing } = useToggleAutoplay()
  return (
    <Switch isSelected={selected} onChange={() => {}}>
      <DemoPress pressing={pressing}>
        <SwitchControl />
      </DemoPress>
      <Label>Focus mode</Label>
    </Switch>
  )
}
