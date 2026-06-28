import {
  Checkbox,
  CheckboxControl,
  CheckboxIndicator,
} from '@/registry/ui/checkbox'
import {
  Description,
  FieldContent,
  Fieldset,
  Label,
  Legend,
} from '@/registry/ui/field'

export default function Demo() {
  return (
    <Fieldset className="w-full max-w-sm">
      <Legend>Before you continue</Legend>
      <Checkbox className="w-full">
        <CheckboxControl>
          <CheckboxIndicator />
          <FieldContent>
            <Label>Terms of Service</Label>
            <Description>I have read and agree to the terms.</Description>
          </FieldContent>
        </CheckboxControl>
      </Checkbox>
      <Checkbox className="w-full">
        <CheckboxControl>
          <CheckboxIndicator />
          <FieldContent>
            <Label>Privacy Policy</Label>
            <Description>I consent to how my data is handled.</Description>
          </FieldContent>
        </CheckboxControl>
      </Checkbox>
      <Checkbox className="w-full" defaultSelected>
        <CheckboxControl>
          <CheckboxIndicator />
          <FieldContent>
            <Label>Marketing emails</Label>
            <Description>Send me product updates and offers.</Description>
          </FieldContent>
        </CheckboxControl>
      </Checkbox>
    </Fieldset>
  )
}
