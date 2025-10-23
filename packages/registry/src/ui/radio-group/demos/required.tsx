import { Radio, RadioGroup } from "@dotui/registry/ui/radio-group";

export default function Demo() {
  return (
    <RadioGroup defaultValue="sm" label="Size" isRequired>
      <Radio value="sm">Small</Radio>
      <Radio value="lg">Large</Radio>
    </RadioGroup>
  );
}
