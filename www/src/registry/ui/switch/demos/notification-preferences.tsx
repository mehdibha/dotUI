import {
  Description,
  FieldContent,
  Fieldset,
  Label,
  Legend,
} from '@/registry/ui/field'
import { Switch, SwitchControl, SwitchIndicator } from '@/registry/ui/switch'

const channels = [
  {
    label: 'Email',
    description: 'Updates sent to your inbox.',
    defaultSelected: true,
  },
  {
    label: 'Push',
    description: 'Alerts on your devices.',
    defaultSelected: true,
  },
  {
    label: 'SMS',
    description: 'Text messages for urgent items.',
    defaultSelected: false,
  },
]

export default function Demo() {
  return (
    <Fieldset className="w-full max-w-sm">
      <Legend>Notifications</Legend>
      <div className="flex flex-col gap-3">
        {channels.map((channel) => (
          <Switch
            key={channel.label}
            className="w-full"
            defaultSelected={channel.defaultSelected}
          >
            <SwitchControl>
              <FieldContent>
                <Label>{channel.label}</Label>
                <Description>{channel.description}</Description>
              </FieldContent>
              <SwitchIndicator />
            </SwitchControl>
          </Switch>
        ))}
      </div>
    </Fieldset>
  )
}
