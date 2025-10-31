import { FieldGroup, Label } from "@dotui/registry/ui/field";
import { Radio, RadioGroup } from "@dotui/registry/ui/radio-group";

export default function Demo() {
  return (
    <div className="flex items-center gap-10">
      <RadioGroup defaultValue="sm">
        <Label>Size</Label>
        <FieldGroup>
          <Radio value="sm">Small</Radio>
          <Radio value="md">Medium</Radio>
          <Radio value="lg">Large</Radio>
        </FieldGroup>
      </RadioGroup>
      <RadioGroup defaultValue="sm" aria-label="Size">
        <FieldGroup>
          <Radio value="sm">Small</Radio>
          <Radio value="md">Medium</Radio>
          <Radio value="lg">Large</Radio>
        </FieldGroup>
      </RadioGroup>
    </div>
  );
}
