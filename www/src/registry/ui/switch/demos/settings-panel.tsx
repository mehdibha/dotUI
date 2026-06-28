import { Button } from '@/registry/ui/button'
import { Description, FieldContent, Label } from '@/registry/ui/field'
import { Switch, SwitchControl, SwitchIndicator } from '@/registry/ui/switch'

const settings = [
  {
    label: 'Email digest',
    description: 'Receive a weekly summary of your activity.',
    defaultSelected: true,
  },
  {
    label: 'Two-factor auth',
    description: 'Require a code at sign-in for extra security.',
    defaultSelected: true,
  },
  {
    label: 'Public profile',
    description: 'Let anyone view your profile and activity.',
    defaultSelected: false,
  },
]

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-3">
        {settings.map((setting) => (
          <Switch
            key={setting.label}
            className="w-full"
            defaultSelected={setting.defaultSelected}
          >
            <SwitchControl>
              <FieldContent>
                <Label>{setting.label}</Label>
                <Description>{setting.description}</Description>
              </FieldContent>
              <SwitchIndicator />
            </SwitchControl>
          </Switch>
        ))}
      </div>
      <Button variant="primary" size="sm" className="w-full">
        Save preferences
      </Button>
    </div>
  )
}
