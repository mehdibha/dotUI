import { Label } from '@/registry/ui/field'
import {
  Switch,
  SwitchControl,
  SwitchIndicator,
  SwitchThumb,
} from '@/registry/ui/switch'

export default function Demo() {
  return (
    <Switch>
      <SwitchControl>
        <SwitchIndicator>
          <SwitchThumb />
        </SwitchIndicator>
      </SwitchControl>
      <Label>Focus mode</Label>
    </Switch>
  )
}
