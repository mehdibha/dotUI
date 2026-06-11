import { Label } from '@/registry/ui/field'
import { Switch, SwitchControl } from '@/registry/ui/switch'

export default function Demo() {
  return (
    <div className="flex items-center gap-10">
      <Switch isDisabled defaultSelected>
        <SwitchControl />
        <Label>Focus Mode</Label>
      </Switch>
      <Switch isDisabled>
        <SwitchControl />
        <Label>Focus Mode</Label>
      </Switch>
    </div>
  )
}
