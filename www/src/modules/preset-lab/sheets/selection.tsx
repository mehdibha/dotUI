import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox"
import {
  Description,
  FieldContent,
  FieldGroup,
  Label,
} from "@/registry/ui/field"
import {
  Radio,
  RadioControl,
  RadioGroup,
  RadioIndicator,
} from "@/registry/ui/radio-group"
import { Slider, SliderControl, SliderOutput } from "@/registry/ui/slider"
import { Switch, SwitchControl } from "@/registry/ui/switch"

import { Cell, Sheet } from "./layout"

const PLANS = [
  { id: "hobby", name: "Hobby", description: "Side projects" },
  { id: "pro", name: "Pro", description: "$20 per seat" },
  { id: "enterprise", name: "Enterprise", description: "SSO and SLAs" },
]

export function SelectionSheet() {
  return (
    <Sheet className="grid-cols-3">
      <Cell label="checkbox" className="flex-col items-start">
        <Checkbox>
          <CheckboxControl />
          <Label>Unchecked</Label>
        </Checkbox>
        <Checkbox defaultSelected>
          <CheckboxControl />
          <Label>Checked</Label>
        </Checkbox>
        <Checkbox isIndeterminate>
          <CheckboxControl />
          <Label>Indeterminate</Label>
        </Checkbox>
        <Checkbox isDisabled>
          <CheckboxControl />
          <Label>Disabled</Label>
        </Checkbox>
        <Checkbox isDisabled defaultSelected>
          <CheckboxControl />
          <Label>Disabled checked</Label>
        </Checkbox>
        <Checkbox isInvalid>
          <CheckboxControl />
          <Label>Invalid</Label>
        </Checkbox>
      </Cell>

      <Cell label="radio group">
        <RadioGroup defaultValue="comfortable">
          <Label>Density</Label>
          <FieldGroup>
            <Radio value="compact">
              <RadioControl />
              <Label>Compact</Label>
            </Radio>
            <Radio value="comfortable">
              <RadioControl />
              <Label>Comfortable</Label>
            </Radio>
            <Radio value="spacious" isDisabled>
              <RadioControl />
              <Label>Spacious</Label>
            </Radio>
          </FieldGroup>
        </RadioGroup>
      </Cell>

      <Cell label="switch" className="flex-col items-start">
        <Switch>
          <SwitchControl />
          <Label>Off</Label>
        </Switch>
        <Switch defaultSelected>
          <SwitchControl />
          <Label>On</Label>
        </Switch>
        <Switch isDisabled>
          <SwitchControl />
          <Label>Disabled</Label>
        </Switch>
        <Switch isDisabled defaultSelected>
          <SwitchControl />
          <Label>Disabled on</Label>
        </Switch>
      </Cell>

      <Cell label="slider" className="flex-col items-stretch gap-6">
        <Slider defaultValue={60}>
          <div className="flex items-center justify-between">
            <Label>Volume</Label>
            <SliderOutput />
          </div>
          <SliderControl />
        </Slider>
        <Slider defaultValue={[20, 70]} aria-label="Price range">
          <SliderControl />
        </Slider>
      </Cell>

      <div className="col-span-2">
        <Cell label="choice cards">
          <RadioGroup defaultValue="pro" className="w-full">
            <Label>Plan</Label>
            <FieldGroup className="grid grid-cols-3 gap-3">
              {PLANS.map((plan) => (
                <Radio key={plan.id} value={plan.id}>
                  <RadioControl>
                    <RadioIndicator />
                    <FieldContent>
                      <Label>{plan.name}</Label>
                      <Description>{plan.description}</Description>
                    </FieldContent>
                  </RadioControl>
                </Radio>
              ))}
            </FieldGroup>
          </RadioGroup>
        </Cell>
      </div>
    </Sheet>
  )
}
