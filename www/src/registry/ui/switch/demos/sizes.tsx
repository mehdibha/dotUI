import { Switch, SwitchControl } from '@/registry/ui/switch'

export default function Demo() {
  return (
    <div className="flex items-center gap-4">
      <Switch size="sm" defaultSelected>
        <SwitchControl />
      </Switch>
      <Switch size="md" defaultSelected>
        <SwitchControl />
      </Switch>
      <Switch size="lg" defaultSelected>
        <SwitchControl />
      </Switch>
    </div>
  )
}
