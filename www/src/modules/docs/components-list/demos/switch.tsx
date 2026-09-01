import { Label } from "@/registry/ui/field"
import { Switch, SwitchControl } from "@/registry/ui/switch"

export function SwitchDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Switch defaultSelected>
        <SwitchControl />
        <Label>Notifications</Label>
      </Switch>
      <Switch>
        <SwitchControl />
        <Label>Focus mode</Label>
      </Switch>
    </div>
  )
}
