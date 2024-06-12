import { RadioGroup, RadioCard } from "@/lib/components/core/default/radio";

export default function Demo() {
  return (
    <RadioGroup defaultValue="pro-trial">
      <RadioCard value="pro-trial" title="Pro trial" />
    </RadioGroup>
  );
}
