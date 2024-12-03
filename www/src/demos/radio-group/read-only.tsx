import { RadioGroup, Radio } from "@/components/dynamic-core/radio-group";

export default function Demo() {
  return (
    <RadioGroup defaultValue="sm" label="Size" isReadOnly>
      <Radio value="sm">Small</Radio>
      <Radio value="md">Medium</Radio>
      <Radio value="lg">Large</Radio>
    </RadioGroup>
  );
}
