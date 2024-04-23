import { RadioGroup, RadioGroupItem } from "@/lib/components/core/default/radio-group";

export default function RadioGroupDemo() {
  return (
    <RadioGroup required defaultValue="comfortable">
      <RadioGroupItem value="default" id="r1">
        Default
      </RadioGroupItem>
      <RadioGroupItem value="comfortable" id="r2">
        Comfortable
      </RadioGroupItem>
      <RadioGroupItem value="compact" id="r2">
        Compact
      </RadioGroupItem>
    </RadioGroup>
  );
}
