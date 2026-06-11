import { Description, FieldContent, Label } from '@/registry/ui/field'
import { Switch, SwitchControl, SwitchIndicator } from '@/registry/ui/switch'

export default function Demo() {
  return (
    <Switch className="w-full">
      <SwitchControl>
        <FieldContent>
          <Label>Focus mode</Label>
          <Description>
            Silence notifications so you can stay in flow.
          </Description>
        </FieldContent>
        <SwitchIndicator />
      </SwitchControl>
    </Switch>
  )
}
