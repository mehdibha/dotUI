import { RadioGroup, RadioCard } from "@/lib/components/core/default/radio";

export default function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="comfortable">
      <RadioCard value="default" title="Default" description="Some default description" />
      <RadioCard
        value="comfortable"
        title="Comfortable"
        description="Some comfortable description"
      />
      <RadioCard value="compact" title="Default" description="Some compact description" />
    </RadioGroup>
  );
}
