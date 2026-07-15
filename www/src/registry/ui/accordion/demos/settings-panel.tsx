import { Accordion } from '@/registry/ui/accordion'
import {
  Disclosure,
  DisclosurePanel,
  DisclosureTrigger,
} from '@/registry/ui/disclosure'
import { Description, FieldContent, Label } from '@/registry/ui/field'
import { Switch, SwitchControl, SwitchIndicator } from '@/registry/ui/switch'

const sections = [
  {
    name: 'Notifications',
    settings: [
      {
        label: 'Email digests',
        description: 'A weekly summary of your activity.',
        defaultSelected: true,
      },
      {
        label: 'Push notifications',
        description: 'Alerts on your devices in real time.',
        defaultSelected: false,
      },
    ],
  },
  {
    name: 'Privacy',
    settings: [
      {
        label: 'Public profile',
        description: 'Let anyone view your profile page.',
        defaultSelected: false,
      },
      {
        label: 'Show activity status',
        description: 'Display when you were last online.',
        defaultSelected: true,
      },
    ],
  },
]

export default function Demo() {
  return (
    <Accordion
      className="w-full max-w-xs"
      defaultExpandedKeys={['Notifications']}
    >
      {sections.map((section) => (
        <Disclosure key={section.name} id={section.name}>
          <DisclosureTrigger>{section.name}</DisclosureTrigger>
          <DisclosurePanel>
            <div className="flex flex-col gap-4">
              {section.settings.map((setting) => (
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
          </DisclosurePanel>
        </Disclosure>
      ))}
    </Accordion>
  )
}
