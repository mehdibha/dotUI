import {
  Checkbox,
  CheckboxControl,
  CheckboxIndicator,
} from '@/registry/ui/checkbox'
import { Description, FieldContent, Label } from '@/registry/ui/field'

const preferences = [
  {
    id: 'updates',
    label: 'Product updates',
    description: 'Get notified about new features.',
    defaultSelected: true,
  },
  {
    id: 'security',
    label: 'Security alerts',
    description: 'Important account activity.',
    defaultSelected: true,
  },
  {
    id: 'newsletter',
    label: 'Weekly newsletter',
    description: 'A digest of tips and news.',
    defaultSelected: false,
  },
]

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-1">
      {preferences.map((pref) => (
        <Checkbox
          key={pref.id}
          defaultSelected={pref.defaultSelected}
          className="w-full rounded-md p-2 hover:bg-muted"
        >
          <CheckboxControl>
            <CheckboxIndicator />
            <FieldContent>
              <Label>{pref.label}</Label>
              <Description>{pref.description}</Description>
            </FieldContent>
          </CheckboxControl>
        </Checkbox>
      ))}
    </div>
  )
}
