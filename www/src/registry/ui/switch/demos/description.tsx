import { Description, Label } from '@/registry/ui/field'
import { Switch, SwitchControl } from '@/registry/ui/switch'

export default function Demo() {
  return (
    <Switch defaultSelected>
      <SwitchControl />
      <div className="flex flex-col gap-1">
        <Label>Focus mode</Label>
        <Description>
          Silence notifications so you can stay in flow.
        </Description>
      </div>
    </Switch>
  )
}
