import { RadioGroup, Radio } from "@/lib/components/core/default/radio";

export default function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="comfortable">
      <Radio value="default" id="r1">
        Default
      </Radio>
      <Radio value="comfortable" id="r2">
        Comfortable
      </Radio>
      <Radio value="compact" id="r2">
        Compact
      </Radio>
    </RadioGroup>
  );
}
