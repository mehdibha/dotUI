"use client";

import { Badge } from "@dotui/registry-v2/ui/badge";
import { Checkbox } from "@dotui/registry-v2/ui/checkbox";
import {
  Description,
  FieldError,
  FieldGroup,
  Fieldset,
  Label,
  Legend,
} from "@dotui/registry-v2/ui/field";
import { Input, TextArea } from "@dotui/registry-v2/ui/input";
import { Radio, RadioGroup } from "@dotui/registry-v2/ui/radio-group";
import { Separator } from "@dotui/registry-v2/ui/separator";
import { Switch } from "@dotui/registry-v2/ui/switch";
import { TextField } from "@dotui/registry-v2/ui/text-field";

export function FieldDemo() {
  return (
    <div className="grid grid-cols-2 gap-8">
      <Fieldset className="[&_[data-slot=input]]:w-full [&_[data-slot=text-field]]:w-full [&_[data-slot=textarea]]:w-full">
        <FieldGroup>
          <TextField>
            <Label>Name</Label>
            <Description>
              Enter your name so it is long enough to test the layout.
            </Description>
            <Input />
          </TextField>
          <TextField>
            <Label>Mesage</Label>
            <Description>
              Enter your message so it is long enough to test the layout.
            </Description>
            <TextArea />
          </TextField>
          <TextField>
            <Label>Mesage</Label>
            <TextArea />
            <Description>
              Enter your message so it is long enough to test the layout.
            </Description>
          </TextField>
          <TextField>
            <Label className="w-full">
              Name
              <Badge className="ml-auto">Recommended</Badge>
            </Label>
            <Input />
            <Description>
              Enter your name so it is long enough to test the layout.
            </Description>
          </TextField>
          <Separator />
          <Checkbox>I agree to the terms and conditions</Checkbox>
          <Checkbox className="flex-row-reverse justify-between">
            I agree to the terms and conditions
          </Checkbox>
          <Switch>Dark mode</Switch>
          <Switch className="flex-row-reverse justify-between">
            Dark mode
          </Switch>
          <Separator />
          <Checkbox>
            Enable Touch ID and Face ID to make it even faster to unlock your
            device. This is a long label to test the layout.
          </Checkbox>
          <Description className="ml-4">
            Enable Touch ID to quickly unlock your device.
          </Description>
          <Checkbox appearance="card">
            Enable Touch ID to quickly unlock your device.
          </Checkbox>
          <RadioGroup>
            <Radio></Radio>
          </RadioGroup>
        </FieldGroup>
      </Fieldset>

      <Fieldset></Fieldset>
    </div>
  );
}
