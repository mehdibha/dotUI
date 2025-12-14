import { FieldGroup, Label } from "@dotui/registry/ui/field";
import {
  Radio,
  RadioGroup,
  RadioIndicator,
} from "@dotui/registry/ui/radio-group";

export default function Demo() {
  return (
    <div className="flex gap-10">
      <RadioGroup defaultValue="sm" isDisabled>
        <Label>Size</Label>
        <FieldGroup>
          <Radio value="sm">
            <RadioIndicator />
            <Label>Small</Label>
          </Radio>
          <Radio value="md">
            <RadioIndicator />
            <Label>Medium</Label>
          </Radio>
          <Radio value="lg">
            <RadioIndicator />
            <Label>Large</Label>
          </Radio>
        </FieldGroup>
      </RadioGroup>

      <RadioGroup defaultValue="sm">
        <Label>Size</Label>
        <FieldGroup>
          <Radio value="sm">
            <RadioIndicator />
            <Label>Small</Label>
          </Radio>
          <Radio value="md" isDisabled>
            <RadioIndicator />
            <Label>Medium</Label>
          </Radio>
          <Radio value="lg">
            <RadioIndicator />
            <Label>Large</Label>
          </Radio>
        </FieldGroup>
      </RadioGroup>
    </div>
  );
}
