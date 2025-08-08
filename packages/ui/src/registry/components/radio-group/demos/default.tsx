import { Radio, RadioGroup } from "@dotui/ui/components/radio-group";

export default function Demo() {
  return (
    <RadioGroup defaultValue="sm" label="Size">
      <Radio value="sm">Small</Radio>
      <Radio value="md">Medium</Radio>
      <Radio value="lg">Large</Radio>
    </RadioGroup>
  );
}
