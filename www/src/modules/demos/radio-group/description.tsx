import { RadioGroup, Radio } from "@/components/dynamic-ui/radio-group";

export default function Demo() {
  return (
    <RadioGroup
      defaultValue="sm"
      label="Size"
      description="Select a product size."
    >
      <Radio value="sm">Small</Radio>
      <Radio value="md">Medium</Radio>
      <Radio value="lg">Large</Radio>
    </RadioGroup>
  );
}
