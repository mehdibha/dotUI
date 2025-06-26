import { Description, FieldError, Label } from "@dotui/ui/components/field";
import { Radio, RadioGroupRoot } from "@dotui/ui/components/radio-group";

export default function Demo() {
  return (
    <RadioGroupRoot defaultValue="sm">
      <Label>Size</Label>
      <Description>Please select a size.</Description>
      <div className="flex gap-2">
        <Radio value="sm">Small</Radio>
        <Radio value="md">Medium</Radio>
        <Radio value="lg">Large</Radio>
      </div>
      <FieldError />
    </RadioGroupRoot>
  );
}
