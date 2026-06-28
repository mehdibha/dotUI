import {
  Description,
  FieldContent,
  FieldGroup,
  Label,
} from '@/registry/ui/field'
import {
  Radio,
  RadioControl,
  RadioGroup,
  RadioIndicator,
} from '@/registry/ui/radio-group'

export default function Demo() {
  return (
    <RadioGroup defaultValue="pro" className="w-full max-w-xs">
      <Label>Subscription plan</Label>
      <FieldGroup>
        <Radio value="starter">
          <RadioControl>
            <RadioIndicator />
            <FieldContent>
              <Label>Starter · $0/mo</Label>
              <Description>1 project, community support</Description>
            </FieldContent>
          </RadioControl>
        </Radio>
        <Radio value="pro">
          <RadioControl>
            <RadioIndicator />
            <FieldContent>
              <Label>Pro · $12/mo</Label>
              <Description>Unlimited projects, priority support</Description>
            </FieldContent>
          </RadioControl>
        </Radio>
        <Radio value="team">
          <RadioControl>
            <RadioIndicator />
            <FieldContent>
              <Label>Team · $49/mo</Label>
              <Description>Everything in Pro, plus SSO and roles</Description>
            </FieldContent>
          </RadioControl>
        </Radio>
      </FieldGroup>
    </RadioGroup>
  )
}
