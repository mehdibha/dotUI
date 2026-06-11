import { Label } from '@/registry/ui/field'
import { Switch, SwitchControl } from '@/registry/ui/switch'

export function SwitchDemo() {
  return (
    <Switch>
      <SwitchControl />
      <Label>Focus mode</Label>
    </Switch>
  )
}
