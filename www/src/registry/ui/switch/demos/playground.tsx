'use client'

import { Label } from '@/registry/ui/field'
import { Switch, SwitchControl, type SwitchProps } from '@/registry/ui/switch'

export default function Demo({
  label = 'Airplane mode',
  size = 'md',
  isDisabled = false,
  isReadOnly = false,
}: {
  label?: string
  size?: SwitchProps['size']
  isDisabled?: boolean
  isReadOnly?: boolean
} = {}) {
  return (
    <Switch size={size} isDisabled={isDisabled} isReadOnly={isReadOnly}>
      <SwitchControl />
      {label && <Label>{label}</Label>}
    </Switch>
  )
}
