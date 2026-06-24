import { Description, Label, Switch, SwitchControl } from 'www'

const stack: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
}

export const Basic = () => (
  <div style={stack}>
    <Switch defaultSelected>
      <SwitchControl />
      <Label>Focus mode</Label>
    </Switch>
    <Switch>
      <SwitchControl />
      <Label>Email notifications</Label>
    </Switch>
  </div>
)

export const WithDescription = () => (
  <Switch defaultSelected style={{ maxWidth: 320 }}>
    <SwitchControl />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Label>Focus mode</Label>
      <Description>Silence notifications so you can stay in flow.</Description>
    </div>
  </Switch>
)

export const Sizes = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
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

export const Disabled = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
    <Switch isDisabled defaultSelected>
      <SwitchControl />
      <Label>Focus mode</Label>
    </Switch>
    <Switch isDisabled>
      <SwitchControl />
      <Label>Focus mode</Label>
    </Switch>
  </div>
)
