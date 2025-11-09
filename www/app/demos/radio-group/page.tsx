import { FieldGroup, Label } from "@dotui/registry/ui/field";
import {
  Radio,
  RadioGroup,
  RadioIndicator,
} from "@dotui/registry/ui/radio-group";

export default function Page() {
  return (
    <RadioGroup defaultValue="sm">
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
  );
}
