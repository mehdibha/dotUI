import { Switch, SwitchControl } from "@/registry/ui/switch"

export function SwitchDemo() {
  return (
    <div className="flex items-center gap-4">
      <Switch defaultSelected aria-label="On">
        <SwitchControl />
      </Switch>
      <Switch aria-label="Off">
        <SwitchControl />
      </Switch>
    </div>
  )
}
