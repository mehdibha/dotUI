import { Label } from '@/registry/ui/field'
import { Switch, SwitchControl } from '@/registry/ui/switch'

export function SwitchDemo() {
  return (
    <Switch defaultSelected>
      <SwitchControl />
      <Label>Focus mode</Label>
    </Switch>
  )
}
